import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/walletService';
import { stripeService } from '../../services/stripeService';
import PaymentMethodsPanel from './components/PaymentMethodsPanel';
import GiftCardMarketplace from './components/GiftCardMarketplace';
import PayoutConfiguration from './components/PayoutConfiguration';
import TransactionMonitor from './components/TransactionMonitor';
import { 
  CreditCard, 
  LayoutDashboard, 
  Gift, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  Banknote, 
  Building2, 
  ShieldCheck,
  TrendingUp,
  Zap,
  ArrowRight,
  Wallet
} from 'lucide-react';

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
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'methods', label: 'Payment Methods', icon: CreditCard },
    { id: 'giftcards', label: 'Gift Cards', icon: Gift },
    { id: 'config', label: 'Payout Config', icon: Settings }
  ];

  return (
    <GeneralPageLayout title="Payment Hub" showSidebar={true}>
      <Helmet>
        <title>Stripe Payment Integration Hub - Vottery</title>
        <meta name="description" content="Comprehensive payment processing management for automated cash payouts and gift card redemptions with Stripe integration." />
      </Helmet>

      <div className="w-full py-0">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center border border-primary/20 shadow-2xl">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">Payment Hub</h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Global Payout & Redemption Center</p>
            </div>
          </div>
          <button
            onClick={loadPaymentData}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Wallet Balance', value: `$${(walletData?.balance || 0)?.toLocaleString()}`, icon: Wallet, color: 'text-green-400' },
            { label: 'Pending Payouts', value: payoutQueue?.length || 0, icon: TrendingUp, color: 'text-primary' },
            { label: 'Redemption Rate', value: '98.5%', icon: Zap, color: 'text-yellow-400' },
            { label: 'Security Level', value: 'Level 1', icon: ShieldCheck, color: 'text-blue-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                <p className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
              </div>
              <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-[0.03] group-hover:scale-110 transition-transform duration-700`} />
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-card/40 backdrop-blur-xl rounded-[32px] border border-white/5 mb-10 overflow-hidden shadow-2xl">
          <div className="border-b border-white/5 px-6 overflow-x-auto no-scrollbar">
            <nav className="flex space-x-4 py-4" aria-label="Tabs">
              {tabs?.map((tab) => {
                const TabIcon = tab?.icon;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center gap-3 py-3 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                      ${activeTab === tab?.id
                        ? 'bg-primary text-white shadow-xl shadow-primary/30' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab?.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Syncing Financial Data...</p>
              </div>
            ) : (
              <div className="space-y-12">
                {activeTab === 'overview' && (
                  <div className="space-y-12">
                    {/* Stripe Account Status */}
                    <div className="bg-primary/5 border border-primary/10 rounded-[40px] p-10 relative overflow-hidden">
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6 text-center md:text-left">
                          <div className="w-16 h-16 bg-primary rounded-[24px] flex items-center justify-center shadow-2xl shadow-primary/30">
                            <ShieldCheck className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Stripe Gateway Active</h2>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">Production Environment Connected</p>
                          </div>
                        </div>
                        <div className="px-8 py-3 bg-green-500/10 text-green-400 rounded-full text-xs font-black uppercase tracking-widest border border-green-500/20">
                          Secure Node 01
                        </div>
                      </div>
                      <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary opacity-[0.02] rounded-full blur-3xl" />
                    </div>

                    {/* Available Payout Methods */}
                    <div>
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8 px-4">Available Channels</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                          { type: 'cash', label: 'Cash Payout', icon: Banknote, color: 'text-green-400', bgColor: 'bg-green-500/10', desc: 'Direct wallet to bank transfer' },
                          { type: 'giftcards', label: 'Gift Cards', icon: Gift, color: 'text-purple-400', bgColor: 'bg-purple-500/10', desc: 'Digital asset redemption' },
                          { type: 'bank', label: 'Bank Transfer', icon: Building2, color: 'text-blue-400', bgColor: 'bg-blue-500/10', desc: 'Secure institutional wire' }
                        ]?.map((method) => (
                          <button
                            key={method?.type}
                            onClick={() => setActiveTab(method?.type === 'cash' || method?.type === 'bank' ? 'methods' : method?.type)}
                            className="bg-white/5 border border-white/5 rounded-[40px] p-10 hover:bg-white/10 transition-all group text-left shadow-xl"
                          >
                            <div className={`w-16 h-16 ${method?.bgColor} rounded-[24px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                              <method.icon className={`w-8 h-8 ${method?.color}`} />
                            </div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">{method?.label}</h4>
                            <p className="text-slate-500 text-sm font-medium mb-8">{method?.desc}</p>
                            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                              Manage Channel <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Transaction Monitor */}
                    <div className="bg-black/20 rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
                      <div className="p-10 border-b border-white/5">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Real-Time Event Stream</h3>
                      </div>
                      <TransactionMonitor payoutQueue={payoutQueue} />
                    </div>
                  </div>
                )}

                {activeTab === 'methods' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <PaymentMethodsPanel 
                      wallet={walletData}
                      paymentMethods={paymentMethods}
                      onSuccess={handlePayoutSuccess}
                    />
                  </div>
                )}

                {activeTab === 'giftcards' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <GiftCardMarketplace 
                      wallet={walletData}
                      onSuccess={handlePayoutSuccess}
                    />
                  </div>
                )}

                {activeTab === 'config' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default StripePaymentIntegrationHub;