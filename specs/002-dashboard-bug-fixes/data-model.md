# Data Model: Dashboard Bug Fixes

**Feature**: 002-dashboard-bug-fixes
**Date**: 2025-01-31
**Purpose**: Define data structures and state machines for bug fix implementation

## Modal Instance State Machine

### Modal State

```typescript
interface ModalInstance {
  id: string;                    // Unique identifier (e.g., "modal-1738368000000")
  isOpen: boolean;               // Current visibility state
  title: string;                 // Modal header text (Korean)
  content: string;               // Modal body HTML
  zIndex: number;                // Stacking order (base: 9999)
  createdAt: number;             // Timestamp for debugging
  debounceTimeout: number | null; // Debounce timer ID
  cleanup: () => void;           // Cleanup function reference
}
```

### State Transitions

```
[Idle] --showModal()--> [Opening]
  ↓
[Opening] --renderComplete()--> [Open]
  ↓
[Open] --closeModal()/Escape/Backdrop Click--> [Closing]
  ↓
[Closing] --cleanupComplete()--> [Idle]

Error States:
[Opening] --error--> [Idle] (cleanup + log error)
[Open] --duplicateAttempt--> [Open] (ignore + console.warn)
```

### Global State Management

```javascript
// In window.app object
window.app.currentModal = null; // ModalInstance | null
window.app.modalDebounceTimeout = null; // number | null
```

---

## Default Avatar Generation Schema

### Avatar Data Structure

```typescript
interface AvatarConfig {
  memberName: string;      // Full Korean name (e.g., "김영수")
  initials: string;        // First 2 characters (e.g., "김영")
  partyColor: string;      // Hex color from KRDS palette
  size: {
    width: number;         // Default: 80px
    height: number;        // Default: 100px
  };
  ariaLabel: string;       // Accessibility label (Korean)
}
```

### Party Color Mapping

```javascript
const PARTY_COLORS = {
  '국민의힘': '#003d7a',     // KRDS primary blue
  '더불어민주당': '#0056b3',  // KRDS secondary blue
  '정의당': '#FFCD00',       // Justice Party yellow (external)
  '무소속': '#6B7280',       // Neutral gray
  'default': '#003d7a'      // Fallback to KRDS primary
};
```

### SVG Generation Pattern

```javascript
// Input: memberName="김영수", party="국민의힘"
// Output: Inline SVG string

function generateDefaultAvatar(memberName, partyColor) {
  const initials = memberName.substring(0, 2);
  const bgColor = partyColor || '#003d7a';

  return `<svg width="80" height="100" viewBox="0 0 80 100"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="${memberName} 기본 프로필">
    <circle cx="40" cy="40" r="35" fill="${bgColor}"/>
    <text
      x="40"
      y="50"
      font-family="Noto Sans KR"
      font-size="24"
      font-weight="500"
      fill="white"
      text-anchor="middle">${initials}</text>
  </svg>`;
}
```

---

## Chart Configuration Schema

### Chart Data Structure

```typescript
interface MonthlyActivityChartData {
  labels: string[];          // Korean month names: ['8월', '9월', ...]
  datasets: ChartDataset[];
}

interface ChartDataset {
  label: string;             // Dataset name in Korean
  data: number[];            // Activity counts
  borderColor: string;       // Line color (KRDS)
  backgroundColor: string;   // Fill color (KRDS with opacity)
  tension: number;           // Curve smoothness (0.3 recommended)
}
```

### Chart Options Schema

```typescript
interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  scales: {
    y: {
      beginAtZero: boolean;
      title: {
        display: boolean;
        text: string;          // "활동 수"
        font: FontConfig;
      };
      ticks: {
        font: FontConfig;
      };
    };
    x: {
      title: {
        display: boolean;
        text: string;          // "월"
        font: FontConfig;
      };
      ticks: {
        font: FontConfig;
      };
    };
  };
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => string; // "활동: ${count}건"
      };
      titleFont: FontConfig;
      bodyFont: FontConfig;
    };
  };
}

interface FontConfig {
  family: string;    // "Noto Sans KR"
  size: number;      // 12 or 14
  weight?: number;   // Optional
}
```

---

## Favicon Asset Schema

### Favicon File Specifications

```typescript
interface FaviconAsset {
  filename: string;
  format: 'ICO' | 'PNG';
  dimensions: {
    width: number;
    height: number;
  };
  purpose: string;
  maxSize: number; // bytes
}
```

### Required Favicon Files

