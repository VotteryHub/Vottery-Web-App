/**
 * Admin Screen 9: Slack Incident Notifications Dashboard
 * Route: /admin/slack-incident-notifications
 * Role: admin only
 */
import React, { useState, useEffect } from 'react';
import AdminPageLayout from '../../components/AdminPageLayout';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';

const MOCK_INCIDENTS = [
  { id: 'INC-0042', title: 'Supabase connection pool exhausted',         severity: 'critical', service: 'Database', status: 'resolved',  started_at: new Date(Date.now() - 7200000).toISOString(), resolved_at: new Date(Date.now() - 6480000).toISOString(), duration: '12m', slack_channel: '#incidents-critical', ack_by: 'on-call-eng', description: 'Connection pool hit 95% capacity. Auto-scaling triggered. Root cause: traffic spike from election results announcement.' },
  { id: 'INC-0041', title: 'Push notification delivery rate drop to 74%', severity: 'high',     service: 'Notifications', status: 'resolved',  started_at: new Date(Date.now() - 18000000).toISOString(), resolved_at: new Date(Date.now() - 16200000).toISOString(), duration: '30m', slack_channel: '#incidents-high', ack_by: 'notif-team', description: 'Telnyx SMS provider returned 503 errors. Failover to backup provider restored service.' },
  { id: 'INC-0040', title: 'Stripe webhook delivery failure',             severity: 'high',     service: 'Payments', status: 'investigating', started_at: new Date(Date.now() - 3600000).toISOString(), resolved_at: null, duration: '—', slack_channel: '#incidents-high', ack_by: 'payments-team', description: 'Stripe is retrying failed webhook deliveries. No payment data loss. Payments are still processing.' },
  { id: 'INC-0039', title: 'AI content moderation API latency spike',    severity: 'medium',   service: 'AI Services', status: 'resolved',  started_at: new Date(Date.now() - 86400000).toISOString(), resolved_at: new Date(Date.now() - 82800000).toISOString(), duration: '1h', slack_channel: '#incidents-medium', ack_by: 'ai-team', description: 'OpenAI API latency exceeded 8s for moderation calls. Fallback to Anthropic Claude engaged.' },
  { id: 'INC-0038', title: 'CDN cache miss rate elevated (34%)',          severity: 'medium',   service: 'CDN', status: 'resolved',  started_at: new Date(Date.now() - 172800000).toISOString(), resolved_at: new Date(Date.now() - 169200000).toISOString(), duration: '1h', slack_channel: '#incidents-medium', ack_by: 'infra-team', description: 'Vercel CDN cache invalidation after deployment caused temporary slowdown. Resolved after cache warmup.' },
  { id: 'INC-0037', title: 'Blockchain audit node sync delay (2h behind)', severity: 'low',    service: 'Blockchain', status: 'resolved', started_at: new Date(Date.now() - 259200000).toISOString(), resolved_at: new Date(Date.now() - 255600000).toISOString(), duration: '1h', slack_channel: '#incidents-low', ack_by: 'blockchain-team', description: 'Node fell behind due to network congestion. Caught up automatically after peer reconnect.' },
  { id: 'INC-0036', title: 'User authentication latency P99 > 3s',        severity: 'medium',  service: 'Auth', status: 'resolved',  started_at: new Date(Date.now() - 345600000).toISOString(), resolved_at: new Date(Date.now() - 342000000).toISOString(), duration: '55m', slack_channel: '#incidents-medium', ack_by: 'auth-team', description: 'Supabase auth service slowdown due to JWT validation queue buildup. Resolved by scaling auth workers.' },
];

const SEV_CONFIG = {
  critical:     { color: '#ef4444', bg: 'bg-red-50 border-red-200',    badge: 'bg-red-100 text-red-700',     icon: 'AlertOctagon' },
  high:         { color: '#f97316', bg: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: 'AlertTriangle' },
  medium:       { color: '#f59e0b', bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: 'AlertCircle' },
  low:          { color: '#10b981', bg: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-700', icon: 'Info' },
};

const STATUS_CONFIG = {
  resolved:      { label: 'Resolved',      cls: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
  investigating: { label: 'Investigating', cls: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500 animate-pulse' },
  open:          { label: 'Open',          cls: 'bg-red-100 text-red-700',       dot: 'bg-red-500 animate-pulse' },
};

function IncidentCard({ incident, expanded, onToggle }) {
  const sev = SEV_CONFIG[incident.severity] || SEV_CONFIG.low;
  const statusConf = STATUS_CONFIG[incident.status] || STATUS_CONFIG.open;
  const startTime = new Date(incident.started_at);
  const elapsed = Math.round((Date.now() - startTime.getTime()) / 60000);
  const timeLabel = elapsed < 60 ? `${elapsed}m ago` : elapsed < 1440 ? `${Math.round(elapsed / 60)}h ago` : `${Math.round(elapsed / 1440)}d ago`;

  return (
    <div className={`border rounded-xl mb-3 overflow-hidden transition-all duration-200 ${sev.bg}`}>
      <button className="w-full text-left p-4" onClick={onToggle}>
        <div className="flex items-start gap-3 flex-wrap">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${sev.color}18` }}>
            <Icon name={sev.icon} size={16} color={sev.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <code className="text-xs font-mono font-semibold text-muted-foreground">{incident.id}</code>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sev.badge}`}>{incident.severity.toUpperCase()}</span>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusConf.cls}`}>{statusConf.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">{timeLabel}</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{incident.title}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><Icon name="Server" size={11} /> {incident.service}</span>
              <span className="flex items-center gap-1"><Icon name="Hash" size={11} /> {incident.slack_channel}</span>
              <span>Acked: <strong>{incident.ack_by}</strong></span>
              <span>Duration: <strong>{incident.duration}</strong></span>
            </div>
          </div>
          <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-border/50 pt-3">
          <p className="text-sm text-foreground mb-3">{incident.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Started</p>
              <p className="font-medium text-foreground">{new Date(incident.started_at).toLocaleTimeString()}</p>
            </div>
            {incident.resolved_at && (
              <div>
                <p className="text-muted-foreground">Resolved</p>
                <p className="font-medium text-foreground">{new Date(incident.resolved_at).toLocaleTimeString()}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground">Service</p>
              <p className="font-medium text-foreground">{incident.service}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Slack</p>
              <p className="font-medium text-foreground">{incident.slack_channel}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SlackIncidentNotificationsDashboard = () => {
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase?.from('platform_incidents')?.select('*')?.order('started_at', { ascending: false })?.limit(30);
        if (data?.length) setIncidents(data);
      } catch { /* use mock */ }
      setLoading(false);
    })();
  }, []);

  const filtered = filter === 'all' ? incidents : filter === 'active'
    ? incidents.filter(i => i.status !== 'resolved')
    : incidents.filter(i => i.severity === filter);

  const counts = {
    active:   incidents.filter(i => i.status !== 'resolved').length,
    critical: incidents.filter(i => i.severity === 'critical').length,
    high:     incidents.filter(i => i.severity === 'high').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
  };

  const TABS = [
    { id: 'all',      label: 'All',      count: incidents.length },
    { id: 'active',   label: '🔴 Active', count: counts.active },
    { id: 'critical', label: 'Critical', count: counts.critical },
    { id: 'high',     label: 'High',     count: counts.high },
  ];

  return (
    <AdminPageLayout
      title="Slack Incident Notifications Dashboard"
      description="Internal incident log: platform errors, service downtime, critical alerts with severity levels and resolution status."
      icon="Bell"
      iconColor="#8b5cf6"
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Incidents',  value: counts.active,   color: '#ef4444', icon: 'AlertOctagon', sub: 'Require attention' },
          { label: 'Critical (7d)',     value: counts.critical, color: '#f97316', icon: 'Flame',        sub: 'Incidents this week' },
          { label: 'Resolved (7d)',     value: counts.resolved, color: '#10b981', icon: 'CheckCircle',  sub: 'Successfully closed' },
          { label: 'Avg MTTR',          value: '28m',           color: '#3b82f6', icon: 'Timer',        sub: 'Mean time to resolve' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}18` }}>
                <Icon name={kpi.icon} size={15} color={kpi.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground font-data">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Service Health Grid */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Service Health Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { service: 'Database',      status: 'operational', uptime: '99.9%' },
            { service: 'Auth',          status: 'operational', uptime: '99.8%' },
            { service: 'Payments',      status: 'degraded',    uptime: '97.2%' },
            { service: 'Notifications', status: 'operational', uptime: '99.1%' },
            { service: 'AI Services',   status: 'operational', uptime: '98.4%' },
            { service: 'CDN',           status: 'operational', uptime: '99.9%' },
            { service: 'Blockchain',    status: 'operational', uptime: '99.7%' },
          ].map(s => {
            const isOk = s.status === 'operational';
            return (
              <div key={s.service} className={`p-3 rounded-xl border text-center ${isOk ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${isOk ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                <p className="text-xs font-semibold text-foreground">{s.service}</p>
                <p className={`text-[10px] font-medium ${isOk ? 'text-green-600' : 'text-amber-600'}`}>{s.uptime}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incident Log */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-heading font-semibold text-foreground">Incident Log</h3>
          <div className="flex gap-1 flex-wrap">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filter === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {tab.label} <span className="opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="CheckCircle" size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No incidents in this view</p>
            </div>
          ) : (
            filtered.map(inc => (
              <IncidentCard
                key={inc.id}
                incident={inc}
                expanded={expanded === inc.id}
                onToggle={() => setExpanded(prev => prev === inc.id ? null : inc.id)}
              />
            ))
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default SlackIncidentNotificationsDashboard;
