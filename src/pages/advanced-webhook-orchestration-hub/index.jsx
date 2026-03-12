import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { webhookService } from '../../services/webhookService';
import { supabase } from '../../lib/supabase';
import ConditionalRoutingPanel from './components/ConditionalRoutingPanel';
import PayloadTransformationPanel from './components/PayloadTransformationPanel';
import RetryPolicyPanel from './components/RetryPolicyPanel';
import CrossSystemCorrelationPanel from './components/CrossSystemCorrelationPanel';
import WebhookTestingPanel from './components/WebhookTestingPanel';

const AdvancedWebhookOrchestrationHub = () => {
  const [activeTab, setActiveTab] = useState('routing');
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realtimeEvents, setRealtimeEvents] = useState([]);
  const [processingQueue, setProcessingQueue] = useState([]);

  useEffect(() => {
    loadWebhooks();
    setupRealtimeSubscription();
  }, []);

  const loadWebhooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await webhookService?.listWebhooks();
      if (error) throw error;
      setWebhooks(data || []);
    } catch (error) {
      console.error('Error loading webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      ?.channel('webhook_events')
      ?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'webhook_delivery_logs',
        },
        (payload) => {
          setRealtimeEvents((prev) => [payload, ...prev]?.slice(0, 50));
        }
      )
      ?.subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  };

  const tabs = [
    { id: 'routing', label: 'Conditional Routing', icon: 'GitBranch' },
    { id: 'transformation', label: 'Payload Transformation', icon: 'Code' },
    { id: 'retry', label: 'Retry Policies', icon: 'RefreshCw' },
    { id: 'correlation', label: 'Cross-System Correlation', icon: 'Network' },
    { id: 'testing', label: 'Webhook Testing', icon: 'TestTube' },
  ];

  return (
    <>
      <Helmet>
        <title>Advanced Webhook Orchestration Hub | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Advanced Webhook Orchestration Hub
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Real-time Supabase webhook automation with intelligent routing & transformation
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    {webhooks?.filter(w => w?.isActive)?.length} Active Webhooks
                  </span>
                </div>
                <button
                  onClick={loadWebhooks}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Icon name="RefreshCw" size={16} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Webhook" size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Active Subscriptions</span>
                </div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{webhooks?.length}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Activity" size={16} className="text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Processing Queue</span>
                </div>
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{processingQueue?.length}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="CheckCircle2" size={16} className="text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Events Today</span>
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{realtimeEvents?.length}</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Clock" size={16} className="text-yellow-600 dark:text-yellow-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Avg Response Time</span>
                </div>
                <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">142ms</div>
              </div>
            </div>

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
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'routing' && <ConditionalRoutingPanel webhooks={webhooks} onUpdate={loadWebhooks} />}
              {activeTab === 'transformation' && <PayloadTransformationPanel webhooks={webhooks} />}
              {activeTab === 'retry' && <RetryPolicyPanel webhooks={webhooks} onUpdate={loadWebhooks} />}
              {activeTab === 'correlation' && <CrossSystemCorrelationPanel realtimeEvents={realtimeEvents} />}
              {activeTab === 'testing' && <WebhookTestingPanel webhooks={webhooks} />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdvancedWebhookOrchestrationHub;