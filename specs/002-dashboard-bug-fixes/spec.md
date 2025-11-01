# Feature Specification: Dashboard Bug Fixes and Missing Asset Resolution

**Feature Branch**: `002-dashboard-bug-fixes`
**Created**: 2025-01-31
**Status**: Draft
**Input**: User description: "현재 상태에서 e:\01-project\251031-mobile-ggc-member\index.html 실행해 보고 메인대시보드에서 실행이 안되거나 부족하거나 하는 상세기능들을 구현해줘. playwrite mcp를 이용해도 돼. --- 그러니깐 지금 상태에서 눌러도 작동이 안되거나 오타나거나 미흡한 부분들을 개선해줘."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fix Missing Image Assets (Priority: P1)

Council members experience broken images and missing icons when accessing the main dashboard, creating an unprofessional appearance and reducing trust in the application's reliability.

**Why this priority**: Missing profile photos and favicons are the most visible defects that immediately impact first impressions and professional credibility. These must be fixed before addressing functional bugs.

**Independent Test**: Can be fully tested by loading the homepage and verifying all images load successfully without console errors (ERR_FILE_NOT_FOUND).

**Acceptance Scenarios**:

1. **Given** a user loads the main dashboard, **When** the member profile section renders, **Then** the profile photo displays correctly without broken image icon (no annomimus.jpg errors)
2. **Given** a user opens the application in a browser, **When** the page loads, **Then** all favicon sizes (16x16, 32x32, 96x96, 192x192) load successfully without 404 errors
3. **Given** missing member photo data, **When** the profile card renders, **Then** a default avatar with member initials displays on party-colored background (fallback behavior)
4. **Given** the browser console is open, **When** the dashboard loads completely, **Then** zero ERR_FILE_NOT_FOUND errors appear for image assets

---

### User Story 2 - Fix Duplicate Modal Rendering Issue (Priority: P2)

Council members click quick action buttons (보도자료, 일정표, 회의) and see duplicate modals stacking on top of each other, making it impossible to close modals or interact with content properly.

**Why this priority**: Duplicate modals completely break user interaction and force page refresh to recover. This is a critical UX bug affecting core navigation.

**Independent Test**: Can be fully tested by clicking any quick action button and verifying only one modal appears with proper close functionality.

**Acceptance Scenarios**:

1. **Given** a user is on the main dashboard, **When** they click the "보도자료" button, **Then** exactly one modal window appears without duplicates
2. **Given** a modal is open, **When** the user clicks the close button (X) or presses Escape key, **Then** the modal closes completely and does not block further interactions
3. **Given** a modal has been opened and closed, **When** the user clicks another quick action button, **Then** the previous modal is fully cleared before the new modal displays
4. **Given** a user clicks a quick action button multiple times rapidly, **When** the modal system processes the clicks, **Then** only one modal instance appears (debouncing protection)

---

### User Story 3 - Fix QRious CDN Integrity Hash Error (Priority: P3)

The QRious library fails to load due to integrity hash mismatch, breaking QR code generation functionality for the digital member ID feature.

**Why this priority**: While QR codes are important for identity verification, the basic dashboard functions work without them. This can be fixed after addressing visual and modal interaction bugs.

**Independent Test**: Can be fully tested by navigating to the digital ID page and verifying QR code generates successfully without console integrity errors.

**Acceptance Scenarios**:

1. **Given** a user loads the application, **When** the QRious CDN script loads, **Then** no integrity hash mismatch errors appear in console
2. **Given** a user navigates to the digital ID page, **When** the QR code generation function executes, **Then** a valid QR code image displays on the card back
3. **Given** the QRious library loads successfully, **When** scanned with a QR reader, **Then** the verification URL resolves correctly
4. **Given** the CDN is unavailable, **When** QR generation fails, **Then** a user-friendly error message displays with graceful degradation

---

### User Story 4 - Add Missing Chart Labels and Improve Visibility (Priority: P4)

The monthly activity chart on the dashboard displays data but lacks clear axis labels and legends, making it difficult for council members to interpret their performance trends.

**Why this priority**: Chart readability is important for data analysis but doesn't block core functionality. This is a polish enhancement after critical bugs are fixed.

**Independent Test**: Can be fully tested by viewing the "월별 활동 현황" chart and verifying all axis labels, legends, and data points are clearly visible and labeled.

**Acceptance Scenarios**:

1. **Given** a user views the dashboard, **When** the monthly activity chart renders, **Then** clear Y-axis labels show activity counts (0, 10, 20, 30, etc.) and X-axis shows month names in Korean
2. **Given** the chart displays multiple data series, **When** a user hovers over data points, **Then** a tooltip appears showing exact values and month labels
3. **Given** the chart renders on mobile viewport (430px), **When** viewed, **Then** all labels remain readable at minimum 12px font size without overlap
4. **Given** the chart has a legend, **When** rendered, **Then** legend clearly identifies what each data series represents (본회의, 상임위, 특별위)

---

### Edge Cases

- **Offline Mode**: What happens when images/CDN resources fail to load due to no network? The system should display fallback content (default avatars, error messages) and cache available data in localStorage.
- **Modal Z-Index Conflicts**: How does the system handle modals when side menu is open simultaneously? Modals should have higher z-index and close side menu automatically, or prevent menu opening when modal is active.
- **Rapid Button Clicks**: How does the system prevent duplicate modal spawning when users double-click buttons? Implement debouncing (200ms cooldown) and disable buttons while modal is opening.
- **Missing Default Avatar**: What if the default avatar fallback also fails to load? Use inline SVG or CSS-generated avatar with member initials and party color background.
- **Chart.js Rendering Failures**: How does the system handle Chart.js CDN failures or rendering errors? Display static data table as fallback with same statistics.
- **Browser Back Button with Open Modal**: What happens when user presses back button while modal is open? Modal should close first, then normal page navigation occurs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST replace all broken image references (annomimus.jpg, fabicon/*.png) with valid asset paths or remove invalid `<link>` and `<img>` tags that reference non-existent files
- **FR-002**: System MUST implement default avatar fallback using member initials (first 2 characters of name) on party-colored circular background when profile photo is missing or fails to load
- **FR-003**: System MUST fix QRious CDN script tag to use correct integrity hash or remove integrity attribute to allow library loading from cdnjs.cloudflare.com
- **FR-004**: System MUST prevent duplicate modal rendering by checking for existing modal instances before creating new ones and clearing previous modals completely when closed
- **FR-005**: System MUST implement modal close functionality that removes ALL modal DOM elements and event listeners to prevent z-index blocking and interaction issues
- **FR-006**: System MUST debounce quick action button clicks with 200ms cooldown to prevent rapid-fire modal spawning from double-clicks or impatient users
- **FR-007**: System MUST add clear axis labels to monthly activity chart showing Y-axis (활동 수, 0-70 range) and X-axis (월, 8월-1월) in Korean with minimum 12px readable font size
- **FR-008**: System MUST implement chart hover tooltips showing exact activity counts and month labels when user hovers over data points for detailed data inspection
- **FR-009**: System MUST ensure modal overlay (backdrop) is properly created and destroyed with modal lifecycle to prevent interaction blocking and visual artifacts
- **FR-010**: System MUST fix modal Escape key handling to close topmost modal only and restore normal keyboard navigation after modal closes
- **FR-011**: System MUST create placeholder favicon assets in `/images/fabicon/` directory (favicon.ico, favicon-16x16.png, favicon-32x32.png, favicon-96x96.png, android-icon-192x192.png) or remove invalid favicon `<link>` tags from index.html
- **FR-012**: System MUST validate all CDN script integrity hashes match actual CDN file hashes or remove integrity attributes for libraries where hash verification causes loading failures

### Key Entities

- **Modal Instance**: Represents an active modal window with properties: id (unique identifier), title (modal header text), content (HTML body), isOpen (boolean state), zIndex (stacking order), onClose (cleanup callback function)
- **Image Asset**: Represents image files referenced in application with properties: path (file location), type (favicon/profile/icon), fallbackStrategy (default avatar/inline SVG/CSS background), loadStatus (loading/success/error)
- **Chart Configuration**: Represents monthly activity chart settings with properties: data (activity counts by month), labels (month names in Korean), options (axis labels, tooltips, responsive settings), type (line chart)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Application loads with zero ERR_FILE_NOT_FOUND console errors for image assets when tested on Chrome DevTools Network tab with cache disabled
- **SC-002**: Quick action buttons (보도자료, 일정표, 회의, 통계, 연락처, 알림) spawn exactly one modal per click and close cleanly without requiring page refresh in 100% of test cases
- **SC-003**: QRious library loads successfully and generates scannable QR codes on digital ID page without integrity hash errors when tested across Chrome 80+, Safari 13+, Firefox 75+
- **SC-004**: Monthly activity chart displays with clear Y-axis labels, X-axis month names, and hover tooltips that pass WCAG 2.1 AA readability standards (4.5:1 contrast ratio, minimum 12px font)
- **SC-005**: Modal close functionality works via close button, Escape key, and backdrop click in 95% of user test scenarios without leaving ghost DOM elements or event listeners
- **SC-006**: Default avatar fallback displays member initials on party-colored background when profile photo is missing, tested with 5 different member names to verify initial extraction logic
- **SC-007**: Application maintains < 500KB total page weight after adding fallback avatar SVGs and placeholder favicon assets, verified through Chrome DevTools Network panel
- **SC-008**: Modal debouncing prevents duplicate spawning when buttons are clicked 5 times rapidly within 1 second, tested across all quick action buttons
- **SC-009**: Chart.js monthly activity visualization renders correctly at all breakpoints (320px, 430px, 768px, 1024px+) with responsive font sizing and no label overlap
- **SC-010**: All fixes maintain KRDS design system compliance with official government colors (#003d7a primary, #0056b3 secondary, #f3f4f6 background) and Noto Sans KR typography

## Assumptions

- **Existing Architecture**: Assumes current vanilla JavaScript architecture with `window.app` global object pattern remains unchanged and all fixes integrate with existing codebase documented in CLAUDE.md
- **Chart.js Availability**: Assumes Chart.js CDN (cdn.jsdelivr.net/npm/chart.js) loads successfully and only configuration/labeling issues need fixing, not core rendering logic
- **Modal System**: Assumes existing modal system uses CSS classes `.mobile-modal-container` and `.mobile-modal-active` for visibility control as seen in Playwright testing
- **Image Directory Structure**: Assumes `/images/` directory exists with subdirectory `/images/fabicon/` for favicon assets, or that these directories can be created without build process changes
- **Member Data Structure**: Assumes `app.memberData` object contains `name`, `party`, `partyColor` fields for default avatar generation as documented in existing data schema
- **No Backend Changes**: Assumes all fixes are frontend-only and do not require backend API modifications, consistent with static site architecture documented in PRD.md
- **Browser Compatibility**: Assumes testing targets Chrome 80+, Safari 13+, Firefox 75+, iOS 12+, Android 8+ as specified in constitution.md Principle VII
- **Performance Budget**: Assumes < 500KB total page weight limit from constitution.md Principle IV applies and new assets (favicons, default avatars) must fit within existing budget
