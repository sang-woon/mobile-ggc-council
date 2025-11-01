# Quickstart: Dashboard Bug Fixes Implementation Guide

**Feature**: 002-dashboard-bug-fixes
**Date**: 2025-01-31
**Prerequisites**: Read [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md)

## Overview

This guide provides step-by-step instructions for implementing the 4 bug fixes identified through Playwright testing. Each fix is independent and can be implemented in priority order (P1→P4) for incremental deployment.

---

## P1: Fix Missing Image Assets

### Step 1: Create Favicon Directory and Assets

```bash
# Create directory
mkdir -p images/fabicon

# Favicon generation (use online tool or image editor):
# 1. Create 512x512 PNG with "G" letter on #003d7a background
# 2. Export to multiple sizes:
#    - favicon.ico (16x16)
#    - favicon-16x16.png
#    - favicon-32x32.png
#    - favicon-96x96.png
#    - android-icon-192x192.png
# 3. Optimize with pngcrush: pngcrush -brute input.png output.png
```

### Step 2: Update index.html Favicon Links

```html
<!-- BEFORE (broken links) -->
<link rel="icon" type="image/x-icon" href="images/fabicon/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="images/fabicon/favicon-16x16.png">
<!-- These files don't exist → ERR_FILE_NOT_FOUND -->

<!-- AFTER (fixed links) -->
<link rel="icon" type="image/x-icon" href="images/fabicon/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="images/fabicon/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="images/fabicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="images/fabicon/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="192x192" href="images/fabicon/android-icon-192x192.png">
<!-- Files now exist in images/fabicon/ directory -->
```

### Step 3: Create Default Avatar System

**Create js/app-utils.js**:

```javascript
/**
 * Default Avatar Generation Utility
 * Generates SVG avatar with member initials on party-colored background
 */
(function() {
  'use strict';

  // Party color mapping (KRDS compliant)
  const PARTY_COLORS = {
    '국민의힘': '#003d7a',     // KRDS primary blue
    '더불어민주당': '#0056b3',  // KRDS secondary blue
    '정의당': '#FFCD00',
    '무소속': '#6B7280',
    'default': '#003d7a'
  };

  /**
   * Generate default avatar SVG
   * @param {string} memberName - Full Korean name
   * @param {string} partyColor - Hex color code
   * @returns {string} SVG markup
   */
  window.app.generateDefaultAvatar = function(memberName, partyColor) {
    console.log('🖼️ Generating default avatar for:', memberName);

    // Validation
    if (!memberName || typeof memberName !== 'string' || memberName.length < 2) {
      console.error('❌ Invalid member name for avatar generation');
      memberName = '의원'; // Fallback
    }

    // Extract initials (first 2 characters)
    const initials = memberName.substring(0, 2);

    // Get party color or use default
    const bgColor = partyColor || PARTY_COLORS['default'];

    // Generate SVG
    return `<svg width="80" height="100" viewBox="0 0 80 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="${memberName} 기본 프로필"
      class="default-avatar">
      <circle cx="40" cy="40" r="35" fill="${bgColor}"/>
      <text
        x="40"
        y="50"
        font-family="Noto Sans KR, sans-serif"
        font-size="24"
        font-weight="500"
        fill="white"
        text-anchor="middle"
        dominant-baseline="middle">${initials}</text>
    </svg>`;
  };

  console.log('✅ app-utils.js loaded - Default avatar system ready');
})();
```

**Add to index.html** (before closing `</body>`):

```html
<script src="js/app-utils.js?v=1.0"></script>
```

### Step 4: Replace Broken Image References

**Find and replace in app-pages-integrated.js** (or relevant page templates):

```javascript
// BEFORE (broken reference)
<img src="images/annomimus.jpg" alt="${memberName}" class="member-photo">

// AFTER (with fallback)
<img src="${app.memberData.photo || 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(app.generateDefaultAvatar(app.memberData.name, app.memberData.partyColor))}"
  alt="${app.memberData.name} 프로필"
  class="member-photo"
  onerror="this.outerHTML = app.generateDefaultAvatar('${app.memberData.name}', '${app.memberData.partyColor}')">
```

### Testing P1

```bash
# Open browser DevTools Console
# Load index.html
# Expected: ZERO "ERR_FILE_NOT_FOUND" errors for images
# Expected: All favicons load successfully (check Network tab)
# Expected: Member profile shows initials on colored background if no photo
```

---

## P2: Fix Duplicate Modal Rendering

### Step 1: Add Modal State Management to app-core.js

```javascript
// In app-core.js initialization section
window.app.currentModal = null;
window.app.modalDebounceTimeout = null;
```

### Step 2: Refactor app-modals-enhanced.js

```javascript
/**
 * Enhanced Modal System - Prevents Duplicates
 */
window.app.showModal = function(options) {
  console.log('📋 showModal called:', options.title);

  // GATE 1: Check for existing open modal
  if (window.app.currentModal && window.app.currentModal.isOpen) {
    console.warn('📋 Modal already open, closing previous modal first');
    window.app.closeModal();
    // Small delay to ensure cleanup completes
    setTimeout(() => window.app.showModal(options), 50);
    return;
  }

  // GATE 2: Debounce protection
  if (window.app.modalDebounceTimeout) {
    console.log('📋 Modal debounce active, ignoring duplicate call');
    return;
  }

  // Set debounce timeout
  window.app.modalDebounceTimeout = setTimeout(() => {
    window.app.modalDebounceTimeout = null;
    console.log('📋 Modal debounce cleared');
  }, 200);

  // Validate options
  if (!options || !options.title || !options.content) {
    console.error('❌ Invalid modal options');
    return;
  }

  // Create unique modal ID
  const modalId = 'modal-' + Date.now();

  // Create modal HTML
  const modalHTML = `
    <div id="${modalId}" class="mobile-modal-container mobile-modal-active">
      <div class="mobile-modal-backdrop" onclick="window.app.closeModal()"></div>
      <div class="mobile-modal-content">
        <div class="mobile-modal-header">
          <h3>${options.title}</h3>
          <button class="modal-close-btn" onclick="window.app.closeModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="mobile-modal-body">
          ${options.content}
        </div>
        ${options.actions ? `<div class="mobile-modal-actions">${options.actions}</div>` : ''}
      </div>
    </div>
  `;

  // Insert modal into DOM
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Escape key handler
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      window.app.closeModal();
    }
  };
  document.addEventListener('keydown', escapeHandler);

  // Track current modal
  window.app.currentModal = {
    id: modalId,
    isOpen: true,
    escapeHandler: escapeHandler,
    createdAt: Date.now()
  };

  console.log('✅ Modal opened:', modalId);
};

/**
 * Close modal with complete cleanup
 */
window.app.closeModal = function() {
  console.log('📋 Closing modal...');

  if (!window.app.currentModal) {
    console.warn('⚠️ No modal to close');
    return;
  }

  // Remove modal from DOM
  const modalElement = document.getElementById(window.app.currentModal.id);
  if (modalElement) {
    modalElement.classList.remove('mobile-modal-active');
    // Wait for CSS transition, then remove
    setTimeout(() => {
      modalElement.remove();
      console.log('✅ Modal removed from DOM');
    }, 300);
  }

  // Remove escape key listener
  if (window.app.currentModal.escapeHandler) {
    document.removeEventListener('keydown', window.app.currentModal.escapeHandler);
  }

  // Clear state
  window.app.currentModal = null;

  console.log('✅ Modal closed completely');
};
```

### Step 3: Add Debouncing to Quick Action Buttons

**In app-pages-integrated.js** (where quick action buttons are defined):

```javascript
// BEFORE (direct call)
onclick="window.app.showPressReleases()"

// AFTER (debounced)
onclick="if(!window.app.modalDebounceTimeout) { window.app.showPressReleases(); }"

// Apply to all quick action buttons:
// - showPressReleases()
// - showSchedule()
// - showMeetings()
// - showStatistics()
// - showQuickContacts()
// - showAllActivities()
```

### Testing P2

