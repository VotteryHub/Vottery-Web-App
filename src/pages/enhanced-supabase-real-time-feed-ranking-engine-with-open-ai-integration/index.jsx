import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { feedRankingService } from '../../services/feedRankingService';
import { enhancedRealtimeService } from '../../services/enhancedRealtimeService';
import { useAuth } from '../../contexts/AuthContext';
import SemanticAnalysisPanel from './components/SemanticAnalysisPanel';
import PreferenceLearningPanel from './components/PreferenceLearningPanel';
import FeedOrchestrationPanel from './components/FeedOrchestrationPanel';
import EngagementTrackingPanel from './components/EngagementTrackingPanel';
import RecommendationTransparencyPanel from './components/RecommendationTransparencyPanel';
import AdvancedAnalyticsPanel from './components/AdvancedAnalyticsPanel';

const EnhancedSupabaseRealTimeFeedRankingEngineWithOpenAIIntegration = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('semantic');
  const [feedRankings, setFeedRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState('disconnected');
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  useEffect(() => {
    loadInitialData();
    setupRealtimeConnection();
  }, [user]);

  const loadInitialData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await feedRankingService?.getUserFeedRankings(user?.id);
      if (error) throw error;
      setFeedRankings(data || []);
    } catch (error) {
      console.error('Error loading feed rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeConnection = () => {
    if (!user) return;

    setRealtimeStatus('connecting');

    const channel = enhancedRealtimeService?.createConnection(
      `feed_rankings_${user?.id}`,
      {
        table: 'feed_rankings',
        filter: `user_id=eq.${user?.id}`,
        onMessage: (payload) => {
          setRealtimeStatus('connected');
          if (payload?.eventType === 'INSERT' || payload?.eventType === 'UPDATE') {
            setFeedRankings((prev) => {
              const existing = prev?.find((r) => r?.id === payload?.new?.id);
              if (existing) {
                return prev?.map((r) => (r?.id === payload?.new?.id ? payload?.new : r));
              }
              return [...prev, payload?.new];
            });
          }
        },
        onConnect: () => setRealtimeStatus('connected'),
        onError: () => setRealtimeStatus('error')
      }
    );

    return () => {
      channel?.unsubscribe();
      setRealtimeStatus('disconnected');
    };
  };

  const tabs = [
    { id: 'semantic', label: 'Semantic Matching', icon: 'Sparkles' },
    { id: 'learning', label: 'Preference Learning', icon: 'Brain' },
    { id: 'orchestration', label: 'Feed Orchestration', icon: 'Layers' },
    { id: 'engagement', label: 'Engagement Tracking', icon: 'Activity' },
    { id: 'transparency', label: 'Transparency Tools', icon: 'Eye' },
    { id: 'analytics', label: 'Advanced Analytics', icon: 'BarChart3' }
  ];

  return (
    <>
      <Helmet>
        <title>Enhanced Feed Ranking Engine with OpenAI | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <LeftSidebar />

      <main className="lg:ml-64 xl:ml-72 pt-14 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Enhanced Supabase Real-Time Feed Ranking Engine with OpenAI Integration
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  AI-powered semantic matching and preference learning for improved recommendation accuracy
                </p>
              </div>

              {/* Real-time Status */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${
                    realtimeStatus === 'connected' ?'bg-green-500 animate-pulse'
                      : realtimeStatus === 'connecting' ?'bg-yellow-500 animate-pulse' :'bg-red-500'
                  }`}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {realtimeStatus}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'semantic' && <SemanticAnalysisPanel userId={user?.id} />}
              {activeTab === 'learning' && <PreferenceLearningPanel userId={user?.id} feedRankings={feedRankings} />}
              {activeTab === 'orchestration' && <FeedOrchestrationPanel userId={user?.id} feedRankings={feedRankings} />}
              {activeTab === 'engagement' && <EngagementTrackingPanel userId={user?.id} />}
              {activeTab === 'transparency' && <RecommendationTransparencyPanel feedRankings={feedRankings} />}
              {activeTab === 'analytics' && <AdvancedAnalyticsPanel userId={user?.id} />}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default EnhancedSupabaseRealTimeFeedRankingEngineWithOpenAIIntegration;