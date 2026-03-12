import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import RankingOverviewPanel from './components/RankingOverviewPanel';
import RealtimeSubscriptionsPanel from './components/RealtimeSubscriptionsPanel';
import SemanticMatchingPanel from './components/SemanticMatchingPanel';
import FeedCompositionPanel from './components/FeedCompositionPanel';
import PerformanceMetricsPanel from './components/PerformanceMetricsPanel';
import AlgorithmControlsPanel from './components/AlgorithmControlsPanel';
import Icon from '../../components/AppIcon';
import { feedRankingService } from '../../services/feedRankingService';
import { topicPreferenceService } from '../../services/topicPreferenceService';
import { useAuth } from '../../contexts/AuthContext';

const SupabaseRealTimeFeedRankingEngine = () => {
  const { user } = useAuth();
  const [rankingConfig, setRankingConfig] = useState(null);
  const [feedRankings, setFeedRankings] = useState([]);
  const [userPreferences, setUserPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('disconnected');

  useEffect(() => {
    loadInitialData();
    setupRealtimeSubscriptions();
  }, [user]);

  const loadInitialData = async () => {
    try {
      const [configResult, rankingsResult, preferencesResult] = await Promise.all([
        feedRankingService?.getRankingConfig(),
        user ? feedRankingService?.getUserFeedRankings(user?.id) : { data: null },
        user ? topicPreferenceService?.getUserTopicPreferences(user?.id) : { data: null }
      ]);

      if (configResult?.error) throw new Error(configResult?.error?.message);

      setRankingConfig(configResult?.data);
      setFeedRankings(rankingsResult?.data || []);
      setUserPreferences(preferencesResult?.data || []);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    if (!user) return;

    setSubscriptionStatus('connecting');

    const unsubscribe = feedRankingService?.subscribeToFeedRankings(user?.id, (payload) => {
      setSubscriptionStatus('connected');

      if (payload?.eventType === 'INSERT' || payload?.eventType === 'UPDATE') {
        setFeedRankings((prev) => {
          const existing = prev?.find((r) => r?.id === payload?.new?.id);
          if (existing) {
            return prev?.map((r) => (r?.id === payload?.new?.id ? payload?.new : r));
          }
          return [...prev, payload?.new];
        });
      } else if (payload?.eventType === 'DELETE') {
        setFeedRankings((prev) => prev?.filter((r) => r?.id !== payload?.old?.id));
      }
    });

    return () => {
      unsubscribe?.();
      setSubscriptionStatus('disconnected');
    };
  };

  const handleGenerateRankings = async (contentMix) => {
    setGenerating(true);
    setError('');

    try {
      const { data, error: genError } = await feedRankingService?.generateFeedRankings(user?.id, contentMix);
      if (genError) throw new Error(genError?.message);

      setFeedRankings(data || []);
    } catch (err) {
      setError(err?.message || 'Failed to generate rankings');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading ranking engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <HeaderNavigation />
      <LeftSidebar />

      <main className="lg:ml-64 xl:ml-72 pt-14 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  Real-Time Feed Ranking Engine
                </h1>
                <p className="text-muted-foreground">
                  AI-powered content orchestration with semantic matching and live subscriptions
                </p>
              </div>

              {/* Subscription Status */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div
                  className={`w-2 h-2 rounded-full ${
                    subscriptionStatus === 'connected' ?'bg-green-500 animate-pulse'
                      : subscriptionStatus === 'connecting' ?'bg-yellow-500 animate-pulse' :'bg-red-500'
                  }`}
                />
                <span className="text-sm font-medium text-foreground capitalize">
                  {subscriptionStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={20} className="text-red-600 dark:text-red-400" />
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RankingOverviewPanel
              rankingConfig={rankingConfig}
              feedRankings={feedRankings}
              userPreferences={userPreferences}
            />
            <RealtimeSubscriptionsPanel
              subscriptionStatus={subscriptionStatus}
              feedRankings={feedRankings}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SemanticMatchingPanel
              userPreferences={userPreferences}
              generating={generating}
            />
            <FeedCompositionPanel
              feedRankings={feedRankings}
              onGenerate={handleGenerateRankings}
              generating={generating}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceMetricsPanel feedRankings={feedRankings} />
            <AlgorithmControlsPanel
              rankingConfig={rankingConfig}
              onConfigUpdate={setRankingConfig}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupabaseRealTimeFeedRankingEngine;