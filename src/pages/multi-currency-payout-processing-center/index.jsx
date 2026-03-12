import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import AdminToolbar from '../../components/ui/AdminToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { multiCurrencyPayoutService } from '../../services/multiCurrencyPayoutService';

import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const MultiCurrencyPayoutProcessingCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const [payoutQueue, setPayoutQueue] = useState([]);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [feeZones, setFeeZones] = useState([]);
  const [transactionConfirmations, setTransactionConfirmations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);

  useEffect(() => {
    loadPayoutData();
    setupRealtimeSubscriptions();

    const interval = setInterval(() => {
      refreshExchangeRates();
    }, 30000); // Refresh exchange rates every 30 seconds

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadPayoutData = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return;

      const [ratesResult, zonesResult, confirmationsResult, analyticsResult] = await Promise.all([
        multiCurrencyPayoutService?.getAllExchangeRates('USD'),
        multiCurrencyPayoutService?.getFeeZones(),
        multiCurrencyPayoutService?.getPayoutConfirmations(user?.id),
        multiCurrencyPayoutService?.getPayoutAnalytics(user?.id, '30d')
      ]);

      if (ratesResult?.data) setExchangeRates(ratesResult?.data);
      if (zonesResult?.data) setFeeZones(zonesResult?.data);
      if (confirmationsResult?.data) setTransactionConfirmations(confirmationsResult?.data);
      if (analyticsResult?.data) setAnalytics(analyticsResult?.data);

      // Load active payout queue
      const { data: queueData } = await supabase
        ?.from('wallet_transactions')
        ?.select(`
          *,
          user_profiles(id, username, full_name, country_code)
        `)
        ?.eq('status', 'pending')
        ?.order('created_at', { ascending: false })
        ?.limit(50);

      if (queueData) setPayoutQueue(queueData);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading payout data:', error);
      toast?.error('Failed to load payout data');
    } finally {
      setLoading(false);
    }
  };

  const refreshExchangeRates = async () => {
    try {
      setRefreshing(true);
      const result = await multiCurrencyPayoutService?.getAllExchangeRates('USD');
      if (result?.data) {
        setExchangeRates(result?.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error refreshing exchange rates:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const subscription = supabase
      ?.channel('payout-processing')
      ?.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'payout_transaction_confirmations'
      }, () => {
        loadPayoutData();
      })
      ?.subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  };

  const handleProcessPayout = async (payout) => {
    try {
      const creatorCountry = payout?.user_profiles?.country_code || 'US';
      const amount = parseFloat(payout?.amount || 0);

      // Calculate fees
      const feeResult = await multiCurrencyPayoutService?.calculatePayoutWithFees(
        payout?.user_id,
        amount,
        creatorCountry,
        'ACH' // Default banking method
      );

      if (feeResult?.error) {
        toast?.error(feeResult?.error?.message);
        return;
      }

      // Get exchange rate if currency conversion needed
      let exchangeRate = 1.0;
      let targetCurrency = 'USD';
      if (creatorCountry !== 'US') {
        const currencyMap = { IN: 'INR', NG: 'NGN', GB: 'GBP', EU: 'EUR' };
        targetCurrency = currencyMap?.[creatorCountry] || 'USD';
        
        const rateResult = await multiCurrencyPayoutService?.getLatestExchangeRate('USD', targetCurrency);
        if (rateResult?.data) exchangeRate = rateResult?.data;
      }

      // Create payout confirmation
      const confirmationData = {
        payoutId: payout?.id,
        originalAmount: amount,
        originalCurrency: 'USD',
        exchangeRate,
        convertedAmount: amount * exchangeRate,
        targetCurrency,
        processingFee: feeResult?.data?.processingFee || 0,
        currencyConversionFee: feeResult?.data?.conversionFee || 0,
        finalAmount: feeResult?.data?.finalAmount || amount,
        bankingMethod: 'ACH'
      };

      const result = await multiCurrencyPayoutService?.createPayoutConfirmation(confirmationData);

      if (result?.data) {
        toast?.success(`Payout processed successfully! Confirmation: ${result?.data?.confirmationCode}`);
        setSelectedPayout(result?.data);
        loadPayoutData();
      } else {
        toast?.error(result?.error?.message || 'Failed to process payout');
      }
    } catch (error) {
      console.error('Error processing payout:', error);
      toast?.error('Failed to process payout');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'queue', label: 'Payout Queue', icon: 'Clock' },
    { id: 'rates', label: 'Exchange Rates', icon: 'TrendingUp' },
    { id: 'banking', label: 'Local Banking', icon: 'Building' },
    { id: 'fees', label: 'Fee Structures', icon: 'DollarSign' },
    { id: 'confirmations', label: 'Transaction Confirmations', icon: 'CheckCircle' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Active Payouts</span>
            <Icon name="Clock" className="text-orange-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-foreground">{payoutQueue?.length || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Pending processing</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Processed</span>
            <Icon name="CheckCircle" className="text-green-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-foreground">{analytics?.totalPayouts || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <Icon name="DollarSign" className="text-blue-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-foreground">
            ${(analytics?.totalAmount || 0)?.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Across all currencies</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Fees</span>
            <Icon name="TrendingDown" className="text-red-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-foreground">
            ${(analytics?.totalFees || 0)?.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Processing + conversion</p>
        </div>
      </div>

      {/* Real-time Exchange Rates */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Real-Time Exchange Rates</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshExchangeRates}
            disabled={refreshing}
          >
            <Icon name={refreshing ? 'Loader' : 'RefreshCw'} className={refreshing ? 'animate-spin' : ''} size={16} />
            Refresh
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {exchangeRates?.slice(0, 8)?.map((rate) => (
            <div key={rate?.id} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {rate?.baseCurrency}/{rate?.targetCurrency}
                </span>
                <span className="text-xs text-muted-foreground">{rate?.provider}</span>
              </div>
              <div className="text-xl font-bold text-foreground">
                {parseFloat(rate?.exchangeRate)?.toFixed(4)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Updated {new Date(rate?.rateTimestamp)?.toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Status */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Processing Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(analytics?.byStatus || {})?.map(([status, count]) => (
            <div key={status} className="bg-muted/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground capitalize mb-1">{status}</div>
              <div className="text-2xl font-bold text-foreground">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPayoutQueue = () => (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Active Payout Queue</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {payoutQueue?.length} pending payouts awaiting processing
        </p>
      </div>
      <div className="divide-y divide-border">
        {payoutQueue?.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="CheckCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No pending payouts</p>
          </div>
        ) : (
          payoutQueue?.map((payout) => (
            <div key={payout?.id} className="p-6 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-foreground">
                      {payout?.user_profiles?.full_name || payout?.user_profiles?.username}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {payout?.user_profiles?.country_code || 'US'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Amount: ${parseFloat(payout?.amount || 0)?.toFixed(2)}</span>
                    <span>•</span>
                    <span>{new Date(payout?.created_at)?.toLocaleDateString()}</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleProcessPayout(payout)}
                  size="sm"
                >
                  <Icon name="Zap" size={16} />
                  Process Payout
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderExchangeRates = () => (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Live Exchange Rates</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time currency conversion rates with 30-second refresh
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={refreshExchangeRates} disabled={refreshing}>
            <Icon name={refreshing ? 'Loader' : 'RefreshCw'} className={refreshing ? 'animate-spin' : ''} size={16} />
            Refresh Rates
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exchangeRates?.map((rate) => (
            <div key={rate?.id} className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold text-foreground">
                  {rate?.baseCurrency} → {rate?.targetCurrency}
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {rate?.provider}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-2">
                {parseFloat(rate?.exchangeRate)?.toFixed(6)}
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(rate?.rateTimestamp)?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLocalBanking = () => (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Local Banking Integration</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Region-specific payment methods with automated routing
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { method: 'ACH', region: 'USA', icon: 'Building', color: 'blue', description: 'Automated Clearing House for US bank transfers' },
            { method: 'UPI', region: 'India', icon: 'Smartphone', color: 'green', description: 'Unified Payments Interface for instant transfers' },
            { method: 'SWIFT', region: 'International', icon: 'Globe', color: 'purple', description: 'International wire transfers worldwide' },
            { method: 'SEPA', region: 'EU', icon: 'Euro', color: 'orange', description: 'Single Euro Payments Area for EU transfers' }
          ]?.map((banking) => (
            <div key={banking?.method} className="bg-muted/30 rounded-lg p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-${banking?.color}-100 rounded-lg`}>
                  <Icon name={banking?.icon} className={`text-${banking?.color}-600`} size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{banking?.method}</h4>
                    <span className="px-2 py-0.5 bg-muted text-xs rounded-full">{banking?.region}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{banking?.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-muted-foreground">Active & Available</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFeeStructures = () => (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Fee Structures Per Zone</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Transparent cost breakdown by region and banking method
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Zone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Banking Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Processing Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Conversion Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Processing Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {feeZones?.map((zone) => (
              <tr key={zone?.id} className="hover:bg-muted/30">
                <td className="px-6 py-4 text-sm text-foreground font-medium">{zone?.zoneName}</td>
                <td className="px-6 py-4 text-sm text-foreground">{zone?.bankingMethod}</td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {parseFloat(zone?.processingFeePercentage)}% + ${parseFloat(zone?.processingFeeFixed)?.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {parseFloat(zone?.currencyConversionFee)}%
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {zone?.processingTimeDays} days
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTransactionConfirmations = () => (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Transaction Confirmations</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Complete audit trail with detailed payout breakdowns
        </p>
      </div>
      <div className="divide-y divide-border">
        {transactionConfirmations?.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transaction confirmations yet</p>
          </div>
        ) : (
          transactionConfirmations?.map((confirmation) => (
            <div key={confirmation?.id} className="p-6 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium text-foreground">
                      {confirmation?.confirmationCode}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      confirmation?.status === 'completed' ? 'bg-green-100 text-green-700' :
                      confirmation?.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      confirmation?.status === 'failed'? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {confirmation?.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(confirmation?.createdAt)?.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    ${parseFloat(confirmation?.finalAmount || 0)?.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">{confirmation?.targetCurrency || 'USD'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Original Amount:</span>
                  <div className="font-medium text-foreground">
                    ${parseFloat(confirmation?.originalAmount || 0)?.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Exchange Rate:</span>
                  <div className="font-medium text-foreground">
                    {parseFloat(confirmation?.exchangeRate || 1)?.toFixed(4)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Processing Fee:</span>
                  <div className="font-medium text-foreground">
                    ${parseFloat(confirmation?.processingFee || 0)?.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Banking Method:</span>
                  <div className="font-medium text-foreground">{confirmation?.bankingMethod}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'queue':
        return renderPayoutQueue();
      case 'rates':
        return renderExchangeRates();
      case 'banking':
        return renderLocalBanking();
      case 'fees':
        return renderFeeStructures();
      case 'confirmations':
        return renderTransactionConfirmations();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Multi-Currency Payout Processing Center - Vottery</title>
        <meta name="description" content="Comprehensive international creator payment management with real-time exchange rates, local banking methods, and automated currency conversion workflows" />
      </Helmet>

      <HeaderNavigation />
      <AdminToolbar />

      <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8 mt-14">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Multi-Currency Payout Processing Center
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                International creator payment management with real-time exchange rates and local banking integration
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground">
                Last updated: {lastUpdated?.toLocaleTimeString()}
              </div>
              <Button
                onClick={loadPayoutData}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <Icon name={loading ? 'Loader' : 'RefreshCw'} className={loading ? 'animate-spin' : ''} size={16} />
                Refresh
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
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab?.id
                    ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Icon name="Loader" size={48} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading payout data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {renderTabContent()}
          </div>
        )}
      </main>
    </div>
  );
};

export default MultiCurrencyPayoutProcessingCenter;