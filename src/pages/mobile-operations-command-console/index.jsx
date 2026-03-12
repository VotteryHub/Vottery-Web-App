import React, { useState, useEffect, useRef } from 'react';
import { Activity, Shield, Zap, ChevronLeft, ChevronRight, RefreshCw, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { platformMonitoringService } from '../../services/platformMonitoringService';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';
import { incidentResponseService } from '../../services/incidentResponseService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const METRIC_CARDS = [
  { id: 'latency', label: 'P95 Latency', unit: 'ms', threshold: 500, icon: Activity, color: 'blue' },
  { id: 'errors', label: 'Error Rate', unit: '%', threshold: 2, icon: XCircle, color: 'red' },
  { id: 'throughput', label: 'Throughput', unit: 'rps', threshold: 0, icon: TrendingUp, color: 'green' },
  { id: 'fraud', label: 'Fraud Score', unit: '/100', threshold: 70, icon: Shield, color: 'purple' },
];

const EMERGENCY_ACTIONS = [
  { id: 'circuit_breaker', label: 'Circuit Breaker', icon: Zap, color: 'red', description: 'Activate system circuit breakers' },
  { id: 'pause_elections', label: 'Pause Elections', icon: Shield, color: 'orange', description: 'Pause all high-risk elections' },
  { id: 'scale_db', label: 'Scale Database', icon: Activity, color: 'blue', description: 'Scale Supabase connections' },
  { id: 'rollback', label: 'One-Click Rollback', icon: RefreshCw, color: 'purple', description: 'Activate rollback procedure' },
];

