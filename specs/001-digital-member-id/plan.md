# Implementation Plan: DID-Based Digital Member ID Card with QR Verification

**Branch**: `001-digital-member-id` | **Date**: 2025-01-31 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-digital-member-id/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a mobile-first digital member ID card for Gyeonggi Provincial Council members with three progressive capabilities: (P1) visual ID card display with flip animation, (P2) QR code generation for external verification, and (P3) blockchain verification status indicator. The feature enhances the existing static site application by extending the `app.pages['digital-id']` page template with enhanced styling, QRious library integration for QR generation, and optional blockchain API integration for verification badges.

**Technical Approach**: Pure vanilla JavaScript ES6+ extending the existing `window.app` architecture with new page template in `app.pages` object, CSS modules for KRDS-compliant styling, QRious CDN library for client-side QR generation, and localStorage-backed state management for offline capability. No build process, no npm dependencies—adheres to zero-build static site architecture.

## Technical Context

**Language/Version**: JavaScript ES6+ (vanilla, no TypeScript), HTML5, CSS3  
**Primary Dependencies**: 
- QRious v4.0.2 (CDN: cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js)
- Tailwind CSS (CDN: cdn.tailwindcss.com)
- Font Awesome 6.4.0 (CDN for icons)
- Noto Sans KR (Google Fonts)

**Storage**: localStorage for member data persistence (`app.memberData` object), no database  
**Testing**: Manual testing checklist at breakpoints (320px, 430px, 768px, 1024px+), cross-browser verification (Chrome 80+, Safari 13+, iOS 12+, Android 8+)  
**Target Platform**: Mobile-first web application (430px primary viewport), progressive enhancement for tablet/desktop  
**Project Type**: Single-page application (SPA) with static site architecture, no backend  
**Performance Goals**: 
- Page load < 3 seconds on 3G networks
- Time to Interactive (TTI) < 5 seconds
- QR code generation < 500ms
- 60fps card flip animations
- Total page weight < 500KB

**Constraints**: 
- Zero build process (no webpack, vite, npm)
- CDN-only dependencies
- Offline-first capability via localStorage
- KRDS design system compliance mandatory
- WCAG 2.1 AA accessibility mandatory
- Korean language for all UI text

**Scale/Scope**: 
- ~200 council members (Gyeonggi Provincial Council)
- Single digital ID page within existing 13-page application
- 3 progressive enhancement tiers (P1→P2→P3)
- Estimated 1,500 LOC total (800 JS, 500 CSS, 200 HTML)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Mobile-First Development
- **Status**: COMPLIANT
- **Evidence**: Spec FR-008 mandates 430px primary viewport with responsive breakpoints; FR-002 specifies 44px touch targets; FR-009 enforces <3s load on 3G
- **Implementation**: Mobile-first CSS media queries, touch event handlers, viewport meta tag

### ✅ Principle II: KRDS Design System Compliance
- **Status**: COMPLIANT
- **Evidence**: FR-006 mandates KRDS colors (#003d7a, #0056b3, #f3f4f6), Noto Sans KR typography; SC-008 requires design review approval
- **Implementation**: Use existing `styles/krds-design-system.css`, Tailwind utility classes, Korean UI text

### ✅ Principle III: Accessibility First
- **Status**: COMPLIANT
- **Evidence**: FR-007 requires WCAG 2.1 AA with semantic HTML5, ARIA labels, keyboard nav, 4.5:1 contrast; SC-005 mandates aXe audit
- **Implementation**: Semantic `<main>`, `<article>`, `<button>` tags; ARIA labels for card sections; keyboard-accessible flip action

### ✅ Principle IV: Performance Budgets
- **Status**: COMPLIANT
- **Evidence**: FR-009 enforces <3s load, <500KB bundle; SC-002 requires TTI <5s; FR-002 mandates 60fps animations; QR gen <500ms
- **Implementation**: Async QRious loading, CSS transform animations, image optimization, localStorage caching

### ✅ Principle V: Vanilla JavaScript Architecture
- **Status**: COMPLIANT
- **Evidence**: FR-003 uses QRious CDN library; FR-005 extends `app.memberData` object; no frameworks/build tools mentioned
- **Implementation**: Extend `window.app.pages['digital-id']` template, add `app.generateQRCode()` method, ES6 module pattern

### ✅ Principle VI: State Management and Data Persistence
- **Status**: COMPLIANT
- **Evidence**: FR-005 specifies `app.memberData` structure with localStorage sync; edge cases handle offline scenarios
- **Implementation**: Read from `app.memberData.{name, photo, party, district, memberId, generation, didIdentifier}`, sync on updates

### ✅ Principle VII: Testing and Quality Assurance
- **Status**: COMPLIANT
- **Evidence**: Spec mentions manual testing at breakpoints, cross-browser validation; SC-010 requires browser compatibility testing
- **Implementation**: Testing checklist for 320px/430px/768px/1024px, iOS/Android device testing, emoji console logging (🎴, ✅, ❌)

### 🔄 Post-Design Re-Check Required
After Phase 1 design artifacts are complete, re-validate:
- Actual bundle size (HTML + CSS + JS) ≤ 500KB
- QRious CDN size impact on total load time
- Blockchain API integration (P3) does not violate zero-backend constraint
- No accidental framework dependencies introduced

## Project Structure

### Documentation (this feature)

```text
specs/001-digital-member-id/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output: QR code patterns, blockchain API design
├── data-model.md        # Phase 1 output: Member data schema, DID credentials structure
├── quickstart.md        # Phase 1 output: Developer guide for digital ID implementation
├── contracts/           # Phase 1 output: Blockchain verification API spec (optional P3)
│   └── blockchain-verification-api.yaml
└── checklists/
    └── requirements.md  # Existing spec validation checklist
```

### Source Code (repository root)

This is a **single-project static site** with existing structure. New files for this feature:

```text
# JavaScript Modules (extend window.app)
js/
├── app-core.js                    # [EXISTING] Core app initialization
├── app-pages-enhanced.js          # [MODIFY] Add digital-id page template
├── digital-id-enhanced.js         # [NEW] Digital ID card logic (flip, QR, blockchain)
└── qr-code-generator.js           # [NEW] QRious wrapper for QR generation

# CSS Modules (KRDS-compliant styling)
styles/
├── krds-design-system.css         # [EXISTING] Government design system
├── enhanced-design.css            # [EXISTING] Base enhanced styles
├── digital-id-enhanced.css        # [NEW] Digital ID card styles (flip animation, layout)
└── digital-id-mobile-optimized.css # [NEW] Mobile-specific optimizations

# HTML (entry point)
index.html                         # [MODIFY] Add QRious CDN script tag, link new CSS files

# Assets
images/
├── default-avatar.svg             # [NEW] Default avatar for missing photos
└── blockchain-verified-badge.svg  # [NEW] Blockchain verification icon

# No test/ directory (manual testing only per constitution)
```

**Structure Decision**: Selected **single-project** structure because this is a static site enhancement, not a web application with separate frontend/backend. All JavaScript extends the existing `window.app` global object, CSS follows modular pattern, and no build process required. New files integrate with existing architecture documented in CLAUDE.md.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected**. All seven constitutional principles are compliant. No complexity justification required.
