# Implementation Plan: Dashboard Bug Fixes and Missing Asset Resolution

**Branch**: `002-dashboard-bug-fixes` | **Date**: 2025-01-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-dashboard-bug-fixes/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Fix critical dashboard bugs discovered through Playwright browser testing: (1) missing image assets causing ERR_FILE_NOT_FOUND errors, (2) duplicate modal rendering breaking user interactions, (3) QRious CDN integrity hash mismatch preventing QR code generation, and (4) missing chart labels reducing data visualization clarity. The solution involves creating placeholder assets, refactoring modal management logic to prevent duplication, fixing CDN script tags, and enhancing Chart.js configuration—all within existing vanilla JavaScript architecture without introducing new dependencies or build steps.

**Technical Approach**: Pure vanilla JavaScript ES6+ bug fixes extending existing `window.app` architecture with improved error handling, debouncing logic for modal spawning, SVG-based default avatars, corrected CDN integrity hashes, and enhanced Chart.js axis/tooltip configuration. All fixes integrate with current KRDS design system and maintain < 500KB performance budget.

## Technical Context

**Language/Version**: JavaScript ES6+ (vanilla, no TypeScript), HTML5, CSS3
**Primary Dependencies**:
- Chart.js (existing CDN: cdn.jsdelivr.net/npm/chart.js) - fix configuration only
- QRious v4.0.2 (CDN: cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js) - fix integrity hash
- Tailwind CSS (CDN: cdn.tailwindcss.com) - no changes needed
- Font Awesome 6.4.0 (CDN) - no changes needed
- Noto Sans KR (Google Fonts) - no changes needed

**Storage**: localStorage for `app.memberData` (no schema changes), no new storage requirements
**Testing**: Manual testing checklist at breakpoints (320px, 430px, 768px, 1024px+), cross-browser verification (Chrome 80+, Safari 13+, iOS 12+, Android 8+), Playwright for automated regression testing
**Target Platform**: Mobile-first web application (430px primary viewport), progressive enhancement for tablet/desktop
**Project Type**: Single-project static site with existing structure (no frontend/backend split)
**Performance Goals**:
- Maintain < 3 seconds page load on 3G networks
- Keep total bundle size < 500KB (add ~15KB for default avatars + favicons)
- Modal operations < 100ms (debounce protection)
- Chart rendering < 200ms

**Constraints**:
- Zero build process (no webpack, vite, npm)
- CDN-only dependencies
- Offline-first capability via localStorage
- KRDS design system compliance mandatory
- WCAG 2.1 AA accessibility mandatory
- Korean language for all UI text

**Scale/Scope**:
- ~200 council members (Gyeonggi Provincial Council)
- 4 bug fixes across existing 13-page application
- Estimated 800 LOC (400 JS bug fixes, 300 CSS for default avatars, 100 HTML for asset cleanup)
- No new pages or features—pure bug fixing

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Mobile-First Development
- **Status**: COMPLIANT
- **Evidence**: All bug fixes maintain existing mobile-first approach; modal fixes improve touch interaction reliability; default avatars use responsive sizing; chart labels tested at all breakpoints (spec SC-009)
- **Implementation**: No changes to mobile-first patterns; fixes improve existing mobile experience

