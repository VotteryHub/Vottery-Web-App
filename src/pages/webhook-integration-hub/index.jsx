import React, { useState, useEffect } from 'react';
import { Webhook, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { webhookService } from '../../services/webhookService';
import { useAuth } from '../../contexts/AuthContext';
import EventConfigurationPanel from './components/EventConfigurationPanel';
import WebhookManagementPanel from './components/WebhookManagementPanel';
import DeliveryTrackingPanel from './components/DeliveryTrackingPanel';
import ExternalIntegrationPanel from './components/ExternalIntegrationPanel';
import DeliveryAnalyticsPanel from './components/DeliveryAnalyticsPanel';
import WebhookTestingPanel from './components/WebhookTestingPanel';
import Icon from '../../components/AppIcon';


const WebhookIntegrationHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('webhooks');
  const [webhooks, setWebhooks] = useState([]);
  const [statistics, setStatistics] = useState({
    totalWebhooks: 0,
    activeWebhooks: 0,
    totalDeliveries: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadWebhooks();
    }
  }, [user]);

  const loadWebhooks = async () => {
    try {
      const result = await webhookService?.getUserWebhooks(user?.id);
      if (result?.data) {
        setWebhooks(result?.data);
        calculateStatistics(result?.data);
      }
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = async (webhooksList) => {
    const activeCount = webhooksList?.filter(w => w?.isActive)?.length;
    let totalDeliveries = 0;
    let successfulDeliveries = 0;

    for (const webhook of webhooksList) {
      const statsResult = await webhookService?.getWebhookStatistics(webhook?.id);
      if (statsResult?.data) {
        totalDeliveries += statsResult?.data?.totalDeliveries || 0;
        successfulDeliveries += statsResult?.data?.successfulDeliveries || 0;
      }
    }

    setStatistics({
      totalWebhooks: webhooksList?.length,
      activeWebhooks: activeCount,
      totalDeliveries,
      successRate: totalDeliveries > 0 ? ((successfulDeliveries / totalDeliveries) * 100)?.toFixed(2) : 0
    });
  };

  const tabs = [
    { id: 'webhooks', label: 'Webhook Management', icon: Webhook },
    { id: 'events', label: 'Event Configuration', icon: Activity },
    { id: 'delivery', label: 'Delivery Tracking', icon: Clock },
    { id: 'integrations', label: 'External Integrations', icon: CheckCircle },
    { id: 'analytics', label: 'Delivery Analytics', icon: Activity },
    { id: 'testing', label: 'Webhook Testing', icon: XCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Webhook Integration Hub</h1>
          <p className="text-gray-600">Configurable event notifications and external system integrations</p>
        </div>

        {/* Statistics Overview */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Webhooks</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics?.totalWebhooks}</p>
                </div>
                <Webhook className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Webhooks</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics?.activeWebhooks}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Deliveries (7d)</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics?.totalDeliveries}</p>
                </div>
                <Activity className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics?.successRate}%</p>
                </div>
                <CheckCircle className="w-12 h-12 text-orange-500 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs?.map((tab) => {
              const Icon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-purple-500 text-white border-b-4 border-purple-700' :'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab?.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'webhooks' && <WebhookManagementPanel webhooks={webhooks} onRefresh={loadWebhooks} />}
          {activeTab === 'events' && <EventConfigurationPanel />}
          {activeTab === 'delivery' && <DeliveryTrackingPanel webhooks={webhooks} />}
          {activeTab === 'integrations' && <ExternalIntegrationPanel />}
          {activeTab === 'analytics' && <DeliveryAnalyticsPanel webhooks={webhooks} />}
          {activeTab === 'testing' && <WebhookTestingPanel webhooks={webhooks} />}
        </div>
      </div>
    </div>
  );
};

export default WebhookIntegrationHub;