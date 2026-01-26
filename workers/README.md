# TUKU Booking API

Cloudflare Workers backend for the TUKU GROUP booking system.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create KV Namespace

```bash
# Create production namespace
wrangler kv:namespace create BOOKINGS

# Create preview namespace (for local dev)
wrangler kv:namespace create BOOKINGS --preview
```

Update `wrangler.toml` with the returned namespace IDs.

### 3. Configure Google Calendar API

1. Create a Google Cloud project
2. Enable the Google Calendar API
3. Create a service account with Calendar access
4. Download the JSON key file
5. Share your calendar with the service account email

### 4. Set Secrets

```bash
# Set Google service account key (paste entire JSON content)
wrangler secret put GOOGLE_SERVICE_ACCOUNT_KEY

# Set calendar ID (usually your email)
wrangler secret put GOOGLE_CALENDAR_ID

# Set your email for calendar invites
wrangler secret put FALON_EMAIL
```

## Local Development

```bash
npm run dev
# Runs on http://localhost:8787
```

For local testing with secrets, create a `.dev.vars` file:

```
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GOOGLE_CALENDAR_ID=falon@tukugroup.com
FALON_EMAIL=falon@tukugroup.com
```

**Never commit `.dev.vars` to git.**

## API Endpoints

### GET /api/availability

Returns available booking slots for the next 14 days.

**Response:**
```json
{
  "timezone": "America/Los_Angeles",
  "slotDuration": 25,
  "availability": [
    {
      "date": "2026-01-27",
      "dayName": "Monday",
      "slots": [
        {
          "start": "2026-01-27T18:00:00.000Z",
          "end": "2026-01-27T18:25:00.000Z",
          "startTime": "10:00 AM"
        }
      ]
    }
  ]
}
```

### POST /api/book

Creates a new booking.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "context": "Optional context about the project",
  "slotStart": "2026-01-27T18:00:00.000Z",
  "slotEnd": "2026-01-27T18:25:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "TK-ABC123",
    "date": "Monday, January 27",
    "time": "10:00 AM",
    "timezone": "Pacific Time",
    "meetLink": "https://meet.google.com/xxx-xxxx-xxx",
    "manageUrl": "https://tukugroup.com/book/manage?id=TK-ABC123"
  }
}
```

### GET /api/booking/:id

Returns booking details.

**Response:**
```json
{
  "booking": {
    "id": "TK-ABC123",
    "name": "John Doe",
    "email": "john@example.com",
    "date": "Monday, January 27, 2026",
    "time": "10:00 AM",
    "timezone": "Pacific Time",
    "meetLink": "https://meet.google.com/xxx-xxxx-xxx",
    "status": "confirmed",
    "isPast": false,
    "canCancel": true
  }
}
```

### POST /api/booking/:id/cancel

Cancels a booking.

**Response:**
```json
{
  "success": true,
  "message": "Your booking has been cancelled. The calendar invite has been removed."
}
```

## Deployment

```bash
# Deploy to production
npm run deploy:production
```

## Business Rules

| Rule | Value |
|------|-------|
| Duration | 25 minutes |
| Buffer | 5 minutes between slots |
| Days | Monday - Friday |
| Hours | 10:00 AM - 5:00 PM PT |
| Notice | 24 hours minimum |
| Window | 14 days ahead |
