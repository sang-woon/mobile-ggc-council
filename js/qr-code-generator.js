// QR Code Generator - Digital Member ID Card
// Phase 4: User Story 2 - QR Code Generation (P2)
// Constitution Principle II: KRDS Design System Compliance

(function() {
    'use strict';

    /**
     * Generate Member QR Code (T038, T039, T040, T041)
     * Creates scannable QR code with DID-based verification URL
     * @returns {boolean} Success status of QR code generation
     */
    window.app.generateMemberQRCode = function() {
        console.log('📱 QR 코드 생성 시작...');

        try {
            // T051: Validate DID identifier exists
            if (!this.memberData || !this.memberData.didIdentifier) {
                console.error('❌ DID 식별자가 없습니다');
                this.showQRError('DID 식별자를 찾을 수 없습니다');
                return false;
            }

            // T052: Check canvas element exists
            const canvas = document.getElementById('qrcode');
            if (!canvas) {
                console.error('❌ QR 코드 캔버스를 찾을 수 없습니다');
                return false;
            }

            // T040: Build verification URL
            const didIdentifier = this.memberData.didIdentifier;
            const verificationUrl = `https://council.gg.go.kr/verify/${didIdentifier}`;
            console.log('🔗 검증 URL:', verificationUrl);

            // T039, T041: Initialize QRious with KRDS colors
            const qr = new QRious({
                element: canvas,
                value: verificationUrl,
                size: 250,                          // T039: 250px for high resolution
                level: 'M',                         // T039: Medium error correction
                foreground: '#003d7a',              // T041: KRDS primary blue
                background: '#ffffff',              // T041: White background for contrast
                padding: 0
            });

            // T042: Cache QR code data
            const qrCodeDataUrl = canvas.toDataURL('image/png');
            this.memberData.qrCode = {
                verificationUrl: verificationUrl,
                generatedTimestamp: new Date().toISOString(),
                errorCorrectionLevel: 'M',
                qrCodeDataUrl: qrCodeDataUrl
            };

            // T053: Persist to localStorage
            this.updateMemberData();

            console.log('✅ QR 코드 생성 완료');
            console.log('📊 캐시 저장:', this.memberData.qrCode);

            return true;

        } catch (error) {
            // T049: Error handling
            console.error('❌ QR 코드 생성 오류:', error);
            this.showQRError('QR 코드 생성 중 오류가 발생했습니다');
            return false;
        }
    };

    /**
     * Show QR Error Message (T048)
     * Displays user-friendly error with retry option
     * @param {string} message - Error message to display
     */
    window.app.showQRError = function(message) {
        console.log('⚠️ QR 오류 표시:', message);

        const qrSection = document.querySelector('.qr-section');
        if (!qrSection) return;

        qrSection.innerHTML = `
            <div class="qr-error-container">
                <div class="qr-error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p class="qr-error-message">${message}</p>
                <button class="qr-retry-button" onclick="app.retryQRGeneration()">
                    <i class="fas fa-redo"></i>
                    <span>다시 시도</span>
                </button>
            </div>
        `;
    };

    /**
     * Retry QR Generation (T050)
     * Resets generation flag and attempts QR code creation again
     */
    window.app.retryQRGeneration = function() {
        console.log('🔄 QR 코드 재생성 시도...');

        // Reset generation flag
        this.qrCodeGenerated = false;

        // Restore QR section HTML
        const qrSection = document.querySelector('.qr-section');
        if (qrSection) {
            qrSection.innerHTML = `
                <canvas id="qrcode" width="250" height="250"></canvas>
                <p class="qr-label">QR 코드로 신원 확인</p>
            `;
        }

        // Attempt generation
        setTimeout(() => {
            this.generateMemberQRCode();
        }, 100);
    };

    /**
     * Update Member Data to localStorage (T053)
     * Persists member data including QR cache
     */
    window.app.updateMemberData = function() {
        try {
            localStorage.setItem('memberData', JSON.stringify(this.memberData));
            console.log('💾 의원 데이터 저장 완료');
        } catch (error) {
            console.error('❌ 데이터 저장 실패:', error);
        }
    };

    /**
     * Enhanced flipCard with Lazy QR Loading (T043, T044)
     * Override existing flipCard to add QR generation on first back flip
     */
    const originalFlipCard = window.app.flipCard;
    window.app.flipCard = function() {
        console.log('🔄 카드 뒤집기 시작 (QR 통합)...');

        // Call original flip function
        if (originalFlipCard) {
            originalFlipCard.call(this);
        }

        const card = document.getElementById('digitalIDCard') || document.getElementById('idCardFlipper');
        if (!card) return;

        const isFlipped = card.classList.contains('flipped');

        // T043: Lazy loading - Generate QR only on first flip to back
        if (isFlipped && !this.qrCodeGenerated) {
            console.log('🎯 첫 번째 뒷면 전환 - QR 생성 시작');

            // T044: 300ms delay for smooth UX after flip animation
            setTimeout(() => {
                if (typeof this.generateMemberQRCode === 'function') {
                    const success = this.generateMemberQRCode();
                    if (success) {
                        this.qrCodeGenerated = true;
                        console.log('✅ QR 코드 지연 로딩 완료');
                    }
                } else {
                    console.warn('⚠️ generateMemberQRCode 함수 미구현');
                }
            }, 300);
        }
    };

    // Initialize QR generation flag
    window.app.qrCodeGenerated = false;

    console.log('✅ qr-code-generator.js 로드 완료');
})();