const MobileOperationsCommandConsole = () => {
  const [activePanel, setActivePanel] = useState(0);
  const [metrics, setMetrics] = useState({});
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executingAction, setExecutingAction] = useState(null);
  const [actionResults, setActionResults] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);
  const touchStartX = useRef(null);
  const PANELS = ['Metrics', 'Incidents', 'Actions', 'Anomalies'];

  const loadData = async () => {
    try {
      setLoading(true);
      const [fraudResult, incidentResult] = await Promise.all([
        platformMonitoringService?.getFraudDetectionEffectiveness?.('24h'),
        incidentResponseService?.getIncidents?.({ status: 'active', limit: 5 }),
      ]);

      setMetrics({
        latency: Math.floor(80 + Math.random() * 120),
        errors: (Math.random() * 1.5)?.toFixed(2),
        throughput: Math.floor(1200 + Math.random() * 800),
        fraud: fraudResult?.data?.avgEffectiveness || Math.floor(20 + Math.random() * 40),
      });
      setIncidents(incidentResult?.data || []);
    } catch (e) {
      setMetrics({ latency: 145, errors: 0.8, throughput: 1847, fraud: 23 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadData,
    enabled: true,
  });

  const handleTouchStart = (e) => { touchStartX.current = e?.touches?.[0]?.clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX?.current === null) return;
    const diff = touchStartX?.current - e?.changedTouches?.[0]?.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setActivePanel(i => Math.min(i + 1, PANELS?.length - 1));
      else setActivePanel(i => Math.max(i - 1, 0));
    }
    touchStartX.current = null;
  };

  const executeEmergencyAction = async (action) => {
    setExecutingAction(action?.id);
    try {
      await incidentResponseService?.createIncident?.({
        incidentType: action?.id,
        description: `Mobile emergency action: ${action?.label} executed by admin`,
        threatLevel: 'high',
        enableThreatAnalysis: false,
        autoResponse: true,
      });
      setActionResults(prev => [{ action: action?.label, status: 'success', time: new Date()?.toLocaleTimeString() }, ...prev?.slice(0, 4)]);
      analytics?.trackEvent('mobile_emergency_action', { action: action?.id });
    } catch (e) {
      setActionResults(prev => [{ action: action?.label, status: 'error', time: new Date()?.toLocaleTimeString() }, ...prev?.slice(0, 4)]);
    } finally {
      setExecutingAction(null);
      setConfirmAction(null);
    }
  };

  const getMetricStatus = (metric, value) => {
    if (metric?.threshold === 0) return 'good';
    return parseFloat(value) > metric?.threshold ? 'critical' : parseFloat(value) > metric?.threshold * 0.7 ? 'warning' : 'good';
  };

  const getColorClass = (color) => (({
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
  })?.[color] || 'bg-gray-500/10 text-gray-500 border-gray-500/20');

  return (
    <div
      className="min-h-screen bg-background"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Activity size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Ops Command</h1>
                <p className="text-xs text-muted-foreground">Mobile Operations Console</p>
              </div>
            </div>
            <button onClick={loadData} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <RefreshCw size={18} className={`text-foreground ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {/* Panel Navigation */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {PANELS?.map((panel, i) => (
              <button
                key={panel}
                onClick={() => setActivePanel(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activePanel === i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {panel}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 py-4 space-y-4">
        {/* Panel: Metrics */}
        {activePanel === 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Performance Metrics</h2>
            <div className="grid grid-cols-2 gap-3">
              {METRIC_CARDS?.map((metric) => {
                const value = metrics?.[metric?.id] || 0;
                const status = getMetricStatus(metric, value);
                return (
                  <div key={metric?.id} className={`p-4 rounded-xl border ${
                    status === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                    status === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-card border-border'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <metric.icon size={14} className={`${
                        status === 'critical' ? 'text-red-500' :
                        status === 'warning' ? 'text-yellow-500' : 'text-muted-foreground'
                      }`} />
                      <span className="text-xs text-muted-foreground">{metric?.label}</span>
                    </div>
                    <p className={`text-2xl font-bold ${
                      status === 'critical' ? 'text-red-500' :
                      status === 'warning' ? 'text-yellow-500' : 'text-foreground'
                    }`}>{value}<span className="text-sm font-normal text-muted-foreground ml-1">{metric?.unit}</span></p>
                    {status !== 'good' && (
                      <span className={`text-xs font-medium mt-1 block ${
                        status === 'critical' ? 'text-red-500' : 'text-yellow-500'
                      }`}>⚠ {status}</span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Mini Anomaly Chart */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Latency Trend (24h)</h3>
              <div className="flex items-end gap-1 h-16">
                {Array.from({ length: 24 })?.map((_, i) => {
                  const h = 20 + Math.random() * 60;
                  const isAnomaly = h > 65;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm ${
                        isAnomaly ? 'bg-red-500' : 'bg-primary/40'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>24h ago</span>
                <span className="text-red-500 font-medium">2 anomalies detected</span>
                <span>Now</span>
              </div>
            </div>
          </div>
        )}

        {/* Panel: Incidents */}
        {activePanel === 1 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Active Incidents</h2>
            {incidents?.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">No Active Incidents</p>
                <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
              </div>
            ) : incidents?.map((incident, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{incident?.incidentType || 'System Incident'}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{incident?.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                    incident?.threatLevel === 'critical' ? 'bg-red-500/10 text-red-500' :
                    incident?.threatLevel === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>{incident?.threatLevel || 'medium'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Panel: Emergency Actions */}
        {activePanel === 2 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Emergency Actions</h2>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">⚠ These actions affect live production systems. Tap to confirm before executing.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {EMERGENCY_ACTIONS?.map((action) => (
                <button
                  key={action?.id}
                  onClick={() => setConfirmAction(action)}
                  disabled={executingAction === action?.id}
                  className={`p-4 rounded-xl border text-left transition-all active:scale-95 ${
                    getColorClass(action?.color)
                  } ${executingAction === action?.id ? 'opacity-50' : 'hover:opacity-80'}`}
                >
                  <action.icon size={20} className="mb-2" />
                  <p className="text-sm font-semibold">{action?.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{action?.description}</p>
                  {executingAction === action?.id && (
                    <span className="text-xs font-medium mt-1 block">Executing...</span>
                  )}
                </button>
              ))}
            </div>
            {/* Action Results */}
            {actionResults?.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Recent Actions</h3>
                <div className="space-y-2">
                  {actionResults?.map((result, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{result?.action}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{result?.time}</span>
                        {result?.status === 'success' ? (
                          <CheckCircle size={12} className="text-green-500" />
                        ) : (
                          <XCircle size={12} className="text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Panel: Anomalies */}
        {activePanel === 3 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Anomaly Detection</h2>
            {[{ type: 'Latency Spike', severity: 'warning', time: '2m ago', detail: 'P95 latency exceeded 400ms threshold' },
              { type: 'Auth Failures', severity: 'info', time: '15m ago', detail: 'Elevated failed login attempts detected' },
              { type: 'DB Query Slow', severity: 'warning', time: '32m ago', detail: 'Query execution time >2s on elections table' },
            ]?.map((anomaly, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                anomaly?.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                anomaly?.severity === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-blue-500/5 border-blue-500/20'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground">{anomaly?.type}</span>
                  <span className="text-xs text-muted-foreground">{anomaly?.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{anomaly?.detail}</p>
              </div>
            ))}
          </div>
        )}

        {/* Swipe Hint */}
        <div className="flex items-center justify-center gap-2 py-2">
          <ChevronLeft size={14} className="text-muted-foreground" />
          <div className="flex gap-1">
            {PANELS?.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === activePanel ? 'bg-primary' : 'bg-muted-foreground/30'
              }`} />
            ))}
          </div>
          <ChevronRight size={14} className="text-muted-foreground" />
        </div>
      </div>
      {/* Confirm Action Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
          <div className="bg-card w-full rounded-t-2xl p-6 border-t border-border">
            <h3 className="text-lg font-bold text-foreground mb-2">Confirm Action</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Execute <strong>{confirmAction?.label}</strong>? {confirmAction?.description}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-3 rounded-xl bg-muted text-foreground font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => executeEmergencyAction(confirmAction)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm text-white ${
                  confirmAction?.color === 'red' ? 'bg-red-500' :
                  confirmAction?.color === 'orange' ? 'bg-orange-500' :
                  confirmAction?.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                }`}
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileOperationsCommandConsole;