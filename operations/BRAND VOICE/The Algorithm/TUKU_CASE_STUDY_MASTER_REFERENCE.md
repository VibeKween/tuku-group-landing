# TUKU CASE STUDY: COMPLETE REFERENCE

**Version:** 2.0 (Consolidated Master)  
**Created:** November 7, 2025  
**Purpose:** Single source of truth for creating TUKU GROUP case studies

---

## Quick Start

**New to this?** Read sections in order: Philosophy → Workflow → Templates  
**Creating a case study now?** Jump to "Complete Prompt Template" (bottom)  
**Need philosophy reminder?** Read "Core Decision Filters" (next section)

---

## PART 1: CORE PHILOSOPHY

### The TUKU Question

**"How can we do this DIFFERENTLY in a way that yields a result worth celebrating, noticing, and studying - rather than fitting into a pre-existing structure or norm?"**

### Four Decision Filters

Run every case study decision through these:

**1. Core Filter**  
Are we questioning the format or accepting it? Traditional case studies show screenshots. We build generative art that proves computational capability.

**2. Outcome Test**  
Will this be worth celebrating, noticing, and studying? Not just "nice portfolio piece" but actually demonstrates something.

**3. Integrity Check**  
Can we explain how this came together with complete honesty? AI-human collaboration shown through unified voice, not process narration.

**4. Demonstration Test**  
Does this prove our thinking or just claim it? The algorithmic art IS the proof of computational sophistication.

### Design Philosophy: Systematic Restraint

**Visual language:**
- Accumulation over decoration
- Space as active material (vast breathing room)
- Typography as clinical notation
- Limited palette (color as data)
- Painstaking craft visible in precision

**Application to case studies:**
- Every element positioned with master-level care
- Section labels: lowercase with brackets `[ the challenge ]`
- Grid-based structure with measured restraint
- Nothing exists without serving the whole

### When to Question Structures

✅ **Question when:**
- Structure limits the outcome
- You can articulate why different is better
- You can build the alternative with integrity

❌ **Don't question when:**
- Just to be different
- Structure actually works well
- Can't explain why better

**Goal:** Build what works better, not create chaos

---

## PART 2: TYPOGRAPHY SYSTEM

### Font Hierarchy (Exactly 8 Sizes)

```
Display/Headers:
• H1 Main Title: 48px - Bold 700, Courier, Letter-spacing: 2px
• H2 Section: 24px - Bold 700, Courier
• H3 Subsection: 16px - Bold 700, Courier

Body Text:
• Primary Body: 15px - Regular 400, System/Inter, Line-height: 1.7
• Subtitle: 15px - Regular 400, System/Inter, Line-height: 1.6
• Lists/Secondary: 13px - Regular 400, System/Inter

Data/UI:
• Spec Values: 28px - Bold 700, Courier
• Labels/Details/Footer: 11px - Regular 400, Courier

Callouts:
• Quote Text: 14px - Italic 400, System/Inter, Line-height: 1.8
```

### Font Families

**Courier/Technical:** 'Courier Prime' (web) or 'Courier New' (fallback)  
**Body/UI:** 'Inter' (web) or system-ui, -apple-system (fallback)

### Validation

After creating HTML, run:
```bash
grep -E "font-size:" [file].html | sort -u
```

Should return ONLY: 11px, 13px, 14px, 15px, 16px, 24px, 28px, 48px

---

## PART 3: CASE STUDY STRUCTURE

### Proven Format

```
1. TITLE (Hero Statement)
   Large numbers or key insight
   Subtitle: How achievement was accomplished

2. [ the challenge ]
   What was needed + complexity + constraint

3. [ by the numbers ]
   6-9 key metrics in spec-grid format
   lowercase labels, large values, small details

4. [ the invisible work ]
   What the achievement enables
   Two-column benefits
   Pull quote with insight

5. [ technical depth ]
   Document/deliverable overview
   Specific page counts and contents

6. [ the philosophy ]
   Work approach → outcomes connection
   Generative art explanation
   Journey: ambiguity → precision

7. [ return on investment ]
   Time/cost analysis
   Real ROI (confidence, maintainability, scalability)

8. FOOTER (Two-Column Layout)
   Left: Project-specific reflection (13px italic)
   Right: TUKU GROUP signature
          Independent Creative House
          tukugroup.com
```

### Voice Standards

✅ **DO:**
- Declarative statements: "Not a prototype. Not an MVP."
- Lead with outcomes, not process
- Specific numbers: "400 pages, 20,088 lines, 4.5:1 ratio"
- Present-tense, forward-looking
- Calm facts without defensive positioning
- Let artifact demonstrate (art proves collaboration)

❌ **DON'T:**
- Explain "I did this, Claude did that"
- Use "The surprise isn't..." (defensive)
- Create "What it took:" lists
- Over-explain methodology
- Use em dashes anywhere
- Wrong attribution (client as actor vs TUKU)

### Template Phrases

- "TUKU produced [NUMBER]" (agency as actor)
- "[CLIENT] needed [SOLUTION]" (client as subject)
- "The difference: [KEY INSIGHT]"
- "Documentation that enables rather than constrains"

---

## PART 4: ALGORITHMIC ART PROCESS

### Step 1: Define Philosophy

Create 4-6 paragraph algorithmic philosophy exploring:
1. What the system explores (computational approach)
2. How it mirrors the work (process reflection)
3. Color and visual meaning (data encoding)
4. Mathematical foundation (technical precision)
5. What it reveals (meta-insight)
6. Craftsmanship emphasis (master-level implementation)

**Reference:** `/mnt/skills/examples/algorithmic-art/SKILL.md`

### Step 2: Technical Parameters

**Typical specs:**
- Particle count: 1,500-3,000
- Simulation steps: 120-200
- Flow fields: Multi-octave Perlin noise
- Alignment coefficients: 0.4-1.0
- Opacity accumulation: Rewards sustained presence
- Color mapping: Encodes meaningful data

**Must explain in technical note:**
What the parameters represent (not just technical specs)

### Step 3: Implementation

Create TWO versions:
- **Interactive HTML:** Live p5.js art (right side, 55% width, 500px, 0.7 opacity)
- **Print HTML:** Static gradient placeholder (for PDF conversion)

---

## PART 5: HTML DEVELOPMENT

### Color Systems

**Background Colors:**
- Primary Background: #faf9f5 (warm off-white)
- Secondary Background: #f5f3ee (slightly darker warm tone)

**TUKU Brand:**
- Primary: #95B8CB (TUKU Blue)
- Accent: #C19A4B (TUKU Gold)
- Text: #141413 (Dark), #595959 (Medium), #808080 (Light)

**Client-Specific (CRYPTOGAINS example):**
- Primary: #2D4159 (Navy)
- Accent: #C8A882 (Gold)
- Secondary: #516B8C (Steel Blue)

### CSS Template Structure

```css
/* Display */
h1 { font-size: 48px; font-weight: 700; letter-spacing: 2px; }
h2 { font-size: 24px; font-weight: 700; }
h3 { font-size: 16px; font-weight: 700; }

/* Body */
body, .content { font-size: 15px; line-height: 1.7; }
.subtitle { font-size: 15px; line-height: 1.6; }
li { font-size: 13px; }

/* Data/UI */
.spec-value { font-size: 28px; font-weight: 700; }
.section-label { font-size: 11px; text-transform: lowercase; }
.spec-detail { font-size: 11px; }
.footer-signature { font-size: 11px; }

/* Callouts */
.insight-quote { font-size: 14px; font-style: italic; line-height: 1.8; }

/* Art Overlay */
.art-overlay-text { 
  font-size: 13px; 
  font-family: 'Courier Prime', monospace;
  position: absolute;
  top: 10px;
  right: 15px;
  text-align: right;
  line-height: 1.5;
}

/* Footer Reflection */
.footer-reflection {
  font-size: 13px;
  font-style: italic;
  line-height: 1.7;
  text-align: left;
}
```

### Art Overlay Text

Position text in upper right corner of generative art:
```html
<div class="art-container" id="art">
    <div class="art-overlay-text">
        [emergence]<br>
        through<br>
        invisible<br>
        scaffolding
    </div>
</div>
```

**Guidelines:**
- Font: 13px Courier Prime
- Color: Use secondary/steel color from palette
- Position: top: 10px, right: 15px
- Format: Bracketed concept with line breaks
- Purpose: Hints at the philosophy without explaining

### Footer Structure

