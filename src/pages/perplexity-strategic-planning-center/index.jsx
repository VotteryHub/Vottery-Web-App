import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import { perplexityStrategicPlanningService } from '../../services/perplexityStrategicPlanningService';
import MarketOpportunitiesPanel from './components/MarketOpportunitiesPanel';
import CompetitiveThreatsPanel from './components/CompetitiveThreatsPanel';
import GrowthStrategiesPanel from './components/GrowthStrategiesPanel';
import AutomatedRecommendationsPanel from './components/AutomatedRecommendationsPanel';
import StrategicOverviewPanel from './components/StrategicOverviewPanel';

const PerplexityStrategicPlanningCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [strategicPlan, setStrategicPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadStrategicPlan();
  }, []);

  const loadStrategicPlan = async () => {
    setLoading(true);
    try {
      // Mock platform data - in production, this would come from actual metrics
      const platformData = {
        totalUsers: 12847,
        activeElections: 34,
        revenue30d: 45892,
        growthRate: 12.5,
        jurisdictions: 15,
        mau: 8500,
        revenueGrowth: 18.3,
        retention: 87.3,
        marketPenetration: 2.4,
        cac: 45,
        ltv: 380,
        competitors: ['Platform A', 'Platform B', 'Platform C'],
        strengths: ['Blockchain verification', 'Gamification', 'Multi-voting systems'],
        weaknesses: ['Limited enterprise features', 'Geographic coverage']
      };

      const { data, error } = await perplexityStrategicPlanningService?.generateComprehensiveStrategicPlan(platformData);
      
      if (error) {
        console.error('Error loading strategic plan:', error);
        return;
      }

      setStrategicPlan(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading strategic plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Strategic Overview', icon: 'LayoutDashboard' },
    { id: 'opportunities', label: 'Market Opportunities', icon: 'Target' },
    { id: 'threats', label: 'Competitive Threats', icon: 'ShieldAlert' },
    { id: 'strategies', label: 'Growth Strategies', icon: 'TrendingUp' },
    { id: 'recommendations', label: 'Automated Recommendations', icon: 'Sparkles' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Perplexity Strategic Planning Center
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                AI-Powered Market Opportunities, Competitive Threats & Platform Growth Strategies with 60-90 Day Forecasting
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Icon name="Zap" size={16} className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                  Perplexity Extended Reasoning
                </span>
              </div>
              <button
                onClick={loadStrategicPlan}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
                Refresh Analysis
              </button>
            </div>
          </div>

          {lastUpdated && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Last analyzed: {lastUpdated?.toLocaleString()}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab?.id
                    ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && !strategicPlan ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing market data with Perplexity AI...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <StrategicOverviewPanel data={strategicPlan} />}
            {activeTab === 'opportunities' && <MarketOpportunitiesPanel data={strategicPlan?.marketOpportunities} />}
            {activeTab === 'threats' && <CompetitiveThreatsPanel data={strategicPlan?.competitiveThreats} />}
            {activeTab === 'strategies' && <GrowthStrategiesPanel data={strategicPlan?.growthStrategies} />}
            {activeTab === 'recommendations' && <AutomatedRecommendationsPanel data={strategicPlan?.automatedRecommendations} />}
          </>
        )}
      </div>
    </div>
  );
};

export default PerplexityStrategicPlanningCenter;