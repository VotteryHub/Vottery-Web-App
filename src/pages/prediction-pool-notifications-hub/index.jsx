import React, { useState, useEffect } from 'react';
import { Bell, Check, Loader, Save, Activity, Target, Award, List } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';

const DEFAULT_PREFS = {
  prediction_confirmations: true,
  prediction_countdowns: true,
  pool_resolutions: true,
  leaderboard_changes: true,
};

const PredictionPoolNotificationsHub = () => {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user?.id) loadPrefs();
  }, [user?.id]);

  const loadPrefs = async () => {
    try {
      const { data } = await supabase
        ?.from('user_preferences')
        ?.select('notification_settings')
        ?.eq('user_id', user?.id)
        ?.single();
      if (data?.notification_settings && typeof data?.notification_settings === 'object') {
        setPrefs({ ...DEFAULT_PREFS, ...data?.notification_settings });
      }
    } catch (err) {
      console.warn('Could not load prediction notification prefs:', err);
    } finally {
      setLoading(false);
    }
  };

  const savePrefs = async () => {
    if (!user?.id) return;
    setSaving(true);
    setMessage(null);
    try {
      const { data: existing } = await supabase?.from('user_preferences')?.select('id')?.eq('user_id', user?.id)?.single();
      if (existing) {
        const { error } = await supabase?.from('user_preferences')?.update({ notification_settings: prefs })?.eq('user_id', user?.id);
        if (error) throw error;
      } else {
        const { error } = await supabase?.from('user_preferences')?.insert({ user_id: user?.id, notification_settings: prefs });
        if (error) throw error;
      }
      setMessage({ type: 'success', text: 'Preferences saved successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save preferences' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p?.[key] }));

  const options = [
    { key: 'prediction_confirmations', label: 'Prediction confirmations', desc: 'Notify when you lock in a prediction', icon: Check },
    { key: 'prediction_countdowns', label: 'Lock-in countdowns', desc: 'Remind before election closes (15 min, 1 hr, 24 hr)', icon: Activity },
    { key: 'pool_resolutions', label: 'Pool resolution events', desc: 'Notify when a pool is resolved with your accuracy & rank', icon: Target },
    { key: 'leaderboard_changes', label: 'Leaderboard rank changes', desc: 'Notify when you enter top 10 in a pool', icon: Award },
  ];

  return (
    <GeneralPageLayout
      title="Prediction Notifications"
      description="Customize your prediction pool alerts"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
            <Bell className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Notification Preferences</h1>
            <p className="text-sm text-slate-400 mt-1">Manage alerts for your gamified prediction pools (push, email, SMS)</p>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 border ${message?.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} transition-all duration-300 animate-in fade-in slide-in-from-top-4`}>
            {message?.type === 'success' ? <Check className="w-5 h-5 flex-shrink-0" /> : <Icon name="AlertCircle" size={20} className="flex-shrink-0" />}
            <span className="font-medium">{message?.text}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-900/50 border border-white/5 rounded-3xl">
            <Loader className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p className="text-slate-400 font-medium animate-pulse">Loading preferences...</p>
          </div>
        ) : (
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Preferences List */}
            <div className="divide-y divide-white/5">
              {options?.map((opt) => (
                <div key={opt?.key} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                      <opt.icon className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">{opt?.label}</div>
                      <div className="text-sm text-slate-400 mt-0.5">{opt?.desc}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(opt?.key)}
                    className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${prefs?.[opt?.key] ? 'bg-blue-500' : 'bg-slate-700'}`}
                    role="switch"
                    aria-checked={prefs?.[opt?.key]}
                  >
                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs?.[opt?.key] ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Action Bar */}
            <div className="p-6 bg-slate-950/50 border-t border-white/5 flex justify-end">
              <button
                onClick={savePrefs}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
              >
                {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'Saving Changes...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default PredictionPoolNotificationsHub;
