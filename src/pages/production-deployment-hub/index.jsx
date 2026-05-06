import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { datadogAPMService } from '../../services/datadogAPMService';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const ROLLOUT_OPTIONS = [10, 25, 50, 75, 100];

const StatusBadge = ({ status }) => {
  const map = {
    stable: 'bg-green-500/10 text-green-500 border-green-500/20',
    deploying: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    rolling_back: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    failed: 'bg-red-500/10 text-red-500 border-red-500/20',
    deployed: 'bg-green-500/10 text-green-500 border-green-500/20',
    rolled_back: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map?.[status] || map?.pending}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
};

const ProductionDeploymentHub = () => {
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin';

  const [config, setConfig] = useState(null);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [featureFlags, setFeatureFlags] = useState({});
  const [rolloutPct, setRolloutPct] = useState(100);
  const [activeSlot, setActiveSlot] = useState('blue');
  const [toast, setToast] = useState(null);
  const [blueGreenHealth, setBlueGreenHealth] = useState(null);
  const [rolloutAlertActive, setRolloutAlertActive] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: cfg } = await supabase?.from('deployment_config')?.select('*')?.limit(1)?.single();
      const { data: rels } = await supabase?.from('deployment_releases')?.select('*')?.order('deployed_at', { ascending: false })?.limit(20);
      
      if (cfg) {
        setConfig(cfg);
        setFeatureFlags(cfg?.feature_flags || {});
        setRolloutPct(cfg?.rollout_percentage ?? 100);
        setActiveSlot(cfg?.active_slot ?? 'blue');
      }
      setReleases(rels || []);

      const { data: audits } = await supabase?.from('deployment_audit_logs')?.select('*, user_profiles(username)')?.order('created_at', { ascending: false })?.limit(50);
      setAuditLogs(audits || []);
    } catch (err) {
      console.error('ProductionDeploymentHub load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const checkBlueGreenHealth = useCallback(async () => {
    try {
      const { data: health } = await datadogAPMService?.monitorBlueGreenHealth();
      if (health) {
        setBlueGreenHealth(health);
        if (config) {
          await datadogAPMService?.sendFeatureRolloutMetrics(config);
        }
      }
    } catch (err) {
      console.warn('Blue-green health check failed:', err);
    }
  }, [config]);

  useEffect(() => {
    checkBlueGreenHealth();
  }, [checkBlueGreenHealth]);

  // Automated rollout failure check: >5% error rate threshold (Datadog APM)
  const ROLLOUT_ERROR_THRESHOLD = 5;
  useEffect(() => {
    let cancelled = false;
    const checkErrorRate = async () => {
      try {
        const { data: queryMetrics } = await datadogAPMService?.getQueryPerformanceMetrics?.() || {};
        const rate = queryMetrics?.errorRate != null ? parseFloat(queryMetrics.errorRate) : 0;
        if (!cancelled && rate > ROLLOUT_ERROR_THRESHOLD) {
          setRolloutAlertActive(true);
        }
      } catch (_) { /* ignore */ }
    };
    checkErrorRate();
    const interval = setInterval(checkErrorRate, 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  useRealtimeMonitoring({
    tables: ['deployment_config', 'deployment_releases'],
    onRefresh: () => {
      loadData();
      checkBlueGreenHealth();
    },
    enabled: true,
  });

  // Tag Sentry with deployment version when config loads
  useEffect(() => {
    if (config?.current_release && typeof window !== 'undefined' && window?.Sentry) {
      window?.Sentry?.configureScope?.((scope) => {
        scope?.setTag?.('deployment_version', config?.current_release);
        scope?.setTag?.('active_slot', config?.active_slot);
        scope?.setTag?.('rollout_percentage', config?.rollout_percentage);
      });
    }
  }, [config?.current_release, config?.active_slot, config?.rollout_percentage]);

  const saveConfig = async (updates, auditData = null) => {
    if (!isAdmin) return;
    setSaving(true);
    try {
      const { error } = await supabase?.from('deployment_config')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', config?.id);
      if (error) throw error;
      
      if (auditData) {
        await supabase?.from('deployment_audit_logs')?.insert({
          ...auditData,
          actor_id: userProfile?.id,
          metadata: { ...auditData?.metadata, deployment_version: config?.current_release }
        });
      }

      await loadData();
      showToast('Configuration saved successfully');
    } catch (err) {
      showToast(err?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleFlag = async (key) => {
    if (!isAdmin) return;
    const oldValue = featureFlags?.[key];
    const updated = { ...featureFlags, [key]: !oldValue };
    setFeatureFlags(updated);
    await saveConfig(
      { feature_flags: updated },
      {
        action_type: 'feature_flag_toggle',
        feature_name: key,
        old_value: { enabled: oldValue },
        new_value: { enabled: !oldValue }
      }
    );
  };

  const handleRollout = async () => {
    await saveConfig(
      { rollout_percentage: rolloutPct },
      {
        action_type: 'rollout_change',
        old_value: { percentage: config?.rollout_percentage },
        new_value: { percentage: rolloutPct }
      }
    );
  };

  const handleSlotToggle = async () => {
    const newSlot = activeSlot === 'blue' ? 'green' : 'blue';
    const oldSlot = activeSlot;
    setActiveSlot(newSlot);
    await saveConfig(
      { active_slot: newSlot },
      {
        action_type: 'slot_switch',
        old_value: { slot: oldSlot },
        new_value: { slot: newSlot }
      }
    );
  };

  const handleRollback = async () => {
    if (!isAdmin || !config?.last_rollback_version) return;
    await saveConfig({
      current_release: config?.last_rollback_version,
      deployment_status: 'stable',
      last_rollback_at: new Date()?.toISOString()
    });
    showToast(`Rolled back to ${config?.last_rollback_version}`);
  };

  const handleRolloutChange = async (newPct) => {
    if (!isAdmin) return;
    const oldPct = rolloutPct;
    setRolloutPct(newPct);
    await saveConfig(
      { rollout_percentage: newPct },
      {
        action_type: 'rollout_change',
        old_value: { percentage: oldPct },
        new_value: { percentage: newPct }
      }
    );

    // Check for rollout failure conditions
    try {
      const { data: queryMetrics } = await datadogAPMService?.getQueryPerformanceMetrics();
      if (queryMetrics?.errorRate) {
        const errorRate = parseFloat(queryMetrics?.errorRate);
        const alertResult = await datadogAPMService?.triggerRolloutFailureAlert(
          errorRate,
          config?.current_release,
          { rollout_percentage: newPct, active_slot: activeSlot }
        );
        if (alertResult?.alerted) {
          setRolloutAlertActive(true);
          showToast(`⚠️ Rollout alert: ${errorRate?.toFixed(1)}% error rate detected`, 'error');
        }
      }
    } catch (err) {
      console.warn('Rollout failure check error:', err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'releases', label: 'Releases', icon: 'GitBranch' },
    { id: 'bluegreen', label: 'Blue/Green', icon: 'Repeat' },
    { id: 'flags', label: 'Feature Flags', icon: 'Flag' },
    { id: 'rollout', label: 'Staged Rollout', icon: 'Sliders' },
    { id: 'audit', label: 'Audit Log', icon: 'History' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="flex">
          <LeftSidebar />
          <main className="flex-1 pt-20 lg:ml-64 xl:ml-72 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Production Deployment Hub | Vottery</title></Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 pt-20 pb-8 lg:ml-64 xl:ml-72">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Icon name="Rocket" size={24} className="text-primary" />
                  Production Deployment Hub
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Manage releases, feature flags, blue/green deployments, and staged rollouts</p>
              </div>
              {!isAdmin && (
                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">Read-only</span>
              )}
            </div>

            {/* Toast */}
            {toast && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
                toast?.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
              }`}>
                {toast?.msg}
              </div>
            )}

            {/* Rollout failure alert (>5% error rate threshold) */}
            {rolloutAlertActive && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-600 border border-red-500/30 flex items-center justify-between flex-wrap gap-2">
                <span>⚠️ Rollout failure: Error rate exceeded 5% threshold. Datadog APM connected. Consider rollback or pause rollout.</span>
                <button onClick={() => setRolloutAlertActive(false)} className="text-xs underline">Dismiss</button>
              </div>
            )}

            {/* Status Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Current Release', value: config?.current_release || '—', icon: 'Tag', color: 'text-primary' },
                { label: 'Status', value: <StatusBadge status={config?.deployment_status || 'stable'} />, icon: 'Activity', color: 'text-green-500' },
                { label: 'Active Slot', value: <span className={`font-bold ${activeSlot === 'blue' ? 'text-blue-500' : 'text-green-500'}`}>{activeSlot?.toUpperCase()}</span>, icon: 'Server', color: 'text-blue-500' },
                { label: 'Rollout', value: `${rolloutPct}%`, icon: 'Users', color: 'text-orange-500' },
              ]?.map((card) => (
                <div key={card?.label} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={card?.icon} size={16} className={card?.color} />
                    <span className="text-xs text-muted-foreground">{card?.label}</span>
                  </div>
                  <div className="text-lg font-semibold text-foreground">{card?.value}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-muted/30 rounded-xl p-1 overflow-x-auto">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab?.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={14} />
                  {tab?.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Deployment Overview</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Blue Version</p>
                      <p className="font-medium text-foreground">{config?.blue_version || '1.0.0'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Green Version</p>
                      <p className="font-medium text-foreground">{config?.green_version || '1.0.0'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                      <p className="font-medium text-foreground">{config?.updated_at ? new Date(config.updated_at)?.toLocaleString() : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last Rollback</p>
                      <p className="font-medium text-foreground">{config?.last_rollback_at ? new Date(config.last_rollback_at)?.toLocaleString() : 'None'}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="pt-4 border-t border-border">
                      <Button
                        onClick={handleRollback}
                        disabled={!config?.last_rollback_version || saving}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Icon name="RotateCcw" size={16} />
                        Rollback to {config?.last_rollback_version || 'Previous'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'releases' && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Release History</h2>
                <div className="space-y-3">
                  {releases?.length === 0 && <p className="text-muted-foreground text-sm">No releases found.</p>}
                  {releases?.map(rel => (
                    <div key={rel?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon name="Tag" size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">v{rel?.version}</p>
                          <p className="text-xs text-muted-foreground">{rel?.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{rel?.deployed_at ? new Date(rel.deployed_at)?.toLocaleDateString() : '—'}</span>
                        <StatusBadge status={rel?.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bluegreen' && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Blue/Green Deployment</h2>
                <p className="text-sm text-muted-foreground mb-6">Switch traffic between Blue and Green deployment slots. Only one slot is active at a time.</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {['blue', 'green']?.map(slot => (
                    <div key={slot} className={`p-5 rounded-xl border-2 transition-all ${
                      activeSlot === slot
                        ? slot === 'blue' ? 'border-blue-500 bg-blue-500/10' : 'border-green-500 bg-green-500/10' : 'border-border bg-muted/20'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-lg font-bold capitalize ${slot === 'blue' ? 'text-blue-500' : 'text-green-500'}`}>{slot}</span>
                        {activeSlot === slot && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">ACTIVE</span>}
                      </div>
                      <p className="text-sm text-foreground font-medium">v{slot === 'blue' ? config?.blue_version : config?.green_version}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activeSlot === slot ? 'Receiving 100% traffic' : 'Standby'}</p>
                    </div>
                  ))}
                </div>
                {isAdmin && (
                  <Button onClick={handleSlotToggle} disabled={saving} className="flex items-center gap-2">
                    <Icon name="Repeat" size={16} />
                    Switch to {activeSlot === 'blue' ? 'Green' : 'Blue'}
                  </Button>
                )}
              </div>
            )}

            {activeTab === 'flags' && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Feature Flags</h2>
                <div className="space-y-3">
                  {Object.keys(featureFlags)?.length === 0 && <p className="text-muted-foreground text-sm">No feature flags configured.</p>}
                  {Object.entries(featureFlags)?.map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                      <div>
                        <p className="font-medium text-foreground text-sm">{key?.replace(/_/g, ' ')?.replace(/\b\w/g, c => c?.toUpperCase())}</p>
                        <p className="text-xs text-muted-foreground">{key}</p>
                      </div>
                      <button
                        onClick={() => toggleFlag(key)}
                        disabled={!isAdmin || saving}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-primary' : 'bg-muted'
                        } disabled:opacity-50`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rollout' && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Staged Rollout</h2>
                <p className="text-sm text-muted-foreground mb-6">Control what percentage of users receive the current release.</p>
                <div className="flex gap-3 flex-wrap mb-6">
                  {ROLLOUT_OPTIONS?.map(pct => (
                    <button
                      key={pct}
                      onClick={() => handleRolloutChange(pct)}
                      disabled={!isAdmin}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        rolloutPct === pct
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted/30 text-foreground border-border hover:border-primary/50'
                      } disabled:opacity-50`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>0%</span>
                    <span className="font-medium text-foreground">{rolloutPct}% of users</span>
                    <span>100%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                      style={{ width: `${rolloutPct}%` }}
                    />
                  </div>
                </div>
                {isAdmin && (
                  <Button onClick={handleRollout} disabled={saving} className="flex items-center gap-2">
                    <Icon name="Sliders" size={16} />
                    {saving ? 'Saving...' : 'Apply Rollout'}
                  </Button>
                )}
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Deployment Audit Log</h2>
                <div className="space-y-4">
                  {auditLogs?.length === 0 && <p className="text-muted-foreground text-sm">No audit logs found.</p>}
                  {auditLogs?.map(log => (
                    <div key={log?.id} className="p-4 bg-muted/30 rounded-xl border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground capitalize">
                            {log?.action_type?.replace(/_/g, ' ')}
                          </span>
                          {log?.feature_name && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {log?.feature_name}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log?.created_at)?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-xs">
                          <div className="text-muted-foreground">
                            Old: <span className="text-foreground">{JSON.stringify(log?.old_value)}</span>
                          </div>
                          <div className="text-muted-foreground">
                            New: <span className="text-foreground">{JSON.stringify(log?.new_value)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon name="User" size={12} />
                          {log?.user_profiles?.username || 'System'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductionDeploymentHub;
