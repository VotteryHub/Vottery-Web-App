import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Filter, Zap, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import CarouselFilterBar from './components/CarouselFilterBar';
import ContentModerationBadge from './components/ContentModerationBadge';



const EnhancedHomeFeedDashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moderationStats, setModerationStats] = useState({ safe: 0, flagged: 0, reviewed: 0 });
  const [filters, setFilters] = useState({ elections: { category: 'all', showTrending: false, sortBy: 'trending' }, posts: { category: 'all', showTrending: false, sortBy: 'trending' } });
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [composerType, setComposerType] = useState('post');
  const [composerContent, setComposerContent] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [privacySetting, setPrivacySetting] = useState('public');

  useEffect(() => {
    loadFeedContent();
    setupRealtimeModeration();
    return () => {
      supabase?.removeAllChannels();
    };
  }, []);

  const loadFeedContent = async () => {
    try {
      setLoading(true);
      const { data: postsData } = await supabase
        ?.from('posts')
        ?.select('id, content, created_at, user_id, user_profiles(username, name, avatar)')
        ?.order('created_at', { ascending: false })
        ?.limit(20);

      const { data: moderationData } = await supabase
        ?.from('content_moderation_results')
        ?.select('content_id, confidence_score, status')
        ?.in('content_id', (postsData || [])?.map(p => p?.id));

      const moderationMap = {};
      (moderationData || [])?.forEach(m => { moderationMap[m.content_id] = m; });

      const filteredPosts = (postsData || [])?.filter(p => {
        const mod = moderationMap?.[p?.id];
        return !mod || mod?.confidence_score < 0.85;
      });

      setPosts(filteredPosts);

      const flagged = (moderationData || [])?.filter(m => m?.confidence_score >= 0.85);
      setFlaggedContent(flagged);
      setModerationStats({
        safe: filteredPosts?.length,
        flagged: flagged?.length,
        reviewed: (moderationData || [])?.length
      });
    } catch (err) {
      console.error('Error loading feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeModeration = () => {
    const channel = supabase
      ?.channel('content-moderation-feed')
      ?.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'content_moderation_results' }, (payload) => {
        const result = payload?.new;
        if (result?.confidence_score >= 0.85) {
          setPosts(prev => prev?.filter(p => p?.id !== result?.content_id));
          setFlaggedContent(prev => [...prev, result]);
          setModerationStats(prev => ({ ...prev, flagged: prev?.flagged + 1 }));
        }
      })
      ?.subscribe((status) => {
        setRealtimeStatus(status === 'SUBSCRIBED' ? 'connected' : 'connecting');
      });
  };

  const handleFilterChange = (carouselType, newFilters) => {
    setFilters(prev => ({ ...prev, [carouselType]: newFilters }));
  };

  const handleSubmitPost = async () => {
    if (!composerContent?.trim()) return;
    try {
      const { data: post } = await supabase
        ?.from('posts')
        ?.insert({ content: composerContent, user_id: user?.id, post_type: composerType, privacy: privacySetting })
        ?.select()
        ?.single();

      if (post) {
        setComposerContent('');
        setShowComposer(false);
        loadFeedContent();
      }
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const VP_EARNING = { post: 5, moment: 3, jolts: 15, live: 25 };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Enhanced Home Feed Dashboard | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enhanced Home Feed</h1>
              <p className="text-sm text-gray-500">AI-moderated content with personalized filters</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                realtimeStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  realtimeStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                }`} />
                {realtimeStatus === 'connected' ? 'AI Moderation Active' : 'Connecting...'}
              </div>
              <button onClick={loadFeedContent} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <RefreshCw className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Moderation Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Safe Content', value: moderationStats?.safe, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
              { label: 'Auto-Removed', value: moderationStats?.flagged, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
              { label: 'AI Reviewed', value: moderationStats?.reviewed, icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            ]?.map((stat, i) => (
              <div key={i} className={`${stat?.bg} rounded-xl p-4 flex items-center gap-3`}>
                <stat.icon className={`w-6 h-6 ${stat?.color}`} />
                <div>
                  <p className="text-xs text-gray-500">{stat?.label}</p>
                  <p className={`text-2xl font-bold ${stat?.color}`}>{stat?.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Posts Composer */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              {!showComposer ? (
                <button
                  onClick={() => setShowComposer(true)}
                  className="flex-1 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-left text-gray-500 px-4 text-sm hover:bg-gray-200 transition-colors"
                >
                  What's on your mind?
                </button>
              ) : (
                <div className="flex gap-2">
                  {['post', 'moment', 'jolts', 'live']?.map(type => (
                    <button
                      key={type}
                      onClick={() => setComposerType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                        composerType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {showComposer && (
              <div className="space-y-3">
                {/* Rich text toolbar */}
                <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {['B', 'I', 'U', '#', '@']?.map(fmt => (
                    <button key={fmt} className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      {fmt}
                    </button>
                  ))}
                  <div className="flex-1" />
                  <select
                    value={privacySetting}
                    onChange={e => setPrivacySetting(e?.target?.value)}
                    className="text-xs bg-transparent text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded px-2 py-1"
                  >
                    <option value="public">🌍 Public</option>
                    <option value="friends">👥 Friends</option>
                    <option value="private">🔒 Private</option>
                  </select>
                </div>

                <textarea
                  value={composerContent}
                  onChange={e => setComposerContent(e?.target?.value)}
                  placeholder={`Share a ${composerType}... Use # for hashtags, @ for mentions`}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 border-0 outline-none resize-none"
                  rows={3}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">+{VP_EARNING?.[composerType]} VP for this {composerType}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowComposer(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleSubmitPost} className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">Post</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Elections Carousel with Filter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">🗳️ Elections Feed</h2>
            </div>
            <CarouselFilterBar
              carouselType="elections"
              onFilterChange={(f) => handleFilterChange('elections', f)}
              className="mb-3"
            />
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm text-gray-500 text-center py-4">
                Elections filtered by: <strong>{filters?.elections?.category}</strong>
                {filters?.elections?.showTrending && ' · Trending Only'}
                {' · Sorted by: '}<strong>{filters?.elections?.sortBy}</strong>
              </p>
            </div>
          </div>

          {/* Posts Feed with Filter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">📝 Posts Feed</h2>
              <ContentModerationBadge score={0.1} status="safe" />
            </div>
            <CarouselFilterBar
              carouselType="posts"
              onFilterChange={(f) => handleFilterChange('posts', f)}
              className="mb-3"
            />

            {loading ? (
              <div className="space-y-3">
                {[1,2,3]?.map(i => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div className="space-y-1 flex-1">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/6" />
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {posts?.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No posts yet. AI moderation is active and filtering content in real-time.</p>
                  </div>
                ) : posts?.map((post, i) => (
                  <div key={post?.id || i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {post?.user_profiles?.name?.[0] || 'U'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{post?.user_profiles?.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{new Date(post.created_at)?.toLocaleDateString()}</p>
                      </div>
                      <ContentModerationBadge score={0.05} status="safe" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{post?.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Jolts Carousel with Filter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">⚡ Jolts Feed</h2>
            </div>
            <CarouselFilterBar
              carouselType="jolts"
              onFilterChange={(f) => handleFilterChange('jolts', f)}
              className="mb-3"
            />
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm text-gray-500 text-center py-4">
                Jolts filtered by: <strong>{filters?.jolts?.category || 'all'}</strong>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnhancedHomeFeedDashboard;
