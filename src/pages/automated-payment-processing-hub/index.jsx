import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DashboardOverview from './components/DashboardOverview';
import PrizePayoutAutomation from './components/PrizePayoutAutomation';
import ParticipationFeeProcessing from './components/ParticipationFeeProcessing';
import AdvertiserBillingManagement from './components/AdvertiserBillingManagement';
import TransactionMonitoring from './components/TransactionMonitoring';
import ComplianceReporting from './components/ComplianceReporting';
import { walletService } from '../../services/walletService';
import { stripeService } from '../../services/stripeService';
import { adminLogService } from '../../services/adminLogService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AutomatedPaymentProcessingHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [paymentData, setPaymentData] = useState({
    transactions: [],
    payoutQueue: [],
    complianceLogs: [],
    systemHealth: null
  });

  useEffect(() => {
    loadPaymentData();
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    analytics?.trackEvent('payment_hub_viewed', {
      active_tab: activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      
      // Load all payment-related data
      const [transactionsResult, queueResult, logsResult] = await Promise.all([
        walletService?.getWalletTransactions(null, { status: 'pending' }),
        stripeService?.getPayoutQueue(null),
        adminLogService?.getActivityLogs({ complianceRelevant: true })
      ]);

      setPaymentData({
        transactions: transactionsResult?.data || [],
        payoutQueue: queueResult?.data || [],
        complianceLogs: logsResult?.data || [],
        systemHealth: {
          processingRate: 98.5,
          avgProcessingTime: 2.3,
          successRate: 99.2,
          activeProcessors: 8
        }
      });
      setLastUpdated(new Date());
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
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'payouts', label: 'Prize Payouts', icon: 'Trophy' },
    { id: 'fees', label: 'Participation Fees', icon: 'Ticket' },
    { id: 'billing', label: 'Advertiser Billing', icon: 'Receipt' },
    { id: 'monitoring', label: 'Transaction Monitor', icon: 'Activity' },
    { id: 'compliance', label: 'Compliance', icon: 'Shield' }
  ];

  return (
    <>
      <Helmet>
        <title>Automated Payment Processing Hub - Vottery</title>
        <meta name="description" content="Comprehensive financial transaction management for prize payouts, participation fees, and advertiser billing with real-time processing and compliance monitoring." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Automated Payment Processing Hub
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Real-time financial transaction management with compliance monitoring
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                  <span className="text-xs text-muted-foreground">
                    {refreshing ? 'Updating...' : `Live • ${lastUpdated?.toLocaleTimeString()}`}
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
                <Button variant="default" size="sm" iconName="Download">
                  Export Data
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 border-b border-border">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading payment data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'overview' && <DashboardOverview data={paymentData} />}
              {activeTab === 'payouts' && <PrizePayoutAutomation data={paymentData} onRefresh={refreshData} />}
              {activeTab === 'fees' && <ParticipationFeeProcessing data={paymentData} onRefresh={refreshData} />}
              {activeTab === 'billing' && <AdvertiserBillingManagement data={paymentData} onRefresh={refreshData} />}
              {activeTab === 'monitoring' && <TransactionMonitoring data={paymentData} />}
              {activeTab === 'compliance' && <ComplianceReporting data={paymentData} />}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AutomatedPaymentProcessingHub;