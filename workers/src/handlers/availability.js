/**
 * Availability Handler
 * GET /api/availability
 * Returns available booking slots for the next 14 days
 */

import {
  getAccessToken,
  getBusyTimes,
  generateAvailableSlots,
  BOOKING_RULES,
  BUSINESS_HOURS,
} from '../services/calendar.js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export async function handleAvailability(request, env) {
  try {
    // Calculate date range
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + BOOKING_RULES.daysAhead);

    // Get access token
    const accessToken = await getAccessToken(env.GOOGLE_SERVICE_ACCOUNT_KEY);

    // Get busy times from calendar
    const busyTimes = await getBusyTimes(
      accessToken,
      env.GOOGLE_CALENDAR_ID,
      startDate,
      endDate
    );

    // Generate available slots
    const availability = generateAvailableSlots(busyTimes, startDate, endDate);

    return new Response(JSON.stringify({
      timezone: BUSINESS_HOURS.timezone,
      slotDuration: BOOKING_RULES.slotDuration,
      availability,
    }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Availability error:', error);

    return new Response(JSON.stringify({
      error: 'Unable to fetch availability. Please try again.',
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
