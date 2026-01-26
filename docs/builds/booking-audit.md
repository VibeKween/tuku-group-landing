# Booking System Audit

**Feature:** Booking System
**Date:** 2026-01-25
**Phase:** 1 - Research

---

## CSS Design System

### Color Tokens

```css
/* Core Brand */
--color-black: #000000      /* Primary text, borders */
--color-white: #FFFFFF      /* Backgrounds */
--color-gold: #C19A4B       /* Philosophy headers, accents, validation errors */

/* TUKU Blue Palette (for interactive elements) */
--color-blue-light: #f0f9ff     /* Light backgrounds, focus states */
--color-blue-medium: #e0f2fe    /* Selected states */
--color-blue-accent: #5691c8    /* Primary buttons, links */
--color-blue-deep: #4a7ba7      /* Hover states, deeper accents */

/* Greys (IDEAS pages) */
--color-grey: #4A4A4A           /* Body text on IDEAS pages */
--color-grey-light: #808080     /* Secondary text, insights */
```

### Typography

```css
/* Font Family */
font-family: 'JetBrains Mono', 'Courier New', monospace;

/* Font Weights */
300 - Light (cloud refresh link)
400 - Regular (body text, buttons)
500 - Medium (labels, status text)
600 - Semibold (h1, h2 headers)

/* Font Sizes */
2.5rem / 40px - h1 desktop
2rem / 32px   - h1 mobile
1rem / 16px   - Body text, buttons, service names
0.95rem       - Slightly reduced body
0.875rem      - Connect CTA button
0.85rem       - Field errors, service details
0.8rem        - Notes
0.75rem       - Footer text, labels, cloud refresh
0.7rem        - Cloud refresh mobile

/* Line Heights */
1.0  - h1 headers
1.4  - CTA buttons, compact text
1.5  - Body paragraphs (main.css)
1.6  - Case study descriptions
1.8  - Body paragraphs (payment.css, IDEAS)

/* Letter Spacing */
-0.02em - h1 headers
0       - Body text
0.05em  - Section labels
0.1em   - Labels, status text
0.5px   - Case meta labels
```

### Spacing Tokens

```css
/* Page Layout */
max-width: 600px          /* Content container */
padding: 40px 20px        /* Desktop page padding */
padding: 30px 16px        /* Mobile page padding */

/* Block Spacing */
margin-bottom: 80px       /* Between content blocks desktop */
margin-bottom: 60px       /* Between content blocks mobile */
margin-bottom: 40px       /* Last block, footer spacing */

/* Footer */
margin-top: 120px         /* Footer top margin desktop */
margin-top: 80px          /* Footer top margin mobile */

/* Component Spacing */
gap: 40px                 /* Dual CTA container desktop */
gap: 30px                 /* Dual CTA container mobile */
gap: 20px                 /* Service cards, split-flap */
gap: 2px                  /* Flap characters, button spacing */

/* Form Spacing */
margin-bottom: 4px        /* Input to error message */
margin-bottom: 16px       /* Error message to next field */
margin-bottom: 20px       /* Section label to content */
padding: 12px             /* Input padding */
padding: 12px 24px        /* Primary button padding */
```

### Breakpoints

```css
/* Primary Breakpoint */
@media (max-width: 768px)   /* Mobile styles */

/* Additional Breakpoints (IDEAS pages) */
@media (max-width: 480px)   /* Small mobile */
@media (min-width: 480px)   /* Tablet up */
@media (min-width: 1024px)  /* Desktop up */
@media (max-width: 1023px)  /* Tablet down */
@media (max-width: 767px)   /* Phablet down */
@media (max-width: 479px)   /* Small phone */
```

### Component Patterns

