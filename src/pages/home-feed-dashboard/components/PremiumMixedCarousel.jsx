import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';
import KineticSpindle from './KineticSpindle';

const PremiumMixedCarousel = ({ 
  elections = [], 
  jolts = [], 
  moments = [], 
  spotlights = [],
  isLoading = false
}) => {
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
    elections,
    jolts,
    moments,
    spotlights
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

      {/* Carousel Content */}
      <div className="relative p-4">
        {activeTab === 'elections' ? (
          <div className="py-2">
            <KineticSpindle 
              elections={elections} 
              onElectionClick={(e) => navigate(`/vote/${e.id}`)} 
            />
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className="flex gap-4 w-full justify-center py-20">
                  <div className="w-8 h-8 border-4 border-vottery-blue border-t-transparent rounded-full animate-spin" />
                </div>
              ) : currentItems?.length > 0 ? (
                currentItems.map((item, index) => (
                  <motion.div
                    key={`${activeTab}-${item.id || index}`}
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex-shrink-0 w-[180px] h-[320px] rounded-2xl overflow-hidden relative group cursor-pointer snap-start shadow-lg ring-1 ring-black/5"
                    onClick={() => navigate(activeTab === 'elections' ? `/vote/${item.id}` : '/jolts')}
                  >
                    {/* Background Image with Rim Lighting */}
                    <img
                      src={item.image || item.thumbnail || item.coverImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400'}
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
                        {item.title || item.author || item.creator?.username || item.name}
                      </h4>
                      {activeTab === 'elections' && (
                        <div className="flex items-center justify-between text-[10px] text-gray-300 font-bold">
                          <span>{item.votes || item.totalVoters || 0} votes</span>
                          <span className="text-vottery-yellow">{item.timeLeft || item.timeRemaining}</span>
                        </div>
                      )}
                      {(activeTab === 'jolts' || activeTab === 'moments' || activeTab === 'spotlights') && (
                        <div className="text-[10px] text-gray-300 font-bold">
                          {item.views || item.viewCount || 0} views
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center w-full py-10 text-gray-400">
                  <Icon name="Search" size={32} className="mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">No {activeTab} found</p>
                </div>
              )}
            </AnimatePresence>
            
            {/* View More Card */}
            <div className="flex-shrink-0 w-[180px] h-[320px] rounded-2xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Icon name="ArrowRight" size={24} className="text-vottery-blue" />
              </div>
              <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">See All</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumMixedCarousel;
