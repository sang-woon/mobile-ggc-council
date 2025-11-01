# Feature Specification: DID-Based Digital Member ID Card with QR Verification

**Feature Branch**: `001-digital-member-id`  
**Created**: 2025-01-31  
**Status**: Draft  
**Input**: User description: "DID-based digital member ID card display and QR code generation"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Display Digital Member ID Card (Priority: P1)

Council members need to quickly access and display their official digital ID card on mobile devices during field activities, committee meetings, and official events to verify their identity without carrying physical credentials.

**Why this priority**: This is the core MVP functionality. Without the ability to display the digital ID card, the entire feature has no value. Council members must be able to prove their identity digitally before any verification or authentication features matter.

**Independent Test**: Can be fully tested by navigating to the digital-id page and verifying that all member information (name, photo, position, district, term, member ID) displays correctly in a mobile-optimized format following KRDS design standards.

**Acceptance Scenarios**:

1. **Given** a council member is logged into the app, **When** they navigate to the "디지털 의원증" page, **Then** the digital ID card displays with their profile photo, full name, party affiliation, electoral district, term information, and unique member ID number
2. **Given** the digital ID card is displayed, **When** the user views the card on a 430px mobile viewport, **Then** all text is legible with minimum 14px font size, the card fits within the viewport without horizontal scrolling, and interactive elements meet 44px minimum touch target requirements
3. **Given** the digital ID card is displayed, **When** the user taps the card flip button, **Then** the card animates to show the reverse side with additional information (committee assignments, contact information, QR code placeholder) using smooth 60fps CSS transform animations
4. **Given** the digital ID card page loads, **When** the page renders, **Then** the page completes loading in under 3 seconds on 3G networks and maintains KRDS color scheme (#003d7a primary, #0056b3 secondary, #f3f4f6 background)

---

### User Story 2 - Generate and Display QR Code for External Verification (Priority: P2)

Council members and external parties (building security, event organizers, government agencies) need to quickly verify the authenticity of the digital ID card through a scannable QR code that encodes the member's DID and verification URL.

**Why this priority**: QR code verification adds trust and enables offline validation scenarios. While the digital card itself (P1) provides visual identification, the QR code enables machine-readable verification by third parties, which is critical for security checkpoints and official events.

**Independent Test**: Can be fully tested by viewing the digital ID card back, verifying that a QR code is generated using QRious library, and scanning the QR code with any standard QR scanner to confirm it encodes the verification URL with member DID.

**Acceptance Scenarios**:

1. **Given** a council member's digital ID card is displayed, **When** they flip the card to the back side, **Then** a QR code is automatically generated and displayed in the designated QR code area with minimum 200px × 200px size for reliable scanning
2. **Given** the QR code is generated, **When** scanned with any standard QR code reader, **Then** the QR code resolves to a verification URL in the format `https://council.gg.go.kr/verify/did:{member-did-identifier}` that can validate the member's identity
3. **Given** the QR code is displayed on screen, **When** viewed under various lighting conditions (bright sunlight, indoor lighting, low light), **Then** the QR code remains scannable with high contrast ratio (minimum 7:1) and includes error correction level M or higher
4. **Given** the digital ID card loads on a low-end mobile device, **When** the QR code is generated using QRious library, **Then** the QR code generation completes in under 500ms and does not block the UI thread

---

### User Story 3 - Display Blockchain Verification Status Indicator (Priority: P3)

Council members and administrators need visual confirmation that the digital ID card is backed by blockchain-verified credentials to establish trust in the authenticity and immutability of the identity information.

**Why this priority**: Blockchain verification indicator enhances trust and transparency but is not essential for basic identification. This feature provides peace of mind and supports the legislative requirement for blockchain-backed credentials, but the ID card functions without it.

**Independent Test**: Can be fully tested by viewing the digital ID card and verifying that a blockchain verification badge appears with appropriate visual styling, shows verification timestamp, and displays "블록체인 인증됨" status message.

**Acceptance Scenarios**:

1. **Given** a council member's DID is registered on the blockchain, **When** they view their digital ID card, **Then** a blockchain verification badge appears with a checkmark icon, green accent color, and text "블록체인 인증됨" (Blockchain Verified)
2. **Given** the blockchain verification badge is displayed, **When** the user taps the badge, **Then** a modal appears showing verification details including blockchain transaction hash (shortened with ellipsis), verification timestamp in Korean locale format, and block number
3. **Given** the digital ID card is loading blockchain verification status, **When** blockchain verification data is being fetched, **Then** a loading spinner appears in the badge area with text "인증 확인 중..." (Verifying) and does not block card display
4. **Given** blockchain verification fails or is unavailable, **When** the card cannot retrieve verification status, **Then** the badge shows a warning icon with yellow accent color and text "인증 확인 불가" (Verification Unavailable) without preventing card usage

---

### Edge Cases

- **No network connectivity**: What happens when the user opens the digital ID card page offline? The card should display cached member data from localStorage with a clear offline indicator, but QR code and blockchain verification features gracefully degrade with appropriate messaging.
- **Missing member photo**: How does the system handle missing or failed-to-load profile photos? Display a default avatar icon with member initials on a solid background color matching their party affiliation.
- **Long names or district names**: How does the card layout handle exceptionally long Korean names (5+ characters) or district names (15+ characters)? Text should wrap gracefully with ellipsis truncation on single-line elements and maintain minimum font size of 14px for readability.
- **QR code generation failure**: What happens if QRious library fails to load or generate QR code? Display an error message "QR 코드 생성 실패" with a retry button and maintain card functionality without QR code.
- **Rapid card flips**: How does the system handle users repeatedly tapping the flip button? Debounce flip actions to prevent animation jank and ensure smooth 60fps transitions.
- **Screen rotation**: How does the card adapt when device orientation changes from portrait to landscape? Card should reflow responsively while maintaining aspect ratio and readability.
- **Accessibility**: How do screen reader users navigate the digital ID card? Provide ARIA labels for all card sections, semantic HTML structure, and keyboard navigation support for flip action.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display council member's digital ID card containing full name in Korean, profile photograph (200×250px minimum), party affiliation with color coding, electoral district name, current term number, and unique member ID number
- **FR-002**: System MUST implement card flip animation using CSS transforms allowing users to view front and back of ID card with smooth 60fps animation and tactile vibration feedback (50ms) on mobile devices
- **FR-003**: System MUST generate QR code using QRious JavaScript library (loaded via CDN) encoding verification URL format `https://council.gg.go.kr/verify/did:{member-did}` with error correction level M and minimum 200×200px display size
- **FR-004**: System MUST display blockchain verification badge showing verification status with three states: verified (green checkmark + "블록체인 인증됨"), verifying (spinner + "인증 확인 중..."), or unavailable (warning icon + "인증 확인 불가")
- **FR-005**: System MUST store member data in `app.memberData` object structure and persist to localStorage for offline access with keys: name, photo, party, district, memberId, generation, committees, didIdentifier
- **FR-006**: Digital ID card page MUST comply with KRDS design system using official colors (primary #003d7a, secondary #0056b3, background #f3f4f6), Noto Sans KR typography, and government visual identity standards
- **FR-007**: System MUST meet WCAG 2.1 AA accessibility requirements including semantic HTML5 structure, ARIA labels for screen readers, keyboard navigation for card flip, and minimum 4.5:1 color contrast ratio for text
- **FR-008**: System MUST optimize for 430px mobile viewport as primary target with responsive breakpoints at 320px (minimum), 768px (tablet), and 1024px+ (desktop) using mobile-first CSS media queries
- **FR-009**: System MUST load digital ID card page including all assets (HTML, CSS, JS, QRious library, fonts, profile image) in under 3 seconds on 3G networks with total page weight under 500KB
- **FR-010**: System MUST implement error handling for missing profile photos (display default avatar with initials), QR code generation failures (show error message with retry), and blockchain verification timeouts (graceful degradation)
- **FR-011**: QR code MUST be scannable under various lighting conditions with high contrast ratio (minimum 7:1), work with standard QR readers, and include version number sufficient for URL length (minimum version 5)
- **FR-012**: Blockchain verification modal MUST display verification details including transaction hash (shortened format `0x1234...5678`), verification timestamp in Korean locale (`YYYY년 MM월 DD일 HH:mm:ss`), and block number when user taps verification badge

### Key Entities

- **Member Identity Data**: Core personal information for council member including name (string, Korean), photo (image URL or base64), party (string with color code), district (string), memberId (string, alphanumeric), generation (number, e.g., 11th term), committees (array of strings)
- **DID Credentials**: Decentralized Identifier information including didIdentifier (string, format `did:ggcouncil:{unique-id}`), publicKey (string, verification key), issuedDate (timestamp), expiresDate (timestamp), blockchainTxHash (string), blockNumber (number), verificationStatus (enum: verified, pending, failed)
- **QR Code Data**: Encoded verification information including verificationUrl (string, full URL), didIdentifier (reference to Member DID), generatedTimestamp (timestamp), errorCorrectionLevel (string, default 'M'), qrCodeDataUrl (base64 string of generated QR image)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Council members can view their complete digital ID card including all required information fields within 2 seconds of navigating to the digital-id page on a 3G mobile connection
- **SC-002**: Digital ID card page loads with total asset size under 500KB and achieves Time to Interactive (TTI) under 5 seconds on mobile devices as measured by Lighthouse audit
- **SC-003**: QR code displayed on digital ID card back is successfully scannable by standard QR code readers (iOS Camera, Android Camera, WeChat, KakaoTalk QR scanner) in 95% of scan attempts under normal indoor lighting conditions
- **SC-004**: Card flip animation maintains consistent 60fps performance without jank or stutter as measured by Chrome DevTools Performance profiler on mid-range Android devices (e.g., Samsung Galaxy A series)
- **SC-005**: Digital ID card achieves WCAG 2.1 AA compliance with zero critical accessibility violations when audited with aXe accessibility checker and passes keyboard navigation testing
- **SC-006**: 90% of council members successfully access and display their digital ID card on first attempt without errors or support tickets related to missing data or rendering issues
- **SC-007**: Blockchain verification status displays within 3 seconds of card load or gracefully degrades with appropriate messaging if verification service is unavailable
- **SC-008**: Digital ID card maintains visual design consistency with KRDS government standards and receives approval from Gyeonggi Provincial Council design review committee
- **SC-009**: System handles 200 concurrent council members accessing digital ID cards simultaneously without performance degradation or increased load times
- **SC-010**: Digital ID card functions correctly across all required browsers (Chrome 80+, Safari 13+, iOS 12+, Android 8+) with consistent rendering and behavior as validated by cross-browser testing

## Assumptions

- **Blockchain Infrastructure**: Assumes blockchain mainnet infrastructure (from PRD ECR-004) is already deployed and accessible via API endpoints for verification status queries
- **DID Registration**: Assumes council members' DIDs are pre-registered in the blockchain system and member data includes didIdentifier field populated during onboarding
- **Member Data Availability**: Assumes member profile data (name, photo, party, district, committees) is available in `app.memberData` object structure as defined in CLAUDE.md architecture
- **CDN Availability**: Assumes QRious library CDN (cdnjs.cloudflare.com) is accessible and reliable for QR code generation as documented in project dependencies
- **Photo Storage**: Assumes member profile photos are either stored as base64 data URLs in localStorage or accessible via HTTPS URLs with proper CORS headers
- **Verification URL**: Assumes verification endpoint `https://council.gg.go.kr/verify/did:{member-did}` will be implemented by backend team as part of broader blockchain integration (out of scope for this feature)
- **Authentication**: Assumes user is already authenticated via existing auth system before accessing digital-id page, with auth token stored in localStorage as per current authentication pattern
- **KRDS Assets**: Assumes KRDS design system CSS file (styles/krds-design-system.css) and Noto Sans KR font are already loaded in index.html as documented in project structure
