/**
 * TUKU Client Archive API
 * Cloudflare Workers entry point for the private per-client archive
 * (Full Charge et al.) - see website/design_handoff_full_charge/README.md.
 *
 * Route mounting under tukugroup.com is not finalized (see wrangler.toml) -
 * these paths are the logical contract the field/reader/gate pages and the
 * admin UI are built against.
 */

import { handleUnlock, handleLock } from './handlers/unlock.js';
import { handleBoard } from './handlers/board.js';
import { handleArtifact } from './handlers/artifact.js';
import { handleAdminUpload, handleAdminClients, handleAdminClientArtifacts } from './handlers/admin.js';
import { ADMIN_PAGE_HTML } from './admin-page.js';

function matchRoute(pathname, method) {
  const routes = [
    { pattern: /^\/clients\/([a-z0-9-]+)\/unlock$/, method: 'POST', handler: 'unlock' },
    { pattern: /^\/clients\/([a-z0-9-]+)\/lock$/, method: 'POST', handler: 'lock' },
    { pattern: /^\/clients\/([a-z0-9-]+)\/board$/, method: 'GET', handler: 'board' },
    { pattern: /^\/clients\/([a-z0-9-]+)\/artifact\/([a-zA-Z0-9-]+)$/, method: 'GET', handler: 'artifact' },
    { pattern: /^\/admin\/artifacts$/, method: 'POST', handler: 'adminUpload' },
    { pattern: /^\/admin\/clients$/, method: 'GET', handler: 'adminClients' },
    { pattern: /^\/admin\/clients\/([a-z0-9-]+)\/artifacts$/, method: 'GET', handler: 'adminClientArtifacts' },
    { pattern: /^\/admin\/?$/, method: 'GET', handler: 'adminPage' },
  ];

  for (const route of routes) {
    const match = pathname.match(route.pattern);
    if (match && route.method === method) {
      return { handler: route.handler, params: match.slice(1) };
    }
  }
  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const match = matchRoute(url.pathname, request.method);

    if (!match) {
      return new Response('Not found', { status: 404 });
    }

    try {
      switch (match.handler) {
        case 'unlock':
          return await handleUnlock(request, env, match.params[0]);
        case 'lock':
          return await handleLock(request, env, match.params[0]);
        case 'board':
          return await handleBoard(request, env, match.params[0]);
        case 'artifact':
          return await handleArtifact(request, env, match.params[0], match.params[1]);
        case 'adminUpload':
          return await handleAdminUpload(request, env);
        case 'adminClients':
          return await handleAdminClients(request, env);
        case 'adminClientArtifacts':
          return await handleAdminClientArtifacts(request, env, match.params[0]);
        case 'adminPage':
          return new Response(ADMIN_PAGE_HTML, {
            headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' },
          });
        default:
          return new Response('Not found', { status: 404 });
      }
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: 'internal_error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
