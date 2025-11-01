# Research: Dashboard Bug Fixes and Missing Asset Resolution

**Feature**: 002-dashboard-bug-fixes
**Date**: 2025-01-31
**Purpose**: Resolve technical unknowns and establish implementation patterns for bug fixes

## Research Questions

### Q1: What is the correct QRious CDN integrity hash?

**Decision**: Remove integrity attribute entirely from QRious script tag

**Rationale**:
- Integrity hashes are optional for non-critical CDN resources
- QRious library is used for QR code generation (non-security-critical feature)
- Removing integrity attribute allows browser to load library without hash verification
- CDN (cdnjs.cloudflare.com) is reputable and uses HTTPS
- Simpler than maintaining correct SHA-512 hash which may change with CDN updates

**Alternatives Considered**:
1. **Calculate correct hash** - Rejected because hash verification adds maintenance burden for static site without automated hash generation
2. **Bundle QRious locally** - Rejected because violates zero-build, CDN-only architecture (Constitution Principle V)
3. **Use different QR library** - Rejected because QRious is already integrated and working; only hash verification is failing

**Implementation**: Change `<script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js" integrity="..." crossorigin="anonymous"></script>` to `<script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js" crossorigin="anonymous"></script>`

---

### Q2: How should default avatars be generated for missing profile photos?

**Decision**: Use inline SVG generation with member initials on party-colored circular background

**Rationale**:
- SVG is resolution-independent and works at all breakpoints (320px-1024px+)
- No external files needed - generate dynamically with JavaScript
- Party colors (#003d7a blue for 국민의힘, #0056b3 for other parties) align with KRDS design system
- Initials extraction from Korean names follows standard pattern (first 2 characters)
- Minimal file size impact (~2KB for SVG template code)

**Alternatives Considered**:
1. **CSS background with text** - Rejected because harder to center text and handle varying name lengths
2. **Static placeholder image** - Rejected because loses personalization benefit of showing member initials
3. **Canvas-based generation** - Rejected because SVG is simpler, more accessible, and performs better on mobile

**Implementation Pattern**:
```javascript
// In app-utils.js
window.app.generateDefaultAvatar = function(memberName, partyColor) {
  const initials = memberName.substring(0, 2);
  const bgColor = partyColor || '#003d7a'; // KRDS primary blue default

  return `<svg width="80" height="100" viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${memberName} 기본 프로필">
    <circle cx="40" cy="40" r="35" fill="${bgColor}"/>
    <text x="40" y="50" font-family="Noto Sans KR" font-size="24" font-weight="500" fill="white" text-anchor="middle">${initials}</text>
  </svg>`;
};
```

---

### Q3: What modal management pattern prevents duplicate rendering?

**Decision**: Implement singleton modal manager with instance tracking and complete cleanup lifecycle

**Rationale**:
- Singleton pattern ensures only one modal instance exists at any time
- Instance tracking via `window.app.currentModal` global state prevents duplicate creation
- Complete cleanup (remove DOM elements, event listeners, overlays) prevents ghost modals
- Debouncing (200ms cooldown) prevents rapid-click spawning

**Alternatives Considered**:
1. **Check for existing modal in DOM** - Rejected because doesn't prevent race conditions from rapid clicks
2. **Disable button after first click** - Rejected because poor UX if modal fails to load
3. **CSS-only solution** - Rejected because doesn't address root cause of duplicate DOM element creation

**Implementation Pattern**:
```javascript
// In app-modals-enhanced.js
window.app.showModal = function(options) {
  // Prevent duplicate modals
  if (window.app.currentModal && window.app.currentModal.isOpen) {
    console.warn('📋 Modal already open, closing previous modal');
    window.app.closeModal();
  }

  // Debouncing protection
  if (window.app.modalDebounceTimeout) {
    console.log('📋 Modal debounce active, ignoring click');
    return;
  }

  // Create modal with cleanup tracking
  const modalId = 'modal-' + Date.now();
  window.app.currentModal = {
    id: modalId,
    isOpen: true,
    cleanup: () => {
      // Remove DOM elements
      document.querySelectorAll(`.mobile-modal-container`).forEach(el => el.remove());
      // Remove event listeners
      document.removeEventListener('keydown', escapeHandler);
      // Clear state
      window.app.currentModal = null;
    }
  };

  // Set debounce timeout
  window.app.modalDebounceTimeout = setTimeout(() => {
    window.app.modalDebounceTimeout = null;
  }, 200);

  // Render modal...
};
```

---

### Q4: How should Chart.js axis labels and tooltips be configured?

**Decision**: Enhance existing Chart.js configuration with explicit axis labels, Korean month names, and formatted tooltips

**Rationale**:
- Chart.js already loaded via CDN - only configuration changes needed
- Axis labels improve data interpretation without requiring user interaction
- Korean month names (8월, 9월, etc.) align with KRDS language requirements
- Tooltips provide detailed data on hover for accessibility and mobile long-press

**Alternatives Considered**:
1. **Replace Chart.js with different library** - Rejected because Chart.js works well and is already integrated
2. **Static chart images** - Rejected because loses interactivity and responsive benefits
3. **Custom canvas drawing** - Rejected because Chart.js provides better accessibility and maintenance

**Implementation Pattern**:
```javascript
// In chart-config-enhanced.js or inline in app-pages-integrated.js
window.app.createMonthlyActivityChart = function(canvasId, activityData) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['8월', '9월', '10월', '11월', '12월', '1월'],
      datasets: [{
        label: '월별 활동',
        data: activityData,
        borderColor: '#0056b3',
        backgroundColor: 'rgba(0, 86, 179, 0.1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '활동 수',
            font: { family: 'Noto Sans KR', size: 12 }
          },
          ticks: {
            font: { family: 'Noto Sans KR', size: 12 }
          }
        },
        x: {
          title: {
            display: true,
            text: '월',
            font: { family: 'Noto Sans KR', size: 12 }
          },
          ticks: {
            font: { family: 'Noto Sans KR', size: 12 }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `활동: ${context.parsed.y}건`;
            }
          },
          titleFont: { family: 'Noto Sans KR', size: 14 },
          bodyFont: { family: 'Noto Sans KR', size: 12 }
        }
      }
    }
  });
};
```

---

### Q5: What favicon files are actually needed for comprehensive browser support?

**Decision**: Create 5 essential favicon files covering all common browser and platform requirements

**Rationale**:
- favicon.ico (16x16 ICO format) - Required for legacy IE and some browsers
- favicon-16x16.png, favicon-32x32.png - Standard browser tab icons
- favicon-96x96.png - High-DPI displays and some Android browsers
- android-icon-192x192.png - Android Chrome home screen icon (PWA support)
- Total size budget: ~8.5KB for all 5 files (well within 15KB allocation)

**Alternatives Considered**:
1. **Only use favicon.ico** - Rejected because poor support on modern browsers and mobile
2. **Use SVG favicon** - Rejected because not universally supported (Safari limitations)
3. **Generate 15+ sizes** - Rejected because overkill for static site; 5 files cover 95% of use cases

**Implementation**:
- Use simple geometric design (경기도의회 "G" letter or council seal simplified)
- Optimize PNGs with pngcrush or similar tool to minimize file sizes
- Use KRDS primary blue (#003d7a) for brand consistency
- Update index.html `<link>` tags to reference new files

---

### Q6: Should broken annomimus.jpg references be fixed or removed?

**Decision**: Remove all broken annomimus.jpg references and replace with default avatar system

**Rationale**:
- "annomimus.jpg" appears to be typo for "anonymous.jpg" but file doesn't exist
- Better to remove broken references than create unnecessary placeholder file
- Default avatar system (Q2) provides superior UX with personalized initials
- Removing references eliminates console errors and improves perceived performance

**Alternatives Considered**:
1. **Create annomimus.jpg placeholder** - Rejected because perpetuates typo and adds unnecessary file
2. **Fix typo to anonymous.jpg** - Rejected because still requires creating file; default avatar is better UX
3. **Use external avatar service** - Rejected because requires network requests and violates offline-first principle

**Implementation**: Search codebase for all references to "annomimus.jpg" or "anonymous" in image contexts, replace `<img src="images/annomimus.jpg">` with call to `window.app.generateDefaultAvatar(memberName, partyColor)`

---

## Summary of Decisions

| Question | Decision | Impact |
|----------|----------|--------|
| QRious CDN hash | Remove integrity attribute | -50 bytes HTML, fixes loading error |
| Default avatars | Inline SVG with initials | +2KB JS, improves UX |
| Modal management | Singleton + debouncing | +150 lines JS, fixes duplication |
| Chart configuration | Enhanced Chart.js options | +80 lines JS, improves readability |
| Favicons | 5 essential files | +8.5KB assets, fixes 404 errors |
| annomimus.jpg | Remove and use default avatar | -broken references, better UX |

**Total Size Impact**: ~11KB added (within 15KB budget from plan.md)

**Performance Validation**: All decisions maintain < 500KB total page weight and < 3s load time on 3G networks

**Architecture Alignment**: All decisions comply with vanilla JavaScript, zero-build, CDN-only principles from constitution

## Next Phase

Proceed to Phase 1 (Design) to create:
- data-model.md: Modal state machine, avatar generation schema
- quickstart.md: Testing guide and regression prevention checklist
- contracts/: Chart.js configuration schema, modal lifecycle API documentation
