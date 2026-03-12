import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ShoppingCart, Users, Target, BarChart3 } from 'lucide-react';

import revenueReportingService from '../../../services/revenueReportingService';

const RevenueAttributionPanel = ({ selectedCampaign }) => {
  const [conversionData, setConversionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCampaign) {
      loadConversionData();
    }
  }, [selectedCampaign]);

  const loadConversionData = async () => {
    setLoading(true);
    try {
      const result = await revenueReportingService?.getConversionAttribution(selectedCampaign?.id);
      if (result?.success) {
        setConversionData(result?.data);
      }
    } catch (error) {
      console.error('Error loading conversion data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCampaign) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Select a campaign to view revenue attribution</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading conversion data...</p>
      </div>
    );
  }

  // Mock ROI data (in production, calculate from actual conversions)
  const roiMetrics = {
    direct_sales: 12450.00,
    customer_acquisition_cost: 23.50,
    lifetime_value_improvement: 18.7,
    roi_percentage: 245.8
  };

  const conversionFunnel = [
    { stage: 'Impressions', count: 15000, percentage: 100 },
    { stage: 'Engagements', count: 1200, percentage: 8 },
    { stage: 'Click-Through', count: 480, percentage: 3.2 },
    { stage: 'Conversions', count: 96, percentage: 0.64 }
  ];

  return (
    <div className="space-y-6">
      {/* Direct Sales Correlation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Direct Sales Correlation & ROI
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Direct Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${roiMetrics?.direct_sales?.toLocaleString()}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CAC</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${roiMetrics?.customer_acquisition_cost}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">LTV Improvement</p>
                <p className="text-2xl font-bold text-gray-900">
                  +{roiMetrics?.lifetime_value_improvement}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ROI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {roiMetrics?.roi_percentage}%
                </p>
              </div>
              <Target className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-900">
            <strong>ROI Calculation:</strong> For every $1 spent on this campaign, you generated ${(roiMetrics?.roi_percentage / 100)?.toFixed(2)} in revenue. 
            Your participatory advertising strategy is delivering {roiMetrics?.roi_percentage}% ROI.
          </p>
        </div>
      </div>
      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Multi-Touch Attribution Funnel
        </h3>

        <div className="space-y-4">
          {conversionFunnel?.map((stage, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{stage?.stage}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{stage?.count?.toLocaleString()}</span>
                  <span className="text-sm font-bold text-blue-600">{stage?.percentage}%</span>
                </div>
              </div>
              <div className="relative bg-gray-200 rounded-full h-8">
                <div
                  className="absolute bg-gradient-to-r from-blue-500 to-purple-600 h-8 rounded-full flex items-center justify-center"
                  style={{ width: `${stage?.percentage}%` }}
                >
                  {stage?.percentage >= 10 && (
                    <span className="text-xs font-medium text-white">
                      {stage?.count?.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Conversion Events */}
      {conversionData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Conversion Events Tracking
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Conversions</p>
              <p className="text-2xl font-bold text-gray-900">
                {conversionData?.total_conversions?.toLocaleString() || 0}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${conversionData?.total_value?.toLocaleString() || 0}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Avg Conversion Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${conversionData?.total_conversions > 0 
                  ? (conversionData?.total_value / conversionData?.total_conversions)?.toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
          </div>

          {/* Conversions by Type */}
          {conversionData?.conversions_by_type && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Conversions by Event Type</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(conversionData?.conversions_by_type)?.map(([type, count]) => (
                  <div key={type} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">{type?.replace('_', ' ')}</p>
                    <p className="text-lg font-bold text-gray-900">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Conversions */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Conversions</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Event Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {conversionData?.recent_conversions?.slice(0, 5)?.map((conversion, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {conversion?.event_type?.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        ${parseFloat(conversion?.conversion_value || 0)?.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(conversion.tracked_at)?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Multi-Touch Attribution Model */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
          Multi-Touch Attribution Modeling
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">First-Touch Attribution</p>
            <p className="text-2xl font-bold text-gray-900">35%</p>
            <p className="text-xs text-gray-600 mt-1">Initial campaign exposure</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Mid-Touch Attribution</p>
            <p className="text-2xl font-bold text-gray-900">40%</p>
            <p className="text-xs text-gray-600 mt-1">Engagement interactions</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Last-Touch Attribution</p>
            <p className="text-2xl font-bold text-gray-900">25%</p>
            <p className="text-xs text-gray-600 mt-1">Final conversion trigger</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAttributionPanel;