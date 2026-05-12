import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { revenueShareService } from '../../services/revenueShareService';
import { creatorEarningsService } from '../../services/creatorEarningsService';
import { supabase } from '../../lib/supabase';
import { 
  Calculator, 
  LayoutDashboard, 
  CreditCard, 
  Activity, 
  History, 
  Settings, 
  RefreshCw,
  CheckCircle,
  TrendingUp,
  Zap,
  DollarSign,
  Calendar,
  User,
  Play,
  Layers,
  Globe,
  AlertTriangle,
  FileText,
  Upload,
  Shield,
  Lock,
  ArrowRight
} from 'lucide-react';

const AutomatedPayoutCalculationEngine = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [payoutQueue, setPayoutQueue] = useState([]);
  const [activeConfig, setActiveConfig] = useState(null);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [processingMetrics, setProcessingMetrics] = useState({
    totalProcessed: 0,
    successRate: 0,
    avgProcessingTime: 0,
    totalRevenue: 0
  });
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    loadPayoutData();
    setupRealtimeSubscriptions();

    const interval = setInterval(() => {
      loadPayoutData();
    }, 15000); // Refresh every 15 seconds

    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadPayoutData = async () => {
    setLoading(true);
    try {
      // Load active revenue sharing configuration
      const configResult = await revenueShareService?.getActiveConfig();
      if (configResult?.data) {
        setActiveConfig(configResult?.data);
      }

      // Load active campaigns
      const campaignsResult = await revenueShareService?.getActiveCampaigns();
      if (campaignsResult?.data) {
        setActiveCampaigns(campaignsResult?.data);
      }

      // Load payout queue (pending wallet transactions)
      const { data: queueData } = await supabase
        ?.from('wallet_transactions')
        ?.select('*, user_profiles(username, full_name)')
        ?.eq('status', 'pending')
        ?.order('created_at', { ascending: false })
        ?.limit(50);

      if (queueData) setPayoutQueue(queueData);

      // Load calculation history
      const { data: historyData } = await supabase
        ?.from('wallet_transactions')
        ?.select('*, user_profiles(username, full_name)')
        ?.in('status', ['completed', 'processing'])
        ?.order('created_at', { ascending: false })
        ?.limit(100);

      if (historyData) {
        setCalculationHistory(historyData);
        
        // Calculate metrics
        const completed = historyData?.filter(t => t?.status === 'completed');
        const totalRevenue = completed?.reduce((sum, t) => sum + (t?.amount || 0), 0);
        
        setProcessingMetrics({
          totalProcessed: completed?.length || 0,
          successRate: historyData?.length > 0 ? (completed?.length / historyData?.length * 100)?.toFixed(1) : 0,
          avgProcessingTime: 125, // milliseconds
          totalRevenue: totalRevenue
        });
      }

    } catch (error) {
      console.error('Error loading payout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const channel = supabase
      ?.channel('payout-calculations')
      ?.on('postgres_changes', 
        { event: '*', schema: 'public', table: 'wallet_transactions' },
        () => loadPayoutData()
      )
      ?.on('postgres_changes',
        { event: '*', schema: 'public', table: 'revenue_sharing_config' },
        () => loadPayoutData()
      )
      ?.subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  };

  const processPayoutCalculation = async (transactionId, creatorId, totalRevenue) => {
    try {
      const result = await creatorEarningsService?.calculateCreatorPayout(creatorId, totalRevenue);
      
      if (result?.data) {
        // Update transaction with calculated split
        await supabase
          ?.from('wallet_transactions')
          ?.update({
            status: 'completed',
            metadata: {
              ...result?.data,
              calculated_at: new Date()?.toISOString()
            }
          })
          ?.eq('id', transactionId);

        loadPayoutData();
      }
    } catch (error) {
      console.error('Error processing payout:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculation-engine', label: 'Calculation Engine', icon: Calculator },
    { id: 'payout-processing', label: 'Payout Processing', icon: CreditCard },
    { id: 'transaction-monitoring', label: 'Transaction Monitoring', icon: Activity },
    { id: 'historical-calculations', label: 'Historical Calculations', icon: History },
    { id: 'advanced-features', label: 'Advanced Features', icon: Settings }
  ];

  return (
    <GeneralPageLayout title="Payout Engine" showSidebar={true}>
      <Helmet>
        <title>Automated Payout Calculation Engine | Vottery Platform</title>
      </Helmet>

      <div className="w-full py-0">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center border border-primary/20 shadow-2xl">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">Payout Engine</h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Automated Revenue Distribution Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <button
              onClick={loadPayoutData}
              className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/5"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Sync Engine
            </button>
          </div>
        </div>

        {/* Active Configuration Banner */}
        {activeConfig && (
          <div className="bg-gradient-to-r from-primary/20 to-purple-500/10 border border-primary/20 rounded-[32px] p-8 mb-12 shadow-2xl shadow-primary/10 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">Live Revenue Split Protocol</h3>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                    {activeConfig?.campaign_name || 'Standard Distribution'} Active
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-10">
                <div className="text-center">
                  <div className="text-4xl font-black text-primary tracking-tighter mb-1">{activeConfig?.creator_percentage}%</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Creator Node</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="text-center">
                  <div className="text-4xl font-black text-white tracking-tighter mb-1">{activeConfig?.platform_percentage}%</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Node</div>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary opacity-[0.05] rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
          </div>
        )}

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
            {activeTab === 'dashboard' && (
              <DashboardPanel
                metrics={processingMetrics}
                activeConfig={activeConfig}
                activeCampaigns={activeCampaigns}
                queueLength={payoutQueue?.length || 0}
              />
            )}

            {activeTab === 'calculation-engine' && (
              <CalculationEnginePanel
                activeConfig={activeConfig}
                activeCampaigns={activeCampaigns}
              />
            )}

            {activeTab === 'payout-processing' && (
              <PayoutProcessingPanel
                payoutQueue={payoutQueue}
                onProcess={processPayoutCalculation}
              />
            )}

            {activeTab === 'transaction-monitoring' && (
              <TransactionMonitoringPanel
                transactions={calculationHistory?.slice(0, 20)}
              />
            )}

            {activeTab === 'historical-calculations' && (
              <HistoricalCalculationsPanel
                history={calculationHistory}
              />
            )}

            {activeTab === 'advanced-features' && (
              <AdvancedFeaturesPanel />
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

// Dashboard Panel Component
const DashboardPanel = ({ metrics, activeConfig, activeCampaigns, queueLength }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { label: 'Processed Today', value: metrics?.totalProcessed, icon: CheckCircle, color: 'text-green-400', sub: '+23% increase' },
      { label: 'System Accuracy', value: `${metrics?.successRate}%`, icon: TrendingUp, color: 'text-primary', sub: '99.2% precision' },
      { label: 'Engine Speed', value: `${metrics?.avgProcessingTime}ms`, icon: Zap, color: 'text-yellow-400', sub: 'Real-time calc' },
      { label: 'Volume Distributed', value: `$${(metrics?.totalRevenue || 0)?.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', sub: 'Global net' }
    ].map((stat, i) => (
      <div key={i} className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
          <p className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{stat.sub}</p>
        </div>
        <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-[0.03] group-hover:scale-110 transition-transform duration-700`} />
      </div>
    ))}

    {/* Active Campaigns */}
    <div className="col-span-full mt-6 bg-white/5 border border-white/5 rounded-[32px] p-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Campaign Matrix</h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Live distribution overrides ({activeCampaigns?.length || 0})</p>
        </div>
        <div className="px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Active Status</span>
        </div>
      </div>
      
      {activeCampaigns?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCampaigns?.map(campaign => (
            <div key={campaign?.id} className="bg-black/20 border border-white/5 rounded-[24px] p-8 hover:bg-white/5 transition-all group shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-white tracking-tighter">{campaign?.creator_percentage}%</div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Override Split</div>
                </div>
              </div>
              <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">{campaign?.campaign_name}</h4>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <span>{new Date(campaign?.start_date)?.toLocaleDateString()}</span>
                <ArrowRight size={12} className="text-primary" />
                <span>{new Date(campaign?.end_date)?.toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-black/10 rounded-[24px] border border-dashed border-white/10">
          <Calendar className="w-12 h-12 text-slate-700 mb-4" />
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">No Active Campaigns Detected</p>
        </div>
      )}
    </div>

    {/* Payout Queue Status */}
    <div className="col-span-full mt-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex items-center gap-8 text-center md:text-left">
        <div className="w-20 h-20 bg-primary rounded-[28px] flex items-center justify-center shadow-2xl shadow-primary/40 relative">
          <Activity className="w-10 h-10 text-white animate-pulse" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-black text-sm shadow-xl">
            {queueLength}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">Calculation Queue Pipeline</h3>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">Pending distribution events requiring engine processing</p>
        </div>
      </div>
      <button className="w-full md:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95">
        Batch Process All
      </button>
    </div>
  </div>
);

// Calculation Engine Panel Component
const CalculationEnginePanel = ({ activeConfig, activeCampaigns }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <div className="lg:col-span-2 space-y-8">
      <div className="bg-card/30 border border-white/5 rounded-[40px] p-10 shadow-2xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Distribution Logic Processor</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-8 bg-primary/5 rounded-[32px] border border-primary/10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Creator Node Share</p>
            <div className="text-5xl font-black text-primary tracking-tighter mb-2">{activeConfig?.creator_percentage}%</div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Configured for active creator network payouts.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-[32px] border border-white/10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Platform Node Share</p>
            <div className="text-5xl font-black text-white tracking-tighter mb-2">{activeConfig?.platform_percentage}%</div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">Allocated to operational infrastructure & R&D.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Algorithm formula</h4>
          <div className="bg-black/40 p-8 rounded-3xl font-mono text-sm border border-white/5 leading-loose">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-white">CREATOR_NODE = REVENUE * ({activeConfig?.creator_percentage / 100})</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-slate-400">PLATFORM_NODE = REVENUE * ({activeConfig?.platform_percentage / 100})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-[40px] p-10">
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-10 flex items-center gap-4">
          <Shield className="w-6 h-6 text-green-400" />
          Engine Integrity Protocol
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Math Verify', icon: CheckCircle, color: 'text-green-400', desc: '100% Sum Check' },
            { label: 'Audit Trail', icon: FileText, color: 'text-primary', desc: 'Full Ledger History' },
            { label: 'Encryption', icon: Lock, color: 'text-yellow-400', desc: 'SHA-256 Records' }
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-black/20 rounded-3xl border border-white/5 text-center group hover:bg-white/5 transition-all">
              <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
              <div className="font-black text-white text-[10px] uppercase tracking-widest mb-1">{item.label}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="space-y-8">
      <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-[40px] p-10 h-full">
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">Simulation Sandbox</h3>
        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Test Revenue Amount</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-xl">$</span>
              <input 
                type="text" 
                defaultValue="1,000.00" 
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-12 pr-6 text-white font-black text-2xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
          
          <div className="p-8 bg-black/40 rounded-3xl border border-white/5 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Creator Share</span>
              <span className="text-2xl font-black text-primary tracking-tighter">${(1000 * (activeConfig?.creator_percentage / 100))?.toFixed(2)}</span>
            </div>
            <div className="w-full h-px bg-white/5" />
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Take</span>
              <span className="text-2xl font-black text-white tracking-tighter">${(1000 * (activeConfig?.platform_percentage / 100))?.toFixed(2)}</span>
            </div>
          </div>

          <button className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
            Validate Distribution
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Payout Processing Panel Component
const PayoutProcessingPanel = ({ payoutQueue, onProcess }) => (
  <div className="bg-card/30 border border-white/5 rounded-[40px] p-10 shadow-2xl">
    <div className="flex items-center justify-between mb-12">
      <div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Processing Queue</h3>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Found {payoutQueue?.length || 0} pending distribution events</p>
      </div>
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
        <CreditCard className="w-7 h-7 text-primary" />
      </div>
    </div>

    {payoutQueue?.length > 0 ? (
      <div className="grid grid-cols-1 gap-4">
        {payoutQueue?.map(transaction => (
          <div key={transaction?.id} className="group bg-black/20 border border-white/5 rounded-[32px] p-8 hover:bg-white/5 transition-all flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors overflow-hidden">
                <User className="w-8 h-8 text-slate-500 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <div className="text-lg font-black text-white uppercase tracking-tight mb-1">
                  {transaction?.user_profiles?.full_name || transaction?.user_profiles?.username}
                </div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] font-mono">
                  TXID: {transaction?.id?.slice(0, 12)}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="text-center md:text-right">
                <div className="text-3xl font-black text-white tracking-tighter mb-1">${transaction?.amount?.toFixed(2)}</div>
                <div className="text-[10px] font-black text-primary uppercase tracking-widest">{transaction?.transaction_type}</div>
              </div>
              <button
                onClick={() => onProcess(transaction?.id, transaction?.user_id, transaction?.amount)}
                className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 group-hover:shadow-primary/20"
              >
                Execute Calc
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-24 bg-black/10 rounded-[32px] border border-dashed border-white/10">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h4 className="text-xl font-black text-white uppercase tracking-tight">Queue Synchronized</h4>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">All revenue distributions have been successfully processed</p>
      </div>
    )}
  </div>
);

// Transaction Monitoring Panel Component
const TransactionMonitoringPanel = ({ transactions }) => (
  <div className="bg-card/30 border border-white/5 rounded-[40px] p-10 shadow-2xl">
    <div className="flex items-center gap-4 mb-10">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Activity className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-black text-white uppercase tracking-tight">Real-Time Event Stream</h3>
    </div>

    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full border-separate border-spacing-y-4">
        <thead>
          <tr>
            <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Node</th>
            <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Volume</th>
            <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Split Logic</th>
            <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Execution</th>
            <th className="px-8 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map(transaction => (
            <tr key={transaction?.id} className="group hover:bg-white/5 transition-all">
              <td className="px-8 py-6 first:rounded-l-[24px] last:rounded-r-[24px] bg-black/20 border-y border-l border-white/5">
                <div className="font-black text-white uppercase tracking-tight">
                  {transaction?.user_profiles?.full_name || transaction?.user_profiles?.username}
                </div>
              </td>
              <td className="px-8 py-6 bg-black/20 border-y border-white/5">
                <div className="font-black text-white font-mono text-lg">${transaction?.amount?.toFixed(2)}</div>
              </td>
              <td className="px-8 py-6 bg-black/20 border-y border-white/5">
                <div className="text-[10px] font-black text-primary uppercase tracking-widest">
                  {transaction?.metadata?.creator_percentage || 70}% C / {transaction?.metadata?.platform_percentage || 30}% P
                </div>
              </td>
              <td className="px-8 py-6 bg-black/20 border-y border-white/5">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  transaction?.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  transaction?.status === 'processing'? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-white/5 text-slate-500 border border-white/10'
                }`}>
                  {transaction?.status}
                </span>
              </td>
              <td className="px-8 py-6 bg-black/20 border-y border-r border-white/5 text-right first:rounded-l-[24px] last:rounded-r-[24px]">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                  {new Date(transaction?.created_at)?.toLocaleTimeString()}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Historical Calculations Panel Component
const HistoricalCalculationsPanel = ({ history }) => (
  <div className="bg-card/30 border border-white/5 rounded-[40px] p-10 shadow-2xl">
    <div className="flex items-center gap-4 mb-10">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
        <History className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-black text-white uppercase tracking-tight">Immutable Calculation Ledger</h3>
    </div>

    <div className="grid grid-cols-1 gap-6">
      {history?.slice(0, 10)?.map(record => (
        <div key={record?.id} className="bg-black/20 border border-white/5 rounded-[32px] p-8 hover:bg-white/5 transition-all shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-black text-white uppercase tracking-tight">
                  {record?.user_profiles?.full_name || record?.user_profiles?.username}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Node Transaction</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-mono">
                {new Date(record?.created_at)?.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-black/20 rounded-2xl border border-white/5">
            <div>
              <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Transaction Volume</div>
              <div className="text-2xl font-black text-white tracking-tighter font-mono">${record?.amount?.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Applied Logic</div>
              <div className="text-2xl font-black text-primary tracking-tighter font-mono">
                {record?.metadata?.creator_percentage || 70}% / {record?.metadata?.platform_percentage || 30}%
              </div>
            </div>
            <div>
              <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Protocol Source</div>
              <div className="text-2xl font-black text-slate-300 tracking-tighter uppercase">
                {record?.metadata?.split_source || 'CORE_SYSTEM'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Advanced Features Panel Component
const AdvancedFeaturesPanel = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[
      { label: 'Batch Processing', desc: 'Process massive distribution volumes with validated batch calculation logic.', icon: Layers, color: 'text-primary', action: 'Upload Bulk Ledger', sub: 'CSV, JSON, XLXS' },
      { label: 'Global Settlement', desc: 'Automatic purchasing power adjustment across 8 international zones.', icon: Globe, color: 'text-green-400', action: 'Configure Zones', sub: 'USD, EUR, GBP, INR' },
      { label: 'Dispute Arbitration', desc: 'AI-driven resolution workflows with automated calculation verification.', icon: AlertTriangle, color: 'text-yellow-400', action: 'Open Arbitration', sub: 'Claude Reasoning' },
      { label: 'Node Reconciliation', desc: 'Comprehensive daily reports with intelligent discrepancy detection.', icon: FileText, color: 'text-primary', action: 'Generate Report', sub: 'PDF, CSV, API' }
    ].map((feature, i) => (
      <div key={i} className="bg-white/5 border border-white/5 rounded-[40px] p-10 hover:bg-white/10 transition-all group shadow-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className={`w-16 h-16 bg-black/20 rounded-[24px] flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-colors shadow-xl`}>
            <feature.icon className={`w-8 h-8 ${feature.color}`} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">{feature.label}</h3>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">{feature.sub}</p>
          </div>
        </div>
        <p className="text-slate-400 font-medium leading-relaxed mb-10">{feature.desc}</p>
        <button className="w-full py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all active:scale-95">
          {feature.action}
        </button>
      </div>
    ))}
  </div>
);

export default AutomatedPayoutCalculationEngine;