Two-column flex layout:
```html
<div class="footer">
    <div class="footer-reflection">
        [Project-specific philosophical reflection about the work,
        collaboration, or outcome - 1-2 sentences that reflect on
        what the specific project demonstrates about the approach]
    </div>
    
    <div class="footer-signature">
        <strong>TUKU GROUP</strong><br>
        Independent Creative House<br>
        tukugroup.com
    </div>
</div>
```

**Footer Reflection Guidelines:**
- Must be project-specific (not generic positioning)
- Reflects on the actual work/collaboration
- 1-2 sentences maximum
- Ties to the case study's core insight
- Examples:
  - "What emerged from relentless AI-human iteration toward mathematical precision..."
  - "Where systematic documentation became the invisible scaffolding..."

### Section Label Format

Always use:
```html
<div class="section-label">[ lowercase text ]</div>
```

Examples: `[ the challenge ]` `[ by the numbers ]` `[ return on investment ]`

Never: **Bold Headers**, UPPERCASE, Title Case

---

## PART 6: PDF CONVERSION

### Command

```bash
wkhtmltopdf \
  --enable-local-file-access \
  --no-stop-slow-scripts \
  --javascript-delay 1000 \
  --page-size Letter \
  --margin-top 10mm \
  --margin-bottom 10mm \
  --margin-left 10mm \
  --margin-right 10mm \
  input_print.html \
  output.pdf
```

### File Organization

```
/mnt/user-data/outputs/
├── [CLIENT]_Case_Study.pdf
├── [CLIENT]_Case_Study_Interactive.html
└── [project]_algorithmic_philosophy.md (reference)
```

---

## PART 7: QUALITY CHECKLIST

### Philosophy Check
- [ ] Proves capability through demonstration (not claims)
- [ ] Worth celebrating, noticing, studying
- [ ] Complete honesty about collaboration
- [ ] Questioned format and built better
- [ ] Embodies systematic restraint

### Visual Check
- [ ] Typography: exactly 8 sizes (11, 13, 14, 15, 16, 24, 28, 48px)
- [ ] Section labels: lowercase brackets
- [ ] Spec grid: consistent formatting
- [ ] Colors: brand-aligned
- [ ] Footer: two-column layout with reflection
- [ ] Art overlay: positioned upper right

### Content Check
- [ ] Attribution: TUKU as agency, client as subject
- [ ] Voice: confident without defensiveness
- [ ] Numbers: specific and accurate
- [ ] Technical notes: explain algorithmic art
- [ ] Pull quote: impactful

### Technical Check
- [ ] PDF renders correctly
- [ ] Interactive HTML: art displays
- [ ] Fonts load (or fallbacks work)
- [ ] File size: PDF < 200KB

---

## COMPLETE PROMPT TEMPLATE

**Copy/paste this to generate a case study:**

```
TUKU CASE STUDY GENERATION

PROJECT: [CLIENT/PROJECT NAME]
ACHIEVEMENT: [KEY ACCOMPLISHMENT]
CONCEPT: [WHAT ART SHOULD VISUALIZE]

===================
STEP 1: PHILOSOPHY
===================

Read /mnt/skills/examples/algorithmic-art/SKILL.md

Create algorithmic philosophy (4-6 paragraphs) exploring [CORE CONCEPT].

Themes:
- [Theme 1]
- [Theme 2]
- [Theme 3]

The generative art should visualize: [WHAT PARTICLES/FLOWS REPRESENT]

===================
STEP 2: CONTENT
===================

Use proven structure:
1. Title: [HERO STATEMENT - include impressive number]
2. [ the challenge ]: [What was needed + complexity]
3. [ by the numbers ]: [List 6-9 key metrics with numbers]
4. [ the invisible work ]: [What it enables]
5. [ technical depth ]: [Deliverables overview]
6. [ the philosophy ]: [Approach → outcomes]
7. [ return on investment ]: [Time/value analysis]

Key data points:
- [Metric 1]: [Number] - [Detail]
- [Metric 2]: [Number] - [Detail]
- [Metric 3]: [Number] - [Detail]
[Continue with all metrics]

===================
STEP 3: HTML
===================

Create TWO versions:
A. Interactive (with live p5.js art + art overlay text)
B. Static print (for PDF)

TYPOGRAPHY (exactly 8 sizes):
H1: 48px | H2: 24px | H3: 16px
Body: 15px | Subtitle: 15px | Lists: 13px
Spec Values: 28px | Labels: 11px
Quotes: 14px | Art Overlay: 13px | Footer Reflection: 13px

COLORS: [specify if client-specific, otherwise use TUKU blue/gold]

SECTION LABELS: [ lowercase brackets ]

ART OVERLAY TEXT: Upper right corner (top: 10px, right: 15px)
Format: [bracketed concept] with line breaks

FOOTER: Two-column flex layout
- Left: Project-specific reflection (13px italic, left-aligned)
- Right: TUKU GROUP signature (11px, right-aligned)

===================
STEP 4: VOICE
===================

✓ Declarative, confident statements
✓ Outcomes-focused (not process-heavy)
✓ Specific numbers and metrics
✓ Present-tense
✓ No defensive positioning
✓ Unified voice (demonstrate through art)

Attribution:
- "TUKU produced..." (agency)
- "[CLIENT] needed..." (client)

===================
STEP 5: VALIDATE
===================

Run checks:
1. Typography: grep font-size (8 sizes only: 11, 13, 14, 15, 16, 24, 28, 48px)
2. Philosophy: Four filters passed
3. Voice: Matches TUKU standards
4. Attribution: Correct agency/client roles
5. Section labels: Lowercase brackets
6. Footer: Two-column layout with project-specific reflection
7. Art overlay: Upper right positioning

===================
STEP 6: CONVERT
===================

Generate PDF from print HTML using wkhtmltopdf command.

===================
OUTPUT FILES
===================

1. [project]_algorithmic_philosophy.md
2. [CLIENT]_Case_Study_Interactive.html
3. [CLIENT]_Case_Study.pdf

Ready to proceed with [CLIENT/PROJECT].
```

---

## EXAMPLES & REFERENCES

### Completed Case Studies

**CRYPTOGAINS, LLC Documentation**
- Philosophy: Precision Emergence
- Art: Particles = specifications accumulating
- Insight: 400 pages enabling one-and-done implementation
- Files: CRYPTOGAINS_LLC_Documentation_Case_Study.*

**Invisible Scaffolding**
- Philosophy: Structure enabling emergence
- Art: Flow fields = invisible guidance
- Insight: Systems supporting without dominating
- Files: invisible_scaffolding_tuku.html

---

## COMMON MISTAKES

❌ Process narration: "I did X, Claude did Y"  
❌ Process lists: "What it took:"  
❌ Defensive language: "The surprise isn't..."  
❌ Inconsistent typography: using 12 different sizes  
❌ Wrong attribution: "[CLIENT] produced" instead of "TUKU produced"  
❌ Title case labels: instead of `[ lowercase ]`  
❌ Unconventional without reason  
❌ Hiding AI completely (integrity fail)  
❌ Over-explaining AI mechanics  

---

## WHY THIS FORMAT WORKS

Traditional case studies describe. TUKU case studies demonstrate.

The generative art proves AI-human collaboration through computational sophistication - showing capability, not claiming it.

This embodies:
- **Question structure first** - We built something better than screenshots
- **Demonstrate, don't declare** - Art is the proof
- **Systematic restraint** - Clinical precision for ideas worth making
- **Invisible scaffolding** - AI enables, human refines, outcome studied

---

## VERSION HISTORY

**v2.1 (November 7, 2025)** - Refined implementation standards
- Updated typography system: 8 sizes (removed 10px)
- Added art overlay text specifications and positioning
- Updated footer to two-column flex layout
- Added project-specific footer reflection guidelines
- Removed "Practitioners, Not Theorists" from standard signature
- Updated all validation checklists and prompt templates

**v2.0 (November 7, 2025)** - Consolidated master document
- Merged all philosophy documents into single reference
- Integrated typography standards
- Added complete workflow + prompt template
- Single source of truth

**v1.1** - Added TUKU core philosophy integration  
**v1.0** - Initial guide based on CRYPTOGAINS workflow

---

**Document Type:** Master Reference  
**Maintenance:** Update when process evolves  
**Usage:** Required reading for all case study work

**TUKU GROUP**  
Independent Creative House  
Practitioners, Not Theorists  
tukugroup.com
