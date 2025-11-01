// Enhanced Digital ID Card JavaScript - 2025.01.18
// 개선된 디지털 신분증 기능
// DID Specification Compliance - Constitution Principle II (KRDS NON-NEGOTIABLE)

(function() {
    'use strict';

    // 디지털 신분증 개선 기능
    Object.assign(window.app, {
        /**
         * Initialize Digital ID Card System (T010)
         * Entry point for DID-based digital member ID card
         */
        initDigitalIDCard: function() {
            console.log('🎴 디지털 의원증 초기화 시작...');

            try {
                // Validate member data before rendering (T032)
                if (!this.validateMemberData || !this.validateMemberData()) {
                    console.error('❌ 의원 데이터 유효성 검증 실패');
                    this.showToast('의원 정보를 불러올 수 없습니다', 'error');
                    return false;
                }

                // Get container element
                const container = document.getElementById('mainContent');
                if (!container) {
                    console.error('❌ 메인 컨테이너를 찾을 수 없음');
                    return false;
                }

                // Render digital ID card (T011)
                if (typeof this.renderDigitalIDCard === 'function') {
                    const cardHTML = this.renderDigitalIDCard();
                    container.innerHTML = cardHTML;
                    console.log('✅ 디지털 의원증 렌더링 완료');

                    // Setup event listeners (T022)
                    if (typeof this.setupCardEventListeners === 'function') {
                        this.setupCardEventListeners();
                        console.log('✅ 카드 이벤트 리스너 설정 완료');
                    }

                    // T075: Display blockchain badge if DID identifier exists
                    if (this.memberData && this.memberData.didIdentifier && typeof this.displayBlockchainBadge === 'function') {
                        setTimeout(() => {
                            this.displayBlockchainBadge();
                        }, 200);  // Small delay for DOM to be ready
                    }

                    // Initialize legacy features (QR, clock, etc.)
                    if (typeof this.initDigitalIdPage === 'function') {
                        this.initDigitalIdPage();
                    }

                    // T088: Screen rotation handling
                    this.setupOrientationHandler();

                    return true;
                } else {
                    console.warn('⚠️ renderDigitalIDCard 함수가 아직 구현되지 않음');
                    return false;
                }

            } catch (error) {
                console.error('❌ 디지털 의원증 초기화 오류:', error);
                this.showToast('디지털 의원증을 불러오는 중 오류가 발생했습니다', 'error');
                return false;
            }
        },

        /**
         * Render Digital ID Card HTML (T011)
         * Generates DID-compliant card structure from app.memberData
         */
        renderDigitalIDCard: function() {
            console.log('🎴 DID 기반 디지털 의원증 HTML 생성...');

            const member = this.memberData;

            // T086-T087: Name and district truncation for long text
            const memberName = member.name && member.name.length > 10
                ? member.name.substring(0, 10) + '...'
                : member.name;
            const memberDistrict = member.district && member.district.length > 20
                ? member.district.substring(0, 20) + '...'
                : member.district;

            // DID credential information
            const didIdentifier = member.didIdentifier || 'did:ggcouncil:' + member.memberId;
            const issuedDate = member.issuedDate ? new Date(member.issuedDate).toLocaleDateString('ko-KR') : '발급일 미상';
            const expiresDate = member.expiresDate ? new Date(member.expiresDate).toLocaleDateString('ko-KR') : '만료일 미상';

            return `
                <div class="digital-id-page">
                    <div class="page-header">
                        <h2 class="page-title">
                            <i class="fas fa-id-card-alt"></i>
                            디지털 의원증
                        </h2>
                        <p class="page-subtitle">DID 기반 블록체인 인증</p>
                    </div>

                    <div class="id-card-container">
                        <div class="id-card-flipper" id="digitalIDCard" role="article" aria-label="디지털 의원증 카드">
                            <!-- Card Front Face (T013-T014, T023 ARIA) -->
                            <div class="id-card-front" role="region" aria-label="디지털 의원증 앞면">
                                <!-- Blockchain Badge (T061 - Phase 5) -->
                                <div class="blockchain-badge-container" id="blockchainBadge"></div>

                                <div class="card-header-enhanced">
                                    <div class="header-logo">
                                        <i class="fas fa-landmark"></i>
                                    </div>
                                    <div class="header-title">경기도의회</div>
                                    <div class="header-subtitle">Gyeonggi Provincial Council</div>
                                </div>

                                <div class="card-body-enhanced">
                                    <div class="member-photo-section">
                                        <img src="${member.photo}"
                                             alt="${member.name}"
                                             class="member-photo-enhanced"
                                             loading="lazy"
                                             onerror="this.src='images/default-avatar.svg'">
                                    </div>

                                    <div class="member-info-section">
                                        <h3 class="member-name-enhanced">${memberName}</h3>
                                        <div class="member-details-enhanced">
                                            <div class="detail-item">
                                                <i class="fas fa-landmark"></i>
                                                <span>${member.party}</span>
                                            </div>
                                            <div class="detail-item">
                                                <i class="fas fa-map-marker-alt"></i>
                                                <span>${memberDistrict}</span>
                                            </div>
                                            <div class="detail-item">
                                                <i class="fas fa-id-card"></i>
                                                <span>${member.memberId}</span>
                                            </div>
                                            <div class="detail-item">
                                                <i class="fas fa-calendar"></i>
                                                <span>${member.generation} · ${member.term}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Card Back Face (T015, T023 ARIA) -->
                            <div class="id-card-back" role="region" aria-label="디지털 의원증 뒷면">
                                <div class="card-header-enhanced">
                                    <div class="header-title">의원 정보</div>
                                </div>

                                <div class="card-body-enhanced">
                                    <div class="committee-section">
                                        <h4 class="section-title">
                                            <i class="fas fa-users"></i>
                                            소속 위원회
                                        </h4>
                                        <div class="committee-list">
                                            ${member.committees.map(c => `
                                                <div class="committee-badge-enhanced">${c}</div>
                                            `).join('')}
                                        </div>
                                    </div>

                                    <div class="qr-section">
                                        <canvas id="qrcode" width="84" height="84"></canvas>
                                        <p class="qr-label">QR 코드로 신원 확인</p>
                                    </div>

                                    <div class="did-info-compact">
                                        <div class="did-field-compact">
                                            <i class="fas fa-fingerprint"></i>
                                            <code class="did-value-compact">${didIdentifier}</code>
                                        </div>
                                        <div class="did-dates">
                                            <span>발급: ${issuedDate}</span>
                                            <span>만료: ${expiresDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Flip Button (T021) -->
                    <div class="card-controls">
                        <button id="flipCardBtn" class="flip-button" onclick="app.flipCard()">
                            <i class="fas fa-sync-alt"></i>
                            <span>카드 뒤집기</span>
                        </button>
                    </div>

                    <!-- DID Information Section -->
                    <div class="did-info-section">
                        <h3 class="section-title">
                            <i class="fas fa-shield-alt"></i>
                            분산 신원 증명 (DID)
                        </h3>
                        <div class="did-details">
                            <div class="did-field">
                                <span class="did-label">DID 식별자</span>
                                <code class="did-value">${didIdentifier}</code>
                            </div>
                            <div class="did-field">
                                <span class="did-label">공개키 (Public Key)</span>
                                <code class="did-value did-value-small">${member.publicKey || '공개키 없음'}</code>
                            </div>
                            <div class="did-field">
                                <span class="did-label">발급일</span>
                                <span class="did-value">${issuedDate}</span>
                            </div>
                            <div class="did-field">
                                <span class="did-label">만료일</span>
                                <span class="did-value">${expiresDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        /**
         * Setup Card Event Listeners (T022)
         * Keyboard accessibility and touch events
         */
        setupCardEventListeners: function() {
            console.log('🎯 DID 카드 이벤트 리스너 설정 중...');

            const flipButton = document.getElementById('flipCardBtn');
            const card = document.getElementById('digitalIDCard');

            if (!flipButton || !card) {
                console.warn('⚠️ 카드 요소를 찾을 수 없음');
                return;
            }

            // Keyboard accessibility (T022)
            flipButton.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.flipCard();
                }
            });

            // Touch event optimization
            flipButton.addEventListener('touchstart', (e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
            });

            flipButton.addEventListener('touchend', (e) => {
                e.currentTarget.style.transform = 'scale(1)';
            });

            console.log('✅ DID 카드 이벤트 리스너 설정 완료');
        },

        // 카드 플립 기능 (Legacy + T019 integration with vibration feedback T020, T089 debouncing)
        flipCard: function() {
            console.log('🔄 카드 뒤집기 시작...');

            // T089: Debouncing to prevent rapid clicks (100ms cooldown)
            if (this._flipCardDebouncing) {
                console.log('⏳ 카드 플립 debouncing 중...');
                return;
            }

            this._flipCardDebouncing = true;
            setTimeout(() => {
                this._flipCardDebouncing = false;
            }, 100);

            // Support both legacy (#idCardFlipper) and new (#digitalIDCard) IDs
            const card = document.getElementById('digitalIDCard') || document.getElementById('idCardFlipper');

            if (!card) {
                console.error('❌ 디지털 ID 카드를 찾을 수 없음');
                return;
            }

            // Toggle flipped class (T019)
            card.classList.toggle('flipped');

            // Vibration feedback for mobile devices (T020)
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
                console.log('✅ 햅틱 피드백 실행');
            }

            const isFlipped = card.classList.contains('flipped');
            console.log('✅ 카드 상태:', isFlipped ? '뒷면' : '앞면');
        },
        
        // NFC 시뮬레이션
        showNFCModal: function() {
            const nfcIndicator = document.getElementById('nfcIndicator');
            if (nfcIndicator) {
                // NFC 애니메이션 표시
                nfcIndicator.classList.add('active');
                
                // 진동 피드백
                if (navigator.vibrate) {
                    navigator.vibrate([100, 50, 100]);
                }
                
                // 3초 후 애니메이션 제거
                setTimeout(() => {
                    nfcIndicator.classList.remove('active');
                    this.showModalEnhanced('nfcSuccess', {
                        title: 'NFC 태그 성공',
                        icon: 'fas fa-check-circle',
                        content: `
                            <div class="text-center py-8">
                                <div class="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-check text-3xl text-green-600"></i>
                                </div>
                                <h3 class="text-lg font-semibold mb-2">신분 확인 완료</h3>
                                <p class="text-sm text-gray-600">NFC 태그로 신원이 확인되었습니다.</p>
                                <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <div class="text-xs text-gray-700">인증 시간</div>
                                    <div class="text-sm font-mono font-semibold">${new Date().toLocaleString('ko-KR')}</div>
                                </div>
                            </div>
                        `,
                        confirmText: '확인'
                    });
                }, 1500);
            }
        },
        
        // 생체 인증
        verifyIdentity: function() {
            this.showModalEnhanced('biometric', {
                title: '생체 인증',
                icon: 'fas fa-fingerprint',
                content: `
                    <div class="text-center py-8">
                        <div class="relative w-32 h-32 mx-auto mb-6">
                            <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                            <div class="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                <i class="fas fa-fingerprint text-5xl text-blue-600"></i>
                            </div>
                        </div>
                        <h3 class="text-lg font-semibold mb-2">지문 인증 중...</h3>
                        <p class="text-sm text-gray-600">홈 버튼에 손가락을 올려주세요</p>
                        <div class="mt-6 space-y-2">
                            <div class="flex items-center justify-center gap-2 text-sm">
                                <i class="fas fa-shield-alt text-green-500"></i>
                                <span>생체 정보는 기기에만 저장됩니다</span>
                            </div>
                        </div>
                    </div>
                `,
                confirmText: '취소'
            });
            
            // 2초 후 자동으로 인증 성공
            setTimeout(() => {
                this.closeModalEnhanced();
                this.showModalEnhanced('biometricSuccess', {
                    title: '인증 성공',
                    icon: 'fas fa-check-circle',
                    content: `
                        <div class="text-center py-6">
                            <div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-check text-2xl text-green-600"></i>
                            </div>
                            <p class="text-gray-700">생체 인증이 완료되었습니다.</p>
                        </div>
                    `,
                    confirmText: '확인'
                });
            }, 2000);
        },
        
        // 디지털 신분증 공유
        shareDigitalId: function() {
            const shareData = {
                title: '경기도의회 디지털 신분증',
                text: '김영수 의원 (의원번호: 2024-0815)',
                url: window.location.href
            };
            
            if (navigator.share) {
                navigator.share(shareData)
                    .then(() => console.log('신분증 공유 성공'))
                    .catch((error) => console.log('공유 실패:', error));
            } else {
                // Web Share API를 지원하지 않는 경우
                this.showModalEnhanced('share', {
                    title: '신분증 공유',
                    icon: 'fas fa-share-alt',
                    content: `
                        <div class="space-y-3">
                            <button class="w-full p-3 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2" onclick="app.shareVia('kakao')">
                                <i class="fas fa-comment"></i> 카카오톡으로 공유
                            </button>
                            <button class="w-full p-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2" onclick="app.shareVia('email')">
                                <i class="fas fa-envelope"></i> 이메일로 공유
                            </button>
                            <button class="w-full p-3 bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2" onclick="app.shareVia('qr')">
                                <i class="fas fa-qrcode"></i> QR 코드 생성
                            </button>
                            <button class="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2" onclick="app.copyLink()">
                                <i class="fas fa-link"></i> 링크 복사
                            </button>
                        </div>
                    `,
                    footer: false
                });
            }
        },
        
        // 공유 방법별 처리
        shareVia: function(method) {
            switch(method) {
                case 'kakao':
                    console.log('카카오톡 공유');
                    alert('카카오톡으로 공유되었습니다.');
                    break;
                case 'email':
                    window.location.href = 'mailto:?subject=경기도의회 디지털 신분증&body=김영수 의원 디지털 신분증';
                    break;
                case 'qr':
                    this.showQRModal();
                    break;
            }
            this.closeModalEnhanced();
        },
        
        // 링크 복사
        copyLink: function() {
            const dummy = document.createElement('input');
            document.body.appendChild(dummy);
            dummy.value = window.location.href;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            
            // 피드백 표시
            const originalText = event.target.innerHTML;
            event.target.innerHTML = '<i class="fas fa-check"></i> 복사 완료!';
            event.target.classList.add('bg-green-500', 'text-white');
            
            setTimeout(() => {
                event.target.innerHTML = originalText;
                event.target.classList.remove('bg-green-500', 'text-white');
            }, 2000);
        },
        
        // QR 모달 표시
        showQRModal: function() {
            this.showModalEnhanced('qrShare', {
                title: 'QR 코드 공유',
                icon: 'fas fa-qrcode',
                content: `
                    <div class="text-center py-6">
                        <div class="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg">
                            <canvas id="shareQR"></canvas>
                        </div>
                        <p class="mt-4 text-sm text-gray-600">QR 코드를 스캔하여 디지털 신분증을 확인하세요</p>
                    </div>
                `,
                confirmText: '닫기'
            });
            
            // QR 코드 생성
            setTimeout(() => {
                const qr = new QRious({
                    element: document.getElementById('shareQR'),
                    value: window.location.href,
                    size: 200
                });
            }, 100);
        },
        
        // Apple Wallet에 추가
        addToWallet: function() {
            this.showModalEnhanced('wallet', {
                title: 'Apple Wallet에 추가',
                icon: 'fab fa-apple',
                content: `
                    <div class="text-center py-6">
                        <div class="w-20 h-20 mx-auto mb-4 bg-black rounded-2xl flex items-center justify-center">
                            <i class="fab fa-apple text-3xl text-white"></i>
                        </div>
                        <h3 class="text-lg font-semibold mb-2">Wallet에 추가 중...</h3>
                        <p class="text-sm text-gray-600">디지털 신분증을 Apple Wallet에 추가합니다</p>
                        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div class="text-xs text-gray-500 mb-2">추가될 정보</div>
                            <ul class="text-sm text-left space-y-1">
                                <li>• 의원 정보 및 사진</li>
                                <li>• 디지털 인증 QR 코드</li>
                                <li>• 유효기간 정보</li>
                            </ul>
                        </div>
                    </div>
                `,
                confirmText: '추가하기',
                cancelText: '취소'
            });
        },
        
        // 전화 걸기
        makeCall: function(number) {
            if (confirm(`${number}로 전화를 거시겠습니까?`)) {
                window.location.href = `tel:${number}`;
            }
        },
        
        // 디지털 서명 검증
        verifySignature: function() {
            this.showModalEnhanced('signature', {
                title: '디지털 서명 검증',
                icon: 'fas fa-certificate',
                content: `
                    <div class="space-y-4">
                        <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div class="flex items-center gap-3 mb-2">
                                <i class="fas fa-check-circle text-green-600 text-xl"></i>
                                <span class="font-semibold text-green-800">서명 유효</span>
                            </div>
                            <p class="text-sm text-green-700">디지털 서명이 검증되었습니다.</p>
                        </div>
                        
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between py-2 border-b">
                                <span class="text-gray-600">서명자</span>
                                <span class="font-medium">김영수 의원</span>
                            </div>
                            <div class="flex justify-between py-2 border-b">
                                <span class="text-gray-600">서명 날짜</span>
                                <span class="font-medium">2025.01.18</span>
                            </div>
                            <div class="flex justify-between py-2 border-b">
                                <span class="text-gray-600">인증 기관</span>
                                <span class="font-medium">경기도의회</span>
                            </div>
                            <div class="flex justify-between py-2">
                                <span class="text-gray-600">해시값</span>
                                <span class="font-mono text-xs">SHA256: 7f3b9d2a...</span>
                            </div>
                        </div>
                    </div>
                `,
                confirmText: '확인'
            });
        },
        
        // QR 코드 업데이트 (기존 함수 개선)
        updateQRCode: function() {
            const qrCanvas = document.getElementById('qrcode');
            if (qrCanvas && window.QRious) {
                const memberData = {
                    name: '김영수',
                    id: '2024-0815',
                    position: '경기도의회 의원',
                    timestamp: new Date().toISOString()
                };
                
                const qr = new QRious({
                    element: qrCanvas,
                    value: JSON.stringify(memberData),
                    size: 84, // 컨테이너에 맞게 크기 조정
                    level: 'M',
                    background: 'white',
                    foreground: '#003d7a'
                });
            }
        },
        
        // 실시간 시계 업데이트 (페이지 로드 시 호출)
        startDigitalClock: function() {
            const updateClock = () => {
                const now = new Date();
                const timeElement = document.getElementById('current-time');
                if (timeElement) {
                    timeElement.textContent = now.toLocaleTimeString('ko-KR');
                }
                
                // 마지막 인증 시간 업데이트
                const authElement = document.getElementById('last-auth');
                if (authElement) {
                    const lastAuth = localStorage.getItem('lastAuthTime');
                    if (lastAuth) {
                        const diff = Date.now() - parseInt(lastAuth);
                        const minutes = Math.floor(diff / 60000);
                        if (minutes < 1) {
                            authElement.textContent = '방금 전';
                        } else if (minutes < 60) {
                            authElement.textContent = `${minutes}분 전`;
                        } else {
                            authElement.textContent = `${Math.floor(minutes / 60)}시간 전`;
                        }
                    }
                }
            };
            
            updateClock();
            setInterval(updateClock, 1000);
        },
        
        // 디지털 신분증 페이지 초기화
        initDigitalIdPage: function() {
            // QR 코드 생성
            this.updateQRCode();
            
            // 실시간 시계 시작
            this.startDigitalClock();
            
            // 터치 이벤트 최적화 (모바일)
            const flipper = document.getElementById('idCardFlipper');
            if (flipper) {
                let startX = 0;
                flipper.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                }, { passive: true });
                
                flipper.addEventListener('touchend', (e) => {
                    const endX = e.changedTouches[0].clientX;
                    const diff = endX - startX;
                    
                    // 스와이프로 카드 플립
                    if (Math.abs(diff) > 50) {
                        this.flipCard();
                    }
                }, { passive: true });
            }
            
            // 현재 시간으로 인증 시간 저장
            localStorage.setItem('lastAuthTime', Date.now().toString());
        }
    });
    
    /**
     * Display Blockchain Badge (T062-T068 - Phase 5)
     * Shows verification status badge with appropriate styling and icons
     */
    window.app.displayBlockchainBadge = function() {
        console.log('🔐 블록체인 배지 표시 시작...');

        // T076: Validation check for blockchainVerification existence
        if (!this.memberData || !this.memberData.blockchainVerification) {
            console.warn('⚠️ 블록체인 검증 데이터가 없습니다');
            return;
        }

        const badgeContainer = document.getElementById('blockchainBadge');

        // T077: Graceful fallback if badge element not found
        if (!badgeContainer) {
            console.warn('⚠️ 블록체인 배지 컨테이너를 찾을 수 없습니다');
            return;
        }

        const verification = this.memberData.blockchainVerification;
        const status = verification.status || 'unavailable';

        let badgeHTML = '';

        // T062-T065: Switch statement for status handling
        switch (status) {
            case 'verified':
                // T063: Verified status UI
                badgeHTML = `
                    <div class="blockchain-badge verified" onclick="app.showVerificationDetails()">
                        <i class="fas fa-check-circle"></i>
                        <span class="badge-text">블록체인 인증됨</span>
                    </div>
                `;
                break;

            case 'pending':
                // T064: Pending status UI
                badgeHTML = `
                    <div class="blockchain-badge pending">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span class="badge-text">인증 확인 중...</span>
                    </div>
                `;
                break;

            case 'unavailable':
            default:
                // T065: Unavailable status UI
                badgeHTML = `
                    <div class="blockchain-badge unavailable">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span class="badge-text">인증 확인 불가</span>
                    </div>
                `;
                break;
        }

        badgeContainer.innerHTML = badgeHTML;

        // T078: Console logging with emoji marker
        console.log('🔐 블록체인 배지 표시 완료:', status);
    };

    /**
     * Show Verification Details Modal (T069-T074 - Phase 5)
     * Displays detailed blockchain verification information
     */
    window.app.showVerificationDetails = function() {
        console.log('🔐 검증 상세 정보 표시...');

        if (!this.memberData || !this.memberData.blockchainVerification) {
            console.warn('⚠️ 블록체인 검증 데이터가 없습니다');
            return;
        }

        const verification = this.memberData.blockchainVerification;

        // T071: Format transaction hash to shortened format
        const txHashShort = verification.txHash
            ? `${verification.txHash.substring(0, 10)}...${verification.txHash.substring(62)}`
            : '없음';

        // T072: Format verification timestamp to Korean locale
        const verifiedAtFormatted = verification.verifiedAt
            ? new Date(verification.verifiedAt).toLocaleString('ko-KR')
            : '없음';

        // T073: Implement modal HTML structure with centered icon
        const modalHTML = `
            <div class="verification-modal-content">
                <div class="verification-icon">
                    <div class="icon-circle">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
                <h3 class="verification-title">검증 완료</h3>

                <div class="verification-details">
                    <div class="detail-section">
                        <div class="detail-label">트랜잭션 해시</div>
                        <div class="detail-value">${txHashShort}</div>
                    </div>
                    <div class="detail-section">
                        <div class="detail-label">블록 번호</div>
                        <div class="detail-value">${verification.blockNumber || '없음'}</div>
                    </div>
                    <div class="detail-section">
                        <div class="detail-label">검증 시간</div>
                        <div class="detail-value">${verifiedAtFormatted}</div>
                    </div>
                </div>
            </div>
        `;

        // Use existing modal system
        if (typeof this.showModalEnhanced === 'function') {
            this.showModalEnhanced('verification', {
                title: '',  // Title is in modalHTML
                content: modalHTML,
                confirmText: '확인'
            });
        } else {
            // Fallback to basic alert
            alert(`검증 완료\n\n트랜잭션: ${txHashShort}\n블록: ${verification.blockNumber}\n시간: ${verifiedAtFormatted}`);
        }

        console.log('🔐 검증 상세 정보 모달 표시 완료');
    };

    /**
     * Setup Orientation Handler (T088 - Phase 6)
     * Reflow card layout on screen rotation
     */
    window.app.setupOrientationHandler = function() {
        if (!window.matchMedia) return;

        const handleOrientationChange = () => {
            console.log('📱 화면 방향 변경 감지');

            // Get card element
            const card = document.getElementById('digitalIDCard') || document.getElementById('idCardFlipper');
            if (!card) return;

            // Force reflow by temporarily hiding and showing
            card.style.visibility = 'hidden';
            setTimeout(() => {
                card.style.visibility = 'visible';
                console.log('✅ 카드 레이아웃 재계산 완료');
            }, 50);
        };

        // Listen for orientation changes
        window.matchMedia('(orientation: portrait)').addEventListener('change', handleOrientationChange);
        window.matchMedia('(orientation: landscape)').addEventListener('change', handleOrientationChange);

        console.log('✅ 화면 방향 변경 핸들러 설정 완료');
    };

    /**
     * Enhanced updateMemberData with Quota Exceeded Handling (T085 - Phase 6)
     * Overrides existing updateMemberData with error handling
     */
    const originalUpdateMemberData = window.app.updateMemberData;
    window.app.updateMemberData = function() {
        try {
            localStorage.setItem('memberData', JSON.stringify(this.memberData));
            console.log('💾 의원 데이터 저장 완료');
        } catch (error) {
            // T085: localStorage quota exceeded error handling
            if (error.name === 'QuotaExceededError' || error.code === 22) {
                console.error('❌ localStorage 용량 초과:', error);

                // Show user-friendly notification
                if (typeof this.showToast === 'function') {
                    this.showToast('저장 공간이 부족합니다. 캐시를 정리하시겠습니까?', 'warning');
                } else {
                    alert('저장 공간이 부족합니다. 브라우저 캐시를 정리해주세요.');
                }

                // Try to clear old QR cache data
                try {
                    if (this.memberData.qrCode) {
                        delete this.memberData.qrCode.qrCodeDataUrl;
                        localStorage.setItem('memberData', JSON.stringify(this.memberData));
                        console.log('✅ QR 캐시 정리 후 재시도 성공');
                    }
                } catch (retryError) {
                    console.error('❌ 재시도 실패:', retryError);
                }
            } else {
                console.error('❌ 데이터 저장 실패:', error);
            }
        }
    };

    // 페이지 로드 시 디지털 신분증 초기화 (T031)
    const originalLoadPage = window.app.loadPage;
    window.app.loadPage = function(pageName) {
        originalLoadPage.call(this, pageName);

        if (pageName === 'digital-id') {
            setTimeout(() => {
                console.log('🎴 digital-id 페이지 로드 감지 - DID 초기화 시작');
                // Call new DID-compliant initialization (T031)
                if (typeof this.initDigitalIDCard === 'function') {
                    this.initDigitalIDCard();
                } else {
                    // Fallback to legacy initialization
                    console.warn('⚠️ initDigitalIDCard 미구현 - 레거시 초기화 사용');
                    this.initDigitalIdPage();
                }
            }, 100);
        }
    };

    console.log('✅ digital-id-enhanced.js 로드 완료 - DID 시스템 준비');
})();