import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const StoriesCarousel = ({ liveMoments = [], currentUser }) => {
  const stories = useMemo(() => {
    const createMoment = { id: 'create', user: 'Create Moment', avatar: '+', hasStory: false, isAddStory: true };
    const fromMoments = (liveMoments || [])?.map((m, i) => ({
      id: m?.id || `m-${i}`,
      user: m?.creator?.username || 'User',
      avatar: m?.creator?.avatar || (m?.creator?.username?.slice(0, 2)?.toUpperCase() || 'U'),
      hasStory: true,
      viewed: !!m?.isViewed,
    }));
    return [createMoment, ...fromMoments];
  }, [liveMoments]);

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
  }, [stories]);

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 mb-4 relative group">
      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
            aria-label="Scroll left"
          >
            <Icon name="ChevronLeft" size={20} strokeWidth={2.5} className="text-gray-700 dark:text-gray-300" />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
            aria-label="Scroll right"
          >
            <Icon name="ChevronRight" size={20} strokeWidth={2.5} className="text-gray-700 dark:text-gray-300" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing py-2 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {stories?.map((story) => (
            <div
              key={story?.id}
              className="flex-shrink-0 w-[112px] select-none"
            >
              <div className="relative">
                <div
                  className={`w-[112px] h-[200px] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    story?.isAddStory
                      ? 'bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
                      : story?.viewed
                      ? 'ring-2 ring-gray-300 dark:ring-gray-600' :'ring-[3px] ring-blue-500 dark:ring-blue-400'
                  }`}
                >
                  {story?.isAddStory && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                      <Icon name="Plus" size={18} strokeWidth={2.5} className="text-white" />
                    </div>
                  )}
                  {story?.isAddStory ? (
                    <Link to="/moments-creation-studio" className="block w-full h-full">
                      <div className="w-full h-full flex flex-col items-center justify-center relative hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors">
                        <div className="absolute top-0 left-0 right-0 h-[140px] bg-gray-100 dark:bg-gray-600"></div>
                        <div className="relative z-10 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mb-2 shadow-md ring-4 ring-white dark:ring-gray-700 mt-12">
                          <Icon name="Plus" size={20} />
                        </div>
                        <div className="relative z-10 mt-2">
                          <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">Create Moment</span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center relative">
                      <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center font-semibold text-sm shadow-md ring-[3px] ring-blue-500 dark:ring-blue-400 overflow-hidden">
                        {typeof story?.avatar === 'string' && (story.avatar?.startsWith('http') || story.avatar?.startsWith('/')) ? (
                          <img src={story.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          story?.avatar || (story?.user?.slice(0, 2)?.toUpperCase() || 'U')
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-xs font-semibold text-white truncate drop-shadow-lg">
                          {story?.user}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoriesCarousel;