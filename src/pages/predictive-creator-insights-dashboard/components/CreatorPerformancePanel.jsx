import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, DollarSign, Users, BarChart2, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const CreatorPerformancePanel = ({ creatorId, onDataLoaded }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [creatorId]);

  const loadMetrics = async () => {
    try {
      if (!creatorId) {
        setMetrics({
          totalElections: 0,
          totalVotes: 0,
          avgVotes: 0,
          totalEarnings: '0.00',
          topCategory: 'N/A',
          engagementRate: '0.0',
          elections: [],
          categoryBreakdown: {},
        });
        return;
      }
      setLoading(true);
      const { data: elections } = await supabase
        ?.from('elections')
        ?.select('id, title, category, vote_count, created_at, end_date, reward_amount')
        ?.eq('creator_id', creatorId)
        ?.order('created_at', { ascending: false })
        ?.limit(20);

      const electionData = elections || [];

      const totalVotes = electionData?.reduce((s, e) => s + (e?.vote_count || 0), 0);
      const avgVotes = electionData?.length ? Math.round(totalVotes / electionData?.length) : 0;
      const totalEarnings = electionData?.reduce((s, e) => s + (e?.reward_amount || 0) * 0.7, 0);
      const categoryBreakdown = electionData?.reduce((acc, e) => {
        acc[e.category] = (acc?.[e?.category] || 0) + 1;
        return acc;
      }, {});
      const topCategory = Object.entries(categoryBreakdown)?.sort((a, b) => b?.[1] - a?.[1])?.[0]?.[0] || 'N/A';

      const computed = {
        totalElections: electionData?.length,
        totalVotes,
        avgVotes,
        totalEarnings: totalEarnings?.toFixed(2),
        topCategory,
        engagementRate: ((totalVotes / (electionData?.length * 5000)) * 100)?.toFixed(1),
        elections: electionData,
        categoryBreakdown
      };
      setMetrics(computed);
      onDataLoaded?.(computed);
    } catch (err) {
      console.error('Error loading creator metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4]?.map(i => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-blue-600" />
          Creator Performance Overview
        </h3>
        <button onClick={loadMetrics} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Elections', value: metrics?.totalElections, icon: Award, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Total Votes', value: metrics?.totalVotes?.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Avg Votes/Election', value: metrics?.avgVotes?.toLocaleString(), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Total Earnings', value: `$${parseFloat(metrics?.totalEarnings || 0)?.toLocaleString()}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ]?.map((stat, i) => (
          <div key={i} className={`${stat?.bg} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat?.color}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{stat?.label}</span>
            </div>
            <p className={`text-2xl font-bold ${stat?.color}`}>{stat?.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Election History</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {metrics?.elections?.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{e?.title}</p>
                  <p className="text-xs text-gray-500">{e?.category}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-sm font-bold text-blue-600">{(e?.vote_count || 0)?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">votes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(metrics?.categoryBreakdown || {})?.map(([cat, count], i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-24 truncate">{cat}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(count / (metrics?.totalElections || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-6">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Engagement Rate</p>
            <p className="text-2xl font-bold text-green-600">{metrics?.engagementRate}%</p>
            <p className="text-xs text-gray-500">Top Category: {metrics?.topCategory}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorPerformancePanel;
