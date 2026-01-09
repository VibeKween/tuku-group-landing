# Case Study Skill

Invoke with: `/case-study [client-name]`

## Purpose

Create a complete case study package for the IDEAS section at tukugroup.com/ideas, including:
- Full case study detail page with generative art
- Thumbnail card with mini generative art for IDEAS hub
- Content aligned with engagement scope and deliverables

## Process

### Phase 1: Discovery & Content Development

1. **Gather Source Materials**
   - Scope of engagement document
   - Invoice/deliverables record
   - Project methodology documentation
   - Key metrics and outcomes
   - Brand colors (if client-specific)

2. **Extract Key Elements**
   - Engagement type label (e.g., "strategic identity", "house brand development")
   - Headline stats (3 metrics for thumbnail)
   - Challenge/context framing
   - Methodology description
   - Deliverables/artifacts
   - ROI/value proposition

3. **Validate Copy Against Source**
   - Intro must parallel scope of engagement language
   - Avoid time-specific claims unless verified
   - Frame positively (readiness vs. problems)
   - ROI should reflect actual ongoing value, not just immediate deliverables

### Phase 2: Generative Art Concept

**Requirements:**
- Thumbnail art must be visually DISTINCT from existing case studies
- Full page hero art must tell a DIFFERENT story than thumbnail
- Art should conceptually connect to the methodology/outcome
- Both must loop continuously (no stopping)
- Deliberate, contemplative pace

**Existing Art Patterns (avoid duplication):**
| Case Study | Thumbnail | Full Page |
|------------|-----------|-----------|
| OF THE CULTURE | Organic brush strokes | Orbital emergence |
| [REDACTED] | Pulsing grid | Precision accumulation |
| INVISIBLE SCAFFOLDING | Network connections | Network emergence |
| VOYJ | Signal streams | Convergence field |

**Art Concept Development:**
1. Identify the core methodology metaphor
2. Design thumbnail to represent the PROCESS (data, analysis, discovery)
3. Design hero to represent the OUTCOME (structure, alignment, clarity)
4. Use client brand colors when available
5. Test both at deliberate speed - should feel intentional, not rushed

### Phase 3: Technical Implementation

**Directory Structure:**
```
/website/ideas/[client-slug]/
└── index.html    # Full case study page
```

**Case Study Page Structure:**
```html
<!-- Navigation -->
<a href="../" class="nav-back">← IDEAS IN MOTION</a>

<!-- Hero with generative art -->
<section class="hero">
    <div id="hero-art"></div>
    <div class="hero-content">
        <h1>[HEADLINE]</h1>
        <p class="subtitle">[Methodology description]</p>
    </div>
    <div class="art-notation">
        [ art concept name ]<br>
        line 2<br>
        line 3<br>
        line 4
    </div>
</section>

<!-- Content sections in order: -->
1. [ the challenge ]
2. [ by the numbers ] - spec-grid with 3-6 metrics
3. [ what we questioned ] - bullet list
4. [ the methodology ] - if distinct methodology
5. [ what emerged ] - outcomes/deliverables
6. [ artifacts delivered ] - tangible outputs
7. [ the philosophy ] - art explanation
8. [ return on investment ]
```

**Hub Card Structure (in /website/ideas/index.html):**
```html
<article class="case-study-item">
    <div class="case-art" id="[clientSlug]Art"></div>
    <div class="case-content">
        <div class="case-meta">[ engagement type ]</div>
        <h3>[CLIENT NAME]</h3>
        <p class="case-description">[One sentence description]</p>
        <div class="case-stats">
            <!-- 3 stat items -->
        </div>
        <a href="/ideas/[client-slug]" class="case-link">view case study →</a>
    </div>
</article>
```

**JavaScript Sketch Pattern:**
```javascript
const [clientSlug]Sketch = (p) => {
    // Setup with container sizing
    p.setup = () => {
        const container = document.getElementById('[clientSlug]Art');
        const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
        canvas.parent('[clientSlug]Art');
        // Initialize particles/elements
    };

    // Continuous draw loop (no stopping)
    p.draw = () => {
        // Soft fade for trails
        p.fill(250, 248, 242, 25);
        p.noStroke();
        p.rect(0, 0, p.width, p.height);
        // Animation logic
    };

    p.windowResized = () => {
        const container = document.getElementById('[clientSlug]Art');
        if (container) {
            p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        }
    };
};
```

### Phase 4: Integration

1. **Add to IDEAS Hub**
   - Insert card HTML (newest case study first in list)
   - Add sketch function to JavaScript section
   - Add container ID to initialization array
   - Add sketch initialization call

2. **Font Size Consistency**
   - Hero h1: 48px desktop, 28px tablet, 24px mobile
   - Match all other sizes to existing case studies

### Phase 5: SEO & Discoverability

1. **Meta Tags (Required)**
   - Title tag with client name + TUKU GROUP
   - Meta description (under 160 chars, include key metrics)
   - Meta keywords (5-8 relevant terms)
   - Canonical URL
   - Robots: index, follow
   - Theme color (client brand color if available)

2. **Open Graph / Facebook**
   - og:type = article
   - og:title, og:description, og:url
   - og:image with width (1200) and height (630)
   - og:image:alt (accessibility)
   - og:site_name, og:locale
   - article:publisher, article:section, article:tag (3-4 tags)

3. **Custom OG Image (Share Image)**

   Create a unique share image using the OG capture tool:

   a. **Create capture HTML** at `/website/images/og-capture/[client-slug]-og.html`
      - Copy thumbnail art code from IDEAS hub
      - Set canvas size to 1200x630 (OG standard)
      - Add 'S' key handler to save as PNG
      - Match exact colors from thumbnail

   b. **Generate the image**
      - Open the HTML file in browser
      - Let animation build up to desired state
      - Press **'S'** to save as PNG (downloads automatically)

   c. **Deploy the image**
      - Copy PNG to `/website/images/` and `/images/`
      - Update og:image and twitter:image URLs to new image

   **Reference captures:** `/website/images/og-capture/`
   - `voyj-og.html` - Signal streams
   - `of-the-culture-og.html` - Greyscale brush strokes
   - `redacted-og.html` - Pulsing grid
   - `invisible-scaffolding-og.html` - Network connections

4. **Twitter Cards**
   - twitter:card = summary_large_image
   - twitter:site, twitter:creator
   - twitter:title, twitter:description
   - twitter:image, twitter:image:alt

5. **Structured Data (JSON-LD)**
   - @type: Article
   - headline, description, image
   - author (reference org), publisher (with logo)
   - mainEntityOfPage
   - articleSection: "Case Studies"
   - keywords array
   - about (Service schema)

6. **Site-Level Updates**
   - Update sitemap.xml with new case study URL
   - Update llm.txt with case study summary
   - Google Analytics (GA4) included in page

### Phase 6: Testing

1. Start local server: `python3 -m http.server 8000`
2. Test URLs:
   - Hub: `http://localhost:8000/ideas/`
   - Detail: `http://localhost:8000/ideas/[client-slug]/`
3. Verify:
   - [ ] Thumbnail art loops continuously
   - [ ] Hero art runs at deliberate pace
   - [ ] Navigation links work
   - [ ] Responsive behavior on mobile
   - [ ] Art is visually distinct from other case studies
   - [ ] Content matches source materials
   - [ ] Structured data validates (use Google's Rich Results Test)

### Phase 7: Deployment

**CRITICAL: Dual directory structure**

```bash
# After all changes in /website/, copy to root:
cp -r /website/ideas /

# Verify:
ls -la /ideas/[client-slug]/
```

**Production Approval Gate:**
```
🚨 PRODUCTION DEPLOYMENT APPROVAL REQUIRED 🚨

Changes ready for production:
- New case study: [CLIENT NAME]
- Updated IDEAS hub with new card
- Local testing: Completed
- Files copied to root: Yes

⚠️  This will deploy to live site (tukugroup.com/ideas)

Proceed with production deployment? (Requires explicit approval)
```

## Checklist

### Content & Art
- [ ] Source materials gathered and reviewed
- [ ] Content drafted and validated against scope
- [ ] Thumbnail art concept (distinct from existing)
- [ ] Hero art concept (different story than thumbnail)
- [ ] Case study page created
- [ ] Hub card and sketch added
- [ ] Font sizes match existing case studies
- [ ] Section order matches pattern (philosophy before ROI)
- [ ] Art animations loop and run at deliberate pace

### SEO & Discoverability
- [ ] Meta tags complete (title, description, keywords, canonical)
- [ ] Open Graph tags with image dimensions and alt text
- [ ] Custom OG image created (capture tool → press 'S' → deploy PNG)
- [ ] Twitter Cards configured
- [ ] Structured data (JSON-LD Article schema) added
- [ ] sitemap.xml updated with new URL
- [ ] llm.txt updated with case study summary
- [ ] Google Analytics included

### Deployment
- [ ] Local testing complete
- [ ] Structured data validates in Rich Results Test
- [ ] Files copied to root
- [ ] User approval for production deployment

## Refinement Notes

Based on Voyj case study development:

1. **Copy framing matters** - Match language from scope of engagement documents
2. **Art must be distinct** - Don't create variations of existing patterns
3. **Thumbnail vs Hero** - Should tell different stories (process vs outcome)
4. **Speed is deliberate** - Animations should feel contemplative, not rushed
5. **No literal shapes** - Art should suggest structure through accumulated trails, not explicit drawing
6. **Test comparatively** - View alongside other case studies to ensure differentiation
