import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FraudDetectionPanel from './components/FraudDetectionPanel';
import PaymentFlowPanel from './components/PaymentFlowPanel';
import CampaignAttributionPanel from './components/CampaignAttributionPanel';
import CustomEventTrackingPanel from './components/CustomEventTrackingPanel';
import PredictiveAnalyticsPanel from './components/PredictiveAnalyticsPanel';
import { platformMonitoringService } from '../../services/platformMonitoringService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AdvancedPlatformMonitoringEventTrackingHub = () => {
  const [activeTab, setActiveTab] = useState('fraud');
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [monitoringData, setMonitoringData] = useState({
    fraudDetection: null,
    paymentFlow: null,
    campaignAttribution: null,
    predictiveAnalytics: null
  });

  useEffect(() => {
    loadMonitoringData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  useEffect(() => {
    // Track page view with custom parameters
    analytics?.trackEvent('monitoring_hub_viewed', {
      active_tab: activeTab,
      time_range: timeRange,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab, timeRange]);

  const loadMonitoringData = async () => {
    try {
      setLoading(true);
      const [fraudResult, paymentResult, attributionResult, predictiveResult] = await Promise.all([
        platformMonitoringService?.getFraudDetectionEffectiveness(timeRange),
        platformMonitoringService?.getPaymentFlowMetrics(timeRange),
        platformMonitoringService?.getCampaignAttribution(timeRange),
        platformMonitoringService?.getPredictiveFraudAnalytics()
      ]);

      setMonitoringData({
        fraudDetection: fraudResult?.data,
        paymentFlow: paymentResult?.data,
        campaignAttribution: attributionResult?.data,
        predictiveAnalytics: predictiveResult?.data
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadMonitoringData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  const tabs = [
    { id: 'fraud', label: 'Fraud Detection', icon: 'Shield', description: 'Effectiveness metrics and false positive tracking' },
    { id: 'payment', label: 'Payment Flow', icon: 'CreditCard', description: 'Transaction success rates and bottleneck analysis' },
    { id: 'attribution', label: 'Campaign Attribution', icon: 'Target', description: 'Cross-segment performance and ROI analysis' },
    { id: 'events', label: 'Custom Events', icon: 'Activity', description: 'Configure behavioral triggers and thresholds' },
    { id: 'predictive', label: 'Predictive Analytics', icon: 'TrendingUp', description: 'Fraud pattern forecasting and recommendations' }
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading monitoring data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'fraud':
        return <FraudDetectionPanel data={monitoringData?.fraudDetection} timeRange={timeRange} />;
      case 'payment':
        return <PaymentFlowPanel data={monitoringData?.paymentFlow} timeRange={timeRange} />;
      case 'attribution':
        return <CampaignAttributionPanel data={monitoringData?.campaignAttribution} timeRange={timeRange} />;
      case 'events':
        return <CustomEventTrackingPanel />;
      case 'predictive':
        return <PredictiveAnalyticsPanel data={monitoringData?.predictiveAnalytics} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Advanced Platform Monitoring & Event Tracking Hub - Vottery</title>
        <meta name="description" content="Comprehensive fraud detection analytics, payment flow optimization insights, and campaign performance attribution across user segments with custom event tracking capabilities." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Advanced Platform Monitoring & Event Tracking
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Comprehensive analytics with custom event tracking across all user segments
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">
                    Live • Updated {lastUpdated?.toLocaleTimeString()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={refreshing ? "Loader" : "RefreshCw"}
                  onClick={refreshData}
                  disabled={refreshing}
                  className={refreshing ? 'animate-spin' : ''}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-foreground">Time Range:</span>
              <div className="flex gap-2">
                {timeRangeOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => setTimeRange(option?.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-250 ${
                      timeRange === option?.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-foreground hover:bg-muted border border-border'
                    }`}
                  >
                    {option?.label}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" iconName="Download" className="ml-auto">
                Export Report
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`p-4 rounded-lg border transition-all duration-250 text-left ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                      : 'bg-card text-foreground border-border hover:border-primary/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name={tab?.icon} size={20} />
                    <span className="font-semibold text-sm">{tab?.label}</span>
                  </div>
                  <p className={`text-xs ${
                    activeTab === tab?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {tab?.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdvancedPlatformMonitoringEventTrackingHub;