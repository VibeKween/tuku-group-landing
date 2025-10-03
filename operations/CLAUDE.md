# CLAUDE.md - 01-LANDING-PAGE

This file provides guidance to Claude Code when working with the original Tuku Group landing page.

## Development Philosophy & Process

**CRITICAL: Root Cause Analysis First - No Patch-First Development**

When encountering any issue, always follow this refined process:

1. **Identify Root Cause** - Understand WHY the issue exists before touching any code
2. **Analyze System Impact** - Determine what underlying behavior is causing the symptom
3. **Design Minimal Solution** - Address the core problem, not just the visible symptom
4. **Preserve Clean Architecture** - Solutions must align with existing patterns and avoid tech debt

**❌ Avoid Patch-First Approaches:**
- No `!important` declarations unless absolutely necessary
- No arbitrary overrides or band-aid CSS fixes
- No duplicate code to "fix" inconsistencies
- No hacky workarounds that mask underlying issues

**✅ Preferred Solution Patterns:**
- Single-property fixes that address root causes
- Consistent application of existing CSS patterns
- Clean, maintainable code that improves the system
- Solutions that prevent similar future issues

**Example:** Font weight inconsistency between accordion headers was solved with `font-synthesis: none` (preventing browser font variations) rather than patching with font-weight overrides.

This methodology ensures sustainable code architecture, reduced technical debt, and cleaner, more maintainable solutions.

## Copy Update Methodology

**CRITICAL: Systematic Copy Updates - No Patch-First Content Changes**

**TUKU Group Standard:** This process applies across all TUKU Group projects for consistent content maintenance.

When updating site copy (client names, project descriptions, contact info, brand messaging), always follow this process:

### 1. **Universal Changes First**
For global updates (brand terms, contact info, client names), use systematic find/replace:
```bash
# Example: Brand or client updates
find . -name "*.html" -exec sed -i '' 's/OLD_CLIENT_NAME/NEW_CLIENT_NAME/g' {} +
find . -name "*.css" -exec sed -i '' 's/old-contact@/new-contact@/g' {} +
```

### 2. **Cross-Reference Validation**
- **Homepage content** → Meta tags, structured data
- **Contact information** → Footer links, email addresses, company names
- **Client portfolio** → Split-flap component, project descriptions
- **Brand messaging** → Philosophy blocks, mission statements

### 3. **File Update Order**
1. Universal replacements (brand terms, contact info)
2. Homepage content (main manifesto copy)
3. Meta tags and structured data
4. Component-specific content (split-flap, footer)
5. CSS custom properties and comments

### 4. **Quality Control Checklist**
- [ ] Global find/replace completed for universal changes
- [ ] Meta tags reflect content updates
- [ ] Contact information consistent across all locations
- [ ] Brand messaging maintains manifesto tone
- [ ] Split-flap component data updated if applicable
- [ ] Live deployment tested for content accuracy

### **Copy Location Reference**
- **Hardcoded locations**: index.html, meta tags, structured data
- **Component data**: Split-flap client portfolio content
- **Brand elements**: Footer copyright, company links
- **CSS content**: Custom property names, comment headers

**Root Cause Prevention:** This process prevents inconsistencies between page content, meta data, and component-specific information.

## Document Flow Methodology

**CRITICAL: Anchor → Reference Pattern - Professional Document Flow**

**TUKU Group Standard:** This writing principle applies across all TUKU Group proposals, correspondence, and technical documentation.

When presenting complex information (business models, technical specifications, financial structures), always follow this flow pattern:

### **The Anchor → Reference Pattern:**
1. **Establish the anchor** - Present complete details once, early in the document
2. **Create the namespace** - Use consistent terminology to reference back  
3. **Maintain reference flow** - Subsequent mentions use the established namespace without repeating details

### **Example Implementation:**
- **Anchor**: "CONCIERGE service (also called PREMIUM PACKAGE) with its $5k setup, 20% performance fees on individual doubles, and 300% portfolio growth target"
- **Namespace**: "CONCIERGE/PREMIUM PACKAGE", "this fee structure", "asset-level performance fees"
- **References**: All subsequent mentions use the namespace, not the full details

### **Benefits:**
- **Reduces redundancy** while maintaining clarity
- **Creates professional flow** that respects reader intelligence  
- **Establishes authority** through precise initial definition
- **Enables concise references** throughout the document

### **Application Areas:**
- **Business proposals**: Fee structures, service definitions, technical requirements
- **Correspondence**: Project specifications, client portfolios, strategic frameworks
- **Technical documentation**: System architectures, component specifications, workflow processes

**Root Cause Prevention:** This methodology prevents document fatigue from repetitive details while ensuring readers have complete context for understanding complex concepts.

## Project Overview

Original Tuku Group landing page - the foundation manifesto site that established the design system and brand philosophy for all subsequent projects.

**Key Characteristics:**
- Pure HTML/CSS implementation
- Ultra-minimal manifesto design
- JetBrains Mono typography
- Split-flap component integration
- Terminal aesthetic elements
- Mobile-responsive single-column layout

**Live Deployment:** https://tukugroup.com
**Previous URL:** https://vibekween.github.io/tuku-group-landing (GitHub Pages - kept as backup)

**Status:** Production ready with split-flap component integrated

## Architecture

**Design System Foundation:**
- `css/main.css` - Complete styling system that serves as template for other projects
- `index.html` - Single-page manifesto with sequential sections
- Split-flap component for dynamic client portfolio display

**Brand Philosophy:** "Craft over noise. Fewer, better, slower."
- Every element serves the manifesto message
- Intentional whitespace and typography
- No unnecessary frameworks or dependencies

## Development Workflow

**CRITICAL: Production-Safe Development Process**

Since this site connects to the public tukugroup.com domain, ALL development must follow this mandatory workflow:

### Mandatory Branch Strategy
```bash
# ALWAYS work in dev branch
git checkout dev     # Switch to dev branch for all development

# NEVER push directly to main branch during development
```

### Development Process (MANDATORY)
1. **Local Development**: Test at http://localhost:3000 (or file:///)
2. **Dev Branch Commits**: Push work-in-progress to dev branch only
3. **Production Approval Gate**: Claude Code MUST prompt for explicit approval before production push
4. **Production Deploy**: Only when approved by user to main branch → tukugroup.com

### Claude Code Production Safeguards
**MANDATORY PROMPT BEFORE PRODUCTION:**
```
🚨 PRODUCTION DEPLOYMENT APPROVAL REQUIRED 🚨

Changes ready for production:
- [List specific changes made]
- Local testing: [Completed/Status]
- Quality checks: [Passed/Issues]

⚠️  This will deploy to live public site (tukugroup.com)

Proceed with production deployment? (Requires explicit approval)
```

## Development Standards

**Code Style:**
- Mobile-first responsive design (768px breakpoint)
- CSS custom properties for color system
- Semantic HTML structure with `.block` sections
- No JavaScript dependencies (except split-flap component)

**Content Philosophy:**
- Declarative, manifesto-driven messaging
- Each section communicates single concept
- Professional tone without corporate jargon

## Important Notes

This project serves as the design system foundation for:
- 02-LANDING-PAGE (OF THE CULTURE adaptation)
- 03-ECOMMERCE-OF-THE-CULTURE (Ecommerce extension)
- Template system in ops/templates/

Any changes here should consider impact on the entire ecosystem.