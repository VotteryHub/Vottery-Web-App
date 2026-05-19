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
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" fill={active ? blue : "none"} />
        <polygon points="10 8 16 12 10 16 10 8" fill={active ? yellow : "none"} stroke={active ? yellow : muted} />
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
        <path d="M16 3.13a4 4 0 0 1 0 7.75" fill={active ? yellow : "none"} stroke={active ? yellow : muted} />
      </svg>
    ),
    Friends: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill={active ? blue : "none"} />
        <circle cx="9" cy="7" r="4" fill={active ? yellow : "none"} stroke={active ? yellow : muted} />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" fill={active ? blue : "none"} />
        <circle cx="20" cy="9" r="3" fill={active ? yellow : "none"} stroke={active ? yellow : muted} />
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
    Feeds: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="4" width="18" height="12" rx="2" fill={active ? blue : "none"} />
        <line x1="7" y1="8" x2="17" y2="8" stroke={active ? yellow : muted} />
        <line x1="7" y1="12" x2="13" y2="12" stroke={active ? yellow : muted} />
        <path d="M7 20h10" />
      </svg>
    ),
    Profile: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" stroke={active ? blue : muted} />
        <circle cx="12" cy="10" r="3" fill={active ? yellow : "none"} stroke={active ? yellow : muted} />
        <path d="M17 18.5a5 5 0 0 0-10 0" fill={active ? yellow : "none"} stroke={active ? yellow : muted} />
      </svg>
    ),
    DollarSign: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    Trophy: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
      </svg>
    ),
    Target: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    Star: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={active ? yellow : "none"} />
      </svg>
    ),
    Briefcase: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    Hash: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? blue : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" />
        <line x1="16" y1="3" x2="14" y2="21" />
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
