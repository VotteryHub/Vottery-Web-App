import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Bell, Check, Loader, Save } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
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
      setMessage({ type: 'success', text: 'Preferences saved. You will receive notifications based on your choices.' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p?.[key] }));

  const options = [
    { key: 'prediction_confirmations', label: 'Prediction confirmations', desc: 'Notify when you lock in a prediction' },
    { key: 'prediction_countdowns', label: 'Lock-in countdowns', desc: 'Remind before election closes (15 min, 1 hr, 24 hr)' },
    { key: 'pool_resolutions', label: 'Pool resolution events', desc: 'Notify when a pool is resolved with your accuracy & rank' },
    { key: 'leaderboard_changes', label: 'Leaderboard rank changes', desc: 'Notify when you enter top 10 in a pool' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Prediction Pool Notifications | Vottery</title>
        <meta name="description" content="Customize your prediction pool notifications: pool creation, lock-in countdowns, resolution events, leaderboard rank changes" />
      </Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prediction Pool Notifications</h1>
              <p className="text-sm text-gray-500">Choose which prediction pool events trigger notifications (push, email, SMS)</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {message && (
                <div className={`p-4 flex items-center gap-2 ${message?.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {message?.type === 'success' ? <Check className="w-5 h-5" /> : <Icon name="AlertCircle" size={20} />}
                  <span>{message?.text}</span>
                </div>
              )}
              <div className="divide-y divide-gray-200">
                {options?.map((opt) => (
                  <div key={opt?.key} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-900">{opt?.label}</div>
                      <div className="text-sm text-gray-500">{opt?.desc}</div>
                    </div>
                    <button
                      onClick={() => toggle(opt?.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${prefs?.[opt?.key] ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prefs?.[opt?.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={savePrefs}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save preferences'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PredictionPoolNotificationsHub;
