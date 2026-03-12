import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { webhookService } from '../../../services/webhookService';

const DeliveryTrackingPanel = ({ webhooks }) => {
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (webhooks?.length > 0 && !selectedWebhook) {
      setSelectedWebhook(webhooks?.[0]?.id);
    }
  }, [webhooks]);

  useEffect(() => {
    if (selectedWebhook) {
      loadDeliveries();
    }
  }, [selectedWebhook]);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const result = await webhookService?.getDeliveryHistory(selectedWebhook, 50);
      if (result?.data) {
        setDeliveries(result?.data);
      }
    } catch (error) {
      console.error('Failed to load deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'delivered') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'failed') return <XCircle className="w-5 h-5 text-red-500" />;
    return <Clock className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusColor = (status) => {
    if (status === 'delivered') return 'bg-green-100 text-green-800';
    if (status === 'failed') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Tracking</h2>
          <p className="text-gray-600">Monitor webhook delivery attempts with failure analysis</p>
        </div>
        <button
          onClick={loadDeliveries}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Webhook Selector */}
      {webhooks?.length > 0 && (
        <div className="mb-6">
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

      {/* Deliveries List */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading deliveries...</p>
        </div>
      ) : deliveries?.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No deliveries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deliveries?.map((delivery) => (
            <div key={delivery?.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(delivery?.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(delivery?.status)}`}>
                      {delivery?.status?.toUpperCase()}
                    </span>
                    <code className="text-sm text-gray-600">{delivery?.eventType}</code>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>Attempt: {delivery?.attemptCount}</span>
                    {delivery?.statusCode && <span>Status Code: {delivery?.statusCode}</span>}
                    {delivery?.responseTime && <span>Response Time: {delivery?.responseTime}ms</span>}
                    <span>{new Date(delivery?.createdAt)?.toLocaleString()}</span>
                  </div>
                  {delivery?.errorMessage && (
                    <p className="mt-2 text-sm text-red-600">Error: {delivery?.errorMessage}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryTrackingPanel;