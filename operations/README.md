# Tuku Group — Creative House Landing Page

## Project Overview

A one-page manifesto website for Tuku Group, the parent company and creative house that operates as both holder of cultural ventures (e.g., OF THE CULTURE) and selective advisor to emerging small labels and early brands.

**Purpose**: Replace conversations about brand specifics with a higher-order reference point communicating Tuku Group's vision, positioning, and invitation to engage.

**SEO Optimized**: Enterprise-level SEO implementation with comprehensive structured data, enhanced meta tags, and semantic HTML for maximum search visibility and entity recognition.

---

## Design Reference

**Primary Inspiration**: [YZY Money](https://money.yeezy.com) — ultra-minimal, manifesto-driven, type-forward approach

**Key Design Principles from Reference**:
- Stripped-down, conceptual aesthetic
- Function at core while breaking traditional composition rules
- Text-minimal interface with focus on typography
- Bold, declarative statements
- Immersive, art-like experience
- Endless whitespace and breathing room

---

## Brand Ethos

- **Craft over noise** — fewer, better, slower
- **Culture as compass** — rooted in present-tense signals, designed for longevity  
- **Independent by choice** — decentralized thinking, sovereign in approach

**Tone**: Elegant, sophisticated, quietly declarative

---

## Final Content Structure

### 1. Hero Statement
```
TUKU GROUP
Independent ideas. Thoughtful brands. Assembled with intention.
```

### 2. About Tuku Group
```
A creative house for ventures that matter.
We make real what we believe in and guide brands that share our ethos.
```

### 3. Philosophy
```
Craft over noise. Fewer, better, slower.
Culture as compass. Present-tense signals, designed to endure.
Independent by choice. Decentralized thinking, sovereign in approach.
```
*Note: Philosophy headers ("Craft over noise.", "Culture as compass.", "Independent by choice.") are styled in brand gold for emphasis.*

### 4. Our Work
```
We selectively provide guidance to emerging labels, helping clarify vision, refine execution, and create resonance.
```

### 5. Engage
```
A conversation, then a plan.
If the fit is right, we scope something small and ship it well.
```

### 6. Contact & Footer
```
contact@tukugroup.com
(Email subject: "Start a conversation — Tuku Group")

© 2025 Tuku Group, LLC. Independent and privately held.
```

---

## Visual Design System

### Colors
- **Primary Black**: `#000000`
- **Primary White**: `#FFFFFF`  
- **Gold Accent**: `#C19A4B` (used for philosophy headers)

### Typography
- **Primary Font**: JetBrains Mono (monospace)
- **Approach**: Ultra-minimal, single-font system with generous spacing and hierarchy through size and weight

### Layout Principles
- **Sequential text blocks** — each concept in its own minimal section
- **Maximum 600px width** — single column, centered layout
- **Massive whitespace** — 80px between blocks for breathing room
- **Zero visual noise** — pure text-only focus
- **Manifesto flow** — story unfolds as you scroll

---

## Technical Specifications

### Page Structure
```
/ (Root)
├── Hero Section
├── About Section  
├── Philosophy Section
├── Our Work Section
├── Engage Section
└── Footer
```

### Responsive Approach
- **Mobile-first** design methodology
- **Typography-focused** responsive scaling
- **Minimal breakpoints** to maintain design integrity
- **Touch-friendly** CTA elements

### Performance Goals
- **Sub-2 second** load time
- **Minimal dependencies** (typography, basic CSS)
- **Lightweight footprint** aligned with minimal aesthetic

### SEO Implementation
- **Enhanced Meta Tags**: Extended title, comprehensive descriptions, Open Graph/Twitter Cards for social sharing
- **JSON-LD Structured Data**: Organization schema with complete business entity information and subsidiary relationships
- **Semantic HTML**: Proper heading hierarchy with accessibility-compliant structure for screen readers
- **Entity Relationships**: Schema markup connecting Tuku Group to OF THE CULTURE subsidiary
- **Contact Information**: Structured contact data with email and business inquiry specifications
- **Mobile Optimization**: Google mobile-first indexing compliance with performance optimization

---

## Content Guidelines

### Voice Principles
- **Quiet authority** — aspirational without hype
- **No product detail** — focus on Tuku at parent level
- **Declarative statements** over explanatory copy
- **Intentional brevity** — every word deliberate

### Copy Rules
- Maximum 2-3 lines per thought
- Avoid industry jargon or marketing speak
- Lead with philosophy, follow with application
- Single call-to-action throughout: "Start a conversation"

---

## Development Approach

### Phase 1: Foundation
- [ ] Set up project structure
- [ ] Implement typography system
- [ ] Create base layout with proper spacing
- [ ] Establish color system

### Phase 2: Content Integration
- [ ] Build hero section with primary statement
- [ ] Implement manifesto sections with proper hierarchy
- [ ] Add contact integration (mailto or form)
- [ ] Test responsive behavior

### Phase 3: Refinement
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Accessibility review
- [ ] Final copy and spacing adjustments

---

## Success Metrics

### Primary Goals
- **Clear positioning** of Tuku Group as creative house
- **Memorable first impression** aligned with brand ethos
- **Qualified engagement** through conversation starter CTA

### Secondary Goals
- **Brand differentiation** from typical agency/studio sites
- **Cultural resonance** with target audience
- **Foundation** for future Tuku Group digital presence

---

## File Structure
```
/
├── index.html
├── signals/                    # SIGNALS cultural intelligence blog
│   ├── index.html             # Clean /signals/ URL
│   ├── signals.css            # SIGNALS-specific styling
│   └── js/
│       └── signals.js         # Modal system, search, interactions
├── css/
│   └── main.css              # Shared styling
├── fonts/ (ready for custom fonts)
├── images/ (ready for assets)
├── docs/                     # Documentation and session archives
├── .gitignore
├── README.md
├── DEVELOPMENT-LOG.md
└── CLAUDE.md                # Project instructions for Claude Code
```

## Live Site

**Production URL**: https://tukugroup.com
**Preview URL**: https://tuku-group-landing.pages.dev
**Legacy URL**: https://vibekween.github.io/tuku-group-landing/ (deprecated)
**SIGNALS Blog**: https://tukugroup.com/signals/
**Repository**: https://github.com/VibeKween/tuku-group-landing (private)

## SIGNALS Cultural Intelligence Blog

**Purpose**: "Cultural intelligence in the age of code" - Present-tense insights and observations that inform TUKU's creative work.

**Features**:
- Unified design system with editorial cohesion and clean visual hierarchy
- Modal-based reading experience with comprehensive text sizing controls (A/A toggle)
- Clean, minimal design with systematic gold accent usage and hover interactions
- Search functionality with overlay interface
- Mobile-responsive typography with single-line status descriptions
- Article categorization by Research and Reflection with consistent piece type indicators
- Perfect modal header spacing with proper visual rhythm
- Founder's note integration
- Root-cause development methodology ensuring clean, maintainable architecture

**Content Structure**:
- Research essays exploring cultural patterns and methodologies
- Reflection pieces on authenticity, adaptation, and agency
- Chronological organization (newest first)
- Declarative, concise excerpts matching homepage tone

## Deployment

The site automatically deploys via Cloudflare Pages when changes are pushed to the main branch. Migrated from GitHub Pages with legacy URL deprecated.

---

## Contact Integration

**Primary CTA**: Email link to `contact@tukugroup.com`
**Fallback**: Simple contact form (if email client issues)
**Approach**: Maintain minimal aesthetic while ensuring functionality

---

*Built with intention. Fewer, better, slower.*