import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { TrendingUp, Users, BarChart3, PieChart, Target, AlertTriangle } from 'lucide-react';
import { revenueShareService } from '../../services/revenueShareService';
import { revenueSplitForecastingService } from '../../services/revenueSplitForecastingService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const RevenueSplitAnalyticsImpactDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    overview: null,
    creatorImpact: [],
    platformOptimization: null,
    campaignEffectiveness: [],
    historicalPerformance: []
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [aiOptimizations, setAiOptimizations] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
    analytics?.trackEvent('revenue_split_analytics_viewed', {
      active_tab: activeTab,
      time_range: timeRange
    });
  }, [activeTab, timeRange]);

  useRealtimeMonitoring({
    tables: ['revenue_sharing_history', 'system_alerts'],
    onRefresh: loadAnalyticsData,
    enabled: true,
  });

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [analyticsResult, campaignsResult, historyResult] = await Promise.all([
        revenueShareService?.getRevenueSplitAnalytics(timeRange),
        revenueShareService?.getAllCampaigns(),
        revenueShareService?.getRevenueSharingHistory(100)
      ]);

      if (analyticsResult?.data) {
        setAnalyticsData(prev => ({
          ...prev,
          overview: analyticsResult?.data,
          campaignEffectiveness: campaignsResult?.data || [],
          historicalPerformance: historyResult?.data || []
        }));
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadAnalyticsData();
  };

  const tabs = [
    { id: 'overview', label: 'Performance Overview', icon: BarChart3 },
    { id: 'creator-impact', label: 'Creator Impact', icon: Users },
    { id: 'platform-optimization', label: 'Platform Optimization', icon: Target },
    { id: 'campaign-effectiveness', label: 'Campaign Effectiveness', icon: TrendingUp },
    { id: 'historical', label: 'Historical Performance', icon: PieChart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Helmet>
        <title>Revenue Split Analytics & Impact Dashboard | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Revenue Split Analytics & Impact
              </h1>
              <p className="text-gray-600">
                Comprehensive performance analysis of revenue sharing configurations with creator earnings tracking
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e?.target?.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <div className="text-right">
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="text-lg font-semibold text-gray-900">
                  {lastUpdated?.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab?.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <PerformanceOverviewPanel 
              data={analyticsData?.overview}
              loading={loading}
            />
          )}

          {activeTab === 'creator-impact' && (
            <CreatorImpactPanel 
              data={analyticsData?.creatorImpact}
              loading={loading}
            />
          )}

          {activeTab === 'platform-optimization' && (
            <PlatformOptimizationPanel
              data={analyticsData?.platformOptimization}
              loading={loading}
              historicalPerformance={analyticsData?.historicalPerformance}
              aiOptimizations={aiOptimizations}
              aiLoading={aiLoading}
              onGenerateAI={async () => {
                setAiLoading(true);
                setAiOptimizations(null);
                try {
                  const result = await revenueSplitForecastingService?.generateClaudeOptimizations?.(
                    { creatorPercentage: 70, platformPercentage: 30 },
                    { historical: analyticsData?.historicalPerformance || [] }
                  );
                  setAiOptimizations(result?.data ?? result);
                } catch (e) {
                  console.error('AI optimization error:', e);
                } finally {
                  setAiLoading(false);
                }
              }}
            />
          )}

          {activeTab === 'campaign-effectiveness' && (
            <CampaignEffectivenessPanel 
              campaigns={analyticsData?.campaignEffectiveness}
              loading={loading}
            />
          )}

          {activeTab === 'historical' && (
            <HistoricalPerformancePanel 
              history={analyticsData?.historicalPerformance}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Performance Overview Panel
const PerformanceOverviewPanel = ({ data, loading }) => {
  if (loading) {
    return <div className="text-center py-12">Loading performance overview...</div>;
  }

  const metrics = [
    { label: 'Total Revenue', value: '$64,686', change: '+12.5%', trend: 'up', color: 'indigo' },
    { label: 'Creator Earnings', value: '$45,280', change: '+15.2%', trend: 'up', color: 'green' },
    { label: 'Platform Revenue', value: '$19,406', change: '+8.3%', trend: 'up', color: 'blue' },
    { label: 'Avg Split Ratio', value: '70/30', change: 'Stable', trend: 'neutral', color: 'purple' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics?.map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">{metric?.label}</div>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                metric?.trend === 'up' ? 'bg-green-100 text-green-800' :
                metric?.trend === 'down'? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {metric?.change}
              </div>
            </div>
            <div className={`text-3xl font-bold text-${metric?.color}-600`}>
              {metric?.value}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Split Performance Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Split Performance Across Configurations</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">70/30 Split (Default)</span>
              <span className="text-green-600 font-bold">$45,280</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-600 h-3 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">90/10 Split (Morale Booster)</span>
              <span className="text-purple-600 font-bold">$58,217</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-purple-600 h-3 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">68/32 Split (Strategic)</span>
              <span className="text-blue-600 font-bold">$43,987</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Creator Satisfaction Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Creator Satisfaction Correlation</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">90/10 Split</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="font-bold text-green-600">95%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">70/30 Split</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <span className="font-bold text-blue-600">82%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">68/32 Split</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                </div>
                <span className="font-bold text-yellow-600">76%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Profitability Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue Maximization</span>
              <span className="font-bold text-indigo-600">68/32 Split</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Creator Retention</span>
              <span className="font-bold text-green-600">90/10 Split</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Balanced Growth</span>
              <span className="font-bold text-blue-600">70/30 Split</span>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Recommendation:</strong> Maintain 70/30 for sustainable growth with periodic 90/10 campaigns for morale boosts.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Creator Impact Analysis Panel
const CreatorImpactPanel = ({ data, loading }) => {
  if (loading) {
    return <div className="text-center py-12">Loading creator impact analysis...</div>;
  }

  const creatorTiers = [
    { tier: 'Top Tier (90/10)', creators: 45, avgEarnings: '$2,847', retention: '98%', satisfaction: '96%' },
    { tier: 'Premium (75/25)', creators: 128, avgEarnings: '$1,523', retention: '92%', satisfaction: '89%' },
    { tier: 'Standard (70/30)', creators: 1074, avgEarnings: '$847', retention: '85%', satisfaction: '82%' },
    { tier: 'Basic (68/32)', creators: 342, avgEarnings: '$612', retention: '78%', satisfaction: '74%' }
  ];

  return (
    <div className="space-y-6">
      {/* Creator Tier Analysis */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Individual Creator Earnings by Split Scenario</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Creator Tier</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Creators</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Avg Earnings</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Retention Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {creatorTiers?.map((tier, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{tier?.tier}</td>
                  <td className="py-3 px-4 text-gray-600">{tier?.creators}</td>
                  <td className="py-3 px-4 font-semibold text-green-600">{tier?.avgEarnings}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: tier?.retention }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">{tier?.retention}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {tier?.satisfaction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demographic Segmentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Retention Rates by Revenue Percentage</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">90% Creator Share</span>
                <span className="text-green-600 font-bold">98% Retention</span>
              </div>
              <p className="text-sm text-gray-600">Highest retention, ideal for top performers and morale campaigns</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">70% Creator Share</span>
                <span className="text-blue-600 font-bold">85% Retention</span>
              </div>
              <p className="text-sm text-gray-600">Balanced retention with sustainable platform revenue</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">68% Creator Share</span>
                <span className="text-yellow-600 font-bold">78% Retention</span>
              </div>
              <p className="text-sm text-gray-600">Lower retention, requires additional incentives</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Satisfaction Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Overall Satisfaction</span>
                <span className="font-bold text-green-600">84%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Payment Timeliness</span>
                <span className="font-bold text-blue-600">96%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Split Transparency</span>
                <span className="font-bold text-purple-600">91%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-600 h-3 rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Platform Optimization Panel
const PlatformOptimizationPanel = ({ data, loading, aiOptimizations, aiLoading, onGenerateAI }) => {
  if (loading) {
    return <div className="text-center py-12">Loading platform optimization...</div>;
  }

  return (
    <div className="space-y-6">
      {/* AI Split Optimization Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">AI Split Optimization</h3>
          <button
            onClick={onGenerateAI}
            disabled={aiLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiLoading ? 'Generating...' : 'Generate AI Recommendations'}
          </button>
        </div>
        {aiOptimizations && (
          <div className="space-y-4 mt-4">
            {aiOptimizations?.recommendations?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Claude Recommendations</h4>
                <div className="space-y-2">
                  {aiOptimizations.recommendations.map((r, i) => (
                    <div key={i} className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-xl">
                      <div className="font-semibold text-gray-900">{r?.title || r?.newSplit}</div>
                      <p className="text-sm text-gray-700 mt-1">{r?.reasoning}</p>
                      <div className="text-xs text-gray-600 mt-2">
                        Impact: {r?.impact} | Risk: {r?.risk} | Confidence: {r?.confidence}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {aiOptimizations?.strategicTiming && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Strategic Timing</h4>
                <p className="text-sm text-gray-700">{typeof aiOptimizations.strategicTiming === 'string' ? aiOptimizations.strategicTiming : JSON.stringify(aiOptimizations.strategicTiming)}</p>
              </div>
            )}
            {aiOptimizations?.implementationSteps?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Implementation Steps</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  {aiOptimizations.implementationSteps.map((step, i) => (
                    <li key={i}>{typeof step === 'string' ? step : step?.step || step?.description}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Revenue Maximization Strategies */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Maximization Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Aggressive Growth</div>
            <div className="text-2xl font-bold text-green-600 mb-2">90/10 Split</div>
            <p className="text-sm text-gray-700">Maximize creator acquisition and retention</p>
            <div className="mt-3 text-xs text-gray-600">
              <div>• +28% creator signups</div>
              <div>• +15% content volume</div>
              <div>• -35% platform revenue</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Balanced Approach</div>
            <div className="text-2xl font-bold text-blue-600 mb-2">70/30 Split</div>
            <p className="text-sm text-gray-700">Sustainable growth with healthy margins</p>
            <div className="mt-3 text-xs text-gray-600">
              <div>• Stable creator base</div>
              <div>• Predictable revenue</div>
              <div>• Optimal for long-term</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-sm text-gray-600 mb-1">Revenue Focus</div>
            <div className="text-2xl font-bold text-purple-600 mb-2">68/32 Split</div>
            <p className="text-sm text-gray-700">Maximize platform profitability</p>
            <div className="mt-3 text-xs text-gray-600">
              <div>• +7% platform revenue</div>
              <div>• -8% creator retention</div>
              <div>• Requires incentives</div>
            </div>
          </div>
        </div>
      </div>

      {/* Split Adjustment Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Split Adjustment Recommendations</h3>
        <div className="space-y-3">
          <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-xl">
            <div className="font-semibold text-gray-900 mb-1">Quarterly Morale Booster</div>
            <p className="text-sm text-gray-700 mb-2">
              Implement 90/10 split for 2-week periods each quarter to boost creator morale and content quality
            </p>
            <div className="text-xs text-gray-600">
              Expected Impact: +12% creator satisfaction, +8% content volume
            </div>
          </div>
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-xl">
            <div className="font-semibold text-gray-900 mb-1">Tier-Based Splits</div>
            <p className="text-sm text-gray-700 mb-2">
              Offer premium creators 75/25 or 80/20 splits based on performance metrics
            </p>
            <div className="text-xs text-gray-600">
              Expected Impact: +15% top creator retention, +5% platform revenue from volume
            </div>
          </div>
          <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-xl">
            <div className="font-semibold text-gray-900 mb-1">Dynamic Adjustment</div>
            <p className="text-sm text-gray-700 mb-2">
              Automatically adjust splits based on market conditions and competitor analysis
            </p>
            <div className="text-xs text-gray-600">
              Expected Impact: Maintain competitive edge, optimize revenue across market cycles
            </div>
          </div>
        </div>
      </div>

      {/* Competitive Analysis */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Competitive Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Platform</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Creator Share</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Platform Share</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-indigo-600">Vottery (Current)</td>
                <td className="py-3 px-4 font-bold text-green-600">70%</td>
                <td className="py-3 px-4 font-bold text-blue-600">30%</td>
                <td className="py-3 px-4 text-sm text-gray-600">Competitive positioning</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-900">Competitor A</td>
                <td className="py-3 px-4 text-gray-600">65%</td>
                <td className="py-3 px-4 text-gray-600">35%</td>
                <td className="py-3 px-4 text-sm text-gray-600">Lower creator share</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-900">Competitor B</td>
                <td className="py-3 px-4 text-gray-600">75%</td>
                <td className="py-3 px-4 text-gray-600">25%</td>
                <td className="py-3 px-4 text-sm text-gray-600">Higher creator share</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Campaign Effectiveness Panel
const CampaignEffectivenessPanel = ({ campaigns, loading }) => {
  if (loading) {
    return <div className="text-center py-12">Loading campaign effectiveness...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Campaign Performance Metrics</h3>
        <div className="space-y-4">
          {campaigns?.filter(c => c?.status === 'completed' || c?.status === 'active')?.map((campaign) => (
            <div key={campaign?.id} className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-900">{campaign?.campaignName}</div>
                  <div className="text-sm text-gray-600">
                    {campaign?.creatorPercentage}% / {campaign?.platformPercentage}% split
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  campaign?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign?.status}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <div className="text-xs text-gray-600">Creator Participation</div>
                  <div className="text-lg font-bold text-green-600">+24%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Engagement Rate</div>
                  <div className="text-lg font-bold text-blue-600">+18%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Satisfaction Score</div>
                  <div className="text-lg font-bold text-purple-600">92%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Historical Performance Panel
const HistoricalPerformancePanel = ({ history, loading }) => {
  if (loading) {
    return <div className="text-center py-12">Loading historical performance...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Long-term Revenue Split Trends</h3>
        <div className="space-y-3">
          {history?.slice(0, 10)?.map((entry) => (
            <div key={entry?.id} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {entry?.previousCreatorPercentage}% → {entry?.newCreatorPercentage}% (Creator)
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {entry?.changeDescription || 'Revenue split adjustment'}
                  </div>
                  {entry?.affectedCreatorsCount > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Affected {entry?.affectedCreatorsCount} creators
                    </div>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  {new Date(entry?.changedAt)?.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive Modeling */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Predictive Modeling for Future Configurations</h3>
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Recommended Split (Q2 2026)</div>
              <div className="text-2xl font-bold text-indigo-600">72/28</div>
              <p className="text-xs text-gray-600 mt-1">Based on market trends and creator growth</p>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Projected Creator Earnings</div>
              <div className="text-2xl font-bold text-green-600">$52,400</div>
              <p className="text-xs text-gray-600 mt-1">+15.7% from current configuration</p>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Platform Sustainability Score</div>
              <div className="text-2xl font-bold text-blue-600">88/100</div>
              <p className="text-xs text-gray-600 mt-1">Excellent long-term viability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueSplitAnalyticsImpactDashboard;