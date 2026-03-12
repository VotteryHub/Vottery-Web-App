import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import JoltCard from './JoltCard';

const ReelsCarousel = () => {
  const [jolts, setJolts] = useState([
  {
    id: 1,
    author: { name: 'Sarah Martinez', username: '@sarahm', avatar: 'SM' },
    videoUrl: 'https://example.com/video1.mp4',
    caption: 'Amazing sunset at the beach! 🌅 #nature #sunset',
    likes: 12400,
    comments: 234,
    views: 45600,
    isLiked: false
  },
  {
    id: 2,
    author: { name: 'John Davis', username: '@johnd', avatar: 'JD' },
    videoUrl: 'https://example.com/video2.mp4',
    caption: 'Quick workout routine for busy days 💪 #fitness #workout',
    likes: 8900,
    comments: 156,
    views: 32100,
    isLiked: false
  },
  {
    id: 3,
    author: { name: 'Emma Wilson', username: '@emmaw', avatar: 'EW' },
    videoUrl: 'https://example.com/video3.mp4',
    caption: 'Cooking my favorite pasta recipe 🍝 #cooking #food',
    likes: 15600,
    comments: 289,
    views: 52300,
    isLiked: true
  },
  {
    id: 4,
    author: { name: 'Mike Roberts', username: '@miker', avatar: 'MR' },
    videoUrl: 'https://example.com/video4.mp4',
    caption: 'Travel vlog: Exploring Tokyo 🗼 #travel #japan',
    likes: 23400,
    comments: 445,
    views: 78900,
    isLiked: false
  },
  {
    id: 5,
    author: { name: 'Lisa Kim', username: '@lisak', avatar: 'LK' },
    videoUrl: 'https://example.com/video5.mp4',
    caption: 'DIY home decor ideas 🏠 #diy #homedecor',
    likes: 10200,
    comments: 178,
    views: 38700,
    isLiked: false
  },
  {
    id: 6,
    author: { name: 'Alex Chen', username: '@alexc', avatar: 'AC' },
    videoUrl: 'https://example.com/video6.mp4',
    caption: 'Street photography tips 📸 #photography #tips',
    likes: 18900,
    comments: 312,
    views: 61200,
    isLiked: false
  }]
  );

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
      const scrollAmount = 320;
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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4 relative group pb-4 px-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 mb-4">
          <img
            src="/assets/images/43c21fdd-727d-4cdf-b49c-adfca430ac0c-Photoroom-1770143328916.png"
            alt="Jolts"
            className="w-5 h-5 object-contain"
          />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Jolts
          </h2>
        </div>
        <button className="text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
          See all
        </button>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Navigation Arrow */}
        {showLeftArrow &&
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-600"
          aria-label="Scroll left">

            <Icon name="ChevronLeft" size={20} className="text-gray-700 dark:text-gray-300" strokeWidth={2.5} />
          </button>
        }

        {/* Right Navigation Arrow */}
        {showRightArrow &&
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-600"
          aria-label="Scroll right">

            <Icon name="ChevronRight" size={20} className="text-gray-700 dark:text-gray-300" strokeWidth={2.5} />
          </button>
        }

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing pb-2 mb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}>

          {jolts?.map((jolt) =>
          <div key={jolt?.id} className="flex-shrink-0 w-[280px] select-none">
              <JoltCard jolt={jolt} />
            </div>
          )}
        </div>
      </div>
    </div>);

};

export default ReelsCarousel;