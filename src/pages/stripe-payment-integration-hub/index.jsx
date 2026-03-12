import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/walletService';
import { stripeService } from '../../services/stripeService';
import PaymentMethodsPanel from './components/PaymentMethodsPanel';
import GiftCardMarketplace from './components/GiftCardMarketplace';
import PayoutConfiguration from './components/PayoutConfiguration';
import TransactionMonitor from './components/TransactionMonitor';


const StripePaymentIntegrationHub = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [payoutQueue, setPayoutQueue] = useState([]);
  const [payoutSettings, setPayoutSettings] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadPaymentData();
    }
  }, [user?.id]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      const [walletResult, methodsResult, queueResult, settingsResult] = await Promise.all([
        walletService?.getUserWallet(user?.id),
        stripeService?.getPaymentMethods(user?.id),
        stripeService?.getPayoutQueue(user?.id),
        walletService?.getPayoutSettings(user?.id)
      ]);

      if (walletResult?.data) setWalletData(walletResult?.data);
      if (methodsResult?.data) setPaymentMethods(methodsResult?.data);
      if (queueResult?.data) setPayoutQueue(queueResult?.data);
      if (settingsResult?.data) setPayoutSettings(settingsResult?.data);
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutSuccess = () => {
    loadPaymentData();
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'methods', label: 'Payment Methods', icon: 'CreditCard' },
    { id: 'giftcards', label: 'Gift Cards', icon: 'Gift' },
    { id: 'cryptocurrency', label: 'Cryptocurrency', icon: 'Bitcoin' },
    { id: 'config', label: 'Payout Config', icon: 'Settings' }
  ];

  return (
    <>
      <Helmet>
        <title>Stripe Payment Integration Hub - Vottery</title>
        <meta name="description" content="Comprehensive payment processing management for automated cash payouts, gift card redemptions, and cryptocurrency withdrawals with Stripe integration." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  Stripe Payment Integration Hub
                </h1>
                <p className="text-muted-foreground">
                  Manage automated payouts, gift card redemptions, and crypto withdrawals
                </p>
              </div>
              <Button
                onClick={loadPaymentData}
                iconName="RefreshCw"
                iconPosition="left"
                variant="outline"
                disabled={loading}
                iconClassName={loading ? 'animate-spin' : ''}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-border overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Loading payment data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stripe Account Status */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-heading font-bold text-foreground">Stripe Account Status</h2>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <Icon name="CheckCircle" size={16} />
                        Connected
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { type: 'cash', label: 'Cash Payout', icon: 'Banknote', color: 'text-green-600', bgColor: 'bg-green-100' },
                        { type: 'giftcards', label: 'Gift Cards', icon: 'Gift', color: 'text-purple-600', bgColor: 'bg-purple-100' },
                        { type: 'bank', label: 'Bank Transfer', icon: 'Building2', color: 'text-blue-600', bgColor: 'bg-blue-100' }
                      ]?.map((method) => (
                        <button
                          key={method?.type}
                          onClick={() => setActiveTab(method?.type === 'cash' || method?.type === 'bank' ? 'methods' : method?.type)}
                          className="bg-muted hover:bg-muted/80 rounded-lg p-4 transition-all duration-200 text-left group"
                        >
                          <div className={`w-12 h-12 ${method?.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                            <Icon name={method?.icon} size={24} className={method?.color} />
                          </div>
                          <p className="font-semibold text-foreground">{method?.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">Click to manage</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Available Payout Methods */}
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-heading font-bold text-foreground mb-4">Available Payout Methods</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { type: 'cash', label: 'Cash Payout', icon: 'Banknote', color: 'text-green-600', bgColor: 'bg-green-100' },
                        { type: 'giftcards', label: 'Gift Cards', icon: 'Gift', color: 'text-purple-600', bgColor: 'bg-purple-100' },
                        { type: 'bank', label: 'Bank Transfer', icon: 'Building2', color: 'text-blue-600', bgColor: 'bg-blue-100' }
                      ]?.map((method) => (
                        <button
                          key={method?.type}
                          onClick={() => setActiveTab(method?.type === 'cash' || method?.type === 'bank' ? 'methods' : method?.type)}
                          className="bg-muted hover:bg-muted/80 rounded-lg p-4 transition-all duration-200 text-left group"
                        >
                          <div className={`w-12 h-12 ${method?.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                            <Icon name={method?.icon} size={24} className={method?.color} />
                          </div>
                          <p className="font-semibold text-foreground">{method?.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">Click to manage</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transaction Monitor */}
                  <TransactionMonitor payoutQueue={payoutQueue} />
                </div>
              )}

              {activeTab === 'methods' && (
                <PaymentMethodsPanel 
                  wallet={walletData}
                  paymentMethods={paymentMethods}
                  onSuccess={handlePayoutSuccess}
                />
              )}

              {activeTab === 'giftcards' && (
                <GiftCardMarketplace 
                  wallet={walletData}
                  onSuccess={handlePayoutSuccess}
                />
              )}

              {activeTab === 'config' && (
                <PayoutConfiguration 
                  settings={payoutSettings}
                  onUpdate={async (updatedSettings) => {
                    const result = await walletService?.updatePayoutSettings(user?.id, updatedSettings);
                    if (result?.data) {
                      setPayoutSettings(result?.data);
                    }
                    return result;
                  }}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default StripePaymentIntegrationHub;