import React, { useState } from 'react';
import PremiumHorizontalSnap from './PremiumHorizontalSnap';
import NavIcon from '../ui/NavIcon';
import Icon from '../AppIcon';

const FeedCarouselOrchestrator = ({ type, items = [] }) => {
  const [activeTab, setActiveTab] = useState('All');

  const config = {
    Mixed: {
      tabs: ['All', 'Live Elections', 'Jolts', 'Monthly Draw'],
      title: 'Trending',
      icon: 'Jolts'
    },
    Connections: {
      tabs: ['All', 'Suggested', 'Mutual', 'Hubs'],
      title: 'People',
      icon: 'Friends'
    },
    Earners: {
      tabs: ['All', 'Earners', 'Winners', 'Accuracy'],
      title: 'Top Performers',
      icon: 'Profile'
    },
    Creator: {
      tabs: ['All', 'Creator', 'Topics'],
      title: 'Featured Creators',
      icon: 'Hubs'
    }
  };

  const currentConfig = config[type] || config.Mixed;
  const filteredItems = activeTab === 'All' 
    ? items 
    : items.filter(item => item.category === activeTab || (activeTab === 'Live Elections' && item.category === 'Live') || (activeTab === 'Monthly Draw' && item.category === 'Draw'));

  const renderCard = (item, index, isCentered) => {
    return (
      <div className={`w-[280px] h-[480px] relative rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500 bg-black ${isCentered ? 'scale-100' : 'scale-95 opacity-60'}`}>
        {/* Full Bleed Image/Video */}
        <img 
          src={item.image || `https://picsum.photos/seed/${item.id}/400/600`} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        
        {/* Top Overlay Icons */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {item.isLive && (
              <div className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded uppercase flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                Live
              </div>
            )}
          </div>
          <button className="p-1.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
            <Icon name="MoreHorizontal" size={18} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Bottom Overlay Content */}
        <div className="absolute bottom-8 left-6 right-6 z-10">
          <h3 className="text-xl font-black text-white leading-tight mb-1 drop-shadow-lg tracking-tight uppercase">
            {item.title}
          </h3>
          <p className="text-xs text-white/80 font-bold line-clamp-1 mb-4 drop-shadow-md">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-vottery-blue border border-white/20 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${item.id}`} className="w-full h-full object-cover" alt="" />
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-wider">{item.author || 'Citizen'}</span>
            </div>
            
            <button className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/30 transition-all flex items-center gap-1.5">
              <Icon name="Volume2" size={12} strokeWidth={3} />
              Spkr
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="my-10 py-4" data-section-type="premium-reels-carousel">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Instagram Style Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-6">
            <div className="cursor-pointer hover:scale-110 transition-transform">
              <NavIcon name="Jolts" active size={28} />
            </div>
            
            <nav className="flex items-center gap-6">
              {currentConfig.tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-lg font-black transition-all ${
                    activeTab === tab 
                      ? 'text-gray-900 dark:text-white scale-105' 
                      : 'text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
              <button className="text-gray-400 font-black text-lg">...</button>
            </nav>
          </div>
          
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <NavIcon name="X" size={24} />
          </button>
        </div>

        <PremiumHorizontalSnap 
          items={filteredItems}
          renderCard={renderCard}
          cardWidth={280}
          cardGap={20}
          className="py-4"
        />
      </div>
    </div>
  );
};

export default FeedCarouselOrchestrator;
