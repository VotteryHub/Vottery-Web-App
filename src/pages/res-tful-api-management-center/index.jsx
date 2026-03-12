import React, { useState, useEffect } from 'react';
import { Activity, Server, Shield, TrendingUp, AlertCircle, CheckCircle, Webhook } from 'lucide-react';
import { lotteryAPIService } from '../../services/lotteryAPIService';
import EndpointConfigurationPanel from './components/EndpointConfigurationPanel';
import AuthenticationControlsPanel from './components/AuthenticationControlsPanel';
import RequestMonitoringPanel from './components/RequestMonitoringPanel';
import PerformanceAnalyticsPanel from './components/PerformanceAnalyticsPanel';
import SecurityControlsPanel from './components/SecurityControlsPanel';
import APIDocumentationPanel from './components/APIDocumentationPanel';
import WebhookManagementPanel from './components/WebhookManagementPanel';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';





const RESTfulAPIManagementCenter = () => {
  const [activeTab, setActiveTab] = useState('endpoints');
  const [apiStatistics, setApiStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Move function declaration before useEffect
  const loadAPIStatistics = async () => {
    try {
      const result = await lotteryAPIService?.getAPIStatistics();
      if (result?.success) {
        setApiStatistics(result?.data);
      }
    } catch (error) {
      console.error('Failed to load API statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAPIStatistics();
  }, []);

  useRealtimeMonitoring({
    tables: 'webhook_configurations',
    onRefresh: loadAPIStatistics,
    enabled: true,
  });

  const tabs = [
    { id: 'endpoints', label: 'Endpoint Configuration', icon: Server },
    { id: 'authentication', label: 'Authentication', icon: Shield },
    { id: 'monitoring', label: 'Request Monitoring', icon: Activity },
    { id: 'performance', label: 'Performance Analytics', icon: TrendingUp },
    { id: 'security', label: 'Security Controls', icon: AlertCircle },
    { id: 'documentation', label: 'API Documentation', icon: CheckCircle },
    { id: 'webhooks', label: 'Webhook Management', icon: Webhook }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">RESTful API Management Center</h1>
          <p className="text-gray-600">Comprehensive Express.js endpoint administration for lottery operations</p>
        </div>

        {/* Statistics Overview */}
        {!loading && apiStatistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Requests (24h)</p>
                  <p className="text-3xl font-bold text-gray-900">{apiStatistics?.totalRequests || 0}</p>
                </div>
                <Activity className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{apiStatistics?.successRate || 0}%</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
                  <p className="text-3xl font-bold text-gray-900">{apiStatistics?.averageResponseTime || 0}ms</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Error Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{apiStatistics?.errorRate || 0}%</p>
                </div>
                <AlertCircle className="w-12 h-12 text-red-500 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs?.map((tab) => {
              const TabIcon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-blue-500 text-white border-b-4 border-blue-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <TabIcon className="w-5 h-5" />
                  {tab?.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'endpoints' && <EndpointConfigurationPanel />}
          {activeTab === 'authentication' && <AuthenticationControlsPanel />}
          {activeTab === 'monitoring' && <RequestMonitoringPanel />}
          {activeTab === 'performance' && <PerformanceAnalyticsPanel statistics={apiStatistics} />}
          {activeTab === 'security' && <SecurityControlsPanel />}
          {activeTab === 'documentation' && <APIDocumentationPanel />}
          {activeTab === 'webhooks' && <WebhookManagementPanel />}
        </div>
      </div>
    </div>
  );
};

export default RESTfulAPIManagementCenter;