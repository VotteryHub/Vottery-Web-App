import React from 'react';
import { useBreakpoints } from '../../hooks/useBreakpoints';

/**
 * AppShell: The absolute root layout container for the application.
 * Manages the global background, text color, and min-height, as well as iOS safe areas.
 */
export const AppShell = ({ children, className = '' }) => {
  return (
    <div 
      className={`min-h-screen bg-background text-foreground flex flex-col ${className}`}
    >
      {children}
    </div>
  );
};
