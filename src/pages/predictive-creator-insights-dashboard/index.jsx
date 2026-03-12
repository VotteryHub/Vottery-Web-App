import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Brain, TrendingUp, Lightbulb, DollarSign, Clock, BarChart2, User } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import { useAuth } from '../../contexts/AuthContext';
import CreatorPerformancePanel from './components/CreatorPerformancePanel';
import OptimalTimingPanel from './components/OptimalTimingPanel';
import PricingStrategyPanel from './components/PricingStrategyPanel';
import RevenueForecastPanel from './components/RevenueForecastPanel';
import ElectionTopicRecommendations from './components/ElectionTopicRecommendations';
import Icon from '../../components/AppIcon';


const TABS = [
  { id: 'performance', label: 'Performance', icon: BarChart2 },
  { id: 'topics', label: 'Topic Recommendations', icon: Lightbulb },
  { id: 'timing', label: 'Optimal Timing', icon: Clock },
  { id: 'pricing', label: 'Pricing Strategy', icon: DollarSign },
  { id: 'forecast', label: 'Revenue Forecast', icon: TrendingUp },
];

const PredictiveCreatorInsightsDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('performance');
  const [creatorData, setCreatorData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleDataLoaded = (data) => {
    setCreatorData(data);
    setLastUpdated(new Date());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Predictive Creator Insights Dashboard | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Predictive Creator Insights</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered recommendations powered by Perplexity extended reasoning</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{user?.email?.split('@')?.[0] || 'Creator'}</span>
                </div>
                <div className="text-xs text-gray-400">Updated: {lastUpdated?.toLocaleTimeString()}</div>
              </div>
            </div>

            {/* KPI Summary */}
            {creatorData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {[
                  { label: 'Total Elections', value: creatorData?.totalElections, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                  { label: 'Total Votes', value: creatorData?.totalVotes?.toLocaleString(), color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Engagement Rate', value: `${creatorData?.engagementRate}%`, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
                  { label: 'Total Earnings', value: `$${parseFloat(creatorData?.totalEarnings || 0)?.toLocaleString()}`, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                ]?.map((kpi, i) => (
                  <div key={i} className={`${kpi?.bg} rounded-xl p-4`}>
                    <p className="text-xs text-gray-500 mb-1">{kpi?.label}</p>
                    <p className={`text-xl font-bold ${kpi?.color}`}>{kpi?.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 overflow-x-auto">
            {TABS?.map(tab => {
              const Icon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab?.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'performance' && (
              <CreatorPerformancePanel creatorId={user?.id} onDataLoaded={handleDataLoaded} />
            )}
            {activeTab === 'topics' && (
              <ElectionTopicRecommendations creatorData={creatorData} />
            )}
            {activeTab === 'timing' && (
              <OptimalTimingPanel creatorData={creatorData} />
            )}
            {activeTab === 'pricing' && (
              <PricingStrategyPanel creatorData={creatorData} />
            )}
            {activeTab === 'forecast' && (
              <RevenueForecastPanel creatorData={creatorData} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PredictiveCreatorInsightsDashboard;
