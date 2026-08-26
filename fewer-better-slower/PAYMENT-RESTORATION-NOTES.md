# Payment Functionality Restoration Guide

## Overview
This document outlines how to restore full payment processing to the TUKU Group services page when ready to implement server-side functionality.

## Current State (October 7, 2025)
**GitHub Pages Compatible Version:**
- Service selection preserved (consultation, sprint, retainer)
- "Your information" form removed
- Payment form removed  
- "Schedule your project" CTA links to email
- All GA4 service tracking preserved

## What Was Removed for GitHub Pages Compatibility

### 1. Customer Information Form
```html
<!-- REMOVED: Customer info collection -->
<section class="block form-section">
  <p><span class="section-label">Your information</span></p>
  <form id="contact-form">
    <input type="text" id="name" name="name" placeholder="Name" required>
    <input type="email" id="email" name="email" placeholder="Email" required>
  </form>
  <button id="continue-btn" class="btn-primary" disabled>Continue to payment</button>
</section>
```

### 2. Payment Processing Section
```html
<!-- REMOVED: Stripe payment form -->
<section id="step-payment" class="step">
  <div class="summary">...</div>
  <form id="payment-form">
    <div id="card-element" class="stripe-element"></div>
    <button type="submit" id="submit-btn">Complete payment</button>
  </form>
</section>
```

### 3. Success/Confirmation Page
```html
<!-- REMOVED: Payment success flow -->
<section id="step-success" class="step">
  <div class="success">
    <h2>Thank you for your order</h2>
    <div class="receipt">Receipt ID: <span id="receipt-id"></span></div>
  </div>
</section>
```

### 4. Stripe Integration
```html
<!-- REMOVED: Stripe script -->
<script src="https://js.stripe.com/v3/"></script>
```

## Payment Restoration Steps

### When Ready to Implement Server-Side Payment:

1. **Choose Hosting Platform with Server Support:**
   - Vercel (recommended)
   - Netlify Functions 
   - Railway
   - Traditional VPS

2. **Restore Removed HTML Sections:**
   - Add back customer information form
   - Restore payment processing section
   - Implement success/confirmation flow

3. **Update JavaScript Logic:**
   - Restore form validation (`payment.js`)
   - Implement Stripe payment processing
   - Add step navigation between service → info → payment → success

4. **Server-Side Components:**
   - Payment intent creation endpoint
   - Webhook handling for payment confirmation
   - Email notifications
   - Receipt generation

5. **Update GA4 Events:**
   - Change `schedule_project` back to `payment_initiated`
   - Add payment success tracking
   - Restore multi-step funnel analytics

## File References
- **Original payment.js**: Contains all form logic and Stripe integration
- **Original payment.css**: Has all payment form styling preserved
- **services.json**: Service definitions and pricing intact
- **Stripe configuration**: Webhook endpoints and API keys needed

## Service Selection Logic (Preserved)
The core service selection functionality remains intact:
- Dynamic service loading from `config/services.json`
- Service package click tracking
- Price calculation and display
- All GA4 service selection events

## Notes
- All styling in `payment.css` preserved for easy restoration
- Service definitions in JSON format ready for payment integration
- GA4 tracking infrastructure ready for conversion funnel restoration
- Email subjects and branding maintained for consistency

**Restoration Estimate**: 2-3 hours development time once hosting platform selected.

## Follow-up (2026-08-25)

Found during an unrelated full-site walkthrough: `payment.js`'s
`setupEventListeners()` still calls `document.getElementById('name')` /
`'email'` / `'continue-btn'` / `'back-btn'` / `'payment-form')` -
all elements this file's own removal list above says were deliberately
stripped from the HTML. Since none of those IDs exist, the very first line
throws an uncaught `TypeError` on every page load, which aborts the rest of
that `DOMContentLoaded` handler - so `initStripe()` never runs either. This
doesn't break anything currently visible (the live page only needs
`renderServices()`, which runs *before* `setupEventListeners()` in that same
handler and completes fine; the "Schedule your project" CTA is a plain
`mailto:` link needing no JS), but it does throw a real console error on
every load of this page.

User's call: rather than patch `payment.js` in place, take the whole
`/fewer-better-slower/` page off production until ready to restore full
payment processing per the plan above - not a code fix, a page-availability
decision. **Deferred to a future session, not started.**

**Important gotcha for whoever picks this up**: the root-level
`fewer-better-slower/` (the copy Cloudflare Pages actually serves) and this
`website/fewer-better-slower/` copy have drifted - `payment.js` differs
(root has newer, updated service names/descriptions/pricing display logic;
`website/` is stale), and this very file
(`PAYMENT-RESTORATION-NOTES.md`) only exists in the root copy, not here.
Before taking anything down, diff root vs `website/` for this directory and
reconcile `website/` to match root's more current content first - otherwise
"preserve the source for later" ends up preserving the wrong version.