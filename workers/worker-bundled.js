/**
 * TUKU Booking API - Bundled Worker
 * All modules combined for Cloudflare Workers deployment
 */

// ============================================
// BUSINESS RULES & CONFIGURATION
// ============================================

const BUSINESS_HOURS = {
  start: 10, // 10 AM PT
  end: 13,   // Last slot at 1:00 PM PT
  days: [2, 3, 4], // Tuesday, Wednesday, Thursday
  timezone: 'America/Los_Angeles',
};

const BOOKING_RULES = {
  slotDuration: 25,      // 25-minute consultation
  slotSpacing: 30,       // 30-minute slot spacing (5-min buffer)
  bufferHours: 24,       // 24 hours minimum notice
  daysAhead: 14,         // 14 days ahead window
};

// ============================================
// CORS HEADERS
// ============================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

// ============================================
// GOOGLE CALENDAR SERVICE
// ============================================

async function getAccessToken(serviceAccountKey) {
  const key = JSON.parse(serviceAccountKey);

  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedClaim = btoa(JSON.stringify(claim)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const signatureInput = `${encodedHeader}.${encodedClaim}`;
  const signature = await signWithRSA(signatureInput, key.private_key);

  const jwt = `${signatureInput}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await response.json();
  return data.access_token;
}

async function signWithRSA(data, privateKeyPem) {
  const pemContents = privateKeyPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const encoder = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(data)
  );

  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return signature;
}

async function getBusyTimes(accessToken, calendarId, timeMin, timeMax) {
  const response = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: BUSINESS_HOURS.timezone,
      items: [{ id: calendarId }],
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.calendars[calendarId]?.busy || [];
}

async function createCalendarEvent(accessToken, calendarId, eventDetails) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all&conferenceDataVersion=1`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventDetails),
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

async function deleteCalendarEvent(accessToken, calendarId, eventId) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}?sendUpdates=all`,
    {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    }
  );

  if (!response.ok && response.status !== 204) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Failed to delete event');
  }
  return true;
}

function generateAvailableSlots(busyTimes, startDate, endDate) {
  const slots = [];
  const now = new Date();
  const bufferTime = new Date(now.getTime() + BOOKING_RULES.bufferHours * 60 * 60 * 1000);

  const busyPeriods = busyTimes.map(b => ({
    start: new Date(b.start),
    end: new Date(b.end),
  }));

  // PT offset: -8 hours (PST) or -7 hours (PDT)
  function getPTOffset(date) {
    const year = date.getUTCFullYear();
    const marchSecondSunday = new Date(Date.UTC(year, 2, 8 + (7 - new Date(Date.UTC(year, 2, 1)).getUTCDay()) % 7, 10));
    const novFirstSunday = new Date(Date.UTC(year, 10, 1 + (7 - new Date(Date.UTC(year, 10, 1)).getUTCDay()) % 7, 9));
    return (date >= marchSecondSunday && date < novFirstSunday) ? -7 : -8;
  }

  // Generate slots for each day in the range
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Start from today and iterate through days
  let checkDate = new Date(startDate);
  checkDate.setUTCHours(12, 0, 0, 0); // Set to noon UTC to avoid date boundary issues

  for (let d = 0; d < BOOKING_RULES.daysAhead; d++) {
    const ptOffset = getPTOffset(checkDate);

    // Get the date string in PT (YYYY-MM-DD)
    const ptTime = new Date(checkDate.getTime() + ptOffset * 60 * 60 * 1000);
    const year = ptTime.getUTCFullYear();
    const month = String(ptTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(ptTime.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const dayOfWeek = ptTime.getUTCDay();

    // Skip non-business days (only Tue=2, Wed=3, Thu=4)
    if (!BUSINESS_HOURS.days.includes(dayOfWeek)) {
      checkDate.setUTCDate(checkDate.getUTCDate() + 1);
      continue;
    }

    const daySlots = [];

    for (let hour = BUSINESS_HOURS.start; hour <= BUSINESS_HOURS.end; hour++) {
      for (let minute = 0; minute < 60; minute += BOOKING_RULES.slotSpacing) {
        if (hour === BUSINESS_HOURS.end && minute > 0) continue;

        // Create the slot time: dateStr at hour:minute PT converted to UTC
        // PT to UTC: subtract the offset (offset is negative, so we add)
        const utcHour = hour - ptOffset; // e.g., 10 - (-8) = 18
        const slotStart = new Date(`${dateStr}T${String(utcHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`);

        const slotEnd = new Date(slotStart);
        slotEnd.setUTCMinutes(slotEnd.getUTCMinutes() + BOOKING_RULES.slotDuration);

        if (slotStart <= bufferTime) continue;

        const isAvailable = !busyPeriods.some(busy =>
          (slotStart < busy.end && slotEnd > busy.start)
        );

        if (isAvailable) {
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
          const displayMinute = minute.toString().padStart(2, '0');

          daySlots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            startTime: `${displayHour}:${displayMinute} ${ampm}`,
          });
        }
      }
    }

    if (daySlots.length > 0) {
      slots.push({
        date: dateStr,
        dayName: dayNames[dayOfWeek],
        slots: daySlots,
      });
    }

    checkDate.setUTCDate(checkDate.getUTCDate() + 1);
  }

  return slots;
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: BUSINESS_HOURS.timezone,
  });
}

function generateBookingId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'TK-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// ============================================
// AVAILABILITY HANDLER
// ============================================

async function handleAvailability(request, env) {
  try {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + BOOKING_RULES.daysAhead);

    const accessToken = await getAccessToken(env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const busyTimes = await getBusyTimes(accessToken, env.GOOGLE_CALENDAR_ID, startDate, endDate);
    const availability = generateAvailableSlots(busyTimes, startDate, endDate);

    return new Response(JSON.stringify({
      timezone: BUSINESS_HOURS.timezone,
      slotDuration: BOOKING_RULES.slotDuration,
      availability,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Availability error:', error);
    return new Response(JSON.stringify({
      error: 'Unable to fetch availability. Please try again.',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// ============================================
// BOOKING HANDLER
// ============================================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function isSlotAvailable(accessToken, calendarId, slotStart, slotEnd) {
  const start = new Date(slotStart);
  const end = new Date(slotEnd);
  const busyTimes = await getBusyTimes(accessToken, calendarId, start, end);
  return !busyTimes.some(busy => {
    const busyStart = new Date(busy.start);
    const busyEnd = new Date(busy.end);
    return start < busyEnd && end > busyStart;
  });
}

async function handleBook(request, env) {
  try {
    const body = await request.json();
    const { name, email, context, slotStart, slotEnd } = body;

    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: 'Name is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({ error: 'A valid email is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!slotStart || !slotEnd) {
      return new Response(JSON.stringify({ error: 'Please select a time slot.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const slotStartDate = new Date(slotStart);
    const now = new Date();
    const bufferTime = new Date(now.getTime() + BOOKING_RULES.bufferHours * 60 * 60 * 1000);

    if (slotStartDate <= bufferTime) {
      return new Response(JSON.stringify({
        error: 'This time slot is no longer available. Please select another.',
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const accessToken = await getAccessToken(env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const available = await isSlotAvailable(accessToken, env.GOOGLE_CALENDAR_ID, slotStart, slotEnd);

    if (!available) {
      return new Response(JSON.stringify({
        error: 'This time is no longer available. Please select another.',
      }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const bookingId = generateBookingId();

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

    const eventDetails = {
      summary: `TUKU Consultation: ${name.trim()}`,
      description: `Booking ID: ${bookingId}\n\nName: ${name.trim()}\nEmail: ${email.trim()}${context ? `\n\nContext:\n${context.trim()}` : ''}\n\nManage booking: https://tukugroup.com/book/?id=${bookingId}`,
      start: { dateTime: slotStart, timeZone: BUSINESS_HOURS.timezone },
      end: { dateTime: slotEnd, timeZone: BUSINESS_HOURS.timezone },
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
      expirationTtl: 60 * 60 * 24 * 30,
    });

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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Booking error:', error);
    return new Response(JSON.stringify({
      error: 'Something went wrong. Please try again.',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// ============================================
// MANAGE BOOKING HANDLERS
// ============================================

async function handleGetBooking(request, env, bookingId) {
  try {
    const bookingData = await env.BOOKINGS.get(bookingId);

    if (!bookingData) {
      return new Response(JSON.stringify({
        error: 'Booking not found. It may have been cancelled.',
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const booking = JSON.parse(bookingData);

    if (booking.status === 'cancelled') {
      return new Response(JSON.stringify({
        error: 'This booking has been cancelled.',
        cancelled: true,
      }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Get booking error:', error);
    return new Response(JSON.stringify({
      error: 'Something went wrong. Please try again.',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleCancelBooking(request, env, bookingId) {
  try {
    const bookingData = await env.BOOKINGS.get(bookingId);

    if (!bookingData) {
      return new Response(JSON.stringify({
        error: 'Booking not found. It may have already been cancelled.',
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const booking = JSON.parse(bookingData);

    if (booking.status === 'cancelled') {
      return new Response(JSON.stringify({
        error: 'This booking has already been cancelled.',
      }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const startDate = new Date(booking.slotStart);
    const now = new Date();

    if (startDate < now) {
      return new Response(JSON.stringify({
        error: 'Past bookings cannot be cancelled.',
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const accessToken = await getAccessToken(env.GOOGLE_SERVICE_ACCOUNT_KEY);

    try {
      await deleteCalendarEvent(accessToken, env.GOOGLE_CALENDAR_ID, booking.eventId);
    } catch (calendarError) {
      console.error('Calendar deletion error:', calendarError);
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date().toISOString();

    await env.BOOKINGS.put(bookingId, JSON.stringify(booking), {
      expirationTtl: 60 * 60 * 24 * 7,
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Your booking has been cancelled. The calendar invite has been removed.',
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    return new Response(JSON.stringify({
      error: 'Something went wrong. Please try again.',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// ============================================
// MAIN ROUTER
// ============================================

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

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const route = matchRoute(pathname, method);

    if (!route) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
          return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
      }
    } catch (error) {
      console.error('Request error:', error);
      return new Response(JSON.stringify({
        error: 'Something went wrong. Please try again.',
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
