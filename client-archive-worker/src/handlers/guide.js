import { verifyAccessCookie } from '../services/crypto.js';
import { getCookie } from '../services/http.js';

/**
 * Multi-file guides served from R2 under guides/<slug>/, behind the same
 * per-client access cookie as the board and artifacts. Unlike an artifact
 * (one self-contained HTML file, framed inside the field's reader), a guide
 * is a folder of pages, stylesheets, images and films that link to each
 * other relatively, so it gets its own URL prefix: /clients/guide/<slug>/.
 *
 * Every file is checked here - there is no unauthenticated path to any
 * guide object, and the bucket itself is never exposed.
 */

// Clients with a guide uploaded to guides/<slug>/. Anything else is a 404,
// even with a valid cookie for that client.
const GUIDE_CLIENTS = new Set(['full-charge']);

const CONTENT_TYPES = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  woff2: 'font/woff2',
  mp4: 'video/mp4',
  ico: 'image/x-icon',
  txt: 'text/plain; charset=utf-8',
};

function baseHeaders() {
  const headers = new Headers();
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('X-Content-Type-Options', 'nosniff');
  return headers;
}

function plain(status, text, extra = {}) {
  const headers = baseHeaders();
  headers.set('Content-Type', 'text/plain; charset=utf-8');
  headers.set('Cache-Control', 'private, no-store');
  for (const [k, v] of Object.entries(extra)) headers.set(k, v);
  return new Response(text, { status, headers });
}

/**
 * The path after /clients/guide/<slug>/ as an R2-safe relative key, or
 * null if it must be refused. The URL parser has already collapsed literal
 * and %2e dot segments, so what's left to catch is anything that decodes
 * into one: %2f / %5c separators, NUL, a leading slash, or "." / ".."
 * segments.
 */
function toRelativeKey(rawRest) {
  let rel;
  try {
    rel = decodeURIComponent(rawRest);
  } catch {
    return null;
  }
  if (rel.includes('\\') || rel.includes('\0') || rel.includes('%') || rel.startsWith('/')) return null;
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  const segments = rel.split('/');
  if (segments.some((s) => s === '' || s === '.' || s === '..')) return null;
  return rel;
}

/**
 * Single "bytes=a-b", "bytes=a-" or "bytes=-n" range against a known size.
 * Returns { offset, length }, 'unsatisfiable', or null (no usable Range
 * header - multi-range and malformed headers fall back to a full 200, which
 * RFC 9110 allows).
 */
function parseRange(header, size) {
  if (!header) return null;
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m || (m[1] === '' && m[2] === '')) return null;
  let start, end;
  if (m[1] === '') {
    const suffix = parseInt(m[2], 10);
    if (suffix === 0) return 'unsatisfiable';
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = parseInt(m[1], 10);
    end = m[2] === '' ? size - 1 : Math.min(parseInt(m[2], 10), size - 1);
    if (start >= size || end < start) return 'unsatisfiable';
  }
  return { offset: start, length: end - start + 1 };
}

export async function handleGuide(request, env, clientId, rawRest) {
  if (!GUIDE_CLIENTS.has(clientId)) {
    return plain(404, 'Not found');
  }

  const url = new URL(request.url);
  const cookieValue = getCookie(request, `tuku_access_${clientId}`);
  const verified = await verifyAccessCookie(cookieValue, clientId, env.COOKIE_SECRET);
  if (!verified) {
    // A page load (top-level or inside the guide's own frame) goes to the
    // client's gate, which sends the visitor back here after unlock. A film,
    // stylesheet or script gets a bare 401 - never a redirect to an HTML
    // page it can't use, and never content.
    const accept = request.headers.get('Accept') || '';
    if (accept.includes('text/html')) {
      const next = encodeURIComponent(url.pathname + url.search);
      return plain(302, 'Locked', { Location: `/clients/${clientId}/?next=${next}` });
    }
    return plain(401, 'Unauthorized');
  }

  // /clients/guide/<slug> without the trailing slash would resolve every
  // relative link in the guide one level too high.
  if (rawRest === undefined) {
    return plain(301, 'Moved', { Location: `/clients/guide/${clientId}/${url.search}` });
  }

  const rel = toRelativeKey(rawRest.slice(1));
  if (!rel) {
    return plain(400, 'Bad request');
  }
  const ext = rel.slice(rel.lastIndexOf('.') + 1).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!rel.includes('.') || !contentType) {
    return plain(404, 'Not found');
  }

  const key = `guides/${clientId}/${rel}`;
  const meta = await env.ARTIFACTS.head(key);
  if (!meta) {
    return plain(404, 'Not found');
  }

  const headers = baseHeaders();
  headers.set('Content-Type', contentType);
  headers.set('Cache-Control', ext === 'html' ? 'private, no-store' : 'private, max-age=3600');
  headers.set('Accept-Ranges', 'bytes');
  headers.set('ETag', meta.httpEtag);

  const range = parseRange(request.headers.get('Range'), meta.size);
  if (range === 'unsatisfiable') {
    headers.set('Content-Range', `bytes */${meta.size}`);
    return new Response(null, { status: 416, headers });
  }

  const isHead = request.method === 'HEAD';
  if (range) {
    headers.set('Content-Range', `bytes ${range.offset}-${range.offset + range.length - 1}/${meta.size}`);
    headers.set('Content-Length', String(range.length));
    if (isHead) return new Response(null, { status: 206, headers });
    const object = await env.ARTIFACTS.get(key, { range });
    if (!object) return plain(404, 'Not found');
    return new Response(object.body, { status: 206, headers });
  }

  headers.set('Content-Length', String(meta.size));
  if (isHead) return new Response(null, { status: 200, headers });
  const object = await env.ARTIFACTS.get(key);
  if (!object) return plain(404, 'Not found');
  return new Response(object.body, { status: 200, headers });
}