```javascript
const FAVICON_ASSETS = [
  {
    filename: 'favicon.ico',
    format: 'ICO',
    dimensions: { width: 16, height: 16 },
    purpose: 'Legacy browsers, IE, default',
    maxSize: 1024  // 1KB
  },
  {
    filename: 'favicon-16x16.png',
    format: 'PNG',
    dimensions: { width: 16, height: 16 },
    purpose: 'Standard browser tab icon',
    maxSize: 512  // 0.5KB
  },
  {
    filename: 'favicon-32x32.png',
    format: 'PNG',
    dimensions: { width: 32, height: 32 },
    purpose: 'Standard browser tab icon (Retina)',
    maxSize: 1024  // 1KB
  },
  {
    filename: 'favicon-96x96.png',
    format: 'PNG',
    dimensions: { width: 96, height: 96 },
    purpose: 'High-DPI displays, Android browsers',
    maxSize: 2048  // 2KB
  },
  {
    filename: 'android-icon-192x192.png',
    format: 'PNG',
    dimensions: { width: 192, height: 192 },
    purpose: 'Android Chrome home screen (PWA)',
    maxSize: 4096  // 4KB
  }
];

// Total budget: ~8.5KB
```

---

## Debounce Configuration

### Debounce Settings

```typescript
interface DebounceConfig {
  modalSpawning: number;     // 200ms (prevent duplicate modals)
  quickActionButtons: number; // 200ms (prevent rapid clicks)
  chartRendering: number;    // 100ms (prevent re-render thrashing)
}
```

### Debounce Implementation Pattern

```javascript
// Generic debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Applied to modal spawning
window.app.showModalDebounced = debounce(window.app.showModal, 200);
```

---

## Error State Handling

### Error Recovery Patterns

```typescript
interface ErrorState {
  type: 'IMAGE_LOAD_FAILED' | 'MODAL_SPAWN_FAILED' | 'CHART_RENDER_FAILED' | 'CDN_LOAD_FAILED';
  message: string;          // Korean error message for user
  fallback: () => void;     // Recovery action
  logData: {
    timestamp: number;
    context: string;
    stackTrace?: string;
  };
}
```

### Fallback Strategies

```javascript
const ERROR_FALLBACKS = {
  IMAGE_LOAD_FAILED: () => {
    // Use default avatar system
    return window.app.generateDefaultAvatar(memberName, partyColor);
  },

  MODAL_SPAWN_FAILED: () => {
    // Force close existing modal and retry
    window.app.forceCloseAllModals();
    setTimeout(() => window.app.showModal(options), 100);
  },

  CHART_RENDER_FAILED: () => {
    // Display static data table as fallback
    return generateStaticDataTable(chartData);
  },

  CDN_LOAD_FAILED: () => {
    // Display error message with graceful degradation
    console.error('❌ CDN 로드 실패:', libraryName);
    showUserFriendlyError('일부 기능을 사용할 수 없습니다. 네트워크 연결을 확인해주세요.');
  }
};
```

---

## Data Validation Rules

### Avatar Generation Validation

```javascript
function validateAvatarInput(memberName, partyColor) {
  // Name validation
  if (!memberName || typeof memberName !== 'string') {
    throw new Error('유효하지 않은 의원 이름');
  }
  if (memberName.length < 2) {
    throw new Error('의원 이름은 최소 2자 이상이어야 합니다');
  }

  // Color validation
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
  if (partyColor && !hexColorRegex.test(partyColor)) {
    console.warn('⚠️ 잘못된 색상 코드, 기본값 사용:', partyColor);
    return '#003d7a'; // Fallback to KRDS primary
  }

  return true;
}
```

### Modal Options Validation

```javascript
function validateModalOptions(options) {
  const required = ['title', 'content'];
  const missing = required.filter(key => !options[key]);

  if (missing.length > 0) {
    throw new Error(`필수 모달 옵션 누락: ${missing.join(', ')}`);
  }

  // Sanitize HTML content to prevent XSS
  if (typeof options.content === 'string') {
    // Basic XSS prevention (production should use DOMPurify or similar)
    const dangerous = /<script|<iframe|javascript:/gi;
    if (dangerous.test(options.content)) {
      throw new Error('위험한 HTML 콘텐츠 감지됨');
    }
  }

  return true;
}
```

---

## Summary

**Key Data Structures**:
1. ModalInstance - State machine for modal lifecycle management
2. AvatarConfig - Schema for default avatar generation
3. ChartConfiguration - Enhanced Chart.js setup with Korean localization
4. FaviconAssets - Specification for required favicon files
5. ErrorState - Error recovery and fallback patterns

**State Management**: All state stored in `window.app` global object following existing architecture patterns

**Validation**: Input validation for all user-facing data with Korean error messages

**Performance**: Debouncing applied to prevent unnecessary DOM operations and maintain < 100ms interaction times

## Next Phase

Proceed to create:
- quickstart.md: Developer guide for implementing bug fixes
- contracts/: API documentation for modal lifecycle and chart configuration
