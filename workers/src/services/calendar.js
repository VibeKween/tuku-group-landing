/**
 * Google Calendar API Service
 * Handles authentication and calendar operations
 */

// Business rules
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

/**
 * Generate a Google Calendar API access token from service account
 */
async function getAccessToken(serviceAccountKey) {
  const key = JSON.parse(serviceAccountKey);

  // Create JWT header
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  // Create JWT claim set
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  // Encode header and claim
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedClaim = btoa(JSON.stringify(claim)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  // Sign the JWT
  const signatureInput = `${encodedHeader}.${encodedClaim}`;
  const signature = await signWithRSA(signatureInput, key.private_key);

  const jwt = `${signatureInput}.${signature}`;

  // Exchange JWT for access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await response.json();
  return data.access_token;
}

/**
 * Sign data with RSA private key
 */
async function signWithRSA(data, privateKeyPem) {
  // Convert PEM to binary
  const pemContents = privateKeyPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  // Import key
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign
  const encoder = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(data)
  );

  // Convert to base64url
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return signature;
}

/**
 * Get busy times from Google Calendar
 */
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

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.calendars[calendarId]?.busy || [];
}

/**
 * Create a calendar event
 */
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

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data;
}

/**
 * Delete a calendar event
 */
async function deleteCalendarEvent(accessToken, calendarId, eventId) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}?sendUpdates=all`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Failed to delete event');
  }

  return true;
}

/**
 * Get a calendar event by ID
 */
async function getCalendarEvent(accessToken, calendarId, eventId) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data;
}

/**
 * Generate available time slots for a date range
 */
function generateAvailableSlots(busyTimes, startDate, endDate) {
  const slots = [];
  const now = new Date();
  const bufferTime = new Date(now.getTime() + BOOKING_RULES.bufferHours * 60 * 60 * 1000);

  // Convert busy times to Date objects
  const busyPeriods = busyTimes.map(b => ({
    start: new Date(b.start),
    end: new Date(b.end),
  }));

  // Iterate through each day
  let currentDay = new Date(startDate);
  currentDay.setHours(0, 0, 0, 0);

  while (currentDay <= endDate) {
    const dayOfWeek = currentDay.getDay();

    // Skip weekends
    if (!BUSINESS_HOURS.days.includes(dayOfWeek)) {
      currentDay.setDate(currentDay.getDate() + 1);
      continue;
    }

    // Generate slots for this day
    const daySlots = [];

    for (let hour = BUSINESS_HOURS.start; hour <= BUSINESS_HOURS.end; hour++) {
      for (let minute = 0; minute < 60; minute += BOOKING_RULES.slotSpacing) {
        // Only allow :00 slot for the last hour (1:00 PM is last bookable slot)
        if (hour === BUSINESS_HOURS.end && minute > 0) {
          continue;
        }

        const slotStart = new Date(currentDay);
        slotStart.setHours(hour, minute, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + BOOKING_RULES.slotDuration);

        // Skip if slot is in the past or within buffer period
        if (slotStart <= bufferTime) {
          continue;
        }

        // Check if slot overlaps with any busy period
        const isAvailable = !busyPeriods.some(busy =>
          (slotStart < busy.end && slotEnd > busy.start)
        );

        if (isAvailable) {
          daySlots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            startTime: formatTime(slotStart),
          });
        }
      }
    }

    if (daySlots.length > 0) {
      slots.push({
        date: currentDay.toISOString().split('T')[0],
        dayName: currentDay.toLocaleDateString('en-US', {
          weekday: 'long',
          timeZone: BUSINESS_HOURS.timezone
        }),
        slots: daySlots,
      });
    }

    currentDay.setDate(currentDay.getDate() + 1);
  }

  return slots;
}

/**
 * Format time for display (e.g., "10:00 AM")
 */
function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: BUSINESS_HOURS.timezone,
  });
}

/**
 * Generate a short booking ID
 */
function generateBookingId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars
  let id = 'TK-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export {
  getAccessToken,
  getBusyTimes,
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvent,
  generateAvailableSlots,
  generateBookingId,
  BUSINESS_HOURS,
  BOOKING_RULES,
};
