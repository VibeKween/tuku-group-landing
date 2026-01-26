# Booking System

**Feature:** Calendar scheduling for consultations
**Workflow:** A (New Feature Build)
**Status:** Production Complete (Jan 26, 2026)

---

## Summary

Build a custom booking system at tukugroup.com/book that lets visitors schedule 30-minute consultations. Integrates with Google Calendar for availability and event management.

---

## Requirements

### Functional
- Display available time slots from Google Calendar (25-min duration, 30-min spacing)
- Collect: name, email, optional context (context included in calendar event)
- Create Google Calendar event on owner's calendar
- Owner manually adds client as attendee (triggers invite) - *service account limitation*
- Provide cancel via unique booking link (within 4-hour window)

### Privacy
**Email is for calendar invite only.** No list, no marketing, no retention beyond booking. UI must state: "For calendar invite only. No mailing list."

### Business Rules
| Rule | Value |
|------|-------|
| Duration | 25 minutes (5-min buffer between) |
| Slot spacing | 30 minutes |
| Days | Mon-Fri |
| Hours | 10am-5pm PT |
| Timezone | Always Pacific Time |
| Notice | 24 hours minimum |
| Window | 14 days ahead |
| Booking ID | Short code format: `TK-XXXXXX` |

---

## Architecture

```
tukugroup.com/book ──► Booking API ──► Google Calendar API
                      (Cloudflare Workers)
```

### Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/availability | Fetch open slots |
| POST | /api/book | Create booking |
| GET | /api/booking/:id | Get booking details |
| POST | /api/booking/:id/cancel | Cancel booking |

---

## Screens

```
landing → calendar → time → details → confirm → success
                                                  │
                                              manage → cancelled
```

### Copy Deck

**Landing**
- Headline: "Schedule a conversation"
- Subhead: "A 25-minute call to understand what you're building and whether TUKU is the right fit."
- CTA: "Select a date"

**Calendar**
- Headline: "Select a date"

**Time**
- Headline: "Select a time"
- Context: "[Day, Month Date] · Pacific Time"

**Details**
- Headline: "Your details"
- Fields: Name, Email (with privacy note), Context (optional)
- CTA: "Review booking"

**Confirm**
- Headline: "Confirm your booking"
- Note: "Your booking will be confirmed shortly. We'll reach out with meeting details."
- CTA: "Confirm booking"

**Success**
- Headline: "You're booked"
- Message: "Your booking is confirmed. We'll reach out to [email] with meeting details."
- CTA: "Manage booking"

**Manage**
- Headline: "Manage your booking"
- Shows: Booking ID, Date, Time, Status
- Cancel button: Available within 4 hours of booking
- After 4 hours: "To cancel, use the calendar invite sent to your email."

**Cancelled**
- Headline: "Booking cancelled"
- Message: "Your booking has been cancelled. The calendar invite has been removed."
- CTA: "Book another time"

**Errors**
- Network: "Something went wrong. Please try again."
- Slot taken: "This time is no longer available. Please select another."
- Not found: "Booking not found. It may have been cancelled."
- No availability: "No times available in the next two weeks. Please check back later."

---

## Phase 2 Specifics: Backend

### Stack
- Cloudflare Workers
- Google Calendar API (service account)
- KV for booking ID → event ID mapping

### Environment
```bash
GOOGLE_CALENDAR_ID=falon@tukugroup.com
GOOGLE_SERVICE_ACCOUNT_KEY={...}
FALON_EMAIL=falon@tukugroup.com
BUSINESS_HOURS_START=10
BUSINESS_HOURS_END=17
BOOKING_BUFFER=24
DAYS_AHEAD=14
```

### Local Dev
```bash
cd workers && npm install && wrangler dev
# Runs on localhost:8787
```

### Files
```
workers/
├── src/
│   ├── index.js
│   ├── handlers/
│   │   ├── availability.js
│   │   ├── book.js
│   │   └── manage.js
│   └── services/
│       └── calendar.js
├── wrangler.toml
└── package.json
```

---

## Phase 3 Specifics: Frontend

### Vanilla JS Pattern
```javascript
(function(global) {
  'use strict';

  const TUKUBooking = {
    config: {
      apiBase: window.location.hostname === 'localhost'
        ? 'http://localhost:8787/api'
        : 'https://api.tukugroup.com/api'
    },
    state: {},
    init: function() { /* ... */ }
  };

  global.TUKUBooking = TUKUBooking;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', TUKUBooking.init);
  } else {
    TUKUBooking.init();
  }
})(window);
```

### CSS Scoping
All styles scoped under `#tuku-booking-app`. No global pollution.

### Metadata
```html
<title>Book a Consultation | TUKU GROUP</title>
<meta name="description" content="Schedule a 30-minute conversation with TUKU GROUP.">
<meta property="og:title" content="Book a Consultation | TUKU GROUP">
<!-- etc. -->
```

### Files
```
book/
├── index.html
└── manage/
    └── index.html (or JS routing)
js/
└── booking.js
```

### Local Dev
```bash
# Terminal 1: Backend
cd workers && wrangler dev

# Terminal 2: Frontend
cd website && python -m http.server 8080
```

---

## Phase 4 Specifics: Testing

### Viewport Matrix
| Device | Size | Required |
|--------|------|----------|
| iPhone SE | 375x667 | ✓ |
| iPhone 14 | 390x844 | ✓ |
| iPhone 14 Pro Max | 430x932 | ✓ |
| iPad | 768x1024 | ✓ |
| Android | 360x800 | ✓ |
| Desktop | 1440x900 | ✓ |
| Wide | 1920x1080 | ✓ |

### Performance Targets
| Metric | Target |
|--------|--------|
| FCP | < 1.5s |
| TTI | < 3s |
| LCP | < 2.5s |
| API (availability) | < 500ms |
| API (book) | < 1s |

### Functional Tests
- [ ] Load landing, slots fetch
- [ ] Select date → times appear
- [ ] Select time → form appears
- [ ] Validation errors on empty submit
- [ ] Complete booking → success screen
- [ ] Calendar invite received with Meet link
- [ ] Manage link works
- [ ] Cancel works

### Edge Cases
- [ ] No availability message
- [ ] Slot taken between select and submit
- [ ] Network error handling
- [ ] Invalid booking ID
- [ ] Browser back button
- [ ] Refresh mid-flow

---

## Files Created

| Phase | Files |
|-------|-------|
| 1 | docs/builds/BUILD_PROGRESS.md, docs/builds/booking-audit.md |
| 2 | workers/* |
| 3 | book/index.html, js/booking.js |
| 4 | docs/builds/booking-TEST_REPORT.md |
| 5 | Production deployment, CTA implementations |
