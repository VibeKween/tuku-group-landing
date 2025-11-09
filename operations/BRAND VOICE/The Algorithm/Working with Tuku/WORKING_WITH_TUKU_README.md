# WORKING WITH TUKU TEMPLATE
## README & Update Guide

**Created:** October 2025  
**Purpose:** Client onboarding one-pager and email template  
**Formats:** PDF (print/attachment) and HTML (email embedding)

---

## FILES IN THIS TEMPLATE SYSTEM

### 1. PDF Version
**File:** `working_with_tuku.pdf`  
**Generator:** `working_with_tuku_v4.py` (on Claude's computer at `/home/claude/`)  
**Use for:**
- Attachments to emails
- Print materials
- PDF sharing via links
- Beautiful, high-quality presentation

**Features:**
- Algorithmic particle art (400 particles, flow fields)
- TUKU blue color palette from website
- Sophisticated visual presentation
- Print-ready quality

### 2. HTML Email Version
**File:** `working_with_tuku_email.html`  
**Use for:**
- Embedding directly in Gmail
- Inline email content (no attachment needed)
- Quick sharing without files
- Responsive design for mobile

**Features:**
- Gmail-optimized table-based layout
- Inline CSS (no external stylesheets)
- TUKU brand colors
- Clean, professional presentation
- Mobile responsive

---

## HOW TO USE THE HTML EMAIL VERSION IN GMAIL

### Method 1: Copy/Paste (Easiest & Recommended)

1. **Open the HTML file** in a web browser (Chrome, Safari, Firefox)
   - Double-click `working_with_tuku_email.html`
   - It will open in your default browser

2. **Select all content** (Cmd+A on Mac, Ctrl+A on Windows)

3. **Copy** (Cmd+C or Ctrl+C)

4. **Open Gmail** and click "Compose" to start new email

5. **Paste directly into the email body** (Cmd+V or Ctrl+V)
   - Gmail will automatically render it as formatted HTML
   - All colors, spacing, and formatting will be preserved

6. **Add your recipient and send**

**This is the simplest method and works perfectly every time.**

### Method 2: Gmail's "Insert" Feature (If Available)

Some Gmail accounts have an "Insert HTML" option:
1. Compose new email
2. Click three dots (⋮) in formatting toolbar
3. Look for "Insert HTML"
4. Paste entire HTML code
5. Click "Insert"

### Testing Before Sending

**Always send yourself a test first:**
1. Copy/paste the HTML into Gmail
2. Send to your own email address
3. Check on desktop and mobile
4. Verify all formatting looks correct
5. Then use with confidence for clients

---

## WHEN TO USE WHICH VERSION

### Use PDF Version When:
- Sending as formal attachment
- Client requests downloadable material
- Want to showcase visual sophistication
- Need print-ready format
- Sharing via link or download
- Want the algorithmic artwork to be prominent

### Use HTML Email Version When:
- Want content visible without opening attachment
- Quick outreach to prospects
- Mobile-first communication
- Inline presentation preferred
- Reducing friction (no download needed)
- Less formal initial contact

---

## HOW TO UPDATE THE CONTENT

### Content Sections You Might Update

1. **Header/Subtitle**
   - Current: "A different approach to building ventures worth making"
   - Change if: positioning evolves

2. **"Instead of asking" questions**
   - Current: 3 questions about services/process/building
   - Change if: you notice different patterns in prospect questions

3. **"We're interested in" list**
   - Current: 5 key interests
   - Change if: priorities shift or new patterns emerge

4. **"Before we talk, consider" questions**
   - Current: 4 prompts with bold lead-ins
   - Change if: discovery reveals better qualifying questions

5. **Bottom statement**
   - Current: "We work with founders and teams ready to question..."
   - Change if: positioning language evolves

6. **"How this works" structure**
   - Current: Discovery, Sprints, Retainer
   - Change if: engagement model changes
   - **Note:** No pricing included (intentional)

### How to Update: For Non-Technical Users

**Easiest method:**
1. Upload this README to a new Claude conversation
2. Upload the current PDF or HTML file
3. Tell Claude: "I want to update [specific section] to say [new content]"
4. Claude will regenerate both files with your updates
5. Download and use

**Example request to Claude:**
> "I want to change the 'Before we talk, consider' section. Instead of 'What isn't working', I want it to say 'What constraints are you facing'. Can you update both the PDF and HTML versions?"

### How to Update: For Technical Users

**For PDF Version:**
1. Locate `/home/claude/working_with_tuku_v4.py`
2. Find content sections (clearly commented in code)
3. Edit text strings
4. Run: `python /home/claude/working_with_tuku_v4.py`
5. New PDF at `/mnt/user-data/outputs/working_with_tuku.pdf`

**For HTML Version:**
1. Open `working_with_tuku_email.html` in text editor
2. Find content (labeled with HTML comments)
3. Edit text within tags
4. Keep all `style=""` attributes intact
5. Save and test in browser

---

## DESIGN SYSTEM REFERENCE

### Colors (Keep These Consistent)

**Backgrounds:**
- `#f0f9ff` - Light blue (main background)
- `#e0f2fe` - Medium blue (accent boxes)

**Text:**
- `#0d0d0d` - Dark text (headers, body)
- `#595959` - Medium gray (secondary text)
- `#808080` - Light gray (footer)

**Accents:**
- `#5691c8` - TUKU blue (links, notation)
- `#4a7ba7` - Deep blue (process labels)
- `#C19A4B` - TUKU gold (accent line in PDF)

### Typography

**Headers:** 600 weight, 0.3-0.5px letter spacing  
**Body:** 13-14px, 1.6-1.7 line height  
**Monospace:** Courier New, for technical elements  

---

## BRAND VOICE GUIDELINES FOR UPDATES

### Always Maintain:
✓ Present tense, declarative  
✓ Confident without arrogance  
✓ Questions that prompt thinking  
✓ "We're interested in" not "we want to know"  
✓ No defensive or conditional language  

### Avoid in Updates:
✗ "If standard approaches work fine, use them" (too permissive)  
✗ "We believe" or "we think" (hedging)  
✗ "Just" or "simply" (minimizing)  
✗ Em dashes (use alternatives)  
✗ Overly long bullet points  

---

## GMAIL-SPECIFIC TECHNICAL NOTES

### Why Table-Based Layout?
Gmail strips modern CSS. Tables ensure consistent rendering across Gmail web, mobile app, and different browsers.

### What Works in Gmail:
✓ Inline CSS styles  
✓ Table layouts  
✓ Background colors  
✓ Basic fonts  

### What Doesn't Work:
✗ External stylesheets  
✗ JavaScript  
✗ CSS animations  
✗ Complex layouts  

**Bottom line:** The HTML template is optimized for Gmail's limitations.

---

## COMMON UPDATE SCENARIOS

### "Add a new question to 'Before we talk'"

**For both versions, tell Claude:**
"Add a new bullet point under 'Before we talk, consider': [your new question]"

### "Change the tagline under the header"

**For both versions, tell Claude:**
"Change the subtitle from 'A different approach to...' to '[your new tagline]'"

### "Update a process description"

**For both versions, tell Claude:**
"Change the Sprints description to say '[your new description]'"

---

## INTEGRATION WITH OTHER TUKU MATERIALS

### Use This With:
- **Initial Call Guide** - Send template before call
- **Pricing Document** - Share after alignment
- **Core Operating Philosophy** - Informs language
- **Content Framework** - Guides updates

### In Client Flow:
1. **First touch:** Send this before scheduling
2. **Initial call:** Reference the questions
3. **After alignment:** Share pricing
4. **Discovery begins:** Expectations set

---

## VERSION HISTORY

**v4 (Current) - October 2025**
- Removed pricing
- Refined brand voice
- TUKU blue colors
- 400 particle artwork
- HTML email version added

---

## TROUBLESHOOTING

### Gmail Formatting Issues

**Problem:** Formatting breaks when pasted  
**Solution:** Open HTML in browser first, then copy/paste rendered view (not code)

**Problem:** Colors look wrong  
**Solution:** Test in actual Gmail, not preview

**Problem:** Mobile looks weird  
**Solution:** Send test to your phone before using with clients

### PDF Issues

**Problem:** Can't regenerate PDF  
**Solution:** Upload to Claude and ask for regeneration

---

## BEST PRACTICES

### Content:
- Update both PDF and HTML together
- Test with real prospects first
- Keep it concise
- Maintain TUKU voice

### Distribution:
- Personalize your message
- Reference specific elements
- Use HTML for speed, PDF for formality
- Always test before sending to clients

---

## FUTURE UPDATES

**To update in future Claude sessions:**
1. Upload this README
2. Upload current files
3. Describe what to change
4. Claude will regenerate

**When to update:**
- Every 6 months for relevance
- When positioning evolves
- When engagement model changes
- When new patterns emerge

---

## QUICK START GUIDE

**To use right now:**

1. **For email:** 
   - Open `working_with_tuku_email.html` in browser
   - Copy all (Cmd+A, Cmd+C)
   - Paste into Gmail compose (Cmd+V)
   - Send

2. **For attachment:**
   - Attach `working_with_tuku.pdf` to email
   - Reference it in your message

3. **Before first call:**
   - Send to prospect with note: "This will give you context for our conversation"

**That's it. You're ready to use it.**

---

**Template Version:** 4.0  
**README Version:** 1.0  
**Last Updated:** October 2025  
**Status:** Ready to Use
