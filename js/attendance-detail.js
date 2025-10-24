// 출석 상세 정보 모달 - 2025.01.24
// Attendance Detail Modal Implementation

(function() {
    'use strict';

    // 회의 유형별 정보
    const MEETING_INFO = {
        plenary: {
            name: '본회의',
            location: '경기도의회 본회의장',
            icon: 'fa-landmark',
            color: '#db4437'
        },
        committee: {
            name: '상임위원회',
            location: '경기도의회 상임위원회 회의실',
            icon: 'fa-users',
            color: '#4285f4'
        },
        special: {
            name: '특별위원회',
            location: '경기도의회 특별위원회 회의실',
            icon: 'fa-star',
            color: '#673ab7'
        },
        training: {
            name: '의원연수',
            location: '경기도의회 연수원',
            icon: 'fa-graduation-cap',
            color: '#0f9d58'
        },
        audit: {
            name: '행정사무감사',
            location: '경기도의회 본회의장',
            icon: 'fa-search',
            color: '#ff6d00'
        },
        budget: {
            name: '예산심의',
            location: '경기도의회 예산결산특별위원회 회의실',
            icon: 'fa-calculator',
            color: '#00acc1'
        }
    };

    // 상태별 정보
    const STATUS_INFO = {
        present: {
            text: '출석',
            icon: 'fa-check-circle',
            color: '#0f9d58',
            bgColor: '#e6f4ea'
        },
        excused: {
            text: '청가',
            icon: 'fa-calendar-times',
            color: '#f9ab00',
            bgColor: '#fef7e0'
        },
        absent: {
            text: '결석',
            icon: 'fa-times-circle',
            color: '#d93025',
            bgColor: '#fce8e6'
        },
        scheduled: {
            text: '예정',
            icon: 'fa-clock',
            color: '#1a73e8',
            bgColor: '#e8f0fe'
        }
    };

    // 출석 상세 정보 표시 함수
    window.app.showAttendanceDetail = function(dateStr) {
        console.log('출석 상세 정보 표시:', dateStr);

        // calendarData가 없으면 초기화
        if (!this.calendarData || !this.calendarData.events) {
            this.initCalendarData();
        }

        // 해당 날짜의 이벤트 가져오기
        const event = this.calendarData.events[dateStr];

        if (!event) {
            this.showToast('해당 날짜에 일정이 없습니다.', 'info');
            return;
        }

        // 날짜 파싱
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[date.getDay()];

        // 이벤트 타입 판별
        const type = this.getEventType(event);
        const meetingInfo = MEETING_INFO[type] || MEETING_INFO.committee;
        const statusInfo = STATUS_INFO[event.status] || STATUS_INFO.scheduled;

        // 시간 계산
        const startTime = event.time || '10:00';
        const endTime = this.calculateEndTime(startTime, 120); // 기본 2시간

        // 주요 안건 데이터
        const agendas = this.getAgendaForDate(dateStr, type);

        // 모달 컨텐츠 생성
        const content = `
            <div class="attendance-detail-enhanced">
                <!-- 상태 헤더 -->
                <div class="detail-status-header" style="background: ${statusInfo.bgColor}; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 48px; height: 48px; background: ${statusInfo.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas ${statusInfo.icon}" style="color: white; font-size: 24px;"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-size: 18px; font-weight: 600; color: ${statusInfo.color}; margin-bottom: 4px;">
                                ${statusInfo.text}
                            </div>
                            <div style="font-size: 14px; color: #5f6368;">
                                ${year}년 ${month}월 ${day}일 (${dayName})
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 회의 정보 -->
                <div class="detail-info-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                    <h4 style="font-size: 16px; font-weight: 600; color: #202124; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-info-circle" style="color: #1a73e8;"></i>
                        회의 정보
                    </h4>
                    <div class="info-grid" style="display: flex; flex-direction: column; gap: 12px;">
                        <div class="info-row" style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: #f1f3f4; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas ${meetingInfo.icon}" style="color: ${meetingInfo.color};"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-size: 12px; color: #5f6368;">회의 유형</div>
                                <div style="font-size: 14px; font-weight: 500; color: #202124;">${event.title}</div>
                            </div>
                        </div>

                        <div class="info-row" style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: #f1f3f4; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-clock" style="color: #1a73e8;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-size: 12px; color: #5f6368;">시간</div>
                                <div style="font-size: 14px; font-weight: 500; color: #202124;">${year}년 ${month}월 ${day}일 ${startTime}</div>
                                <div style="font-size: 12px; color: #5f6368;">(${this.calculateDuration(startTime, endTime)})</div>
                            </div>
                        </div>

                        <div class="info-row" style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: #f1f3f4; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-map-marker-alt" style="color: #ea4335;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-size: 12px; color: #5f6368;">장소</div>
                                <div style="font-size: 14px; font-weight: 500; color: #202124;">${meetingInfo.location}</div>
                            </div>
                        </div>

                        ${event.reason ? `
                        <div class="info-row" style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; background: #fef7e0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-exclamation-circle" style="color: #f9ab00;"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-size: 12px; color: #5f6368;">사유</div>
                                <div style="font-size: 14px; font-weight: 500; color: #202124;">${event.reason}</div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- 주요 안건 -->
                <div class="detail-agenda-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px;">
                    <h4 style="font-size: 16px; font-weight: 600; color: #202124; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-list-ul" style="color: #34a853;"></i>
                        주요 안건
                    </h4>
                    <div class="agenda-list" style="display: flex; flex-direction: column; gap: 12px;">
                        ${agendas.map((agenda, index) => `
                            <div class="agenda-item" style="display: flex; gap: 12px; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                                <div style="width: 28px; height: 28px; background: #1a73e8; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0;">
                                    ${index + 1}
                                </div>
                                <div style="flex: 1;">
                                    <div style="font-size: 14px; font-weight: 500; color: #202124; margin-bottom: 4px;">
                                        ${agenda.title}
                                    </div>
                                    <div style="display: inline-block; padding: 2px 8px; background: ${agenda.statusColor}; color: ${agenda.statusTextColor}; border-radius: 4px; font-size: 11px; font-weight: 500;">
                                        ${agenda.status}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // 모달 표시
        this.showModalEnhanced('attendanceDetail', {
            title: '출석 상세 정보',
            icon: 'fas fa-calendar-check',
            content: content,
            confirmText: '확인'
        });
    };

    // 종료 시간 계산
    window.app.calculateEndTime = function(startTime, durationMinutes) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + durationMinutes;
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;
        return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    };

    // 소요 시간 계산
    window.app.calculateDuration = function(startTime, endTime) {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        const totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}시간 ${minutes}분`;
    };

    // 날짜별 안건 가져오기
    window.app.getAgendaForDate = function(dateStr, type) {
        // 기본 안건 데이터 (실제로는 서버에서 가져와야 함)
        const defaultAgendas = {
            plenary: [
                { title: '2025년도 본예산안 심의', status: '원안가결', statusColor: '#e6f4ea', statusTextColor: '#0f9d58' },
                { title: '경기도 교육환경 개선 조례안', status: '수정가결', statusColor: '#e8f0fe', statusTextColor: '#1a73e8' },
                { title: '도정질문', status: '진행완료', statusTextColor: '#5f6368', statusColor: '#f1f3f4' }
            ],
            committee: [
                { title: '교육예산 배분 계획 검토', status: '심의중', statusColor: '#fef7e0', statusTextColor: '#f9ab00' },
                { title: '학교 시설 개선 방안 논의', status: '논의완료', statusColor: '#e6f4ea', statusTextColor: '#0f9d58' },
                { title: '교육정책 방향 설정', status: '계속심의', statusColor: '#e8f0fe', statusTextColor: '#1a73e8' }
            ],
            budget: [
                { title: '2025년도 추경예산안', status: '심사중', statusColor: '#fef7e0', statusTextColor: '#f9ab00' },
                { title: '교육청 예산 증액 요청', status: '반영', statusColor: '#e6f4ea', statusTextColor: '#0f9d58' },
                { title: '복지예산 편성 검토', status: '보류', statusColor: '#fce8e6', statusTextColor: '#d93025' }
            ],
            audit: [
                { title: '교육청 업무 추진 실적', status: '감사완료', statusColor: '#e6f4ea', statusTextColor: '#0f9d58' },
                { title: '예산 집행 내역 점검', status: '진행중', statusColor: '#fef7e0', statusTextColor: '#f9ab00' },
                { title: '주요 사업 추진 현황', status: '확인완료', statusColor: '#e6f4ea', statusTextColor: '#0f9d58' }
            ],
            training: [
                { title: '정책 입안 실무 교육', status: '수료', statusColor: '#e6f4ea', statusTextColor: '#0f9d58' },
                { title: '예산 심사 기법 교육', status: '수료', statusColor: '#e6f4ea', statusTextColor: '#0f9d58' },
                { title: '의정 활동 우수 사례', status: '수료', statusColor: '#e6f4ea', statusTextColor: '#0f9d58' }
            ]
        };

        return defaultAgendas[type] || defaultAgendas.committee;
    };

    console.log('출석 상세 정보 모듈 로드 완료');
})();
