import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const PremiumMixedCarousel = ({ type = 'mixed' }) => {
  const [activeTab, setActiveTab] = useState('elections');
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const tabs = [
    { id: 'elections', label: 'Live Elections', icon: 'Vote' },
    { id: 'jolts', label: 'Jolts', icon: 'Zap' },
    { id: 'moments', label: 'Moments', icon: 'Clock' },
    { id: 'spotlights', label: 'Spotlights', icon: 'Star' },
  ];

  const data = {
    elections: [
      { id: 1, title: 'Best City for Digital Nomads', votes: '12.4K', timeLeft: '2h 14m', image: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=400&h=700&fit=crop', live: true },
      { id: 2, title: 'Favorite 2024 Tech Gadget', votes: '8.9K', timeLeft: '5h 45m', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=700&fit=crop', live: true },
      { id: 3, title: 'Sustainable Fashion Brand', votes: '15.6K', timeLeft: '12h 30m', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=700&fit=crop', live: false },
    ],
    jolts: [
      { id: 1, author: 'Alex Rivera', views: '45K', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=700&fit=crop' },
      { id: 2, author: 'Sarah Chen', views: '128K', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=700&fit=crop' },
      { id: 3, author: 'Mike Ross', views: '89K', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=700&fit=crop' },
    ],
    moments: [
      { id: 1, author: 'Priya Sharma', views: '67K', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=700&fit=crop', title: 'Election Night Live' },
      { id: 2, author: 'James Wilson', views: '34K', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop', title: 'Community Meetup' },
      { id: 3, author: 'Diana Ross', views: '92K', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=700&fit=crop', title: 'Voting Day Highlights' },
    ],
    spotlights: [
      { id: 1, title: 'Creator of the Week', author: 'Sarah Johnson', views: '156K', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=700&fit=crop' },
      { id: 2, title: 'Rising Star', author: 'Michael Chen', views: '89K', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=700&fit=crop' },
    ]
  };

  const currentItems = data[activeTab] || [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-8 transition-all duration-500 hover:shadow-2xl">
      {/* Tab Header */}
      <div className="flex items-center gap-1 p-2 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-vottery-blue shadow-md scale-105'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Icon name={tab.icon} active={activeTab === tab.id} size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Carousel */}
      <div className="relative p-4">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <AnimatePresence mode="popLayout">
            {currentItems.map((item, index) => (
              <motion.div
                key={`${activeTab}-${item.id}`}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex-shrink-0 w-[180px] h-[320px] rounded-2xl overflow-hidden relative group cursor-pointer snap-start shadow-lg ring-1 ring-black/5"
                onClick={() => navigate(activeTab === 'elections' ? `/vote/${item.id}` : '/jolts')}
              >
                {/* Background Image with Rim Lighting */}
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 ring-1 ring-white/10 inset-px rounded-2xl pointer-events-none" />

                {/* Status Badges */}
                {activeTab === 'elections' && item.live && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-[10px] font-black rounded-md flex items-center gap-1 shadow-lg animate-pulse">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    LIVE
                  </div>
                )}
                {activeTab === 'jolts' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Icon name="Play" size={24} className="text-white ml-1" />
                    </div>
                  </div>
                )}

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-bold text-sm leading-tight mb-1 drop-shadow-md">
                    {item.title || item.author}
                  </h4>
                  {activeTab === 'elections' && (
                    <div className="flex items-center justify-between text-[10px] text-gray-300 font-bold">
                      <span>{item.votes} votes</span>
                      <span className="text-vottery-yellow">{item.timeLeft}</span>
                    </div>
                  )}
                  {activeTab === 'jolts' && (
                    <div className="text-[10px] text-gray-300 font-bold">
                      {item.views} views
                    </div>
                  )}
                  {(activeTab === 'moments' || activeTab === 'spotlights') && (
                    <div className="text-[10px] text-gray-300 font-bold">
                      {item.views} views
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* View More Card */}
          <div className="flex-shrink-0 w-[180px] h-[320px] rounded-2xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Icon name="ArrowRight" size={24} className="text-vottery-blue" />
            </div>
            <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">See All</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumMixedCarousel;
