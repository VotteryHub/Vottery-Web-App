import React, { useState, useEffect } from 'react';
import { sponsoredElectionsService } from '../../../services/sponsoredElectionsService';
import { DollarSign, TrendingUp, BarChart3, Download } from 'lucide-react';

const RevenueReportingPanel = ({ brandId }) => {
  const [dateRange, setDateRange] = useState('30');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brandId) {
      loadRevenueAnalytics();
    }
  }, [brandId, dateRange]);

  const loadRevenueAnalytics = async () => {
    try {
      setLoading(true);
      const endDate = new Date()?.toISOString();
      const startDate = new Date();
      startDate?.setDate(startDate?.getDate() - parseInt(dateRange));

      const data = await sponsoredElectionsService?.getRevenueAnalytics(
        brandId,
        startDate?.toISOString(),
        endDate
      );
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading revenue analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading revenue data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Revenue Reporting & Analytics
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e?.target?.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">${analytics?.totalSpent?.toFixed(2) || '0.00'}</div>
          <div className="text-sm text-gray-500 mt-1">{analytics?.totalCampaigns || 0} campaigns</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm text-gray-600">Total Engagements</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics?.totalEngagements?.toLocaleString() || 0}</div>
          <div className="text-sm text-gray-500 mt-1">{analytics?.totalImpressions?.toLocaleString() || 0} impressions</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-sm text-gray-600">Average CPE</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">${analytics?.averageCPE || '0.00'}</div>
          <div className="text-sm text-gray-500 mt-1">per engagement</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-sm text-gray-600">Engagement Rate</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analytics?.averageEngagementRate || '0.00'}%</div>
          <div className="text-sm text-gray-500 mt-1">average across campaigns</div>
        </div>
      </div>
      {/* Revenue by Ad Format */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Ad Format</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-gray-900">Market Research</div>
              <div className="text-sm font-medium text-blue-600">{analytics?.byFormat?.MARKET_RESEARCH?.count || 0} campaigns</div>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              ${analytics?.byFormat?.MARKET_RESEARCH?.revenue?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-600">
              {analytics?.byFormat?.MARKET_RESEARCH?.engagements?.toLocaleString() || 0} engagements
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-gray-900">Hype Prediction</div>
              <div className="text-sm font-medium text-purple-600">{analytics?.byFormat?.HYPE_PREDICTION?.count || 0} campaigns</div>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              ${analytics?.byFormat?.HYPE_PREDICTION?.revenue?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-600">
              {analytics?.byFormat?.HYPE_PREDICTION?.engagements?.toLocaleString() || 0} engagements
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-gray-900">CSR Elections</div>
              <div className="text-sm font-medium text-green-600">{analytics?.byFormat?.CSR?.count || 0} campaigns</div>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              ${analytics?.byFormat?.CSR?.revenue?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-600">
              {analytics?.byFormat?.CSR?.engagements?.toLocaleString() || 0} engagements
            </div>
          </div>
        </div>
      </div>
      {/* SQL Query Example */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Calculation Query</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{`-- Calculate Total Revenue per Sponsored Election
SELECT 
  se.brand_id,
  e.title AS election_title,
  se.cost_per_vote AS unit_price,
  COUNT(v.vote_id) AS total_engagements,
  (COUNT(v.vote_id) * se.cost_per_vote) AS generated_revenue,
  ROUND((COUNT(v.vote_id)::float / se.total_impressions) * 100, 2) AS engagement_rate_pct
FROM sponsored_elections se
JOIN elections e ON se.election_id = e.id
LEFT JOIN votes v ON e.id = v.election_id
WHERE se.brand_id = '${brandId}'
GROUP BY se.brand_id, e.title, se.cost_per_vote, se.total_impressions
ORDER BY generated_revenue DESC;`}</pre>
        </div>
      </div>
      {/* ROI Analysis */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">ROI Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm opacity-90 mb-1">Cost Per Thousand Impressions (CPM)</div>
            <div className="text-3xl font-bold">
              ${analytics?.totalImpressions > 0 ? ((analytics?.totalSpent / analytics?.totalImpressions) * 1000)?.toFixed(2) : '0.00'}
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm opacity-90 mb-1">Cost Per Engagement (CPE)</div>
            <div className="text-3xl font-bold">${analytics?.averageCPE || '0.00'}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm opacity-90 mb-1">Engagement Rate</div>
            <div className="text-3xl font-bold">{analytics?.averageEngagementRate || '0.00'}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReportingPanel;