import React, { useState, useEffect } from 'react';
import { AlertTriangle, Target, Users, DollarSign, Activity, Brain, Zap, BarChart3 } from 'lucide-react';
import claudePredictiveAnalyticsService from '../../services/claudePredictiveAnalyticsService';
import RevenueForecastPanel from './components/RevenueForecastPanel';
import ChurnPredictionPanel from './components/ChurnPredictionPanel';
import CampaignOptimizationPanel from './components/CampaignOptimizationPanel';
import AnomalyCorrelationPanel from './components/AnomalyCorrelationPanel';
import BusinessIntelligencePanel from './components/BusinessIntelligencePanel';



function ClaudePredictiveAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [overviewMetrics, setOverviewMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [creatorData, setCreatorData] = useState(null);

  useEffect(() => {
    loadOverviewMetrics();
    loadCreatorData();
  }, []);

  const loadOverviewMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await claudePredictiveAnalyticsService?.getStoredForecasts(null, 5);
      if (fetchError) throw new Error(fetchError.message);
      setOverviewMetrics(data);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCreatorData = async () => {
    // Fetch creator data if needed
    // This is a placeholder implementation
    setCreatorData({});
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Brain },
    { id: 'revenue', label: 'Revenue Forecast', icon: DollarSign },
    { id: 'churn', label: 'Churn Prediction', icon: Users },
    { id: 'campaigns', label: 'Campaign Optimization', icon: Target },
    { id: 'anomalies', label: 'Anomaly Correlation', icon: AlertTriangle },
    { id: 'intelligence', label: 'Business Intelligence', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Claude Predictive Analytics</h1>
            <p className="text-gray-600">AI-Powered Business Intelligence &amp; Forecasting</p>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-6 p-2">
        <div className="flex flex-wrap gap-2">
          {tabs?.map(tab => {
            const TabIcon = tab?.icon;
            return (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === tab?.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab?.label}
              </button>
            );
          })}
        </div>
      </div>
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Error Loading Analytics</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Revenue Forecasts</h3>
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {overviewMetrics?.filter(m => m?.type === 'revenue_forecast')?.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Generated forecasts</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Churn Predictions</h3>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {overviewMetrics?.filter(m => m?.type === 'churn_prediction')?.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Risk assessments</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Campaign Optimizations</h3>
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {overviewMetrics?.filter(m => m?.type === 'campaign_optimization')?.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Recommendations</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Anomaly Correlations</h3>
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {overviewMetrics?.filter(m => m?.type === 'anomaly_correlation')?.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Detected patterns</p>
            </div>
          </div>

          {/* Recent Analytics */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Analytics</h2>
              <button
                onClick={loadOverviewMetrics}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : overviewMetrics?.length > 0 ? (
              <div className="space-y-4">
                {overviewMetrics?.map((metric, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {metric?.type === 'revenue_forecast' && <DollarSign className="w-5 h-5 text-purple-600" />}
                        {metric?.type === 'churn_prediction' && <Users className="w-5 h-5 text-blue-600" />}
                        {metric?.type === 'campaign_optimization' && <Target className="w-5 h-5 text-green-600" />}
                        {metric?.type === 'anomaly_correlation' && <AlertTriangle className="w-5 h-5 text-orange-600" />}
                        {metric?.type === 'bi_report' && <BarChart3 className="w-5 h-5 text-indigo-600" />}
                        <span className="font-semibold text-gray-900 capitalize">
                          {metric?.type?.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(metric?.generatedAt)?.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Analysis generated by Claude AI with comprehensive insights
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No analytics generated yet</p>
                <p className="text-sm text-gray-400 mt-1">Generate forecasts from the tabs above</p>
              </div>
            )}
          </div>

          {/* AI Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <Zap className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">Powered by Claude Sonnet 4.5</h3>
              <p className="text-purple-100 text-sm">
                Advanced AI model with 200K context window, delivering state-of-the-art predictive analytics and business intelligence insights.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
              <Activity className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-Time Analysis</h3>
              <p className="text-blue-100 text-sm">
                Continuous monitoring of platform metrics with automated anomaly detection and correlation across all business domains.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Revenue Forecast Tab */}
      {activeTab === 'revenue' && <RevenueForecastPanel creatorData={creatorData} />}
      {/* Churn Prediction Tab */}
      {activeTab === 'churn' && <ChurnPredictionPanel />}
      {/* Campaign Optimization Tab */}
      {activeTab === 'campaigns' && <CampaignOptimizationPanel />}
      {/* Anomaly Correlation Tab */}
      {activeTab === 'anomalies' && <AnomalyCorrelationPanel analyses={[]} metrics={[]} />}
      {/* Business Intelligence Tab */}
      {activeTab === 'intelligence' && <BusinessIntelligencePanel />}
    </div>
  );
}

export default ClaudePredictiveAnalyticsDashboard;
