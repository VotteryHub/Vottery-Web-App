import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const FriendSuggestionsPanel = ({ suggestions }) => {
  const [mockSuggestions] = useState([
    { id: 1, name: 'Alex Johnson', username: '@alexj', avatar: 'AJ', mutualFriends: 12 },
    { id: 2, name: 'Maria Garcia', username: '@mariag', avatar: 'MG', mutualFriends: 8 },
    { id: 3, name: 'David Lee', username: '@davidl', avatar: 'DL', mutualFriends: 15 },
    { id: 4, name: 'Sophie Chen', username: '@sophiec', avatar: 'SC', mutualFriends: 6 },
    { id: 5, name: 'Ryan Taylor', username: '@ryant', avatar: 'RT', mutualFriends: 10 },
    { id: 6, name: 'Emily Brown', username: '@emilyb', avatar: 'EB', mutualFriends: 9 },
  ]);

  const displaySuggestions = suggestions?.length > 0 ? suggestions : mockSuggestions;
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  const checkScrollPosition = () => {
    if (scrollContainerRef?.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef?.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef?.current;
    if (container) {
      container?.addEventListener('scroll', checkScrollPosition);
      return () => container?.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef?.current) {
      const scrollAmount = 280;
      const newScrollLeft = scrollContainerRef?.current?.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef?.current?.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e?.pageX - scrollContainerRef?.current?.offsetLeft);
    setScrollLeft(scrollContainerRef?.current?.scrollLeft);
    setLastX(e?.pageX);
    setLastTime(Date.now());
    setVelocity(0);
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.style.cursor = 'grabbing';
      scrollContainerRef.current.style.scrollBehavior = 'auto';
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e?.touches?.[0]?.pageX - scrollContainerRef?.current?.offsetLeft);
    setScrollLeft(scrollContainerRef?.current?.scrollLeft);
    setLastX(e?.touches?.[0]?.pageX);
    setLastTime(Date.now());
    setVelocity(0);
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.style.scrollBehavior = 'auto';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e?.preventDefault();
    const x = e?.pageX - scrollContainerRef?.current?.offsetLeft;
    const walk = (x - startX) * 2;
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTime;
    
    if (timeDelta > 0) {
      const newVelocity = (e?.pageX - lastX) / timeDelta;
      setVelocity(newVelocity);
    }
    
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
    
    setLastX(e?.pageX);
    setLastTime(currentTime);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e?.touches?.[0]?.pageX - scrollContainerRef?.current?.offsetLeft;
    const walk = (x - startX) * 2;
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTime;
    
    if (timeDelta > 0) {
      const newVelocity = (e?.touches?.[0]?.pageX - lastX) / timeDelta;
      setVelocity(newVelocity);
    }
    
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
    
    setLastX(e?.touches?.[0]?.pageX);
    setLastTime(currentTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.scrollBehavior = 'smooth';
      
      if (Math.abs(velocity) > 0.5) {
        const momentum = velocity * 200;
        scrollContainerRef.current.scrollLeft -= momentum;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.style.scrollBehavior = 'smooth';
      
      if (Math.abs(velocity) > 0.5) {
        const momentum = velocity * 200;
        scrollContainerRef.current.scrollLeft -= momentum;
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          People You May Know
        </h2>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-600"
            aria-label="Scroll left"
          >
            <Icon name="ChevronLeft" size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-600"
            aria-label="Scroll right"
          >
            <Icon name="ChevronRight" size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {displaySuggestions?.map((user) => (
            <div
              key={user?.id}
              className="flex-shrink-0 w-[160px] select-none"
            >
              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden transition-all duration-200 hover:shadow-md">
                {/* Cover Image Area */}
                <div className="h-[160px] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-600 dark:to-gray-500 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold text-xl ring-4 ring-white dark:ring-gray-700 shadow-lg">
                      {user?.avatar}
                    </div>
                  </div>
                </div>
                
                {/* User Info */}
                <div className="pt-12 pb-3 px-3 text-center">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 truncate hover:underline cursor-pointer">
                    {user?.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {user?.mutualFriends} mutual friends
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="space-y-1.5">
                    <button className="w-full py-1.5 px-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-md transition-colors duration-200">
                      Add Friend
                    </button>
                    <button className="w-full py-1.5 px-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 text-sm font-semibold rounded-md transition-colors duration-200">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-300">
        See All
      </button>
    </div>
  );
};

export default FriendSuggestionsPanel;