import { verifyPassphrase, signAccessCookie, sha256Hex } from '../services/crypto.js';
import { getAccessGrant, logAccessAttempt } from '../services/db.js';
import { checkAndRecordAttempt } from '../services/ratelimit.js';
import { jsonResponse } from '../services/http.js';

const COOKIE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export async function handleUnlock(request, env, clientId) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const ipHash = await sha256Hex(ip);
  const userAgent = request.headers.get('User-Agent') || '';

  const rl = await checkAndRecordAttempt(env.RATE_LIMIT, `unlock:${clientId}:${ipHash}`);
  if (!rl.allowed) {
    return jsonResponse({ ok: false, error: 'too_many_attempts' }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'bad_request' }, 400);
  }

  const passphrase = typeof body.passphrase === 'string' ? body.passphrase : '';
  const grant = await getAccessGrant(env.CLIENT_ARCHIVE_DB, clientId);

  const ok = grant
    ? await verifyPassphrase(passphrase, grant.passphrase_hash)
    : false;

  await logAccessAttempt(env.CLIENT_ARCHIVE_DB, { clientId, ok, ipHash, userAgent });

  if (!ok) {
    return jsonResponse({ ok: false, error: 'invalid_passphrase' }, 401);
  }

  const expiresAtMs = Date.now() + COOKIE_TTL_MS;
  const cookieValue = await signAccessCookie(clientId, expiresAtMs, env.COOKIE_SECRET);
  // Path is /clients (not /clients/<clientId>) because the API paths this
  // cookie needs to reach (/clients/board/<slug> etc.) no longer share a
  // /clients/<slug> prefix - the slug moved to the end of the path (see
  // src/index.js). Safe to share across clients: the cookie NAME is still
  // per-client (tuku_access_<clientId>), and verifyAccessCookie rejects a
  // cookie whose signed clientId doesn't match the one being requested.
  const cookie = [
    `tuku_access_${clientId}=${cookieValue}`,
    'Path=/clients',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${Math.floor(COOKIE_TTL_MS / 1000)}`,
  ].join('; ');

  return jsonResponse({ ok: true }, 200, { 'Set-Cookie': cookie });
}

export async function handleLock(request, env, clientId) {
  const cookie = [
    `tuku_access_${clientId}=`,
    'Path=/clients',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Max-Age=0',
  ].join('; ');
  return jsonResponse({ ok: true }, 200, { 'Set-Cookie': cookie });
}