#### Primary Button (Blue)
```css
.btn-primary, .connect-cta, .dual-cta-link.primary {
  display: inline-block;
  background: var(--color-blue-accent);  /* #5691c8 or #4a7ba7 */
  color: #ffffff;
  border: 2px solid var(--color-blue-accent);
  padding: 12px 24px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem - 1rem;
  font-weight: 400;
  text-decoration: none;
  border-radius: 0;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-blue-deep);  /* #4a7ba7 or #3a6b97 */
  border-color: var(--color-blue-deep);
}
```

#### Secondary Button / Link Style
```css
.btn-secondary, .dual-cta-link.secondary {
  background: transparent;
  color: #4a7ba7;
  border: none;
  padding: 12px 8px;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.btn-secondary:hover {
  opacity: 0.7;
  text-decoration-thickness: 2px;
}
```

#### Form Inputs
```css
input[type="text"], input[type="email"] {
  width: 100%;
  padding: 12px;
  margin-bottom: 4px;
  background: transparent;
  border: 1px solid var(--color-black);
  color: var(--color-black);
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  outline: none;
  transition: all 0.2s ease;
}

input:focus {
  border-color: var(--color-blue-accent);
  background: var(--color-blue-light);
}

input.error {
  border-color: var(--color-gold);
  background: rgba(193, 154, 75, 0.05);
}
```

#### Field Errors
```css
.field-error {
  padding: 4px 0 8px 0;
  margin-bottom: 16px;
  color: var(--color-gold);
  font-size: 0.85rem;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 400;
  line-height: 1.5;
  display: none;
}

.field-error.visible {
  display: block;
}
```

#### Philosophy Headers (Gold Accent)
```css
.philosophy-header, .section-label {
  color: var(--color-gold);
}
```

---

## CTA Inventory

### Homepage (index.html)

| Location | Text | Type | Class | Action |
|----------|------|------|-------|--------|
| Hero area | "what do you see?" | Link | `.cloud-refresh-link` | Regenerate clouds |
| Mid-page | "[ ideas in motion ]" | Link | `.inline-link` | Navigate to /ideas/ |
| Mid-page | "Learn about our approach" | Link | `.inline-link` | Navigate to approach.html |
| Main CTA | "Start a conversation" | Button | `.connect-cta` | mailto: email |

### Approach Page (approach.html)

| Location | Text | Type | Class | Action |
|----------|------|------|-------|--------|
| Hero area | "what do you see?" | Link | `.cloud-refresh-link` | Regenerate clouds |
| Main CTA | "Start a conversation" | Button | `.connect-cta` | mailto: email |

### Payment Portal (/fewer-better-slower/)

| Location | Text | Type | Class | Action |
|----------|------|------|-------|--------|
| Hero area | "what do you see?" | Link | `.cloud-refresh-link` | Regenerate clouds |
| Main CTA | "Schedule your project" | Button | `.btn-primary` | mailto: email |

### IDEAS Hub (/ideas/)

| Location | Text | Type | Class | Action |
|----------|------|------|-------|--------|
| Navigation | "← TUKU GROUP" | Link | `.nav-back` | Navigate to homepage |
| Per case study | "view case study →" | Link | `.case-link` | Navigate to case study |

---

## CTA Placement Recommendations for Booking

### Recommended Placements

1. **Homepage - Replace or Augment Main CTA**
   - Current: "Start a conversation" → mailto
   - Option A: Change to "Book a consultation" → /book
   - Option B: Dual CTA with "Book a consultation" (primary) + "Send an email" (secondary)
   - **Recommendation:** Option B - provides choice without removing email path

2. **Approach Page - Same Pattern**
   - Mirror homepage treatment for consistency

3. **Payment Portal - Keep Existing**
   - The `/fewer-better-slower/` page serves qualified leads who likely don't need booking
   - Consider: Add subtle "Or schedule a call first" link below main CTA

4. **IDEAS Pages - No Booking CTA**
   - Editorial context; booking CTA would feel intrusive
   - The nav-back link to homepage is sufficient navigation
   - **Recommendation:** Do not add booking CTAs to IDEAS pages

