import React, { useState, useRef } from 'react';
import NavIcon from './NavIcon';
import Icon from '../AppIcon';
import { useNavigate } from 'react-router-dom';

const PremiumTieredCarousel = ({ tierId = 1, data = {} }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Tier Configurations
  const tierConfigs = {
    1: {
      title: "Discovery Strip",
      tabs: [
        { label: "Live Elections", icon: "Elections", layout: "reels" },
        { label: "Suggested Elections", icon: "Target", layout: "suggested-elections" },
        { label: "Jolts", icon: "Jolts", layout: "reels" },
        { label: "Monthly Draw", icon: "Trophy", layout: "reels" }
      ]
    },
    2: {
      title: "Community Growth",
      tabs: [
        { label: "Community Hubs", icon: "Hubs", layout: "suggested-hubs" },
        { label: "Mutual Connections", icon: "Friends", layout: "suggested-connections" },
        { label: "Suggested", icon: "Plus", layout: "reels" }
      ]
    },
    3: {
      title: "Hall of Fame",
      tabs: [
        { label: "Earners", icon: "DollarSign", layout: "reels" },
        { label: "Winners", icon: "Star", layout: "reels" },
        { label: "Champions", icon: "Target", layout: "reels" }
      ]
    },
    4: {
      title: "Creator Space",
      tabs: [
        { label: "Spotlights", icon: "Search", layout: "reels" },
        { label: "Services", icon: "Briefcase", layout: "reels" },
        { label: "Trending", icon: "Hash", layout: "reels" }
      ]
    }
  };

  const config = tierConfigs[tierId] || tierConfigs[1];

  const handleSkip = (id, e) => {
    e.stopPropagation();
    setHiddenIds(prev => new Set([...prev, id]));
  };

  const handleAction = (item, type, e) => {
    e.stopPropagation();
    if (type === 'election') {
      navigate(`/secure-voting-interface?election=${item.id}`);
    } else if (type === 'hub') {
      if (item.hasPrerequisites) {
        navigate(`/community-hubs-management?join=${item.id}`);
      } else {
        console.log(`Joining Hub: ${item.name}`);
        navigate(`/community-hubs-management?id=${item.id}`);
      }
    } else if (type === 'connection') {
      console.log(`Connecting with user: ${item.name}`);
      // Success feedback could be added here
      setHiddenIds(prev => new Set([...prev, item.id]));
    }
  };

  const renderSuggestedElections = () => {
    const key = "recommendedElections";
    const rawItems = data[key] || [];
    const items = rawItems.filter(item => !hiddenIds.has(item.id));
    
    const displayItems = items.length > 0 ? items : [
      { id: 'mock-e-1', title: "Next World President?", coverImage: "https://images.unsplash.com/photo-1540910419892-f7ef7173fdd4?w=400", category: "Global Politics" },
      { id: 'mock-e-2', title: "Best AI Framework 2024", coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400", category: "Technology" }
    ].filter(item => !hiddenIds.has(item.id));

    return (
      <div className="space-y-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
          {displayItems.map((item, i) => (
            <div key={item.id || i} className="flex-shrink-0 w-[200px] h-[300px] rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden group/card relative flex flex-col transition-transform hover:scale-[1.01]">
              <div className="h-32 w-full relative overflow-hidden">
                <img src={item.coverImage || `https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&sig=${i}`} alt="" className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="flex-1">
                  <span className="text-[9px] font-black text-vottery-blue uppercase tracking-widest mb-1 block">{item.category || "Election"}</span>
                  <h4 className="text-[13px] font-black text-gray-900 dark:text-white leading-tight line-clamp-3">{item.title}</h4>
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                   <button onClick={(e) => handleAction(item, 'election', e)} className="w-full py-2 bg-vottery-blue text-white text-[11px] font-black rounded-lg uppercase tracking-widest shadow-md hover:bg-blue-600 transition-colors">Vote</button>
                   <button onClick={(e) => handleSkip(item.id, e)} className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-[11px] font-black rounded-lg uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Skip</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-1">
          <button onClick={() => navigate('/advanced-search-discovery-intelligence-hub')} className="w-full py-3 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white text-[12px] font-black rounded-xl uppercase tracking-[0.1em] transition-all border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2">
            <Icon name="Compass" size={16} /> Discover more Elections
          </button>
        </div>
      </div>
    );
  };

  const renderSuggestedHubs = () => {
    const key = "recommendedHubs";
    const rawItems = data[key] || [];
    const items = rawItems.filter(item => !hiddenIds.has(item.id));
    
    const displayItems = items.length > 0 ? items : [
      { id: 'mock-h-1', name: "Global Climate Action", coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400", memberCount: 12400, hasPrerequisites: false },
      { id: 'mock-h-2', name: "Tech Ethics Forum", coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400", memberCount: 8900, hasPrerequisites: true }
    ].filter(item => !hiddenIds.has(item.id));

    return (
      <div className="space-y-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
          {displayItems.map((item, i) => (
            <div key={item.id || i} className="flex-shrink-0 w-[200px] h-[300px] rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden group/card relative flex flex-col transition-transform hover:scale-[1.01]">
              <div className="h-32 w-full relative overflow-hidden">
                <img src={item.coverImage || `https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&sig=${i}`} alt="" className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="flex-1">
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 block">Recommended Hub</span>
                  <h4 className="text-[13px] font-black text-gray-900 dark:text-white leading-tight line-clamp-3 mb-1">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{(item.memberCount / 1000).toFixed(1)}k Members</p>
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                   <button onClick={(e) => handleAction(item, 'hub', e)} className="w-full py-2 bg-vottery-blue text-white text-[11px] font-black rounded-lg uppercase tracking-widest shadow-md hover:bg-blue-600 transition-colors">Join</button>
                   <button onClick={(e) => handleSkip(item.id, e)} className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-[11px] font-black rounded-lg uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Skip</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-1">
          <button onClick={() => navigate('/community-hubs-management')} className="w-full py-3 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white text-[12px] font-black rounded-xl uppercase tracking-[0.1em] transition-all border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2">
            <Icon name="Users" size={16} /> Discover more Hubs
          </button>
        </div>
      </div>
    );
  };

  const renderMutualConnections = () => {
    const key = "suggestedConnections";
    const rawItems = data[key] || [];
    const items = rawItems.filter(item => !hiddenIds.has(item.id));
    
    const displayItems = items.length > 0 ? items : [
      { id: 'mock-u-1', name: "Alex Thompson", avatar: "https://randomuser.me/api/portraits/men/4.jpg", mutualFriends: 12 },
      { id: 'mock-u-2', name: "Jessica Lee", avatar: "https://randomuser.me/api/portraits/women/5.jpg", mutualFriends: 8 }
    ].filter(item => !hiddenIds.has(item.id));

    return (
      <div className="space-y-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
          {displayItems.map((item, i) => (
            <div key={item.id || i} className="flex-shrink-0 w-[180px] h-[280px] rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden group/card relative flex flex-col transition-transform hover:scale-[1.01]">
              <div className="h-32 w-full relative overflow-hidden">
                <img src={item.avatar || `https://randomuser.me/api/portraits/lego/${i}.jpg`} alt="" className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/5" />
              </div>
              <div className="p-3 flex-1 flex flex-col text-center">
                <div className="flex-1">
                  <h4 className="text-[14px] font-black text-gray-900 dark:text-white leading-tight mb-1">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{item.mutualFriends || 0} Mutual Connections</p>
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                   <button onClick={(e) => handleAction(item, 'connection', e)} className="w-full py-2 bg-vottery-blue text-white text-[11px] font-black rounded-lg uppercase tracking-widest shadow-md hover:bg-blue-600 transition-colors">Connect</button>
                   <button onClick={(e) => handleSkip(item.id, e)} className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-[11px] font-black rounded-lg uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Pass</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-1">
          <button onClick={() => navigate('/community-hubs-management?tab=find-friends')} className="w-full py-3 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white text-[12px] font-black rounded-xl uppercase tracking-[0.1em] transition-all border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2">
            See All
          </button>
        </div>
      </div>
    );
  };

  const renderReelsContent = () => {
    const tabConfig = config.tabs[activeTab];
    const key = tabConfig.label.toLowerCase().replace(/ /g, '');
    const rawItems = data[key] || [];
    const items = rawItems.filter(item => !hiddenIds.has(item.id));
    
    const displayItems = items.length > 0 ? items.slice(0, 10) : [
      { title: "Trending Story 1", coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400" },
      { title: "Featured Story 2", coverImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400" }
    ];

    return (
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 px-1">
        {displayItems.map((item, i) => (
          <div key={i} className="flex-shrink-0 w-[150px] h-[240px] rounded-2xl relative overflow-hidden group/card shadow-lg cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => item.id && navigate(`/item-details/${item.id}`)}>
            <img src={item.coverImage || item.avatar || `https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&sig=${i}`} alt="" className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            <div className="absolute top-2 left-2"><div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20"><NavIcon name={tabConfig.icon} size={12} active={false} className="text-white" /></div></div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
               <p className="text-[11px] font-black text-white leading-tight uppercase tracking-tight line-clamp-2 drop-shadow-md">{item.title || item.name || item.username || "Vottery Story"}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full py-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-5 px-2">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
          <div className="flex-shrink-0 text-gray-900 dark:text-white opacity-80"><Icon name="PlaySquare" size={24} strokeWidth={2.5} /></div>
          {config.tabs.map((tab, idx) => (
            <button key={idx} onClick={() => setActiveTab(idx)} className="flex items-center gap-2 transition-all duration-300 relative group whitespace-nowrap">
              <span className={`text-[15px] font-black uppercase tracking-tight ${activeTab === idx ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}>{tab.label}</span>
              {activeTab === idx && <div className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white rounded-full animate-in fade-in zoom-in duration-300" />}
            </button>
          ))}
          <button className="text-gray-400 px-1"><Icon name="MoreHorizontal" size={20} /></button>
        </div>
        <button className="p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"><Icon name="X" size={24} strokeWidth={2} /></button>
      </div>
      <div className="relative">
        {config.tabs[activeTab]?.layout === 'suggested-elections' ? renderSuggestedElections() : 
         config.tabs[activeTab]?.layout === 'suggested-hubs' ? renderSuggestedHubs() : 
         config.tabs[activeTab]?.layout === 'suggested-connections' ? renderMutualConnections() :
         renderReelsContent()}
      </div>
    </div>
  );
};

export default PremiumTieredCarousel;
