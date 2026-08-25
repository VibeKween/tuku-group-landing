import { verifyAccessCookie } from '../services/crypto.js';
import { getBoardPayload } from '../services/db.js';
import { getCookie, jsonResponse } from '../services/http.js';

export async function handleBoard(request, env, clientId) {
  const cookieValue = getCookie(request, `tuku_access_${clientId}`);
  const verified = await verifyAccessCookie(cookieValue, clientId, env.COOKIE_SECRET);
  if (!verified) {
    return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
  }

  const payload = await getBoardPayload(env.CLIENT_ARCHIVE_DB, clientId);
  if (!payload) {
    return jsonResponse({ ok: false, error: 'not_found' }, 404);
  }

  return jsonResponse(payload);
}
