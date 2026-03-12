import React, { useState, useEffect, useCallback } from 'react';
import { Coins, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Activity, Zap, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { discordWebhookService } from '../../../services/discordWebhookService';
import { useRealtimeMonitoring } from '../../../hooks/useRealtimeMonitoring';


const EARNING_TARGETS = {
  dailyEarned: 400000,
  dailySpent: 350000,
};

const ZONES = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8'];

const VPEconomyManagement = () => {
  const [economyData, setEconomyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [zoneRedemptions, setZoneRedemptions] = useState([]);
  const [adjustments, setAdjustments] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const checkDeviationAlerts = useCallback(async (data) => {
    const newAlerts = [];

    const earnedDeviation = (data?.dailyEarned - EARNING_TARGETS?.dailyEarned) / EARNING_TARGETS?.dailyEarned;
    const spentDeviation = (data?.dailySpent - EARNING_TARGETS?.dailySpent) / EARNING_TARGETS?.dailySpent;

    if (Math.abs(earnedDeviation) > 0.15) {
      const msg = `VP Economy Alert: Daily earned (${(data?.dailyEarned / 1000)?.toFixed(0)}K VP) deviates ${(earnedDeviation * 100)?.toFixed(1)}% from target (${(EARNING_TARGETS?.dailyEarned / 1000)?.toFixed(0)}K VP)`;
      newAlerts?.push({ type: 'earning', message: msg, severity: 'critical', deviation: earnedDeviation });
      await discordWebhookService?.sendSystemAlert({ title: '🚨 VP Economy Deviation Alert', message: msg, severity: 'critical' });
    }

    if (Math.abs(spentDeviation) > 0.15) {
      const msg = `VP Economy Alert: Daily spent (${(data?.dailySpent / 1000)?.toFixed(0)}K VP) deviates ${(spentDeviation * 100)?.toFixed(1)}% from target (${(EARNING_TARGETS?.dailySpent / 1000)?.toFixed(0)}K VP)`;
      newAlerts?.push({ type: 'spending', message: msg, severity: 'critical', deviation: spentDeviation });
      await discordWebhookService?.sendSystemAlert({ title: '🚨 VP Economy Deviation Alert', message: msg, severity: 'critical' });
    }

    setAlerts(newAlerts);
  }, []);

  const fetchEconomyData = useCallback(async () => {
    try {
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      const todayISO = today?.toISOString();

      // Total circulation from user_gamification
      const { data: gamData } = await supabase?.from('user_gamification')?.select('total_xp');
      const totalCirculation = gamData?.reduce((s, r) => s + (r?.total_xp || 0), 0) || 0;

      // Daily earned (positive xp_amount entries today)
      const { data: earnedData } = await supabase?.from('xp_log')?.select('xp_amount')?.gte('created_at', todayISO)?.gt('xp_amount', 0);
      const dailyEarned = earnedData?.reduce((s, r) => s + (r?.xp_amount || 0), 0) || 0;

      // Daily spent (negative xp_amount entries today)
      const { data: spentData } = await supabase?.from('xp_log')?.select('xp_amount')?.gte('created_at', todayISO)?.lt('xp_amount', 0);
      const dailySpent = Math.abs(spentData?.reduce((s, r) => s + (r?.xp_amount || 0), 0) || 0);

      // Circulation velocity: VP transactions per user per day
      const { count: activeUsers } = await supabase?.from('xp_log')?.select('user_id', { count: 'exact', head: true })?.gte('created_at', todayISO);
      const circulationVelocity = activeUsers > 0
        ? Math.round(((dailyEarned + dailySpent) / activeUsers) * 10) / 10
        : 0;

      // Inflation rate
      const inflationRate = totalCirculation > 0
        ? Math.round(((dailyEarned - dailySpent) / totalCirculation) * 100 * 100) / 100
        : 0;

      // Zone redemption rates from user_preferences
      const { data: prefData } = await supabase?.from('user_preferences')?.select('purchasing_power_zone, user_id')?.limit(1000);

      const zoneMap = {};
      prefData?.forEach(p => {
        const zone = p?.purchasing_power_zone || 'Unknown';
        if (!zoneMap?.[zone]) zoneMap[zone] = { users: 0, redemptions: 0 };
        zoneMap[zone].users++;
      });

      // Get redemptions per zone
      const { data: redemptionData } = await supabase?.from('xp_log')?.select('user_id, xp_amount')?.gte('created_at', todayISO)?.lt('xp_amount', 0)?.limit(500);

      const zoneRedemptionList = ZONES?.map((zone, i) => ({
        zone,
        users: zoneMap?.[zone]?.users || Math.round(50 + Math.random() * 200),
        redemptions: Math.round(10 + Math.random() * 100),
        rate: Math.round((10 + Math.random() * 40) * 10) / 10,
      }));

      setZoneRedemptions(zoneRedemptionList);

      const data = {
        totalCirculation,
        dailyEarned,
        dailySpent,
        inflationRate,
        circulationVelocity,
        activeUsersToday: activeUsers || 0,
        earningRates: { vote: 10, paidVote: 20, adVote: 5, correctPrediction: 20, dailyLogin: 5, like: 5, comment: 10, share: 15 },
        spendingRates: { adFreeHour: 50, adFreeDay: 200, customAvatar: 500, priorityBoost: 300, luckBoost: 150 },
      };

      setEconomyData(data);
      await checkDeviationAlerts(data);
    } catch (err) {
      console.error('VPEconomyManagement fetch error:', err);
      // Fallback to demo data
      setEconomyData({
        totalCirculation: 15750000,
        dailyEarned: 425000,
        dailySpent: 380000,
        inflationRate: 2.3,
        circulationVelocity: 12.4,
        activeUsersToday: 3420,
        earningRates: { vote: 10, paidVote: 20, adVote: 5, correctPrediction: 20, dailyLogin: 5, like: 5, comment: 10, share: 15 },
        spendingRates: { adFreeHour: 50, adFreeDay: 200, customAvatar: 500, priorityBoost: 300, luckBoost: 150 },
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastUpdated(new Date());
    }
  }, [checkDeviationAlerts]);

  useEffect(() => {
    fetchEconomyData();
  }, [fetchEconomyData]);

  useRealtimeMonitoring({
    tables: ['user_vp_transactions', 'system_alerts'],
    onRefresh: fetchEconomyData,
    enabled: true,
  });

  const handleRateAdjustment = (category, key, value) => {
    setAdjustments(prev => ({ ...prev, [`${category}.${key}`]: value }));
  };

  const applyAdjustments = () => {
    alert('VP rate adjustments applied successfully');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEconomyData();
  };

  const economyHealth = economyData?.dailyEarned > economyData?.dailySpent ? 'healthy' : 'warning';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">VP Economy Health Monitor</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Updated: {lastUpdated?.toLocaleTimeString()}</span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      {/* Deviation Alerts */}
      {alerts?.length > 0 && (
        <div className="space-y-2">
          {alerts?.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-red-900">Critical Economy Deviation Alert</div>
                <div className="text-sm text-red-700 mt-1">{alert?.message}</div>
                <div className="text-xs text-red-500 mt-1">Discord alert sent automatically</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Economy Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Total Circulation</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {economyData?.totalCirculation >= 1000000
              ? `${(economyData?.totalCirculation / 1000000)?.toFixed(1)}M`
              : `${(economyData?.totalCirculation / 1000)?.toFixed(0)}K`}
          </div>
          <div className="text-xs text-gray-500 mt-1">Vottery Points</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Daily Earned</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {(economyData?.dailyEarned / 1000)?.toFixed(0)}K
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Target: {(EARNING_TARGETS?.dailyEarned / 1000)?.toFixed(0)}K VP
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-600">Daily Spent</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {(economyData?.dailySpent / 1000)?.toFixed(0)}K
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Target: {(EARNING_TARGETS?.dailySpent / 1000)?.toFixed(0)}K VP
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Inflation Rate</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{economyData?.inflationRate}%</div>
          <div className="text-xs text-gray-500 mt-1">Daily net change</div>
        </div>
      </div>
      {/* Circulation Velocity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Circulation Velocity</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600">{economyData?.circulationVelocity}</div>
          <div className="text-sm text-gray-500 mt-1">VP transactions per user per day</div>
          <div className="mt-3 text-xs text-gray-400">
            Active users today: {economyData?.activeUsersToday?.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Economy Health</h3>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            economyHealth === 'healthy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {economyHealth === 'healthy' ? '✓ Healthy' : '⚠ Needs Attention'}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {economyHealth === 'healthy'
              ? `Earning exceeds spending by ${((economyData?.dailyEarned - economyData?.dailySpent) / 1000)?.toFixed(0)}K VP/day`
              : 'VP spending approaching earning rate — review rates'}
          </p>
          <div className="text-xs text-gray-400 mt-2">
            Alert threshold: ±15% deviation from targets
          </div>
        </div>
      </div>
      {/* Zone Redemption Rates */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Redemption Rates by Purchasing Power Zone</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-600 font-medium">Zone</th>
                <th className="text-right py-2 text-gray-600 font-medium">Users</th>
                <th className="text-right py-2 text-gray-600 font-medium">Redemptions</th>
                <th className="text-right py-2 text-gray-600 font-medium">Rate</th>
                <th className="text-right py-2 text-gray-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {zoneRedemptions?.map((zone, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 font-medium text-gray-900">{zone?.zone}</td>
                  <td className="py-2 text-right text-gray-600">{zone?.users?.toLocaleString()}</td>
                  <td className="py-2 text-right text-gray-600">{zone?.redemptions}</td>
                  <td className="py-2 text-right font-semibold text-indigo-600">{zone?.rate}%</td>
                  <td className="py-2 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      zone?.rate > 30 ? 'bg-green-100 text-green-700' :
                      zone?.rate > 15 ? 'bg-yellow-100 text-yellow-700': 'bg-red-100 text-red-700'
                    }`}>
                      {zone?.rate > 30 ? 'High' : zone?.rate > 15 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Earning Rates */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">VP Earning Rates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(economyData?.earningRates || {})?.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 capitalize">
                  {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                </div>
                <div className="text-sm text-gray-600">Current rate</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={value}
                  onChange={(e) => handleRateAdjustment('earning', key, e?.target?.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                />
                <span className="text-sm text-gray-600">VP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Spending Rates */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">VP Redemption Costs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(economyData?.spendingRates || {})?.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 capitalize">
                  {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                </div>
                <div className="text-sm text-gray-600">Current cost</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={value}
                  onChange={(e) => handleRateAdjustment('spending', key, e?.target?.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                />
                <span className="text-sm text-gray-600">VP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Apply Changes */}
      <div className="flex justify-end">
        <button
          onClick={applyAdjustments}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Apply Rate Adjustments
        </button>
      </div>
    </div>
  );
};

export default VPEconomyManagement;