import React, { useState, useEffect, useCallback } from 'react';
import { BarChart } from 'recharts';
import { TrendingUp, Users, Coins, Shield, RefreshCw, Eye, Bell } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import { Helmet } from 'react-helmet';
import { supabase } from '../../lib/supabase';
import { discordWebhookService } from '../../services/discordWebhookService';

import AccuracyDistributionPanel from './components/AccuracyDistributionPanel';
import ParticipationTrendsPanel from './components/ParticipationTrendsPanel';
import VPPayoutPanel from './components/VPPayoutPanel';
import FraudDetectionPanel from './components/FraudDetectionPanel';
import PoolPerformancePanel from './components/PoolPerformancePanel';
import Icon from '../../components/AppIcon';


const TABS = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'accuracy', label: 'Accuracy Distribution', icon: BarChart },
  { id: 'participation', label: 'Participation Trends', icon: Users },
  { id: 'payouts', label: 'VP Payouts', icon: Coins },
  { id: 'fraud', label: 'Fraud Detection', icon: Shield },
  { id: 'pools', label: 'Pool Performance', icon: Eye },
];

const StatCard = ({ icon: Icon, label, value, sub, color, alert }) => (
  <div className={`bg-white rounded-xl border p-5 ${
    alert ? 'border-red-300 bg-red-50' : 'border-gray-200'
  }`}>
    <div className="flex items-center justify-between mb-2">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {alert && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Alert</span>}
    </div>
    <div className="text-2xl font-bold text-gray-900 mt-2">{value}</div>
    <div className="text-sm font-medium text-gray-700">{label}</div>
    {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
  </div>
);

const PredictionAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPredictions: 0,
    activePools: 0,
    totalVPPaid: 0,
    avgAccuracy: 0,
    suspiciousUsers: 0,
    resolvedPools: 0,
  });
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchStats = useCallback(async () => {
    try {
      // Total predictions
      const { count: totalPredictions } = await supabase?.from('election_predictions')?.select('*', { count: 'exact', head: true });

      // Active pools (distinct elections with predictions)
      const { data: poolData } = await supabase?.from('election_predictions')?.select('election_id')?.eq('status', 'active');
      const activePools = new Set(poolData?.map(p => p?.election_id))?.size || 0;

      // Total VP paid out from xp_log for prediction rewards
      const { data: vpData } = await supabase?.from('xp_log')?.select('xp_amount')?.eq('action_type', 'prediction_reward');
      const totalVPPaid = vpData?.reduce((sum, r) => sum + (r?.xp_amount || 0), 0) || 0;

      // Average accuracy (brier score inverted)
      const { data: scoreData } = await supabase?.from('election_predictions')?.select('brier_score')?.not('brier_score', 'is', null);
      const avgBrier = scoreData?.length
        ? scoreData?.reduce((s, r) => s + (r?.brier_score || 0), 0) / scoreData?.length
        : 0;
      const avgAccuracy = Math.round((1 - avgBrier) * 100);

      // Resolved pools
      const { count: resolvedPools } = await supabase?.from('election_predictions')?.select('election_id', { count: 'exact', head: true })?.eq('status', 'resolved');

      // Fraud detection: users with >95% accuracy across 10+ pools
      const { data: userScores } = await supabase?.from('election_predictions')?.select('user_id, brier_score, election_id')?.not('brier_score', 'is', null);

      const userMap = {};
      userScores?.forEach(r => {
        if (!userMap?.[r?.user_id]) userMap[r.user_id] = { scores: [], elections: new Set() };
        userMap?.[r?.user_id]?.scores?.push(r?.brier_score);
        userMap?.[r?.user_id]?.elections?.add(r?.election_id);
      });

      const suspicious = Object.entries(userMap)?.filter(([, v]) => {
          const poolCount = v?.elections?.size;
          const avgScore = v?.scores?.reduce((s, x) => s + x, 0) / v?.scores?.length;
          return poolCount >= 10 && avgScore < 0.05; // <5% brier = >95% accuracy
        })?.map(([userId, v]) => ({
          userId,
          poolCount: v?.elections?.size,
          accuracy: Math.round((1 - v?.scores?.reduce((s, x) => s + x, 0) / v?.scores?.length) * 100),
        }));

      setFraudAlerts(suspicious);

      // Trigger automated alerts for suspicious users
      if (suspicious?.length > 0) {
        suspicious?.forEach(async (user) => {
          await discordWebhookService?.sendSystemAlert({
            title: '🚨 Suspicious Prediction Accuracy Detected',
            message: `User ${user?.userId} has ${user?.accuracy}% accuracy across ${user?.poolCount} pools — flagged for investigation.`,
            severity: 'critical',
          });
        });
      }

      setStats({
        totalPredictions: totalPredictions || 0,
        activePools,
        totalVPPaid,
        avgAccuracy: isNaN(avgAccuracy) ? 0 : avgAccuracy,
        suspiciousUsers: suspicious?.length,
        resolvedPools: resolvedPools || 0,
      });
    } catch (err) {
      console.error('Error fetching prediction analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastUpdated(new Date());
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet><title>Prediction Analytics Dashboard | Vottery</title></Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Prediction Analytics Dashboard</h1>
                <p className="text-sm text-gray-500">Election prediction pool performance, fraud detection & VP economy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {stats?.suspiciousUsers > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                  <Bell className="w-4 h-4" />
                  {stats?.suspiciousUsers} Fraud Alert{stats?.suspiciousUsers > 1 ? 's' : ''}
                </div>
              )}
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <span className="text-xs text-gray-400">Updated: {lastUpdated?.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <StatCard icon={TrendingUp} label="Total Predictions" value={loading ? '...' : stats?.totalPredictions?.toLocaleString()} sub="All time" color="bg-indigo-500" />
            <StatCard icon={Users} label="Active Pools" value={loading ? '...' : stats?.activePools} sub="Live elections" color="bg-blue-500" />
            <StatCard icon={Coins} label="VP Paid Out" value={loading ? '...' : `${(stats?.totalVPPaid / 1000)?.toFixed(1)}K`} sub="Prediction rewards" color="bg-yellow-500" />
            <StatCard icon={TrendingUp} label="Avg Accuracy" value={loading ? '...' : `${stats?.avgAccuracy}%`} sub="Platform-wide" color="bg-green-500" />
            <StatCard icon={Eye} label="Resolved Pools" value={loading ? '...' : stats?.resolvedPools} sub="Completed" color="bg-teal-500" />
            <StatCard icon={Shield} label="Fraud Alerts" value={loading ? '...' : stats?.suspiciousUsers} sub=">95% accuracy, 10+ pools" color="bg-red-500" alert={stats?.suspiciousUsers > 0} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 overflow-x-auto">
            {TABS?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab?.id
                    ? 'bg-indigo-600 text-white' :'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab?.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AccuracyDistributionPanel compact />
              <ParticipationTrendsPanel compact />
              <VPPayoutPanel compact />
              <FraudDetectionPanel fraudAlerts={fraudAlerts} compact />
            </div>
          )}
          {activeTab === 'accuracy' && <AccuracyDistributionPanel />}
          {activeTab === 'participation' && <ParticipationTrendsPanel />}
          {activeTab === 'payouts' && <VPPayoutPanel />}
          {activeTab === 'fraud' && <FraudDetectionPanel fraudAlerts={fraudAlerts} />}
          {activeTab === 'pools' && <PoolPerformancePanel />}
        </main>
      </div>
    </div>
  );
};

export default PredictionAnalyticsDashboard;
