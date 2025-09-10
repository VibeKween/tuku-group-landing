# Split-Flap Terminal Display Component

## Overview
A vanilla JavaScript component that recreates nostalgic split-flap display boards from train stations and airports. Features smooth cascading animations with ultra-fluid character transitions, designed to integrate seamlessly with the Tuku Group landing page aesthetic.

## Implementation Details

### Core Features
- **Sequential Animation**: Characters animate left-to-right in cascading pattern
- **Smart Clearing System**: Two-pass animation ensures smooth transitions from longer to shorter phrases
- **Responsive Design**: Scales appropriately across all device breakpoints
- **Organic Timing**: Micro-variations create natural, mechanical feel
- **Visual Status Indicator**: Green blinking light with "IN PROGRESS" text

### Animation Specifications
```javascript
// Character Cycling Parameters
Regular characters: 6 cycles @ 70ms base speed
Spaces: 1 cycle @ 18ms (4x faster)
Clearing characters: 3 cycles @ 35ms (ultra-smooth deletion)
Emerging from space: 5 cycles @ 65ms (emphasis)

// Timing Variations
Base variance: ±5ms randomness for organic feel
Clearing stagger: 15ms offset between parallel deletions
Phase separation: 40ms pause between clearing and building
```

### Phrases Configuration
```javascript
this.phrases = [
  "ISLE OF VERT PUBLISHING",  // 23 characters (longest)
  "OF THE CULTURE",           // 14 characters
  "PLAIN VANILLE",            // 13 characters
  "FIELDBOTZ",                // 9 characters
  "[REDACTED]"                // 10 characters
];
```

### ✨ Scalability for Growing Client Lists
The component automatically scales to accommodate:
- **Any number of client names**: Simply add strings to the `phrases` array
- **Variable name lengths**: Component calculates `maxLength` dynamically from longest phrase
- **Long company names**: Display width adjusts automatically (tested up to 25+ characters)
- **Mixed content types**: Handles letters, numbers, spaces, and special characters

**Adding New Clients:**
```javascript
// Component automatically handles expansion
this.phrases = [
  "OF THE CULTURE",
  "CRYPTOGAINS", 
  "CDT GLOBAL",
  "[REDACTED]",
  "VERY LONG COMPANY NAME LLC",  // Automatically expands display
  "SHORT CO",                     // Handles shorter names seamlessly
  "NUMBERS & SYMBOLS 123"        // Special characters supported
];
```

### Responsive Breakpoints (Updated August 28, 2025)
```css
Desktop (1024px+):   12px font, 18px char width, 27px height
Tablet (768-1023px): 10px font, 16px char width, 25px height
Mobile (480-767px):  9px font, 13px char width, 22px height
Small (<480px):      7px font, 11px char width, 18px height

Status Text:         0.625rem (10px) - reduced from 0.75rem for improved visual hierarchy
```

## Integration Guidelines

### HTML Structure
```html
<section class="block">
    <div class="split-flap-container">
        <div class="split-flap-status">
            <div class="status-light"></div>
            <span class="status-text">IN PROGRESS</span>
        </div>
        <div class="split-flap-display" id="splitFlapDisplay"></div>
    </div>
</section>
```

### CSS Requirements
- JetBrains Mono font (already loaded in main page)
- Light gray borders (#ddd) for character slots
- Green status light (#00ff00) with 1.5s blink animation
- Maintains existing design system color palette

### JavaScript Initialization
```javascript
document.addEventListener('DOMContentLoaded', () => {
    new SplitFlapDisplay('splitFlapDisplay');
});
```

## Technical Architecture

### Class Structure
- `SplitFlapDisplay`: Main controller class
- `animateToPhrase()`: Two-pass animation system
- `animateCharacter()`: Individual character animation logic
- `startCycle()`: 4-second interval phrase cycling

### Key Innovations
1. **Parallel Clearing**: Multiple trailing characters clear simultaneously with stagger
2. **Context-Aware Timing**: Different speeds for clearing, building, and normal changes
3. **Visual Hierarchy**: Clear-first, build-second approach prevents jarring transitions
4. **Consistent Display Width**: Fixed width based on longest phrase prevents layout shift

## Performance Considerations
- **Lightweight**: Pure vanilla JavaScript, no dependencies
- **Efficient**: Only animates characters that actually change
- **Smooth**: 60fps-capable with optimized timing chains
- **Memory**: Minimal DOM manipulation, reuses existing elements

## Design Philosophy Alignment
- **Craft over noise**: Precise, intentional animations
- **Fewer, better, slower**: Deliberate pacing, quality transitions
- **Minimal aesthetic**: Clean typography, essential visual elements only
- **Professional discrete presence**: Complements rather than competes with main content

## Files
- `split-flap-test.html`: Standalone testing environment
- Component ready for integration into `index.html`
- CSS can be extracted to `css/main.css` if preferred
- No external dependencies beyond existing Google Fonts

## Usage Notes
- Component auto-starts on page load
- Self-contained with all styling included
- Designed to sit above footer section
- Maintains brand consistency with existing design system
- Terminal aesthetic pays homage to retro computing culture
- **Font size optimized August 24, 2025** for improved visual hierarchy
- **Fully scalable** for growing client portfolios - no rebuild required

## Maintenance & Updates
To add new clients or modify phrases:
1. Edit the `phrases` array in the JavaScript section of `index.html`
2. Component automatically recalculates display dimensions
3. No CSS or layout changes needed
4. Test new phrases at http://localhost:8081/ before deployment

## Component Isolation
**IMPORTANT**: This component is specific to the 01-LANDING-PAGE only.
- Not shared with 02-LANDING-PAGE or 03-ECOMMERCE projects
- Independent development without affecting concurrent work
- Can be templated in `/ops/templates/` for future landing pages

---

*Component developed for Tuku Group landing page - Updated August 28, 2025*