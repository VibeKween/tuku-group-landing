# Documentation Best Practices - Tuku Group Project

## Documentation Philosophy

Following the Tuku Group ethos of **"Craft over noise. Fewer, better, slower."** - our documentation should be:

- **Intentional**: Every document serves a clear purpose
- **Concise**: No unnecessary words or sections
- **Actionable**: Provides clear next steps and context
- **Consistent**: Follows established patterns and voice
- **Future-focused**: Enables seamless project continuation

---

## Documentation Structure

### Core Documentation Files

#### `/README.md`
- **Purpose**: Project overview and technical specifications
- **Audience**: Developers, collaborators, public viewers
- **Update Frequency**: When major features/changes are made
- **Content**: Vision, setup, structure, deployment info

#### `/DEVELOPMENT-LOG.md`
- **Purpose**: Historical record of project evolution
- **Audience**: Project stakeholders, future developers
- **Update Frequency**: After significant milestones
- **Content**: Phase completions, achievements, technical setup

#### `/docs/SESSION-ARCHIVE-YYYYMMDD.md`
- **Purpose**: Detailed session-by-session record
- **Audience**: Future development sessions
- **Update Frequency**: After each development session
- **Content**: Decisions, changes, context, continuity info

#### `/docs/COPY-EVOLUTION.md`
- **Purpose**: Brand voice and content decision history
- **Audience**: Content creators, brand maintainers
- **Update Frequency**: When copy changes are made
- **Content**: Version history, rationale, approved vocabulary

---

## Session Documentation Workflow

### Pre-Session
1. **Review previous session archive** to understand current state
2. **Check live site** for any issues or changes
3. **Identify session objectives** clearly

### During Session
1. **Use SESSION-TEMPLATE.md** as starting point
2. **Document decisions in real-time** as they're made
3. **Note rationale** for significant choices
4. **Track all file changes** and git activity

### Post-Session
1. **Complete session archive** with final outcomes
2. **Update core documentation** if needed
3. **Commit documentation** with descriptive messages
4. **Push to GitHub** for permanent record

---

## Documentation Templates

### Session Archive Naming
```
SESSION-ARCHIVE-20250821.md  (August 21, 2025 - Initial development)
SESSION-ARCHIVE-20250822.md  (August 22, 2025 - First enhancement session)
SESSION-ARCHIVE-20250825.md  (August 25, 2025 - Bug fixes and optimizations)
```

**Format**: `SESSION-ARCHIVE-YYYYMMDD.md`
- **Benefits**: Chronological sorting, easy date identification, prevents confusion
- **Session ID**: Include `YYYYMMDD-XXX` format for multiple sessions per day

### Git Commit Messages for Documentation
```
Add session archive #XXX: [Brief description of session focus]

- Document [major change 1]
- Record [major change 2]
- Update [affected documentation]

Ensures continuity for [specific aspect of project]
```

### Decision Documentation Format
```
**Decision**: [Clear statement of what was decided]
**Rationale**: [Why this decision was made]
**Alternatives**: [Other options considered]
**Impact**: [How this affects the project]
**Date**: [When decided]
```

---

## Content Guidelines

### Brand Voice in Documentation
- **Maintain Tuku Group tone**: Professional but not corporate
- **Be declarative**: State facts clearly without hedging
- **Avoid redundancy**: Each section should have unique value
- **Use active voice**: "We decided" not "It was decided"
- **Stay concise**: Respect the reader's time

### Technical Writing Standards
- **Code blocks**: Use proper syntax highlighting
- **File paths**: Always use absolute paths in examples
- **Commands**: Provide exact commands with context
- **URLs**: Always include full URLs for external references
- **Status indicators**: Use ✅ ❌ 🔄 for clear visual status

### Version Control for Documentation
- **Meaningful commits**: Each doc update should have clear commit message
- **Atomic changes**: Group related documentation updates
- **Consistent formatting**: Maintain markdown standards
- **Link maintenance**: Ensure all internal links remain valid

---

## File Organization

### `/docs/` Folder Structure
```
docs/
├── SESSION-ARCHIVE-20250821.md   # Initial development session
├── SESSION-ARCHIVE-20250822.md   # Next session (when created)
├── SESSION-TEMPLATE.md           # Template for future sessions
├── COPY-EVOLUTION.md             # Content change history
├── DOCUMENTATION-GUIDE.md        # This file
└── [future specialized docs]
```

**Chronological Benefits**:
- Files sort naturally by date in file explorers
- Easy to identify session gaps or frequency
- Clear conversation tracking across time periods
- Professional timestamp documentation

### Documentation Lifecycle
1. **Create**: Use templates, follow naming conventions
2. **Maintain**: Update during sessions, keep current
3. **Archive**: Preserve historical context
4. **Reference**: Use for project continuity
5. **Evolve**: Improve templates and processes

---

## Quality Checklist

### Before Committing Documentation
- [ ] All timestamps and session info accurate
- [ ] Links tested and functional
- [ ] Markdown formatting consistent
- [ ] No sensitive information included
- [ ] Clear action items for next session
- [ ] Spelling and grammar reviewed
- [ ] Code examples tested
- [ ] File structure references accurate

### Quarterly Documentation Review
- [ ] Remove outdated information
- [ ] Consolidate redundant sections
- [ ] Update live site references
- [ ] Verify all external links
- [ ] Refresh templates if needed

---

## Integration with Development

### Documentation as Code
- **Version controlled**: All docs in git repository
- **Peer reviewed**: Documentation changes go through same process as code
- **Tested**: Links and examples should be validated
- **Deployed**: Available on GitHub for reference

### Automation Opportunities
- **Link checking**: Validate internal/external links
- **Template generation**: Auto-create session docs
- **Status updates**: Sync with GitHub Issues/Projects
- **Deployment notes**: Auto-document when site updates

---

## Emergency Documentation

### If Session Archive is Lost
1. Check git history for previous documentation commits
2. Review GitHub repository README and DEVELOPMENT-LOG
3. Examine recent commits for change context
4. Check live site vs local files for discrepancies
5. Start new session archive with current state

### Rapid Recovery Process
1. **Assess current state**: What's working, what's not
2. **Document immediate context**: What you can determine
3. **Identify critical gaps**: What information is missing
4. **Proceed with session**: Don't let perfect documentation block progress
5. **Backfill when possible**: Add context as you rediscover it

---

## Success Metrics

### Documentation Quality Indicators
- **Continuity**: Can project be resumed easily after gaps?
- **Clarity**: Are decisions and rationale clear to future readers?
- **Completeness**: Is all necessary context preserved?
- **Consistency**: Does documentation follow established patterns?
- **Currency**: Is information up-to-date and accurate?

### Project Benefits
- **Faster session startup**: Less time spent understanding current state
- **Better decision making**: Historical context informs choices
- **Knowledge preservation**: No loss of institutional knowledge
- **Collaboration enablement**: Others can understand and contribute
- **Professional presentation**: Documentation demonstrates craft and intention

---

*Documentation guide crafted with intention. Fewer words, better context, slower decay.*