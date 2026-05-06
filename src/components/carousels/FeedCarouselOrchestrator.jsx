import React, { useState } from 'react';
import PremiumHorizontalSnap from './PremiumHorizontalSnap';
import NavIcon from '../ui/NavIcon';

const FeedCarouselOrchestrator = ({ type, items = [] }) => {
  const [activeTab, setActiveTab] = useState('All');

  const config = {
    Mixed: {
      tabs: ['All', 'Live', 'Jolts', 'Draw'],
      title: 'Trending Content',
      icon: 'Jolts'
    },
    Connections: {
      tabs: ['All', 'Suggested', 'Mutual', 'Hubs'],
      title: 'People You May Know',
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
    : items.filter(item => item.category === activeTab);

  const renderCard = (item, index, isCentered) => {
    return (
      <div className={`w-[320px] h-[400px] glass-card overflow-hidden flex flex-col transition-all duration-500 ${isCentered ? 'ring-2 ring-vottery-blue/50 scale-100 shadow-2xl' : 'scale-95 opacity-80'}`}>
        <div className="h-48 bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
          <img src={item.image || `https://picsum.photos/seed/${item.id}/400/300`} alt="" className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 px-2 py-1 bg-vottery-blue text-white text-[10px] font-bold rounded uppercase tracking-wider">
            {item.category}
          </div>
          {item.isLive && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              LIVE
            </div>
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
          
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.author || 'Vottery User'}</span>
            </div>
            <button className="px-4 py-2 bg-vottery-blue text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
              {type === 'Connections' ? 'Connect' : 'View'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="my-8 py-6 border-y border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-vottery-blue/10 rounded-lg">
              <NavIcon name={currentConfig.icon} active size={24} />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">{currentConfig.title}</h2>
          </div>
          
          <div className="flex items-center gap-1 bg-gray-200/50 dark:bg-gray-800/50 p-1 rounded-full">
            {currentConfig.tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-gray-700 text-vottery-blue shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <PremiumHorizontalSnap 
          items={filteredItems}
          renderCard={renderCard}
          cardWidth={320}
          cardGap={20}
          className="py-4"
        />
      </div>
    </div>
  );
};

export default FeedCarouselOrchestrator;
