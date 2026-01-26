# Booking System Post-Mortem

**Project:** TUKU Booking System
**Duration:** January 25-26, 2026
**Status:** Production Complete
**Live URL:** https://tukugroup.com/book/

---

## Executive Summary

Successfully built and deployed a custom booking system for TUKU GROUP that enables visitors to schedule 25-minute consultations. The system integrates with Google Calendar via Cloudflare Workers, with a vanilla JavaScript frontend following TUKU's minimal design aesthetic.

**Key Outcomes:**
- Full booking flow operational (calendar → time → details → confirm → success)
- Manage booking page with time-based cancel functionality
- Real-time slot availability (booked slots removed automatically)
- Context field captured in calendar event descriptions
- Form validation with visual required indicators

---

## What Was Built

### Architecture
```
Frontend (Cloudflare Pages)     Backend (Cloudflare Workers)     External
┌─────────────────────┐         ┌─────────────────────┐         ┌──────────────┐
│ /book/index.html    │ ───────►│ /api/availability   │ ───────►│ Google       │
│ booking.js          │         │ /api/book           │         │ Calendar API │
│ booking.css         │         │ /api/booking/:id    │         │              │
│                     │◄─────── │ /api/booking/:id/   │◄─────── │ (Service     │
│                     │         │      cancel         │         │  Account)    │
└─────────────────────┘         └─────────────────────┘         └──────────────┘
                                         │
                                         ▼
                                ┌─────────────────────┐
                                │ Cloudflare KV       │
                                │ (Booking Storage)   │
                                └─────────────────────┘
```

### Features Delivered
| Feature | Status | Notes |
|---------|--------|-------|
| Calendar date picker | ✅ | Shows 14-day window, Mon-Fri only |
| Time slot selection | ✅ | 10am-5pm PT, 30-min spacing |
| Form validation | ✅ | Required indicators + browser validation |
| Booking creation | ✅ | Creates calendar event, stores in KV |
| Manage booking page | ✅ | View details, cancel within 4 hours |
| Slot conflict prevention | ✅ | Booked slots removed from availability |
| Context capture | ✅ | Optional field included in calendar event |

---

## Challenges & Pivots

### 1. Google API Service Account Limitations

**Problem:** Service accounts cannot invite attendees or create Google Meet links without Domain-Wide Delegation of Authority.

**Original Plan:**
- Auto-add client as calendar attendee
- Auto-generate Google Meet link
- Client receives instant calendar invite

**Error Encountered:**
```
"Service accounts cannot invite attendees without Domain-Wide Delegation"
"Invalid conference type value"
```

**Pivot:**
- Removed attendees array from calendar event creation
- Removed conferenceData (Meet link generation)
- Calendar event created on owner's calendar only
- Owner manually adds client as attendee (triggers invite)

**Impact:** Manual step added to workflow, but system remains functional.

**Recommendation for Future:** If auto-invites are critical, either:
1. Implement Domain-Wide Delegation (requires Google Workspace admin)
2. Use OAuth 2.0 with user consent flow instead of service account
3. Accept manual workflow (current solution)

### 2. Copy/Duration Mismatch

**Problem:** Spec said "30-minute call" but business rules specified 25-minute duration with 5-minute buffer.

**Fix:** Updated all copy to "25-minute call" across:
- Landing page headline
- Meta descriptions
- HTML title tags

**Learning:** Validate copy against business rules before deployment.

### 3. Cancel Button UX

**Problem:** Client wanted to prevent accidental cancellations after calendar invite is sent manually.

**Evolution:**
1. Initially removed cancel button entirely
2. User requested: keep cancel for immediate regrets
3. Final solution: 4-hour window for cancel button

**Implementation:**
```javascript
const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
const canCancelViaButton = hoursSinceCreation < 4;
```

After 4 hours: Cancel button hidden, shows "To cancel, use the calendar invite sent to your email."

### 4. Missing Required Field Indicators

**Problem:** Form fields had `required` attribute but no visual indicator.

**Initial State:** Browser validation worked but users couldn't see which fields were required.

**Fix:** Added gold asterisks to Name and Email labels:
```html
<label>Name <span class="required">*</span></label>
<label>Email <span class="required">*</span></label>
```

**Learning:** Always pair HTML `required` attributes with visual indicators.

### 5. Dual Directory Deployment

**Problem:** Development happens in `/website/` but Cloudflare deploys from root.

**Solution:** Copy files to root before every commit:
```bash
cp website/book/index.html book/index.html
cp website/book/booking.js book/booking.js
cp website/book/booking.css book/booking.css
```

**Learning:** Document deployment quirks prominently. Already in CLAUDE.md but easy to miss.

---

## Agent Role Evaluation

### Session 1 Agent (Spec & Backend Build)
**Role:** Architecture planning, Cloudflare Workers implementation, Google Calendar integration

**Deliverables:**
- `docs/specs/booking-system.md` - Full specification
- `docs/builds/booking-audit.md` - Design system audit
- `workers/` - Complete backend implementation
- KV storage setup, API endpoints

**Challenges Faced:**
- Google API authentication complexity (JWT/RSA signing)
- Service account limitations (attendees, Meet links)
- CORS configuration for cross-origin requests

**What Worked Well:**
- Modular handler structure (`availability.js`, `book.js`, `manage.js`)
- Clear API documentation in `workers/README.md`
- Environment variable handling for secrets

**Instructions Needed Next Time:**
- Clarify Google Workspace vs personal Gmail calendar capabilities upfront
- Confirm whether Domain-Wide Delegation is available
- Get explicit approval on manual vs automated attendee workflow

### Session 2 Agent (Frontend Build)
**Role:** Booking UI implementation, step-by-step flow, form handling

**Deliverables:**
- `book/index.html` - All booking screens
- `booking.js` - TUKUBooking namespace with state management
- `booking.css` - Scoped styles following TUKU design system

**What Worked Well:**
- Vanilla JS pattern (no framework dependencies)
- Clean step-based navigation
- Consistent TUKU aesthetic (JetBrains Mono, blue accents)

**Instructions Needed Next Time:**
- Confirm form validation UX requirements (visual indicators, inline errors)
- Get copy deck sign-off before implementation
- Establish cancel/refund policy upfront

### Session 3 Agent (Current - Testing & Refinement)
**Role:** End-to-end testing, bug fixes, UX improvements, deployment

**Deliverables:**
- 4-hour cancel window implementation
- Required field indicators
- Full flow testing via browser automation
- This post-mortem document

**Challenges Faced:**
- Browser automation element clicking (required element refs)
- Cloudflare cache delays for CSS updates
- Dual directory sync requirements

**What Worked Well:**
- Browser automation for comprehensive testing
- Iterative refinement based on real-time user feedback
- Quick deployment cycle (commit → push → live in 30s)

**Instructions Needed Next Time:**
- Have user available for real-time testing feedback
- Establish test checklist before starting (edge cases, validation, mobile)
- Clarify deployment verification process

---

## Orchestration Analysis

### What Worked Well

1. **Phased Approach**
   - Phase 1: Research & Spec
   - Phase 2: Backend
   - Phase 3: Frontend
   - Phase 4: Testing
   - Phase 5: Deployment & CTAs

   Each phase had clear deliverables and natural handoff points.

2. **Documentation-First**
   - Spec document created before coding
   - Design audit captured existing patterns
   - README files for each component

3. **Real-Time Feedback Loop**
   - User tested live site between changes
   - Immediate feedback on UX issues (cancel button, required indicators)
   - Iterative refinement rather than big-bang release

4. **Browser Automation for Testing**
   - End-to-end flow validation
   - Screenshot documentation of each step
   - Caught issues like booked slot availability

### What Could Improve

1. **Upfront Requirements Gathering**
   - Service account limitations should have been researched in Phase 1
   - Copy/duration mismatch caught late
   - Cancel policy not defined until testing

2. **Test Checklist**
   - Edge cases discovered during testing, not planned
   - Mobile testing not explicitly covered
   - Form validation UX not specified in requirements

3. **Deployment Process**
   - Dual directory sync is error-prone
   - Should consider build script or GitHub Action
   - Cache invalidation needed documentation

4. **Session Handoffs**
   - Context loss between sessions
   - Decisions made in earlier sessions not fully documented
   - Would benefit from decision log in spec document

---

## Recommendations for Future Projects

### Process Improvements

1. **Pre-Build Research Phase**
   - Document ALL external API limitations before architecture
   - Create decision log for policy choices (cancel windows, validation, etc.)
   - Sign off on copy deck before any implementation

2. **Test Plan in Spec**
   - Include test matrix in specification document
   - Define edge cases upfront
   - Specify validation requirements explicitly

3. **Deployment Automation**
   - Create sync script for dual-directory projects
   - Add pre-commit hook to ensure sync
   - Document cache purge process

4. **Session Continuity**
   - Maintain running decision log
   - Update spec document with pivots/changes
   - Create handoff summary at session end

### Technical Recommendations

1. **Google Calendar Integration**
   - For future: evaluate OAuth 2.0 vs service account based on requirements
   - Document manual steps clearly in user guide
   - Consider email notification service for automated confirmations

2. **Form Validation**
   - Always include visual required indicators
   - Consider inline validation (not just on submit)
   - Document validation rules in spec

3. **Cancellation Policy**
   - Define policy before build
   - Implement time-based restrictions in backend AND frontend
   - Document policy in user-facing copy

---

## Files Created/Modified

### New Files
```
docs/specs/booking-system.md         # Full specification
docs/builds/booking-audit.md         # Design system audit
docs/builds/booking-postmortem.md    # This document
workers/                             # Complete backend
book/index.html                      # Production frontend
book/booking.js                      # Production JS
book/booking.css                     # Production CSS
website/book/                        # Development copies
```

### Modified Files
```
website/index.html                   # Added /book CTA
website/approach.html                # Added /book CTA
CLAUDE.md                            # Updated with booking info
```

---

## Metrics

| Metric | Value |
|--------|-------|
| Development Time | ~2 days |
| API Endpoints | 4 |
| Frontend Steps | 7 (landing, calendar, time, details, confirm, success, manage) |
| Lines of Code | ~1,500 (frontend + backend) |
| External Dependencies | 0 (frontend), minimal (backend) |
| Production Issues | 0 (post-deployment) |

---

## Conclusion

The booking system was successfully delivered with all core functionality operational. The main pivot (manual attendee workflow) was a reasonable tradeoff given service account limitations. The iterative testing approach caught UX issues (cancel button timing, required indicators) that improved the final product.

Key learnings center on upfront requirements gathering (especially for external API integrations) and maintaining continuity between development sessions. The phased approach and documentation-first methodology proved effective for a project of this complexity.

**Status:** Production-ready and live at https://tukugroup.com/book/