### Implementation Notes

**Dual CTA Pattern (exists in main.css):**
```html
<section class="block dual-cta-section enhanced">
  <div class="dual-cta-container">
    <a href="/book" class="dual-cta-link primary">Book a consultation</a>
    <a href="mailto:..." class="dual-cta-link secondary">Send an email</a>
  </div>
</section>
```

---

## Design System Variations

### Main Site vs IDEAS Pages

| Aspect | Main Site | IDEAS Pages |
|--------|-----------|-------------|
| Background | Cloud system | Generative art (p5.js) |
| Navigation | None (single page) | `.nav-back` back link |
| Container | `.page` (600px max) | `.content-section` (600px) + full-width hero |
| Typography | Line-height 1.5 | Line-height 1.8 |
| Section labels | `.philosophy-header` (gold) | `.section-label` (gold, smaller) |
| Footer | `.footer` class | Same pattern, different context |

### Booking Page Recommendation

Use **Main Site** design system:
- Cloud background
- `.page` container (600px)
- Standard typography (line-height 1.5)
- Blue accent for interactive elements
- Gold for validation/philosophy headers
- No generative art (keep simple)

---

## Existing Patterns to Reuse

### From Payment Page

1. **Step-based flow** - `.step` with `.active` class
2. **Service cards** - `.service-card` with selection state
3. **Form validation** - Real-time with `.error` and `.field-error.visible`
4. **Button states** - Disabled, loading
5. **Summary display** - `.summary` with `.summary-row`

### From Main Site

1. **Cloud background** - Copy `cloud-system-static.js` and related CSS
2. **Cloud refresh link** - `.cloud-refresh-link`
3. **Page structure** - `.page` > `.block` > content
4. **CTA section** - `.cta-section` with `.connect-cta`
5. **Footer** - `.footer` with reduced opacity

### From IDEAS (Do Not Use)

- Generative art backgrounds
- `.nav-back` navigation (might add later if needed)
- `.case-link` styles

---

## Technical Notes

### JavaScript Pattern
The existing payment.js uses a simple state object pattern:
```javascript
let state = {
  currentStep: 'select',
  selectedService: null,
  name: '',
  email: ''
};
```

Booking should follow same pattern:
```javascript
const TUKUBooking = {
  config: { apiBase: '...' },
  state: {
    currentStep: 'landing',
    selectedDate: null,
    selectedTime: null,
    name: '',
    email: '',
    context: ''
  },
  init: function() { /* ... */ }
};
```

### API Integration
- Backend will be Cloudflare Workers
- Frontend fetches via `fetch()` to `/api/availability`, `/api/book`
- Error handling with user-friendly messages in TUKU voice

### Calendar Component
- Custom-built, no external dependencies
- Month grid with available dates highlighted in blue
- Previous/next month navigation
- Keyboard accessible

---

## Files to Create

### Phase 3 (Frontend)

```
website/
├── book/
│   └── index.html          # Booking flow (all steps)
├── js/
│   └── booking.js          # TUKUBooking namespace
└── css/
    └── booking.css         # Scoped styles (optional, may use main.css patterns)
```

### Phase 2 (Backend)

```
workers/
├── src/
│   ├── index.js            # Router
│   ├── handlers/
│   │   ├── availability.js
│   │   ├── book.js
│   │   └── manage.js
│   └── services/
│       └── calendar.js     # Google Calendar integration
├── wrangler.toml
└── package.json
```

---

## Decisions (Resolved)

1. **Booking ID format** — Short code `TK-XXXXXX` ✓

2. **Confirmation email** — Google Calendar invite only (privacy-first) ✓

3. **Time zone handling** — Always Pacific Time with clear labeling ✓

4. **Buffer between slots** — 25-minute consultations with 5-minute buffer (30-min slot spacing) ✓

5. **Concurrent booking race condition** — Check availability at confirmation time; show error if taken ✓
