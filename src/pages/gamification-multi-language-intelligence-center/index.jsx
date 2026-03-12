import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GamificationEnginePanel from './components/GamificationEnginePanel';
import MultiLanguageIntelligencePanel from './components/MultiLanguageIntelligencePanel';
import AdvancedSearchDiscoveryPanel from './components/AdvancedSearchDiscoveryPanel';
import SeasonalChallengePanel from './components/SeasonalChallengePanel';
import LeaderboardStandingsPanel from './components/LeaderboardStandingsPanel';
import AchievementProgressPanel from './components/AchievementProgressPanel';
import { gamificationService } from '../../services/gamificationService';
import { localizationService } from '../../services/localizationService';
import { feedRankingService } from '../../services/feedRankingService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const GamificationMultiLanguageIntelligenceCenter = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gamificationData, setGamificationData] = useState(null);
  const [languageStats, setLanguageStats] = useState(null);
  const [searchMetrics, setSearchMetrics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'gamification', label: 'Gamification Engine', icon: 'Trophy' },
    { id: 'language', label: 'Multi-Language AI', icon: 'Globe' },
    { id: 'search', label: 'Advanced Search', icon: 'Search' },
    { id: 'challenges', label: 'Seasonal Challenges', icon: 'Target' },
    { id: 'leaderboard', label: 'Leaderboards', icon: 'TrendingUp' },
    { id: 'achievements', label: 'Achievement Progress', icon: 'Award' }
  ];

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    analytics?.trackEvent('gamification_multilanguage_center_viewed', {
      userId: user?.id,
      activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab, user]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [gamification, language, search] = await Promise.all([
        gamificationService?.getUserGamification(user?.id),
        localizationService?.getTranslationStatus(),
        feedRankingService?.getRankingConfig()
      ]);

      setGamificationData(gamification);
      setLanguageStats(language);
      setSearchMetrics(search?.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadAllData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Icon name="Zap" size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">Total XP</span>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {gamificationData?.current_xp?.toLocaleString() || 0}
                </div>
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  Level {gamificationData?.level || 1}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Icon name="Flame" size={24} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">Streak</span>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {gamificationData?.streak_count || 0}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Days active
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Icon name="Globe" size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">Languages</span>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  61
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Supported
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Icon name="Award" size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">NFT Badges</span>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {gamificationData?.total_badges || 0}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Earned
                </div>
              </div>
            </div>

            {/* Quick Access Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AchievementProgressPanel userId={user?.id} />
              <LeaderboardStandingsPanel userId={user?.id} />
            </div>
          </div>
        );
      case 'gamification':
        return <GamificationEnginePanel userId={user?.id} />;
      case 'language':
        return <MultiLanguageIntelligencePanel />;
      case 'search':
        return <AdvancedSearchDiscoveryPanel userId={user?.id} />;
      case 'challenges':
        return <SeasonalChallengePanel userId={user?.id} />;
      case 'leaderboard':
        return <LeaderboardStandingsPanel userId={user?.id} detailed={true} />;
      case 'achievements':
        return <AchievementProgressPanel userId={user?.id} detailed={true} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={40} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Intelligence Center...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gamification & Multi-Language Intelligence Center - Vottery</title>
        <meta name="description" content="Comprehensive XP/NFT achievement systems with dynamic AI translation and intelligent content discovery using OpenAI semantic matching across 61 languages." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <Icon name="Sparkles" size={32} className="text-primary" />
                  Gamification & Multi-Language Intelligence Center
                </h1>
                <p className="text-sm text-muted-foreground">
                  Comprehensive XP/NFT systems, AI translation across 61 languages, and intelligent content discovery
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Updated {lastUpdated?.toLocaleTimeString()}
                  </span>
                </div>

                <Button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center gap-2"
                >
                  <Icon 
                    name="RefreshCw" 
                    size={16} 
                    className={refreshing ? 'animate-spin' : ''} 
                  />
                  <span className="hidden md:inline">Refresh</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-border overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fadeIn">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default GamificationMultiLanguageIntelligenceCenter;