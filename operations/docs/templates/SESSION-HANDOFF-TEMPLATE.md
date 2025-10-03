# Session Handoff Template

## Purpose
This template ensures smooth transitions between development sessions by providing all necessary context, links, and objectives for continuing work with a fresh Claude session.

## Usage
At the end of each development session, use this template to generate a comprehensive handoff prompt for the next session.

---

## 🚀 Session #[XXX] Kickoff Prompt

Here's everything you need to start Session #[XXX] with a fresh Claude session:

---

### **Prompt to Copy & Paste:**

```
Hello! I'm continuing development of the [PROJECT NAME]. This is Session #[XXX] focused on [SESSION FOCUS DESCRIPTION].

Please review the current project status and documentation:

**Current Project State:**
- Repository: [GITHUB REPOSITORY URL]
- Live Site: [LIVE SITE URL]
- Project Path: [LOCAL PROJECT PATH]

**Key Documentation to Review:**
1. [MOST RECENT SESSION SUMMARY]: [PATH TO LATEST BUILDING-IN-PUBLIC SUMMARY]
2. [FEATURE ROADMAP]: [PATH TO FEATURE ROADMAP WITH CURRENT SESSION PRIORITIES]
3. [DEVELOPMENT OVERVIEW]: [PATH TO DEVELOPMENT OVERVIEW]
4. [OTHER KEY DOCS]: [PATHS TO OTHER RELEVANT DOCUMENTATION]

**Session #[XXX] Focus Areas:**
- [FOCUS AREA 1]: [Brief description]
- [FOCUS AREA 2]: [Brief description]  
- [FOCUS AREA 3]: [Brief description]
- [FOCUS AREA 4]: [Brief description]
- [FOCUS AREA 5]: [Brief description]
- [FOCUS AREA 6]: [Brief description]

**What's Already Complete:**
- [COMPLETED ITEM 1]: [Brief description]
- [COMPLETED ITEM 2]: [Brief description]
- [COMPLETED ITEM 3]: [Brief description]
- [COMPLETED ITEM 4]: [Brief description]

Please start by reviewing the documentation to understand the current state, then let's [ACTION DESCRIPTION FOR SESSION START].
```

---

### **Key Links for Reference:**

**Project Repository:**
- [GITHUB REPOSITORY URL]

**Live Site:**
- [LIVE SITE URL]

**Essential Documentation Files:**
- `[PATH TO LATEST SESSION SUMMARY]`
- `[PATH TO FEATURE ROADMAP]`
- `[PATH TO DEVELOPMENT OVERVIEW]`
- `[PATH TO DEVELOPMENT NOTES]`

---

### **Session #[XXX] Success Criteria:**

By the end of Session #[XXX], you should have:
- ✅ [SUCCESS CRITERIA 1]
- ✅ [SUCCESS CRITERIA 2]
- ✅ [SUCCESS CRITERIA 3]
- ✅ [SUCCESS CRITERIA 4]
- ✅ [SUCCESS CRITERIA 5]
- ✅ Session #[XXX] building-in-public summary created

---

**Ready to start Session #[XXX]!** Just copy the prompt above and all the documentation will guide the new Claude session seamlessly into [BRIEF SESSION DESCRIPTION]. 🚀

## Template Variables to Replace

When using this template, replace the following variables:

### Basic Project Information
- `[PROJECT NAME]` - Full project name (e.g., "the OF THE CULTURE ecommerce microsite")
- `[XXX]` - Session number (e.g., "002", "003", etc.)
- `[SESSION FOCUS DESCRIPTION]` - Brief description of session focus (e.g., "tech stack evaluation and site architecture planning")

### URLs and Paths
- `[GITHUB REPOSITORY URL]` - Full GitHub repository URL
- `[LIVE SITE URL]` - Live deployed site URL
- `[LOCAL PROJECT PATH]` - Local filesystem path to project

### Documentation Paths
- `[PATH TO LATEST BUILDING-IN-PUBLIC SUMMARY]` - Path to most recent session summary
- `[PATH TO FEATURE ROADMAP]` - Path to feature roadmap document
- `[PATH TO DEVELOPMENT OVERVIEW]` - Path to development overview
- `[PATH TO DEVELOPMENT NOTES]` - Path to development notes
- `[OTHER KEY DOCS]` - Any other relevant documentation paths

### Session Content
- `[FOCUS AREA X]` - Specific areas of focus for the upcoming session
- `[COMPLETED ITEM X]` - Key completed items from previous sessions
- `[SUCCESS CRITERIA X]` - Specific success criteria for the session
- `[ACTION DESCRIPTION FOR SESSION START]` - What the session should begin with
- `[BRIEF SESSION DESCRIPTION]` - Very brief description for closing line

## Example Implementation

See `SESSION-002-HANDOFF-EXAMPLE.md` for a complete example of this template filled out for the OF THE CULTURE ecommerce project Session #002 handoff.