### ✅ Principle II: KRDS Design System Compliance
- **Status**: COMPLIANT
- **Evidence**: Default avatars use official KRDS colors for party backgrounds (#003d7a, #0056b3); chart labels use Noto Sans KR typography; modal fixes don't alter design system compliance (spec SC-010)
- **Implementation**: Extend existing KRDS CSS classes; no deviation from color palette or typography standards

### ✅ Principle III: Accessibility First
- **Status**: COMPLIANT
- **Evidence**: Modal fixes improve keyboard navigation (Escape key handling); chart tooltips provide screen-reader-friendly data labels; default avatars include ARIA labels; maintain 4.5:1 contrast ratio (spec SC-004, SC-005)
- **Implementation**: Fix existing accessibility gaps in modal system; add ARIA labels to generated avatar images

### ✅ Principle IV: Performance Budgets
- **Status**: COMPLIANT
- **Evidence**: Total asset additions ~15KB (5 favicons + default avatar SVG); fixes remove broken asset requests improving load time; modal debouncing reduces unnecessary DOM operations (spec SC-007, SC-008)
- **Implementation**: Optimize favicon file sizes; use inline SVG for default avatars to minimize requests

### ✅ Principle V: Vanilla JavaScript Architecture
- **Status**: COMPLIANT
- **Evidence**: All fixes extend `window.app` object methods; no new framework dependencies; fixes integrate with existing `app-modals-enhanced.js` and `app-pages-integrated.js` modules
- **Implementation**: Modify existing files: `index.html` (fix CDN tags), `app-modals-enhanced.js` (fix duplication), `app-pages-integrated.js` (add debouncing), new `app-utils.js` (avatar generation)

### ✅ Principle VI: State Management and Data Persistence
- **Status**: COMPLIANT
- **Evidence**: No changes to `app.memberData` structure or localStorage patterns; fixes work with existing member data fields (name, party, partyColor)
- **Implementation**: Read from existing localStorage; no new persistence requirements

### ✅ Principle VII: Testing and Quality Assurance
- **Status**: COMPLIANT
- **Evidence**: Manual testing checklist covers all 4 user stories at required breakpoints; console logging with emoji markers for debugging; Playwright regression tests to prevent duplicate modal bug recurrence (spec mentions Playwright usage)
- **Implementation**: Testing checklist in quickstart.md; emoji console logs (🖼️ images, 📋 modals, 📊 charts, ❌ errors)

### 🔄 Post-Design Re-Check Required
After Phase 1 design artifacts are complete, re-validate:
- Actual file sizes for favicons and default avatar SVG ≤ 15KB total
- Chart.js configuration changes don't introduce performance regression
- Modal refactoring maintains z-index hierarchy and accessibility
- No accidental dependencies introduced during bug fixing

## Project Structure

### Documentation (this feature)

```text
specs/002-dashboard-bug-fixes/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output: Modal patterns, CDN integrity, SVG generation
├── data-model.md        # Phase 1 output: Modal state machine, avatar generation schema
├── quickstart.md        # Phase 1 output: Bug fix testing guide, regression prevention
├── contracts/           # Phase 1 output: Chart.js config schema, modal lifecycle API
└── checklists/
    └── requirements.md  # Existing spec validation checklist
```

### Source Code (repository root)

This is a **single-project static site** with existing structure. Modified/new files for bug fixes:

```text
# HTML Entry Point
index.html                         # [MODIFY] Fix QRious CDN integrity hash, remove/fix broken favicon links

# JavaScript Modules (extend window.app)
js/
├── app-core.js                    # [EXISTING] No changes needed
├── app-modals-enhanced.js         # [MODIFY] Fix duplicate modal rendering, improve cleanup
├── app-pages-integrated.js        # [MODIFY] Add debouncing to quick action buttons
├── app-utils.js                   # [NEW] Avatar generation utility functions
└── chart-config-enhanced.js       # [NEW] Enhanced Chart.js configuration with axis labels

# CSS Modules (KRDS-compliant styling)
styles/
├── krds-design-system.css         # [EXISTING] No changes needed
├── enhanced-design.css            # [EXISTING] No changes needed
├── default-avatar.css             # [NEW] Styles for generated default avatars
└── modal-enhanced.css             # [MODIFY] Fix z-index issues, improve overlay handling

# Assets
images/
├── fabicon/                       # [NEW DIRECTORY] Create with placeholder favicons
│   ├── favicon.ico                # [NEW] 16x16 ICO file (~1KB)
│   ├── favicon-16x16.png          # [NEW] 16x16 PNG (~0.5KB)
│   ├── favicon-32x32.png          # [NEW] 32x32 PNG (~1KB)
│   ├── favicon-96x96.png          # [NEW] 96x96 PNG (~2KB)
│   └── android-icon-192x192.png   # [NEW] 192x192 PNG (~4KB)
└── default-avatar.svg             # [NEW] Inline SVG template for avatar generation (~2KB)

# No test/ directory (manual testing only per constitution)
```

**Structure Decision**: Selected **single-project** structure because this is a static site bug fix, not a new feature requiring separate frontend/backend. All JavaScript extends the existing `window.app` global object documented in CLAUDE.md. New files follow existing naming conventions (`app-*.js`, `*-enhanced.js`). Asset additions integrate with current `/images/` directory structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected**. All seven constitutional principles are compliant. All bug fixes work within existing vanilla JavaScript architecture, KRDS design system, performance budgets, and mobile-first approach. No complexity justification required.
