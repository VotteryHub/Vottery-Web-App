import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';



const TIERS = [
  { name: 'Bronze', color: '#cd7f32', icon: '🥉', count: 1240, revenue: 3720 },
  { name: 'Silver', color: '#c0c0c0', icon: '🥈', count: 680, revenue: 8160 },
  { name: 'Gold', color: '#ffd700', icon: '🥇', count: 312, revenue: 12480 },
  { name: 'Platinum', color: '#e5e4e2', icon: '💫', count: 89, revenue: 8900 },
  { name: 'Elite', color: '#b9f2ff', icon: '💎', count: 23, revenue: 6900 }
];

const buildPerformanceData = (days) => {
  const points = [];
  const baseRevenue = days === 7 ? 12800 : 9700;
  const baseCreators = days === 7 ? 2025 : 1880;
  const baseEngagement = days === 7 ? 71 : 64;

  for (let i = 0; i < days; i += 1) {
    points.push({
      date: `D${i + 1}`,
      revenue: Math.round(baseRevenue + i * (days === 7 ? 220 : 95) + (i % 3) * 35),
      creators: Math.round(baseCreators + i * (days === 7 ? 6 : 4)),
      engagement: Math.min(95, Math.round(baseEngagement + i * (days === 7 ? 0.8 : 0.45))),
    });
  }

  return points;
};

const CreatorGrowthAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [trendRange, setTrendRange] = useState(7);
  const performanceData = useMemo(() => buildPerformanceData(trendRange), [trendRange]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-sm">← Back</button>
          <span className="text-gray-600">|</span>
          <span className="text-gray-300 text-sm">Creator Growth Analytics</span>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Creator Growth Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Tier progression, earnings attribution, and ML-powered coaching recommendations</p>
        </div>

        {/* Tier progression */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Tier Progression Timeline</h2>
          <div className="flex items-center gap-2">
            {TIERS?.map((tier, i) => (
              <React.Fragment key={i}>
                <div className="flex-1 bg-gray-800 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">{tier?.icon}</div>
                  <p className="font-bold" style={{ color: tier?.color }}>{tier?.name}</p>
                  <p className="text-white text-lg font-bold mt-1">{tier?.count?.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">creators</p>
                  <p className="text-green-400 text-sm mt-1">${tier?.revenue?.toLocaleString()}/mo</p>
                </div>
                {i < TIERS?.length - 1 && <div className="text-gray-600 text-2xl">→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Earnings by carousel type */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[{ type: 'Horizontal Snap', revenue: 18420, growth: 14.2, icon: '⇔' }, { type: 'Vertical Stack', revenue: 15680, growth: 22.8, icon: '⇕' }, { type: 'Gradient Flow', revenue: 11240, growth: 31.4, icon: '🌈' }]?.map((c, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-3xl mb-2">{c?.icon}</div>
              <p className="text-white font-bold">{c?.type}</p>
              <p className="text-2xl font-bold text-white mt-2">${c?.revenue?.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+{c?.growth}% growth</p>
            </div>
          ))}
        </div>

        {/* Historical Performance Trending 7/30-day */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Historical Performance Trending</h2>
            <div className="flex gap-2">
              {[7, 30]?.map(d => (
                <button
                  key={d}
                  onClick={() => setTrendRange(d)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    trendRange === d ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {d}-Day
                </button>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs">Revenue Trend</p>
              <p className="text-green-400 font-bold flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" /> +{performanceData?.length ? ((performanceData[performanceData?.length - 1]?.revenue - performanceData[0]?.revenue) / (performanceData[0]?.revenue || 1) * 100)?.toFixed(1) : 0}%
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs">Creators</p>
              <p className="text-white font-bold">{performanceData?.[performanceData?.length - 1]?.creators || 0}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-gray-400 text-xs">Engagement</p>
              <p className="text-white font-bold">{performanceData?.[performanceData?.length - 1]?.engagement || 0}%</p>
            </div>
          </div>
        </div>

        {/* Claude coaching panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">ML-Powered Claude Coaching Recommendations</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Optimize posting frequency', detail: 'Creators posting 3-5x/week see 2.3x higher tier progression rates', priority: 'High' },
              { title: 'Diversify carousel types', detail: 'Single-type creators earn 40% less than multi-type creators at same tier', priority: 'High' },
              { title: 'Template marketplace entry', detail: 'Gold+ creators who publish templates earn avg $340/mo additional revenue', priority: 'Medium' },
              { title: 'Sponsorship readiness', detail: '89 creators are within 2 weeks of qualifying for direct sponsorship deals', priority: 'Medium' }
            ]?.map((rec, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">{rec?.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${rec?.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{rec?.priority}</span>
                </div>
                <p className="text-gray-400 text-sm">{rec?.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorGrowthAnalyticsDashboard;
