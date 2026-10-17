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

// Clients with a guide uploaded to guides/<slug>/, and the public link
// preview a signed-out page load shows (see lockedPage). Anything else is a
// 404, even with a valid cookie for that client. The image lives on the
// public static site, never in R2: crawlers can't send the cookie.
const GUIDES = {
  'full-charge': {
    title: 'Full Charge · On-site guide',
    description: 'Oct 19 to 21 · From today to tomorrow',
    image: '/images/full-charge-onsite-og.png',
  },
};

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

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * What a signed-out page load gets: link-preview tags for chat apps and
 * mail clients (which never hold the cookie), then an immediate hop to the
 * gate. Carries no guide content - only the fixed title, description and
 * public image from GUIDES. location.replace keeps the #page fragment,
 * which a meta refresh would drop; the meta refresh covers no-JS clients.
 */
function lockedPage(request, url, guide, gateUrl) {
  const pageUrl = url.origin + url.pathname;
  const image = url.origin + guide.image;
  const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<title>${escapeAttr(guide.title)}</title>
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="${escapeAttr(guide.description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeAttr(guide.title)}">
<meta property="og:description" content="${escapeAttr(guide.description)}">
<meta property="og:url" content="${escapeAttr(pageUrl)}">
<meta property="og:image" content="${escapeAttr(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeAttr(guide.title)}">
<meta name="twitter:description" content="${escapeAttr(guide.description)}">
<meta name="twitter:image" content="${escapeAttr(image)}">
<meta http-equiv="refresh" content="0; url=${escapeAttr(gateUrl)}">
<script>location.replace(${JSON.stringify(gateUrl)} + location.hash);</script>
</head><body><a href="${escapeAttr(gateUrl)}">Unlock</a></body></html>
`;
  const headers = baseHeaders();
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Cache-Control', 'private, no-store');
  return new Response(request.method === 'HEAD' ? null : html, { status: 200, headers });
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

/** RFC 9110 weak comparison of an If-None-Match header against one ETag. */
function etagMatches(header, etag) {
  if (!header) return false;
  if (header.trim() === '*') return true;
  const bare = (t) => t.trim().replace(/^W\//, '');
  return header.split(',').some((t) => bare(t) === bare(etag));
}

export async function handleGuide(request, env, clientId, rawRest) {
  const guide = Object.prototype.hasOwnProperty.call(GUIDES, clientId) ? GUIDES[clientId] : null;
  if (!guide) {
    return plain(404, 'Not found');
  }

  const url = new URL(request.url);
  const cookieValue = getCookie(request, `tuku_access_${clientId}`);
  const verified = await verifyAccessCookie(cookieValue, clientId, env.COOKIE_SECRET);
  if (!verified) {
    // A page load (top-level or inside the guide's own frame) gets the
    // link-preview page, which sends the visitor straight on to the client's
    // gate; the gate sends them back here after unlock. A film, stylesheet
    // or script gets a bare 401 - never HTML it can't use, and never content.
    const accept = request.headers.get('Accept') || '';
    if (accept.includes('text/html')) {
      const next = encodeURIComponent(url.pathname + url.search);
      return lockedPage(request, url, guide, `/clients/${clientId}/?next=${next}`);
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
  // Assets may sit in the browser cache but must be revalidated here on
  // every use (no-cache), so a locked browser can't keep replaying films it
  // loaded earlier. The cookie check above always runs first: a signed-out
  // request gets its 401 and never reaches this 304.
  headers.set('Cache-Control', ext === 'html' ? 'private, no-store' : 'private, no-cache');
  headers.set('Accept-Ranges', 'bytes');
  headers.set('ETag', meta.httpEtag);

  if (ext !== 'html' && etagMatches(request.headers.get('If-None-Match'), meta.httpEtag)) {
    return new Response(null, { status: 304, headers });
  }

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
