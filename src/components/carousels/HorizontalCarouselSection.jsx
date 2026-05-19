import React, { useRef, useState } from 'react';
import Icon from '../AppIcon';

/**
 * HorizontalCarouselSection
 * A premium, scrollable horizontal carousel with tab switching and arrow navigation.
 *
 * Props:
 *   title       — section heading
 *   tabs        — array of { key, label } tab descriptors
 *   activeTab   — controlled active tab key
 *   onTabChange — (key) => void
 *   children    — carousel card elements
 */
const HorizontalCarouselSection = ({ title, tabs = [], activeTab, onTabChange, children }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-0">
        <h2 className="font-black text-[16px] text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="flex gap-1 px-4 pt-3 border-b border-gray-100 dark:border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange?.(tab.key)}
              className={`
                pb-2 px-3 text-[13px] font-bold border-b-2 transition-all duration-150
                ${activeTab === tab.key
                  ? 'border-[#0F5FFF] text-[#0F5FFF]'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 px-4 py-4 overflow-x-auto scrollbar-none scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalCarouselSection;
