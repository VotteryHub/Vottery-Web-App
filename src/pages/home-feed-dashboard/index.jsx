import React, { useState, useEffect, useRef, useCallback } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import CreatePostCard from './components/CreatePostCard';
import PostCard from './components/PostCard';


import PremiumMixedCarousel from './components/PremiumMixedCarousel';




import Icon from '../../components/AppIcon';
import { postsService } from '../../services/postsService';
import { electionsService } from '../../services/electionsService';
import { feedBlendingService } from '../../services/feedBlendingService';
import { adSlotManagerService } from '../../services/adSlotManagerService';
import { feedRankingService } from '../../services/feedRankingService';
import { enhancedRecommendationService } from '../../services/enhancedRecommendationService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';

import SuggestedContentSidebar from './components/SuggestedContentSidebar';
import Premium2DHorizontalSnapCarousel from './components/Premium2DHorizontalSnapCarousel';
import Premium2DVerticalCardStackCarousel from './components/Premium2DVerticalCardStackCarousel';
import Premium2DSmoothGradientFlowCarousel from './components/Premium2DSmoothGradientFlowCarousel';
import Premium2DIsometricDepthCarousel from './components/Premium2DIsometricDepthCarousel';
import PlatformGamificationWidget from '../../components/PlatformGamificationWidget';
import AdSlotRenderer from '../../components/AdSlotRenderer';
import { supabase } from '../../lib/supabase';
import { aiContentModerationService } from '../../services/aiContentModerationService';
import { carouselFeedOrchestrationService } from '../../services/carouselFeedOrchestrationService';
import { momentService } from '../../services/momentService';
import { joltsService } from '../../services/joltsService';
import { platformGamificationService } from '../../services/platformGamificationService';
import { analyticsService } from '../../services/analyticsService';
import useFeatureStore from '../../store/useFeatureStore';
import { AppShell } from '../../components/layout/AppShell';
import { PageContainer } from '../../components/layout/PageContainer';
import { ContentGrid } from '../../components/layout/ContentGrid';
import { useBreakpoints } from '../../hooks/useBreakpoints';







