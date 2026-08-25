import { timingSafeEqualString } from '../services/crypto.js';
import { jsonResponse as json } from '../services/http.js';
import {
  resolveNextVersion,
  finalizeArtifactVersion,
  listClientsWithCounts,
  listArtifactHistory,
} from '../services/db.js';

export function isAdminAuthorized(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const match = auth.match(/^Bearer (.+)$/);
  if (!match || !env.ADMIN_TOKEN) return false;
  return timingSafeEqualString(match[1], env.ADMIN_TOKEN);
}

/** GET /admin/clients - dashboard's client picker. */
export async function handleAdminClients(request, env) {
  if (!isAdminAuthorized(request, env)) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  const clients = await listClientsWithCounts(env.CLIENT_ARCHIVE_DB);
  return json({ ok: true, clients });
}

/** GET /admin/clients/:id/artifacts - full version history for one client. */
export async function handleAdminClientArtifacts(request, env, clientId) {
  if (!isAdminAuthorized(request, env)) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  const artifacts = await listArtifactHistory(env.CLIENT_ARCHIVE_DB, clientId);
  return json({ ok: true, artifacts });
}

/**
 * POST /admin/artifacts (multipart/form-data)
 * Fields: client_id, doc_name, title, kind (default HTML), occurred_on
 * (default today, YYYY-MM-DD), session_label, board_x, board_y, file.
 *
 * Gated by ADMIN_TOKEN only - deliberately not reachable with any client
 * passphrase, since that would let a client-side leak also grant upload
 * access. See migrations/0001_init.sql for the versioning contract this
 * enforces (append-only, never overwrite).
 */
export async function handleAdminUpload(request, env) {
  if (!isAdminAuthorized(request, env)) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'expected multipart/form-data' }, 400);
  }

  const clientId = form.get('client_id');
  const docName = form.get('doc_name');
  const title = form.get('title') || docName;
  const kind = form.get('kind') || 'HTML';
  const occurredOn = form.get('occurred_on') || new Date().toISOString().slice(0, 10);
  const sessionLabel = form.get('session_label') || null;
  const boardX = form.get('board_x') ? parseInt(form.get('board_x'), 10) : null;
  const boardY = form.get('board_y') ? parseInt(form.get('board_y'), 10) : null;
  const file = form.get('file');

  if (!clientId || !docName || !file || typeof file === 'string') {
    return json({ ok: false, error: 'missing client_id, doc_name, or file' }, 400);
  }

  const db = env.CLIENT_ARCHIVE_DB;
  const { docSlug, version, priorId, priorSessionId, priorOccurredOn } =
    await resolveNextVersion(db, clientId, docName);
  const r2Key = `${clientId}/${docSlug}/v${version}.html`;

  await env.ARTIFACTS.put(r2Key, await file.arrayBuffer(), {
    httpMetadata: { contentType: 'text/html; charset=utf-8' },
  });

  const result = await finalizeArtifactVersion(db, {
    clientId,
    occurredOn,
    sessionLabel,
    docSlug,
    version,
    priorId,
    priorSessionId,
    priorOccurredOn,
    docName,
    title,
    kind,
    r2Key,
    boardX,
    boardY,
  });

  return json({ ok: true, ...result });
}
