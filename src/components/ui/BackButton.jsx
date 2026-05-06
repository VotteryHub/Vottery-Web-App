import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavIcon from './NavIcon';

/**
 * Global BackButton component for Vottery.
 * Provides a consistent, premium navigation element that integrates with the header or page layouts.
 */
const BackButton = ({ className = "", showLabel = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Root paths where "Back" might not be necessary, but we show it as per user request "every page"
  // const isRoot = location.pathname === '/' || location.pathname === '/home-feed-dashboard';

  const handleBack = () => {
    // If there's no history, we might want to navigate to home instead of doing nothing
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home-feed-dashboard');
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`group flex items-center gap-2 p-2 rounded-xl transition-all duration-300 hover:bg-vottery-blue/10 active:scale-95 ${className}`}
      aria-label="Go Back"
      title="Go Back"
    >
      <div className="relative flex items-center justify-center">
        <NavIcon 
          name="Back" 
          size={24} 
          className="transition-transform group-hover:-translate-x-1 duration-300" 
        />
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-vottery-blue/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {showLabel && (
        <span className="text-xs font-black uppercase tracking-widest hidden sm:block text-slate-500 dark:text-slate-400 group-hover:text-vottery-blue transition-colors">
          Back
        </span>
      )}
    </button>
  );
};

export default BackButton;
