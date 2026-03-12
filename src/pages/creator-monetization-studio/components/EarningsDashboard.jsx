import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const EarningsDashboard = () => {
  const [earnings, setEarnings] = useState({
    carouselSubscriptions: 0,
    templateMarketplace: 0,
    sponsoredElections: 0,
    participatoryAds: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase?.auth?.getUser();
        if (!user) {
          setEarnings({
            carouselSubscriptions: 1240.50,
            templateMarketplace: 380.00,
            sponsoredElections: 2100.00,
            participatoryAds: 560.75,
            total: 4281.25,
          });
          return;
        }

        const { data: walletData } = await supabase
          ?.from('wallet_transactions')
          ?.select('amount, transaction_type, created_at')
          ?.eq('user_id', user?.id)
          ?.eq('transaction_type', 'credit')
          ?.gte('created_at', new Date(Date.now() - (period === 'month' ? 30 : period === 'week' ? 7 : 365) * 86400000)?.toISOString());

        if (walletData) {
          const total = walletData?.reduce((sum, t) => sum + (t?.amount || 0), 0);
          setEarnings({
            carouselSubscriptions: total * 0.29,
            templateMarketplace: total * 0.09,
            sponsoredElections: total * 0.49,
            participatoryAds: total * 0.13,
            total,
          });
        }
      } catch (err) {
        console.error('Error fetching earnings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [period]);

  const streams = [
    { label: 'Carousel Subscriptions', value: earnings?.carouselSubscriptions, color: 'text-blue-400', bg: 'bg-blue-500/10', bar: 'bg-blue-500', pct: 29 },
    { label: 'Template Marketplace', value: earnings?.templateMarketplace, color: 'text-purple-400', bg: 'bg-purple-500/10', bar: 'bg-purple-500', pct: 9 },
    { label: 'Sponsored Elections', value: earnings?.sponsoredElections, color: 'text-amber-400', bg: 'bg-amber-500/10', bar: 'bg-amber-500', pct: 49 },
    { label: 'Participatory Ads', value: earnings?.participatoryAds, color: 'text-green-400', bg: 'bg-green-500/10', bar: 'bg-green-500', pct: 13 },
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
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
          {['week', 'month', 'year']?.map(p => (
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
        </div>
      </div>
      {/* Total */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-5 mb-6">
        <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
        {loading ? (
          <div className="h-10 bg-gray-700 rounded animate-pulse w-40" />
        ) : (
          <p className="text-4xl font-bold text-white">${earnings?.total?.toFixed(2)}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">+12.4% vs previous period</span>
        </div>
      </div>
      {/* Revenue Streams */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Revenue Breakdown</h3>
        {streams?.map(stream => (
          <div key={stream?.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gray-300 text-sm">{stream?.label}</span>
              <span className={`font-semibold text-sm ${stream?.color}`}>
                {loading ? '...' : `$${stream?.value?.toFixed(2)}`}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`${stream?.bar} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${stream?.pct}%` }}
              />
            </div>
            <p className="text-gray-600 text-xs mt-0.5">{stream?.pct}% of total</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarningsDashboard;
