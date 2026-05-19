import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import PostCard from '../home-feed-dashboard/components/PostCard';
import Icon from '../../components/AppIcon';
import NavIcon from '../../components/ui/NavIcon';
import { postsService } from '../../services/postsService';
import { useAuth } from '../../contexts/AuthContext';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

const FeedsExplorerHub = () => {
  const { user } = useAuth();
  const { isDesktop } = useBreakpoints();
  const [activeFilter, setActiveFilter] = useState('all'); // all, favorites, friends, hubs, pages
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const filters = [
    { id: 'all', name: 'All', icon: 'Feeds', description: 'See all posts in chronological order' },
    { id: 'favorites', name: 'Favorites', icon: 'Star', description: 'Posts from people you added to Favorites' },
    { id: 'friends', name: 'Friends', icon: 'Friends', description: 'Posts only from your friends and connections' },
    { id: 'hubs', name: 'Hubs', icon: 'Hubs', description: 'Latest posts from Hubs you have joined' },
    { id: 'pages', name: 'Pages', icon: 'Hash', description: 'Updates from Vottery Pages you follow' },
  ];

  useEffect(() => {
    loadFeeds();
  }, [activeFilter, user?.id]);

  const loadFeeds = async () => {
    setLoading(true);
    try {
      let data = [];
      
      // In a real implementation, we would call specialized service methods.
      // For now, we simulate the filtering logic using direct Supabase queries.
      
      let query = supabase.from('posts').select('*, user_profiles(*)').order('created_at', { ascending: false }).limit(20);

      if (activeFilter === 'friends' && user?.id) {
        // Mocking friends filter: in a real app, join with followers/connections table
        const { data: friends } = await supabase.from('followers').select('following_id').eq('follower_id', user.id);
        if (friends?.length) {
          query = query.in('user_id', friends.map(f => f.following_id));
        } else {
          setPosts([]);
          setLoading(false);
          return;
        }
      } else if (activeFilter === 'hubs') {
        query = query.not('community_id', 'is', null);
      }

      const { data: results, error } = await query;
      if (error) throw error;
      setPosts(results || []);
    } catch (err) {
      console.error('Failed to load feeds:', err);
      toast.error('Failed to refresh feed');
    } finally {
      setLoading(false);
    }
  };

  const FilterSidebar = () => (
    <div className="space-y-2">
      <div className="px-4 py-2">
        <h1 className="text-2xl font-black tracking-tight dark:text-white">Feeds</h1>
      </div>
      <div className="space-y-1">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
              activeFilter === filter.id
                ? 'bg-primary/10 text-primary font-black shadow-sm border border-primary/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeFilter === filter.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
               <NavIcon name={filter.icon} active={activeFilter === filter.id} size={20} />
            </div>
            <div className="text-left">
              <div className="text-[14px] font-bold">{filter.name}</div>
              {isDesktop && <div className="text-[11px] opacity-60 font-medium line-clamp-1">{filter.description}</div>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <GeneralPageLayout>
      <div className="max-w-[1200px] mx-auto flex gap-6">
        {/* Left Sidebar - Filter Selection */}
        {isDesktop && (
          <div className="w-80 flex-shrink-0 sticky top-28 h-fit">
             <div className="bg-white dark:bg-slate-900 rounded-[32px] p-4 shadow-xl border border-slate-200 dark:border-white/5">
                <FilterSidebar />
             </div>
          </div>
        )}

        {/* Main Feed Content */}
        <div className="flex-1 max-w-2xl mx-auto space-y-6">
          {!isDesktop && (
             <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm mb-4">
                <FilterSidebar />
             </div>
          )}

          <div className="flex items-center justify-between px-4">
             <h2 className="font-black text-xl dark:text-white capitalize">{activeFilter} Feed</h2>
             <button onClick={loadFeeds} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
                <Icon name="RefreshCw" size={20} className={loading ? 'animate-spin' : ''} />
             </button>
          </div>

          {loading && posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <Icon name="Loader" size={48} className="animate-spin mb-4" />
              <p className="font-bold">Loading your feed...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onInteraction={() => {}}
                />
              ))}
              <div className="py-10 text-center text-slate-400 font-medium">
                You've reached the end of your {activeFilter} feed
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-12 text-center shadow-xl border border-slate-200 dark:border-white/5">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Inbox" size={40} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-black mb-2 dark:text-white">Nothing to show here yet</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">
                Your {activeFilter} feed is currently empty. Follow more creators or join some Hubs to see content here!
              </p>
              <button onClick={() => setActiveFilter('all')} className="bg-primary text-white px-8 py-3 rounded-full font-black shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                Browse All Feeds
              </button>
            </div>
          )}
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default FeedsExplorerHub;
