import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { integrationSettingsService } from '../../services/integrationSettingsService';
import { useAuth } from '../../contexts/AuthContext';

const DEFAULT_INTEGRATIONS = [
  { name: 'Stripe', type: 'payment' },
  { name: 'Google AdSense', type: 'advertising' },
  { name: 'Resend', type: 'communication' },
  { name: 'WhatsApp (Twilio)', type: 'communication' },
  { name: 'Push Notifications', type: 'communication' },
  { name: 'Twilio', type: 'communication' },
  { name: 'Gemini', type: 'ai_service' },
  { name: 'Anthropic', type: 'ai_service' },
  { name: 'Google Analytics', type: 'analytics' },
  { name: 'Amplitude', type: 'analytics' },
  { name: 'Telnyx', type: 'communication' }
];

const PlatformIntegrationsAdmin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState([]);
  const [saving, setSaving] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = async () => {
    setLoading(true);
    try {
      await integrationSettingsService.ensureBatch1ExternalAdDefaults(user?.id);
      const data = await integrationSettingsService.getAll();
      setIntegrations(data);
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to load integrations' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const mapByName = integrations.reduce((acc, i) => { acc[i?.integration_name] = i; return acc; }, {});

  const handleToggle = async (integrationName, currentEnabled, integrationType = 'communication') => {
    setSaving(integrationName);
    setMessage({ type: '', text: '' });
    try {
      await integrationSettingsService.setEnabled(integrationName, !currentEnabled, user?.id, integrationType);
      await load();
      setMessage({ type: 'success', text: `${integrationName} ${!currentEnabled ? 'enabled' : 'disabled'}` });
    } catch (e) {
      setMessage({ type: 'error', text: e?.message ?? 'Update failed' });
    } finally {
      setSaving(null);
    }
  };

  const handleSaveBudget = async (integrationName, weeklyCap, monthlyCap) => {
    setSaving(integrationName);
    try {
      await integrationSettingsService.setBudgetCaps(integrationName, Number(weeklyCap), Number(monthlyCap), user?.id);
      await load();
      setEditingBudget(null);
      setMessage({ type: 'success', text: 'Budget caps updated' });
    } catch (e) {
      setMessage({ type: 'error', text: e?.message ?? 'Update failed' });
    } finally {
      setSaving(null);
    }
  };

  const handleBulkTypeToggle = async (type, enable) => {
    const typeLabel = type === 'ai_service' ? 'AI Services' : type;
    if (!window.confirm(`Are you sure you want to ${enable ? 'enable' : 'disable'} ALL ${typeLabel}?`)) return;
    setLoading(true);
    try {
      await integrationSettingsService.bulkSetEnabledByType(type, enable, user?.id);
      await load();
      setMessage({ type: 'success', text: `All ${typeLabel} ${enable ? 'enabled' : 'disabled'}` });
    } catch (e) {
      setMessage({ type: 'error', text: e?.message ?? 'Bulk update failed' });
    } finally {
      setLoading(false);
    }
  };

  const list = DEFAULT_INTEGRATIONS.map(d => ({
    ...d,
    ...mapByName[d.name],
    is_enabled: mapByName[d.name] ? mapByName[d.name].is_enabled : false
  }));

  return (
    <GeneralPageLayout title="Platform Integrations" showSidebar={true}>
      <div className="max-w-5xl mx-auto py-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-[20px] flex items-center justify-center border border-indigo-500/20 shadow-xl">
              <Icon name="Plug" size={28} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Platform Integrations</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Infrastructure cost management & service orchestration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleBulkTypeToggle('ai_service', false)}
              className="px-6 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all font-black uppercase tracking-widest text-[10px]"
            >
              AI Emergency Off
            </button>
            <button 
              onClick={() => handleBulkTypeToggle('ai_service', true)}
              className="px-6 py-3.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/20 transition-all font-black uppercase tracking-widest text-[10px]"
            >
              Enable All AI
            </button>
            <button 
              onClick={load} 
              disabled={loading}
              className="p-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-white/5 transition-all disabled:opacity-50"
            >
              <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {message?.text && (
          <div className={`mb-8 p-5 rounded-2xl border animate-in zoom-in duration-300 flex items-center gap-4 ${
            message.type === 'error' 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            <Icon name={message.type === 'error' ? 'AlertTriangle' : 'CheckCircle'} size={20} />
            <p className="text-xs font-black uppercase tracking-widest">{message.text}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-2xl shadow-indigo-500/20" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Syncing Integration Registry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {list.map((int) => (
              <div
                key={int.name}
                className="group bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[28px] p-6 flex flex-wrap items-center justify-between gap-6 hover:bg-white/5 transition-all shadow-xl"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                    int.is_enabled ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-slate-800/50 border-white/5'
                  }`}>
                    <Icon 
                      name={int.type === 'communication' ? 'MessageSquare' : int.type === 'ai_service' ? 'Cpu' : 'CreditCard'} 
                      size={20} 
                      className={int.is_enabled ? 'text-indigo-400' : 'text-slate-600'} 
                    />
                  </div>
                  <div>
                    <span className="font-black text-white uppercase tracking-tight text-lg">{int.name}</span>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{int.integration_type || int.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 flex-wrap">
                  <div className="flex flex-col items-end gap-1.5">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Service Status</p>
                    <button
                      type="button"
                      onClick={() => handleToggle(int.name, int.is_enabled, int.type)}
                      disabled={saving === int.name}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        int.is_enabled 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                          : 'bg-slate-800 text-slate-500 border border-white/5 hover:bg-slate-700'
                      }`}
                    >
                      {saving === int.name ? 'Processing...' : int.is_enabled ? 'Operational' : 'Disabled'}
                    </button>
                  </div>

                  <div className="h-10 w-px bg-white/5 hidden md:block" />

                  {editingBudget === int.name ? (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Weekly</p>
                        <Input
                          type="number"
                          defaultValue={int.weekly_budget_cap ?? 0}
                          id={`weekly-${int.name}`}
                          className="w-24 bg-black/40 border-white/10 rounded-xl h-10 text-xs font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Monthly</p>
                        <Input
                          type="number"
                          defaultValue={int.monthly_budget_cap ?? 0}
                          id={`monthly-${int.name}`}
                          className="w-24 bg-black/40 border-white/10 rounded-xl h-10 text-xs font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 justify-end">
                        <div className="flex gap-2 pt-5">
                          <button
                            onClick={() => {
                              const w = document.getElementById(`weekly-${int.name}`)?.value;
                              const m = document.getElementById(`monthly-${int.name}`)?.value;
                              handleSaveBudget(int.name, w, m);
                            }}
                            disabled={saving === int.name}
                            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                          >
                            <Icon name="Check" size={16} />
                          </button>
                          <button 
                            onClick={() => setEditingBudget(null)}
                            className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors"
                          >
                            <Icon name="X" size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Current Caps</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-mono text-white/40">W: <span className="text-white">${Number(int.weekly_budget_cap ?? 0).toFixed(0)}</span></span>
                          <span className="text-[11px] font-mono text-white/40">M: <span className="text-white">${Number(int.monthly_budget_cap ?? 0).toFixed(0)}</span></span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setEditingBudget(int.name)}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Adjust Caps
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default PlatformIntegrationsAdmin;
