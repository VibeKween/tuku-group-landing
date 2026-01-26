/**
 * TUKU Booking API
 * Cloudflare Workers entry point
 */

import { handleAvailability } from './handlers/availability.js';
import { handleBook } from './handlers/book.js';
import { handleGetBooking, handleCancelBooking } from './handlers/manage.js';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

// JSON response helper
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Error response helper
function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

// Route matcher
function matchRoute(pathname, method) {
  const routes = [
    { pattern: /^\/api\/availability$/, method: 'GET', handler: 'availability' },
    { pattern: /^\/api\/book$/, method: 'POST', handler: 'book' },
    { pattern: /^\/api\/booking\/([A-Z0-9-]+)$/, method: 'GET', handler: 'getBooking' },
    { pattern: /^\/api\/booking\/([A-Z0-9-]+)\/cancel$/, method: 'POST', handler: 'cancelBooking' },
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
    const { pathname } = url;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Match route
    const route = matchRoute(pathname, method);

    if (!route) {
      return errorResponse('Not found', 404);
    }

    try {
      switch (route.handler) {
        case 'availability':
          return await handleAvailability(request, env);

        case 'book':
          return await handleBook(request, env);

        case 'getBooking':
          return await handleGetBooking(request, env, route.params[0]);

        case 'cancelBooking':
          return await handleCancelBooking(request, env, route.params[0]);

        default:
          return errorResponse('Not found', 404);
      }
    } catch (error) {
      console.error('Request error:', error);
      return errorResponse('Something went wrong. Please try again.', 500);
    }
  },
};
