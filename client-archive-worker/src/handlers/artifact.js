import { verifyAccessCookie } from '../services/crypto.js';
import { getArtifactById } from '../services/db.js';
import { getCookie } from '../services/http.js';

export async function handleArtifact(request, env, clientId, artifactId) {
  const cookieValue = getCookie(request, `tuku_access_${clientId}`);
  const verified = await verifyAccessCookie(cookieValue, clientId, env.COOKIE_SECRET);
  if (!verified) {
    return new Response('Unauthorized', { status: 401 });
  }

  const artifact = await getArtifactById(env.CLIENT_ARCHIVE_DB, clientId, artifactId);
  if (!artifact) {
    return new Response('Not found', { status: 404 });
  }

  // R2 objects are only ever reached through this route - the bucket itself
  // is never exposed directly, so r2_key never leaks to the client.
  const object = await env.ARTIFACTS.get(artifact.r2_key);
  if (!object) {
    return new Response('Artifact file missing', { status: 404 });
  }

  const url = new URL(request.url);
  const headers = new Headers();
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Cache-Control', 'private, no-store');

  if (url.searchParams.get('download') === '1') {
    headers.set('Content-Disposition', `attachment; filename="${artifact.download_name}"`);
  }

  return new Response(object.body, { status: 200, headers });
}
