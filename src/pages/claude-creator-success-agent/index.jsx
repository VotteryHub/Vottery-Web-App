import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';
import Button from '../../components/ui/Button';
import { claudeCreatorSuccessService } from '../../services/claudeCreatorSuccessService';
import CreatorHealthPanel from './components/CreatorHealthPanel';
import AtRiskCreatorsPanel from './components/AtRiskCreatorsPanel';
import ContentOptimizationPanel from './components/ContentOptimizationPanel';
import MilestoneTrackingPanel from './components/MilestoneTrackingPanel';
import ChurnPreventionPanel from './components/ChurnPreventionPanel';
import SuccessMetricsPanel from './components/SuccessMetricsPanel';
import ActionPlanTimeline from './components/ActionPlanTimeline';
import InteractiveChatInterface from './components/InteractiveChatInterface';
import UnifiedOperationsHub from './components/UnifiedOperationsHub';

const ClaudeCreatorSuccessAgent = () => {
  const [activeTab, setActiveTab] = useState('health');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creatorId, setCreatorId] = useState(null);

  const loadMetrics = async () => {
    try {
      const result = await claudeCreatorSuccessService?.getSuccessMetrics();
      if (result?.data) {
        setMetrics(result?.data);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  useEffect(() => {
    const resolveUser = async () => {
      const { data } = await claudeCreatorSuccessService?.getCreatorHealthScores?.();
      const first = Array.isArray(data) ? data?.[0] : null;
      setCreatorId(first?.creatorId || null);
    };
    resolveUser();
  }, []);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadMetrics,
    enabled: true,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMetrics();
  };

  const tabs = [
    { id: 'health', label: 'Health Monitoring', icon: 'Activity', color: 'blue' },
    { id: 'at-risk', label: 'At-Risk Creators', icon: 'AlertTriangle', color: 'red' },
    { id: 'optimization', label: 'Content Optimization', icon: 'TrendingUp', color: 'green' },
    { id: 'milestones', label: 'Milestone Tracking', icon: 'Award', color: 'purple' },
    { id: 'churn', label: 'Churn Prevention', icon: 'Shield', color: 'orange' },
    { id: 'coach', label: 'AI Coach', icon: 'MessageSquare', color: 'indigo' },
    { id: 'operations', label: 'Operations Hub', icon: 'Server', color: 'cyan' },
  ];

  return (
    <GeneralPageLayout title="Claude Creator Success Agent" showSidebar={true}>
      <div className="w-full py-0">
        {/* Header */}
        <div className="bg-slate-950/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 mb-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/10 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40 animate-float">
                <Icon name="Brain" size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight uppercase">Creator Success Agent</h1>
                <p className="text-slate-400 font-medium">Autonomous AI-powered creator monitoring, optimization, and retention system</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all backdrop-blur-md"
            >
              <Icon name="RefreshCw" size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Success Metrics Overview */}
        {!loading && metrics && <div className="mb-10"><SuccessMetricsPanel metrics={metrics} /></div>}

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-black/20 backdrop-blur-md rounded-2xl p-2 border border-white/5 shadow-inner mb-10 overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                activeTab === tab?.id
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 p-16 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-b-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading creator success data...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'health' && <CreatorHealthPanel />}
            {activeTab === 'at-risk' && <AtRiskCreatorsPanel />}
            {activeTab === 'optimization' && <ContentOptimizationPanel />}
            {activeTab === 'milestones' && <MilestoneTrackingPanel />}
            {activeTab === 'churn' && <ChurnPreventionPanel />}
            {activeTab === 'coach' && (
              <div className="space-y-6">
                <ActionPlanTimeline creatorId={creatorId} />
                <InteractiveChatInterface creatorId={creatorId} />
              </div>
            )}
            {activeTab === 'operations' && <UnifiedOperationsHub />}
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default ClaudeCreatorSuccessAgent;