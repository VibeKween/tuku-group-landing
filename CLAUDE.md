# CLAUDE.md

This file provides guidance to Claude Code when working with this TUKU GROUP landing page repository.

## Project Overview

This is the main TUKU GROUP landing page with an integrated private payment portal. The site maintains TUKU's ultra-minimal, manifesto-style design following the brand ethos "Craft over noise. Fewer, better, slower."

## 🚨 CRITICAL: Deployment Process

**MANDATORY FOR ALL CHANGES:**

This project has a dual directory structure that requires special deployment handling:

- **Development:** Work in `/website/` directory
- **Production:** Cloudflare Pages deploys from **root directory**

**EVERY FILE CHANGE REQUIRES:**
1. Modify files in `/website/` directory
2. Copy changed files to root for deployment
3. Commit both locations to prevent discrepancies

**Quick Reference:**
```bash
# Copy files to root after changes
cp website/index.html .
cp website/portfolio-approach.html .
cp -r website/css .
cp website/cloud-system-static.js .
cp website/favicon.ico .
cp -r website/fewer-better-slower .
cp -r website/ideas .
```

## Site Architecture

### Public Pages
- **Homepage** (`/`): Main manifesto-style landing page
- **Portfolio Approach** (`/portfolio-approach.html`): Methodology explanation page

### IDEAS Case Studies
- **IDEAS Hub** (`/ideas/`): Case studies overview with generative particle system
- **OF THE CULTURE** (`/ideas/of-the-culture/`): House brand case study with emergence visualization  
- **[REDACTED]** (`/ideas/redacted/`): 400-page documentation case study with precision accumulation
- **INVISIBLE SCAFFOLDING** (`/ideas/invisible-scaffolding/`): Philosophy methodology with network emergence

### Private Payment Portal
- **Location**: `/fewer-better-slower/` (non-discoverable URL for qualified leads)
- **Purpose**: Secure payment interface shared selectively via direct link
- **Design**: Accordion-style service selection with expandable details

## Payment Portal Features

### Service Offerings
1. **Initial Consultation** - $1,200
   - Full discovery and strategic scoping
   - Complete roadmap with clear milestones

2. **Two-Week Sprint** - $4,500
   - Focused execution on single milestone
   - Brand foundation, design system, platform build
   - Packages available for extended engagements

3. **Monthly Retainer** - $1,500
   - Ongoing guidance after project completion
   - Available to completed sprint clients only

### Customer Journey Flow
1. **"Begin with a call."** - Conversation to understand vision and determine fit
2. **"Move to discovery."** - Full consultation mapping scope and constraints
3. **"From there, we work in focused sprints."** - Two weeks per milestone
4. **"After the project, ongoing support is available."** - Continuity post-launch

### Technical Implementation
- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks)
- **Payment**: Stripe integration with secure API endpoints
- **Design**: TUKU blue accent colors with cloud background system
- **Validation**: Whitelist-based email validation with 50+ major providers

## Design System

### Colors
```css
--color-black: #000000    /* Primary text and backgrounds */
--color-white: #FFFFFF    /* Background and inverted text */
--color-blue-accent: #4A90E2  /* Payment buttons and accents */
--color-blue-light: #E8F4FD   /* Input focus backgrounds */
--color-gold: #C19A4B     /* Philosophy headers */
```

### Typography
- **Font**: JetBrains Mono throughout
- **Hierarchy**: h1 for main title, h2 for section headers
- **Philosophy Headers**: Gold accent spans with `.philosophy-header` class
- **Line Height**: 1.8 for body text, 1.5 for headers

### Layout
- **Max Width**: 600px centered container
- **Block Spacing**: 80px between sections
- **Button Spacing**: 2px between action buttons
- **Accordion Animation**: 0.3s ease transitions

## Development Workflow

### Local Development
1. Work in `/website/` directory
2. Test locally via `index.html` or local server
3. Use accordion interface to test service selection
4. Verify cloud background system functionality

### Deployment Process
1. **Make changes** in `/website/` directory
2. **Copy to root** using deployment commands above  
3. **Commit both** locations to git
4. **Push to main** branch for automatic Cloudflare Pages deployment

