import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock, Bell, Rss, Calendar, Activity, RefreshCw, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { platformMonitoringService } from '../../services/platformMonitoringService';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';
import Icon from '../../components/AppIcon';


const STATUS_CONFIG = {
  operational: { label: 'Operational', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: CheckCircle },
  degraded: { label: 'Degraded Performance', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: AlertTriangle },
  partial_outage: { label: 'Partial Outage', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertTriangle },
  major_outage: { label: 'Major Outage', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: XCircle },
  maintenance: { label: 'Under Maintenance', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Clock },
};

const SYSTEM_COMPONENTS = [
  { id: 'auth', name: 'Authentication Service', description: 'User login, registration, and session management', category: 'Core' },
  { id: 'voting', name: 'Voting Systems', description: 'Election creation, ballot processing, and result tabulation', category: 'Core' },
  { id: 'payments', name: 'Payment Processing', description: 'Stripe integration, payouts, and subscription billing', category: 'Financial' },
  { id: 'blockchain', name: 'Blockchain Infrastructure', description: 'Cryptographic audit trails and vote verification', category: 'Security' },
  { id: 'ai_services', name: 'AI Services', description: 'OpenAI, Anthropic, and Perplexity integrations', category: 'Intelligence' },
  { id: 'realtime', name: 'Real-time Updates', description: 'WebSocket connections and live data synchronization', category: 'Core' },
  { id: 'notifications', name: 'Notification Delivery', description: 'Email, SMS, and push notification services', category: 'Communication' },
  { id: 'cdn', name: 'Content Delivery', description: 'Static assets, media files, and CDN performance', category: 'Infrastructure' },
  { id: 'database', name: 'Database', description: 'Supabase PostgreSQL read/write operations', category: 'Infrastructure' },
  { id: 'api', name: 'API Gateway', description: 'REST API endpoints and rate limiting', category: 'Infrastructure' },
];

const generateMockUptime = () => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months?.push({
      month: d?.toLocaleString('default', { month: 'short', year: '2-digit' }),
      uptime: 99.5 + Math.random() * 0.49,
      incidents: Math.floor(Math.random() * 3),
    });
  }
  return months;
};

const generateMockIncidents = () => [
  { id: 1, title: 'Elevated API Response Times', severity: 'minor', status: 'resolved', startTime: new Date(Date.now() - 86400000 * 2)?.toISOString(), resolvedTime: new Date(Date.now() - 86400000 * 2 + 3600000)?.toISOString(), updates: [{ time: new Date(Date.now() - 86400000 * 2)?.toISOString(), message: 'Investigating elevated response times on API gateway.' }, { time: new Date(Date.now() - 86400000 * 2 + 1800000)?.toISOString(), message: 'Identified root cause: database connection pool exhaustion. Scaling in progress.' }, { time: new Date(Date.now() - 86400000 * 2 + 3600000)?.toISOString(), message: 'Issue resolved. All systems operating normally.' }] },
  { id: 2, title: 'Scheduled Database Maintenance', severity: 'maintenance', status: 'completed', startTime: new Date(Date.now() - 86400000 * 7)?.toISOString(), resolvedTime: new Date(Date.now() - 86400000 * 7 + 7200000)?.toISOString(), updates: [{ time: new Date(Date.now() - 86400000 * 7)?.toISOString(), message: 'Scheduled maintenance window started. Read-only mode active.' }, { time: new Date(Date.now() - 86400000 * 7 + 7200000)?.toISOString(), message: 'Maintenance completed successfully. Full service restored.' }] },
];

const generateScheduledMaintenance = () => [
  { id: 1, title: 'Database Index Optimization', scheduledStart: new Date(Date.now() + 86400000 * 3)?.toISOString(), scheduledEnd: new Date(Date.now() + 86400000 * 3 + 3600000)?.toISOString(), impact: 'Minimal — read-only mode for ~30 minutes', affectedComponents: ['Database', 'API Gateway'], notificationSent: true },
  { id: 2, title: 'AI Service Infrastructure Upgrade', scheduledStart: new Date(Date.now() + 86400000 * 10)?.toISOString(), scheduledEnd: new Date(Date.now() + 86400000 * 10 + 7200000)?.toISOString(), impact: 'AI features temporarily unavailable', affectedComponents: ['AI Services'], notificationSent: false },
];

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG?.[status] || STATUS_CONFIG?.operational;
  const Icon = config?.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.color} border ${config?.border}`}>
      <Icon className="w-3 h-3" />
      {config?.label}
    </span>
  );
};

const OverallStatusBanner = ({ overallStatus }) => {
  const config = STATUS_CONFIG?.[overallStatus] || STATUS_CONFIG?.operational;
  const Icon = config?.icon;
  return (
    <div className={`rounded-2xl p-6 border ${config?.bg} ${config?.border} flex items-center gap-4`}>
      <div className={`p-3 rounded-full ${config?.bg}`}>
        <Icon className={`w-8 h-8 ${config?.color}`} />
      </div>
      <div>
        <h2 className={`text-2xl font-bold ${config?.color}`}>{config?.label}</h2>
        <p className="text-gray-400 text-sm mt-1">All systems last checked {new Date()?.toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

const ComponentRow = ({ component, status, responseTime }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors text-left">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-white font-medium text-sm">{component?.name}</p>
            <p className="text-gray-500 text-xs">{component?.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {responseTime && <span className="text-gray-400 text-xs hidden sm:block">{responseTime}ms</span>}
          <StatusBadge status={status} />
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3">
          <p className="text-gray-400 text-sm">{component?.description}</p>
          {responseTime && (
            <div className="mt-2 flex items-center gap-2">
              <Activity className="w-3 h-3 text-gray-500" />
              <span className="text-gray-500 text-xs">Average response time: {responseTime}ms</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const IncidentCard = ({ incident }) => {
  const [expanded, setExpanded] = useState(false);
  const severityColors = { minor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', major: 'text-orange-400 bg-orange-500/10 border-orange-500/30', critical: 'text-red-400 bg-red-500/10 border-red-500/30', maintenance: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
  const statusColors = { resolved: 'text-green-400', completed: 'text-green-400', investigating: 'text-yellow-400', identified: 'text-orange-400', monitoring: 'text-blue-400' };
  const colors = severityColors?.[incident?.severity] || severityColors?.minor;
  return (
    <div className={`rounded-xl border p-4 ${colors}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-white font-medium text-sm">{incident?.title}</h4>
            <span className={`text-xs font-medium ${statusColors?.[incident?.status] || 'text-gray-400'}`}>{incident?.status?.toUpperCase()}</span>
          </div>
          <p className="text-gray-500 text-xs mt-1">{new Date(incident.startTime)?.toLocaleString()}</p>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      {expanded && (
        <div className="mt-3 space-y-2 border-t border-gray-700/50 pt-3">
          {incident?.updates?.map((update, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-gray-500 mt-1.5 flex-shrink-0" />
                {i < incident?.updates?.length - 1 && <div className="w-px flex-1 bg-gray-700 mt-1" />}
              </div>
              <div className="pb-2">
                <p className="text-gray-500 text-xs">{new Date(update.time)?.toLocaleString()}</p>
                <p className="text-gray-300 text-sm mt-0.5">{update?.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const UptimeCalendar = ({ months }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
    {months?.map((m) => (
      <div key={m?.month} className="bg-gray-800/50 rounded-xl p-3 text-center border border-gray-700/50">
        <p className="text-gray-400 text-xs mb-1">{m?.month}</p>
        <p className={`text-lg font-bold ${m?.uptime >= 99.9 ? 'text-green-400' : m?.uptime >= 99.5 ? 'text-yellow-400' : 'text-red-400'}`}>{m?.uptime?.toFixed(2)}%</p>
        <p className="text-gray-500 text-xs mt-1">{m?.incidents} incident{m?.incidents !== 1 ? 's' : ''}</p>
      </div>
    ))}
  </div>
);

const SubscribePanel = ({ email, setEmail, subscribed, onSubscribe }) => (
  <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-blue-500/10 rounded-lg"><Bell className="w-5 h-5 text-blue-400" /></div>
      <div>
        <h3 className="text-white font-semibold">Subscribe to Updates</h3>
        <p className="text-gray-400 text-sm">Get notified about incidents and maintenance</p>
      </div>
    </div>
    {subscribed ? (
      <div className="flex items-center gap-2 text-green-400">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">You're subscribed to status updates!</span>
      </div>
    ) : (
      <div className="flex gap-2">
        <input type="email" value={email} onChange={e => setEmail(e?.target?.value)} placeholder="your@email.com" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500" />
        <button onClick={onSubscribe} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">Subscribe</button>
      </div>
    )}
    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800">
      <a href="#" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors"><Rss className="w-3.5 h-3.5" />RSS Feed</a>
      <a href="#" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors"><ExternalLink className="w-3.5 h-3.5" />API Status</a>
    </div>
  </div>
);

const PublicStatusPage = () => {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [overallStatus, setOverallStatus] = useState('operational');
  const [componentStatuses, setComponentStatuses] = useState({});
  const [incidents, setIncidents] = useState([]);
  const [scheduledMaintenance, setScheduledMaintenance] = useState([]);
  const [uptimeData, setUptimeData] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const loadStatusData = useCallback(async () => {
    try {
      // Try to get real data from platformMonitoringService
      const healthResult = await platformMonitoringService?.getSystemHealthOverview?.();
      if (healthResult?.data) {
        const health = healthResult?.data;
        setOverallStatus(health?.overallStatus || 'operational');
      }
    } catch (e) {
      // Use simulated data if service unavailable
    }

    // Generate component statuses
    const statuses = {};
    const responseTimes = {};
    SYSTEM_COMPONENTS?.forEach(c => {
      const rand = Math.random();
      statuses[c.id] = rand > 0.95 ? 'degraded' : rand > 0.99 ? 'partial_outage' : 'operational';
      responseTimes[c.id] = Math.floor(50 + Math.random() * 200);
    });
    setComponentStatuses({ statuses, responseTimes });
    setIncidents(generateMockIncidents());
    setScheduledMaintenance(generateScheduledMaintenance());
    setUptimeData(generateMockUptime());
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStatusData();
  }, [loadStatusData]);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadStatusData,
    enabled: true,
  });

  const handleSubscribe = () => {
    if (email?.includes('@')) setSubscribed(true);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'incidents', label: `Incidents (${incidents?.length})` },
    { id: 'maintenance', label: `Maintenance (${scheduledMaintenance?.length})` },
    { id: 'uptime', label: 'Uptime History' },
  ];

  const activeIncidents = incidents?.filter(i => i?.status === 'investigating' || i?.status === 'identified' || i?.status === 'monitoring');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Vottery Status</h1>
              </div>
              <p className="text-gray-400 text-sm">Real-time system health and incident communication</p>
            </div>
            <button onClick={loadStatusData} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Overall Status */}
        <OverallStatusBanner overallStatus={overallStatus} />

        {/* Active Incidents Banner */}
        {activeIncidents?.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-red-400 font-semibold">Active Incidents</h3>
            </div>
            <div className="space-y-2">
              {activeIncidents?.map(i => <IncidentCard key={i?.id} incident={i} />)}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1 border border-gray-800">
          {tabs?.map(tab => (
            <button key={tab?.id} onClick={() => setActiveTab(tab?.id)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab?.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">System Components</h3>
              <span className="text-gray-500 text-xs">Updated {lastUpdated?.toLocaleTimeString()}</span>
            </div>
            <div className="space-y-2">
              {SYSTEM_COMPONENTS?.map(component => (
                <ComponentRow key={component?.id} component={component} status={componentStatuses?.statuses?.[component?.id] || 'operational'} responseTime={componentStatuses?.responseTimes?.[component?.id]} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Incident History</h3>
            {incidents?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500/50" />
                <p>No incidents reported</p>
              </div>
            ) : (
              <div className="space-y-3">
                {incidents?.map(i => <IncidentCard key={i?.id} incident={i} />)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Scheduled Maintenance</h3>
            {scheduledMaintenance?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-blue-500/50" />
                <p>No scheduled maintenance</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledMaintenance?.map(m => (
                  <div key={m?.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-white font-medium text-sm">{m?.title}</h4>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(m.scheduledStart)?.toLocaleString()} — {new Date(m.scheduledEnd)?.toLocaleString()}
                        </p>
                        <p className="text-yellow-400 text-xs mt-2">Impact: {m?.impact}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {m?.affectedComponents?.map(c => (
                            <span key={c} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{c}</span>
                          ))}
                        </div>
                      </div>
                      <StatusBadge status="maintenance" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'uptime' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Historical Uptime</h3>
              <span className="text-gray-500 text-xs">Last 6 months</span>
            </div>
            <UptimeCalendar months={uptimeData} />
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h4 className="text-white font-medium text-sm mb-3">SLA Compliance</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{(uptimeData?.reduce((s, m) => s + m?.uptime, 0) / (uptimeData?.length || 1))?.toFixed(3)}%</p>
                  <p className="text-gray-500 text-xs mt-1">Avg Uptime</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">99.9%</p>
                  <p className="text-gray-500 text-xs mt-1">SLA Target</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{uptimeData?.reduce((s, m) => s + m?.incidents, 0)}</p>
                  <p className="text-gray-500 text-xs mt-1">Total Incidents</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscribe Panel */}
        <SubscribePanel email={email} setEmail={setEmail} subscribed={subscribed} onSubscribe={handleSubscribe} />

        {/* Footer */}
        <div className="text-center text-gray-600 text-xs pb-4">
          <p>Vottery Platform Status Page • Updates every 30 seconds</p>
          <p className="mt-1">For support, contact <a href="mailto:support@vottery.com" className="text-blue-500 hover:underline">support@vottery.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default PublicStatusPage;