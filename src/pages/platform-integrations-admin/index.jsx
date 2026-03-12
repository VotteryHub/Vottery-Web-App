import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { integrationSettingsService } from '../../services/integrationSettingsService';
import { useAuth } from '../../contexts/AuthContext';

const DEFAULT_INTEGRATIONS = [
  { name: 'Stripe', type: 'payment' },
  { name: 'Google AdSense', type: 'advertising' },
  { name: 'Resend', type: 'communication' },
  { name: 'Twilio', type: 'communication' },
  { name: 'OpenAI', type: 'ai_service' },
  { name: 'Anthropic', type: 'ai_service' },
  { name: 'Perplexity', type: 'ai_service' },
  { name: 'Google Analytics', type: 'ai_service' },
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

  const list = DEFAULT_INTEGRATIONS.map(d => ({
    ...d,
    ...mapByName[d.name],
    is_enabled: mapByName[d.name] ? mapByName[d.name].is_enabled : false
  }));

  return (
    <>
      <Helmet>
        <title>Platform Integrations - Vottery Admin</title>
      </Helmet>
      <HeaderNavigation />
      <main className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
                <Icon name="Plug" size={28} />
                Platform Integrations
              </h1>
              <p className="text-muted-foreground mt-1">
                Enable or disable integrations and set weekly/monthly cost limits.
              </p>
            </div>
            <Button variant="secondary" onClick={load} disabled={loading}>
              Refresh
            </Button>
          </div>

          {message?.text && (
            <div className={`mb-4 p-3 rounded-lg ${message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((int) => (
                <div
                  key={int.name}
                  className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">{int.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">({int.integration_type || int.type})</span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleToggle(int.name, int.is_enabled, int.type)}
                      disabled={saving === int.name}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${int.is_enabled ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'}`}
                    >
                      {saving === int.name ? '…' : int.is_enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    {editingBudget === int.name ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Input
                          type="number"
                          placeholder="Weekly cap"
                          defaultValue={int.weekly_budget_cap ?? 0}
                          min={0}
                          step={1}
                          id={`weekly-${int.name}`}
                          className="w-28"
                        />
                        <Input
                          type="number"
                          placeholder="Monthly cap"
                          defaultValue={int.monthly_budget_cap ?? 0}
                          min={0}
                          step={1}
                          id={`monthly-${int.name}`}
                          className="w-28"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            const w = document.getElementById(`weekly-${int.name}`)?.value;
                            const m = document.getElementById(`monthly-${int.name}`)?.value;
                            handleSaveBudget(int.name, w, m);
                          }}
                          disabled={saving === int.name}
                        >
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditingBudget(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Weekly: {Number(int.weekly_budget_cap ?? 0).toFixed(2)} / Month: {Number(int.monthly_budget_cap ?? 0).toFixed(2)}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => setEditingBudget(int.name)}>
                          Set limits
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default PlatformIntegrationsAdmin;
