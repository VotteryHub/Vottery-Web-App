import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, ShoppingBag, Shield, Award, Zap, Gift, ArrowUpRight, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { gamificationService } from '../../services/gamificationService';

const VotteryPointsVPUniversalCurrencyCenter = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [vpData, setVpData] = useState(null);
  const [xpLog, setXpLog] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    if (user?.id) {
      loadVPData();
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-indigo-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Vottery Points (VP)</h1>
              <p className="text-gray-600 dark:text-gray-400">Universal Currency Center - Track, Earn, and Redeem</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl">
              <Coins className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* VP Balance Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-indigo-100">Current Balance</span>
                <Coins className="w-6 h-6 text-indigo-200" />
              </div>
              <div className="text-4xl font-bold mb-1">{vpData?.current_xp?.toLocaleString() || 0} VP</div>
              <div className="text-indigo-100 text-sm">Level {vpData?.level || 1}</div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Total Earned</span>
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {vpData?.breakdown?.total?.toLocaleString() || 0} VP
              </div>
              <div className="text-green-600 text-sm flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                Last {timeRange} days
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Streak Bonus</span>
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {vpData?.streak_count || 0} Days
              </div>
              <div className="text-yellow-600 text-sm">+{vpData?.streak_count * 5 || 0} VP/day</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 dark:bg-gray-700' :'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab?.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewPanel vpData={vpData} />}
            {activeTab === 'earning' && <EarningHistoryPanel xpLog={xpLog} timeRange={timeRange} setTimeRange={setTimeRange} />}
            {activeTab === 'spending' && <SpendingAnalyticsPanel vpData={vpData} />}
            {activeTab === 'blockchain' && <BlockchainVerificationPanel xpLog={xpLog} />}
          </div>
        </div>
      </div>
    </div>
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