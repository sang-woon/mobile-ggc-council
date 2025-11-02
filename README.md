# 경기도의회 의원 의정활동 관리시스템

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://sang-woon.github.io/mobile-ggc-council/)

> 모바일 최적화 의정활동 관리 플랫폼 with DID-based Digital Member ID Card

경기도의회 의원들의 의정활동을 관리하는 모바일 우선 웹 애플리케이션입니다. 블록체인 기반 DID(Decentralized Identifier) 인증과 QR 코드를 활용한 디지털 의원증을 제공합니다.

## 📱 Live Demo

**🌐 [https://sang-woon.github.io/mobile-ggc-council/](https://sang-woon.github.io/mobile-ggc-council/)**

## ✨ 주요 기능

### 🎴 디지털 의원증 (DID-based Digital ID Card)
- **3D 카드 플립 애니메이션** - 600ms 부드러운 전환 효과
- **QR 코드 생성** - DID 기반 신원 확인 (lazy loading)
- **블록체인 인증 배지** - 검증 상태 실시간 표시 (verified/pending/unavailable)
- **모바일 최적화** - 430px 우선 반응형 디자인
- **접근성 지원** - WCAG 2.1 AA 준수, 키보드 네비게이션, ARIA 라벨

### 📊 의정활동 관리
- **대시보드** - 통계 및 활동 시각화 (Chart.js)
- **출석 관리** - 본회의/상임위/특별위 출석률 추적
- **의안 관리** - 발의 법안 및 진행 상황
- **발언 기록** - 회의 발언 내역 관리
- **민원 처리** - AI 지원 민원 처리 시스템

### 🗺️ 위치 기반 활동
- **GPS 인증** - 블록체인 기반 위치 활동 추적
- **활동 로그** - 지역구 방문 및 현장 활동 기록

### 📅 일정 관리
- **FullCalendar 통합** - 회의 일정 및 일정 관리
- **실시간 알림** - 중요 일정 푸시 알림

## 🛠️ 기술 스택

### Frontend
```yaml
Core:
  - Vanilla JavaScript ES6+  # 프레임워크 없음!
  - HTML5 (시맨틱 마크업)
  - CSS3 + Tailwind CSS (CDN)

라이브러리 (모두 CDN):
  - QRious v4.0.2           # QR 코드 생성
  - Chart.js                # 데이터 시각화
  - FullCalendar v6.1.10    # 일정 관리
  - Font Awesome 6.4.0      # 아이콘
  - Noto Sans KR            # 한글 폰트 (Google Fonts)

아키텍처:
  - Single Page Application (SPA)
  - localStorage 기반 데이터 저장
  - 제로 빌드 (No webpack, No npm build!)
```

### Design System
- **KRDS (Korean Design System)** 준수
- **Primary Color**: `#003d7a` (경기도의회 블루)
- **Secondary Color**: `#0056b3` (강조 색상)
- **Typography**: Noto Sans KR (300, 400, 500, 600, 700)

### Browser Support
| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | ✅ |
| Safari | 13+ | ✅ |
| Firefox | 75+ | ✅ |
| Edge | 80+ (Chromium) | ✅ |
| iOS Safari | 12+ | ✅ |
| Android Chrome | 8+ | ✅ |
| IE11 | - | ❌ |

## 🚀 빠른 시작

### 방법 1: 로컬에서 바로 실행 (가장 간단)

```bash
# 1. 프로젝트 다운로드
git clone https://github.com/sang-woon/mobile-ggc-council.git
cd mobile-ggc-council

# 2. 브라우저에서 열기
# - Windows: index.html 더블 클릭
# - Mac: open index.html
# - Linux: xdg-open index.html
```

**끝!** 빌드 과정이 전혀 없습니다.

### 방법 2: 개발 서버 실행 (권장)

```bash
# Python이 설치되어 있다면
python -m http.server 8000

# 또는 Node.js가 있다면
npx http-server -p 8000

# 브라우저에서 열기
# http://localhost:8000
```

### 방법 3: VS Code Live Server

1. VS Code에서 프로젝트 열기
2. **Live Server** 확장 설치
3. `index.html` 우클릭 → "Open with Live Server"

## 📁 프로젝트 구조

```
251031-mobile-ggc-member/
├── index.html                 # 메인 진입점
├── main.js                    # 애플리케이션 초기화
│
├── js/                        # JavaScript 모듈 (47개 파일)
│   ├── app-core.js            # 핵심 앱 로직
│   ├── digital-id-enhanced.js # 디지털 의원증 (850줄)
│   ├── qr-code-generator.js   # QR 코드 생성 (170줄)
│   ├── app-pages.js           # 페이지 템플릿
│   ├── app-modals.js          # 모달 시스템
│   └── ...
│
├── styles/                    # CSS 파일
│   ├── digital-id-enhanced.css  # 디지털 ID 스타일 (1,150줄)
│   ├── krds-design-system.css   # KRDS 디자인 시스템
│   └── ...
│
├── images/                    # 이미지 및 아이콘
│   ├── default-avatar.svg     # 기본 아바타
│   ├── blockchain-verified-badge.svg
│   └── ...
│
├── specs/                     # 기능 명세서
│   └── 001-digital-member-id/ # 디지털 의원증 스펙
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       ├── IMPLEMENTATION-SUMMARY.md
│       └── TEST-REPORT.md
│
├── CLAUDE.md                  # 개발 가이드
├── README.md                  # 이 파일
└── manifest.json              # PWA 매니페스트
```

## 🌐 배포 방법

### Option 1: GitHub Pages (무료, 추천)

```bash
# 1. GitHub 저장소 생성 및 푸시
git init
git add .
git commit -m "feat: 경기도의회 의정활동 관리시스템"
git remote add origin https://github.com/YOUR_USERNAME/mobile-ggc-council.git
git push -u origin main

# 2. GitHub 웹사이트 설정
# Settings → Pages → Source: main branch → Save
```

**배포 완료!** `https://YOUR_USERNAME.github.io/mobile-ggc-council/`

**장점:**
- ✅ 완전 무료
- ✅ HTTPS 자동 제공
- ✅ CDN 자동 적용
- ✅ Git push만 하면 자동 배포

### Option 2: Vercel (무료, 초고속)

```bash
# CLI로 배포
npm install -g vercel
vercel login
vercel --prod
```

**또는 웹에서:**
1. [vercel.com](https://vercel.com) 가입
2. GitHub 저장소 연결
3. 자동 배포 완료!

**URL:** `https://YOUR_PROJECT.vercel.app`

### Option 3: Netlify (무료, 드래그 앤 드롭)

1. [netlify.com](https://netlify.com) 가입
2. 프로젝트 폴더를 드래그 앤 드롭
3. 배포 완료!

**또는 Git 연동:**
```bash
# Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Option 4: 자체 서버 (nginx)

```bash
# 파일 업로드
scp -r * user@server:/var/www/mobile-ggc-council/

# nginx 설정
sudo nano /etc/nginx/sites-available/mobile-ggc-council
```

**nginx 설정 예시:**
```nginx
server {
    listen 80;
    server_name council.gg.go.kr;

    root /var/www/mobile-ggc-council;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 정적 파일 캐싱
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Option 5: Docker

```dockerfile
# Dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 빌드 및 실행
docker build -t mobile-ggc-council .
docker run -d -p 80:80 mobile-ggc-council
```

## ⚙️ 환경 설정

### 개발 환경

현재 **목(mock) 데이터**로 동작합니다:

```javascript
// js/app-core.js
memberData: {
    name: '김영수',
    party: '국민의힘',
    district: '경기 수원시갑',
    // ... 테스트 데이터
}
```

### 프로덕션 환경 설정

**1. API 연동**

`js/config.js` 파일 생성:

```javascript
const config = {
    development: {
        apiUrl: 'http://localhost:3000',
        enableDebug: true
    },
    production: {
        apiUrl: 'https://api.council.gg.go.kr',
        enableDebug: false
    }
};

const ENV = 'production'; // 배포 시 변경
window.appConfig = config[ENV];
```

**2. 인증 시스템 연동**

```javascript
// js/app-core.js 수정
// Before (mock):
authToken: 'temp_token_' + Date.now(),

// After (production):
authToken: null,  // 로그인 시 실제 토큰 설정

// 로그인 API 호출
async login(username, password) {
    const response = await fetch(`${appConfig.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const { token } = await response.json();
    this.authToken = token;
    localStorage.setItem('authToken', token);
}
```

**3. 실제 데이터 로드**

```javascript
// 의원 데이터 API에서 로드
async loadMemberData() {
    const response = await fetch(`${appConfig.apiUrl}/api/members/me`, {
        headers: {
            'Authorization': `Bearer ${this.authToken}`
        }
    });
    this.memberData = await response.json();
    localStorage.setItem('memberData', JSON.stringify(this.memberData));
}
```

## 📋 배포 전 체크리스트

### 보안
- [ ] 하드코딩된 `authToken` 제거
- [ ] API 키를 환경 변수로 분리
- [ ] HTTPS 설정 완료
- [ ] CORS 정책 설정
- [ ] Content Security Policy (CSP) 설정

### 성능
- [ ] 이미지 최적화 (<100KB per image)
- [ ] 총 페이지 용량 <500KB 확인
- [ ] Lighthouse 점수 >90 확인
- [ ] 3G 네트워크에서 <3초 로딩 확인

### 기능
- [ ] 모든 페이지 정상 동작 확인
- [ ] QR 코드 스캔 테스트 (iOS/Android)
- [ ] 블록체인 배지 상태 확인
- [ ] 오프라인 모드 테스트
- [ ] 다양한 화면 크기 테스트 (320px-1024px+)

### 접근성
- [ ] WCAG 2.1 AA 준수 확인
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 테스트
- [ ] 색상 대비 4.5:1 이상 확인

## 🧪 테스트

### 디지털 의원증 테스트

```bash
# 1. 브라우저에서 애플리케이션 열기
open index.html

# 2. 사이드 메뉴 → "디지털 의원증" 클릭

# 3. 테스트 항목:
# - [x] 카드 앞면 표시
# - [x] 카드 뒤집기 (600ms 애니메이션)
# - [x] QR 코드 생성 (첫 뒤집기 시)
# - [x] 블록체인 배지 표시 (우측 상단)
# - [x] 배지 클릭 → 상세 정보 모달
# - [x] 모바일 햅틱 피드백
```

### 브라우저 DevTools 테스트

```javascript
// F12 → Console에서 실행

// 1. 블록체인 배지 상태 변경
app.memberData.blockchainVerification.status = 'pending';
app.displayBlockchainBadge();

// 2. QR 코드 재생성
app.generateMemberQRCode();

// 3. localStorage 확인
console.log(JSON.parse(localStorage.getItem('memberData')));
```

### 성능 테스트

```bash
# Lighthouse 감사
1. F12 → Lighthouse 탭
2. Categories: Performance, Accessibility
3. Device: Mobile
4. "Analyze page load" 클릭

# 목표:
# - Performance: >90
# - Accessibility: >90
# - TTI: <5 seconds
```

## 📖 개발 가이드

### 새 페이지 추가

```javascript
// 1. js/app-pages.js에 페이지 템플릿 추가
app.pages['new-page'] = `
    <div class="page-content">
        <h2>새 페이지</h2>
        <!-- 페이지 내용 -->
    </div>
`;

// 2. index.html 사이드 메뉴에 추가
<a href="#" class="menu-item" data-page="new-page">
    <i class="fas fa-icon"></i>
    <span>새 페이지</span>
</a>

// 3. 초기화 함수 (선택사항)
app.initNewPage = function() {
    console.log('새 페이지 초기화');
    // 초기화 로직
};
```

### 새 모달 추가

```javascript
app.showModalEnhanced('my-modal', {
    title: '모달 제목',
    icon: 'fas fa-info-circle',
    content: `
        <div class="modal-content">
            <p>모달 내용</p>
        </div>
    `,
    confirmText: '확인',
    onConfirm: () => {
        console.log('확인 클릭');
    }
});
```

### 스타일 커스터마이징

```css
/* styles/custom.css 생성 */

/* KRDS 색상 변수 오버라이드 */
:root {
    --krds-primary: #003d7a;    /* 메인 색상 */
    --krds-secondary: #0056b3;  /* 강조 색상 */
}

/* 커스텀 스타일 */
.my-component {
    background: var(--krds-primary);
    color: white;
}
```

## 🐛 트러블슈팅

### QR 코드가 생성되지 않음

```javascript
// 1. QRious CDN 로드 확인
console.log(typeof QRious); // "function"이어야 함

// 2. DID 식별자 확인
console.log(app.memberData.didIdentifier);

// 3. 수동 재생성
app.qrCodeGenerated = false;
app.flipCard(); // 카드 뒤집기
```

### 블록체인 배지가 표시되지 않음

```javascript
// 1. 데이터 확인
console.log(app.memberData.blockchainVerification);

// 2. 수동 표시
app.displayBlockchainBadge();
```

### localStorage 용량 초과

```javascript
// 캐시 정리
localStorage.clear();
location.reload();

// 또는 QR 캐시만 삭제
delete app.memberData.qrCode.qrCodeDataUrl;
app.updateMemberData();
```

## 📚 추가 문서

- **[CLAUDE.md](CLAUDE.md)** - 개발 가이드 (영문)
- **[specs/001-digital-member-id/](specs/001-digital-member-id/)** - 디지털 의원증 상세 스펙
  - `spec.md` - 기능 명세서
  - `plan.md` - 구현 계획
  - `tasks.md` - 작업 목록 (73/97 완료)
  - `IMPLEMENTATION-SUMMARY.md` - 구현 요약
  - `TEST-REPORT.md` - 테스트 보고서

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 메시지 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 업무 수정, 패키지 매니저 수정
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👥 개발팀

**경기도의회 디지털혁신팀**

- 프로젝트 관리자: [이름]
- 기술 책임자: [이름]
- UI/UX 디자이너: [이름]
- 프론트엔드 개발: [이름]

## 📞 문의

- **Email**: digital@gg.go.kr
- **Website**: https://council.gg.go.kr
- **Issues**: https://github.com/sang-woon/mobile-ggc-council/issues

## 🙏 감사의 말

- [QRious](https://github.com/neocotic/qrious) - QR 코드 생성
- [Chart.js](https://www.chartjs.org/) - 데이터 시각화
- [FullCalendar](https://fullcalendar.io/) - 일정 관리
- [Font Awesome](https://fontawesome.com/) - 아이콘
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크

---

**© 2025 경기도의회. All rights reserved.**

Made with ❤️ by Gyeonggi Provincial Council Digital Innovation Team
