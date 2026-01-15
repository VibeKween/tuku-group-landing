# VOYJ OG Image Debug - Continuation Prompt

## Problem
The VOYJ case study page at `https://tukugroup.com/ideas/voyj/` is not displaying the correct OG image when shared in iMessage. Instead, it shows a generic fallback (light blue background with shoe icon). All other IDEAS case studies display their OG images correctly.

## What Works
- **IDEAS hub** (`/ideas/`) - OG image displays correctly in iMessage
- **OF THE CULTURE** (`/ideas/of-the-culture/`) - OG image displays correctly
- **REDACTED** (`/ideas/redacted/`) - OG image displays correctly
- **INVISIBLE SCAFFOLDING** (`/ideas/invisible-scaffolding/`) - OG image displays correctly

## What Doesn't Work
- **VOYJ** (`/ideas/voyj/`) - Shows fallback image instead of voyj OG image

## Current State
The OG image tags have been **temporarily removed** from the VOYJ page for a cache reset. The current state is:
- All voyj OG image files have been deleted from `/images/` and `/website/images/`
- The `og:image` and `twitter:image` meta tags are commented out in `/website/ideas/voyj/index.html` and `/ideas/voyj/index.html`
- Both `main` and `dev` branches are in sync at commit `75847d5`

## Source Image Location
The correct OG image to use is at:
```
/operations/BRAND VOICE/The Algorithm/Case Studies/Case Studies VOYJ/voyj-og (3).png
```
- Dimensions: 2400 × 1260
- Size: 682 KB

Alternative in Downloads:
```
/Users/falonbahal/Downloads/voyj-og (1).png
```
- Dimensions: 2400 × 1260
- Size: 1.29 MB

## What We Tried (All Failed)
1. ✗ Added cache-buster query params (`?v=2`, `?v=3`, `?v=4`)
2. ✗ Resized image to 1200×630 (228 KB)
3. ✗ Converted to JPEG format (220 KB)
4. ✗ Used fresh filename (`voyj-case-study-og.png`)
5. ✗ Removed and planned to re-add image (current state)

## Key Finding
File size is **NOT the issue**. Other working case study OG images:
- invisible-scaffolding-og.png: 448 KB (works)
- of-the-culture-og.png: 419 KB (works)

The user confirmed another image of similar size (~682 KB) loads correctly, ruling out file size as the cause.

## Comparison Analysis Needed
Compare the VOYJ page structure against working case studies to find the difference:

**Files to compare:**
- `/website/ideas/voyj/index.html` (broken)
- `/website/ideas/of-the-culture/index.html` (works)
- `/website/ideas/redacted/index.html` (works)

**Areas to investigate:**
1. Meta tag ordering/structure differences
2. Structured data (JSON-LD) differences
3. Any JavaScript that might interfere
4. Response headers from Cloudflare
5. Whether the page itself has issues being crawled

## Deployment Process Reminder
This project requires dual-directory deployment:
1. Make changes in `/website/` directory
2. Copy to root for Cloudflare Pages deployment
3. Push to both `main` and `dev` branches

## Next Steps
1. Do a detailed diff between VOYJ and a working case study (e.g., of-the-culture)
2. Test the live page with Facebook's OG debugger to see what it fetches
3. Check if there's anything unique about the VOYJ page that prevents crawlers from accessing the image
4. Re-add the OG image with any fixes identified

## Commands to Resume

Check current state:
```bash
cd /Users/falonbahal/Desktop/DEVELOPMENT/TUKU-GROUP/01-LANDING-PAGE
git log -1 --oneline
curl -sL "https://tukugroup.com/ideas/voyj/" | grep -E "og:image|twitter:image"
```

View source image:
```bash
open "/Users/falonbahal/Desktop/DEVELOPMENT/TUKU-GROUP/01-LANDING-PAGE/operations/BRAND VOICE/The Algorithm/Case Studies/Case Studies VOYJ/voyj-og (3).png"
```
