import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, ShoppingBag, Shield, Award, Zap, Gift, ArrowUpRight, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { gamificationService } from '../../services/gamificationService';
import { useNavigate } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import Icon from '../../components/AppIcon';

const VotteryPointsVPUniversalCurrencyCenter = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [vpData, setVpData] = useState(null);
  const [xpLog, setXpLog] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    if (user?.id) {
      loadVPData();
    } else if (user === null) {
      // If auth check finished and no user, stop loading (or redirect)
      setLoading(false);
    }
  }, [user, timeRange]);

  const loadVPData = async () => {
    try {
      setLoading(true);
      const [gamification, log, breakdown] = await Promise.all([
        gamificationService?.getUserGamification(user?.id),
        gamificationService?.getXPLog(user?.id, 50),
        gamificationService?.getXPBreakdown(user?.id, timeRange)
      ]);

      setVpData({
        ...gamification,
        breakdown
      });
      setXpLog(log || []);
    } catch (error) {
      console.error('Error loading VP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Coins },
    { id: 'earning', label: 'Earning History', icon: TrendingUp },
    { id: 'spending', label: 'Spending Analytics', icon: ShoppingBag },
    { id: 'blockchain', label: 'Blockchain Verification', icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading VP Data...</p>
        </div>
      </div>
    );
  }

  return (
    <GeneralPageLayout title="Vottery Points Center" showSidebar={true}>
      {!user ? (
        <div className="py-24 text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <Icon name="Lock" size={40} className="text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-4 uppercase tracking-tight">Access Restricted</h2>
          <p className="text-slate-400 mb-10 max-w-md mx-auto font-medium text-lg">Please sign in to access your universal currency dashboard and track your VP earnings.</p>
          <button 
            onClick={() => navigate('/authentication-portal')}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
          >
            Sign In to Continue
          </button>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
                Currency Center
              </h1>
              <p className="text-base md:text-lg text-slate-400 font-medium">
                Track, earn, and redeem your Vottery Points across the ecosystem.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <Coins className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Status</p>
                <p className="text-lg font-black text-white uppercase tracking-tight">Verified Citizen</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all duration-700" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Balance</span>
                <Coins className="w-5 h-5 opacity-70" />
              </div>
              <div className="text-5xl font-black mb-2 tracking-tight">{vpData?.current_xp?.toLocaleString() || 0} VP</div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                Level {vpData?.level || 1} Master
              </div>
            </div>

            <div className="premium-glass rounded-3xl p-8 border border-white/10 shadow-xl group hover:border-primary/30 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Earned</span>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="text-4xl font-black text-white mb-2 tracking-tight">
                {vpData?.breakdown?.total?.toLocaleString() || 0} VP
              </div>
              <div className="text-success text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <ArrowUpRight className="w-3 h-3" />
                Last {timeRange} days growth
              </div>
            </div>

            <div className="premium-glass rounded-3xl p-8 border border-white/10 shadow-xl group hover:border-accent/30 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Streak Bonus</span>
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div className="text-4xl font-black text-white mb-2 tracking-tight">
                {vpData?.streak_count || 0} Days
              </div>
              <div className="text-accent text-[10px] font-black uppercase tracking-widest">
                +{vpData?.streak_count * 5 || 0} VP Daily Multiplier
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex border-b border-white/5 p-2 overflow-x-auto no-scrollbar gap-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-black text-[10px] uppercase tracking-widest transition-all rounded-2xl whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-white/10 text-white shadow-inner' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab?.label}
                </button>
              ))}
            </div>

            <div className="p-8 lg:p-10">
              {activeTab === 'overview' && <OverviewPanel vpData={vpData} />}
              {activeTab === 'earning' && <EarningHistoryPanel xpLog={xpLog} timeRange={timeRange} setTimeRange={setTimeRange} />}
              {activeTab === 'spending' && <SpendingAnalyticsPanel vpData={vpData} />}
              {activeTab === 'blockchain' && <BlockchainVerificationPanel xpLog={xpLog} />}
            </div>
          </div>
        </div>
      )}
    </GeneralPageLayout>
  );
};

// Overview Panel Component
const OverviewPanel = ({ vpData }) => {
  const earningCategories = [
    { label: 'Voting', value: vpData?.breakdown?.organic || 0, color: 'bg-blue-500', icon: Award },
    { label: 'Sponsored Ads', value: vpData?.breakdown?.sponsored || 0, color: 'bg-green-500', icon: Gift },
    { label: 'Streaks', value: vpData?.breakdown?.streaks || 0, color: 'bg-yellow-500', icon: Zap },
    { label: 'Badges', value: vpData?.breakdown?.badges || 0, color: 'bg-purple-500', icon: Award },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">VP Earning Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {earningCategories?.map((category, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`${category?.color} p-2 rounded-lg`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">{category?.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {category?.value?.toLocaleString()} VP
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">Your recent VP transactions will appear here</p>
        </div>
      </div>
    </div>
  );
};

// Earning History Panel Component
const EarningHistoryPanel = ({ xpLog, timeRange, setTimeRange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Earning History</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e?.target?.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      <div className="space-y-3">
        {xpLog?.length > 0 ? (
          xpLog?.map((log, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  log?.is_sponsored ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'
                }`}>
                  {log?.is_sponsored ? (
                    <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {log?.action_type?.replace(/_/g, ' ')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(log?.timestamp)?.toLocaleDateString()} at {new Date(log?.timestamp)?.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  +{log?.xp_gained} VP
                </div>
                {log?.multiplier > 1 && (
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">
                    {log?.multiplier}x multiplier
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No earning history yet. Start voting to earn VP!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Spending Analytics Panel Component
const SpendingAnalyticsPanel = ({ vpData }) => {
  const redemptionOptions = [
    { name: 'Ad-Free Hour', cost: 50, icon: Shield, available: true },
    { name: 'Custom Avatar', cost: 200, icon: Award, available: true },
    { name: 'Priority Boost', cost: 300, icon: TrendingUp, available: true },
    { name: 'Lottery Ticket', cost: 150, icon: Gift, available: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">VP Redemption Shop</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {redemptionOptions?.map((option, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
                    <option.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{option?.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{option?.cost} VP</div>
                  </div>
                </div>
                <button
                  disabled={!option?.available || (vpData?.current_xp || 0) < option?.cost}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    option?.available && (vpData?.current_xp || 0) >= option?.cost
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' :'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Spending History</h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No redemptions yet. Start redeeming VP for rewards!</p>
        </div>
      </div>
    </div>
  );
};

// Blockchain Verification Panel Component
const BlockchainVerificationPanel = ({ xpLog }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Blockchain Transaction Logs</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          All VP transactions are logged on the blockchain for complete transparency and verification.
        </p>
      </div>
      <div className="space-y-3">
        {xpLog?.slice(0, 10)?.map((log, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {log?.action_type?.replace(/_/g, ' ')}
                </span>
              </div>
              <span className="text-green-600 dark:text-green-400 font-bold">+{log?.xp_gained} VP</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {new Date(log?.timestamp)?.toLocaleString()}
              </span>
              <button className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline">
                <ExternalLink className="w-4 h-4" />
                Verify on Chain
              </button>
            </div>
          </div>
        ))}
      </div>
      {xpLog?.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No blockchain transactions yet</p>
        </div>
      )}
    </div>
  );
};

export default VotteryPointsVPUniversalCurrencyCenter;