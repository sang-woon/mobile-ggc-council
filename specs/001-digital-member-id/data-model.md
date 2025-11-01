# Data Model: DID-Based Digital Member ID Card

**Feature**: 001-digital-member-id  
**Date**: 2025-01-31  
**Status**: Complete

## Purpose

This document defines the data structures, relationships, and validation rules for the digital member ID card feature. All entities are stored in `app.memberData` object with localStorage persistence following the existing architecture pattern.

---

## Entity 1: MemberIdentity

**Description**: Core personal information for Gyeonggi Provincial Council member displayed on digital ID card front.

### Attributes

| Attribute | Type | Required | Validation | Default | Notes |
|-----------|------|----------|------------|---------|-------|
| `name` | string | Yes | 2-10 Korean characters | - | Full name in Korean (e.g., "홍길동") |
| `photo` | string | No | Valid data URL or HTTPS URL | null | Base64 data URL or image URL (200×250px min) |
| `party` | string | Yes | Non-empty string | - | Political party name in Korean (e.g., "더불어민주당") |
| `partyColor` | string | Yes | Valid hex color (#RRGGBB) | "#999999" | Party brand color for UI accents |
| `district` | string | Yes | Non-empty string | - | Electoral district (e.g., "수원시 장안구") |
| `memberId` | string | Yes | Format: GGC-\d\d-\d{5} | - | Unique member ID (e.g., "GGC-11-12345") |
| `generation` | number | Yes | Integer 1-99 | - | Term number (e.g., 11 for 11th term) |
| `committees` | string[] | No | Array of strings | [] | Committee memberships (e.g., ["행정사무감사특별위원회"]) |

### Validation Rules

```javascript
function validateMemberIdentity(member) {
    const errors = [];
    
    // Name: 2-10 Korean characters
    if (!/^[가-힣]{2,10}$/.test(member.name)) {
        errors.push('name: Must be 2-10 Korean characters');
    }
    
    // Photo: Optional, but must be valid URL or data URL if provided
    if (member.photo && !/^(data:image\/(jpeg|png|webp);base64,|https:\/\/)/.test(member.photo)) {
        errors.push('photo: Must be data URL or HTTPS URL');
    }
    
    // Party: Non-empty string
    if (!member.party || member.party.trim().length === 0) {
        errors.push('party: Required field');
    }
    
    // Party Color: Valid hex color
    if (!/^#[0-9A-Fa-f]{6}$/.test(member.partyColor)) {
        errors.push('partyColor: Must be hex color format #RRGGBB');
    }
    
    // District: Non-empty string
    if (!member.district || member.district.trim().length === 0) {
        errors.push('district: Required field');
    }
    
    // Member ID: Format GGC-##-#####
    if (!/^GGC-\d{2}-\d{5}$/.test(member.memberId)) {
        errors.push('memberId: Must match format GGC-##-#####');
    }
    
    // Generation: Positive integer 1-99
    if (!Number.isInteger(member.generation) || member.generation < 1 || member.generation > 99) {
        errors.push('generation: Must be integer between 1 and 99');
    }
    
    // Committees: Array of strings (optional)
    if (member.committees && !Array.isArray(member.committees)) {
        errors.push('committees: Must be array of strings');
    }
    
    return errors.length === 0 ? { valid: true } : { valid: false, errors };
}
```

### Default Values

```javascript
const DEFAULT_MEMBER_IDENTITY = {
    name: '',
    photo: null,
    party: '',
    partyColor: '#999999',
    district: '',
    memberId: '',
    generation: 11,
    committees: []
};
```

### Relationships
- **One-to-One** with `DIDCredentials` (via `didIdentifier` foreign key)
- **One-to-One** with `BlockchainVerification` (via `didIdentifier` foreign key)
- **One-to-Many** with `QRCodeData` (member can have multiple QR codes generated over time, though UI shows only latest)

---

## Entity 2: DIDCredentials

**Description**: Decentralized Identifier (DID) information for blockchain-backed identity verification.

### Attributes

| Attribute | Type | Required | Validation | Default | Notes |
|-----------|------|----------|------------|---------|-------|
| `didIdentifier` | string | Yes | Format: did:ggcouncil:\{uuid\} | - | Unique DID (e.g., "did:ggcouncil:member-12345") |
| `publicKey` | string | Yes | Hex string starting with 0x | - | Public key for signature verification (e.g., "0x04a1b2c3...") |
| `issuedDate` | string | Yes | ISO 8601 with timezone | - | DID issuance timestamp (e.g., "2024-07-01T00:00:00+09:00") |
| `expiresDate` | string | Yes | ISO 8601 with timezone | - | DID expiration timestamp (e.g., "2028-06-30T23:59:59+09:00") |

### Validation Rules

```javascript
function validateDIDCredentials(did) {
    const errors = [];
    
    // DID Identifier: Format did:ggcouncil:{id}
    if (!/^did:ggcouncil:[a-z0-9\-]+$/.test(did.didIdentifier)) {
        errors.push('didIdentifier: Must match format did:ggcouncil:{id}');
    }
    
    // Public Key: Hex string starting with 0x
    if (!/^0x[0-9a-fA-F]{64,}$/.test(did.publicKey)) {
        errors.push('publicKey: Must be hex string starting with 0x (min 64 chars)');
    }
    
    // Issued Date: Valid ISO 8601
    if (!isValidISO8601(did.issuedDate)) {
        errors.push('issuedDate: Must be ISO 8601 format with timezone');
    }
    
    // Expires Date: Valid ISO 8601, must be after issued date
    if (!isValidISO8601(did.expiresDate)) {
        errors.push('expiresDate: Must be ISO 8601 format with timezone');
    } else if (new Date(did.expiresDate) <= new Date(did.issuedDate)) {
        errors.push('expiresDate: Must be after issuedDate');
    }
    
    return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

function isValidISO8601(dateString) {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;
    if (!iso8601Regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}
```

### State Lifecycle

```
[Registered] → [Active] → [Expired]
     ↓
[Revoked] (terminal state)
```

**State Transitions**:
- **Registered → Active**: Automatic on blockchain confirmation (txHash recorded)
- **Active → Expired**: Automatic when `expiresDate` passes
- **Active → Revoked**: Manual revocation by council admin (permanent, irreversible)

---

## Entity 3: BlockchainVerification

**Description**: Blockchain transaction record proving DID authenticity and immutability (Priority P3 feature).

### Attributes

| Attribute | Type | Required | Validation | Default | Notes |
|-----------|------|----------|------------|---------|-------|
| `status` | enum | Yes | 'verified' \| 'pending' \| 'unavailable' | 'unavailable' | Current verification state |
| `txHash` | string | No | Hex string starting with 0x (66 chars) | null | Blockchain transaction hash (e.g., "0x1a2b3c...") |
| `blockNumber` | number | No | Positive integer | null | Block number containing transaction |
| `verifiedAt` | string | No | ISO 8601 with timezone | null | Timestamp of blockchain verification |
| `didIdentifier` | string | Yes | Format: did:ggcouncil:\{uuid\} | - | Foreign key to DIDCredentials |

### Validation Rules

```javascript
function validateBlockchainVerification(verification) {
    const errors = [];
    
    // Status: Must be valid enum value
    const validStatuses = ['verified', 'pending', 'unavailable'];
    if (!validStatuses.includes(verification.status)) {
        errors.push(`status: Must be one of ${validStatuses.join(', ')}`);
    }
    
    // If status is 'verified', txHash and blockNumber are required
    if (verification.status === 'verified') {
        if (!verification.txHash || !/^0x[0-9a-fA-F]{64}$/.test(verification.txHash)) {
            errors.push('txHash: Required for verified status, must be 66-char hex string');
        }
        
        if (!Number.isInteger(verification.blockNumber) || verification.blockNumber < 0) {
            errors.push('blockNumber: Required for verified status, must be positive integer');
        }
        
        if (!verification.verifiedAt || !isValidISO8601(verification.verifiedAt)) {
            errors.push('verifiedAt: Required for verified status, must be ISO 8601 format');
        }
    }
    
    // DID Identifier: Must match format
    if (!/^did:ggcouncil:[a-z0-9\-]+$/.test(verification.didIdentifier)) {
        errors.push('didIdentifier: Must match format did:ggcouncil:{id}');
    }
    
    return errors.length === 0 ? { valid: true } : { valid: false, errors };
}
```

### Status Definitions

| Status | Description | UI Display | Color |
|--------|-------------|------------|-------|
| `verified` | DID confirmed on blockchain, txHash validated | "블록체인 인증됨" | Green (#059669) |
| `pending` | Verification in progress, awaiting blockchain confirmation | "인증 확인 중..." | Blue (#0056b3) |
| `unavailable` | Blockchain API unreachable or DID not found | "인증 확인 불가" | Yellow (#d97706) |

---

## Entity 4: QRCodeData

**Description**: Generated QR code metadata for external verification via scannable image (Priority P2 feature).

### Attributes

| Attribute | Type | Required | Validation | Default | Notes |
|-----------|------|----------|------------|---------|-------|
| `verificationUrl` | string | Yes | Valid HTTPS URL | - | Full verification URL (e.g., "https://council.gg.go.kr/verify/did:...") |
| `didIdentifier` | string | Yes | Format: did:ggcouncil:\{uuid\} | - | Foreign key to DIDCredentials |
| `generatedTimestamp` | string | Yes | ISO 8601 with timezone | - | QR code generation time |
| `errorCorrectionLevel` | enum | Yes | 'L' \| 'M' \| 'Q' \| 'H' | 'M' | QRious error correction level (default: M = 15%) |
| `qrCodeDataUrl` | string | No | Base64 data URL (image/png) | null | Generated QR code image as base64 |

### Validation Rules

```javascript
function validateQRCodeData(qrData) {
    const errors = [];
    
    // Verification URL: Must be HTTPS URL with expected domain
    const urlRegex = /^https:\/\/council\.gg\.go\.kr\/verify\/did:[a-z0-9\-]+$/;
    if (!urlRegex.test(qrData.verificationUrl)) {
        errors.push('verificationUrl: Must be HTTPS URL on council.gg.go.kr/verify/ domain');
    }
    
    // DID Identifier: Must match format
    if (!/^did:ggcouncil:[a-z0-9\-]+$/.test(qrData.didIdentifier)) {
        errors.push('didIdentifier: Must match format did:ggcouncil:{id}');
    }
    
    // Generated Timestamp: Must be ISO 8601
    if (!isValidISO8601(qrData.generatedTimestamp)) {
        errors.push('generatedTimestamp: Must be ISO 8601 format with timezone');
    }
    
    // Error Correction Level: Must be valid QRious level
    const validLevels = ['L', 'M', 'Q', 'H'];
    if (!validLevels.includes(qrData.errorCorrectionLevel)) {
        errors.push(`errorCorrectionLevel: Must be one of ${validLevels.join(', ')}`);
    }
    
    // QR Code Data URL: Optional, but must be valid data URL if provided
    if (qrData.qrCodeDataUrl && !/^data:image\/png;base64,[A-Za-z0-9+/]+=*$/.test(qrData.qrCodeDataUrl)) {
        errors.push('qrCodeDataUrl: Must be valid PNG data URL');
    }
    
    return errors.length === 0 ? { valid: true } : { valid: false, errors };
}
```

### Error Correction Levels

| Level | Recovery Capability | Use Case | QR Density |
|-------|---------------------|----------|------------|
| L | 7% | Clean environments, short URLs | Lowest |
| **M** | **15%** (default) | **Normal use, balanced** | **Medium** |
| Q | 25% | Printed materials, wear expected | High |
| H | 30% | Critical verification, poor lighting | Highest |

**Recommendation**: Use **M** (15% recovery) for balance between scannability and error tolerance. Typical DID URL (~60 characters) requires QR version 5-6 at level M.

---

## Composite Data Structure

### Complete app.memberData Schema

```javascript
// Full localStorage structure combining all entities
{
    // Entity 1: MemberIdentity
    "name": "홍길동",
    "photo": "data:image/jpeg;base64,/9j/4AAQ...", // or HTTPS URL
    "party": "더불어민주당",
    "partyColor": "#004EA2",
    "district": "수원시 장안구",
    "memberId": "GGC-11-12345",
    "generation": 11,
    "committees": [
        "행정사무감사특별위원회",
        "예산결산특별위원회"
    ],
    
    // Entity 2: DIDCredentials
    "didIdentifier": "did:ggcouncil:member-12345",
    "publicKey": "0x04a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef12345678",
    "issuedDate": "2024-07-01T00:00:00+09:00",
    "expiresDate": "2028-06-30T23:59:59+09:00",
    
    // Entity 3: BlockchainVerification (nested object)
    "blockchainVerification": {
        "status": "verified",
        "txHash": "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
        "blockNumber": 1523487,
        "verifiedAt": "2025-01-28T14:32:15+09:00",
        "didIdentifier": "did:ggcouncil:member-12345"
    },
    
    // Entity 4: QRCodeData (nested object, generated on demand)
    "qrCode": {
        "verificationUrl": "https://council.gg.go.kr/verify/did:ggcouncil:member-12345",
        "didIdentifier": "did:ggcouncil:member-12345",
        "generatedTimestamp": "2025-01-31T15:30:45+09:00",
        "errorCorrectionLevel": "M",
        "qrCodeDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANS..." // base64 QR image
    },
    
    // Metadata
    "lastUpdated": "2025-01-31T15:30:45+09:00"
}
```

### localStorage Size Estimation

| Component | Size | Notes |
|-----------|------|-------|
| MemberIdentity (text) | ~500 bytes | Name, party, district, committees |
| Profile photo (base64) | ~120KB | 200×250px JPEG at 80% quality |
| DIDCredentials | ~300 bytes | DID identifier, public key, timestamps |
| BlockchainVerification | ~200 bytes | Status, txHash, block number |
| QRCodeData | ~3KB | Generated QR code as base64 PNG |
| **Total** | **~124KB** | Per member record in localStorage |

**localStorage Quota**: Chrome/Safari provide 5-10MB, sufficient for single-user application with ~40-80 member records (not applicable for current single-member use case).

---

## Relationships Diagram

```
MemberIdentity (1)
    ├─ didIdentifier ──→ DIDCredentials (1)
    │                         └─ didIdentifier ──→ BlockchainVerification (1)
    └─ didIdentifier ──→ QRCodeData (1..n, typically 1 cached)

Foreign Key: didIdentifier (string)
Cardinality: One-to-One for all relationships in current implementation
```

**Note**: While data model supports One-to-Many for QRCodeData (historical QR generations), current implementation caches only the latest QR code in `app.memberData.qrCode` object.

---

## Data Access Patterns

### Pattern 1: Load Member Data on Page Init

```javascript
// In js/app-core.js
app.init = function() {
    // Load from localStorage
    const stored = localStorage.getItem('memberData');
    if (stored) {
        app.memberData = JSON.parse(stored);
        
        // Validate required fields
        if (!app.validateMemberData()) {
            console.error('❌ Invalid member data in localStorage');
            app.showNotification('데이터 오류가 발생했습니다', 'error');
            return false;
        }
        
        console.log('✅ Member data loaded and validated');
        return true;
    } else {
        console.warn('⚠️ No member data found in localStorage');
        return false;
    }
};
```

### Pattern 2: Update Member Data and Sync

```javascript
// In js/app-core.js
app.updateMemberData = function(updates) {
    // Merge updates
    Object.assign(app.memberData, updates);
    
    // Update timestamp
    app.memberData.lastUpdated = new Date().toISOString();
    
    // Persist to localStorage
    try {
        localStorage.setItem('memberData', JSON.stringify(app.memberData));
        console.log('✅ Member data updated and persisted');
        return true;
    } catch (error) {
        console.error('❌ Failed to persist member data:', error);
        return false;
    }
};
```

### Pattern 3: Generate and Cache QR Code

```javascript
// In js/qr-code-generator.js
app.generateMemberQRCode = function() {
    const didIdentifier = app.memberData.didIdentifier;
    if (!didIdentifier) {
        console.error('❌ No DID identifier found');
        return null;
    }
    
    // Generate QR code
    const verificationUrl = `https://council.gg.go.kr/verify/${didIdentifier}`;
    const qr = new QRious({
        element: document.getElementById('qrCodeCanvas'),
        value: verificationUrl,
        size: 250,
        level: 'M'
    });
    
    // Cache QR data in memberData
    app.updateMemberData({
        qrCode: {
            verificationUrl: verificationUrl,
            didIdentifier: didIdentifier,
            generatedTimestamp: new Date().toISOString(),
            errorCorrectionLevel: 'M',
            qrCodeDataUrl: qr.toDataURL()
        }
    });
    
    console.log('✅ QR code generated and cached');
    return qr.toDataURL();
};
```

### Pattern 4: Display Blockchain Verification Status

```javascript
// In js/digital-id-enhanced.js
app.displayBlockchainBadge = function() {
    const verification = app.memberData.blockchainVerification;
    if (!verification) {
        console.warn('⚠️ No blockchain verification data');
        return;
    }
    
    const badgeElement = document.getElementById('blockchainBadge');
    if (!badgeElement) return;
    
    // Update UI based on status
    switch (verification.status) {
        case 'verified':
            badgeElement.innerHTML = `
                <i class="fas fa-check-circle text-green-600"></i>
                <span class="text-sm font-medium">블록체인 인증됨</span>
            `;
            badgeElement.onclick = () => app.showVerificationDetails(verification);
            break;
        case 'pending':
            badgeElement.innerHTML = `
                <i class="fas fa-spinner fa-spin text-blue-600"></i>
                <span class="text-sm">인증 확인 중...</span>
            `;
            break;
        case 'unavailable':
        default:
            badgeElement.innerHTML = `
                <i class="fas fa-exclamation-triangle text-yellow-600"></i>
                <span class="text-sm">인증 확인 불가</span>
            `;
            break;
    }
    
    console.log('🔐 Blockchain badge displayed:', verification.status);
};
```

---

## Migration Strategy

### Phase 0: Baseline (Current State)
Existing `app.memberData` contains basic fields:
- name, party, district, memberId, generation, committees

### Phase 1: P1 MVP (Display Card)
Add DID credentials fields:
- didIdentifier, publicKey, issuedDate, expiresDate

**Migration Code**:
```javascript
app.migrateToPhase1 = function() {
    if (!app.memberData.didIdentifier) {
        // Generate placeholder DID until backend provides real one
        app.memberData.didIdentifier = `did:ggcouncil:member-${app.memberData.memberId.split('-').pop()}`;
        app.memberData.publicKey = '0x' + '0'.repeat(66); // Placeholder
        app.memberData.issuedDate = new Date().toISOString();
        app.memberData.expiresDate = new Date(Date.now() + 4*365*24*60*60*1000).toISOString(); // +4 years
        
        app.updateMemberData(app.memberData);
        console.log('✅ Migrated to Phase 1 schema');
    }
};
```

### Phase 2: P2 (QR Code)
Add QR code nested object:
- qrCode: {verificationUrl, didIdentifier, generatedTimestamp, errorCorrectionLevel, qrCodeDataUrl}

**Migration Code**:
```javascript
// QR code generated on-demand, no migration needed
// Data structure added when user first flips card to back
```

### Phase 3: P3 (Blockchain Verification)
Add blockchain verification nested object:
- blockchainVerification: {status, txHash, blockNumber, verifiedAt, didIdentifier}

**Migration Code**:
```javascript
app.migrateToPhase3 = function() {
    if (!app.memberData.blockchainVerification) {
        // Start with unavailable status until blockchain API integration
        app.memberData.blockchainVerification = {
            status: 'unavailable',
            txHash: null,
            blockNumber: null,
            verifiedAt: null,
            didIdentifier: app.memberData.didIdentifier
        };
        
        app.updateMemberData(app.memberData);
        console.log('✅ Migrated to Phase 3 schema');
    }
};
```

---

## Summary

All data entities are stored in a single `app.memberData` object with localStorage persistence. Schema is designed for progressive enhancement (P1→P2→P3) with backward compatibility. Total storage footprint ~124KB per member, well within localStorage quota limits.

**Key Design Decisions**:
1. **Flat + Nested Hybrid**: Core fields flat, complex objects nested (blockchainVerification, qrCode)
2. **Validation Functions**: Client-side validation for data integrity, no backend validation
3. **Migration Strategy**: Additive-only migrations preserve existing data
4. **Foreign Keys**: didIdentifier serves as primary linking field across entities
5. **Caching**: QR code cached in localStorage to avoid regeneration on every flip
