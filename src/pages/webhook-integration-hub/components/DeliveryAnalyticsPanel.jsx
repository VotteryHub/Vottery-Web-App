import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import { webhookService } from '../../../services/webhookService';

const DeliveryAnalyticsPanel = ({ webhooks }) => {
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (webhooks?.length > 0 && !selectedWebhook) {
      setSelectedWebhook(webhooks?.[0]?.id);
    }
  }, [webhooks]);

  useEffect(() => {
    if (selectedWebhook) {
      loadStatistics();
    }
  }, [selectedWebhook]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const result = await webhookService?.getWebhookStatistics(selectedWebhook);
      if (result?.data) {
        setStatistics(result?.data);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Webhook Selector */}
      {webhooks?.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Webhook</label>
          <select
            value={selectedWebhook || ''}
            onChange={(e) => setSelectedWebhook(e?.target?.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            {webhooks?.map((webhook) => (
              <option key={webhook?.id} value={webhook?.id}>
                {webhook?.name} - {webhook?.url}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Performance Metrics */}
      {!loading && statistics && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Delivery Analytics</h2>
              <p className="text-gray-600">Performance metrics and automated retry statistics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Deliveries</span>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.totalDeliveries || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Successful</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.successfulDeliveries || 0}</p>
              <p className="text-xs text-gray-500 mt-1">{statistics?.successRate}% success rate</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Failed</span>
                <Activity className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.failedDeliveries || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Requires attention</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Avg Response</span>
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics?.averageResponseTime?.toFixed(0) || 0}ms</p>
              <p className="text-xs text-gray-500 mt-1">Response time</p>
            </div>
          </div>

          {/* Success Rate Visualization */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Delivery Success Rate</h3>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                  style={{ width: `${statistics?.successRate || 0}%` }}
                >
                  <span className="text-xs text-white font-bold">{statistics?.successRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAnalyticsPanel;