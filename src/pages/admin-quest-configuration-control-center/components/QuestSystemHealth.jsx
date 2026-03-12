import React from 'react';
import { Activity, CheckCircle2, AlertCircle, TrendingUp, Users, Target } from 'lucide-react';

const QuestSystemHealth = ({ systemStatus, stats }) => {
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-indigo-600" />
        Quest System Health Overview
      </h2>
      {/* System Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Quest Generation</span>
            {React.createElement(getStatusIcon(systemStatus?.questGeneration), {
              className: `w-5 h-5 ${getStatusColor(systemStatus?.questGeneration)?.split(' ')?.[0]}`
            })}
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            getStatusColor(systemStatus?.questGeneration)
          }`}>
            {systemStatus?.questGeneration?.charAt(0)?.toUpperCase() + systemStatus?.questGeneration?.slice(1)}
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">OpenAI API</span>
            {React.createElement(getStatusIcon(systemStatus?.openaiAPI), {
              className: `w-5 h-5 ${getStatusColor(systemStatus?.openaiAPI)?.split(' ')?.[0]}`
            })}
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            getStatusColor(systemStatus?.openaiAPI)
          }`}>
            {systemStatus?.openaiAPI?.charAt(0)?.toUpperCase() + systemStatus?.openaiAPI?.slice(1)}
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">User Engagement</span>
            {React.createElement(getStatusIcon(systemStatus?.userEngagement), {
              className: `w-5 h-5 ${getStatusColor(systemStatus?.userEngagement)?.split(' ')?.[0]}`
            })}
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            getStatusColor(systemStatus?.userEngagement)
          }`}>
            {systemStatus?.userEngagement?.charAt(0)?.toUpperCase() + systemStatus?.userEngagement?.slice(1)}
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Reward Distribution</span>
            {React.createElement(getStatusIcon(systemStatus?.rewardDistribution), {
              className: `w-5 h-5 ${getStatusColor(systemStatus?.rewardDistribution)?.split(' ')?.[0]}`
            })}
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            getStatusColor(systemStatus?.rewardDistribution)
          }`}>
            {systemStatus?.rewardDistribution?.charAt(0)?.toUpperCase() + systemStatus?.rewardDistribution?.slice(1)}
          </div>
        </div>
      </div>
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Quests</div>
              <div className="text-2xl font-bold text-gray-900">{stats?.activeQuests?.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+12% vs last week</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Completion Rate</div>
              <div className="text-2xl font-bold text-gray-900">{stats?.completionRate}%</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+5.2% vs last week</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg Engagement</div>
              <div className="text-2xl font-bold text-gray-900">{stats?.avgEngagement}%</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+8.1% vs last week</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestSystemHealth;