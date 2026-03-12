import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SharedDashboardPanel from './components/SharedDashboardPanel';
import ThreadedDiscussionsPanel from './components/ThreadedDiscussionsPanel';
import TeamPresencePanel from './components/TeamPresencePanel';
import CollaborativeGoalsPanel from './components/CollaborativeGoalsPanel';
import AuditTrailPanel from './components/AuditTrailPanel';
import RealTimeCoordinationPanel from './components/RealTimeCoordinationPanel';
import AnnotationLayer from './components/AnnotationLayer';
import { teamCollaborationService } from '../../services/teamCollaborationService';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const TeamCollaborationCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [collaborationData, setCollaborationData] = useState({
    dashboardMetrics: null,
    discussions: [],
    teamPresence: [],
    goals: [],
    auditTrail: []
  });

  useEffect(() => {
    loadCollaborationData();
  }, []);

  useRealtimeMonitoring({
    tables: ['activity_feed', 'system_alerts'],
    onRefresh: loadCollaborationData,
    enabled: true,
  });

  useEffect(() => {
    analytics?.trackEvent('team_collaboration_viewed', {
      active_tab: activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab]);

  const loadCollaborationData = async () => {
    try {
      setLoading(true);
      
      const [metricsResult, discussionsResult, presenceResult, goalsResult, auditResult] = await Promise.all([
        teamCollaborationService?.getSharedDashboardMetrics(),
        teamCollaborationService?.getStrategyDiscussions(),
        teamCollaborationService?.getTeamPresence(),
        teamCollaborationService?.getCollaborativeGoals(),
        teamCollaborationService?.getAuditTrail()
      ]);

      setCollaborationData({
        dashboardMetrics: metricsResult?.data,
        discussions: discussionsResult?.data || [],
        teamPresence: presenceResult?.data || [],
        goals: goalsResult?.data || [],
        auditTrail: auditResult?.data || []
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load collaboration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadCollaborationData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart2' },
    { id: 'discussions', label: 'Discussions', icon: 'MessageSquare' },
    { id: 'presence', label: 'Team', icon: 'Users' },
    { id: 'goals', label: 'Goals', icon: 'Target' },
    { id: 'audit', label: 'Audit Trail', icon: 'FileText' },
    { id: 'annotations', label: 'Annotations', icon: 'Edit3' },
  ];

  return (
    <>
      <Helmet>
        <title>Team Collaboration Center - Vottery</title>
        <meta name="description" content="Real-time team workspace for advertiser campaign coordination with shared performance dashboards and threaded strategy discussions." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Team Collaboration Center
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Real-time advertiser campaign coordination with shared dashboards and threaded discussions
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    {collaborationData?.teamPresence?.filter(p => p?.status === 'online')?.length || 0} online
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} className="inline mr-1" />
                  Updated {lastUpdated?.toLocaleTimeString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={refreshing ? 'Loader' : 'RefreshCw'}
                  onClick={refreshData}
                  disabled={refreshing}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-card text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                  {tab?.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab?.id
                        ? 'bg-white/20 text-white' :'bg-primary/10 text-primary'
                    }`}>
                      {tab?.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="card p-12 text-center">
              <Icon name="Loader" size={48} className="mx-auto text-primary mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading collaboration workspace...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'dashboard' && (
                <SharedDashboardPanel 
                  metrics={collaborationData?.dashboardMetrics}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'discussions' && (
                <ThreadedDiscussionsPanel 
                  discussions={collaborationData?.discussions}
                  onRefresh={loadCollaborationData}
                />
              )}
              {activeTab === 'presence' && (
                <TeamPresencePanel 
                  presence={collaborationData?.teamPresence}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'goals' && (
                <CollaborativeGoalsPanel 
                  goals={collaborationData?.goals}
                  onRefresh={loadCollaborationData}
                />
              )}
              {activeTab === 'coordination' && (
                <RealTimeCoordinationPanel 
                  metrics={collaborationData?.dashboardMetrics}
                  presence={collaborationData?.teamPresence}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'audit' && (
                <AuditTrailPanel 
                  auditTrail={collaborationData?.auditTrail}
                  onRefresh={loadCollaborationData}
                />
              )}
              {activeTab === 'annotations' && (
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h3 className="text-blue-400 font-semibold mb-1">Shared Annotation Layers</h3>
                    <p className="text-gray-400 text-sm">Add comments and insights directly on charts. Team members can view, resolve, and track decisions.</p>
                  </div>
                  <AnnotationLayer chartId="revenue" chartTitle="Revenue Trends Chart" />
                  <AnnotationLayer chartId="engagement" chartTitle="User Engagement Metrics" />
                  <AnnotationLayer chartId="fraud" chartTitle="Fraud Detection Analytics" />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default TeamCollaborationCenter;