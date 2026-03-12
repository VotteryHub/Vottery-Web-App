import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProviderHealthPanel from './components/ProviderHealthPanel';
import SMSWebhookHandlersPanel from './components/SMSWebhookHandlersPanel';
import SMSAlertTemplatesPanel from './components/SMSAlertTemplatesPanel';
import SMSDeliveryAnalyticsPanel from './components/SMSDeliveryAnalyticsPanel';
import SMSCompliancePanel from './components/SMSCompliancePanel';
import SMSRateLimitingPanel from './components/SMSRateLimitingPanel';
import SMSOptimizationPanel from './components/SMSOptimizationPanel';
import { smsProviderService } from '../../services/smsProviderService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const SMSComplianceRateLimitingControlCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [providerState, setProviderState] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState({
    telnyx: { healthy: true, responseTime: 0 },
    twilio: { healthy: true, responseTime: 0 }
  });

  useEffect(() => {
    loadData();
  }, []);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadData,
    enabled: autoRefresh,
  });

  useEffect(() => {
    analytics?.trackEvent('sms_control_center_viewed', {
      active_provider: providerState?.activeProvider,
      telnyx_status: providerState?.telnyxStatus,
      twilio_status: providerState?.twilioStatus
    });
  }, [providerState]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stateResult, telnyxHealth, twilioHealth] = await Promise.all([
        smsProviderService?.getProviderState(),
        smsProviderService?.checkTelnyxHealth(),
        smsProviderService?.checkTwilioHealth()
      ]);

      setProviderState(stateResult?.data);
      setHealthMetrics({
        telnyx: telnyxHealth?.data || { healthy: false, responseTime: 0 },
        twilio: twilioHealth?.data || { healthy: false, responseTime: 0 }
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleManualFailover = async (targetProvider) => {
    try {
      await smsProviderService?.updateProviderState({
        activeProvider: targetProvider,
        failoverReason: 'Manual override by admin',
        lastFailoverAt: new Date()?.toISOString()
      });
      await loadData();
    } catch (error) {
      console.error('Failed to switch provider:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Provider Health', icon: 'Activity' },
    { id: 'webhooks', label: 'Webhook Handlers', icon: 'Webhook' },
    { id: 'templates', label: 'Alert Templates', icon: 'FileText' },
    { id: 'analytics', label: 'Delivery Analytics', icon: 'BarChart3' },
    { id: 'compliance', label: 'Compliance Manager', icon: 'Shield' },
    { id: 'rate-limiting', label: 'Rate Limiting & Queue', icon: 'Gauge' },
    { id: 'optimization', label: 'AI Optimization', icon: 'Sparkles' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>SMS Compliance & Rate Limiting Control Center | Vottery</title>
        </Helmet>
        <HeaderNavigation />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading SMS control center...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SMS Compliance & Rate Limiting Control Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                SMS Compliance & Rate Limiting Control Center
              </h1>
              <p className="text-muted-foreground">
                Comprehensive GDPR/TCPA compliance management with intelligent rate limiting and AI-powered SMS optimization
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {refreshing ? 'Refreshing...' : `Updated ${lastUpdated?.toLocaleTimeString()}`}
                </span>
              </div>
              <Button
                variant={autoRefresh ? 'default' : 'outline'}
                size="sm"
                iconName={autoRefresh ? 'Pause' : 'Play'}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Auto' : 'Manual'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                onClick={refreshData}
                disabled={refreshing}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Provider Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                providerState?.activeProvider === 'telnyx' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-900/20'
              }`}>
                <Icon name="Radio" size={24} className={providerState?.activeProvider === 'telnyx' ? 'text-green-600' : 'text-gray-600'} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Provider</p>
                <p className="text-2xl font-heading font-bold text-foreground capitalize font-data">
                  {providerState?.activeProvider || 'Telnyx'}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                healthMetrics?.telnyx?.healthy ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
              }`}>
                <Icon name="Activity" size={24} className={healthMetrics?.telnyx?.healthy ? 'text-green-600' : 'text-red-600'} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telnyx Status</p>
                <p className="text-2xl font-heading font-bold text-foreground font-data">
                  {healthMetrics?.telnyx?.healthy ? 'Healthy' : 'Unhealthy'}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                healthMetrics?.twilio?.healthy ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
              }`}>
                <Icon name="Activity" size={24} className={healthMetrics?.twilio?.healthy ? 'text-green-600' : 'text-red-600'} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Twilio Status</p>
                <p className="text-2xl font-heading font-bold text-foreground font-data">
                  {healthMetrics?.twilio?.healthy ? 'Healthy' : 'Unhealthy'}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Icon name="Zap" size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Auto Failover</p>
                <p className="text-2xl font-heading font-bold text-foreground font-data">
                  Enabled
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                <span className="font-medium">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <ProviderHealthPanel 
            providerState={providerState}
            healthMetrics={healthMetrics}
            onManualFailover={handleManualFailover}
            onRefresh={refreshData}
          />
        )}
        {activeTab === 'webhooks' && <SMSWebhookHandlersPanel />}
        {activeTab === 'templates' && <SMSAlertTemplatesPanel />}
        {activeTab === 'analytics' && <SMSDeliveryAnalyticsPanel />}
        {activeTab === 'compliance' && <SMSCompliancePanel />}
        {activeTab === 'rate-limiting' && <SMSRateLimitingPanel />}
        {activeTab === 'optimization' && <SMSOptimizationPanel />}
      </div>
    </div>
  );
};

export default SMSComplianceRateLimitingControlCenter;