```bash
# Test cases:
# 1. Click "보도자료" button → ONE modal appears
# 2. Click close button → Modal disappears completely
# 3. Click "일정표" button → NEW modal appears, no ghost from previous
# 4. Rapidly click button 5 times → Only ONE modal spawns
# 5. Press Escape key → Modal closes
# 6. Click backdrop → Modal closes
# Expected: Zero duplicate modals, clean close every time
```

---

## P3: Fix QRious CDN Integrity Hash

### Step 1: Update QRious Script Tag in index.html

```html
<!-- BEFORE (integrity hash mismatch) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"
  integrity="sha512-INVALID_HASH_HERE"
  crossorigin="anonymous"></script>

<!-- AFTER (remove integrity attribute) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"
  crossorigin="anonymous"></script>
```

### Step 2: Verify QRious Loads Successfully

**In browser console after page load**:

```javascript
// Check if QRious is available
console.log(typeof QRious); // Should output: "function"

// Test QR code generation
const canvas = document.createElement('canvas');
const qr = new QRious({
  element: canvas,
  value: 'https://council.gg.go.kr/verify/did:test',
  size: 200
});
console.log('QR generated:', canvas.toDataURL()); // Should output: "data:image/png;base64,..."
```

### Testing P3

```bash
# 1. Open browser DevTools Console
# 2. Load index.html
# 3. Check for integrity errors → Should be ZERO
# 4. Navigate to digital ID page
# 5. Flip card to back
# 6. Verify QR code generates successfully
# 7. Scan QR code with phone → Should resolve to verification URL
```

---

## P4: Add Missing Chart Labels

### Step 1: Enhance Chart Configuration

**In app-pages-integrated.js** (find monthly activity chart initialization):

```javascript
// BEFORE (minimal configuration)
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['8월', '9월', '10월', '11월', '12월', '1월'],
    datasets: [{
      data: [45, 52, 48, 58, 55, 62]
    }]
  }
});

// AFTER (enhanced with axis labels and tooltips)
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['8월', '9월', '10월', '11월', '12월', '1월'],
    datasets: [{
      label: '월별 의정활동',
      data: [45, 52, 48, 58, 55, 62],
      borderColor: '#0056b3',        // KRDS secondary blue
      backgroundColor: 'rgba(0, 86, 179, 0.1)',
      tension: 0.3,                   // Smooth line
      pointRadius: 4,
      pointHoverRadius: 6
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
          font: {
            family: 'Noto Sans KR',
            size: 12,
            weight: '500'
          },
          color: '#374151'
        },
        ticks: {
          font: {
            family: 'Noto Sans KR',
            size: 12
          },
          color: '#6B7280'
        },
        grid: {
          color: '#E5E7EB'
        }
      },
      x: {
        title: {
          display: true,
          text: '월',
          font: {
            family: 'Noto Sans KR',
            size: 12,
            weight: '500'
          },
          color: '#374151'
        },
        ticks: {
          font: {
            family: 'Noto Sans KR',
            size: 12
          },
          color: '#6B7280'
        },
        grid: {
          display: false  // Cleaner look
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            family: 'Noto Sans KR',
            size: 12
          },
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 61, 122, 0.9)',
        titleFont: {
          family: 'Noto Sans KR',
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: 'Noto Sans KR',
          size: 12
        },
        padding: 12,
        callbacks: {
          label: function(context) {
            return `활동: ${context.parsed.y}건`;
          }
        }
      }
    }
  }
});
```

### Testing P4

```bash
# Visual checks:
# 1. Y-axis shows "활동 수" label
# 2. X-axis shows "월" label
# 3. Hover over data points → Tooltip shows "활동: XX건"
# 4. Resize browser to 430px → Labels remain readable (≥12px)
# 5. Check contrast ratio → ≥4.5:1 for WCAG AA compliance
```

---

## Cross-Browser Testing Checklist

### Desktop Browsers

- [ ] Chrome 80+ (Windows/Mac)
  - Load dashboard → Zero console errors
  - Test all 4 bug fixes
- [ ] Firefox 75+
  - Favicon displays correctly
  - Modal spawning/closing works
- [ ] Safari 13+ (Mac)
  - Chart tooltips appear on hover
  - QR code generates on digital ID page

### Mobile Browsers

- [ ] iOS Safari 12+ (iPhone)
  - Test at 430px viewport
  - Touch interactions for modals
  - Chart readability
- [ ] Android Chrome 8+ (Samsung/Pixel)
  - Favicon on home screen (PWA)
  - Default avatar rendering
  - Modal debouncing on rapid taps

---

## Regression Testing with Playwright

**Create test/dashboard-bugs.spec.js** (optional for automation):

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Dashboard Bug Fixes', () => {
  test('P1: No image loading errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('ERR_FILE_NOT_FOUND')) {
        errors.push(msg.text());
      }
    });

    await page.goto('file:///E:/01-project/251031-mobile-ggc-member/index.html');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });

  test('P2: No duplicate modals', async ({ page }) => {
    await page.goto('file:///E:/01-project/251031-mobile-ggc-member/index.html');

    // Click quick action button
    await page.click('button:has-text("보도자료")');

    // Count modals
    const modalCount = await page.locator('.mobile-modal-container').count();
    expect(modalCount).toBe(1);

    // Close modal
    await page.press('body', 'Escape');
    await page.waitForTimeout(500);

    // Verify modal closed
    const closedCount = await page.locator('.mobile-modal-container').count();
    expect(closedCount).toBe(0);
  });

  test('P3: QRious library loads', async ({ page }) => {
    await page.goto('file:///E:/01-project/251031-mobile-ggc-member/index.html');

    const qriousAvailable = await page.evaluate(() => typeof QRious === 'function');
    expect(qriousAvailable).toBe(true);
  });

  test('P4: Chart has axis labels', async ({ page }) => {
    await page.goto('file:///E:/01-project/251031-mobile-ggc-member/index.html');

    // Check for Y-axis label
    const yAxisLabel = await page.textContent('canvas ~ text:has-text("활동 수")');
    expect(yAxisLabel).toBeTruthy();
  });
});
```

---

## Performance Validation

```bash
# Chrome DevTools Lighthouse audit:
# 1. Open DevTools → Lighthouse tab
# 2. Select "Mobile" + "Performance" + "Accessibility"
# 3. Run audit
# Expected scores:
#   - Performance: ≥90
#   - Accessibility: ≥90 (WCAG AA)
#   - Best Practices: ≥90

# Network panel check:
# 1. Disable cache
# 2. Throttle to "Fast 3G"
# 3. Reload page
# Expected:
#   - Total bundle size: <500KB
#   - Page load: <3 seconds
#   - TTI: <5 seconds
```

---

## Troubleshooting

### Issue: Default avatar not showing

**Symptoms**: Still seeing broken image icon
**Fix**: Check console for errors in `app.generateDefaultAvatar()`, verify `app-utils.js` is loaded before page templates

### Issue: Modal still duplicating

**Symptoms**: Multiple modals stack on rapid clicks
**Fix**: Verify `window.app.modalDebounceTimeout` is being set and checked, add more console logging to trace execution flow

### Issue: Chart labels not visible

**Symptoms**: Axis labels missing or cut off
**Fix**: Check `maintainAspectRatio` is `true`, verify Noto Sans KR font loads, inspect canvas element dimensions

### Issue: QRious still not loading

**Symptoms**: Console shows integrity error
**Fix**: Completely remove `integrity` attribute from script tag, hard refresh browser (Ctrl+Shift+R)

---

## Next Steps

After implementing all 4 bug fixes:
1. Run full testing checklist (desktop + mobile browsers)
2. Validate performance with Lighthouse
3. Run Playwright regression tests (if created)
4. Deploy to production branch
5. Monitor error logs for 48 hours to catch edge cases

## Reference

- **Spec**: [spec.md](./spec.md) - User stories and requirements
- **Plan**: [plan.md](./plan.md) - Architecture and constitution compliance
- **Research**: [research.md](./research.md) - Technical decisions and patterns
- **Data Model**: [data-model.md](./data-model.md) - State machines and schemas
- **Contracts**: [contracts/](./contracts/) - API specifications
