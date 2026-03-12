import React, { useState, useEffect, useRef, useCallback } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import CreatePostCard from './components/CreatePostCard';
import PostCard from './components/PostCard';


import StoriesCarousel from './components/StoriesCarousel';




import Icon from '../../components/AppIcon';
import { postsService } from '../../services/postsService';
import { electionsService } from '../../services/electionsService';
import { feedRankingService } from '../../services/feedRankingService';
import { enhancedRecommendationService } from '../../services/enhancedRecommendationService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

import SuggestedContentSidebar from './components/SuggestedContentSidebar';
import Premium2DHorizontalSnapCarousel from './components/Premium2DHorizontalSnapCarousel';
import Premium2DVerticalCardStackCarousel from './components/Premium2DVerticalCardStackCarousel';
import Premium2DSmoothGradientFlowCarousel from './components/Premium2DSmoothGradientFlowCarousel';
import PlatformGamificationWidget from '../../components/PlatformGamificationWidget';
import AdSlotRenderer from '../../components/AdSlotRenderer';
import { adSlotManagerService } from '../../services/adSlotManagerService';
import { supabase } from '../../lib/supabase';
import { aiContentModerationService } from '../../services/aiContentModerationService';
import { carouselFeedOrchestrationService } from '../../services/carouselFeedOrchestrationService';
import { momentService } from '../../services/momentService';
import { feedBlendingService } from '../../services/feedBlendingService';







const HomeFeedDashboard = () => {
  const { user, userProfile } = useAuth();
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
  const [page, setPage] = useState(1);
  const [jolts, setJolts] = useState([]);
  const [liveMoments, setLiveMoments] = useState([]);
  const [creatorSpotlights, setCreatorSpotlights] = useState([]);
  const [recommendedGroups, setRecommendedGroups] = useState([]);
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
    loadFeedData();
    loadCarouselData();
    loadAdSlots();

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
          setPosts((prev) => [payload?.new, ...prev]);
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

      if (useAIPersonalization && user?.id) {
        let personalizedFeed = null;
        let feedError = null;

        try {
          const perplexityResult = await enhancedRecommendationService?.generatePersonalizedElectionFeed(user?.id);
          if (perplexityResult?.data?.length) {
            personalizedFeed = perplexityResult?.data;
          }
        } catch (_) { /* Perplexity fallback below */ }

        if (!personalizedFeed?.length) {
          const result = await feedRankingService?.generatePersonalizedFeed(
            user?.id,
            { elections: 6, posts: 10, ads: 2 }
          );
          personalizedFeed = result?.data;
          feedError = result?.error;
        }

        if (feedError) throw new Error(feedError?.message);

        const elections = personalizedFeed?.filter((item) => item?.contentType === 'election' || item?.election_id) || [];
        let feedPosts = personalizedFeed?.filter((item) => item?.contentType === 'post' || item?.post_id) || [];
        feedPosts = await aiContentModerationService?.filterByModeration(feedPosts, 'post') || feedPosts;

        setTrendingElections(elections);

        const { data: sponsoredAds } = await feedBlendingService?.getSponsoredElections(5, userProfile);
        const blendedFeed = feedBlendingService?.blendAdsIntoFeed(feedPosts, sponsoredAds);
        setPosts(blendedFeed);

        analytics?.trackEvent('feed_ai_personalization', {
          user_id: user?.id,
          content_count: personalizedFeed?.length,
          elections_count: elections?.length,
          posts_count: feedPosts?.length
        });
      } else {
        const [postsResult, electionsResult] = await Promise.all([
        postsService?.getAll(50),
        electionsService?.getAll({ status: 'active' })]
        );

        if (postsResult?.error) throw new Error(postsResult.error.message);
        if (electionsResult?.error) throw new Error(electionsResult.error.message);

        let realPosts = postsResult?.data || [];
        realPosts = await aiContentModerationService?.filterByModeration(realPosts, 'post') || realPosts;

        const { data: sponsoredAds } = await feedBlendingService?.getSponsoredElections(5, userProfile);
        const blendedFeed = feedBlendingService?.blendAdsIntoFeed(realPosts, sponsoredAds);
        setPosts(blendedFeed);
        setTrendingElections(electionsResult?.data?.slice(0, 5) || []);

        // Pad with mock posts if fewer than 10 so Premium 2D carousel sections are visible
        if (realPosts?.length < 10) {
          const mockUsers = [
          { name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', verified: true },
          { name: 'Michael Chen', username: 'mchen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', verified: false },
          { name: 'Emily Rodriguez', username: 'emilyrod', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', verified: true },
          { name: 'Alex Thompson', username: 'alexthompson', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', verified: false },
          { name: 'Jessica Lee', username: 'jessicalee', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', verified: true },
          { name: 'David Martinez', username: 'davidm', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', verified: true },
          { name: 'Priya Sharma', username: 'priyas', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_129cc1bf7-1770549812887.png", verified: false },
          { name: 'James Wilson', username: 'jamesw', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_179f49b50-1771889255134.png", verified: false }];

          const mockContents = [
          'Welcome to Vottery! The future of voting is here. Cast your vote and win big! 🗳️✨',
          'Just won $500 on the Tech Innovation Awards election! This platform is amazing 🎰🔥',
          'New Premium 2D feed experience is now live. Snap, swipe, and flow through the content! ✨🎡',
          'Join the community and make your voice count. Every vote matters in shaping our future! 🌍',
          'Exciting new elections launching this week — biggest prize pools yet. Stay tuned! 🚀💰',
          'The Premium 2D winners feed is so satisfying to scroll through 🌊🏆',
          'Found amazing people through the connection suggestions. Swipe right to connect! 🃏👥',
          'The Premium 2D carousel makes browsing live elections feel like spinning a lottery drum! 🎡',
          'Congratulations to all recent winners! Your luck could be next 🏆',
          'Pattern breaking UI keeps your brain engaged. This is next-level social design 🧠⚡',
          'Who else is addicted to the Premium 2D card stack? So smooth 🔥',
          'Just participated in my 50th election on Vottery. The community here is incredible! 🎉',
          'Pro tip: Watch the Live Elections carousel for high-prize-pool jackpots dropping daily 💎',
          'The glassmorphism on the winners ribbon looks stunning on dark mode 🌙✨',
          'Vottery is what happens when you combine Web3 vision with casino-grade UX design 🎲'];

          const needed = 15 - realPosts?.length;
          const padPosts = [];
          for (let i = 0; i < needed; i++) {
            padPosts?.push({
              id: `mock-${i + 1}`,
              content: mockContents?.[i % mockContents?.length],
              userProfiles: mockUsers?.[i % mockUsers?.length],
              createdAt: new Date(Date.now() - (i + 1) * 3600000)?.toISOString(),
              likes_count: Math.floor(Math.random() * 100) + 10,
              comments_count: Math.floor(Math.random() * 30) + 1
            });
          }
          setPosts([...realPosts, ...padPosts]);
        }
      }

      await Promise.all([
      loadLiveElections(),
      loadSuggestedConnections(),
      loadRecentWinners(),
      loadJolts(),
      loadLiveMoments(),
      loadCreatorSpotlights(),
      loadRecommendedGroups(),
      loadRecommendedElections(),
      loadCreatorServices(),
      loadTrendingTopics(),
      loadTopEarners(),
      loadAccuracyChampions()]
      );

      setFriendSuggestions([]);
    } catch (err) {
      console.error('Feed load error (using fallback data):', err?.message);

      // Fallback mock posts so the feed renders with Premium 2D carousels visible
      if (posts?.length === 0) {
        const mockPosts = [];
        const mockUsers = [
        { name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', verified: true },
        { name: 'Michael Chen', username: 'mchen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', verified: false },
        { name: 'Emily Rodriguez', username: 'emilyrod', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', verified: true },
        { name: 'Alex Thompson', username: 'alexthompson', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', verified: false },
        { name: 'Jessica Lee', username: 'jessicalee', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', verified: true },
        { name: 'David Martinez', username: 'davidm', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', verified: true },
        { name: 'Priya Sharma', username: 'priyas', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_129cc1bf7-1770549812887.png", verified: false },
        { name: 'James Wilson', username: 'jamesw', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1366e39b5-1772282854796.png", verified: false }];

        const mockContents = [
        'Welcome to Vottery! The future of voting is here. Cast your vote and win big! 🗳️✨',
        'Just won $500 on the Tech Innovation Awards election! This platform is amazing 🎰🔥',
        'New 3D feed experience is now live. Spin, sift, and flow through the content! ✨🎡',
        'Join the community and make your voice count. Every vote matters in shaping our future! 🌍',
        'Exciting new elections launching this week — biggest prize pools yet. Stay tuned! 🚀💰',
        'The Premium 2D winners feed is so satisfying to scroll through 🌊🏆',
        'Found amazing people through the connection suggestions. Swipe right to connect! 🃏👥',
        'The Kinetic Spindle makes browsing live elections feel like spinning a lottery drum! 🎡',
        'Congratulations to all recent winners! Your luck could be next. Check out active elections 🏆',
        'Pattern breaking UI keeps your brain engaged. This is next-level social design 🧠⚡',
        'Who else is addicted to the 3D card swiping? The isometric deck is pure 🔥',
        'Just participated in my 50th election on Vottery. The community here is incredible! 🎉',
        'Pro tip: Watch the Live Elections spindle for high-prize-pool jackpots dropping daily 💎',
        'The glassmorphism on the winners ribbon looks stunning on dark mode 🌙✨',
        'Vottery is what happens when you combine Web3 vision with casino-grade UX design 🎲'];

        for (let i = 0; i < 15; i++) {
          mockPosts?.push({
            id: `mock-${i + 1}`,
            content: mockContents?.[i],
            userProfiles: mockUsers?.[i % mockUsers?.length],
            createdAt: new Date(Date.now() - i * 3600000)?.toISOString(),
            likes_count: Math.floor(Math.random() * 100) + 10,
            comments_count: Math.floor(Math.random() * 30) + 1
          });
        }
        setPosts(mockPosts);
      }

      analytics?.trackEvent('feed_load_error', {
        error_message: err?.message,
        user_id: user?.id
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCarouselData = () => {
    // Mock data for Premium 2D Carousels
    setJolts([
    { id: 'jolt-1', thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_179f49b50-1771889255134.png", title: 'Epic Election Moment! 🔥', creator: { username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', verified: true }, hashtags: ['voting', 'democracy', 'viral'], views: 125000, likes: 8500, trending: true },
    { id: 'jolt-2', thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_13124a747-1772282855514.png", title: 'Behind the Scenes: Election Setup', creator: { username: 'mchen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', verified: false }, hashtags: ['bts', 'elections', 'tech'], views: 89000, likes: 5200, trending: false },
    { id: 'jolt-3', thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_102e10f12-1767972879469.png", title: 'Community Voting Power!', creator: { username: 'emilyrod', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', verified: true }, hashtags: ['community', 'power', 'vottery'], views: 156000, likes: 12000, trending: true }]
    );

    // liveMoments populated by loadLiveMoments() from momentService

    setCreatorSpotlights([
    { id: 'spotlight-1', name: 'Priya Sharma', username: 'priyas', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_129cc1bf7-1770549812887.png", coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_129cc1bf7-1770549812887.png", verified: true, spotlightReason: 'Top election creator this week with 50K+ participants', followers: 125000, electionsCreated: 47 },
    { id: 'spotlight-2', name: 'James Wilson', username: 'jamesw', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_169916fa9-1772141569552.png", coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1366e39b5-1772282854796.png", verified: false, spotlightReason: 'Rising star in community elections', followers: 45000, electionsCreated: 23 }]
    );

    setRecommendedGroups([
    { id: 'group-1', name: 'Tech Innovators', description: 'Discuss and vote on the latest tech trends', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1e4372bc0-1767885611198.png", memberCount: 12500, activityStatus: 'Very Active', mutualMembers: 8, activeElections: 5, topTopics: ['AI', 'Blockchain', 'Web3'], trending: true },
    { id: 'group-2', name: 'Political Debates', description: 'Engage in meaningful political discussions', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_100d3ab31-1764911172571.png", memberCount: 8900, activityStatus: 'Active', mutualMembers: 3, activeElections: 12, topTopics: ['Politics', 'Policy', 'Democracy'], trending: false }]
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
      const raw = data?.slice(0, 6) || [
      { id: 1, title: 'Tech Innovation Awards 2026', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_149281a78-1768652517652.png", totalVoters: 12543, participationRate: 78, prizePool: 50000 },
      { id: 2, title: 'Best Startup of the Year', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_15f55da15-1766497814585.png", totalVoters: 8932, participationRate: 65, prizePool: 25000 },
      { id: 3, title: 'Community Choice Awards', coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', totalVoters: 15678, participationRate: 82, prizePool: 75000 }];
      const filtered = await aiContentModerationService?.filterByModeration(raw, 'election') || raw;
      setLiveElections(filtered);
    } catch (err) {
      console.error('Failed to load live elections:', err);
    }
  };

  const loadSuggestedConnections = async () => {
    try {
      if (user?.id) {
        const content = await carouselFeedOrchestrationService?.fetchCarouselContent(user?.id);
        const raw = content?.vertical?.suggestedConnections || [];
        const mapped = raw?.map((p) => ({
          id: p?.id,
          name: p?.full_name || p?.name || p?.username || 'User',
          username: p?.username || '',
          avatar: p?.avatar || null,
          verified: !!p?.verified,
          bio: p?.bio || '',
          mutualFriends: 0,
          followers: 0,
          posts: 0,
        })) || [];
        if (mapped?.length > 0) {
          setSuggestedConnections(mapped);
          return;
        }
      }
      const { data } = await supabase?.from('user_profiles')?.select('id, full_name, username, avatar, verified, bio')?.neq('id', user?.id || '')?.limit(10);
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
      setSuggestedConnections(mapped?.length > 0 ? mapped : [
        { id: 1, name: 'Sarah Johnson', username: 'sarahj', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19c52a61d-1769715143844.png", verified: true, bio: 'Tech enthusiast', mutualFriends: 12, followers: 2543, posts: 234 },
        { id: 2, name: 'Michael Chen', username: 'mchen', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_173f72a6e-1772282854943.png", verified: false, bio: 'Entrepreneur', mutualFriends: 8, followers: 1876, posts: 156 },
      ]);
    } catch (err) {
      console.error('Failed to load suggested connections:', err);
    }
  };

  const loadRecentWinners = async () => {
    try {
      setRecentWinners([
      { id: 1, userProfiles: { name: 'Alex Thompson', username: 'alexthompson', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', verified: true }, prizeAmount: 10000, electionTitle: 'Tech Innovation Awards 2026', ticketNumber: '12345', wonAt: new Date()?.toISOString() },
      { id: 2, userProfiles: { name: 'Jessica Lee', username: 'jessicalee', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', verified: false }, prizeAmount: 5000, electionTitle: 'Best Startup of the Year', ticketNumber: '67890', wonAt: new Date(Date.now() - 86400000)?.toISOString() },
      { id: 3, userProfiles: { name: 'David Martinez', username: 'davidm', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', verified: true }, prizeAmount: 15000, electionTitle: 'Community Choice Awards', ticketNumber: '54321', wonAt: new Date(Date.now() - 172800000)?.toISOString() }]
      );
    } catch (err) {
      console.error('Failed to load recent winners:', err);
    }
  };

  const loadJolts = async () => {
    try {
      const raw = [
      { id: 1, title: 'My Bold Political Take 🔥', thumbnail: "https://images.unsplash.com/photo-1722091682618-e39655b25789", duration: 45, views: 234500, likes: 12400, comments: 876, shares: 543, trending: true, hashtags: ['politics', 'trending', 'debate'], creator: { username: 'viralcreator', avatar: 'https://randomuser.me/api/portraits/women/8.jpg', verified: true } },
      { id: 2, title: 'Quick Election Analysis', thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400', duration: 30, views: 156000, likes: 8900, trending: false, hashtags: ['analysis', 'elections'], creator: { username: 'analyticspro', avatar: 'https://randomuser.me/api/portraits/men/9.jpg', verified: true } },
      { id: 3, title: 'Behind the Scenes: Vottery', thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1d55caec6-1767534449072.png", duration: 60, views: 89000, likes: 5600, trending: true, hashtags: ['bts', 'vottery'], creator: { username: 'teamvottery', avatar: 'https://randomuser.me/api/portraits/women/10.jpg', verified: true } }];
      const filtered = await aiContentModerationService?.filterByModeration(raw, 'jolt') || raw;
      setJolts(filtered);
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

  const loadRecommendedGroups = async () => {
    try {
      const content = user?.id ? await carouselFeedOrchestrationService?.fetchCarouselContent(user?.id) : null;
      const raw = content?.vertical?.recommendedGroups;
      if (raw?.length > 0) {
        const mapped = raw?.map((g) => ({
          id: g?.id,
          name: g?.name || g?.title || 'Group',
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
        setRecommendedGroups(mapped);
        return;
      }
      const { data } = await supabase?.from('groups')?.select('*')?.eq('is_active', true)?.limit(10);
      if (data?.length > 0) {
        const mapped = data?.map((g) => ({
          id: g?.id,
          name: g?.name || g?.title || 'Group',
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
        setRecommendedGroups(mapped);
        return;
      }
      setRecommendedGroups([
        { id: 1, name: 'Political Debate Club', description: 'Discuss elections, vote on policies', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1bdbe81c3-1769675101120.png", memberCount: 12847, activeElections: 23, category: 'Politics', privacy: 'public', trending: true, mutualMembers: 5, activityStatus: 'Active today', topTopics: ['Healthcare', 'Economy', 'Education'] },
        { id: 2, name: 'Tech Innovation Hub', description: 'Vote on the best tech startups and innovations', coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_15f55da15-1766497814585.png", memberCount: 8932, activeElections: 15, category: 'Technology', privacy: 'public', trending: false, mutualMembers: 3, activityStatus: 'Active today', topTopics: ['AI', 'Blockchain', 'Startups'] }
      ]);
    } catch (err) {
      console.error('Failed to load recommended groups:', err);
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

  const loadMorePosts = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const offset = posts?.length;
      const { data: morePosts } = await postsService?.getAll(50, offset);
      const newPosts = morePosts || [];

      if (newPosts?.length > 0) {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage(nextPage);
      } else {
        // No more real posts — append mock posts for continuous scrolling
        const mockUsers = [
        { name: 'Luna Park', username: 'lunapark', avatar: 'https://randomuser.me/api/portraits/women/10.jpg', verified: true },
        { name: 'Oliver Reed', username: 'oliverreed', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', verified: false },
        { name: 'Sophie Turner', username: 'sophiet', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', verified: true },
        { name: 'Marcus Cole', username: 'marcusc', avatar: 'https://randomuser.me/api/portraits/men/13.jpg', verified: false },
        { name: 'Ava Chen', username: 'avachen', avatar: 'https://randomuser.me/api/portraits/women/14.jpg', verified: true }];

        const mockContents = [
        'The energy in this community is unmatched. Love seeing so many active voters! 🗳️🔥',
        'Just discovered the Premium 2D carousels — browsing elections has never felt this smooth 🎰',
        'Won my first raffle on Vottery today! The excitement is real 🏆💰',
        'The Premium 2D card stack makes finding new connections so addictive. Great UX! 🃏',
        'Participated in 3 elections today. Democracy + gamification = genius combo 🌟',
        'That fluid winners ribbon at the bottom is pure art. Mesmerizing to watch 🌊',
        'Vottery is redefining what social platforms can feel like. This is the future 🚀',
        'Anyone else love how the horizontal snap clicks into place? So satisfying 👨‍🍳',
        'New election alert! Check out the Community Innovation Awards — huge prize pool 💎',
        'The vertical card stack feels like shuffling real lottery tickets. Brilliant design 🎲'];

        const padPosts = [];
        for (let i = 0; i < 10; i++) {
          padPosts?.push({
            id: `more-mock-${nextPage}-${i}`,
            content: mockContents?.[i],
            userProfiles: mockUsers?.[i % mockUsers?.length],
            createdAt: new Date(Date.now() - (offset + i) * 1800000)?.toISOString(),
            likes_count: Math.floor(Math.random() * 100) + 5,
            comments_count: Math.floor(Math.random() * 25) + 1
          });
        }
        setPosts((prev) => [...prev, ...padPosts]);
        setPage(nextPage);
      }
    } catch (err) {
      console.error('Load more error:', err);
      // Even on error, append mock posts
      const fallbackPosts = [];
      for (let i = 0; i < 5; i++) {
        fallbackPosts?.push({
          id: `fallback-${Date.now()}-${i}`,
          content: ['Exploring new elections today! 🗳️', 'The feed just keeps getting better ✨', 'Vottery community growing strong 💪', 'Another day, another winning opportunity 🎰', 'Love the Premium 2D carousels on this platform 🎡']?.[i],
          userProfiles: { name: ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey']?.[i], username: ['alex', 'jordan', 'taylor', 'morgan', 'casey']?.[i], avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${20 + i}.jpg`, verified: i % 2 === 0 },
          createdAt: new Date(Date.now() - i * 3600000)?.toISOString(),
          likes_count: Math.floor(Math.random() * 50) + 5,
          comments_count: Math.floor(Math.random() * 15) + 1
        });
      }
      setPosts((prev) => [...prev, ...fallbackPosts]);
    } finally {
      setLoadingMore(false);
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading feed...</p>
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HeaderNavigation />
      <div className="flex relative">
        <LeftSidebar />
        <main id="main-content" className="flex-1 pt-20 pb-8 lg:ml-64 xl:ml-72 relative z-10 min-w-0">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex gap-6">
              {/* Main Feed with perspective and scroll snap */}
              <div
                className="flex-1 max-w-[680px] mx-auto relative"
                style={{
                  perspective: '1000px',
                  scrollSnapAlign: 'center'
                }}>
                
                {/* Stories Carousel - Create Moment at start, then live moments */}
                <div data-section-type="stories-carousel" className="mb-6 relative z-0">
                  <StoriesCarousel liveMoments={liveMoments} currentUser={user} />
                </div>

                {/* Create Post */}
                <div data-section-type="create-post" className="mb-6 relative z-0">
                  <CreatePostCard onCreatePost={handleCreatePost} user={user} />
                </div>

                {/* Unified Vertical Feed with Rhythm rhythm 3 Pattern */}
                <div className="space-y-6 relative z-0">
                  {/* Premium 2D Horizontal Snap Carousel - Rhythm rhythm 3 Position 1 */}
                  <div className="mb-8">
                    <Premium2DHorizontalSnapCarousel
                      liveElections={applyCarouselFilter(liveElections, 'elections')}
                      jolts={applyCarouselFilter(jolts, 'jolts')}
                      liveMoments={applyCarouselFilter(liveMoments, 'moments')}
                      creatorSpotlights={applyCarouselFilter(creatorSpotlights, 'creators')}
                      carouselFilters={carouselFilters}
                      onFilterChange={setCarouselFilters}
                      onElectionClick={(election) => {
                        console.log('Election clicked:', election);
                        // Navigate to election details
                      }}
                      onJoltClick={(jolt) => {
                        console.log('Jolt clicked:', jolt);
                        // Open Jolts player
                      }}
                      onMomentClick={(moment) => {
                        console.log('Moment clicked:', moment);
                        // Open Moments viewer
                      }}
                      onCreatorClick={(creator) => {
                        console.log('Creator clicked:', creator);
                        // Navigate to creator profile
                      }} />
                    
                  </div>

                  {/* 1 ad per 7 organic posts - blended feed */}
                  {(() => {
                    const ORGANIC_PER_AD = adSlotManagerService?.getDynamicAdRatio?.(user?.id) || 7;
                    const blended = [];
                    (posts || []).forEach((post, i) => {
                      blended.push({ type: 'post', data: post });
                      if ((i + 1) % ORGANIC_PER_AD === 0 && adSlots?.length > 0) {
                        const adIndex = Math.floor((i + 1) / ORGANIC_PER_AD - 1) % adSlots.length;
                        blended.push({ type: 'ad', data: { ...adSlots[adIndex], currentUser: user } });
                      }
                    });
                    return blended.map((item, idx) =>
                      item.type === 'post' ? (
                        <PostCard
                          key={item.data?.id || `post-${idx}`}
                          post={item.data}
                          currentUser={user}
                          onInteraction={(t) => handlePostInteraction(item.data?.id, t)}
                        />
                      ) : (
                        <AdSlotRenderer
                          key={`ad-${idx}`}
                          slotAllocation={item.data}
                          onAdInteraction={(data) => handleAdInteraction(data?.adId, data?.action)}
                        />
                      )
                    );
                  })()}

                  {/* Premium 2D Vertical Card Stack Carousel - Rhythm rhythm 3 Position 2 */}
                  <div className="my-8">
                    <Premium2DVerticalCardStackCarousel
                      suggestedConnections={suggestedConnections}
                      recommendedGroups={recommendedGroups}
                      recommendedElections={recommendedElections}
                      creatorServices={creatorServices}
                      onConnect={(user) => {
                        console.log('Connect with:', user);
                        // Send friend request
                      }}
                      onSkip={(item) => {
                        console.log('Skipped:', item);
                        // Mark as not interested
                      }}
                      onJoinGroup={(group) => {
                        console.log('Join group:', group);
                        // Join group
                      }}
                      onVoteElection={(election) => {
                        console.log('Vote in election:', election);
                        // Navigate to voting
                      }}
                      onViewService={(service) => {
                        console.log('View service:', service);
                        // Open service details
                      }} />
                    
                  </div>

                  {/* Premium 2D Smooth Gradient Flow Carousel - Rhythm rhythm 3 Position 3 */}
                  <div className="my-8">
                    <Premium2DSmoothGradientFlowCarousel
                      recentWinners={recentWinners}
                      trendingTopics={trendingTopics}
                      topEarners={topEarners}
                      accuracyChampions={accuracyChampions}
                      onWinnerClick={(winner) => {
                        console.log('Winner clicked:', winner);
                        // Show winner details
                      }}
                      onTopicClick={(topic) => {
                        console.log('Topic clicked:', topic);
                        // Navigate to topic feed
                      }}
                      onEarnerClick={(earner) => {
                        console.log('Earner clicked:', earner);
                        // Show earner profile
                      }}
                      onChampionClick={(champion) => {
                        console.log('Champion clicked:', champion);
                        // Show champion stats
                      }} />
                    
                  </div>

                  {/* Load More */}
                  <div className="text-center py-8">
                    <button
                      type="button"
                      onClick={(e) => {e?.preventDefault();e?.stopPropagation();loadMorePosts();}}
                      disabled={loadingMore}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors">
                      
                      <Icon name={loadingMore ? "Loader" : "RefreshCw"} size={18} className={`mr-2 ${loadingMore ? 'animate-spin' : ''}`} />
                      {loadingMore ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="hidden lg:block w-[340px] flex-shrink-0 relative z-0">
                <div className="space-y-4">
                  <PlatformGamificationWidget />
                  <SuggestedContentSidebar />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );


};

export default HomeFeedDashboard;