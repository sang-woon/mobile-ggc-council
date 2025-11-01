# Quickstart: DID-Based Digital Member ID Card

**Feature**: 001-digital-member-id  
**Date**: 2025-01-31  
**For**: Developers implementing the digital member ID card feature

## Overview

This guide provides step-by-step instructions for implementing the digital member ID card feature with three progressive tiers:
- **P1 (MVP)**: Display digital ID card with flip animation
- **P2**: Add QR code generation for external verification
- **P3**: Add blockchain verification status indicator

**Time Estimate**: 6-8 hours for P1, +2 hours for P2, +2 hours for P3

---

## Prerequisites

### Required Knowledge
- Vanilla JavaScript ES6+ (classes, arrow functions, async/await)
- CSS3 transforms and animations
- localStorage API
- Working with CDN libraries

### Required Tools
- Modern browser with DevTools (Chrome 80+, Safari 13+, Firefox 75+)
- Mobile device or browser DevTools device emulation for testing
- Code editor (VS Code recommended)
- Git for version control

### Project Structure Familiarity
Read these files before starting:
- `CLAUDE.md` - Project architecture and patterns
- `.specify/memory/constitution.md` - Development principles
- `specs/001-digital-member-id/spec.md` - Feature requirements
- `specs/001-digital-member-id/data-model.md` - Data structures

---

## Phase 1: MVP - Display Digital ID Card (P1)

### Step 1: Update index.html

Add QRious CDN script and new CSS files before closing `</body>` tag:

```html
<!-- QRious library for QR code generation (P2) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js" 
        integrity="sha512-xar4Q7e0NfX2VRXlQ3xZE5B5DhPQcXvl6Kz8RJvJ6dY9vYKkqLLN9wVOy7bXCiT3qVzXJRANxLcKf2VkKKLQQw==" 
        crossorigin="anonymous" 
        referrerpolicy="no-referrer"></script>

<!-- Digital ID Card Styles -->
<link rel="stylesheet" href="styles/digital-id-enhanced.css?v=1.0">
<link rel="stylesheet" href="styles/digital-id-mobile-optimized.css?v=1.0">

<!-- Digital ID Card Logic -->
<script src="js/digital-id-enhanced.js?v=1.0"></script>
<script src="js/qr-code-generator.js?v=1.0"></script>
```

### Step 2: Create CSS Module - styles/digital-id-enhanced.css

Create new file with KRDS-compliant card styling:

```css
/* Digital ID Card Styles - KRDS Compliant */
/* Feature: 001-digital-member-id (P1) */

:root {
    /* KRDS Colors (from constitution) */
    --krds-primary: #003d7a;
    --krds-secondary: #0056b3;
    --krds-background: #f3f4f6;
    --krds-text-primary: #1f2937;
    --krds-text-secondary: #4b5563;
    
    /* Card Dimensions */
    --card-width: 390px;
    --card-height: 240px;
    --card-border-radius: 16px;
}

/* 3D Card Container */
.id-card-container {
    perspective: 1000px;
    width: 100%;
    max-width: var(--card-width);
    margin: 0 auto;
    padding: 16px;
}

/* Card Flipper */
.id-card-flipper {
    position: relative;
    width: 100%;
    height: var(--card-height);
    transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
    transform-style: preserve-3d;
}

.id-card-flipper.flipped {
    transform: rotateY(180deg);
}

/* Card Faces (Front & Back) */
.id-card-front,
.id-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: var(--card-border-radius);
    background: linear-gradient(135deg, var(--krds-primary) 0%, var(--krds-secondary) 100%);
    box-shadow: 0 8px 24px rgba(0, 61, 122, 0.2);
    overflow: hidden;
}

.id-card-back {
    transform: rotateY(180deg);
    background: linear-gradient(135deg, var(--krds-secondary) 0%, var(--krds-primary) 100%);
}

/* Card Content Layout */
.id-card-content {
    position: relative;
    height: 100%;
    padding: 20px;
    color: white;
    z-index: 2;
}

/* Member Photo */
.member-photo {
    width: 80px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Default Avatar (when photo missing) */
.member-avatar {
    width: 80px;
    height: 100px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 700;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Member Info */
.member-name {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.member-position {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
}

.member-details {
    font-size: 12px;
    opacity: 0.85;
    line-height: 1.6;
}

/* Flip Button */
.flip-button {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
}

.flip-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
}

.flip-button:active {
    transform: scale(0.95);
}

/* QR Code Section (Card Back) */
.qr-code-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.qr-code-canvas {
    width: 200px;
    height: 200px;
    background: white;
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.qr-code-label {
    margin-top: 12px;
    font-size: 14px;
    opacity: 0.9;
    text-align: center;
}

/* Blockchain Badge */
.blockchain-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.blockchain-badge:hover {
    background: rgba(255, 255, 255, 0.25);
}

.blockchain-badge.verified {
    background: rgba(5, 150, 105, 0.2);
    border-color: rgba(5, 150, 105, 0.4);
}

/* Accessibility: Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .id-card-flipper {
        transition: none;
    }
}

/* Mobile Optimizations */
@media (max-width: 430px) {
    .id-card-container {
        padding: 12px;
    }
    
    :root {
        --card-width: 100%;
        --card-height: 220px;
    }
    
    .member-name {
        font-size: 20px;
    }
    
    .member-position {
        font-size: 12px;
    }
}
```

### Step 3: Create JavaScript Module - js/digital-id-enhanced.js

Create new file with card logic:

```javascript
// Digital ID Card Enhanced Logic
// Feature: 001-digital-member-id
// Date: 2025-01-31

(function() {
    'use strict';
    
    // Extend window.app
    window.app = window.app || {};
    
    /**
     * Initialize digital ID card page
     * Called when navigating to 'digital-id' page
     */
    app.initDigitalIDCard = function() {
        console.log('🎴 Initializing digital ID card...');
        
        // Validate member data
        if (!app.validateMemberData()) {
            console.error('❌ Invalid member data');
            app.showNotification('데이터 오류가 발생했습니다', 'error');
            return;
        }
        
        // Render card
        app.renderDigitalIDCard();
        
        // Setup event listeners
        app.setupCardEventListeners();
        
        // Load blockchain verification (P3)
        if (app.memberData.didIdentifier) {
            app.displayBlockchainBadge();
        }
        
        console.log('✅ Digital ID card initialized');
    };
    
    /**
     * Render digital ID card HTML
     */
    app.renderDigitalIDCard = function() {
        const member = app.memberData;
        
        // Generate member initials for default avatar
        const initials = member.name
            .split('')
            .slice(0, 2)
            .join('');
        
        // Photo or default avatar
        const photoHTML = member.photo
            ? `<img src="${member.photo}" alt="${member.name}" class="member-photo">`
            : `<div class="member-avatar">${initials}</div>`;
        
        const cardHTML = `
            <div class="id-card-container">
                <div id="idCardFlipper" class="id-card-flipper">
                    <!-- Front of Card -->
                    <div class="id-card-front">
                        <div class="id-card-content">
                            <div style="display: flex; gap: 16px;">
                                ${photoHTML}
                                <div style="flex: 1;">
                                    <div class="member-name">${member.name}</div>
                                    <div class="member-position">경기도의원 (${member.generation}대)</div>
                                    <div class="member-details">
                                        <div><i class="fas fa-landmark"></i> ${member.party}</div>
                                        <div><i class="fas fa-map-marker-alt"></i> ${member.district}</div>
                                        <div><i class="fas fa-id-card"></i> ${member.memberId}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Blockchain Badge (P3) -->
                            <div id="blockchainBadge" class="blockchain-badge" style="position: absolute; top: 20px; right: 20px;">
                                <i class="fas fa-spinner fa-spin"></i>
                                <span>확인 중...</span>
                            </div>
                        </div>
                        
                        <!-- Flip Button -->
                        <button class="flip-button" onclick="app.flipCard()" 
                                aria-label="카드 뒤집기">
                            <i class="fas fa-sync-alt" style="color: white; font-size: 18px;"></i>
                        </button>
                    </div>
                    
                    <!-- Back of Card -->
                    <div class="id-card-back">
                        <div class="id-card-content">
                            <div class="qr-code-section">
                                <canvas id="qrCodeCanvas" class="qr-code-canvas"></canvas>
                                <div class="qr-code-label">
                                    QR 코드로 신원 확인
                                </div>
                            </div>
                        </div>
                        
                        <!-- Flip Back Button -->
                        <button class="flip-button" onclick="app.flipCard()" 
                                aria-label="카드 앞면 보기">
                            <i class="fas fa-sync-alt" style="color: white; font-size: 18px;"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Insert into page
        const container = document.getElementById('digitalIDContainer');
        if (container) {
            container.innerHTML = cardHTML;
        }
    };
    
    /**
     * Flip card between front and back
     */
    app.flipCard = function() {
        const flipper = document.getElementById('idCardFlipper');
        if (!flipper) return;
        
        flipper.classList.toggle('flipped');
        
        // Tactile feedback (mobile only)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Lazy load QR code when flipping to back (P2)
        if (flipper.classList.contains('flipped') && !app.qrCodeGenerated) {
            setTimeout(() => {
                app.generateMemberQRCode();
            }, 300); // Delay for animation
        }
        
        console.log('🎴 Card flipped:', flipper.classList.contains('flipped') ? 'back' : 'front');
    };
    
    /**
     * Setup event listeners
     */
    app.setupCardEventListeners = function() {
        // Keyboard accessibility: Space/Enter to flip
        document.addEventListener('keydown', function(e) {
            if (e.key === ' ' || e.key === 'Enter') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.classList.contains('flip-button')) {
                    e.preventDefault();
                    app.flipCard();
                }
            }
        });
        
        console.log('✅ Card event listeners setup');
    };
    
    /**
     * Validate member data required for ID card
     */
    app.validateMemberData = function() {
        const required = ['name', 'party', 'district', 'memberId', 'generation'];
        const member = app.memberData || {};
        
        const missing = required.filter(key => !member[key]);
        if (missing.length > 0) {
            console.error('❌ Missing required member data:', missing);
            return false;
        }
        
        return true;
    };
    
    // Flag to track QR code generation
    app.qrCodeGenerated = false;
    
})();
```

### Step 4: Update app.pages in app-pages-enhanced.js

Add digital-id page template. Find the `app.pages` object and add:

```javascript
// In js/app-pages-enhanced.js
app.pages['digital-id'] = `
    <div class="page-content">
        <div class="page-header">
            <h1 class="text-2xl font-bold text-gray-900">
                <i class="fas fa-id-card text-blue-600"></i>
                디지털 의원증
            </h1>
            <p class="text-sm text-gray-600 mt-2">
                블록체인 기반 신원 확인 카드
            </p>
        </div>
        
        <div id="digitalIDContainer" class="mt-6">
            <!-- Card rendered by app.renderDigitalIDCard() -->
        </div>
    </div>
`;
```

### Step 5: Update app.loadPage() in app-core.js

Add initialization for digital-id page:

```javascript
// In js/app-core.js, inside app.loadPage()
if (pageName === 'digital-id') {
    // Initialize digital ID card
    if (typeof app.initDigitalIDCard === 'function') {
        app.initDigitalIDCard();
    }
}
```

### Step 6: Test P1 MVP

1. **Start development server** (or open index.html directly)
2. **Navigate to digital-id page** via side menu
3. **Verify checklist**:
   - ✅ Card displays with member name, photo, party, district, ID
   - ✅ Card fits in 430px viewport without horizontal scroll
   - ✅ Flip button is 44px × 44px (touch-friendly)
   - ✅ Card flip animation is smooth (60fps)
   - ✅ Default avatar shows initials if photo missing
   - ✅ KRDS colors used (#003d7a, #0056b3)
   - ✅ Korean text displays correctly
   - ✅ Console shows 🎴 emoji logs

---

## Phase 2: QR Code Generation (P2)

### Step 7: Create js/qr-code-generator.js

```javascript
// QR Code Generator using QRious
// Feature: 001-digital-member-id (P2)
// Date: 2025-01-31

(function() {
    'use strict';
    
    window.app = window.app || {};
    
    /**
     * Generate QR code for member DID verification
     * @returns {string|null} Base64 data URL of QR code or null on error
     */
    app.generateMemberQRCode = function() {
        console.log('📱 Generating QR code...');
        
        const didIdentifier = app.memberData.didIdentifier;
        if (!didIdentifier) {
            console.error('❌ No DID identifier found');
            app.showQRError();
            return null;
        }
        
        try {
            const verificationUrl = `https://council.gg.go.kr/verify/${didIdentifier}`;
            const canvas = document.getElementById('qrCodeCanvas');
            
            if (!canvas) {
                console.error('❌ QR canvas element not found');
                return null;
            }
            
            // Generate QR code using QRious
            const qr = new QRious({
                element: canvas,
                value: verificationUrl,
                size: 250, // Canvas size (displayed at 200px via CSS)
                level: 'M', // 15% error correction
                background: '#ffffff',
                foreground: '#003d7a', // KRDS primary blue
                padding: 10
            });
            
            const dataUrl = qr.toDataURL();
            
            // Cache QR data in memberData
            app.updateMemberData({
                qrCode: {
                    verificationUrl: verificationUrl,
                    didIdentifier: didIdentifier,
                    generatedTimestamp: new Date().toISOString(),
                    errorCorrectionLevel: 'M',
                    qrCodeDataUrl: dataUrl
                }
            });
            
            app.qrCodeGenerated = true;
            console.log('✅ QR code generated:', verificationUrl);
            
            return dataUrl;
        } catch (error) {
            console.error('❌ QR code generation failed:', error);
            app.showQRError();
            return null;
        }
    };
    
    /**
     * Show QR code generation error
     */
    app.showQRError = function() {
        const canvas = document.getElementById('qrCodeCanvas');
        if (!canvas) return;
        
        const container = canvas.parentElement;
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #d97706; margin-bottom: 16px;"></i>
                <p style="color: white; font-size: 16px; margin-bottom: 12px;">QR 코드 생성 실패</p>
                <button onclick="app.retryQRGeneration()" 
                        style="background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.3);">
                    <i class="fas fa-redo"></i> 다시 시도
                </button>
            </div>
        `;
    };
    
    /**
     * Retry QR code generation
     */
    app.retryQRGeneration = function() {
        // Reset flag and regenerate
        app.qrCodeGenerated = false;
        
        // Re-render card back
        const flipper = document.getElementById('idCardFlipper');
        if (flipper && flipper.classList.contains('flipped')) {
            app.renderDigitalIDCard();
            app.flipCard(); // Flip to back again
        }
    };
    
})();
```

### Step 8: Add DID Identifier to Member Data

Update your test data in `app.memberData`:

```javascript
// In js/app-core.js
app.memberData.didIdentifier = `did:ggcouncil:member-${app.memberData.memberId.split('-').pop()}`;
```

### Step 9: Test P2

1. **Flip card to back**
2. **Verify QR code**:
   - ✅ QR code generates in <500ms
   - ✅ QR code is 200×200px with high contrast
   - ✅ Scan QR code with phone camera → URL displays
   - ✅ QR code cached (no regeneration on re-flip)
   - ✅ Error handling works (disable QRious CDN to test)

---

## Phase 3: Blockchain Verification Badge (P3)

### Step 10: Add Blockchain Verification Display

Update `digital-id-enhanced.js` with blockchain badge logic:

```javascript
/**
 * Display blockchain verification badge (P3)
 */
app.displayBlockchainBadge = function() {
    const verification = app.memberData.blockchainVerification || { status: 'unavailable' };
    const badgeElement = document.getElementById('blockchainBadge');
    
    if (!badgeElement) return;
    
    switch (verification.status) {
        case 'verified':
            badgeElement.innerHTML = `
                <i class="fas fa-check-circle" style="color: #059669;"></i>
                <span>블록체인 인증됨</span>
            `;
            badgeElement.classList.add('verified');
            badgeElement.onclick = () => app.showVerificationDetails();
            break;
            
        case 'pending':
            badgeElement.innerHTML = `
                <i class="fas fa-spinner fa-spin" style="color: #0056b3;"></i>
                <span>인증 확인 중...</span>
            `;
            break;
            
        case 'unavailable':
        default:
            badgeElement.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="color: #d97706;"></i>
                <span>인증 확인 불가</span>
            `;
            break;
    }
    
    console.log('🔐 Blockchain badge displayed:', verification.status);
};

/**
 * Show verification details modal
 */
app.showVerificationDetails = function() {
    const verification = app.memberData.blockchainVerification;
    if (!verification || verification.status !== 'verified') return;
    
    const shortHash = verification.txHash
        ? verification.txHash.substring(0, 10) + '...' + verification.txHash.substring(62)
        : 'N/A';
    
    const timestamp = new Date(verification.verifiedAt).toLocaleString('ko-KR');
    
    app.showModal({
        title: '블록체인 검증 정보',
        content: `
            <div style="padding: 20px; text-align: center;">
                <div style="width: 64px; height: 64px; margin: 0 auto 16px; background: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-check-circle" style="font-size: 32px; color: #059669;"></i>
                </div>
                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">검증 완료</h3>
                <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; text-align: left;">
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 12px; color: #6b7280;">트랜잭션 해시</div>
                        <div style="font-size: 14px; font-family: monospace; color: #1f2937;">${shortHash}</div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 12px; color: #6b7280;">블록 번호</div>
                        <div style="font-size: 14px; color: #1f2937;">${verification.blockNumber}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: #6b7280;">검증 시간</div>
                        <div style="font-size: 14px; color: #1f2937;">${timestamp}</div>
                    </div>
                </div>
            </div>
        `,
        confirmText: '확인'
    });
};
```

### Step 11: Add Mock Blockchain Data

For testing, add mock verification data:

```javascript
// In js/app-core.js
app.memberData.blockchainVerification = {
    status: 'verified', // or 'pending', 'unavailable'
    txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockNumber: 1523487,
    verifiedAt: '2025-01-28T14:32:15+09:00',
    didIdentifier: app.memberData.didIdentifier
};
```

### Step 12: Test P3

1. **View digital ID card**
2. **Verify blockchain badge**:
   - ✅ Badge shows "블록체인 인증됨" with green checkmark
   - ✅ Badge is clickable and shows modal with details
   - ✅ Modal displays transaction hash (shortened), block number, timestamp
   - ✅ Test 'unavailable' status → shows warning icon
   - ✅ Test 'pending' status → shows spinner

---

## Testing Checklist

### Manual Testing

**Mobile Responsiveness** (Test at each breakpoint):
- [ ] 320px - Card readable, no horizontal scroll
- [ ] 430px - Primary viewport, optimal layout
- [ ] 768px - Tablet layout, centered card
- [ ] 1024px+ - Desktop layout, centered card

**Touch Interactions** (Test on actual mobile device):
- [ ] Flip button 44px × 44px minimum
- [ ] Flip button has vibration feedback (50ms)
- [ ] Card flip smooth at 60fps
- [ ] No jank or animation stutter

**Cross-Browser** (Test on each):
- [ ] Chrome 80+ - Full functionality
- [ ] Safari 13+ - Full functionality
- [ ] Firefox 75+ - Full functionality
- [ ] iOS 12+ Safari - Full functionality
- [ ] Android 8+ Chrome - Full functionality

**Accessibility** (Test with tools):
- [ ] aXe DevTools - Zero critical violations
- [ ] Keyboard navigation - Tab to flip button, Space/Enter to flip
- [ ] Screen reader - ARIA labels read correctly
- [ ] Color contrast - All text meets 4.5:1 ratio

**Performance** (Test with DevTools):
- [ ] Page load < 3 seconds on 3G throttling
- [ ] Time to Interactive (TTI) < 5 seconds
- [ ] QR code generation < 500ms
- [ ] Total page weight < 500KB (check Network tab)
- [ ] Card flip animation 60fps (check Performance profiler)

**Edge Cases**:
- [ ] Missing member photo → Shows default avatar with initials
- [ ] Long Korean name (5+ chars) → Truncates or wraps gracefully
- [ ] Long district name → Truncates or wraps gracefully
- [ ] QRious CDN fails → Shows error message with retry button
- [ ] No DID identifier → QR generation fails gracefully
- [ ] Blockchain API unavailable → Badge shows "인증 확인 불가"
- [ ] Offline mode → Card loads from localStorage

---

## Performance Optimization Tips

### Lazy Loading
- QR code only generates on first card flip (not on page load)
- Blockchain verification loads asynchronously, doesn't block card display

### Image Optimization
- Profile photos should be ≤100KB
- Use WebP format with JPEG fallback for best compression
- Store as base64 data URL in localStorage for offline access

### CSS Performance
- Use CSS transforms (GPU-accelerated) instead of position/width changes
- Avoid box-shadow during animations (applied only on static state)
- Use `will-change: transform` on flip-button for hover optimization

### localStorage Best Practices
- Total member data ~124KB (text + photo + QR)
- Read once on page load, cache in app.memberData
- Write only on updates, not on every UI change
- Validate data on load with app.validateMemberData()

---

## Troubleshooting

### Card Not Flipping

**Symptoms**: Click flip button, nothing happens

**Diagnosis**:
```javascript
// Check if flipper element exists
const flipper = document.getElementById('idCardFlipper');
console.log('Flipper element:', flipper);

// Check if flipped class toggles
console.log('Has flipped class:', flipper.classList.contains('flipped'));
```

**Solutions**:
- Verify `id="idCardFlipper"` exists in HTML
- Check CSS `transform-style: preserve-3d` is applied
- Ensure `app.flipCard()` function is defined

### QR Code Not Generating

**Symptoms**: Card back shows blank canvas or error

**Diagnosis**:
```javascript
// Check QRious library loaded
console.log('QRious loaded:', typeof QRious !== 'undefined');

// Check DID identifier exists
console.log('DID identifier:', app.memberData.didIdentifier);

// Check canvas element
console.log('Canvas element:', document.getElementById('qrCodeCanvas'));
```

**Solutions**:
- Verify QRious CDN script tag in index.html
- Check browser console for CDN loading errors
- Ensure didIdentifier field in memberData
- Verify canvas element ID matches

### Blockchain Badge Not Showing

**Symptoms**: Badge missing or shows wrong status

**Diagnosis**:
```javascript
// Check verification data
console.log('Verification:', app.memberData.blockchainVerification);

// Check badge element
console.log('Badge element:', document.getElementById('blockchainBadge'));
```

**Solutions**:
- Add blockchainVerification object to memberData
- Verify badge element ID in card HTML
- Check app.displayBlockchainBadge() is called in initDigitalIDCard()

---

## Next Steps

After completing implementation:

1. **Run Full Testing Checklist** above
2. **Create Git Commit**:
   ```bash
   git add .
   git commit -m "feat: implement DID-based digital member ID card
   
   - P1: Display card with flip animation (60fps)
   - P2: QR code generation with QRious library
   - P3: Blockchain verification status badge
   - KRDS design system compliant
   - WCAG 2.1 AA accessible
   - Mobile-first (430px optimized)
   - <500KB bundle size, <3s load on 3G
   
   🤖 Generated with Claude Code
   
   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

3. **Proceed to `/speckit.tasks`** to generate task breakdown for implementation

4. **Update CLAUDE.md** with new patterns if needed

---

## Reference Files

- **Spec**: `specs/001-digital-member-id/spec.md`
- **Data Model**: `specs/001-digital-member-id/data-model.md`
- **API Contract**: `specs/001-digital-member-id/contracts/blockchain-verification-api.yaml`
- **Research**: `specs/001-digital-member-id/research.md`
- **Constitution**: `.specify/memory/constitution.md`

**Questions?** Check existing code in `js/digital-id-enhanced.js` (if file exists) or refer to CLAUDE.md for project patterns.
