import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AllocationControlMatrix from './components/AllocationControlMatrix';
import AIUserFiltering from './components/AIUserFiltering';
import RealTimeAnalytics from './components/RealTimeAnalytics';
import CampaignManagement from './components/CampaignManagement';
import WinnerSelectionEngine from './components/WinnerSelectionEngine';
import DisplayConfiguration from './components/DisplayConfiguration';
import Icon from '../../components/AppIcon';

export default function PlatformGamificationCoreEngine() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [gamificationEnabled, setGamificationEnabled] = useState(true);
  const [activeCampaign, setActiveCampaign] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'allocation', label: 'Allocation Matrix', icon: 'Sliders' },
    { id: 'ai-filtering', label: 'AI User Filtering', icon: 'Brain' },
    { id: 'analytics', label: 'Real-Time Analytics', icon: 'TrendingUp' },
    { id: 'campaigns', label: 'Campaign Management', icon: 'Calendar' },
    { id: 'winner-selection', label: 'Winner Selection', icon: 'Trophy' },
    { id: 'display', label: 'Display Configuration', icon: 'Monitor' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="Sparkles" className="w-8 h-8 text-purple-600" />
                Platform Gamification Core Engine
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Comprehensive allocation management with advanced percentization controls
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <button
                  onClick={() => setGamificationEnabled(!gamificationEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    gamificationEnabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      gamificationEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${
                  gamificationEnabled ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {gamificationEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400' :'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon name={tab?.icon} className="w-4 h-4" />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!gamificationEnabled && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Icon name="AlertTriangle" className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Platform Gamification is currently disabled. Enable it to activate prize distribution.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Campaign</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {activeCampaign?.name || 'None'}
                    </p>
                  </div>
                  <Icon name="Calendar" className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Prize Pool</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      ${activeCampaign?.prizePool?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <Icon name="DollarSign" className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Eligible Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {activeCampaign?.eligibleUsers?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <Icon name="Users" className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Winners Selected</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {activeCampaign?.winnersCount || '0'}
                    </p>
                  </div>
                  <Icon name="Trophy" className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">RNG Engine</span>
                  <span className="flex items-center gap-2 text-sm text-green-600">
                    <Icon name="CheckCircle" className="w-4 h-4" />
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI Filtering</span>
                  <span className="flex items-center gap-2 text-sm text-green-600">
                    <Icon name="CheckCircle" className="w-4 h-4" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Stripe Integration</span>
                  <span className="flex items-center gap-2 text-sm text-green-600">
                    <Icon name="CheckCircle" className="w-4 h-4" />
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">API Access</span>
                  <span className="flex items-center gap-2 text-sm text-green-600">
                    <Icon name="CheckCircle" className="w-4 h-4" />
                    Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'allocation' && <AllocationControlMatrix />}
        {activeTab === 'ai-filtering' && <AIUserFiltering />}
        {activeTab === 'analytics' && <RealTimeAnalytics />}
        {activeTab === 'campaigns' && <CampaignManagement onCampaignSelect={setActiveCampaign} />}
        {activeTab === 'winner-selection' && <WinnerSelectionEngine campaign={activeCampaign} />}
        {activeTab === 'display' && <DisplayConfiguration />}
      </div>
    </div>
  );
}