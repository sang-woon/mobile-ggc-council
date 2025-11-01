# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**경기도의회 의원 의정활동 관리시스템** - Mobile-first web application for managing Gyeonggi Provincial Council members' legislative activities.

- **Primary Language**: Korean (UI, comments, documentation)
- **Technology Stack**: Vanilla JavaScript ES6+, HTML5, CSS3, Tailwind CSS
- **Target Platform**: Mobile-first (430px optimized), responsive design
- **Architecture**: Single-page application with modular JavaScript components
- **No Build Process**: Static site - open index.html directly in browser

## Development Workflow

### Local Development
```bash
# No build commands needed - pure static site
# Simply open index.html in any modern browser

# For live development with auto-reload:
# - Use VS Code Live Server extension
# - Or any static file server (e.g., python -m http.server 8000)

# Browser DevTools Console for debugging
# Check for JavaScript errors and console logs
```

### Testing Checklist
- **Mobile Responsiveness**: Test at 320px, 430px (primary), 768px, 1024px+ breakpoints
- **Touch Interactions**: Verify 44px minimum touch targets on all interactive elements
- **Performance**: Page load should be < 3 seconds on 3G networks
- **Accessibility**: Run WCAG 2.1 AA validation tools
- **Cross-browser**: Chrome 80+, Safari 13+, Firefox 75+, iOS 12+, Android 8+

## Application Architecture

### Core Application Controller (`window.app`)

The entire application is managed through a single global `app` object that serves as the central controller:

**Location**: `main.js` (lines 1-300)

**Key Responsibilities**:
- Page routing and navigation via `navigateTo()` and `loadPage()`
- Authentication state management (`authToken`, `isAuthenticated`)
- Member data binding (`memberData` object) with localStorage persistence
- Modal and overlay control system
- Side menu management (`openSideMenu()`, `closeSideMenu()`)
- Event listener coordination for all UI interactions

### Modular JavaScript System

The application uses a modular approach with specialized JavaScript files in `/js/`:

**Core Modules**:
- `app-core.js` - Core application logic and initialization
- `app-pages.js` / `app-pages-enhanced.js` - Page template definitions
- `app-modals.js` / `app-modals-enhanced.js` - Modal system and interactions
- `app-calendar.js` - Calendar functionality with FullCalendar integration
- `app-civil.js` - Enhanced civil complaint processing system
- `app-location-enhanced.js` - GPS-verified location-based activity tracking

**Specialized Modules** (47 files total):
- Digital ID system (`digital-id-*.js`)
- Attendance tracking (`attendance-*.js`)
- Data management (`data-manager.js`, `member-data-manager.js`)
- Real-time features (`app-realtime-notifications.js`)
- Performance optimization (`performance-optimizer.js`)
- Mobile interactions (`mobile-interactions.js`)
- AI features (`ai-recommendations.js`)

### Data Flow Pattern

1. **Member Data**: Stored in `app.memberData`, synced to localStorage
2. **Authentication**: Token-based with localStorage persistence
3. **Page Navigation**:
   - User clicks menu/nav item
   - `navigateTo(page)` called
   - Page content loaded from `app.pages[page]`
   - Page-specific initialization functions executed
4. **Modal System**: Centralized modal management with overlay backdrop
5. **Real-time Updates**: Chart.js for data visualization, auto-refresh patterns

### State Management Pattern

```javascript
// Update member data and persist
app.memberData.property = newValue;
localStorage.setItem('memberData', JSON.stringify(app.memberData));

// Retrieve persisted data
const savedData = JSON.parse(localStorage.getItem('memberData'));
```

## Critical Implementation Patterns

### Mobile-First Development

**Touch Target Requirements**:
- Minimum 44px × 44px for all interactive elements (Apple HIG standard)
- Use `touch-action: manipulation` to prevent double-tap zoom
- Implement both `click` and `touchstart` events for reliability

**Scroll Management**:
- Disable body scroll when modals/menus are open using `overflow: hidden`
- Restore scroll position when closing overlays
- Use `position: fixed` for overlays to prevent scroll-through

**Performance Targets**:
- Initial load: < 500KB total bundle size
- Page transitions: 60fps animations using CSS transforms
- Target < 3 seconds page load on 3G networks

### Government Design Standards

**Color Palette** (must use official government colors):
- Primary Blue: `#003d7a` (경기도의회 메인)
- Secondary Blue: `#0056b3` (강조 색상)
- Background: `#f3f4f6` (회색 배경)

**Typography**:
- Font Family: Noto Sans KR (Google Fonts)
- Weights: 300, 400, 500, 600, 700

**Accessibility Requirements**:
- WCAG 2.1 AA compliance mandatory
- Semantic HTML5 markup
- ARIA labels for interactive elements
- Keyboard navigation support

## Page Structure and Navigation

### Page System Architecture

Pages are defined in `app.pages` object as HTML template strings. Each page has:
- Unique ID used for routing
- HTML content template
- Optional initialization function
- Navigation menu entry

**13 Main Pages**:
- `home` - Dashboard with statistics and activity charts
- `digital-id` - Digital member ID card with QR code
- `attendance` - Attendance tracking with calendar integration
- `info` - Member profile and detailed information
- `bill` - Legislative bill management
- `speech` - Speech records and statistics
- `civil` - Civil complaint processing with AI assistance
- `budget` - Budget examination tracking
- `committee-members` - Committee member directory
- `staff-directory` - Office staff contact information
- `education` - Education course tracking
- `location-tracking` - GPS-verified location-based activities
- `report` - Comprehensive statistical reporting
- `settings` - Application preferences

### Navigation Implementation

**Side Menu (Hamburger)**:
- Toggle via `#menuToggle` button in header
- Menu element: `#sideMenu` with `.side-menu` class
- Opens with `.active` class added to menu element
- Closes on outside click or menu item selection

**Bottom Navigation**:
- Fixed position navigation bar
- Quick access to 4-5 most important pages
- Items use `data-page` attribute for routing

## Working with External Dependencies

All libraries are loaded via CDN from `index.html` header:

**Critical Dependencies**:
- **Chart.js** (cdn.jsdelivr.net/npm/chart.js) - Used on home dashboard for monthly activity visualization
- **QRious** (cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2) - QR code generation for digital ID
- **FullCalendar** (cdn.jsdelivr.net/npm/fullcalendar@6.1.10) - Calendar views in attendance and scheduling
- **Font Awesome** (cdn.jsdelivr.net/@fortawesome/fontawesome-free@6.4.0) - Icon system throughout UI
- **Tailwind CSS** (cdn.tailwindcss.com) - Utility-first CSS framework
- **Google Fonts** - Noto Sans KR typography

**Important**: Always verify CDN availability before modifying library usage.

## Common Development Tasks

### Adding a New Page

1. Define page content in `app.pages` object:
```javascript
app.pages['new-page'] = `
    <div class="page-content">
        <!-- Page HTML here -->
    </div>
`;
```

2. Add menu item in `index.html` side menu:
```html
<a href="#" class="menu-item" data-page="new-page">
    <i class="fas fa-icon"></i>
    <span>새 페이지</span>
</a>
```

3. Optional: Add page initialization in `app.loadPage()`:
```javascript
if (pageName === 'new-page') {
    // Page-specific initialization
}
```

### Creating Interactive Modals

Use the existing modal system pattern:

```javascript
// Show modal with custom content
app.showModal({
    title: '모달 제목',
    content: '<div>모달 내용</div>',
    onConfirm: () => {
        // Confirmation handler
    },
    onCancel: () => {
        // Cancellation handler
    }
});
```

### Updating Member Data

Always sync with localStorage:

```javascript
// Update data
app.memberData.attendanceRate.plenary = 99.0;

// Persist to localStorage
localStorage.setItem('memberData', JSON.stringify(app.memberData));

// Update UI if needed
updateAttendanceDisplay();
```

### Default Avatar Generation (002-dashboard-bug-fixes)

**Location**: `js/app-utils.js`

Generate SVG avatars with member initials on party-colored backgrounds:

```javascript
// Generate default avatar for missing member photos
const avatarSVG = app.generateDefaultAvatar(memberName, partyColor);

// Usage in templates (inline data URI)
const photoSrc = memberData.photo ||
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(app.generateDefaultAvatar(memberData.name, memberData.partyColor));

// Usage in img tag with onerror fallback
<img src="${memberData.photo || avatarDataURI}"
     alt="${memberData.name} 의원"
     onerror="this.outerHTML = app.generateDefaultAvatar('${memberData.name}', '${memberData.partyColor}')">
```

**Features**:
- Extracts initials from Korean names (first character + last character)
- WCAG 2.1 AA compliant with white text on colored background
- Includes ARIA labels for accessibility
- 100x100px SVG with 50px border-radius
- Uses KRDS color palette for party backgrounds

### Enhanced Chart Configuration (002-dashboard-bug-fixes)

**Location**: `js/chart-config-enhanced.js`

Create monthly activity charts with Korean labels and KRDS styling:

```javascript
// Initialize enhanced chart with Korean labels
app.createMonthlyActivityChart('monthlyChart', {
    labels: ['8월', '9월', '10월', '11월', '12월', '1월'],
    data: [45, 52, 48, 58, 55, 62]
});
```

**Features**:
- Y-axis: "활동 수" label with Noto Sans KR font
- X-axis: "월" label with Korean month names
- Tooltips: "활동: X건" format with Korean localization
- KRDS colors: #0056b3 border, rgba(0,86,179,0.1) fill
- Responsive design with no label overlap at all breakpoints
- Performance: <200ms render time

### Modal Singleton Pattern (002-dashboard-bug-fixes)

**Location**: `js/app-modals-enhanced.js`

The modal system now prevents duplicate spawning:

```javascript
// State tracking in app-core.js
app.currentModal = null;              // Currently open modal ID
app.modalDebounceTimeout = null;      // Debounce timer (200ms)
app.currentModalEscHandler = null;    // Escape key handler reference

// Modal automatically:
// - Debounces rapid clicks (200ms)
// - Closes existing modal before opening new one
// - Removes ALL DOM elements on close (.mobile-modal-container, .modal-overlay)
// - Cleans up Escape key event listeners (prevents memory leaks)
// - Restores body scroll
```

**Console Logging**:
- 📋 emoji markers for modal lifecycle events
- "Modal opening", "Modal debounce", "Modal cleanup" messages

## Code Organization Principles

### JavaScript Module Pattern

- Each feature has its own JS file in `/js/`
- Modules extend or reference `window.app` object
- Use clear, descriptive file names with prefixes:
  - `app-*` - Core application modules
  - `*-enhanced.js` - Enhanced/upgraded versions
  - `*-mobile.js` - Mobile-specific implementations

### CSS Organization

Multiple CSS files for separation of concerns:

- `style-integrated.css` - Base integrated styles
- `styles/krds-design-system.css` - Korean government design system
- `styles/enhanced-design.css` - Enhanced UI components
- `styles/modal-enhanced.css` - Modal system styles
- `styles/pages-enhanced.css` - Page-specific styles
- `styles/menu-enhanced.css` - Navigation menu styles
- `css/info-page.css` - Specific page overrides

### File Naming Conventions

- Korean language for user-facing content
- English for code/technical elements
- Descriptive names indicating purpose
- Version suffixes in CSS links (e.g., `?v=2.3`) for cache busting

## PWA Support

The application includes Progressive Web App manifest:

- **Manifest**: `manifest.json` at root
- **Service Worker**: `sw.js` for offline capability
- **Icons**: Multiple sizes in `/images/fabicon/`
- **Installable**: Can be added to home screen on mobile devices

## Data Management Patterns

### Enhanced Member Data Structure

```javascript
app.memberData = {
    // Personal information
    name: String,
    party: String,
    district: String,
    memberId: String,
    generation: String,
    committees: Array,

    // Statistics
    attendanceRate: {
        plenary: Number,
        standing: Number,
        special: Number
    },
    bills: Number,
    speeches: Number,
    civilComplaints: Number,

    // Extended features
    activities: Object,      // Location-based activities
    performance: Object,     // Performance metrics
    settings: Object         // User preferences
};
```

### localStorage Keys

- `authToken` - Authentication token
- `memberData` - Complete member information object
- `isAuthenticated` - Boolean authentication status
- Additional keys for feature-specific data

## Debugging and Troubleshooting

### Console Logging Pattern

The application uses extensive console logging:

```javascript
console.log('앱 초기화 시작...');
console.log('🍔 햄버거 메뉴 클릭됨!');
console.log('✅ 사이드 메뉴에 active 클래스 추가됨');
```

Look for emoji markers in console for quick visual debugging.

### Common Issues

**Hamburger Menu Not Opening**:
- Check `#menuToggle` and `#sideMenu` elements exist
- Verify `.active` class toggles on menu element
- Check z-index and positioning of menu
- Ensure overlay is properly configured

**Modal Not Appearing**:
- Verify modal HTML structure matches expected format
- Check z-index values (modals need high z-index)
- Ensure overlay backdrop is showing

**Charts Not Rendering**:
- Verify Chart.js CDN is loaded
- Check canvas element exists with correct ID
- Ensure chart initialization runs after page load

## Version History and Enhancement Tracking

Current version: **2.0.0** (Enhanced with comprehensive features)

Recent major enhancements documented in PRD.md:
- Civil complaint processing with AI features
- Location-based activity system with GPS verification
- Performance reporting dashboard
- Calendar system improvements with FullCalendar integration
- Enhanced mobile optimization for all touch interactions

## Important Constraints

- **No Backend**: This is a frontend-only application with mock data
- **No npm/package.json**: Pure static site with CDN dependencies
- **Korean Language**: All user-facing content must be in Korean
- **Government Standards**: Must adhere to KRDS (Korea Design System) guidelines
- **Mobile Priority**: Desktop is secondary - optimize for mobile first
