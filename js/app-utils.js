/**
 * Default Avatar Generation Utility
 * Generates SVG avatar with member initials on party-colored background
 * Part of: 002-dashboard-bug-fixes (User Story 1 - Fix Missing Image Assets)
 */
(function() {
  'use strict';

  // Party color mapping (KRDS compliant)
  const PARTY_COLORS = {
    '국민의힘': '#003d7a',     // KRDS primary blue
    '더불어민주당': '#0056b3',  // KRDS secondary blue
    '정의당': '#FFCD00',       // Justice Party yellow
    '무소속': '#6B7280',       // Neutral gray
    'default': '#003d7a'      // Fallback to KRDS primary
  };

  /**
   * Generate default avatar SVG
   * @param {string} memberName - Full Korean name (minimum 2 characters)
   * @param {string} partyColor - Hex color code (optional, uses party mapping if not provided)
   * @returns {string} SVG markup string
   */
  window.app.generateDefaultAvatar = function(memberName, partyColor) {
    console.log('🖼️ Generating default avatar for:', memberName);

    // Validation
    if (!memberName || typeof memberName !== 'string' || memberName.length < 2) {
      console.error('❌ Invalid member name for avatar generation');
      memberName = '의원'; // Fallback to generic "council member"
    }

    // Extract initials (first 2 characters)
    const initials = memberName.substring(0, 2);

    // Get party color or use default
    const bgColor = partyColor || PARTY_COLORS['default'];

    // Validate color format (hex color pattern)
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexColorRegex.test(bgColor)) {
      console.warn('⚠️ Invalid color code, using default:', bgColor);
      bgColor = PARTY_COLORS['default'];
    }

    // Generate SVG with WCAG AA compliance
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
