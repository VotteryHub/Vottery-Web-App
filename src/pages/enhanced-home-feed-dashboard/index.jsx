import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import FeedCarouselOrchestrator from '../../components/carousels/FeedCarouselOrchestrator';
import VerticalPost from './components/VerticalPost';
import StandardPost from './components/StandardPost';
import AdSlotRenderer from '../../components/AdSlotRenderer';
import { POSTS_DATA, CAROUSEL_DATA } from './dummyData';
import NavIcon from '../../components/ui/NavIcon';
import LogicAuditModal from '../../components/LogicAuditModal';

const EnhancedHomeFeedDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [auditItem, setAuditItem] = useState(null);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleOpenAudit = (item) => {
    setAuditItem(item);
    setIsAuditOpen(true);
  };

  const renderFeedContent = () => {
    const feed = [];
    let postIndex = 0;

    // 1. Initial Vertical Post
    if (POSTS_DATA[postIndex]) {
      feed.push(<VerticalPost key="v1" post={POSTS_DATA[postIndex++]} onAudit={handleOpenAudit} />);
    }

    // 2. Carousel 1 (Mixed)
    feed.push(<FeedCarouselOrchestrator key="c1" type="Mixed" items={CAROUSEL_DATA.Mixed} />);

    // 3. Next 3 Standard Posts
    for (let i = 0; i < 3; i++) {
      if (POSTS_DATA[postIndex]) {
        feed.push(<StandardPost key={`p${postIndex}`} post={POSTS_DATA[postIndex++]} onAudit={handleOpenAudit} />);
      }
    }

    // 4. Carousel 2 (Connections)
    feed.push(<FeedCarouselOrchestrator key="c2" type="Connections" items={CAROUSEL_DATA.Connections} />);

    // 5. Next 3 Standard Posts
    for (let i = 0; i < 3; i++) {
      if (POSTS_DATA[postIndex]) {
        feed.push(<StandardPost key={`p${postIndex}`} post={POSTS_DATA[postIndex++]} onAudit={handleOpenAudit} />);
      }
    }

    // 6. Carousel 3 (Earners)
    feed.push(<FeedCarouselOrchestrator key="c3" type="Earners" items={CAROUSEL_DATA.Earners} />);

    // 7. Next 3 Standard Posts + Ad Slot
    for (let i = 0; i < 3; i++) {
      if (POSTS_DATA[postIndex]) {
        feed.push(<StandardPost key={`p${postIndex}`} post={POSTS_DATA[postIndex++]} onAudit={handleOpenAudit} />);
      }
    }
    
    // Ad Slot every 3 items after initial burst
    feed.push(
      <div key="ad1" className="my-6 glass-card border-dashed border-2 border-gray-300 dark:border-gray-700 h-32 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs">
        Sponsored Content Slot
      </div>
    );

    // 8. Carousel 4 (Creator)
    feed.push(<FeedCarouselOrchestrator key="c4" type="Creator" items={CAROUSEL_DATA.Creator} />);

    return feed;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-source-sans">
      <Helmet>
        <title>Home Feed | Vottery</title>
      </Helmet>
      
      <HeaderNavigation />

      <div className="max-w-[1920px] mx-auto flex justify-center">
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden xl:block w-72 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto border-r border-gray-200 dark:border-gray-800 p-4">
          <LeftSidebar />
        </div>

        {/* Main Feed */}
        <main className="flex-1 max-w-4xl px-4 py-8 space-y-6">
          {/* Post Composer */}
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-vottery-blue text-white flex items-center justify-center font-bold">V</div>
            <button className="flex-1 h-10 rounded-full bg-gray-100 dark:bg-gray-900 text-left px-4 text-gray-500 text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              What's on your mind, Citizen?
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <NavIcon name="Jolts" active={false} size={20} className="text-red-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <NavIcon name="Hubs" active={false} size={20} className="text-green-500" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-[600px] bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              </div>
            </div>
          ) : (
            renderFeedContent()
          )}
        </main>

        {/* Right Sidebar (Desktop Only) */}
        <div className="hidden min-[1440px]:block w-80 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto p-4 space-y-6">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-widest">Sponsored</h3>
              <button className="text-[10px] text-vottery-blue font-bold">Create Ad</button>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                <img src="https://picsum.photos/seed/ad1/400/250" alt="" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <p className="font-bold text-sm dark:text-white">Vote for Change</p>
                  <p className="text-xs text-gray-500 mt-1">Join the community driving real reform.</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                <img src="https://picsum.photos/seed/ad2/400/250" alt="" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <p className="font-bold text-sm dark:text-white">Premium Creator Studio</p>
                  <p className="text-xs text-gray-500 mt-1">Upgrade your content today.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-widest mb-4">Trending Hubs</h3>
            <div className="space-y-4">
              {['Tech Ethics', 'Climate Action', 'Local Governance', 'Education Reform']?.map(hub => (
                <div key={hub} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-vottery-blue group-hover:bg-vottery-blue group-hover:text-white transition-all">
                    {hub[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white">{hub}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black">1.2k members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <footer className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4 pb-8">
            Privacy · Terms · Advertising · Cookies · More · Vottery © 2026
          </footer>
        </div>
      </div>
      
      <LogicAuditModal 
        isOpen={isAuditOpen} 
        onClose={() => setIsAuditOpen(false)} 
        contentItem={auditItem} 
        userId="current_user_id" // Placeholder
      />
    </div>
  );
};

export default EnhancedHomeFeedDashboard;

