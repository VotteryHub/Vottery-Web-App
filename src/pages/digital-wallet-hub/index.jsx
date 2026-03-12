import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';

import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/walletService';
import BalanceOverview from './components/BalanceOverview';
import TransactionHistory from './components/TransactionHistory';
import PrizeRedemption from './components/PrizeRedemption';
import PayoutSettings from './components/PayoutSettings';

const DigitalWalletHub = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [payoutSettings, setPayoutSettings] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadWalletData();
    }
  }, [user?.id]);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [walletResult, transactionsResult, redemptionsResult, settingsResult] = await Promise.all([
        walletService?.getUserWallet(user?.id),
        walletService?.getWalletTransactions(user?.id),
        walletService?.getPrizeRedemptions(user?.id),
        walletService?.getPayoutSettings(user?.id)
      ]);

      if (walletResult?.data) setWalletData(walletResult?.data);
      if (transactionsResult?.data) setTransactions(transactionsResult?.data);
      if (redemptionsResult?.data) setRedemptions(redemptionsResult?.data);
      if (settingsResult?.data) setPayoutSettings(settingsResult?.data);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedemptionSuccess = () => {
    loadWalletData();
    setActiveTab('transactions');
  };

  const handleSettingsUpdate = async (updatedSettings) => {
    const result = await walletService?.updatePayoutSettings(user?.id, updatedSettings);
    if (result?.data) {
      setPayoutSettings(result?.data);
    }
    return result;
  };

  const tabs = [
    { id: 'overview', label: 'Balance Overview', icon: 'Wallet' },
    { id: 'transactions', label: 'Transaction History', icon: 'Receipt' },
    { id: 'redemption', label: 'Prize Redemption', icon: 'Gift' },
    { id: 'settings', label: 'Payout Settings', icon: 'Settings' }
  ];

  return (
    <>
      <Helmet>
        <title>Digital Wallet Hub - Vottery</title>
        <meta name="description" content="Manage your Gamified Elections winnings, prize redemption, payment history, and automated payout processing with comprehensive transaction transparency." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Digital Wallet Hub
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Manage your winnings, redemptions, and automated payouts
                </p>
              </div>
              {walletData && (
                <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
                    <p className="text-xl md:text-2xl font-bold text-primary">
                      {walletService?.formatCurrency(walletData?.availableBalance, walletData?.currency)}
                    </p>
                  </div>
                  <div className="h-12 w-px bg-border"></div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Winnings</p>
                    <p className="text-lg font-semibold text-foreground">
                      {walletService?.formatCurrency(walletData?.totalWinnings, walletData?.currency)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 border-b border-border">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-250 border-b-2 ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span className="hidden sm:inline">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading wallet data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <BalanceOverview
                  wallet={walletData}
                  transactions={transactions}
                  redemptions={redemptions}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionHistory
                  transactions={transactions}
                  onRefresh={loadWalletData}
                />
              )}

              {activeTab === 'redemption' && (
                <PrizeRedemption
                  wallet={walletData}
                  onSuccess={handleRedemptionSuccess}
                />
              )}

              {activeTab === 'settings' && (
                <PayoutSettings
                  settings={payoutSettings}
                  onUpdate={handleSettingsUpdate}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default DigitalWalletHub;