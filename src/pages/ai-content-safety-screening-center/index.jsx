import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ScreeningOverviewPanel from './components/ScreeningOverviewPanel';
import AIDetectionEnginePanel from './components/AIDetectionEnginePanel';
import ContentReviewQueuePanel from './components/ContentReviewQueuePanel';
import PolicyEnforcementPanel from './components/PolicyEnforcementPanel';
import ModelPerformancePanel from './components/ModelPerformancePanel';
import ScreeningAnalyticsPanel from './components/ScreeningAnalyticsPanel';
import { contentSafetyService } from '../../services/contentSafetyService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AIContentSafetyScreeningCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [screeningData, setScreeningData] = useState({
    statistics: null,
    queue: [],
    modelPerformance: [],
    policies: []
  });

  useEffect(() => {
    loadScreeningData();
    analytics?.trackEvent('ai_content_safety_viewed', {
      active_tab: activeTab
    });

    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadScreeningData = async () => {
    setLoading(true);
    try {
      const [statsResult, queueResult, performanceResult, policiesResult] = await Promise.all([
        contentSafetyService?.getScreeningStatistics(),
        contentSafetyService?.getScreeningQueue({ status: 'all' }),
        contentSafetyService?.getMLModelPerformance(),
        contentSafetyService?.getContentSafetyPolicies({ isActive: true })
      ]);

      setScreeningData({
        statistics: statsResult?.data,
        queue: queueResult?.data || [],
        modelPerformance: performanceResult?.data || [],
        policies: policiesResult?.data || []
      });
    } catch (error) {
      console.error('Failed to load screening data:', error);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadScreeningData();
    setRefreshing(false);
  };

  const handleScreenContent = async (contentData) => {
    try {
      const result = await contentSafetyService?.screenContent(contentData);
      if (result?.data) {
        await loadScreeningData();
        return { success: true, data: result?.data };
      }
      return { success: false, error: result?.error };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  };

  const handleUpdateScreeningStatus = async (screeningId, updates) => {
    try {
      const result = await contentSafetyService?.updateScreeningStatus(screeningId, updates);
      if (result?.data) {
        await loadScreeningData();
        return { success: true };
      }
      return { success: false, error: result?.error };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'detection', label: 'AI Detection Engine', icon: 'Brain' },
    { id: 'queue', label: 'Review Queue', icon: 'ListChecks', badge: screeningData?.statistics?.pendingReview || 0 },
    { id: 'enforcement', label: 'Policy Enforcement', icon: 'Shield' },
    { id: 'performance', label: 'Model Performance', icon: 'TrendingUp' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ScreeningOverviewPanel statistics={screeningData?.statistics} loading={loading} />;
      case 'detection':
        return <AIDetectionEnginePanel modelPerformance={screeningData?.modelPerformance} onScreenContent={handleScreenContent} loading={loading} />;
      case 'queue':
        return <ContentReviewQueuePanel queue={screeningData?.queue} onUpdateStatus={handleUpdateScreeningStatus} loading={loading} />;
      case 'enforcement':
        return <PolicyEnforcementPanel policies={screeningData?.policies} loading={loading} />;
      case 'performance':
        return <ModelPerformancePanel modelPerformance={screeningData?.modelPerformance} loading={loading} />;
      case 'analytics':
        return <ScreeningAnalyticsPanel statistics={screeningData?.statistics} queue={screeningData?.queue} loading={loading} />;
      default:
        return <ScreeningOverviewPanel statistics={screeningData?.statistics} loading={loading} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Content Safety Screening Center - Vottery</title>
        <meta name="description" content="Automated AI-powered content moderation for election content using machine learning to prevent policy violations before publication." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  AI Content Safety Screening Center
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Automated content moderation using machine learning to prevent policy violations
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground">
                  Last updated: {lastUpdated?.toLocaleTimeString()}
                </div>
                <Button
                  onClick={refreshData}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Icon name={refreshing ? 'Loader2' : 'RefreshCw'} className={refreshing ? 'animate-spin' : ''} size={16} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 border-b border-border">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab?.id
                      ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  {tab?.label}
                  {tab?.badge > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-destructive text-destructive-foreground rounded-full">
                      {tab?.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default AIContentSafetyScreeningCenter;