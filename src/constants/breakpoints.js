export const BREAKPOINTS = {
  xs: 0,
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1440,
};

// Layout specific flags
export const isMobileMode = (width) => width < BREAKPOINTS.lg;
export const isDesktopMode = (width) => width >= BREAKPOINTS.lg;
export const showRightColumnAds = (width) => width >= BREAKPOINTS.lg;
export const showCarouselArrows = (width) => width >= BREAKPOINTS.lg;
