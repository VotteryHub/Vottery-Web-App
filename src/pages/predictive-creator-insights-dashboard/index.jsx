import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Brain, TrendingUp, Lightbulb, DollarSign, Clock, BarChart2, User } from 'lucide-react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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

  const renderContent = () => (
    <div className="w-full py-0">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Updated: {lastUpdated?.toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.email?.split('@')?.[0] || 'Creator'}</span>
        </div>
      </div>

      {creatorData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Elections', value: creatorData?.totalElections, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { label: 'Total Votes', value: creatorData?.totalVotes?.toLocaleString(), color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Engagement Rate', value: `${creatorData?.engagementRate}%`, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Total Earnings', value: `$${parseFloat(creatorData?.totalEarnings || 0)?.toLocaleString()}`, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          ]?.map((kpi, i) => (
            <div key={i} className={`${kpi?.bg} rounded-xl p-4 border border-gray-100 dark:border-gray-700`}>
              <p className="text-xs text-gray-500 mb-1 uppercase font-semibold">{kpi?.label}</p>
              <p className={`text-xl font-bold ${kpi?.color}`}>{kpi?.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-1 mb-6 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 overflow-x-auto">
        {TABS?.map(tab => {
          const TabIcon = tab?.icon;
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
              <TabIcon className="w-4 h-4" />
              {tab?.label}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'performance' && <CreatorPerformancePanel creatorId={user?.id} onDataLoaded={handleDataLoaded} />}
        {activeTab === 'topics' && <ElectionTopicRecommendations creatorData={creatorData} />}
        {activeTab === 'timing' && <OptimalTimingPanel creatorData={creatorData} />}
        {activeTab === 'pricing' && <PricingStrategyPanel creatorData={creatorData} />}
        {activeTab === 'forecast' && <RevenueForecastPanel creatorData={creatorData} />}
      </div>
    </div>
  );

  return (
    <GeneralPageLayout 
      title="Predictive Creator Insights"
      showSidebar={true}
    >
      <div className="w-full py-0">
        <div className="mb-10">
          <p className="text-slate-400 font-medium text-sm">
            AI-driven growth vectors and algorithmic performance orchestration
          </p>
        </div>

        {renderContent()}
      </div>
    </GeneralPageLayout>
  );
};

export default PredictiveCreatorInsightsDashboard;
