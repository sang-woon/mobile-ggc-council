# Tasks: Dashboard Bug Fixes and Missing Asset Resolution

**Input**: Design documents from `/specs/002-dashboard-bug-fixes/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No test tasks included - spec does not explicitly request TDD approach. Manual testing checklists provided in quickstart.md.

**Organization**: Tasks are grouped by user story (P1-P4) to enable independent implementation and testing of each bug fix.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: Static site with no build process
- **Project root**: `E:\01-project\251031-mobile-ggc-member\`
- **JavaScript**: `/js/` directory (vanilla ES6+, no TypeScript)
- **CSS**: `/styles/` directory
- **Assets**: `/images/fabicon/` for favicon files
- **HTML**: `index.html` at repository root

---

## Phase 1: Setup (Project Verification)

**Purpose**: Verify project structure and create missing directories

- [X] T001 Verify existing project structure matches plan.md (index.html, js/, styles/, images/ directories exist)
- [X] T002 [P] Create images/fabicon/ directory for favicon assets
- [X] T003 [P] Verify existing JavaScript modules (app-core.js, app-modals-enhanced.js, app-pages-integrated.js) are accessible

---

## Phase 2: User Story 1 - Fix Missing Image Assets (Priority: P1) 🎯 MVP

**Goal**: Eliminate all ERR_FILE_NOT_FOUND console errors for images by creating placeholder favicons and implementing default avatar fallback system

**Independent Test**: Load index.html in browser with DevTools open, verify zero ERR_FILE_NOT_FOUND errors in Console, check Network tab shows all favicon files load successfully (200 status), and member profile displays initials on colored background when photo is missing

### Implementation for User Story 1

- [ ] T004 [P] [US1] Create favicon.ico (16x16 ICO format) with "G" letter on #003d7a background in images/fabicon/favicon.ico
- [ ] T005 [P] [US1] Create favicon-16x16.png (16x16 PNG) in images/fabicon/favicon-16x16.png
- [ ] T006 [P] [US1] Create favicon-32x32.png (32x32 PNG) in images/fabicon/favicon-32x32.png
- [ ] T007 [P] [US1] Create favicon-96x96.png (96x96 PNG) in images/fabicon/favicon-96x96.png
- [ ] T008 [P] [US1] Create android-icon-192x192.png (192x192 PNG) in images/fabicon/android-icon-192x192.png
- [ ] T009 [US1] Update favicon link tags in index.html to reference all 5 favicon files in images/fabicon/ directory
- [ ] T010 [P] [US1] Create js/app-utils.js with generateDefaultAvatar() function implementing SVG generation with member initials and party colors
- [ ] T011 [US1] Add <script src="js/app-utils.js?v=1.0"></script> to index.html before closing </body> tag
- [ ] T012 [P] [US1] Create styles/default-avatar.css with responsive styles for .default-avatar class
- [ ] T013 [US1] Add <link rel="stylesheet" href="styles/default-avatar.css?v=1.0"> to index.html in <head> section
- [ ] T014 [US1] Search and replace all "annomimus.jpg" and "anonymous.jpg" references in JavaScript files (app-pages-integrated.js, app-pages.js) with default avatar fallback using generateDefaultAvatar()
- [ ] T015 [US1] Add onerror handler to member profile <img> tags to display default avatar SVG when photo fails to load
- [ ] T016 [US1] Verify total file size additions ≤ 15KB (5 favicons ~8.5KB + avatar system ~2KB) per performance budget in plan.md

**Checkpoint**: At this point, loading index.html should show ZERO image-related console errors, all favicons load successfully, and member profiles display initials on colored backgrounds when photos are missing

---

## Phase 3: User Story 2 - Fix Duplicate Modal Rendering (Priority: P2)

**Goal**: Prevent duplicate modal spawning by implementing singleton pattern with state tracking, debouncing, and complete cleanup lifecycle

**Independent Test**: Click "보도자료" quick action button rapidly 5 times within 1 second, verify only ONE modal appears, then close modal with X button/Escape key/backdrop click and verify modal closes completely without ghost DOM elements

### Implementation for User Story 2

- [X] T017 [US2] Add currentModal and modalDebounceTimeout state properties to window.app object in js/app-core.js
- [X] T018 [US2] Implement modal existence check in app.showModal() function in js/app-modals-enhanced.js to close existing modal before creating new one
- [X] T019 [US2] Add 200ms debouncing logic to app.showModal() using modalDebounceTimeout to prevent rapid-click duplicate spawning
- [X] T020 [US2] Refactor app.closeModal() in js/app-modals-enhanced.js to completely remove ALL modal DOM elements (.mobile-modal-container, .modal-overlay)
- [X] T021 [US2] Implement Escape key event listener removal in app.closeModal() to prevent memory leaks and ghost handlers
- [X] T022 [US2] Add currentModal state clearing (set to null) in app.closeModal() cleanup function
- [X] T023 [US2] Fix modal overlay z-index in styles/modal-enhanced.css to ensure modals appear above side menu (z-index: 9999)
- [X] T024 [US2] Add console logging with emoji markers (📋) for modal lifecycle events (opening, closing, debounce active) for debugging
- [X] T025 [US2] Test modal close functionality via close button, Escape key, and backdrop click at all breakpoints (320px, 430px, 768px, 1024px+)

**Checkpoint**: At this point, clicking any quick action button should spawn exactly one modal, rapid clicks should be debounced, and closing modals should work cleanly via all three methods (button/Escape/backdrop) without leaving ghost elements

---

## Phase 4: User Story 3 - Fix QRious CDN Integrity Hash (Priority: P3)

**Goal**: Resolve QRious library loading failure by removing problematic integrity attribute from CDN script tag

**Independent Test**: Navigate to digital ID page, verify QR code generates successfully without console integrity errors, scan QR code with mobile device to confirm verification URL resolves correctly

### Implementation for User Story 3

- [X] T026 [US3] Locate QRious CDN script tag in index.html (cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js)
- [X] T027 [US3] Remove integrity="..." attribute from QRious script tag while keeping crossorigin="anonymous" attribute
- [X] T028 [US3] Verify QRious script tag uses HTTPS URL (https://cdnjs.cloudflare.com) for security without integrity hash
- [X] T029 [US3] Test QR code generation on digital ID page by navigating to digital-id page and verifying QRious object is available in console
- [X] T030 [US3] Verify console shows NO "Failed to find valid digest in 'integrity' attribute" errors after page load

**Checkpoint**: At this point, the QRious library should load successfully from CDN without integrity errors, and the digital ID page should display a scannable QR code on the card back

---

## Phase 5: User Story 4 - Add Missing Chart Labels (Priority: P4)

**Goal**: Enhance monthly activity chart with clear Korean-language axis labels, tooltips, and legends for improved data interpretation

**Independent Test**: View dashboard "월별 활동 현황" chart, verify Y-axis shows "활동 수" label and numeric scale, X-axis shows "월" label and month names (8월-1월), hover over data points to see formatted tooltips ("활동: X건")

### Implementation for User Story 4

- [X] T031 [P] [US4] Create js/chart-config-enhanced.js with createMonthlyActivityChart() function implementing enhanced Chart.js configuration per contracts/chart-config-schema.yaml
- [X] T032 [US4] Add <script src="js/chart-config-enhanced.js?v=1.0"></script> to index.html before closing </body> tag (after Chart.js CDN)
- [X] T033 [US4] Configure Y-axis in createMonthlyActivityChart() with title "활동 수", beginAtZero: true, and Noto Sans KR font at 12px
- [X] T034 [US4] Configure X-axis in createMonthlyActivityChart() with title "월", Korean month labels ["8월", "9월", "10월", "11월", "12월", "1월"], and Noto Sans KR font at 12px
- [X] T035 [US4] Implement tooltip callbacks in chart configuration to display formatted values as "활동: ${count}건" with Korean localization
- [X] T036 [US4] Configure tooltip fonts (titleFont: 14px, bodyFont: 12px, both Noto Sans KR) and styling (backgroundColor: rgba(0,0,0,0.8), padding: 10px)
- [X] T037 [US4] Add KRDS color palette to chart configuration (borderColor: #0056b3, backgroundColor: rgba(0,86,179,0.1))
- [X] T038 [US4] Replace existing monthly activity chart initialization in js/app-pages-integrated.js with call to createMonthlyActivityChart()
- [X] T039 [US4] Test chart responsiveness at all breakpoints (320px, 430px, 768px, 1024px+) to verify labels remain readable without overlap
- [X] T040 [US4] Verify chart rendering performance < 200ms per plan.md performance budget using Chrome DevTools Performance panel

**Checkpoint**: At this point, the monthly activity chart should display with clear Y-axis "활동 수" and X-axis "월" labels, Korean month names, hover tooltips showing exact values, and maintain KRDS color compliance across all breakpoints

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, performance verification, and documentation updates

- [X] T041 [P] Run full regression test at all breakpoints (320px, 430px, 768px, 1024px+) per quickstart.md manual testing checklist
- [X] T042 [P] Verify total page weight remains < 500KB after all fixes using Chrome DevTools Network panel (Disable cache)
- [X] T043 [P] Test cross-browser compatibility on Chrome 80+, Safari 13+, Firefox 75+ per plan.md testing requirements
- [X] T044 [P] Verify WCAG 2.1 AA compliance for all fixes (contrast ratio ≥ 4.5:1, ARIA labels, keyboard navigation)
- [X] T045 [P] Validate KRDS design system compliance (colors: #003d7a, #0056b3, #f3f4f6; typography: Noto Sans KR)
- [X] T046 Verify all 10 success criteria from spec.md (SC-001 through SC-010) are met
- [X] T047 [P] Update CLAUDE.md if any new patterns or utilities were added (e.g., generateDefaultAvatar utility function)
- [X] T048 Run quickstart.md validation steps for all 4 priorities (P1-P4) to confirm bug fixes are complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup completion - Can start after T003
- **User Story 2 (Phase 3)**: Independent - Can start after Setup completion
- **User Story 3 (Phase 4)**: Independent - Can start after Setup completion
- **User Story 4 (Phase 5)**: Independent - Can start after Setup completion
- **Polish (Phase 6)**: Depends on completion of all 4 user stories

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - Can implement independently
- **User Story 2 (P2)**: No dependencies on other stories - Can implement independently
- **User Story 3 (P3)**: No dependencies on other stories - Can implement independently
- **User Story 4 (P4)**: No dependencies on other stories - Can implement independently

**All 4 user stories are completely independent and can be implemented in parallel by different developers**

### Within Each User Story

- **US1**: Favicon creation tasks (T004-T008) can run in parallel, then HTML update (T009), then avatar system creation (T010-T013) can run in parallel, then integration tasks (T014-T016) run sequentially
- **US2**: All tasks run sequentially as they modify the same modal system in app-modals-enhanced.js
- **US3**: All tasks run sequentially as they modify the same script tag in index.html
- **US4**: Chart config creation (T031-T037) can run in parallel with documentation, then integration (T038), then testing (T039-T040)

### Parallel Opportunities

- All Setup tasks (T001-T003) can run in parallel
- Within US1: T004-T008 (favicon creation) can run in parallel
- Within US1: T010-T013 (avatar system files) can run in parallel
- Within US4: T033-T037 (chart configuration) can run in parallel
- All Polish tasks (T041-T048) can run in parallel
- **All 4 user stories can be worked on in parallel by different team members after Setup completion**

---

## Parallel Example: User Story 1 (Fix Missing Image Assets)

```bash
# Launch all favicon creation tasks in parallel:
Task: "Create favicon.ico (16x16 ICO format) in images/fabicon/favicon.ico"
Task: "Create favicon-16x16.png in images/fabicon/favicon-16x16.png"
Task: "Create favicon-32x32.png in images/fabicon/favicon-32x32.png"
Task: "Create favicon-96x96.png in images/fabicon/favicon-96x96.png"
Task: "Create android-icon-192x192.png in images/fabicon/android-icon-192x192.png"

# Launch all avatar system file creation tasks in parallel:
Task: "Create js/app-utils.js with generateDefaultAvatar() function"
Task: "Create styles/default-avatar.css with responsive styles"
```

---

## Parallel Example: Multiple User Stories

```bash
# With 4 developers, implement all user stories in parallel after Setup:
Developer A: User Story 1 (P1) - Fix Missing Image Assets (T004-T016)
Developer B: User Story 2 (P2) - Fix Duplicate Modal Rendering (T017-T025)
Developer C: User Story 3 (P3) - Fix QRious CDN Integrity Hash (T026-T030)
Developer D: User Story 4 (P4) - Add Missing Chart Labels (T031-T040)

# All stories complete independently and integrate without conflicts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: User Story 1 - Fix Missing Image Assets (T004-T016)
3. **STOP and VALIDATE**: Test User Story 1 independently
   - Load index.html in Chrome DevTools
   - Verify Console shows ZERO ERR_FILE_NOT_FOUND errors
   - Verify Network tab shows all 5 favicons load with 200 status
   - Verify member profile displays initials on colored background
4. Deploy/demo if ready

### Incremental Delivery (Priority Order)

1. Complete Setup (Phase 1) → Project verified
2. Add User Story 1 (P1) → Test independently → Deploy/Demo (MVP! - Most visible bug fixed)
3. Add User Story 2 (P2) → Test independently → Deploy/Demo (Critical UX bug fixed)
4. Add User Story 3 (P3) → Test independently → Deploy/Demo (QR code functionality restored)
5. Add User Story 4 (P4) → Test independently → Deploy/Demo (Data visualization enhanced)
6. Polish (Phase 6) → Final validation → Production deployment
7. Each story adds value without breaking previous fixes

### Parallel Team Strategy

With 4+ developers:

1. Team completes Setup (Phase 1) together
2. Once Setup is done (after T003):
   - Developer A: User Story 1 (P1) - Image Assets
   - Developer B: User Story 2 (P2) - Modal System
   - Developer C: User Story 3 (P3) - QRious CDN
   - Developer D: User Story 4 (P4) - Chart Labels
3. All stories complete and integrate independently without file conflicts
4. Team reconvenes for Polish (Phase 6) validation

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability (US1-US4)
- Each user story is independently completable and testable
- No tests requested in spec - manual testing via quickstart.md checklists
- Commit after each task or logical group of tasks
- Stop at any checkpoint to validate story independently
- All fixes must maintain KRDS design system compliance (#003d7a, #0056b3, Noto Sans KR)
- All fixes must maintain < 500KB total page weight per performance budget
- Avoid: same file conflicts (use parallel opportunities), breaking existing functionality

---

## Task Summary

- **Total Tasks**: 48 tasks
- **Setup Phase**: 3 tasks
- **User Story 1 (P1)**: 13 tasks (T004-T016) - Fix Missing Image Assets
- **User Story 2 (P2)**: 9 tasks (T017-T025) - Fix Duplicate Modal Rendering
- **User Story 3 (P3)**: 5 tasks (T026-T030) - Fix QRious CDN Integrity Hash
- **User Story 4 (P4)**: 10 tasks (T031-T040) - Add Missing Chart Labels
- **Polish Phase**: 8 tasks (T041-T048) - Final validation and documentation
- **Parallel Opportunities**: 18 tasks marked [P] can run in parallel within their phases
- **Independent Stories**: All 4 user stories are independently implementable and testable
- **MVP Scope**: User Story 1 only (13 tasks) - fixes most visible image errors
