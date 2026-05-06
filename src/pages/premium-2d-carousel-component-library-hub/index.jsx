import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import PremiumHorizontalSnap from '../../components/carousels/PremiumHorizontalSnap';
import PremiumVerticalStack from '../../components/carousels/PremiumVerticalStack';
import PremiumGradientFlow from '../../components/carousels/PremiumGradientFlow';
import HorizontalSnapConfig from './components/HorizontalSnapConfig';
import VerticalStackConfig from './components/VerticalStackConfig';
import GradientFlowConfig from './components/GradientFlowConfig';
import SharedUtilitiesConfig from './components/SharedUtilitiesConfig';
import LivePreviewPanel from './components/LivePreviewPanel';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Premium2DCarouselComponentLibraryHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('horizontal');
  const [loading, setLoading] = useState(true);

  // Horizontal Snap Data
  const [liveElections, setLiveElections] = useState([]);
  const [jolts, setJolts] = useState([]);
  const [liveMoments, setLiveMoments] = useState([]);
  const [creatorSpotlights, setCreatorSpotlights] = useState([]);

  // Vertical Stack Data
  const [suggestedConnections, setSuggestedConnections] = useState([]);
  const [recommendedHubs, setRecommendedHubs] = useState([]);
  const [recommendedElections, setRecommendedElections] = useState([]);
  const [creatorServices, setCreatorServices] = useState([]);

  // Gradient Flow Data
  const [recentWinners, setRecentWinners] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [topEarners, setTopEarners] = useState([]);
  const [accuracyChampions, setAccuracyChampions] = useState([]);

  // Configuration States
  const [horizontalConfig, setHorizontalConfig] = useState({
    cardWidth: 320,
    cardGap: 16,
    enableParallax: true,
    enableHaptic: true,
    casinoTheme: true,
    snapPhysics: { stiffness: 400, damping: 35 }
  });

  const [verticalConfig, setVerticalConfig] = useState({
    swipeThreshold: 150,
    enableHaptic: true,
    enableParticles: true,
    cardStackOffset: 15,
    exitAnimation: 'tinder'
  });

  const [gradientConfig, setGradientConfig] = useState({
    blobWidth: 120,
    enableHaptic: true,
    enableMetaballs: true,
    viscousPhysics: { stiffness: 80, damping: 40, mass: 2 },
    gradientColors: ['from-purple-900/40', 'via-indigo-900/50', 'to-blue-900/40']
  });

  const [sharedUtilities, setSharedUtilities] = useState({
    hapticPatterns: {
      light: [10],
      medium: [20],
      heavy: [30, 10, 30],
      snap: [15, 5, 15],
      swipe: [25]
    },
    parallaxSpeed: 0.5,
    casinoTheme: true
  });

  useEffect(() => {
    loadCarouselData();
    setupRealtimeSubscriptions();
  }, []);

  const loadCarouselData = async () => {
    try {
      setLoading(true);

      // Load Horizontal Snap content
      const { data: electionsData } = await supabase?.from('elections')?.select('*, user_profiles(*)')?.eq('status', 'active')?.limit(10);

      setLiveElections(electionsData || []);

      // Mock data for Jolts (video content)
      setJolts([
      {
        id: 'jolt-1',
        title: 'Breaking: Election Results Live!',
        thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_111576b55-1764700840313.png",
        videoUrl: 'https://example.com/video1.mp4',
        creator: {
          username: 'newscaster',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
          verified: true
        },
        hashtags: ['breaking', 'election', 'live'],
        views: 125000,
        likes: 8500,
        trending: true
      },
      {
        id: 'jolt-2',
        title: 'Top 10 Voting Tips for 2026',
        thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_10a8eba1c-1767889042228.png",
        videoUrl: 'https://example.com/video2.mp4',
        creator: {
          username: 'voteexpert',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
          verified: false
        },
        hashtags: ['voting', 'tips', 'democracy'],
        views: 89000,
        likes: 5200,
        trending: false
      }]
      );

      // Mock data for Live Moments (stories)
      setLiveMoments([
      {
        id: 'moment-1',
        username: 'politicalnews',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        expiresAt: new Date(Date.now() + 18 * 3600000)?.toISOString(),
        momentsCount: 5,
        viewed: false,
        hasInteractive: true
      },
      {
        id: 'moment-2',
        username: 'electionwatch',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        expiresAt: new Date(Date.now() + 12 * 3600000)?.toISOString(),
        momentsCount: 3,
        viewed: true,
        hasInteractive: false
      }]
      );

      // Mock data for Creator Spotlights
      setCreatorSpotlights([
      {
        id: 'spotlight-1',
        name: 'Sarah Johnson',
        username: 'sarahj',
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1704dd415-1769536163185.png",
        verified: true,
        spotlightReason: 'Top Election Creator of the Month',
        followers: 125000,
        featuredContent: 'Political Analysis Series'
      }]
      );

      // Load Vertical Stack content
      const { data: profilesData } = await supabase?.from('user_profiles')?.select('*')?.neq('user_id', user?.id)?.limit(10);

      setSuggestedConnections(profilesData?.map((p) => ({
        id: p?.user_id,
        name: p?.name || 'Anonymous User',
        username: p?.username || 'user',
        avatar: p?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
        verified: p?.verified || false,
        bio: p?.bio || 'No bio available',
        mutualFriends: Math.floor(Math.random() * 20),
        followers: Math.floor(Math.random() * 5000),
        posts: Math.floor(Math.random() * 500)
      })) || []);

      // Mock data for Recommended Hubs
      setRecommendedHubs([
      {
        id: 'hub-1',
        name: 'Political Enthusiasts',
        description: 'Discuss politics, elections, and democracy',
        coverImage: "https://images.unsplash.com/photo-1661510870950-5649daad96ee",
        memberCount: 15420,
        activityStatus: 'Very Active',
        mutualMembers: 12,
        activeElections: 5,
        topTopics: ['Politics', 'Elections', 'Democracy'],
        trending: true
      }]
      );

      // Mock data for Recommended Elections
      setRecommendedElections([
      {
        id: 'rec-election-1',
        title: 'Best Tech Innovation 2026',
        category: 'Technology',
        matchScore: 87,
        prizePool: 50000,
        participantCount: 8500,
        timeRemaining: '2 days',
        whyRecommended: 'Based on your interest in technology'
      }]
      );

      // Mock data for Creator Services
      setCreatorServices([
      {
        id: 'service-1',
        creatorName: 'Alex Thompson',
        creatorAvatar: 'https://randomuser.me/api/portraits/men/6.jpg',
        serviceType: 'Sponsored Content',
        priceRange: '$500 - $2,000',
        rating: 4.8,
        completedProjects: 45
      }]
      );

      // Load Gradient Flow content
      const { data: winnersData } = await supabase?.from('prize_distributions')?.select('*, user_profiles(*)')?.order('created_at', { ascending: false })?.limit(10);

      setRecentWinners(winnersData || []);

      // Mock data for Trending Topics
      setTrendingTopics([
      {
        id: 'topic-1',
        hashtag: '#Election2026',
        trendScore: 95,
        postCount: 125000,
        growthRate: '+45%'
      },
      {
        id: 'topic-2',
        hashtag: '#VoteNow',
        trendScore: 88,
        postCount: 89000,
        growthRate: '+32%'
      }]
      );

      // Mock data for Top Earners
      setTopEarners([
      {
        id: 'earner-1',
        rank: 1,
        user: {
          name: 'Jessica Lee',
          avatar: 'https://randomuser.me/api/portraits/women/7.jpg'
        },
        earningsThisMonth: 15000,
        growthPercentage: '+25%'
      },
      {
        id: 'earner-2',
        rank: 2,
        user: {
          name: 'Michael Chen',
          avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
        },
        earningsThisMonth: 12500,
        growthPercentage: '+18%'
      }]
      );

      // Mock data for Accuracy Champions
      setAccuracyChampions([
      {
        id: 'champion-1',
        user: {
          name: 'David Martinez',
          avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
        },
        accuracyScore: 94.7,
        totalPredictions: 247,
        winningStreak: 12,
        specialization: 'Political Predictions'
      }]
      );

    } catch (error) {
      console.error('Error loading carousel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const electionsChannel = supabase?.channel('elections-changes')?.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'elections'
    }, (payload) => {
      if (payload?.eventType === 'INSERT' || payload?.eventType === 'UPDATE') {
        loadCarouselData();
      }
    })?.subscribe();

    return () => {
      supabase?.removeChannel(electionsChannel);
    };
  };

  const tabs = [
  { id: 'horizontal', label: 'Horizontal Snap', icon: 'ArrowLeftRight' },
  { id: 'vertical', label: 'Vertical Stack', icon: 'Layers' },
  { id: 'gradient', label: 'Gradient Flow', icon: 'Waves' },
  { id: 'utilities', label: 'Shared Utilities', icon: 'Settings' }];



  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Premium 2D Carousel Component Library Hub | Vottery</title>
        <meta name="description" content="Comprehensive management and configuration for Premium 2D carousel systems with real-time Supabase data binding" />
      </Helmet>
      <HeaderNavigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Premium 2D Carousel Component Library Hub</h1>
          <p className="text-muted-foreground">Comprehensive management and configuration for three premium carousel systems with real-time Supabase data binding and performance monitoring</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto">
          {tabs?.map((tab) =>
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
            activeTab === tab?.id ?
            'bg-primary text-primary-foreground shadow-lg' :
            'text-muted-foreground hover:bg-muted'}`
            }>
              
                <Icon name={tab?.icon} size={18} />
                <span>{tab?.label}</span>
          </button>
          )}
        </div>

        {/* Content */}
        {loading ?
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div> :

        <div className="space-y-6">
            {activeTab === 'horizontal' &&
          <>
                <HorizontalSnapConfig
              config={horizontalConfig}
              onChange={setHorizontalConfig} />
            

                <LivePreviewPanel
              title="Horizontal Snap Preview"
              description="PageView with premium snap physics and parallax effects">
              
                  <div className="bg-gray-900 rounded-xl p-6">
                    <PremiumHorizontalSnap
                  items={liveElections}
                  renderCard={(item, index, isCentered) =>
                  <div className={`w-[320px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl overflow-hidden shadow-xl`}>
                          <div className="relative h-[240px]">
                            <Image
                        src={item?.coverImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400'}
                        alt={item?.title || 'Election'}
                        className="w-full h-full object-cover" />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                              <span className="text-xs font-bold">LIVE</span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{item?.title}</h3>
                              <div className="flex items-center gap-4 text-white/90 text-xs">
                                <div className="flex items-center gap-1">
                                  <Icon name="Users" size={14} />
                                  <span>{item?.totalVoters || 0} voters</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 text-center">
                            <p className="text-xs font-semibold text-yellow-900 mb-0.5">JACKPOT POOL</p>
                            <p className="text-xl font-bold text-white">${item?.prizePool?.toLocaleString() || '0'}</p>
                          </div>
                        </div>
                  }
                  onCardClick={(item) => console.log('Clicked:', item)}
                  cardWidth={horizontalConfig?.cardWidth}
                  cardGap={horizontalConfig?.cardGap}
                  enableParallax={horizontalConfig?.enableParallax}
                  enableHaptic={horizontalConfig?.enableHaptic}
                  casinoTheme={horizontalConfig?.casinoTheme}
                  snapPhysics={horizontalConfig?.snapPhysics} />
                
                </div>
                </LivePreviewPanel>
              </>
          }

            {activeTab === 'vertical' &&
          <>
                <VerticalStackConfig
              config={verticalConfig}
              onChange={setVerticalConfig} />
            

                <LivePreviewPanel
              title="Vertical Stack Preview"
              description="Tinder-style swipe mechanics with card exit animations">
              
                  <div className="bg-gray-900 rounded-xl p-6">
                    <PremiumVerticalStack
                  items={suggestedConnections}
                  renderCard={(card, index, isTop, handleAction) =>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0px_20px_30px_rgba(0,0,0,0.15)]">
                          <div className="relative">
                            <div className="h-[160px] bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 relative">
                              <div className="absolute inset-0 bg-black/10" />
                            </div>
                            <div className="absolute top-[110px] left-1/2 -translate-x-1/2">
                              <div className="w-24 h-24 rounded-full ring-4 ring-white dark:ring-gray-800 overflow-hidden shadow-xl">
                                <Image src={card?.avatar} alt={`${card?.name} profile`} className="w-full h-full object-cover" />
                              </div>
                            </div>
                          </div>
                          <div className="pt-16 pb-5 px-5 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-foreground">{card?.name}</h3>
                              {card?.verified && <Icon name="BadgeCheck" size={18} className="text-primary" />}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">@{card?.username}</p>
                            {card?.bio && <p className="text-sm text-foreground mb-3 line-clamp-2">{card?.bio}</p>}
                            <div className="flex items-center justify-center gap-6 mb-4 text-sm">
                              <div className="text-center">
                                <p className="font-bold text-foreground">{card?.mutualFriends || 0}</p>
                                <p className="text-muted-foreground">Mutual</p>
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-foreground">{card?.followers || 0}</p>
                                <p className="text-muted-foreground">Followers</p>
                              </div>
                            </div>
                            {isTop &&
                      <div className="flex items-center gap-3">
                                <button
                          onClick={() => handleAction('skip', card)}
                          className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2">
                          
                                  <Icon name="X" size={20} />
                                  <span>Pass</span>
                                </button>
                                <button
                          onClick={() => handleAction('accept', card)}
                          className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg">
                          
                                  <Icon name="UserPlus" size={20} />
                                  <span>Connect</span>
                                </button>
                              </div>
                      }
                          </div>
                        </div>
                  }
                  onSwipeRight={(card) => console.log('Swiped right:', card)}
                  onSwipeLeft={(card) => console.log('Swiped left:', card)}
                  swipeThreshold={verticalConfig?.swipeThreshold}
                  enableHaptic={verticalConfig?.enableHaptic}
                  enableParticles={verticalConfig?.enableParticles}
                  cardStackOffset={verticalConfig?.cardStackOffset}
                  exitAnimation={verticalConfig?.exitAnimation} />
                
                </div>
                </LivePreviewPanel>
              </>
          }

            {activeTab === 'gradient' &&
          <>
                <GradientFlowConfig
              config={gradientConfig}
              onChange={setGradientConfig} />
            

                <LivePreviewPanel
              title="Gradient Flow Preview"
              description="Viscous scroll physics with glassmorphism and metaball effects">
              
                  <div className="bg-gray-900 rounded-xl overflow-hidden">
                    <PremiumGradientFlow
                  items={recentWinners}
                  renderBlob={(item, index, isFocused) =>
                  <>
                          <div
                      className={`relative w-16 h-16 rounded-full overflow-hidden ring-2 ${
                      isFocused ? 'ring-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.5)]' : 'ring-white/20'}`
                      }>
                      
                            <Image
                        src={item?.userProfiles?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                        alt={`${item?.userProfiles?.name} profile`}
                        className="w-full h-full object-cover" />
                      
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                            <Icon name="Trophy" size={10} className="text-yellow-900" />
                          </div>
                          <p className="text-xs font-semibold text-white mt-2 text-center truncate max-w-[100px]">
                            {item?.userProfiles?.name?.split(' ')?.[0]}
                          </p>
                          <p className="text-[10px] font-bold text-yellow-300">
                            ${item?.prizeAmount?.toLocaleString() || '0'}
                          </p>
                        </>
                  }
                  onBlobClick={(item) => console.log('Clicked:', item)}
                  blobWidth={gradientConfig?.blobWidth}
                  enableHaptic={gradientConfig?.enableHaptic}
                  enableMetaballs={gradientConfig?.enableMetaballs}
                  viscousPhysics={gradientConfig?.viscousPhysics}
                  gradientColors={gradientConfig?.gradientColors} />
                
                </div>
                </LivePreviewPanel>
              </>
          }

            {activeTab === 'utilities' &&
          <SharedUtilitiesConfig
            config={sharedUtilities}
            onChange={setSharedUtilities} />
          }
          </div>
        }
      </div>
    </div>);


};

export default Premium2DCarouselComponentLibraryHub;