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
            <stop offset="0%" stopColor="#FFC629" />
            <stop offset="100%" stopColor="#FFD54F" />
          </linearGradient>
        </defs>

        {/* Rounded square background for checkmark */}
        <rect
          x="0"
          y="0"
          width="32"
          height="32"
          rx="8"
          fill="#0F5FFF"
        />

        {/* Checkmark */}
        <polyline
          points="8,17 13,22 24,10"
          fill="none"
          stroke="#FFC629"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Wordmark text */}
        <text
          x="40"
          y="22"
          fontFamily="'Outfit', sans-serif"
          fontWeight="900"
          fontSize="18"
          fill="#0F5FFF"
          letterSpacing="-0.02em"
        >
          Vottery
        </text>
      </svg>
    </div>
  );
};

export default VotteryWordmark;

