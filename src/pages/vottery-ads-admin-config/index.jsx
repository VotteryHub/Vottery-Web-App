import React, { useEffect, useState } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';

const numberOr = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const VotteryAdsAdminConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    min_daily_budget_cents: 500,
    min_campaign_budget_cents: 10000,
    max_report_count_emergency_brake: 5,
    attribution_click_days: 7,
    attribution_view_days: 1,
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vottery_ads_admin_config')
        .select('key,value_json');
      if (error) throw error;
      const next = { ...config };
      (data || []).forEach((r) => {
        next[r.key] = typeof r.value_json === 'string' ? Number(r.value_json) : r.value_json;
      });
      setConfig({
        min_daily_budget_cents: numberOr(next.min_daily_budget_cents, 500),
        min_campaign_budget_cents: numberOr(next.min_campaign_budget_cents, 10000),
        max_report_count_emergency_brake: numberOr(next.max_report_count_emergency_brake, 5),
        attribution_click_days: numberOr(next.attribution_click_days, 7),
        attribution_view_days: numberOr(next.attribution_view_days, 1),
      });
    } catch (e) {
      console.error('Failed to load ads admin config', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upsertKey = async (key, value) => {
    const { error } = await supabase
      .from('vottery_ads_admin_config')
      .upsert({ key, value_json: String(value), updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
  };

  const save = async () => {
    setSaving(true);
    try {
      await Promise.all([
        upsertKey('min_daily_budget_cents', config.min_daily_budget_cents),
        upsertKey('min_campaign_budget_cents', config.min_campaign_budget_cents),
        upsertKey('max_report_count_emergency_brake', config.max_report_count_emergency_brake),
        upsertKey('attribution_click_days', config.attribution_click_days),
        upsertKey('attribution_view_days', config.attribution_view_days),
      ]);
      await load();
    } catch (e) {
      console.error('Save config failed', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <main className="max-w-[1000px] mx-auto px-4 py-6 md:py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Vottery Ads Admin Config
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tune budgets, safety thresholds, and attribution windows.
            </p>
          </div>
          <Button
            variant="default"
            iconName={saving ? 'Loader' : 'Save'}
            onClick={save}
            disabled={loading || saving}
            className={saving ? 'animate-spin' : ''}
          >
            Save
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Loader" size={18} className="animate-spin" />
            Loading…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConfigNumberCard
              label="Min daily budget (cents)"
              help="Example: 500 = $5.00"
              value={config.min_daily_budget_cents}
              onChange={(v) => setConfig((c) => ({ ...c, min_daily_budget_cents: v }))}
            />
            <ConfigNumberCard
              label="Min campaign budget (cents)"
              help="Example: 10000 = $100.00"
              value={config.min_campaign_budget_cents}
              onChange={(v) => setConfig((c) => ({ ...c, min_campaign_budget_cents: v }))}
            />
            <ConfigNumberCard
              label="Emergency brake: max report count"
              help="When exceeded, ad becomes pending_review"
              value={config.max_report_count_emergency_brake}
              onChange={(v) => setConfig((c) => ({ ...c, max_report_count_emergency_brake: v }))}
            />
            <ConfigNumberCard
              label="Attribution click window (days)"
              help="Default: 7"
              value={config.attribution_click_days}
              onChange={(v) => setConfig((c) => ({ ...c, attribution_click_days: v }))}
            />
            <ConfigNumberCard
              label="Attribution view window (days)"
              help="Default: 1"
              value={config.attribution_view_days}
              onChange={(v) => setConfig((c) => ({ ...c, attribution_view_days: v }))}
            />
          </div>
        )}
      </main>
    </div>
  );
};

const ConfigNumberCard = ({ label, help, value, onChange }) => (
  <div className="bg-card border border-border rounded-xl p-5">
    <div className="text-sm font-medium text-foreground">{label}</div>
    <div className="text-xs text-muted-foreground mt-1">{help}</div>
    <input
      className="mt-4 w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
      type="number"
      value={value}
      onChange={(e) => onChange(numberOr(e.target.value, 0))}
    />
  </div>
);

export default VotteryAdsAdminConfig;

