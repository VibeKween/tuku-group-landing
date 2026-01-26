/**
 * Booking Handler
 * POST /api/book
 * Creates a new booking and calendar event
 */

import {
  getAccessToken,
  getBusyTimes,
  createCalendarEvent,
  generateBookingId,
  BOOKING_RULES,
  BUSINESS_HOURS,
} from '../services/calendar.js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

// Email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate slot is still available
async function isSlotAvailable(accessToken, calendarId, slotStart, slotEnd) {
  const start = new Date(slotStart);
  const end = new Date(slotEnd);

  const busyTimes = await getBusyTimes(accessToken, calendarId, start, end);

  // Check if any busy period overlaps with our slot
  return !busyTimes.some(busy => {
    const busyStart = new Date(busy.start);
    const busyEnd = new Date(busy.end);
    return start < busyEnd && end > busyStart;
  });
}

export async function handleBook(request, env) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, email, context, slotStart, slotEnd } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return new Response(JSON.stringify({
        error: 'Name is required.',
      }), { status: 400, headers: corsHeaders });
    }

    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({
        error: 'A valid email is required.',
      }), { status: 400, headers: corsHeaders });
    }

    if (!slotStart || !slotEnd) {
      return new Response(JSON.stringify({
        error: 'Please select a time slot.',
      }), { status: 400, headers: corsHeaders });
    }

    // Validate slot is in the future with buffer
    const slotStartDate = new Date(slotStart);
    const now = new Date();
    const bufferTime = new Date(now.getTime() + BOOKING_RULES.bufferHours * 60 * 60 * 1000);

    if (slotStartDate <= bufferTime) {
      return new Response(JSON.stringify({
        error: 'This time slot is no longer available. Please select another.',
      }), { status: 400, headers: corsHeaders });
    }

    // Get access token
    const accessToken = await getAccessToken(env.GOOGLE_SERVICE_ACCOUNT_KEY);

    // Check if slot is still available (race condition protection)
    const available = await isSlotAvailable(
      accessToken,
      env.GOOGLE_CALENDAR_ID,
      slotStart,
      slotEnd
    );

    if (!available) {
      return new Response(JSON.stringify({
        error: 'This time is no longer available. Please select another.',
      }), { status: 409, headers: corsHeaders });
    }

    // Generate booking ID
    const bookingId = generateBookingId();

    // Format date/time for display
    const startDate = new Date(slotStart);
    const formattedDate = startDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: BUSINESS_HOURS.timezone,
    });
    const formattedTime = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: BUSINESS_HOURS.timezone,
    });

    // Create calendar event
    const eventDetails = {
      summary: `TUKU Consultation: ${name.trim()}`,
      description: `Booking ID: ${bookingId}\n\nName: ${name.trim()}\nEmail: ${email.trim()}${context ? `\n\nContext:\n${context.trim()}` : ''}\n\nManage booking: https://tukugroup.com/book/?id=${bookingId}`,
      start: {
        dateTime: slotStart,
        timeZone: BUSINESS_HOURS.timezone,
      },
      end: {
        dateTime: slotEnd,
        timeZone: BUSINESS_HOURS.timezone,
      },
      attendees: [
        { email: env.FALON_EMAIL },
        { email: email.trim() },
      ],
      conferenceData: {
        createRequest: {
          requestId: bookingId,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    };

    const event = await createCalendarEvent(accessToken, env.GOOGLE_CALENDAR_ID, eventDetails);

    // Store booking in KV
    const bookingData = {
      id: bookingId,
      eventId: event.id,
      name: name.trim(),
      email: email.trim(),
      context: context?.trim() || null,
      slotStart,
      slotEnd,
      meetLink: event.hangoutLink || null,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };

    await env.BOOKINGS.put(bookingId, JSON.stringify(bookingData), {
      expirationTtl: 60 * 60 * 24 * 30, // 30 days
    });

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      booking: {
        id: bookingId,
        date: formattedDate,
        time: formattedTime,
        timezone: 'Pacific Time',
        meetLink: event.hangoutLink,
        manageUrl: `https://tukugroup.com/book/?id=${bookingId}`,
      },
    }), {
      status: 201,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Booking error:', error);

    return new Response(JSON.stringify({
      error: 'Something went wrong. Please try again.',
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
