import React from 'react';

/**
 * Premium Vottery Navigation Icons with specific active-state color split rules:
 * - Blue body (#0F5FFF)
 * - Yellow interior accents (#FFC629)
 */
const NavIcon = ({ name, active, size = 28, className = "" }) => {
  const blue = "#0F5FFF";
  const yellow = "#FFC629";
  const muted = "currentColor";

  const icons = {
    Home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={active ? blue : "none"} />
        <path d="M9 22V12h6v10" fill={active ? yellow : "none"} stroke={active ? yellow : muted} />
      </svg>
    ),
    Jolts: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={active ? blue : "none"} />
        <path d="M13 2L12 10h9L13 2z" fill={active ? yellow : "none"} stroke="none" />
      </svg>
    ),
    Elections: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill={active ? blue : "none"} />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="2" fill={active ? yellow : "none"} stroke={active ? yellow : muted} />
      </svg>
    ),
    Hubs: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill={active ? blue : "none"} />
        <circle cx="9" cy="7" r="4" fill={active ? yellow : "none"} stroke={active ? yellow : muted} />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" fill={active ? blue : "none"} />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" fill={active ? yellow : "none"} />
      </svg>
    ),
    Friends: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill={active ? blue : "none"} />
        <circle cx="9" cy="7" r="4" fill={active ? yellow : "none"} stroke={active ? yellow : muted} />
        <path d="M19 8v6M16 11h6" stroke={active ? yellow : muted} />
      </svg>
    ),
    Messages: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill={active ? blue : "none"} />
        <circle cx="12" cy="10" r="1.5" fill={active ? yellow : "none"} />
        <circle cx="8" cy="10" r="1.5" fill={active ? yellow : "none"} />
        <circle cx="16" cy="10" r="1.5" fill={active ? yellow : "none"} />
      </svg>
    ),
    Notifications: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill={active ? blue : "none"} />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" fill={active ? yellow : "none"} stroke={active ? yellow : muted} />
      </svg>
    ),
    Profile: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" stroke={active ? blue : muted} />
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill={active ? yellow : "none"} stroke={active ? yellow : muted} />
        <path d="M20.5 18.5a10 10 0 0 0-17 0" fill={active ? blue : "none"} stroke={active ? blue : muted} />
      </svg>
    ),
    Search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    Menu: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    X: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    Plus: (
       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    Back: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    )
  };

  return icons[name] || icons.Home;
};

export default NavIcon;
