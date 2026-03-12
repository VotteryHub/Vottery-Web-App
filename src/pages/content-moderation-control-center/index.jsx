import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ModerationOverview from './components/ModerationOverview';
import FlaggedContentPanel from './components/FlaggedContentPanel';
import ViolationAnalytics from './components/ViolationAnalytics';
import ModerationActionsPanel from './components/ModerationActionsPanel';
import ContentAppealsPanel from './components/ContentAppealsPanel';
import { moderationService } from '../../services/moderationService';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const ContentModerationControlCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [moderationData, setModerationData] = useState({
    analytics: null,
    flaggedContent: null,
    violations: null,
    actions: null,
    modelPerformance: null
  });

  useEffect(() => {
    loadModerationData();
  }, []);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadModerationData,
    enabled: true,
  });

  const loadModerationData = async () => {
    try {
      setLoading(true);
      const [analyticsResult, flaggedResult, violationsResult, actionsResult, performanceResult, appealsResult] = await Promise.all([
        moderationService?.getContentAnalytics(),
        moderationService?.getFlaggedContent(),
        moderationService?.getViolationsByCategory(),
        moderationService?.getModerationActions(),
        moderationService?.getModelPerformance(),
        moderationService?.getAppeals?.() ?? Promise.resolve({ data: [] })
      ]);

      setModerationData({
        analytics: analyticsResult?.data,
        flaggedContent: flaggedResult?.data,
        violations: violationsResult?.data,
        actions: actionsResult?.data,
        modelPerformance: performanceResult?.data,
        appeals: appealsResult?.data || []
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load moderation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadModerationData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'flagged', label: 'Flagged Content', icon: 'Flag', badge: moderationData?.analytics?.pendingReview || 0 },
    { id: 'queue', label: 'Moderator Queue', icon: 'Inbox' },
    { id: 'violations', label: 'Violations', icon: 'AlertTriangle' },
    { id: 'actions', label: 'Actions', icon: 'Shield' },
    { id: 'appeals', label: 'Appeals', icon: 'MessageCircle', badge: moderationData?.appeals?.filter(a => a?.status === 'pending')?.length || 0 }
  ];

  return (
    <>
      <Helmet>
        <title>Content Moderation Control Center - Vottery</title>
        <meta name="description" content="Automated election content analysis to flag policy violations, spam, and misinformation across campaigns and user-generated posts." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Content Moderation Control Center
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  AI-powered content analysis and policy enforcement across all election campaigns
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Updated {lastUpdated?.toLocaleTimeString()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={refreshing ? "Loader" : "RefreshCw"}
                  onClick={refreshData}
                  disabled={refreshing}
                  className={refreshing ? 'animate-spin' : ''}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 border-b border-border">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 relative ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                  {tab?.badge > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                      {tab?.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading moderation data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <ModerationOverview
                  analytics={moderationData?.analytics}
                  modelPerformance={moderationData?.modelPerformance}
                />
              )}

              {activeTab === 'flagged' && (
                <FlaggedContentPanel
                  flaggedContent={moderationData?.flaggedContent}
                  onRefresh={loadModerationData}
                />
              )}

              {activeTab === 'queue' && (
                <FlaggedContentPanel
                  flaggedContent={moderationData?.flaggedContent?.filter(f => f?.status === 'pending_review' || f?.status === 'under_review') || []}
                  onRefresh={loadModerationData}
                />
              )}

              {activeTab === 'violations' && (
                <ViolationAnalytics
                  violations={moderationData?.violations}
                  analytics={moderationData?.analytics}
                />
              )}

              {activeTab === 'actions' && (
                <ModerationActionsPanel
                  actions={moderationData?.actions}
                />
              )}

              {activeTab === 'appeals' && (
                <ContentAppealsPanel
                  appeals={moderationData?.appeals}
                  onRefresh={loadModerationData}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ContentModerationControlCenter;