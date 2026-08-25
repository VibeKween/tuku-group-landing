export function getCookie(request, name) {
  const header = request.headers.get('Cookie');
  if (!header) return null;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Every API response in this worker is generated fresh per-request from D1 -
 * there is no data that should ever be served stale. `no-store` makes that
 * explicit at the HTTP layer rather than relying on the absence of caching
 * behavior, since once this sits behind Cloudflare's edge, GET responses
 * without an explicit directive can be cached there by default.
 */
export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, no-store',
      ...extraHeaders,
    },
  });
}
