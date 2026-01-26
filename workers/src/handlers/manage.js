/**
 * Manage Booking Handlers
 * GET /api/booking/:id - Get booking details
 * POST /api/booking/:id/cancel - Cancel booking
 */

import {
  getAccessToken,
  deleteCalendarEvent,
  getCalendarEvent,
  BUSINESS_HOURS,
} from '../services/calendar.js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

/**
 * Get booking details
 */
export async function handleGetBooking(request, env, bookingId) {
  try {
    // Fetch booking from KV
    const bookingData = await env.BOOKINGS.get(bookingId);

    if (!bookingData) {
      return new Response(JSON.stringify({
        error: 'Booking not found. It may have been cancelled.',
      }), { status: 404, headers: corsHeaders });
    }

    const booking = JSON.parse(bookingData);

    // Check if booking has been cancelled
    if (booking.status === 'cancelled') {
      return new Response(JSON.stringify({
        error: 'This booking has been cancelled.',
        cancelled: true,
      }), { status: 410, headers: corsHeaders });
    }

    // Format date/time for display
    const startDate = new Date(booking.slotStart);
    const formattedDate = startDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: BUSINESS_HOURS.timezone,
    });
    const formattedTime = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: BUSINESS_HOURS.timezone,
    });

    // Check if booking is in the past
    const now = new Date();
    const isPast = startDate < now;

    return new Response(JSON.stringify({
      booking: {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        date: formattedDate,
        time: formattedTime,
        timezone: 'Pacific Time',
        meetLink: booking.meetLink,
        status: booking.status,
        isPast,
        canCancel: !isPast,
      },
    }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Get booking error:', error);

    return new Response(JSON.stringify({
      error: 'Something went wrong. Please try again.',
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

/**
 * Cancel booking
 */
export async function handleCancelBooking(request, env, bookingId) {
  try {
    // Fetch booking from KV
    const bookingData = await env.BOOKINGS.get(bookingId);

    if (!bookingData) {
      return new Response(JSON.stringify({
        error: 'Booking not found. It may have already been cancelled.',
      }), { status: 404, headers: corsHeaders });
    }

    const booking = JSON.parse(bookingData);

    // Check if already cancelled
    if (booking.status === 'cancelled') {
      return new Response(JSON.stringify({
        error: 'This booking has already been cancelled.',
      }), { status: 410, headers: corsHeaders });
    }

    // Check if booking is in the past
    const startDate = new Date(booking.slotStart);
    const now = new Date();

    if (startDate < now) {
      return new Response(JSON.stringify({
        error: 'Past bookings cannot be cancelled.',
      }), { status: 400, headers: corsHeaders });
    }

    // Get access token
    const accessToken = await getAccessToken(env.GOOGLE_SERVICE_ACCOUNT_KEY);

    // Delete calendar event
    try {
      await deleteCalendarEvent(accessToken, env.GOOGLE_CALENDAR_ID, booking.eventId);
    } catch (calendarError) {
      // Log but don't fail if calendar deletion fails
      // (event might have been manually deleted)
      console.error('Calendar deletion error:', calendarError);
    }

    // Update booking status in KV
    booking.status = 'cancelled';
    booking.cancelledAt = new Date().toISOString();

    await env.BOOKINGS.put(bookingId, JSON.stringify(booking), {
      expirationTtl: 60 * 60 * 24 * 7, // Keep cancelled bookings for 7 days
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Your booking has been cancelled. The calendar invite has been removed.',
    }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Cancel booking error:', error);

    return new Response(JSON.stringify({
      error: 'Something went wrong. Please try again.',
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
