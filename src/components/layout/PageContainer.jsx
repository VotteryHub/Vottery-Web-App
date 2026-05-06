import React from 'react';
import { useBreakpoints } from '../../hooks/useBreakpoints';

/**
 * PageContainer: Wraps the main content area of a page.
 * Applies standard responsive horizontal paddings and an optional max-width to center content.
 */
export const PageContainer = ({ 
  children, 
  className = '', 
  maxWidth = 'max-w-7xl', // Default max width for large screens
  withBottomNavPadding = false // Adds padding at the bottom to avoid being hidden by mobile nav
}) => {
  const { isMobile } = useBreakpoints();
  
  // Base padding that scales with breakpoints
  const paddingClasses = 'px-4 sm:px-6 md:px-8';
  
  // Safe area handling for bottom nav (only applies if requested and on mobile)
  const bottomNavPadding = (withBottomNavPadding && isMobile) ? 'pb-24 pb-[calc(5rem+env(safe-area-inset-bottom))]' : '';

  return (
    <div className={`w-full mx-auto ${maxWidth} ${paddingClasses} ${bottomNavPadding} ${className}`}>
      {children}
    </div>
  );
};
