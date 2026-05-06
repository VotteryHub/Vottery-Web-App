import React, { useState, useEffect, useCallback } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import { Settings, Zap, Shield, TrendingUp, AlertTriangle, Globe, Plus, Play, Pause, Trash2, Edit3, MoreVertical, Check, X, Clock, Eye, Info } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Rules', icon: 'Settings' },
  { id: 'festival', label: 'Festival Mode', icon: 'Zap' },
  { id: 'fraud', label: 'Fraud Protection', icon: 'Shield' },
  { id: 'retention', label: 'Retention', icon: 'TrendingUp' },
  { id: 'performance', label: 'Performance', icon: 'AlertTriangle' },
  { id: 'revenue', label: 'Revenue', icon: 'Globe' },
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
    <GeneralPageLayout title="Automation Intelligence" showSidebar={true}>
      <div className="w-full py-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-xl">
              <Icon name="Settings" size={28} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Logic Engine</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Autonomous rules & system-wide automation triggers</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-3 rounded-2xl border border-white/5 shadow-2xl">
            <button
              onClick={() => setShowNewRule(true)}
              className="flex items-center gap-2.5 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all"
            >
              <Icon name="Plus" size={14} />
              Provision New Rule
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
            { label: 'Total Rules', value: rules?.length, color: 'text-white' },
            { label: 'Active Logic', value: rules?.filter(r => r?.enabled)?.length, color: 'text-green-500' },
            { label: 'Today\'s Events', value: executionLogs?.length, color: 'text-blue-500' },
            { label: 'Manual Overrides', value: rules?.filter(r => r?.overrideActive)?.length, color: 'text-amber-500' },
          ]?.map((s, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 relative z-10">{s?.label}</p>
              <p className={`text-2xl font-black relative z-10 font-mono tracking-tight ${s?.color}`}>{s?.value}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-10 p-1 bg-black/20 rounded-2xl border border-white/5 w-fit">
          {tabs?.map(t => (
            <button
              key={t?.id}
              onClick={() => setActiveTab(t?.id)}
              className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === t?.id ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon name={t?.icon} size={14} />
              {t?.label}
            </button>
          ))}
        </div>

        {activeTab === 'rules' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Category Filter */}
            <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
              {CATEGORIES?.map(cat => (
                <button
                  key={cat?.id}
                  onClick={() => setSelectedCategory(cat?.id)}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                    selectedCategory === cat?.id ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900/40 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                  }`}
                >
                  <Icon name={cat?.icon} size={12} />
                  {cat?.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
              {loading && (
                <div className="py-24 text-center">
                   <Icon name="RefreshCw" size={32} className="text-indigo-500 animate-spin mx-auto opacity-50" />
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-6">Syncing Logic Engine...</p>
                </div>
              )}
              {filteredRules?.map(rule => (
                <div key={rule?.id} className={`bg-slate-900/40 backdrop-blur-xl border rounded-[32px] p-8 transition-all duration-300 shadow-2xl ${
                  rule?.overrideActive ? 'border-amber-500/30' : rule?.enabled ? 'border-white/10' : 'border-white/5 opacity-60 grayscale'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div className="flex items-center gap-6">
                      <div className={`w-3 h-3 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.2)] ${
                        rule?.overrideActive ? 'bg-amber-500' : rule?.enabled ? 'bg-green-500' : 'bg-slate-700'
                      }`} />
                      <div>
                        <p className="text-lg font-black text-white uppercase tracking-tight">{rule?.name}</p>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg mt-2 inline-block uppercase tracking-widest border border-white/5 ${getCategoryBg(rule?.category)} ${getCategoryColor(rule?.category)}`}>
                          {rule?.category} System
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {rule?.overrideActive && (
                        <div className="px-4 py-2 rounded-xl text-[9px] font-black bg-amber-500/20 text-amber-500 border border-amber-500/20 uppercase tracking-widest animate-pulse">
                          Manual Override Active
                        </div>
                      )}
                      <button
                        onClick={() => toggleRule(rule?.id)}
                        className={`relative w-14 h-7 rounded-full transition-all duration-500 ${rule?.enabled ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-slate-800'}`}
                      >
                        <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-lg ${rule?.enabled ? 'left-8' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-3">Logic Trigger</p>
                      <p className="text-sm font-black text-white uppercase tracking-tight">{rule?.trigger?.replace(/_/g, ' ')}</p>
                      <p className="text-[10px] text-indigo-400 font-mono mt-1">{rule?.triggerValue}</p>
                    </div>
                    <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-3">Target Action</p>
                      <p className="text-sm font-black text-white uppercase tracking-tight">{rule?.actionValue}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Status: {rule?.status}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-8 flex-wrap">
                      <div className="flex items-center gap-2">
                         <Icon name="Calendar" size={14} className="text-slate-600" />
                         <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{rule?.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Icon name="Clock" size={14} className="text-slate-600" />
                         <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Last: <span className="text-slate-300 font-mono">{rule?.lastRun}</span></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleOverride(rule?.id)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          rule?.overrideActive ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                        }`}
                      >
                        {rule?.overrideActive ? 'Kill Override' : 'Manual Override'}
                      </button>
                      <button
                        onClick={() => executeNow(rule?.id)}
                        disabled={executing === rule?.id}
                        className="flex items-center gap-2.5 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all disabled:opacity-50"
                      >
                        <Icon name="Play" size={14} className={executing === rule?.id ? 'animate-pulse' : ''} />
                        {executing === rule?.id ? 'Deploying...' : 'Force Run'}
                      </button>
                      <button
                        onClick={() => deleteRule(rule?.id)}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 border-b border-white/5 bg-black/20">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scheduled Execution Timeline</h3>
            </div>
            <div className="divide-y divide-white/5">
              {rules?.filter(r => r?.nextRun !== 'On trigger' && r?.nextRun !== 'Never')?.length === 0 ? (
                <div className="py-24 text-center">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest opacity-50">No upcoming schedules found</p>
                </div>
              ) : (
                rules?.filter(r => r?.nextRun !== 'On trigger' && r?.nextRun !== 'Never')?.map(rule => (
                  <div key={rule?.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                        <Icon name="Calendar" size={20} className={getCategoryColor(rule?.category)} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-tight">{rule?.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{rule?.schedule}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Queue Priority</p>
                      <p className="text-sm font-black text-indigo-400 font-mono uppercase tracking-tighter">Next Execution Scheduled</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'log' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {executionLogs?.map(log => (
              <div key={log?.id} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex items-start gap-6 shadow-2xl hover:bg-white/5 transition-all">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
                  <Icon name="CheckCircle" size={18} className="text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-black text-white uppercase tracking-tight">{log?.rule}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{log?.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{log?.result}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Rule Modal */}
        {showNewRule && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/10 rounded-[40px] p-10 w-full max-w-xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border-indigo-500/20">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                    <Icon name="Zap" size={24} className="text-indigo-400" />
                 </div>
                 <h3 className="text-xl font-black text-white uppercase tracking-tight">Provision Logic Rule</h3>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: 'Identifier / Name', key: 'name', type: 'text', placeholder: 'e.g. Fraud Spiked Protection' },
                  { label: 'Condition Syntax', key: 'trigger', type: 'text', placeholder: 'e.g. rate > 0.05' },
                  { label: 'Execution Path', key: 'action', type: 'text', placeholder: 'e.g. throttle_api_ingress' },
                  { label: 'Cron / Schedule', key: 'schedule', type: 'text', placeholder: 'e.g. 0 0 * * *' },
                ]?.map(field => (
                  <div key={field?.key}>
                    <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2 ml-1 block">{field?.label}</label>
                    <input
                      type={field?.type}
                      value={newRule?.[field?.key]}
                      onChange={e => setNewRule(prev => ({ ...prev, [field?.key]: e?.target?.value }))}
                      placeholder={field?.placeholder}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2 ml-1 block">Rule Category</label>
                  <select
                    value={newRule?.category}
                    onChange={e => setNewRule(prev => ({ ...prev, category: e?.target?.value }))}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm font-black text-white uppercase tracking-tight focus:outline-none focus:border-indigo-500/50 transition-all"
                  >
                    {CATEGORIES?.filter(c => c?.id !== 'all')?.map(c => (
                      <option key={c?.id} value={c?.id} className="bg-slate-900">{c?.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setShowNewRule(false)} 
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white text-[10px] font-black rounded-2xl border border-white/5 transition-all uppercase tracking-widest"
                >
                  Discard
                </button>
                <button 
                  onClick={addRule} 
                  className="flex-1 py-4 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black rounded-2xl shadow-lg shadow-indigo-500/20 transition-all uppercase tracking-widest"
                >
                  Finalize Provisioning
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
}
