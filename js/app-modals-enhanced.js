// Enhanced Modal System with Improved Design
Object.assign(window.app, {
    // Enhanced Modal Show Function
    showModalEnhanced: function(modalId, options = {}) {
        // 002-dashboard-bug-fixes US2: Prevent duplicate modal rendering with debouncing

        // T019: Clear any pending modal spawning timeout
        if (this.modalDebounceTimeout) {
            clearTimeout(this.modalDebounceTimeout);
            console.log('📋 Modal debounce: Cleared previous timeout');
        }

        // T019: Set 200ms debounce to prevent rapid-click duplicate spawning
        this.modalDebounceTimeout = setTimeout(() => {
            console.log('📋 Modal opening:', modalId);

            // T018: Check if modal already exists - close it first
            if (this.currentModal) {
                console.log('📋 Modal exists: Closing current modal before opening new one');
                this.closeModalEnhanced();
            }

            // T018: Track current modal ID
            this.currentModal = modalId;

            this._createModalDOM(modalId, options);
        }, 200);
    },

    // Separate DOM creation logic for cleaner code
    _createModalDOM: function(modalId, options = {}) {
        // 기존 모달 제거 (defensive cleanup)
        this.closeModalEnhanced();
        
        // 모달 백드롭 생성
        const backdrop = document.createElement('div');
        backdrop.id = 'modal-backdrop';
        backdrop.className = 'modal-backdrop';
        
        // 모달 컨테이너 생성
        const container = document.createElement('div');
        container.className = 'modal-container';
        
        // 모달 헤더
        let headerHTML = '';
        if (options.title) {
            const icon = options.icon || 'fas fa-info-circle';
            headerHTML = `
                <div class="modal-header">
                    <div class="modal-title">
                        <i class="${icon}"></i>
                        <span>${options.title}</span>
                    </div>
                    <button class="modal-close-btn" onclick="app.closeModalEnhanced()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }
        
        // 모달 바디
        const bodyHTML = `
            <div class="modal-body">
                ${options.content || ''}
            </div>
        `;
        
        // 모달 푸터 (선택적)
        let footerHTML = '';
        if (options.footer !== false && (options.confirmText || options.cancelText)) {
            footerHTML = `
                <div class="modal-footer" style="padding: 16px 24px; border-top: 1px solid #e5e7eb; display: flex; gap: 12px; justify-content: flex-end;">
                    ${options.cancelText ? `
                        <button onclick="app.closeModalEnhanced()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                            ${options.cancelText}
                        </button>
                    ` : ''}
                    ${options.confirmText ? `
                        <button onclick="${options.onConfirm || 'app.closeModalEnhanced()'}" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            ${options.confirmText}
                        </button>
                    ` : ''}
                </div>
            `;
        }
        
        container.innerHTML = headerHTML + bodyHTML + footerHTML;
        backdrop.appendChild(container);
        document.body.appendChild(backdrop);
        
        // 바디 스크롤 방지
        document.body.style.overflow = 'hidden';
        
        // 백드롭 클릭으로 닫기
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                this.closeModalEnhanced();
            }
        });
        
        // ESC 키로 닫기 (T021: Store handler for proper cleanup)
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModalEnhanced();
            }
        };

        // T021: Store Escape handler reference for later removal
        this.currentModalEscHandler = escHandler;
        document.addEventListener('keydown', escHandler);
    },

    // Enhanced Modal Close Function (T020-T022: Complete cleanup)
    closeModalEnhanced: function() {
        console.log('📋 Modal closing: Starting cleanup');

        // T020: Remove ALL modal DOM elements completely
        const backdrop = document.getElementById('modal-backdrop');
        if (backdrop) {
            backdrop.remove();
            console.log('📋 Modal cleanup: Removed modal-backdrop');
        }

        // T020: Remove all legacy modal elements (for compatibility)
        const oldModal = document.getElementById('dynamic-modal');
        if (oldModal) {
            oldModal.remove();
            console.log('📋 Modal cleanup: Removed legacy dynamic-modal');
        }

        // T020: Remove any .mobile-modal-container elements
        const mobileModals = document.querySelectorAll('.mobile-modal-container');
        if (mobileModals.length > 0) {
            mobileModals.forEach(modal => modal.remove());
            console.log(`📋 Modal cleanup: Removed ${mobileModals.length} mobile-modal-container(s)`);
        }

        // T020: Remove any .modal-overlay elements
        const overlays = document.querySelectorAll('.modal-overlay');
        if (overlays.length > 0) {
            overlays.forEach(overlay => overlay.remove());
            console.log(`📋 Modal cleanup: Removed ${overlays.length} modal-overlay(s)`);
        }

        // T021: Remove Escape key event listener to prevent memory leaks
        if (this.currentModalEscHandler) {
            document.removeEventListener('keydown', this.currentModalEscHandler);
            this.currentModalEscHandler = null;
            console.log('📋 Modal cleanup: Removed Escape key listener');
        }

        // T022: Clear currentModal state
        if (this.currentModal) {
            console.log('📋 Modal cleanup: Clearing currentModal state:', this.currentModal);
            this.currentModal = null;
        }

        // Clear debounce timeout if exists
        if (this.modalDebounceTimeout) {
            clearTimeout(this.modalDebounceTimeout);
            this.modalDebounceTimeout = null;
        }

        // Restore body scroll
        document.body.style.overflow = '';
        console.log('📋 Modal cleanup: Complete');
    },
    
    // 출석 상세 모달 (개선된 디자인) - attendance-detail.js로 이동됨
    showAttendanceDetailEnhanced: function(date, type, session) {
        // attendance-detail.js의 showAttendanceDetail 함수 사용
        if (this.showAttendanceDetail) {
            this.showAttendanceDetail(date);
        } else {
            console.error('showAttendanceDetail 함수를 찾을 수 없습니다.');
        }
    },
    
    // 법안 상세 모달 (개선된 디자인)
    showBillDetailEnhanced: function(billId) {
        const bill = DataManager.billData.bills.find(b => b.id === billId) || DataManager.billData.bills[0];
        
        const statusConfig = {
            pending: { text: '심사중', class: 'bill-status-pending', icon: 'fa-hourglass-half' },
            passed: { text: '가결', class: 'bill-status-passed', icon: 'fa-check' },
            rejected: { text: '부결', class: 'bill-status-rejected', icon: 'fa-times' }
        };
        
        const status = statusConfig[bill.status];
        
        const content = `
            <div class="bill-detail-header">
                <div class="bill-status-badge ${status.class}">
                    <i class="fas ${status.icon}"></i>
                    <span>${status.text}</span>
                </div>
                <div class="bill-title">${bill.title}</div>
                <div class="bill-meta">
                    <div class="bill-meta-item">
                        <i class="far fa-calendar"></i>
                        <span>${bill.date}</span>
                    </div>
                    <div class="bill-meta-item">
                        <i class="fas fa-users"></i>
                        <span>공동발의 ${bill.coSponsors}명</span>
                    </div>
                    <div class="bill-meta-item">
                        <i class="fas fa-building"></i>
                        <span>${bill.committee}</span>
                    </div>
                </div>
            </div>
            
            <div class="bill-content-section">
                <div class="bill-section-title">
                    <i class="fas fa-file-alt text-blue-500"></i>
                    법안 개요
                </div>
                <div class="bill-section-content">
                    본 법안은 경기도민의 삶의 질 향상과 지역 발전을 위해 발의되었습니다.
                    주요 내용으로는 청년 주거 안정 지원, 교육 환경 개선, 중소기업 지원 강화 등이 포함되어 있습니다.
                </div>
            </div>
            
            <div class="bill-content-section">
                <div class="bill-section-title">
                    <i class="fas fa-users text-green-500"></i>
                    공동발의자 (${bill.coSponsors}명)
                </div>
                <div class="cosponsors-grid">
                    ${Array.from({length: Math.min(bill.coSponsors, 8)}, (_, i) => `
                        <div class="cosponsor-card">
                            <div class="cosponsor-avatar">의원${i+1}</div>
                            <div class="cosponsor-name">의원 ${i+1}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${bill.status === 'passed' ? `
                <div class="bill-content-section">
                    <div class="bill-section-title">
                        <i class="fas fa-gavel text-purple-500"></i>
                        처리 결과
                    </div>
                    <div class="bill-section-content">
                        <div class="text-green-600 font-semibold">✓ ${bill.passedDate} 원안가결</div>
                        <p class="mt-2">본회의 표결 결과: 찬성 45명, 반대 3명, 기권 2명</p>
                    </div>
                </div>
            ` : ''}
        `;
        
        this.showModalEnhanced('billDetail', {
            title: '법안 상세 정보',
            icon: 'fas fa-file-contract',
            content: content,
            confirmText: '확인'
        });
    },
    
    // 민원 상세 모달 (개선된 디자인)
    showCivilDetailEnhanced: function(civilId) {
        const civil = DataManager.civilData.complaints.find(c => c.id === civilId) || DataManager.civilData.complaints[0];
        
        const priorityConfig = {
            high: { text: '긴급', class: 'priority-high-ribbon' },
            medium: { text: '보통', class: 'priority-medium-ribbon' },
            low: { text: '일반', class: 'priority-low-ribbon' }
        };
        
        const priority = priorityConfig[civil.priority];
        
        const content = `
            <div class="civil-detail-header">
                <div class="civil-priority-ribbon ${priority.class}">${priority.text}</div>
                <div class="bill-title">${civil.title}</div>
                <div class="bill-meta">
                    <div class="bill-meta-item">
                        <i class="far fa-calendar"></i>
                        <span>${civil.date}</span>
                    </div>
                    <div class="bill-meta-item">
                        <i class="fas fa-tag"></i>
                        <span>${civil.category}</span>
                    </div>
                    <div class="bill-meta-item">
                        <i class="fas fa-user"></i>
                        <span>${civil.requester}</span>
                    </div>
                </div>
            </div>
            
            <div class="bill-content-section">
                <div class="bill-section-title">
                    <i class="fas fa-history text-blue-500"></i>
                    처리 현황
                </div>
                <div class="civil-timeline">
                    <div class="timeline-item">
                        <div class="timeline-dot completed"></div>
                        <div class="timeline-content">
                            <div class="timeline-date">${civil.date}</div>
                            <div class="timeline-title">민원 접수</div>
                            <div class="timeline-description">
                                ${civil.requester}로부터 민원이 접수되었습니다.
                            </div>
                        </div>
                    </div>
                    
                    ${civil.status !== 'pending' ? `
                        <div class="timeline-item">
                            <div class="timeline-dot completed"></div>
                            <div class="timeline-content">
                                <div class="timeline-date">${civil.date}</div>
                                <div class="timeline-title">담당자 배정</div>
                                <div class="timeline-description">
                                    민원 처리 담당자가 배정되어 검토를 시작했습니다.
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${civil.status === 'completed' ? `
                        <div class="timeline-item">
                            <div class="timeline-dot completed"></div>
                            <div class="timeline-content">
                                <div class="timeline-date">${civil.responseDate}</div>
                                <div class="timeline-title">처리 완료</div>
                                <div class="timeline-description">
                                    ${civil.response || '민원이 성공적으로 처리되었습니다.'}
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <div class="timeline-date">예정일: ${civil.deadline || '2025.01.25'}</div>
                                <div class="timeline-title">처리 예정</div>
                                <div class="timeline-description">
                                    현재 검토 중이며, 곧 답변 드리겠습니다.
                                </div>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        this.showModalEnhanced('civilDetail', {
            title: '민원 상세 정보',
            icon: 'fas fa-envelope-open-text',
            content: content,
            confirmText: '확인'
        });
    },
    
    // 통계 모달 (개선된 디자인)
    showStatisticsEnhanced: function() {
        const stats = {
            attendance: DataManager.calculateOverallAttendance(),
            bills: DataManager.billData,
            civil: DataManager.civilData,
            speeches: DataManager.speechData
        };
        
        const content = `
            <div class="stats-modal-grid">
                <div class="stat-card-enhanced">
                    <div class="stat-icon-large bg-blue-100 text-blue-600">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="stat-value-large">${stats.attendance}%</div>
                    <div class="stat-label-enhanced">전체 출석률</div>
                    <div class="stat-trend trend-positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+2.3%</span>
                    </div>
                </div>
                
                <div class="stat-card-enhanced">
                    <div class="stat-icon-large bg-green-100 text-green-600">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="stat-value-large">${stats.bills.total}</div>
                    <div class="stat-label-enhanced">발의 법안</div>
                    <div class="stat-trend trend-positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+5건</span>
                    </div>
                </div>
                
                <div class="stat-card-enhanced">
                    <div class="stat-icon-large bg-orange-100 text-orange-600">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-value-large">${stats.civil.responseRate}%</div>
                    <div class="stat-label-enhanced">민원 처리율</div>
                    <div class="stat-trend trend-positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+1.2%</span>
                    </div>
                </div>
                
                <div class="stat-card-enhanced">
                    <div class="stat-icon-large bg-purple-100 text-purple-600">
                        <i class="fas fa-microphone"></i>
                    </div>
                    <div class="stat-value-large">${stats.speeches.total}</div>
                    <div class="stat-label-enhanced">발언 횟수</div>
                    <div class="stat-trend trend-positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>+3회</span>
                    </div>
                </div>
            </div>
            
            <div class="bill-content-section">
                <div class="bill-section-title">
                    <i class="fas fa-chart-line text-blue-500"></i>
                    월별 활동 추이
                </div>
                <div style="height: 200px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    <canvas id="statsChart" style="max-height: 180px;"></canvas>
                </div>
            </div>
        `;
        
        this.showModalEnhanced('statistics', {
            title: '의정활동 통계',
            icon: 'fas fa-chart-bar',
            content: content,
            confirmText: '확인'
        });
        
        // 차트 초기화
        setTimeout(() => {
            const canvas = document.getElementById('statsChart');
            if (canvas && window.Chart) {
                new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: DataManager.monthlyStats.labels,
                        datasets: [{
                            label: '활동 건수',
                            data: DataManager.monthlyStats.data,
                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }
        }, 100);
    }
});

// 기존 함수들을 개선된 버전으로 교체
window.app.showAttendanceDetail = window.app.showAttendanceDetailEnhanced;
window.app.showStatistics = window.app.showStatisticsEnhanced;

// showActivityDetail 함수 개선
window.app.showActivityDetailEnhanced = function(type, id) {
    switch(type) {
        case 'speech':
            // 발언 상세 모달
            const speech = DataManager.speechData.speeches[id - 1] || DataManager.speechData.speeches[0];
            this.showModalEnhanced('speechDetail', {
                title: '발언 상세 정보',
                icon: 'fas fa-microphone',
                content: `
                    <div class="bill-detail-header" style="background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);">
                        <div class="bill-status-badge" style="background: rgba(139, 92, 246, 0.2); color: #7c3aed;">
                            <i class="fas fa-microphone"></i>
                            <span>${speech.type}</span>
                        </div>
                        <div class="bill-title">${speech.title}</div>
                        <div class="bill-meta">
                            <div class="bill-meta-item">
                                <i class="far fa-calendar"></i>
                                <span>${speech.date}</span>
                            </div>
                            <div class="bill-meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${speech.duration}분</span>
                            </div>
                            <div class="bill-meta-item">
                                <i class="fas fa-eye"></i>
                                <span>조회 ${speech.views}회</span>
                            </div>
                        </div>
                    </div>
                    <div class="bill-content-section">
                        <div class="bill-section-title">
                            <i class="fas fa-quote-left text-purple-500"></i>
                            발언 내용
                        </div>
                        <div class="bill-section-content">
                            경기도의 교육 격차 해소를 위한 종합적인 대책 마련이 시급합니다.
                            특히 농어촌 지역과 도시 지역 간의 교육 인프라 격차를 줄이고,
                            모든 학생들이 동등한 교육 기회를 받을 수 있도록 해야 합니다.
                        </div>
                    </div>
                `,
                confirmText: '확인'
            });
            break;
            
        case 'bill':
            this.showBillDetailEnhanced('B2025-001');
            break;
            
        case 'civil':
            this.showCivilDetailEnhanced('C2025-048');
            break;
    }
};

// 기존 showActivityDetail 교체
window.app.showActivityDetail = window.app.showActivityDetailEnhanced;

// 알림 모달 (개선된 디자인)
window.app.showNotificationsEnhanced = function() {
    const notifications = [
        {
            id: 1,
            type: 'meeting',
            icon: 'fa-calendar',
            iconColor: 'bg-blue-100 text-blue-600',
            title: '교육위원회 정기회의',
            message: '오늘 오후 2시에 교육위원회 정기회의가 예정되어 있습니다.',
            time: '30분 전',
            unread: true,
            action: '참석확인'
        },
        {
            id: 2,
            type: 'bill',
            icon: 'fa-file-alt',
            iconColor: 'bg-green-100 text-green-600',
            title: '법안 심사 완료',
            message: '청년 주거안정 지원 조례안이 상임위를 통과했습니다.',
            time: '2시간 전',
            unread: true,
            action: '상세보기'
        },
        {
            id: 3,
            type: 'civil',
            icon: 'fa-envelope',
            iconColor: 'bg-orange-100 text-orange-600',
            title: '새로운 민원 접수',
            message: '수원시갑 지역구에서 교통안전 관련 민원이 접수되었습니다.',
            time: '3시간 전',
            unread: false,
            action: '처리하기'
        },
        {
            id: 4,
            type: 'speech',
            icon: 'fa-microphone',
            iconColor: 'bg-purple-100 text-purple-600',
            title: '발언 순서 안내',
            message: '내일 본회의에서 5분 자유발언이 예정되어 있습니다.',
            time: '어제',
            unread: false,
            action: '준비하기'
        },
        {
            id: 5,
            type: 'system',
            icon: 'fa-bell',
            iconColor: 'bg-yellow-100 text-yellow-600',
            title: '시스템 공지',
            message: '의정활동 관리시스템이 v2.3으로 업데이트되었습니다.',
            time: '2일 전',
            unread: false,
            action: '확인'
        }
    ];
    
    const unreadCount = notifications.filter(n => n.unread).length;
    
    const content = `
        <div class="mb-4">
            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        ${unreadCount}
                    </div>
                    <span class="text-sm font-medium text-gray-700">읽지 않은 알림</span>
                </div>
                <button class="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    모두 읽음 표시
                </button>
            </div>
        </div>
        
        <div class="notification-list">
            ${notifications.map(notif => `
                <div class="notification-item ${notif.unread ? 'unread' : ''}">
                    <div class="notification-icon ${notif.iconColor}">
                        <i class="fas ${notif.icon}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notif.title}</div>
                        <div class="notification-message">${notif.message}</div>
                        <div class="notification-time">
                            <i class="far fa-clock"></i> ${notif.time}
                        </div>
                    </div>
                    <button class="notification-action" onclick="app.handleNotificationAction(${notif.id})">
                        ${notif.action}
                    </button>
                </div>
            `).join('')}
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-200">
            <button class="w-full py-2 text-center text-sm text-gray-600 hover:text-blue-600 font-medium transition">
                <i class="fas fa-history mr-1"></i>
                이전 알림 보기
            </button>
        </div>
    `;
    
    this.showModalEnhanced('notifications', {
        title: '알림',
        icon: 'fas fa-bell',
        content: content,
        footer: false
    });
};

// 알림 액션 처리
window.app.handleNotificationAction = function(notifId) {
    console.log('알림 액션 처리:', notifId);
    this.closeModalEnhanced();
    // 각 알림 타입에 따른 액션 처리
    switch(notifId) {
        case 1:
            this.navigateTo('attendance');
            break;
        case 2:
            this.showBillDetailEnhanced('B2025-001');
            break;
        case 3:
            this.navigateTo('civil');
            break;
        case 4:
            this.navigateTo('speech');
            break;
        default:
            break;
    }
};

// 기존 showNotifications 교체
window.app.showNotifications = window.app.showNotificationsEnhanced;

// 기존 closeModal도 개선된 버전을 사용
window.app.closeModal = window.app.closeModalEnhanced;