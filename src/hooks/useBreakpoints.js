import { useState, useEffect } from 'react';
import { BREAKPOINTS, isMobileMode, isDesktopMode, showRightColumnAds, showCarouselArrows } from '../constants/breakpoints';

export function useBreakpoints() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.lg
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowWidth,
    isMobile: isMobileMode(windowWidth),
    isDesktop: isDesktopMode(windowWidth),
    showRightColumnAds: showRightColumnAds(windowWidth),
    showCarouselArrows: showCarouselArrows(windowWidth),
    
    // Explicit breakpoint booleans
    isXs: windowWidth < BREAKPOINTS.sm,
    isSm: windowWidth >= BREAKPOINTS.sm && windowWidth < BREAKPOINTS.md,
    isMd: windowWidth >= BREAKPOINTS.md && windowWidth < BREAKPOINTS.lg,
    isLg: windowWidth >= BREAKPOINTS.lg && windowWidth < BREAKPOINTS.xl,
    isXl: windowWidth >= BREAKPOINTS.xl,
    
    // Greater than or equal helpers
    gteSm: windowWidth >= BREAKPOINTS.sm,
    gteMd: windowWidth >= BREAKPOINTS.md,
    gteLg: windowWidth >= BREAKPOINTS.lg,
    gteXl: windowWidth >= BREAKPOINTS.xl,
  };
}
