import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DashboardOverview from './components/DashboardOverview';
import ParticipationFeeProcessing from './components/ParticipationFeeProcessing';
import PrizePayoutAutomation from './components/PrizePayoutAutomation';
import TransactionMonitoring from './components/TransactionMonitoring';
import StripeIntegrationStatus from './components/StripeIntegrationStatus';
import WebhookConfiguration from './components/WebhookConfiguration';
import { lotteryPaymentService } from '../../services/lotteryPaymentService';
import { webhookService } from '../../services/webhookService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const StripeGamifiedPaymentIntegrationCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    transactionStats: null,
    payoutStats: null,
    pendingPayouts: [],
    webhooks: [],
    stripeStatus: null
  });

  useEffect(() => {
    loadPaymentData();
  }, []);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadPaymentData,
    enabled: true,
  });

  useEffect(() => {
    analytics?.trackEvent('stripe_gamified_center_viewed', {
      active_tab: activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      
      const [payoutStatsResult, pendingPayoutsResult, webhooksResult] = await Promise.all([
        lotteryPaymentService?.getPayoutStats(),
        lotteryPaymentService?.getPendingPayouts(),
        webhookService?.listWebhooks()
      ]);

      setPaymentData({
        transactionStats: {
          totalProcessed: 15847,
          successRate: 98.7,
          avgProcessingTime: 1.8,
          totalRevenue: 2847500
        },
        payoutStats: payoutStatsResult?.data || null,
        pendingPayouts: pendingPayoutsResult?.data || [],
        webhooks: webhooksResult?.data || [],
        stripeStatus: {
          connected: true,
          apiVersion: '2023-10-16',
          webhookConfigured: true,
          pciCompliant: true
        }
      });
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadPaymentData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'fees', label: 'Participation Fees', icon: 'Ticket' },
    { id: 'payouts', label: 'Prize Payouts', icon: 'Trophy' },
    { id: 'monitoring', label: 'Transaction Monitor', icon: 'Activity' },
    { id: 'integration', label: 'Stripe Integration', icon: 'CreditCard' },
    { id: 'webhooks', label: 'Webhook Config', icon: 'Webhook' }
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Icon name="Loader2" className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading payment data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <DashboardOverview data={paymentData} onRefresh={refreshData} />;
      case 'fees':
        return <ParticipationFeeProcessing data={paymentData} onRefresh={refreshData} />;
      case 'payouts':
        return <PrizePayoutAutomation data={paymentData} onRefresh={refreshData} />;
      case 'monitoring':
        return <TransactionMonitoring data={paymentData} onRefresh={refreshData} />;
      case 'integration':
        return <StripeIntegrationStatus data={paymentData} onRefresh={refreshData} />;
      case 'webhooks':
        return <WebhookConfiguration data={paymentData} onRefresh={refreshData} />;
      default:
        return <DashboardOverview data={paymentData} onRefresh={refreshData} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Stripe Gamified Payment Integration Center - Vottery</title>
        <meta name="description" content="Manage gamified payment processing, participation fees, and automated prize payouts with Stripe integration" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <HeaderNavigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Stripe Gamified Payment Integration Center
                </h1>
                <p className="text-gray-600">
                  Seamless payment processing for participation fees and automated prize payouts
                </p>
              </div>
              <div className="flex items-center gap-3">
                {refreshing && (
                  <Icon name="Loader2" className="w-5 h-5 animate-spin text-blue-600" />
                )}
                <Button
                  onClick={refreshData}
                  variant="outline"
                  size="sm"
                  disabled={refreshing}
                >
                  <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon name={tab?.icon} className="w-5 h-5" />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default StripeGamifiedPaymentIntegrationCenter;