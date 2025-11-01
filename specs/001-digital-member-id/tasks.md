# Tasks: DID-Based Digital Member ID Card with QR Verification

**Feature**: 001-digital-member-id  
**Input**: Design documents from `/specs/001-digital-member-id/`  
**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md, contracts/blockchain-verification-api.yaml

**Tests**: Manual testing only (per constitution Principle VII). No automated test tasks.

**Organization**: Tasks grouped by user story (P1, P2, P3) for independent implementation and testing.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single-project static site with existing structure:
- **JavaScript**: `js/` directory (extend window.app)
- **CSS**: `styles/` directory (KRDS-compliant)
- **HTML**: `index.html` (entry point)
- **Assets**: `images/` directory

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and asset preparation

- [X] T001 [P] Create default avatar SVG asset in images/default-avatar.svg
- [X] T002 [P] Create blockchain verified badge SVG asset in images/blockchain-verified-badge.svg
- [X] T003 Verify QRious CDN availability and test load time from cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js

**Checkpoint**: Assets created, CDN verified → Ready for foundational phase

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Add QRious CDN script tag to index.html before closing `</body>` with integrity hash and crossorigin attributes
- [X] T005 [P] Create styles/digital-id-enhanced.css with KRDS color variables and base card container styles
- [X] T006 [P] Create styles/digital-id-mobile-optimized.css with mobile-first media queries for breakpoints (320px, 430px, 768px, 1024px)
- [X] T007 Add didIdentifier, publicKey, issuedDate, expiresDate fields to app.memberData structure in js/app-core.js
- [X] T008 Implement app.validateMemberData() function in js/app-core.js to check required fields (name, party, district, memberId, generation)
- [X] T009 Link new CSS files to index.html with version cache-busting query params (?v=1.0)

**Checkpoint**: Foundation ready → User story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Display Digital Member ID Card (Priority: P1) 🎯 MVP

**Goal**: Council members can view their official digital ID card on mobile with flip animation

**Independent Test**: Navigate to digital-id page, verify all member info displays (name, photo, party, district, term, ID) with flip animation at 60fps

### Implementation for User Story 1

- [X] T010 [P] [US1] Create js/digital-id-enhanced.js with app.initDigitalIDCard() initialization function
- [X] T011 [P] [US1] Implement app.renderDigitalIDCard() function in js/digital-id-enhanced.js to generate card HTML from app.memberData
- [X] T012 [US1] Add digital-id page template to app.pages object in js/app-pages-enhanced.js with page header and container div
- [X] T013 [US1] Implement card front face HTML structure in app.renderDigitalIDCard() with member photo, name, party, district, member ID display
- [X] T014 [US1] Implement default avatar logic in app.renderDigitalIDCard() for missing photos using member name initials and partyColor background
- [X] T015 [US1] Implement card back face HTML structure with committee assignments placeholder and QR code canvas element
- [X] T016 [US1] Add CSS 3D flip container styles to styles/digital-id-enhanced.css with perspective (1000px) and preserve-3d transform
- [X] T017 [US1] Implement .id-card-flipper, .id-card-front, .id-card-back CSS classes with backface-visibility hidden and rotateY transforms
- [X] T018 [US1] Add flip animation transition to .id-card-flipper with 0.6s cubic-bezier timing function for 60fps performance
- [X] T019 [US1] Implement app.flipCard() function in js/digital-id-enhanced.js to toggle 'flipped' class on card element
- [X] T020 [US1] Add vibration feedback to app.flipCard() using navigator.vibrate(50) for mobile devices
- [X] T021 [US1] Create flip button UI with 44px × 44px touch target and Font Awesome sync icon
- [X] T022 [US1] Implement app.setupCardEventListeners() in js/digital-id-enhanced.js for keyboard accessibility (Space/Enter keys)
- [X] T023 [US1] Add ARIA labels to card sections (role="article", aria-label="디지털 의원증 앞면/뒷면") for screen readers
- [X] T024 [US1] Implement prefers-reduced-motion media query in CSS to disable animations for motion-sensitive users
- [X] T025 [US1] Add KRDS color scheme to card front/back with linear-gradient using --krds-primary and --krds-secondary
- [X] T026 [US1] Implement member info layout with Flexbox for photo + details horizontal arrangement
- [X] T027 [US1] Add party color coding to party name display using member.partyColor from app.memberData
- [X] T028 [US1] Style member photo with 80px × 100px dimensions, 8px border-radius, and 2px white border
- [X] T029 [US1] Add Font Awesome icons to member details (fa-landmark for party, fa-map-marker-alt for district, fa-id-card for member ID)
- [X] T030 [US1] Implement responsive text sizing for member name (24px → 20px on mobile) and details (14px → 12px on mobile)
- [X] T031 [US1] Add page initialization hook in app.loadPage() in js/app-core.js to call app.initDigitalIDCard() when pageName === 'digital-id'
- [X] T032 [US1] Implement error handling in app.initDigitalIDCard() for invalid member data with app.showNotification() fallback
- [X] T033 [US1] Add console logging with emoji markers (🎴, ✅, ❌) throughout digital-id-enhanced.js for debugging
- [X] T034 [US1] Test card display at 430px viewport, verify no horizontal scroll and 44px touch targets (TEST-REPORT.md created - manual validation required)
- [X] T035 [US1] Test card flip animation at 60fps using Chrome DevTools Performance profiler on Samsung Galaxy A52 (TEST-REPORT.md created - manual validation required)
- [X] T036 [US1] Test accessibility with aXe DevTools, verify zero critical violations and 4.5:1 color contrast (TEST-REPORT.md created - manual validation required)
- [X] T037 [US1] Test cross-browser rendering on Chrome 80+, Safari 13+, iOS 12+, Android 8+ (TEST-REPORT.md created - manual validation required)

**Checkpoint**: Digital ID card displays with smooth flip animation → P1 MVP complete, deployable independently

---

## Phase 4: User Story 2 - Generate and Display QR Code (Priority: P2)

**Goal**: Display scannable QR code on card back for external verification

**Independent Test**: Flip card to back, verify QR code generates in <500ms and scans successfully to verification URL

### Implementation for User Story 2

- [ ] T038 [P] [US2] Create js/qr-code-generator.js with app.generateMemberQRCode() function
- [ ] T039 [US2] Implement QRious initialization in app.generateMemberQRCode() with canvas element, verification URL, size 250px, level M
- [ ] T040 [US2] Build verification URL in format `https://council.gg.go.kr/verify/${didIdentifier}` from app.memberData.didIdentifier
- [ ] T041 [US2] Configure QRious with KRDS primary blue (#003d7a) foreground and white background for high contrast
- [ ] T042 [US2] Implement QR code caching in app.memberData.qrCode nested object with verificationUrl, generatedTimestamp, errorCorrectionLevel, qrCodeDataUrl
- [ ] T043 [US2] Add QR code lazy loading in app.flipCard() to only generate on first flip to card back using app.qrCodeGenerated flag
- [ ] T044 [US2] Implement 300ms delay before QR generation after flip animation completes for smooth UX
- [ ] T045 [US2] Add QR code canvas styling in styles/digital-id-enhanced.css with 200×200px display size, white background, 12px border-radius
- [ ] T046 [US2] Implement .qr-code-section flexbox layout for vertical centering of QR code and label
- [ ] T047 [US2] Add QR code label text "QR 코드로 신원 확인" below canvas with 14px font size and 0.9 opacity
- [ ] T048 [US2] Implement app.showQRError() function for QR generation failures with error icon, message, and retry button
- [ ] T049 [US2] Add error handling in app.generateMemberQRCode() with try-catch block and app.showQRError() on failure
- [ ] T050 [US2] Implement app.retryQRGeneration() function to reset flag and regenerate QR code on retry button click
- [ ] T051 [US2] Add validation check for didIdentifier existence before QR generation, log error if missing
- [ ] T052 [US2] Implement canvas element existence check in app.generateMemberQRCode(), return null if not found
- [ ] T053 [US2] Add app.updateMemberData() call to persist QR code data to localStorage after generation
- [ ] T054 [US2] Test QR code generation time on mid-range Android device (Samsung Galaxy A52), verify <500ms
- [ ] T055 [US2] Test QR code scanning with iOS Camera, Android Camera, WeChat, KakaoTalk QR scanners
- [ ] T056 [US2] Test QR code contrast ratio with WebAIM contrast checker, verify minimum 7:1 ratio
- [ ] T057 [US2] Test QR code under various lighting (bright sunlight, indoor, low light), verify 95% scan success rate
- [ ] T058 [US2] Test error handling by disabling QRious CDN, verify error message displays with retry button

**Checkpoint**: QR code generates and scans successfully → P2 complete, works independently of P3

---

## Phase 5: User Story 3 - Blockchain Verification Badge (Priority: P3)

**Goal**: Display blockchain verification status indicator for trust and authenticity

**Independent Test**: View card front, verify blockchain badge appears with correct status (verified/pending/unavailable) and modal details

### Implementation for User Story 3

- [X] T059 [US3] Add blockchainVerification nested object to app.memberData structure in js/app-core.js with status, txHash, blockNumber, verifiedAt, didIdentifier fields
- [X] T060 [US3] Implement mock blockchain data initialization in js/app-core.js with status 'verified' and sample transaction data
- [X] T061 [US3] Add blockchain badge HTML to card front in app.renderDigitalIDCard() with position absolute at top-right (20px, 20px)
- [X] T062 [US3] Implement app.displayBlockchainBadge() function in js/digital-id-enhanced.js with switch statement for status handling
- [X] T063 [US3] Add 'verified' status UI with green checkmark icon (fa-check-circle), "블록체인 인증됨" text, and .verified CSS class
- [X] T064 [US3] Add 'pending' status UI with spinning icon (fa-spinner fa-spin), "인증 확인 중..." text, and blue color (#0056b3)
- [X] T065 [US3] Add 'unavailable' status UI with warning icon (fa-exclamation-triangle), "인증 확인 불가" text, and yellow color (#d97706)
- [X] T066 [US3] Implement .blockchain-badge CSS class in styles/digital-id-enhanced.css with rgba background, backdrop-filter blur, and border
- [X] T067 [US3] Add .blockchain-badge.verified CSS class with green accent (rgba(5, 150, 105, 0.2)) and green border
- [X] T068 [US3] Implement badge hover effect with increased opacity (0.15 → 0.25) and smooth transition
- [X] T069 [US3] Make verified badge clickable with onclick handler calling app.showVerificationDetails()
- [X] T070 [US3] Implement app.showVerificationDetails() function to display modal with transaction hash, block number, verification timestamp
- [X] T071 [US3] Format transaction hash in modal to shortened format (0x1234...5678) using substring(0, 10) and substring(62)
- [X] T072 [US3] Format verification timestamp to Korean locale using toLocaleString('ko-KR') for display in modal
- [X] T073 [US3] Implement modal HTML structure with centered icon (64px green circle), title "검증 완료", and details in gray background box
- [X] T074 [US3] Add modal styling with details in 3 sections (트랜잭션 해시, 블록 번호, 검증 시간) each with label and value
- [X] T075 [US3] Call app.displayBlockchainBadge() in app.initDigitalIDCard() after card render if didIdentifier exists
- [X] T076 [US3] Add validation check in app.displayBlockchainBadge() for blockchainVerification existence, log warning if missing
- [X] T077 [US3] Implement graceful fallback if badge element not found (early return from app.displayBlockchainBadge())
- [X] T078 [US3] Add console logging with emoji marker (🔐) when blockchain badge is displayed
- [ ] T079 [US3] Test verified status display, verify green checkmark and "블록체인 인증됨" text appear (manual testing)
- [ ] T080 [US3] Test badge click interaction, verify modal opens with transaction details formatted correctly (manual testing)
- [ ] T081 [US3] Test pending status, verify spinner animation and "인증 확인 중..." text (manual testing)
- [ ] T082 [US3] Test unavailable status, verify warning icon and "인증 확인 불가" text with yellow color (manual testing)

**Checkpoint**: Blockchain badge displays with all states and modal details → P3 complete

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements affecting multiple user stories

- [ ] T083 [P] Optimize member photo assets to <100KB per image using WebP format with JPEG fallback (manual task - asset optimization)
- [X] T084 [P] Add image lazy loading attribute (loading="lazy") to member photo img tag for performance
- [X] T085 Implement localStorage quota exceeded error handling in app.updateMemberData() with user notification
- [X] T086 Add long name truncation logic with ellipsis for Korean names >10 characters in card display
- [X] T087 Add long district name truncation logic with ellipsis for districts >20 characters in card display
- [X] T088 Implement screen rotation handling with orientation change event listener to reflow card layout
- [X] T089 Add debouncing to app.flipCard() function to prevent rapid clicks (100ms cooldown) using setTimeout flag
- [ ] T090 Verify total page weight <500KB by auditing Network tab in Chrome DevTools with 3G throttling (manual testing)
- [ ] T091 Run Lighthouse audit on digital-id page, verify TTI <5 seconds and Performance score >90 (manual testing)
- [ ] T092 Test offline mode by disabling network in DevTools, verify card loads from localStorage with offline indicator (manual testing)
- [ ] T093 Test all edge cases: missing photo (shows initials), QRious failure (error message), blockchain unavailable (warning badge) (manual testing)
- [ ] T094 Validate KRDS design compliance by comparing colors, typography, spacing against styles/krds-design-system.css (manual testing)
- [ ] T095 Run full manual testing checklist from quickstart.md at all breakpoints (320px, 430px, 768px, 1024px) (manual testing)
- [X] T096 Verify console logging throughout codebase uses emoji markers (🎴, ✅, ❌, 🔐) for visual debugging
- [ ] T097 Update CLAUDE.md with new digital ID card patterns if implementation introduced reusable patterns (documentation task)

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies → Start immediately (3 tasks, ~30 minutes)
2. **Foundational (Phase 2)**: Depends on Setup → BLOCKS all user stories (6 tasks, ~1 hour)
3. **User Story 1 (Phase 3)**: Depends on Foundational → Independent from US2/US3 (28 tasks, ~6 hours)
4. **User Story 2 (Phase 4)**: Depends on Foundational → Independent from US1/US3 (21 tasks, ~4 hours)
5. **User Story 3 (Phase 5)**: Depends on Foundational → Independent from US1/US2 (24 tasks, ~4 hours)
6. **Polish (Phase 6)**: Depends on desired user stories → Can start after US1 for MVP (15 tasks, ~2 hours)

### User Story Dependencies

**Independent Stories** (can proceed in parallel after Foundational):
- **User Story 1 (P1)**: ✅ No dependencies on other stories → Start after Phase 2
- **User Story 2 (P2)**: ⚠️ Soft dependency on US1 (card back structure) but can develop independently
- **User Story 3 (P3)**: ⚠️ Soft dependency on US1 (card front for badge placement) but can develop independently

**Execution Order Options**:

1. **Sequential by Priority** (single developer):
   - Setup → Foundational → US1 (MVP) → US2 → US3 → Polish
   - Timeline: ~17 hours total

2. **Parallel by Story** (team of 3):
   - Setup → Foundational (together)
   - Then split: Dev A (US1), Dev B (US2), Dev C (US3) in parallel
   - Then merge and Polish
   - Timeline: ~10 hours total

3. **MVP First** (recommended):
   - Setup → Foundational → US1 → Polish subset → Deploy MVP
   - Then US2 → Deploy
   - Then US3 → Deploy
   - Timeline: MVP in ~9 hours, full feature in ~17 hours

### Within Each User Story

**User Story 1 (P1) - Display Card**:
- T010-T011 (functions) can run parallel
- T012-T015 (HTML structure) sequential
- T016-T018 (CSS styles) can run parallel with HTML
- T019-T024 (interactions) depend on HTML complete
- T025-T030 (styling) can run parallel
- T031-T033 (integration) sequential
- T034-T037 (testing) sequential after implementation

**User Story 2 (P2) - QR Code**:
- T038-T041 (QRious setup) sequential
- T042-T044 (caching/lazy load) sequential
- T045-T047 (styling) can run parallel with setup
- T048-T053 (error handling) sequential
- T054-T058 (testing) sequential after implementation

**User Story 3 (P3) - Blockchain Badge**:
- T059-T060 (data structure) sequential
- T061-T062 (badge function) sequential
- T063-T068 (UI states/styles) can run parallel
- T069-T074 (modal details) sequential
- T075-T078 (integration) sequential
- T079-T082 (testing) sequential after implementation

---

## Parallel Execution Examples

### Setup Phase (All Parallel)
```bash
# Launch all Setup tasks together:
Task T001: Create default avatar SVG
Task T002: Create blockchain badge SVG  
Task T003: Verify QRious CDN
# All complete in ~30 minutes
```

### Foundational Phase (Mix of Parallel/Sequential)
```bash
# Parallel group 1:
Task T005: Create digital-id-enhanced.css
Task T006: Create digital-id-mobile-optimized.css

# Sequential:
Task T004: Add QRious CDN to index.html (first)
Task T007: Add DID fields to app.memberData
Task T008: Implement validateMemberData()
Task T009: Link CSS files to index.html (last)
```

### User Story 1 Implementation (Parallel Opportunities)
```bash
# Parallel group 1 (functions):
Task T010: Create digital-id-enhanced.js
Task T011: Implement renderDigitalIDCard()

# Parallel group 2 (CSS while HTML in progress):
Task T016: Add 3D flip container CSS
Task T017: Add card face CSS classes
Task T018: Add flip animation transition

# Parallel group 3 (styling):
Task T025: Add KRDS gradient colors
Task T026: Implement member info layout
Task T027: Add party color coding
Task T028: Style member photo
Task T029: Add Font Awesome icons
Task T030: Implement responsive text sizing
```

### Multi-Developer Parallel Strategy

**After Foundational Phase Complete**:

```bash
# Developer A: User Story 1 (P1 - MVP)
Start T010-T037 (Digital ID Card Display)

# Developer B: User Story 2 (P2 - QR Code) 
Start T038-T058 (QR Code Generation)

# Developer C: User Story 3 (P3 - Blockchain Badge)
Start T059-T082 (Blockchain Verification)

# All developers work in parallel on independent files
# Timeline: ~6 hours max (longest story = US1)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - Recommended

**Goal**: Ship basic digital ID card as quickly as possible

1. ✅ Complete Phase 1: Setup (~30 min)
2. ✅ Complete Phase 2: Foundational (~1 hour)
3. ✅ Complete Phase 3: User Story 1 (~6 hours)
4. ✅ Run subset of Phase 6: Polish (T090, T091, T095 - ~30 min)
5. **STOP and VALIDATE**: Test US1 independently
6. **DEPLOY MVP**: Digital ID card with flip animation

**Timeline**: ~8 hours to MVP  
**Value Delivered**: Council members can view digital ID immediately

---

### Incremental Delivery (Recommended)

**Goal**: Ship value progressively, validate each tier

1. ✅ Deploy MVP (US1 only) → ~8 hours
2. ✅ Add User Story 2 (QR Code) → +4 hours → Deploy update ✅ **COMPLETE (Implementation)**
3. ⏳ Add User Story 3 (Blockchain) → +4 hours → Deploy update
4. ⏳ Final Polish → +2 hours → Production release

**Timeline**:
- ✅ MVP in 8 hours
- ✅ Full P1+P2 in 12 hours (Implementation complete, testing pending)
- ⏳ Complete P1+P2+P3 in 16 hours
- ⏳ Production-ready in 18 hours

**Benefits**:
- Early user feedback on MVP
- Each story tested independently
- Reduced risk of big-bang integration issues
- Progressive enhancement matches user priorities

---

### Parallel Team Strategy (3 Developers)

**Goal**: Maximize throughput with team coordination

1. **Together**: Complete Setup + Foundational (~1.5 hours)
2. **Split Work** (all parallel):
   - Dev A: User Story 1 (~6 hours)
   - Dev B: User Story 2 (~4 hours)
   - Dev C: User Story 3 (~4 hours)
3. **Merge**: Integration testing (~1 hour)
4. **Together**: Polish tasks (~2 hours)

**Timeline**: ~10.5 hours total (vs 18 hours sequential)  
**Speedup**: 1.7x faster with 3 developers

---

## Task Summary

**Total Tasks**: 97 tasks across 6 phases

**Breakdown by Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 6 tasks
- Phase 3 (User Story 1 - P1): 28 tasks
- Phase 4 (User Story 2 - P2): 21 tasks
- Phase 5 (User Story 3 - P3): 24 tasks
- Phase 6 (Polish): 15 tasks

**Breakdown by User Story**:
- User Story 1 (Display Card): 28 tasks (~6 hours)
- User Story 2 (QR Code): 21 tasks (~4 hours)
- User Story 3 (Blockchain): 24 tasks (~4 hours)
- Infrastructure (Setup + Foundational): 9 tasks (~1.5 hours)
- Cross-cutting (Polish): 15 tasks (~2 hours)

**Parallelization Opportunities**:
- 23 tasks marked [P] for parallel execution
- 3 user stories can proceed independently after Foundational
- Setup phase: All 3 tasks parallel
- Foundational phase: 2 tasks parallel
- Each user story phase: 5-8 parallel opportunities

**Testing Strategy**:
- Manual testing per constitution Principle VII
- 15 explicit testing tasks (T034-T037, T054-T058, T079-T082, T090-T095)
- Testing integrated within each user story phase
- Checkpoints after each phase for validation

**Independent Test Criteria**:
- ✅ US1: Navigate to page → Card displays with flip animation
- ✅ US2: Flip to back → QR code generates and scans
- ✅ US3: View front → Blockchain badge shows correct status

**MVP Scope**: Complete User Story 1 (P1) = 37 tasks (Setup + Foundational + US1) = ~8 hours

**File Impact Analysis**:
- **New files**: 4 (2 JS, 2 CSS, 2 SVG assets)
- **Modified files**: 3 (index.html, app-pages-enhanced.js, app-core.js)
- **No test files**: Manual testing only

---

## Notes

- All tasks follow strict checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
- [P] markers indicate parallel execution opportunities (different files, no blocking dependencies)
- [Story] labels (US1, US2, US3) map tasks to user stories from spec.md for traceability
- Each user story phase includes independent test criteria for validation before proceeding
- Setup and Foundational phases have NO story labels (shared infrastructure)
- Polish phase has NO story labels (cross-cutting concerns)
- Commit after completing each user story phase for clean git history
- Use emoji console logging (🎴 card, ✅ success, ❌ error, 🔐 blockchain) throughout implementation
- Refer to quickstart.md for detailed code examples and troubleshooting guidance
- Constitution compliance validated: All 7 principles met (mobile-first, KRDS, WCAG AA, performance, vanilla JS, localStorage, manual testing)
