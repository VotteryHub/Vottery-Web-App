import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Settings, Play, Pause, Clock, Zap, Globe, Shield, TrendingUp, AlertTriangle, CheckCircle, Plus, Trash2, Calendar } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { supabase } from '../../lib/supabase';

const CATEGORIES = [
  { id: 'all', label: 'All Rules', icon: Settings },
  { id: 'festival', label: 'Festival Mode', icon: Zap },
  { id: 'fraud', label: 'Fraud Protection', icon: Shield },
  { id: 'retention', label: 'Retention', icon: TrendingUp },
  { id: 'performance', label: 'Performance', icon: AlertTriangle },
  { id: 'revenue', label: 'Revenue', icon: Globe },
];

export default function AdminAutomationControlPanel() {
  const [rules, setRules] = useState([]);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('rules');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', category: 'festival', trigger: '', action: '', schedule: '' });
  const [executing, setExecuting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAutomationData();
  }, []);

  const loadAutomationData = useCallback(async () => {
    try {
      setLoading(true);
      const [rulesResult, logsResult] = await Promise.all([
        supabase?.from('automation_rules')?.select('*')?.order('created_at', { ascending: false }),
        supabase?.from('automation_execution_log')?.select('*')?.order('executed_at', { ascending: false })?.limit(100)
      ]);
      const mappedRules = (rulesResult?.data || []).map((rule) => ({
        id: rule?.rule_id || rule?.id,
        name: rule?.rule_name || 'Unnamed rule',
        category: rule?.rule_type === 'fraudProneRegionPause' ? 'fraud' :
          rule?.rule_type === 'retentionCampaign' ? 'retention' :
          rule?.rule_type === 'dynamicPricing' ? 'revenue' :
          rule?.rule_type === 'maintenanceMode' ? 'performance' : 'festival',
        enabled: rule?.is_enabled === true,
        trigger: Object.keys(rule?.conditions || {})?.[0] || 'manual',
        triggerValue: Object.values(rule?.conditions || {})?.[0] || 'On trigger',
        action: (rule?.actions?.[0]?.action || rule?.actions?.[0] || 'execute')?.toString(),
        actionValue: (rule?.actions || [])?.map((a) => a?.action || a)?.filter(Boolean)?.join(', ') || 'No action configured',
        schedule: rule?.schedule || 'manual',
        lastRun: rule?.last_executed_at ? new Date(rule?.last_executed_at)?.toLocaleString() : 'Never',
        nextRun: rule?.is_enabled ? 'Scheduled' : 'Disabled',
        status: rule?.is_enabled ? 'active' : 'disabled',
        overrideActive: !!(rule?.override_until && new Date(rule?.override_until) > new Date()),
      }));
      setRules(mappedRules);
      setExecutionLogs((logsResult?.data || []).map((log, idx) => ({
        id: log?.execution_id || log?.id || `log-${idx}`,
        rule: log?.rule_name || 'Unknown rule',
        time: log?.executed_at ? new Date(log?.executed_at)?.toLocaleTimeString() : 'n/a',
        result: (log?.actions_taken || [])?.length ? `Actions: ${(log?.actions_taken || []).join(', ')}` : 'No actions recorded',
        status: log?.status || 'unknown'
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredRules = selectedCategory === 'all' ? rules : rules?.filter(r => r?.category === selectedCategory);

  const toggleRule = useCallback(async (id) => {
    const currentRule = rules?.find((rule) => rule?.id === id);
    if (!currentRule) return;
    await supabase?.from('automation_rules')?.update({ is_enabled: !currentRule?.enabled })?.eq('rule_id', id);
    await loadAutomationData();
  }, [rules, loadAutomationData]);

  const toggleOverride = useCallback(async (id) => {
    const currentRule = rules?.find((rule) => rule?.id === id);
    if (!currentRule) return;
    const overrideUntil = currentRule?.overrideActive ? null : new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await supabase?.from('automation_rules')?.update({ override_until: overrideUntil })?.eq('rule_id', id);
    await loadAutomationData();
  }, [rules, loadAutomationData]);

  const executeNow = useCallback(async (id) => {
    setExecuting(id);
    const currentRule = rules?.find((rule) => rule?.id === id);
    await supabase?.from('automation_execution_log')?.insert({
      rule_id: id,
      rule_name: currentRule?.name || 'Unknown rule',
      executed_at: new Date()?.toISOString(),
      status: 'success',
      conditions_met: true,
      actions_taken: [currentRule?.action || 'execute'],
      affected_count: 0,
      triggered_by: 'manual'
    });
    await supabase?.from('automation_rules')?.update({ last_executed_at: new Date()?.toISOString() })?.eq('rule_id', id);
    await loadAutomationData();
    setExecuting(null);
  }, [rules, loadAutomationData]);

  const deleteRule = useCallback(async (id) => {
    await supabase?.from('automation_rules')?.delete()?.eq('rule_id', id);
    await loadAutomationData();
  }, [loadAutomationData]);

  const addRule = useCallback(async () => {
    if (!newRule?.name?.trim()) return;
    await supabase?.from('automation_rules')?.insert({
      rule_id: `rule_${Date.now()}`,
      rule_name: newRule?.name,
      rule_type: newRule?.category === 'fraud' ? 'fraudProneRegionPause' :
        newRule?.category === 'retention' ? 'retentionCampaign' :
        newRule?.category === 'performance' ? 'maintenanceMode' :
        newRule?.category === 'revenue' ? 'dynamicPricing' : 'festivalMode',
      conditions: { [newRule?.trigger || 'manual']: newRule?.trigger || 'on_demand' },
      actions: [{ action: newRule?.action || 'execute' }],
      schedule: newRule?.schedule || 'manual',
      is_enabled: false
    });
    setNewRule({ name: '', category: 'festival', trigger: '', action: '', schedule: '' });
    setShowNewRule(false);
    await loadAutomationData();
  }, [newRule, loadAutomationData]);

  const getCategoryColor = (cat) => {
    const colors = { festival: 'text-yellow-400', fraud: 'text-red-400', retention: 'text-green-400', performance: 'text-orange-400', revenue: 'text-blue-400' };
    return colors?.[cat] || 'text-muted-foreground';
  };

  const getCategoryBg = (cat) => {
    const bgs = { festival: 'bg-yellow-900/20', fraud: 'bg-red-900/20', retention: 'bg-green-900/20', performance: 'bg-orange-900/20', revenue: 'bg-blue-900/20' };
    return bgs?.[cat] || 'bg-muted/20';
  };

  const tabs = [
    { id: 'rules', label: 'Automation Rules', icon: Settings },
    { id: 'schedule', label: 'Scheduled Execution', icon: Calendar },
    { id: 'log', label: 'Execution Log', icon: Clock },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Automation Control Panel - Vottery</title>
        <meta name="description" content="Feature-specific automation rules engine with festival mode, fraud-prone region pausing, retention campaigns, scheduled execution and override controls." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Settings className="w-7 h-7 text-indigo-400" />
                  Admin Automation Control Panel
                </h1>
                <p className="text-muted-foreground mt-1">Feature-specific automation rules · Scheduled execution · Override controls</p>
              </div>
              <button
                onClick={() => setShowNewRule(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                New Rule
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
              { label: 'Total Rules', value: rules?.length, color: 'text-foreground' },
              { label: 'Active Rules', value: rules?.filter(r => r?.enabled)?.length, color: 'text-green-400' },
              { label: 'Executions Today', value: executionLogs?.length, color: 'text-blue-400' },
              { label: 'Override Active', value: rules?.filter(r => r?.overrideActive)?.length, color: 'text-yellow-400' },
            ]?.map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">{s?.label}</p>
                <p className={`text-2xl font-bold ${s?.color}`}>{s?.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-muted/30 p-1 rounded-lg overflow-x-auto">
            {tabs?.map(t => (
              <button
                key={t?.id}
                onClick={() => setActiveTab(t?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === t?.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t?.label}
              </button>
            ))}
          </div>

          {activeTab === 'rules' && (
            <div>
              {/* Category Filter */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {CATEGORIES?.map(cat => (
                  <button
                    key={cat?.id}
                    onClick={() => setSelectedCategory(cat?.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat?.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <cat.icon className="w-3 h-3" />
                    {cat?.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {loading && <div className="text-sm text-muted-foreground">Loading automation rules...</div>}
                {filteredRules?.map(rule => (
                  <div key={rule?.id} className={`bg-card border rounded-lg p-5 ${
                    rule?.overrideActive ? 'border-yellow-500/50' : rule?.enabled ? 'border-border' : 'border-border/50 opacity-70'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          rule?.overrideActive ? 'bg-yellow-400' : rule?.enabled ? 'bg-green-400' : 'bg-gray-500'
                        }`} />
                        <div>
                          <p className="font-medium text-foreground">{rule?.name}</p>
                          <span className={`text-xs font-medium ${getCategoryColor(rule?.category)}`}>
                            {rule?.category?.replace('_', ' ')?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {rule?.overrideActive && (
                          <span className="px-2 py-0.5 rounded text-xs bg-yellow-900/30 text-yellow-300">OVERRIDE</span>
                        )}
                        <button
                          onClick={() => toggleRule(rule?.id)}
                          className={`relative w-10 h-5 rounded-full transition-colors ${rule?.enabled ? 'bg-green-500' : 'bg-gray-600'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${rule?.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg mb-3 ${getCategoryBg(rule?.category)}`}>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">TRIGGER</p>
                        <p className="text-sm text-foreground">{rule?.trigger?.replace(/_/g, ' ')}: <span className="font-medium">{rule?.triggerValue}</span></p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">ACTION</p>
                        <p className="text-sm text-foreground">{rule?.actionValue}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>🕒 {rule?.schedule}</span>
                        <span>Last: {rule?.lastRun}</span>
                        <span>Next: {rule?.nextRun}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleOverride(rule?.id)}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            rule?.overrideActive ? 'bg-yellow-900/40 text-yellow-300' : 'bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {rule?.overrideActive ? 'Remove Override' : 'Override'}
                        </button>
                        <button
                          onClick={() => executeNow(rule?.id)}
                          disabled={executing === rule?.id}
                          className="flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded text-xs hover:bg-primary/30 disabled:opacity-60"
                        >
                          <Play className={`w-3 h-3 ${executing === rule?.id ? 'animate-pulse' : ''}`} />
                          {executing === rule?.id ? 'Running...' : 'Run Now'}
                        </button>
                        <button
                          onClick={() => deleteRule(rule?.id)}
                          className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Scheduled Execution Timeline</h3>
              </div>
              <div className="divide-y divide-border">
                {rules?.filter(r => r?.nextRun !== 'On trigger' && r?.nextRun !== 'Never')?.map(rule => (
                  <div key={rule?.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className={`w-5 h-5 ${getCategoryColor(rule?.category)}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{rule?.name}</p>
                        <p className="text-xs text-muted-foreground">{rule?.schedule}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Next execution</p>
                      <p className="text-sm font-medium text-foreground">{rule?.nextRun}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'log' && (
            <div className="space-y-3">
              {executionLogs?.map(log => (
                <div key={log?.id} className="bg-card border border-border rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{log?.rule}</p>
                      <span className="text-xs text-muted-foreground">{log?.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{log?.result}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Rule Modal */}
          {showNewRule && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg">
                <h3 className="font-semibold text-foreground mb-4">Create Automation Rule</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Rule Name', key: 'name', type: 'text', placeholder: 'e.g. Holiday Boost Mode' },
                    { label: 'Trigger Condition', key: 'trigger', type: 'text', placeholder: 'e.g. fraud_rate > 5%' },
                    { label: 'Action', key: 'action', type: 'text', placeholder: 'e.g. pause_region_campaigns' },
                    { label: 'Schedule', key: 'schedule', type: 'text', placeholder: 'e.g. Daily 09:00 UTC' },
                  ]?.map(field => (
                    <div key={field?.key}>
                      <label className="text-sm text-muted-foreground block mb-1">{field?.label}</label>
                      <input
                        type={field?.type}
                        value={newRule?.[field?.key]}
                        onChange={e => setNewRule(prev => ({ ...prev, [field?.key]: e?.target?.value }))}
                        placeholder={field?.placeholder}
                        className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Category</label>
                    <select
                      value={newRule?.category}
                      onChange={e => setNewRule(prev => ({ ...prev, category: e?.target?.value }))}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {CATEGORIES?.filter(c => c?.id !== 'all')?.map(c => (
                        <option key={c?.id} value={c?.id}>{c?.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setShowNewRule(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                  <button onClick={addRule} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Create Rule</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
