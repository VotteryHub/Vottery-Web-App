import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
    <GeneralPageLayout title="Digital Wallet Hub" showSidebar={false}>
      <Helmet>
        <title>Digital Wallet Hub - Vottery</title>
        <meta name="description" content="Manage your Gamified Elections winnings, prize redemption, payment history, and automated payout processing with comprehensive transaction transparency." />
      </Helmet>
      
      <div className="w-full py-0 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
                Finance Hub
              </h1>
              <p className="text-base md:text-lg text-slate-400 font-medium">
                Manage your winnings, redemptions, and automated payouts with blockchain transparency.
              </p>
            </div>
            
            {walletData && (
              <div className="flex items-center gap-6 premium-glass border border-white/10 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-700">
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Available Balance</p>
                  <p className="text-2xl md:text-3xl font-black text-primary tracking-tight">
                    {walletService?.formatCurrency(walletData?.availableBalance, walletData?.currency)}
                  </p>
                </div>
                <div className="h-12 w-px bg-white/10"></div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Winnings</p>
                  <p className="text-xl md:text-2xl font-black text-white tracking-tight">
                    {walletService?.formatCurrency(walletData?.totalWinnings, walletData?.currency)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 w-fit">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-3 px-6 py-3.5 font-black text-[10px] uppercase tracking-widest transition-all duration-300 rounded-xl whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Wallet...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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
      </div>
    </GeneralPageLayout>
  );
};

export default DigitalWalletHub;