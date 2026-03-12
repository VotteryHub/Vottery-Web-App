import React, { useState, useEffect } from 'react';
import { Settings, Zap, Target, TrendingUp, AlertCircle, CheckCircle2, Activity, Sliders, Brain, BarChart3 } from 'lucide-react';

import QuestParameterConfiguration from './components/QuestParameterConfiguration';
import OpenAIIntegrationManagement from './components/OpenAIIntegrationManagement';
import DifficultySettings from './components/DifficultySettings';
import GlobalQuestControls from './components/GlobalQuestControls';
import QuestSystemHealth from './components/QuestSystemHealth';
import QuestAnalytics from './components/QuestAnalytics';
import Icon from '../../components/AppIcon';


const AdminQuestConfigurationControlCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStatus, setSystemStatus] = useState({
    questGeneration: 'operational',
    openaiAPI: 'operational',
    userEngagement: 'operational',
    rewardDistribution: 'operational'
  });
  const [stats, setStats] = useState({
    activeQuests: 1247,
    completionRate: 68.5,
    avgEngagement: 82.3,
    totalRewardsDistributed: 458920,
    openaiTokensUsed: 125430,
    questsGenerated24h: 3420
  });

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: Activity },
    { id: 'parameters', label: 'Quest Parameters', icon: Sliders },
    { id: 'openai', label: 'OpenAI Integration', icon: Brain },
    { id: 'difficulty', label: 'Difficulty Settings', icon: Target },
    { id: 'controls', label: 'Global Controls', icon: Settings },
    { id: 'analytics', label: 'Quest Analytics', icon: BarChart3 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return CheckCircle2;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Target className="w-8 h-8" />
                Admin Quest Configuration Control Center
              </h1>
              <p className="mt-2 text-purple-100">
                Comprehensive administrative oversight for quest parameters, difficulty settings, and OpenAI integration management
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-100">Quest System Status</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold">All Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-400/20 rounded-lg">
                  <Target className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats?.activeQuests?.toLocaleString()}</div>
                  <div className="text-sm text-purple-100">Active Quests</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-400/20 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats?.completionRate}%</div>
                  <div className="text-sm text-purple-100">Completion Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-400/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats?.avgEngagement}%</div>
                  <div className="text-sm text-purple-100">Avg Engagement</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400/20 rounded-lg">
                  <Zap className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{(stats?.totalRewardsDistributed / 1000)?.toFixed(0)}K</div>
                  <div className="text-sm text-purple-100">VP Distributed</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-400/20 rounded-lg">
                  <Brain className="w-6 h-6 text-pink-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{(stats?.openaiTokensUsed / 1000)?.toFixed(0)}K</div>
                  <div className="text-sm text-purple-100">OpenAI Tokens</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-400/20 rounded-lg">
                  <Activity className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{(stats?.questsGenerated24h / 1000)?.toFixed(1)}K</div>
                  <div className="text-sm text-purple-100">Generated 24h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs?.map((tab) => {
              const Icon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'border-indigo-600 text-indigo-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* System Health Overview */}
            <QuestSystemHealth systemStatus={systemStatus} stats={stats} />

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <Target className="w-6 h-6 text-indigo-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Generate Test Quest</div>
                    <div className="text-sm text-gray-600">Create sample quest</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Test OpenAI API</div>
                    <div className="text-sm text-gray-600">Verify connection</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Bulk Approve</div>
                    <div className="text-sm text-gray-600">Review pending quests</div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Export Report</div>
                    <div className="text-sm text-gray-600">Download analytics</div>
                  </div>
                </button>
              </div>
            </div>

            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(systemStatus)?.map(([key, status]) => {
                const StatusIcon = getStatusIcon(status);
                return (
                  <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium text-gray-600 capitalize">
                        {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                      </div>
                      <StatusIcon className={`w-5 h-5 ${getStatusColor(status)?.split(' ')?.[0]}`} />
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                      {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'parameters' && <QuestParameterConfiguration />}
        {activeTab === 'openai' && <OpenAIIntegrationManagement />}
        {activeTab === 'difficulty' && <DifficultySettings />}
        {activeTab === 'controls' && <GlobalQuestControls />}
        {activeTab === 'analytics' && <QuestAnalytics />}
      </div>
    </div>
  );
};

export default AdminQuestConfigurationControlCenter;