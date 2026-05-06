import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, MessageSquare, Activity, Download } from 'lucide-react';


const HubAnalyticsPanel = ({ groupId }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [groupId, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // Generate mock analytics data
      const days = timeRange === '7d' ? 7 : 30;
      const activityData = Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - 1 - i) * 86400000)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        posts: Math.floor(Math.random() * 20) + 5,
        members: Math.floor(Math.random() * 10) + 2,
        engagement: Math.floor(Math.random() * 50) + 20,
      }));

      setMetrics({
        totalMembers: 1247,
        activeMembers: 389,
        totalPosts: 2841,
        avgEngagement: 67.3,
        memberGrowth: 12.4,
        postGrowth: 8.7,
        activityData,
        topContributors: [
          { name: 'Alice Johnson', posts: 45, engagement: 92 },
          { name: 'Bob Smith', posts: 38, engagement: 87 },
          { name: 'Carol White', posts: 31, engagement: 79 },
          { name: 'David Lee', posts: 28, engagement: 74 },
        ],
        demographics: [
          { category: 'Politics', count: 342 },
          { category: 'Technology', count: 289 },
          { category: 'Sports', count: 198 },
          { category: 'Entertainment', count: 156 },
          { category: 'Business', count: 134 },
        ]
      });
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!metrics) return;
    const csv = [
      'Date,Posts,New Members,Engagement',
      ...metrics?.activityData?.map(d => `${d?.date},${d?.posts},${d?.members},${d?.engagement}`)
    ]?.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hub-analytics-${timeRange}.csv`;
    a?.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: metrics?.totalMembers?.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', growth: metrics?.memberGrowth },
          { label: 'Active Members', value: metrics?.activeMembers?.toLocaleString(), icon: Activity, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', growth: 5.2 },
          { label: 'Total Posts', value: metrics?.totalPosts?.toLocaleString(), icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', growth: metrics?.postGrowth },
          { label: 'Avg Engagement', value: `${metrics?.avgEngagement}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', growth: 3.1 },
        ]?.map((kpi, i) => (
          <div key={i} className={`${kpi?.bg} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className={`w-4 h-4 ${kpi?.color}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{kpi?.label}</span>
            </div>
            <p className={`text-2xl font-bold ${kpi?.color}`}>{kpi?.value}</p>
            <p className="text-xs text-green-600 mt-1">+{kpi?.growth}% this period</p>
          </div>
        ))}
      </div>
      {/* Activity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Activity Trends</h3>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {['7d', '30d']?.map(r => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    timeRange === r ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button onClick={handleExport} className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={metrics?.activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="posts" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Posts" />
            <Line type="monotone" dataKey="engagement" stroke="#f97316" strokeWidth={2} dot={false} name="Engagement" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Top Contributors */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Contributors</h3>
        <div className="space-y-3">
          {metrics?.topContributors?.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{c?.name}</span>
                  <span className="text-xs text-gray-500">{c?.posts} posts</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${c?.engagement}%` }} />
                </div>
              </div>
              <span className="text-xs font-bold text-purple-600">{c?.engagement}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HubAnalyticsPanel;
