/**
 * Admin Screen 6: Social Engagement Analytics Dashboard
 * Route: /admin/social-engagement-analytics
 * Role: admin only
 */
import React, { useState } from 'react';
import AdminPageLayout from '../../components/AdminPageLayout';
import Icon from '../../components/AppIcon';

const CONTENT_TYPES = [
  { type: 'Posts',     icon: 'FileText',    color: '#3b82f6',  engagementRate: 8.4,  impressions: 284000, interactions: 23856, avgTime: '1m 42s', topFormat: 'Image + Text' },
  { type: 'Elections', icon: 'Vote',        color: '#8b5cf6',  engagementRate: 22.7, impressions: 198000, interactions: 44946, avgTime: '4m 12s', topFormat: 'Multi-candidate' },
  { type: 'Jolts',     icon: 'Zap',         color: '#f97316',  engagementRate: 31.2, impressions: 156000, interactions: 48672, avgTime: '2m 55s', topFormat: 'Vertical Video' },
  { type: 'Comments',  icon: 'MessageCircle', color: '#10b981', engagementRate: 5.1, impressions: 120000, interactions: 6120,  avgTime: '0m 32s', topFormat: 'Thread reply' },
  { type: 'Carousels', icon: 'Layers',      color: '#ec4899',  engagementRate: 18.3, impressions: 89000,  interactions: 16287, avgTime: '3m 08s', topFormat: '3-slide' },
];

const TOP_CONTENT = [
  { rank: 1, title: 'Best Restaurant in Lagos 2026 — Vote Now!', type: 'Election', engRate: 38.4, votes: 12847, creator: 'FoodieElections', created: '2d ago', trend: 'up' },
  { rank: 2, title: 'Street art transformation of Surulere — before/after Jolt', type: 'Jolt', engRate: 34.1, votes: 0, creator: 'LagosCreates', created: '1d ago', trend: 'up' },
  { rank: 3, title: 'Tech Startup of the Year Nigeria — 12 candidates', type: 'Election', engRate: 29.8, votes: 9234, creator: 'TechNG', created: '3d ago', trend: 'stable' },
  { rank: 4, title: 'My experience voting on Vottery for the first time 🗳️', type: 'Post', engRate: 21.6, votes: 0, creator: 'user_m88', created: '5h ago', trend: 'up' },
  { rank: 5, title: 'Street food vs restaurant — the great Lagos debate', type: 'Carousel', engRate: 19.2, votes: 0, creator: 'FoodNG', created: '8h ago', trend: 'up' },
  { rank: 6, title: 'Introducing my new election series: African Tech Icons', type: 'Post', engRate: 17.4, votes: 0, creator: 'creator_ux8', created: '1d ago', trend: 'stable' },
];

const WEEKLY_ENG = [
  { day: 'Mon', posts: 7.8, elections: 21.4, jolts: 28.9 },
  { day: 'Tue', posts: 8.1, elections: 22.1, jolts: 30.2 },
  { day: 'Wed', posts: 7.9, elections: 21.8, jolts: 29.8 },
  { day: 'Thu', posts: 8.6, elections: 23.4, jolts: 32.1 },
  { day: 'Fri', posts: 9.2, elections: 24.1, jolts: 33.8 },
  { day: 'Sat', posts: 10.1, elections: 25.3, jolts: 35.4 },
  { day: 'Sun', posts: 8.4, elections: 22.7, jolts: 31.2 },
];

function DonutChart({ segments }) {
  const total = segments.reduce((s, c) => s + c.value, 0);
  let cumulative = 0;
  const r = 40, cx = 50, cy = 50, strokeW = 14;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-32 h-32">
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const offset = circ - pct * circ;
          const rotate = (cumulative / total) * 360 - 90;
          cumulative += seg.value;
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color}
              strokeWidth={strokeW} strokeDasharray={`${pct * circ} ${circ}`}
              style={{ transform: `rotate(${rotate}deg)`, transformOrigin: '50% 50%' }}
            />
          );
        })}
        <text x="50" y="53" textAnchor="middle" className="text-[12px] font-bold" fill="currentColor" fontSize="11" fontWeight="bold">
          {total.toFixed(0)}%
        </text>
        <text x="50" y="62" textAnchor="middle" fill="#9ca3af" fontSize="7">avg eng.</text>
      </svg>
      <div className="space-y-2">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-muted-foreground">{seg.label}</span>
            <span className="text-xs font-semibold text-foreground ml-auto">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SocialEngagementAnalyticsDashboard = () => {
  const [sortBy, setSortBy] = useState('engRate');

  const sortedContent = [...TOP_CONTENT].sort((a, b) => b[sortBy] - a[sortBy]);

  const donutData = CONTENT_TYPES.map(c => ({ label: c.type, value: parseFloat(c.engagementRate.toFixed(1)), color: c.color }));

  return (
    <AdminPageLayout
      title="Social Engagement Analytics Dashboard"
      description="Engagement rates per content type, top performing content, and weekly engagement patterns."
      icon="TrendingUp"
      iconColor="#8b5cf6"
    >
      {/* Content type cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {CONTENT_TYPES.map(ct => (
          <div key={ct.type} className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${ct.color}18` }}>
                <Icon name={ct.icon} size={15} color={ct.color} />
              </div>
              <span className="text-sm font-semibold text-foreground">{ct.type}</span>
            </div>
            <p className="text-2xl font-bold font-data" style={{ color: ct.color }}>{ct.engagementRate}%</p>
            <p className="text-xs text-muted-foreground mb-2">engagement rate</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impressions</span>
                <span className="text-foreground font-medium">{(ct.impressions / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interactions</span>
                <span className="text-foreground font-medium">{ct.interactions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Time</span>
                <span className="text-foreground font-medium">{ct.avgTime}</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground">Top: {ct.topFormat}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Donut comparison */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Engagement Rate by Content Type</h3>
          <DonutChart segments={donutData} />
          <p className="text-xs text-muted-foreground mt-4">
            Jolts lead with <strong>31.2%</strong> engagement — 3.7× higher than Posts. Elections drive the highest absolute interaction volume.
          </p>
        </div>

        {/* Weekly pattern */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Weekly Engagement Pattern (%)</h3>
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            {[{ label: 'Posts', color: '#3b82f6' }, { label: 'Elections', color: '#8b5cf6' }, { label: 'Jolts', color: '#f97316' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-1.5 rounded-sm" style={{ background: l.color }} />
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {WEEKLY_ENG.map(day => (
              <div key={day.day} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-7">{day.day}</span>
                <div className="flex-1 flex items-center gap-1">
                  {[{ v: day.posts, c: '#3b82f6' }, { v: day.elections, c: '#8b5cf6' }, { v: day.jolts, c: '#f97316' }].map((bar, i) => (
                    <div key={i} className="h-4 rounded-sm transition-all duration-500"
                      style={{ width: `${(bar.v / 40) * 100}%`, maxWidth: '33%', background: bar.c, opacity: 0.8 }} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{day.jolts}%</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Weekends show highest engagement — especially for Jolts (+15% vs weekdays)</p>
        </div>
      </div>

      {/* Top performing content */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-heading font-semibold text-foreground">Top Performing Content (7 days)</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs border border-border rounded-lg px-2 py-1 bg-card text-foreground"
            >
              <option value="engRate">Engagement Rate</option>
              <option value="votes">Votes</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-border">
          {sortedContent.map(item => {
            const ct = CONTENT_TYPES.find(c => c.type === item.type) || CONTENT_TYPES[0];
            return (
              <div key={item.rank} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                <span className="text-lg font-bold text-muted-foreground w-6 text-center">{item.rank}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${ct.color}18` }}>
                  <Icon name={ct.icon} size={15} color={ct.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium" style={{ background: `${ct.color}18`, color: ct.color }}>{item.type}</span>
                    <span>by @{item.creator}</span>
                    <span>{item.created}</span>
                    {item.votes > 0 && <span>{item.votes.toLocaleString()} votes</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: ct.color }}>{item.engRate}%</p>
                  <p className="text-xs text-muted-foreground">eng. rate</p>
                </div>
                <Icon name={item.trend === 'up' ? 'TrendingUp' : 'Minus'} size={16}
                  color={item.trend === 'up' ? '#10b981' : '#9ca3af'} />
              </div>
            );
          })}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default SocialEngagementAnalyticsDashboard;
