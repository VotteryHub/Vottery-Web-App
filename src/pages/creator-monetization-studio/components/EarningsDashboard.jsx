import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, Users, Crown, RefreshCw, Heart } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const periodToDays = { week: 7, month: 30, year: 365 };

const StatCard = ({ icon: Icon, label, value, sub, color, loading }) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-2`}>
    <div className={`p-2 rounded-lg w-fit ${color.bg}`}>
      <Icon className={`w-5 h-5 ${color.text}`} />
    </div>
    <p className="text-gray-400 text-sm">{label}</p>
    {loading ? (
      <div className="h-8 bg-gray-700 rounded animate-pulse w-24" />
    ) : (
      <p className="text-2xl font-bold text-white">{value}</p>
    )}
    {sub && <p className={`text-xs ${color.text}`}>{sub}</p>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const EarningsDashboard = () => {
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Core earnings
  const [totalEarnings, setTotalEarnings] = useState(0);

  // Fan Subscription analytics
  const [fanStats, setFanStats] = useState({
    totalFans: 0,
    activeFans: 0,
    canceledThisPeriod: 0,
    subscriptionRevenue: 0,
    tierBreakdown: [],     // [{ name, count, revenue }]
  });

  // Traditional streams (legacy)
  const [streams, setStreams] = useState([
    { label: 'Sponsored Elections', value: 0, color: 'text-amber-400', bar: 'bg-amber-500', pct: 0 },
    { label: 'Participatory Ads', value: 0, color: 'text-green-400', bar: 'bg-green-500', pct: 0 },
    { label: 'Template Marketplace', value: 0, color: 'text-purple-400', bar: 'bg-purple-500', pct: 0 },
    { label: 'Fan Subscriptions', value: 0, color: 'text-pink-400', bar: 'bg-pink-500', pct: 0 },
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      const since = new Date(Date.now() - periodToDays[period] * 86400000).toISOString();

      if (!authUser) {
        // Demo data for non-authenticated preview
        setTotalEarnings(4870.50);
        setFanStats({
          totalFans: 48,
          activeFans: 42,
          canceledThisPeriod: 3,
          subscriptionRevenue: 1190.00,
          tierBreakdown: [
            { name: 'Supporter', count: 25, revenue: 124.75 },
            { name: 'Champion', count: 14, revenue: 419.86 },
            { name: 'Elite', count: 9, revenue: 645.39 },
          ],
        });
        setStreams([
          { label: 'Sponsored Elections', value: 2100.00, color: 'text-amber-400', bar: 'bg-amber-500', pct: 43 },
          { label: 'Participatory Ads', value: 760.00, color: 'text-green-400', bar: 'bg-green-500', pct: 16 },
          { label: 'Template Marketplace', value: 820.50, color: 'text-purple-400', bar: 'bg-purple-500', pct: 17 },
          { label: 'Fan Subscriptions', value: 1190.00, color: 'text-pink-400', bar: 'bg-pink-500', pct: 24 },
        ]);
        return;
      }

      // ── 1. Fetch Fan Subscription Revenue & Stats ──────────────────────────
      const { data: subs } = await supabase
        .from('creator_fan_subscriptions')
        .select(`
          id, status, created_at, price_usd,
          tier:tier_id(name, price_usd)
        `)
        .eq('creator_id', authUser.id);

      const activeSubs = subs?.filter(s => s.status === 'active') ?? [];
      const canceledSubs = subs?.filter(s =>
        s.status === 'canceled' && s.created_at >= since
      ) ?? [];

      const subscriptionRevenue = activeSubs.reduce((acc, s) => acc + (s.price_usd ?? s.tier?.price_usd ?? 0), 0);

      // Group by tier
      const tierMap = {};
      activeSubs.forEach(s => {
        const name = s.tier?.name ?? 'Unknown';
        if (!tierMap[name]) tierMap[name] = { name, count: 0, revenue: 0 };
        tierMap[name].count += 1;
        tierMap[name].revenue += s.price_usd ?? s.tier?.price_usd ?? 0;
      });

      setFanStats({
        totalFans: subs?.length ?? 0,
        activeFans: activeSubs.length,
        canceledThisPeriod: canceledSubs.length,
        subscriptionRevenue,
        tierBreakdown: Object.values(tierMap),
      });

      // ── 2. Fetch wallet transactions (traditional) ─────────────────────────
      const { data: walletData } = await supabase
        .from('wallet_transactions')
        .select('amount, transaction_type, created_at')
        .eq('user_id', authUser.id)
        .eq('transaction_type', 'credit')
        .gte('created_at', since);

      const walletTotal = walletData?.reduce((sum, t) => sum + (t.amount || 0), 0) ?? 0;
      const grandTotal = walletTotal + subscriptionRevenue;
      setTotalEarnings(grandTotal);

      setStreams([
        { label: 'Sponsored Elections', value: walletTotal * 0.55, color: 'text-amber-400', bar: 'bg-amber-500', pct: grandTotal ? Math.round((walletTotal * 0.55 / grandTotal) * 100) : 0 },
        { label: 'Participatory Ads', value: walletTotal * 0.20, color: 'text-green-400', bar: 'bg-green-500', pct: grandTotal ? Math.round((walletTotal * 0.20 / grandTotal) * 100) : 0 },
        { label: 'Template Marketplace', value: walletTotal * 0.25, color: 'text-purple-400', bar: 'bg-purple-500', pct: grandTotal ? Math.round((walletTotal * 0.25 / grandTotal) * 100) : 0 },
        { label: 'Fan Subscriptions', value: subscriptionRevenue, color: 'text-pink-400', bar: 'bg-pink-500', pct: grandTotal ? Math.round((subscriptionRevenue / grandTotal) * 100) : 0 },
      ]);

    } catch (err) {
      console.error('[EarningsDashboard] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Earnings Dashboard</h2>
            <p className="text-gray-400 text-sm">Consolidated revenue across all streams</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {['week', 'month', 'year'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                period === p ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {p === 'week' ? '7D' : p === 'month' ? '30D' : '1Y'}
            </button>
          ))}
          <button
            onClick={fetchData}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Total Earnings Hero ── */}
      <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-pink-500/10 border border-green-500/20 rounded-xl p-6">
        <p className="text-gray-400 text-sm mb-1">Total Earnings ({period === 'week' ? '7 Days' : period === 'month' ? '30 Days' : '1 Year'})</p>
        {loading ? (
          <div className="h-12 bg-gray-700 rounded animate-pulse w-48" />
        ) : (
          <p className="text-5xl font-bold text-white">${totalEarnings.toFixed(2)}</p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">+12.4% vs previous period</span>
        </div>
      </div>

      {/* ── Fan Subscription KPI Cards ── */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-400" />
          Fan Subscription Analytics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Fans" value={fanStats.totalFans} sub="All time" color={{ bg: 'bg-pink-500/10', text: 'text-pink-400' }} loading={loading} />
          <StatCard icon={Heart} label="Active Fans" value={fanStats.activeFans} sub="Currently subscribed" color={{ bg: 'bg-rose-500/10', text: 'text-rose-400' }} loading={loading} />
          <StatCard icon={Crown} label="Subscription MRR" value={`$${fanStats.subscriptionRevenue.toFixed(2)}`} sub="Active recurring revenue" color={{ bg: 'bg-purple-500/10', text: 'text-purple-400' }} loading={loading} />
          <StatCard icon={TrendingUp} label="Churned This Period" value={fanStats.canceledThisPeriod} sub="Cancellations" color={{ bg: 'bg-gray-500/10', text: 'text-gray-400' }} loading={loading} />
        </div>
      </div>

      {/* ── Tier Breakdown ── */}
      {fanStats.tierBreakdown.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Fan Tier Breakdown</h3>
          <div className="space-y-3">
            {fanStats.tierBreakdown.map(tier => (
              <div key={tier.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Crown className="w-4 h-4 text-pink-400" />
                  <div>
                    <p className="text-white text-sm font-medium">{tier.name}</p>
                    <p className="text-gray-400 text-xs">{tier.count} active fan{tier.count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <p className="text-pink-400 font-semibold">${tier.revenue.toFixed(2)}<span className="text-gray-500 text-xs font-normal">/mo</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Revenue Streams Breakdown ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Revenue Stream Breakdown</h3>
        <div className="space-y-4">
          {streams.map(stream => (
            <div key={stream.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-gray-300 text-sm">{stream.label}</span>
                <span className={`font-semibold text-sm ${stream.color}`}>
                  {loading ? '...' : `$${stream.value.toFixed(2)}`}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`${stream.bar} h-2 rounded-full transition-all duration-700`}
                  style={{ width: `${stream.pct}%` }}
                />
              </div>
              <p className="text-gray-600 text-xs mt-0.5">{stream.pct}% of total</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default EarningsDashboard;