const INITIAL_MOCK_USERS = [
  { name: 'Oliver Reed', username: 'oliverreed', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', verified: false },
  { name: 'Sophie Turner', username: 'sophiet', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', verified: true },
  { name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', verified: true },
  { name: 'Michael Chen', username: 'mchen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', verified: false },
  { name: 'Emily Rodriguez', username: 'emilyrod', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', verified: true },
  { name: 'Alex Thompson', username: 'alexthompson', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', verified: false },
  { name: 'Jessica Lee', username: 'jessicalee', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', verified: true },
  { name: 'David Martinez', username: 'davidm', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', verified: true },
];

const INITIAL_MOCK_CONTENTS = [
  'Just discovered the Premium 2D carousels — browsing elections has never felt this smooth 🎰✨',
  'Won my first raffle on Vottery today! The excitement is real 🏆💰',
  'Welcome to Vottery! The future of voting is here. Cast your vote and win big! 🗳️✨',
  'Just won $500 on the Tech Innovation Awards election! This platform is amazing 🎰🔥',
  'Join the community and make your voice count. Every vote matters in shaping our future! 🌍',
  'Exciting new elections launching this week — biggest prize pools yet. Stay tuned! 🚀💰',
  'The Premium 2D winners feed is so satisfying to scroll through 🌊🏆',
  'Found amazing people through the connection suggestions. Swipe right to connect! 🃏👥',
  'The Kinetic Spindle makes browsing live elections feel like spinning a lottery drum! 🎡',
  'Congratulations to all recent winners! Your luck could be next. Check out active elections 🏆',
  'Pattern breaking UI keeps your brain engaged. This is next-level social design 🧠⚡',
  'Who else is addicted to the 3D card swiping? The isometric deck is pure 🔥',
  'Just participated in my 50th election on Vottery. The community here is incredible! 🎉',
  'Pro tip: Watch the Live Elections for high-prize-pool jackpots dropping daily 💎',
  'Vottery is what happens when you combine Web3 vision with casino-grade UX design 🎲',
];

const HomeFeedDashboard = () => {
  const { isMobile, isDesktop } = useBreakpoints();
  const { user, userProfile } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const autoOpenComposer = searchParams.get('create') === 'post';
  const isFeatureEnabled = useFeatureStore(state => state.isFeatureEnabled);

  const [posts, setPosts] = useState([]);
  const [trendingElections, setTrendingElections] = useState([]);
  const [liveElections, setLiveElections] = useState([]);
  const [suggestedConnections, setSuggestedConnections] = useState([]);
  const [recentWinners, setRecentWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [useAIPersonalization, setUseAIPersonalization] = useState(true);
  const [adSlots, setAdSlots] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [jolts, setJolts] = useState([]);
  const [liveMoments, setLiveMoments] = useState([]);
  const [creatorSpotlights, setCreatorSpotlights] = useState([]);
  const [recommendedHubs, setRecommendedHubs] = useState([]);
  const [recommendedElections, setRecommendedElections] = useState([]);
  const [creatorServices, setCreatorServices] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [topEarners, setTopEarners] = useState([]);
  const [accuracyChampions, setAccuracyChampions] = useState([]);
  // Carousel filter state
  const [carouselFilters, setCarouselFilters] = useState({
    elections: { category: 'all', trending: false },
    jolts: { category: 'all', trending: false },
    moments: { category: 'all', trending: false },
    creators: { category: 'all', trending: false }
  });
  const [filterPrefsLoaded, setFilterPrefsLoaded] = useState(false);

  const CAROUSEL_FILTERS_KEY = 'vottery_carousel_filters';

  useEffect(() => {
    const loadFilters = async () => {
      if (user?.id) {
        try {
          const { data } = await supabase?.from('user_preferences')?.select('preferences')?.eq('user_id', user?.id)?.eq('preference_type', 'carousel_filters')?.single();
          if (data?.preferences) {
            setCarouselFilters(prev => ({ ...prev, ...data?.preferences }));
            setFilterPrefsLoaded(true);
            return;
          }
        } catch (_) { /* fallback to localStorage */ }
      }
      try {
        const saved = localStorage?.getItem(CAROUSEL_FILTERS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setCarouselFilters(prev => ({ ...prev, ...parsed }));
        }
      } catch (_) { /* ignore */ }
      setFilterPrefsLoaded(true);
    };
    loadFilters();
  }, [user?.id]);

  useEffect(() => {
    if (!filterPrefsLoaded) return;
    try {
      localStorage?.setItem(CAROUSEL_FILTERS_KEY, JSON.stringify(carouselFilters));
      if (user?.id) {
        supabase?.from('user_preferences')?.upsert({
          user_id: user?.id,
          preference_type: 'carousel_filters',
          preferences: carouselFilters,
          updated_at: new Date()?.toISOString()
        }, { onConflict: 'user_id,preference_type' })?.then(() => {});
      }
    } catch (_) { /* ignore */ }
  }, [carouselFilters, filterPrefsLoaded, user?.id]);

  const applyCarouselFilter = (items, key) => {
    if (!items?.length) return items;
    const f = carouselFilters?.[key];
    if (!f) return items;
    let out = items;
    if (f?.category && f?.category !== 'all') {
      out = out?.filter((i) => (i?.category || i?.hashtags?.[0] || 'all') === f?.category) ?? [];
    }
    if (f?.trending) {
      out = out?.filter((i) => i?.trending === true) ?? [];
    }
    return out?.length ? out : items;
  };

  const loadAdSlots = async () => {
    try {
      // WATERFALL LOGIC: Use adSlotManagerService to get internal ad first, AdSense fallback if empty
      const slotIds = ['home_feed_slot_1', 'home_feed_slot_2'];
      const allocatedSlots = [];

      for (const slotId of slotIds) {
        // Step 1: Try internal participatory ad from sponsored_elections
        const internalAd = await adSlotManagerService?.tryAllocateInternalAd(
          { id: slotId, position: slotId },
          userProfile,
          { page: 'HOME_FEED' }
        );

        if (internalAd) {
          // Internal ad found — render SponsoredElectionCard
          allocatedSlots?.push({
            slotId,
            adSystem: 'internal_participatory',
            adData: internalAd,
            filled: true,
            fallbackUsed: false
          });
          // Track fill rate: internal
          trackAdSlotFill(slotId, 'internal', internalAd?.electionId);
        } else {
          // Step 2: No internal ad — fallback to AdSense only
          const adsenseConfig = adSlotManagerService?.getAdSenseConfig({ id: slotId, position: slotId?.replace('home_feed_', '') });
          allocatedSlots?.push({
            slotId,
            adSystem: 'google_adsense',
            adData: adsenseConfig,
            filled: true,
            fallbackUsed: true
          });
          // Track fill rate: adsense
          trackAdSlotFill(slotId, 'adsense', null);
        }
      }

      // Allocate Right Column Pinned Ad (Desktop Only)
      if (isDesktop) {
        const rightColumnAd = await adSlotManagerService?.tryAllocateInternalAd(
          { id: 'right_column_slot_1', position: 'right_column' },
          userProfile,
          { page: 'RIGHT_COLUMN' }
        );
        
        if (rightColumnAd) {
          allocatedSlots.push({
            slotId: 'right_column_slot_1',
            adSystem: 'internal_participatory',
            adData: rightColumnAd,
            filled: true,
            fallbackUsed: false
          });
        } else {
          const adsenseConfig = adSlotManagerService?.getAdSenseConfig({ id: 'right_column_slot_1', position: 'sidebar' });
          allocatedSlots.push({
            slotId: 'right_column_slot_1',
            adSystem: 'google_adsense',
            adData: adsenseConfig,
            filled: true,
            fallbackUsed: true
          });
        }
      }

      setAdSlots(allocatedSlots);
    } catch (err) {
      console.error('Failed to load ad slots:', err);
      // Fallback: empty slots (no ads rendered)
      setAdSlots([]);
    }
  };

  const trackAdSlotFill = async (slotId, filledBy, electionId) => {
    try {
      await supabase?.from('ad_slot_metrics')?.insert({
        slot_id: slotId,
        filled_by: filledBy,
        election_id: electionId || null,
        user_id: user?.id || null,
        page_context: 'home_feed',
        session_id: sessionStorage?.getItem('session_id') || null,
        timestamp: new Date()?.toISOString()
      });
    } catch (err) {
      // Non-critical — don't block feed loading
      console.warn('Failed to track ad slot fill:', err);
    }
  };

  useEffect(() => {
    // Always load feed data; it handles auth-check internally and manages loading state
    loadFeedData();
    loadCarouselData();
    
    if (user?.id) {
      loadAdSlots();
    }

    // Track page view
    analytics?.trackEvent('page_view', {
      page_name: 'home_feed_dashboard',
      user_id: user?.id
    });

    let unsubscribePosts = () => {};
    let unsubscribeElections = () => {};

    try {
      unsubscribePosts = postsService?.subscribeToFeed((payload) => {
        if (payload?.eventType === 'INSERT') {
          setPosts((prev) => {
            if (prev?.some(p => p?.id === payload?.new?.id)) return prev;
            return [{ ...payload?.new, _type: 'organic' }, ...prev];
          });
          analytics?.trackEvent('feed_new_post', { post_id: payload?.new?.id, user_id: user?.id });
        } else if (payload?.eventType === 'UPDATE') {
          setPosts((prev) => prev?.map((p) => p?.id === payload?.new?.id ? payload?.new : p));
        } else if (payload?.eventType === 'DELETE') {
          setPosts((prev) => prev?.filter((p) => p?.id !== payload?.old?.id));
        }
      }) || (() => {});
      unsubscribeElections = electionsService?.subscribeToElections((payload) => {
        if (payload?.eventType === 'INSERT' || payload?.eventType === 'UPDATE') {
          loadTrendingElections();
          loadLiveElections();
        }
      }) || (() => {});
    } catch (err) {
      console.error('Realtime subscription error:', err);
    }

    return () => {
      unsubscribePosts();
      unsubscribeElections();
    };
  }, [user]);

  const loadFeedData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 8-second absolute fail-safe timeout
      const failSafeTimeout = setTimeout(() => {
        console.warn('[HomeFeed] Fail-safe timeout triggered. Forcing loading to false.');
        setLoading(false);
      }, 8000);

      // Main loading logic
      try {
        if (!user?.id) {
          const mockPosts = INITIAL_MOCK_CONTENTS.map((content, i) => ({
            id: `mock-${i + 1}`,
            content,
            userProfiles: INITIAL_MOCK_USERS[i % INITIAL_MOCK_USERS.length],
            createdAt: new Date(Date.now() - i * 3600000).toISOString(),
            likes_count: Math.floor(Math.random() * 100) + 10,
            comments_count: Math.floor(Math.random() * 30) + 1,
          }));
          setPosts(mockPosts);
          setLoading(false);
          clearTimeout(failSafeTimeout);
          
          // Background loaders
          Promise.allSettled([
            loadLiveElections(),
            loadSuggestedConnections(),
            loadRecentWinners(),
          ]);
          return;
        }

        // Authenticated path
        let feedData = [];
        if (useAIPersonalization) {
          try {
            const res = await feedRankingService?.generatePersonalizedFeed(user.id, { elections: 6, posts: 15 });
            feedData = res?.data || [];
          } catch (e) {
            console.warn('[HomeFeed] AI Feed failed:', e);
          }
        }

        if (!feedData.length) {
          const res = await postsService?.getAll(30);
          feedData = res?.data || [];
        }

        const moderatedFeed = await aiContentModerationService?.filterByModeration(feedData, 'post') || feedData;
        const slots = await adSlotManagerService?.allocateAdSlots('HOME_FEED', userProfile);
        const finalFeed = feedBlendingService?.blendAdsIntoFeed(moderatedFeed, slots) || moderatedFeed;

        setPosts(finalFeed);

        // Pad if needed
        if (finalFeed.length < 10) {
          const needed = 10 - finalFeed.length;
          const pad = INITIAL_MOCK_CONTENTS.slice(0, needed).map((c, i) => ({
            id: `pad-${i}`,
            content: c,
            userProfiles: INITIAL_MOCK_USERS[i % INITIAL_MOCK_USERS.length],
            createdAt: new Date().toISOString(),
            likes_count: 5,
            comments_count: 0
          }));
          setPosts(prev => [...prev, ...pad]);
        }

        // Fire-and-forget secondary data
        Promise.allSettled([
          loadLiveElections(),
          loadJolts(),
          loadLiveMoments(),
          loadRecentWinners(),
          loadSuggestedConnections(),
          loadRecommendedHubs(),
          loadRecommendedElections(),
          loadAdSlots()
        ]);

      } catch (innerErr) {
        console.error('[HomeFeed] Data fetch error:', innerErr);
        setError('Connection interrupted. Synchronizing with local cache...');
      } finally {
        setLoading(false);
        clearTimeout(failSafeTimeout);
      }

    } catch (err) {
      console.error('[HomeFeed] Fatal load error:', err);
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || loadingMore || !nextCursor) return;
    try {
      setLoadingMore(true);
      const { data: newPosts, nextCursor: cursor, hasMore: more } = await postsService?.getAll(10, nextCursor);
      setPosts(prev => [...prev, ...newPosts]);
      setNextCursor(cursor);
      setHasMore(more);
    } catch (err) {
      console.error('Failed to load more posts:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadCarouselData = () => {
    // Mock data for Premium 2D Carousels
    setJolts([
    { id: 'jolt-1', thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_179f49b50-1771889255134.png", title: 'Epic Election Moment! 🔥', creator: { username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', verified: true }, hashtags: ['voting', 'democracy', 'viral'], views: 125000, likes: 8500, trending: true },
    { id: 'jolt-2', thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_13124a747-1772282855514.png", title: 'Behind the Scenes: Election Setup', creator: { username: 'mchen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', verified: false }, hashtags: ['bts', 'elections', 'tech'], views: 89000, likes: 5200, trending: false },
    { id: 'jolt-3', thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_102e10f12-1767972879469.png", title: 'Community Voting Power!', creator: { username: 'emilyrod', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', verified: true }, hashtags: ['community', 'power', 'vottery'], views: 156000, likes: 12000, trending: true }]
    );

    setCreatorSpotlights([
    { id: 'spotlight-1', name: 'Priya Sharma', username: 'priyas', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_129cc1bf7-1770549812887.png", coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_129cc1bf7-1770549812887.png", verified: true, spotlightReason: 'Top election creator this week with 50K+ participants', followers: 125000, electionsCreated: 47 },
    { id: 'spotlight-2', name: 'James Wilson', username: 'jamesw', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_169916fa9-1772141569552.png", coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1366e39b5-1772282854796.png", verified: false, spotlightReason: 'Rising star in community elections', followers: 45000, electionsCreated: 23 }]
    );

    setRecommendedHubs([
    { id: 'hub-1', name: 'Tech Innovators', description: 'Discuss and vote on the latest tech trends', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1e4372bc0-1767885611198.png", memberCount: 12500, activityStatus: 'Very Active', mutualMembers: 8, activeElections: 5, topTopics: ['AI', 'Blockchain', 'Web3'], trending: true },
    { id: 'hub-2', name: 'Political Debates', description: 'Engage in meaningful political discussions', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_100d3ab31-1764911172571.png", memberCount: 8900, activityStatus: 'Active', mutualMembers: 3, activeElections: 12, topTopics: ['Politics', 'Policy', 'Democracy'], trending: false }]
    );

    setRecommendedElections([
    { id: 'rec-election-1', title: 'Best AI Tool of 2026', category: 'Technology', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_14e36dc89-1764658951918.png", matchScore: 94, prizePool: 25000, participantCount: 5600, timeRemaining: '2d left', recommendationReason: 'Based on your interest in AI and technology' },
    { id: 'rec-election-2', title: 'Community Choice Awards', category: 'Entertainment', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_104f3abc5-1771889258077.png", matchScore: 87, prizePool: 15000, participantCount: 8900, timeRemaining: '5d left', recommendationReason: 'Popular in your network' }]
    );

    setCreatorServices([
    { id: 'service-1', serviceName: 'Custom Election Design', creator: { username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', verified: true }, description: 'Professional election setup with custom branding and analytics', portfolioImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1050e6c44-1772282855324.png", rating: 4.9, reviewCount: 127, price: 499 },
    { id: 'service-2', serviceName: 'Social Media Promotion', creator: { username: 'mchen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', verified: false }, description: 'Boost your election reach with targeted campaigns', portfolioImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1151d7413-1767072447162.png", rating: 4.7, reviewCount: 89, price: 299 }]
    );

    setTrendingTopics([
    { id: 'topic-1', hashtag: '#AI2026', trendScore: 98, postCount: 45600, growthRate: '+125%' },
    { id: 'topic-2', hashtag: '#Election2026', trendScore: 95, postCount: 38900, growthRate: '+89%' },
    { id: 'topic-3', hashtag: '#CommunityVoting', trendScore: 87, postCount: 28500, growthRate: '+67%' }]
    );

    setTopEarners([
    { id: 'earner-1', rank: 1, user: { name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' }, earnings: 125000, growthPercentage: 45 },
    { id: 'earner-2', rank: 2, user: { name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' }, earnings: 98000, growthPercentage: 32 },
    { id: 'earner-3', rank: 3, user: { name: 'Emily Rodriguez', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' }, earnings: 87000, growthPercentage: 28 }]
    );

    setAccuracyChampions([
    { id: 'champion-1', user: { name: 'Alex Thompson', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', verified: true }, accuracyScore: 94.7, totalPredictions: 247, winningStreak: 12, specialization: 'Political Predictions' },
    { id: 'champion-2', user: { name: 'Jessica Lee', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', verified: false }, accuracyScore: 92.3, totalPredictions: 189, winningStreak: 8, specialization: 'Tech Trends' }]
    );
  };

  const loadLiveElections = async () => {
    try {
      const { data } = await electionsService?.getAll({ status: 'active', isLive: true });
      const filtered = await aiContentModerationService?.filterByModeration(data || [], 'election') || data || [];
      setLiveElections(filtered);
    } catch (err) {
      console.error('Failed to load live elections:', err);
    }
  };

  const loadSuggestedConnections = async () => {
    try {
      if (!user?.id) return;
      const { data } = await supabase?.from('user_profiles')?.select('id, full_name, username, avatar, verified, bio')?.neq('id', user.id)?.limit(10);
      const mapped = (data || [])?.map((p) => ({
        id: p?.id,
        name: p?.full_name || p?.username || 'User',
        username: p?.username || '',
        avatar: p?.avatar || null,
        verified: !!p?.verified,
        bio: p?.bio || '',
        mutualFriends: 0,
        followers: 0,
        posts: 0,
      }));
      setSuggestedConnections(mapped);
    } catch (err) {
      console.error('Failed to load suggested connections:', err);
    }
  };

  const loadRecentWinners = async () => {
    try {
      const { data } = await supabase?.from('platform_gamification_winners')?.select(`
        *,
        user_profiles!inner(full_name, username, avatar, verified),
        campaign:campaign_id(title)
      `)?.order('created_at', { ascending: false })?.limit(10);
      
      const mapped = (data || [])?.map(w => ({
        id: w.id,
        userProfiles: {
          name: w.user_profiles?.full_name || w.user_profiles?.username,
          username: w.user_profiles?.username,
          avatar: w.user_profiles?.avatar,
          verified: w.user_profiles?.verified
        },
        prizeAmount: w.prize_amount,
        electionTitle: w.campaign?.title || 'Monthly Draw',
        ticketNumber: w.id.slice(0, 8).toUpperCase(),
        wonAt: w.created_at
      }));
      setRecentWinners(mapped);
    } catch (err) {
      console.error('Failed to load recent winners:', err);
    }
  };

  const loadJolts = async () => {
    try {
      const { data: raw } = await joltsService.getAll({ trending: true });
      const filtered = await aiContentModerationService?.filterByModeration(raw, 'jolt') || raw;
      setJolts(filtered || []);
    } catch (err) {
      console.error('Failed to load jolts:', err);
    }
  };

  const loadLiveMoments = async () => {
    try {
      const res = await momentService?.getMoments(20);
      const moments = res?.data;
      if (moments?.length > 0) {
        const creatorIds = [...new Set(moments?.map((m) => m?.creatorId))?.filter(Boolean)];
        const { data: profiles } = await supabase?.from('user_profiles')?.select('id, username, avatar, full_name')?.in('id', creatorIds);
        const profileMap = (profiles || [])?.reduce((acc, p) => ({ ...acc, [p?.id]: p }), {});
        const byCreator = {};
        moments?.forEach((m) => {
          const cid = m?.creatorId;
          if (!byCreator[cid]) byCreator[cid] = { id: cid, creator: profileMap[cid] || { username: 'user', avatar: null }, momentsCount: 0, isViewed: false, timeRemaining: '24h left', hasInteractive: false };
          byCreator[cid].momentsCount += 1;
        });
        const list = Object.values(byCreator)?.map((c) => ({
          ...c,
          creator: { username: c?.creator?.username || 'user', avatar: c?.creator?.avatar },
        }));
        const filtered = await aiContentModerationService?.filterByModeration(list, 'post') || list;
        setLiveMoments(filtered);
        return;
      }
      const fallback = [
        { id: 1, creator: { username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' }, momentsCount: 5, isViewed: false, timeRemaining: '18h left', hasInteractive: true },
        { id: 2, creator: { username: 'mchen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' }, momentsCount: 3, isViewed: false, timeRemaining: '12h left', hasInteractive: false },
      ];
      setLiveMoments(fallback);
    } catch (err) {
      console.error('Failed to load live moments:', err);
    }
  };

  const loadCreatorSpotlights = async () => {
    try {
      setCreatorSpotlights([
      { id: 1, name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', verified: true, coverImage: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400', spotlightReason: 'Top Earner This Week', followers: 15420, earnings: 25000, featuredContent: { title: 'Tech Innovation Awards' } },
      { id: 2, name: 'Michael Chen', username: 'mchen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', verified: true, coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400', spotlightReason: 'Most Engaged Creator', followers: 12300, earnings: 18500, featuredContent: { title: 'Community Choice Awards' } }]
      );
    } catch (err) {
      console.error('Failed to load creator spotlights:', err);
    }
  };

  const loadRecommendedHubs = async () => {
    try {
      const content = user?.id ? await carouselFeedOrchestrationService?.fetchCarouselContent(user?.id) : null;
      const raw = content?.vertical?.recommendedHubs;
      if (raw?.length > 0) {
        const mapped = raw?.map((g) => ({
          id: g?.id,
          name: g?.name || g?.title || 'Hub',
          description: g?.description || '',
          coverImage: g?.cover_image || g?.coverImage || g?.avatar_url,
          memberCount: g?.member_count ?? g?.memberCount ?? 0,
          activeElections: g?.active_elections ?? g?.activeElections ?? 0,
          category: g?.category || '',
          privacy: g?.privacy || 'public',
          trending: !!g?.trending,
          mutualMembers: g?.mutual_members ?? g?.mutualMembers ?? 0,
          activityStatus: g?.activity_status || g?.activityStatus || 'Active',
          topTopics: g?.top_topics || g?.topTopics || []
        }));
        setRecommendedHubs(mapped);
        return;
      }
      const { data } = await supabase?.from('groups')?.select('*')?.eq('is_active', true)?.limit(10);
      if (data?.length > 0) {
        const mapped = data?.map((g) => ({
          id: g?.id,
          name: g?.name || g?.title || 'Hub',
          description: g?.description || '',
          coverImage: g?.cover_image || g?.coverImage,
          memberCount: g?.member_count ?? 0,
          activeElections: g?.active_elections ?? 0,
          category: g?.category || '',
          privacy: g?.privacy || 'public',
          trending: !!g?.trending,
          mutualMembers: 0,
          activityStatus: 'Active',
          topTopics: []
        }));
        setRecommendedHubs(mapped);
        return;
      }
      setRecommendedHubs([
        { id: 1, name: 'Political Debate Club', description: 'Discuss elections, vote on policies', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1bdbe81c3-1769675101120.png", memberCount: 12847, activeElections: 23, category: 'Politics', privacy: 'public', trending: true, mutualMembers: 5, activityStatus: 'Active today', topTopics: ['Healthcare', 'Economy', 'Education'] },
        { id: 2, name: 'Tech Innovation Hub', description: 'Vote on the best tech startups and innovations', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_15f55da15-1766497814585.png", memberCount: 8932, activeElections: 15, category: 'Technology', privacy: 'public', trending: false, mutualMembers: 3, activityStatus: 'Active today', topTopics: ['AI', 'Blockchain', 'Startups'] }
      ]);
    } catch (err) {
      console.error('Failed to load recommended hubs:', err);
    }
  };

  const loadRecommendedElections = async () => {
    try {
      setRecommendedElections([
      { id: 1, title: 'Best Marvel Movie of All Time', coverImage: "https://images.unsplash.com/photo-1587361989505-69655b358d26", category: 'Entertainment', matchScore: 87, prizePool: 1000, participantCount: 543, timeRemaining: '2 days left', recommendedReason: 'Based on your interest in Movies' },
      { id: 2, title: 'Future of AI Technology', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_12c2cd622-1767907914733.png", category: 'Technology', matchScore: 92, prizePool: 2500, participantCount: 1234, timeRemaining: '5 days left', recommendedReason: 'Matches your tech interests' }]
      );
    } catch (err) {
      console.error('Failed to load recommended elections:', err);
    }
  };

  const loadCreatorServices = async () => {
    try {
      setCreatorServices([
      { id: 1, creator: { name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', verified: true }, serviceType: 'Sponsored Election Creation', description: 'Professional election setup with guaranteed engagement', priceRange: '$500-$2000', rating: 4.8, completedProjects: 47, portfolioSamples: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200', 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200'] },
      { id: 2, creator: { name: 'Michael Chen', username: 'mchen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', verified: true }, serviceType: 'Content Strategy Consulting', description: 'Boost your election engagement with proven strategies', priceRange: '$300-$1500', rating: 4.9, completedProjects: 62, portfolioSamples: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200'] }]
      );
    } catch (err) {
      console.error('Failed to load creator services:', err);
    }
  };

  const loadTrendingTopics = async () => {
    try {
      setTrendingTopics([
      { id: 1, hashtag: '#Election2024', trendScore: 94.2, postCount: 12847, growthRate: '+342%', topElection: { title: 'Who Will Win 2024?', votes: 45000 }, relatedTopics: ['#Politics', '#Democracy'] },
      { id: 2, hashtag: '#TechInnovation', trendScore: 87.5, postCount: 8932, growthRate: '+215%', topElection: { title: 'Best Startup 2024', votes: 23000 }, relatedTopics: ['#AI', '#Blockchain'] },
      { id: 3, hashtag: '#CommunityChoice', trendScore: 91.3, postCount: 15678, growthRate: '+428%', topElection: { title: 'Community Awards', votes: 67000 }, relatedTopics: ['#Voting', '#Democracy'] }]
      );
    } catch (err) {
      console.error('Failed to load trending topics:', err);
    }
  };

  const loadTopEarners = async () => {
    try {
      setTopEarners([
      { id: 1, rank: 1, user: { name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', verified: true }, earningsThisMonth: 15420, earningsGrowth: '+23%', topContent: 'Presidential Primary Pool', totalFollowers: 234000 },
      { id: 2, rank: 2, user: { name: 'Michael Chen', username: 'mchen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', verified: true }, earningsThisMonth: 12300, earningsGrowth: '+18%', topContent: 'Tech Innovation Awards', totalFollowers: 187000 },
      { id: 3, rank: 3, user: { name: 'Emily Rodriguez', username: 'emilyrod', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', verified: true }, earningsThisMonth: 10850, earningsGrowth: '+15%', topContent: 'Community Choice Awards', totalFollowers: 156000 }]
      );
    } catch (err) {
      console.error('Failed to load top earners:', err);
    }
  };

  const loadAccuracyChampions = async () => {
    try {
      setAccuracyChampions([
      { id: 1, user: { name: 'Alex Thompson', username: 'alexthompson', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', verified: true }, accuracyScore: 94.7, totalPredictions: 247, winningStreak: 12, specialization: 'Political Predictions', avgBrierScore: 0.053 },
      { id: 2, user: { name: 'Jessica Lee', username: 'jessicalee', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', verified: false }, accuracyScore: 92.3, totalPredictions: 189, winningStreak: 8, specialization: 'Sports Predictions', avgBrierScore: 0.067 },
      { id: 3, user: { name: 'David Martinez', username: 'davidm', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', verified: true }, accuracyScore: 91.8, totalPredictions: 312, winningStreak: 15, specialization: 'Entertainment Predictions', avgBrierScore: 0.071 }]
      );
    } catch (err) {
      console.error('Failed to load accuracy champions:', err);
    }
  };

  const loadTrendingElections = async () => {
    try {
      const { data } = await electionsService?.getAll({ status: 'active' });
      setTrendingElections(data?.slice(0, 5) || []);
    } catch (err) {
      console.error('Failed to load trending elections:', err);
    }
  };



  const handleCreatePost = async (postContent) => {
    try {
      const { data, error: postError } = await postsService?.create({
        content: postContent,
        image: null,
        imageAlt: null
      });

      if (postError) throw new Error(postError.message);

      // Optimistic update to ensure immediate visibility
      const newPost = { 
        ...data, 
        userProfiles: userProfile || { name: user?.email?.split('@')[0], username: user?.email?.split('@')[0], avatar: null }, 
        _type: 'organic' 
      };
      setPosts((prev) => [newPost, ...prev]);

      analytics?.trackEvent('post_created', {
        post_id: data?.id,
        user_id: user?.id,
        content_length: postContent?.length
      });
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handlePostInteraction = async (postId, interactionType) => {
    try {
      await feedRankingService?.learnFromUserInteraction(
        user?.id,
        postId,
        'post',
        interactionType
      );

      analytics?.trackEvent('feed_post_interaction', {
        post_id: postId,
        interaction_type: interactionType,
        user_id: user?.id
      });
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  };

  const handleElectionInteraction = async (electionId, interactionType) => {
    try {
      await feedRankingService?.learnFromUserInteraction(
        user?.id,
        electionId,
        'election',
        interactionType
      );

      analytics?.trackElectionEngagement(electionId, interactionType, 'home_feed');
    } catch (err) {
      console.error('Failed to track election interaction:', err);
    }
  };

  const handleUpdatePost = async (postId, updatedContent) => {
    try {
      const { data, error: updateError } = await postsService?.update(postId, updatedContent);
      if (updateError) throw new Error(updateError.message);

      setPosts((prev) => prev?.map((p) => p?.id === postId ? data : p));

      analytics?.trackEvent('post_updated', {
        post_id: postId,
        user_id: user?.id
      });
    } catch (err) {
      console.error('Failed to update post:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const { error: deleteError } = await postsService?.delete(postId);
      if (deleteError) throw new Error(deleteError.message);

      setPosts((prev) => prev?.filter((p) => p?.id !== postId));

      analytics?.trackEvent('post_deleted', {
        post_id: postId,
        user_id: user?.id
      });
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleAdInteraction = async (adId, interactionType) => {
    try {
      analytics?.trackEvent('ad_interaction', {
        ad_id: adId,
        interaction_type: interactionType,
        user_id: user?.id
      });
    } catch (err) {
      console.error('Failed to track ad interaction:', err);
    }
  };

  const handleConnect = async (connection) => {
    console.log('Connecting with:', connection);
    analytics?.trackEvent('connection_accepted', {
      connection_id: connection?.id,
      user_id: user?.id
    });
  };

  const handleRemoveConnection = async (connection) => {
    console.log('Removing connection:', connection);
    analytics?.trackEvent('connection_rejected', {
      connection_id: connection?.id,
      user_id: user?.id
    });
  };

  const handleElectionClick = (election) => {
    window.location.href = `/secure-voting-interface?election=${election?.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center animate-pulse-soft">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6 animate-float">
            <Icon name="Loader" size={32} className="animate-spin text-white" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Vottery Feed</p>
        </div>
      </div>);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md text-center">
          <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={loadFeedData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>);

  }

  return (
    <GeneralPageLayout title="Home Feed" showSidebar={true}>
      <div className="w-full py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Feed Content */}
          <main className="min-w-0 space-y-6">
            {/* Live Content Discovery Strip – Live Elections / Jolts / Moments / Spotlights */}
            <div className="animate-in fade-in slide-in-from-top-6 duration-500">
              <PremiumMixedCarousel />
            </div>

            {/* Composer & Blended Feed */}
            <div className="space-y-6">
              <CreatePostCard user={userProfile || user} onCreatePost={handleCreatePost} autoOpen={autoOpenComposer} />
              
              <div className="space-y-6">
                {posts?.map((item, index) => (
                  <React.Fragment key={item?.id || index}>
                    {item?._type === 'ad' ? (
                      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <AdSlotRenderer
                          slotId={item?.slotId}
                          adData={adSlots?.find(s => s?.slotId === item?.slotId)?.adData}
                          adSystem={adSlots?.find(s => s?.slotId === item?.slotId)?.adSystem}
                        />
                      </div>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                        <PostCard
                          post={item}
                          currentUser={user}
                          onUpdate={handleUpdatePost}
                          onDelete={handleDeletePost}
                          onInteraction={(type) => handlePostInteraction(item?.id, type)}
                        />
                      </div>
                    )}
                    
                    {/* Discovery Layer Injections */}
                    {index === 3 && (
                      <div className="py-6 animate-in fade-in duration-1000">
                        <Premium2DSmoothGradientFlowCarousel
                          title="Recommended Hubs"
                          items={recommendedHubs}
                          isLoading={loading}
                          filterState={carouselFilters?.elections}
                          onFilterChange={(f) => setCarouselFilters(p => ({ ...p, elections: { ...p?.elections, ...f } }))}
                        />
                      </div>
                    )}

                    {index === 6 && (
                      <div className="py-6 animate-in fade-in duration-1000">
                        <Premium2DIsometricDepthCarousel
                          title="Creator Spotlights"
                          items={creatorSpotlights}
                          isLoading={loading}
                          filterState={carouselFilters?.creators}
                          onFilterChange={(f) => setCarouselFilters(p => ({ ...p, creators: { ...p?.creators, ...f } }))}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {loadingMore && (
                  <div className="flex justify-center py-10">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                
                {!hasMore && posts?.length > 0 && (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon name="Check" size={32} className="text-slate-500" />
                    </div>
                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest">
                      You're all caught up in the matrix
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Right Sidebar – Intelligence Layer */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide pb-8">
              {/* Suggested For You */}
              <SuggestedContentSidebar
                connections={suggestedConnections}
                winners={recentWinners}
                hubs={recommendedHubs}
                topics={trendingTopics}
                loading={loading}
              />
              
              {/* Accuracy Champions */}
              <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon name="TrendingUp" size={64} />
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white mb-5 uppercase tracking-tight flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Accuracy Champions
                </h3>
                <div className="space-y-3">
                  {accuracyChampions?.slice(0, 3)?.map((champ, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-[10px] font-black">
                          #{i + 1}
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{champ?.user?.name}</span>
                      </div>
                      <span className="text-xs font-black text-emerald-500">{champ?.accuracyScore}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Earners */}
              <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-indigo-500/20 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon name="DollarSign" size={64} />
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white mb-5 uppercase tracking-tight flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Top Earners
                </h3>
                <div className="space-y-3">
                  {topEarners?.slice(0, 3)?.map((earner, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black">
                          #{i + 1}
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{earner?.user?.name}</span>
                      </div>
                      <span className="text-xs font-black text-primary">${(earner?.earnings / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column Ad Slot (Desktop only) */}
              {adSlots?.find(s => s?.slotId === 'right_column_slot_1') && (
                <div className="rounded-2xl overflow-hidden">
                  <AdSlotRenderer
                    slotId="right_column_slot_1"
                    adData={adSlots?.find(s => s?.slotId === 'right_column_slot_1')?.adData}
                    adSystem={adSlots?.find(s => s?.slotId === 'right_column_slot_1')?.adSystem}
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl shadow-blue-500/40 flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
        >
          <Icon name="Plus" size={28} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>
    </GeneralPageLayout>
  );
};

export default HomeFeedDashboard;