import React from 'react';

/**
 * Compact Vottery wordmark used inside tight spaces like QR overlays.
 * Uses inline SVG so it does not depend on external image assets.
 */
const VotteryWordmark = ({ className = '', title = 'Vottery' }) => {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 140 32"
        role="img"
        aria-label={title}
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="vottery-check-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F6C20A" />
            <stop offset="100%" stopColor="#FFDB4D" />
          </linearGradient>
        </defs>

        {/* Rounded square background for checkmark */}
        <rect
          x="0"
          y="0"
          width="32"
          height="32"
          rx="6"
          fill="none"
          stroke="url(#vottery-check-gradient)"
          strokeWidth="3"
        />

        {/* Checkmark */}
        <polyline
          points="8,17 13,22 24,10"
          fill="none"
          stroke="#0F5FFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Wordmark text */}
        <text
          x="40"
          y="22"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontWeight="700"
          fontSize="16"
          fill="#0F5FFF"
        >
          Vottery
        </text>
      </svg>
    </div>
  );
};

export default VotteryWordmark;

