import React from 'react';
import { useBreakpoints } from '../../hooks/useBreakpoints';

/**
 * ContentGrid: A standard grid for dashboard layouts, particularly the 1-3-1 pattern.
 */
export const ContentGrid = ({ 
  children, 
  className = '',
  // Predefined layouts
  layout = 'default', // 'default' | '1-3-1' | 'sidebar-main' | 'cards'
}) => {
  const { isDesktop } = useBreakpoints();

  let gridClasses = 'grid grid-cols-1 gap-4 sm:gap-6';

  if (layout === '1-3-1' && isDesktop) {
    // Left sidebar (1), Main feed (3), Right sidebar (1)
    gridClasses = 'grid grid-cols-1 lg:grid-cols-5 gap-6';
  } else if (layout === 'sidebar-main' && isDesktop) {
    // Sidebar (1), Main content (3)
    gridClasses = 'grid grid-cols-1 lg:grid-cols-4 gap-6';
  } else if (layout === 'cards') {
    // Auto-fitting cards
    gridClasses = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6';
  }

  return (
    <div className={`${gridClasses} w-full ${className}`}>
      {children}
    </div>
  );
};
