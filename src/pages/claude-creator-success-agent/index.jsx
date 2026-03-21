import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingUp, Award, Shield, RefreshCw, MessageSquare, Server } from 'lucide-react';
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
    { id: 'health', label: 'Health Monitoring', icon: Activity, color: 'blue' },
    { id: 'at-risk', label: 'At-Risk Creators', icon: AlertTriangle, color: 'red' },
    { id: 'optimization', label: 'Content Optimization', icon: TrendingUp, color: 'green' },
    { id: 'milestones', label: 'Milestone Tracking', icon: Award, color: 'purple' },
    { id: 'churn', label: 'Churn Prevention', icon: Shield, color: 'orange' },
    { id: 'coach', label: 'AI Coach', icon: MessageSquare, color: 'indigo' },
    { id: 'operations', label: 'Operations Hub', icon: Server, color: 'cyan' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon name="Brain" size={28} className="text-white" />
                </div>
                Claude Creator Success Agent
              </h1>
              <p className="text-gray-600 mt-2">
                Autonomous AI-powered creator monitoring, optimization, and retention system
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Icon name={RefreshCw} size={16} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Metrics Overview */}
      {!loading && metrics && <SuccessMetricsPanel metrics={metrics} />}

      {/* Navigation Tabs */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <div className="flex gap-2 overflow-x-auto">
            {tabs?.map((tab) => {
              const isActive = activeTab === tab?.id;
              const colorClasses = {
                blue: 'bg-blue-50 text-blue-700 border-blue-200',
                red: 'bg-red-50 text-red-700 border-red-200',
                green: 'bg-green-50 text-green-700 border-green-200',
                purple: 'bg-purple-50 text-purple-700 border-purple-200',
                orange: 'bg-orange-50 text-orange-700 border-orange-200',
              };

              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? `${colorClasses?.[tab?.color]} border shadow-sm`
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-[1600px] mx-auto px-6 pb-12">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading creator success data...</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default ClaudeCreatorSuccessAgent;