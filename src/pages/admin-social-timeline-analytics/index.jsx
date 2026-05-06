/**
 * Admin Screen 7: Social Timeline Analytics Dashboard
 * Route: /admin/social-timeline-analytics
 * Role: admin only
 */
import React, { useState } from 'react';
import AdminPageLayout from '../../components/AdminPageLayout';
import Icon from '../../components/AppIcon';

const FEED_METRICS = [
  { label: 'Avg Feed Load Time',   value: '320ms',  trend: '-12ms vs yesterday', color: '#10b981', icon: 'Zap',          good: true  },
  { label: 'Feed Scroll Depth',    value: '68.4%',  trend: '+2.1% vs last week',  color: '#3b82f6', icon: 'ArrowDown',    good: true  },
  { label: 'Post Completion Rate', value: '44.2%',  trend: '+5.6% vs last week',  color: '#8b5cf6', icon: 'CheckSquare',  good: true  },
  { label: 'Feed Bounce Rate',     value: '12.3%',  trend: '-1.4% vs last week',  color: '#f59e0b', icon: 'LogOut',       good: true  },
  { label: 'Avg Session Duration', value: '6m 42s', trend: '+0m 18s vs yesterday', color: '#ec4899', icon: 'Clock',       good: true  },
  { label: 'Content Return Rate',  value: '37.8%',  trend: 'Users returning to same content', color: '#14b8a6', icon: 'RefreshCw', good: true },
];

const CONTENT_MIX = [
  { type: 'Elections',  pct: 34, impressions: 198000, color: '#8b5cf6' },
  { type: 'Posts',      pct: 28, impressions: 163000, color: '#3b82f6' },
  { type: 'Jolts',      pct: 22, impressions: 128000, color: '#f97316' },
  { type: 'Carousels',  pct: 10, impressions: 58000,  color: '#ec4899' },
  { type: 'Ads',        pct: 6,  impressions: 35000,  color: '#10b981' },
];

const ALGO_SIGNALS = [
  { signal: 'Personalized Interest Match', weight: 32, trend: 'up', desc: "Content matching user's voted categories" },
  { signal: 'Social Graph (Friends Activity)', weight: 24, trend: 'up', desc: 'Content liked/shared by connections' },
  { signal: 'Recency (< 6h)',                weight: 18, trend: 'stable', desc: 'Fresh content boost' },
  { signal: 'Engagement Velocity',           weight: 14, trend: 'down', desc: 'Likes/comments per minute after posting' },
  { signal: 'Creator Reputation Score',      weight: 8,  trend: 'up', desc: 'Verified + high-rep creators boosted' },
  { signal: 'Geographic Relevance',          weight: 4,  trend: 'stable', desc: 'Country/region matching' },
];

const HOURLY_VIEWS = [
  { hour: '00', views: 12400 }, { hour: '02', views: 8200 }, { hour: '04', views: 6100 },
  { hour: '06', views: 14800 }, { hour: '08', views: 28400 }, { hour: '10', views: 38200 },
  { hour: '12', views: 42100 }, { hour: '14', views: 39800 }, { hour: '16', views: 41200 },
  { hour: '18', views: 44800 }, { hour: '20', views: 48200 }, { hour: '22', views: 32100 },
];

function HourlyChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.views));
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map(d => {
        const h = Math.max(4, Math.round((d.views / maxVal) * 88));
        const isPeak = d.views === maxVal;
        return (
          <div key={d.hour} className="flex-1 flex flex-col items-center gap-1" title={`${d.hour}:00 — ${d.views.toLocaleString()} views`}>
            <div className="w-full rounded-t-sm transition-all duration-500"
              style={{ height: `${h}px`, background: isPeak ? '#3b82f6' : '#93c5fd', opacity: isPeak ? 1 : 0.7 }} />
            <span className="text-[9px] text-muted-foreground">{d.hour}</span>
          </div>
        );
      })}
    </div>
  );
}

const SocialTimelineAnalyticsDashboard = () => {
  const [selectedSignal, setSelectedSignal] = useState(null);

  return (
    <AdminPageLayout
      title="Social Timeline Analytics Dashboard"
      description="Feed performance metrics, content distribution, and timeline algorithm effectiveness."
      icon="LayoutList"
      iconColor="#14b8a6"
    >
      {/* Feed Performance KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {FEED_METRICS.map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${m.color}18` }}>
              <Icon name={m.icon} size={18} color={m.color} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
              <p className="text-xl font-bold text-foreground font-data">{m.value}</p>
              <p className="text-xs text-green-600 mt-0.5">↑ {m.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Content Distribution */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Content Mix in Feed</h3>
          <div className="space-y-3">
            {CONTENT_MIX.map(item => (
              <div key={item.type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{item.type}</span>
                  <span className="text-muted-foreground">{item.pct}% · {(item.impressions / 1000).toFixed(0)}K</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Elections dominate at 34% — algorithm prioritizing high-engagement content correctly.
          </p>
        </div>

        {/* Hourly Traffic */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-semibold text-foreground">Feed Views by Hour (Today)</h3>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">Peak: 20:00 — 48.2K</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">UTC+1 (Lagos time)</p>
          <HourlyChart data={HOURLY_VIEWS} />
        </div>
      </div>

      {/* Algorithm Signals */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <div className="p-4 border-b border-border">
          <h3 className="font-heading font-semibold text-foreground">Feed Algorithm Signal Weights</h3>
          <p className="text-xs text-muted-foreground">Current weights used to rank content in each user's timeline</p>
        </div>
        <div className="p-4 space-y-4">
          {ALGO_SIGNALS.map(sig => (
            <div
              key={sig.signal}
              className={`cursor-pointer transition-all duration-200 rounded-lg p-3 ${selectedSignal === sig.signal ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'}`}
              onClick={() => setSelectedSignal(prev => prev === sig.signal ? null : sig.signal)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name={sig.trend === 'up' ? 'TrendingUp' : sig.trend === 'down' ? 'TrendingDown' : 'Minus'} size={14}
                    color={sig.trend === 'up' ? '#10b981' : sig.trend === 'down' ? '#ef4444' : '#9ca3af'} />
                  <span className="text-sm font-medium text-foreground">{sig.signal}</span>
                </div>
                <span className="text-sm font-bold text-foreground font-data">{sig.weight}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="h-2 rounded-full bg-primary transition-all duration-700" style={{ width: `${sig.weight}%` }} />
              </div>
              {selectedSignal === sig.signal && (
                <p className="text-xs text-muted-foreground mt-2">{sig.desc}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feed Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: '✅ Algorithm Performing Well', desc: 'Personalization signals driving +22% higher engagement vs non-personalized baseline. Click-through rate above target.', color: '#10b981' },
          { title: '⚠️ Optimize Recency Signal', desc: 'Content older than 12h still ranking top 3 for 18% of users. Consider reducing recency decay window to 4h.', color: '#f59e0b' },
          { title: '📊 Recommendation', desc: 'Increase Social Graph weight from 24% → 28% to improve feed freshness. A/B test suggested.', color: '#3b82f6' },
        ].map(item => (
          <div key={item.title} className="border rounded-xl p-5" style={{ borderColor: `${item.color}30`, background: `${item.color}08` }}>
            <h4 className="text-sm font-semibold text-foreground mb-2">{item.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </AdminPageLayout>
  );
};

export default SocialTimelineAnalyticsDashboard;
