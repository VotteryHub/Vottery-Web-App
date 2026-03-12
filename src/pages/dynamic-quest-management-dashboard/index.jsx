import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Clock, Trophy, TrendingUp, Award, Zap, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { openAIQuestService } from '../../services/openAIQuestService';

import ActiveQuestTracking from './components/ActiveQuestTracking';
import CompletedQuestAnalytics from './components/CompletedQuestAnalytics';
import VPIntegration from './components/VPIntegration';
import QuestPerformanceMonitoring from './components/QuestPerformanceMonitoring';
import QuestModification from './components/QuestModification';
import ComprehensiveReporting from './components/ComprehensiveReporting';

const DynamicQuestManagementDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [activeQuests, setActiveQuests] = useState([]);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [questStats, setQuestStats] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadQuestData();
      
      // Set up auto-refresh every 30 seconds
      const interval = setInterval(() => {
        loadQuestData();
      }, 30000);
      
      setRefreshInterval(interval);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadQuestData = async () => {
    try {
      setLoading(true);
      const [activeResult, completedResult, statsResult] = await Promise.all([
        openAIQuestService?.getActiveQuests(user?.id),
        openAIQuestService?.getCompletedQuests(user?.id, 50),
        openAIQuestService?.getQuestStatistics(user?.id)
      ]);

      setActiveQuests(activeResult?.data || []);
      setCompletedQuests(completedResult?.data || []);
      setQuestStats(statsResult?.data || {});
    } catch (error) {
      console.error('Error loading quest data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestUpdate = async (questId, progress) => {
    try {
      await openAIQuestService?.updateQuestProgress(questId, progress);
      await loadQuestData();
    } catch (error) {
      console.error('Error updating quest:', error);
    }
  };

  const tabs = [
    { id: 'active', label: 'Active Quests', icon: Target, count: activeQuests?.length },
    { id: 'completed', label: 'Completed', icon: CheckCircle, count: completedQuests?.length },
    { id: 'vp-integration', label: 'VP Integration', icon: Trophy },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'management', label: 'Management', icon: Zap },
    { id: 'reporting', label: 'Reporting', icon: BarChart3 }
  ];

  if (loading && !questStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Quest Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <Target className="w-10 h-10 text-blue-600" />
                Dynamic Quest Management Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive quest lifecycle oversight with real-time tracking and VP integration
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                Auto-refreshes every 30 seconds
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
              <Award className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100">Active Quests</span>
                <Target className="w-5 h-5 text-blue-200" />
              </div>
              <div className="text-3xl font-bold">{questStats?.activeQuests || 0}</div>
              <div className="text-blue-100 text-sm">In progress</div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {questStats?.completedQuests || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                {questStats?.completionRate || 0}% rate
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">VP Rewards</span>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {questStats?.totalVPEarned || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Total earned</div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {questStats?.completionRate || 0}%
              </div>
              <div className="text-purple-600 text-sm">Completion</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap relative ${
                  activeTab === tab?.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-gray-700' :'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab?.label}
                {tab?.count !== undefined && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
                    {tab?.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'active' && (
              <ActiveQuestTracking
                quests={activeQuests}
                onUpdate={handleQuestUpdate}
                onRefresh={loadQuestData}
              />
            )}
            {activeTab === 'completed' && (
              <CompletedQuestAnalytics
                quests={completedQuests}
                stats={questStats}
              />
            )}
            {activeTab === 'vp-integration' && (
              <VPIntegration
                questStats={questStats}
                userId={user?.id}
              />
            )}
            {activeTab === 'performance' && (
              <QuestPerformanceMonitoring
                activeQuests={activeQuests}
                completedQuests={completedQuests}
                stats={questStats}
              />
            )}
            {activeTab === 'management' && (
              <QuestModification
                activeQuests={activeQuests}
                onUpdate={loadQuestData}
              />
            )}
            {activeTab === 'reporting' && (
              <ComprehensiveReporting
                activeQuests={activeQuests}
                completedQuests={completedQuests}
                stats={questStats}
                userId={user?.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicQuestManagementDashboard;