**Hosting Details:**
- **Production URL**: https://tukugroup.com
- **Preview URL**: https://tuku-group-landing.pages.dev
- **Legacy URL**: https://vibekween.github.io/tuku-group-landing/ (deprecated)
- **Platform**: Cloudflare Pages (migrated from GitHub Pages)
- **DNS**: Managed through Cloudflare with nameservers at GoDaddy

### Security Guidelines
- **NEVER commit** real Stripe API keys
- **Use placeholders** like `pk_test_REPLACE_WITH_YOUR_KEY`
- **Environment variables** for production credentials
- **Private portal** only accessible via direct `/fewer-better-slower/` link

## Content Strategy

### Brand Voice
- **Manifesto-style**: Direct statements without explanation
- **Philosophy-driven**: Each section communicates single concept
- **Intentional brevity**: Every word serves purpose
- **Professional tone**: Without corporate jargon

### Navigation Strategy
- **Public access**: Homepage and portfolio approach page
- **Private access**: Payment portal shared selectively
- **No public pricing**: Pricing only visible to qualified leads
- **Contact-first**: Emphasizes conversation before commerce

## File Structure

```
/
├── index.html                 # Production homepage
├── portfolio-approach.html    # Production portfolio page
├── fewer-better-slower/       # Production payment portal
├── css/                      # Production styles
├── images/                   # Production assets
├── website/                  # Development directory
│   ├── index.html            # Dev homepage
│   ├── portfolio-approach.html # Dev portfolio page
│   ├── fewer-better-slower/  # Dev payment portal
│   └── css/                  # Dev styles
└── CLAUDE.md                 # This file
```

## Key Integrations

### Cloud Background System
- **File**: `cloud-system-static.js`
- **Purpose**: Animated cloud background matching homepage
- **Control**: "what do you see?" refresh link

### Stripe Payment System
- **Files**: `payment.js`, API endpoints in `/api/`
- **Security**: PCI-compliant, no card data stored
- **Testing**: Use placeholder keys for development

### Accordion Interface
- **Behavior**: Single service expandable at a time
- **Content**: Detailed service descriptions on click
- **Animation**: Smooth height transitions with padding

## Enhanced Hero Image System (Nov 2024)

### Development Guidelines for IDEAS Pages

All IDEAS case study pages (`/ideas/*`) use an enhanced hero image system with p5.js generative art that maintains perfect cross-device reliability.

**Core Implementation Pattern:**
```css
/* Hero Container - Enhanced for Mobile */
.hero {
    position: relative;
    width: 100vw;
    height: 100vh;
    min-height: 100svh; /* Safe viewport height for iOS */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    contain: layout style paint; /* Performance optimization */
}

/* Canvas Performance Enhancement */
#hero-art canvas {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    display: block;
    transform: translateZ(0); /* GPU acceleration */
}
```

**Key Requirements When Modifying Hero Areas:**
1. **Always include** `min-height: 100svh` for iOS Safari compatibility
2. **Always use** `object-fit: cover` on canvas elements
3. **Always apply** `transform: translateZ(0)` for GPU acceleration
4. **Never use** `background-attachment: fixed` (causes mobile issues)
5. **Always test** on mobile devices after changes

**Environment Sync for IDEAS Pages:**
```bash
# After modifying any /ideas/ page:
cp -r website/ideas .
```

**Benefits of Enhanced System:**
- ✅ Eliminates mobile disappearing issues
- ✅ Consistent viewport coverage across devices  
- ✅ Improved performance with CSS containment
- ✅ Maintained generative art functionality
- ✅ GPU acceleration for smooth rendering

## Important Notes

- **No frameworks**: Pure HTML/CSS/JS maintains simplicity
- **Mobile-first**: Responsive design with breakpoints
- **SEO optimized**: Structured data and meta tags
- **Brand consistency**: All pages follow TUKU design principles
- **Private pricing**: Payment portal not linked from public pages

This architecture supports TUKU's philosophy of intentional craft while providing a secure, professional payment experience for qualified leads.