import { supabase } from '../lib/supabase';

const INTEGRATION_NAME_ALIASES = {
  gemini: 'Gemini',
  anthropic: 'Anthropic',
  resend: 'Resend',
  twilio: 'Twilio',
  telnyx: 'Telnyx',
  whatsapp: 'WhatsApp (Twilio)',
  push: 'Push Notifications',
  google_analytics: 'Google Analytics',
  google_adsense: 'Google AdSense',
  stripe: 'Stripe',
};

const EXTERNAL_AD_NETWORK_DEFAULTS = [
  { integration_name: 'Google AdSense', integration_type: 'advertising' },
  { integration_name: 'Google Analytics', integration_type: 'analytics' },
];

function normalizeIntegrationName(name) {
  const key = String(name || '').trim().toLowerCase().replace(/\s+/g, '_');
  return INTEGRATION_NAME_ALIASES[key] || name;
}

export const integrationSettingsService = {
  async getAll() {
    const { data, error } = await supabase
      ?.from('integration_settings')
      ?.select('*')
      ?.order('integration_name');
    if (error) throw error;
    return data ?? [];
  },

  async getByName(integrationName) {
    const normalized = normalizeIntegrationName(integrationName);
    const { data, error } = await supabase
      ?.from('integration_settings')
      ?.select('*')
      ?.eq('integration_name', normalized)
      ?.single();
    if (error && error?.code !== 'PGRST116') throw error;
    return data;
  },

  async upsert(row) {
    const { data, error } = await supabase
      ?.from('integration_settings')
      ?.upsert(
        {
          integration_name: row?.integration_name,
          integration_type: row?.integration_type ?? 'communication',
          is_enabled: row?.is_enabled ?? false,
          api_key_masked: row?.api_key_masked ?? null,
          weekly_budget_cap: row?.weekly_budget_cap ?? 0,
          monthly_budget_cap: row?.monthly_budget_cap ?? 0,
          current_weekly_usage: row?.current_weekly_usage ?? 0,
          current_monthly_usage: row?.current_monthly_usage ?? 0,
          rate_limit_per_minute: row?.rate_limit_per_minute ?? 60,
          config: row?.config ?? {},
          updated_at: new Date()?.toISOString(),
          last_modified_by: row?.last_modified_by ?? undefined
        },
        { onConflict: 'integration_name' }
      )
      ?.select()
      ?.single();
    if (error) throw error;
    return data;
  },

  async setEnabled(integrationName, isEnabled, userId = null, integrationType = null) {
    const existing = await this.getByName(integrationName);
    return this.upsert({
      ...existing,
      integration_name: integrationName,
      integration_type: integrationType ?? existing?.integration_type ?? 'communication',
      is_enabled: isEnabled,
      last_modified_by: userId
    });
  },

  async setBudgetCaps(integrationName, weeklyCap, monthlyCap, userId = null) {
    const existing = await this.getByName(integrationName);
    return this.upsert({
      ...existing,
      integration_name: integrationName,
      integration_type: existing?.integration_type ?? 'communication',
      weekly_budget_cap: weeklyCap ?? existing?.weekly_budget_cap ?? 0,
      monthly_budget_cap: monthlyCap ?? existing?.monthly_budget_cap ?? 0,
      last_modified_by: userId
    });
  },

  async ensureBatch1ExternalAdDefaults(userId = null) {
    for (const row of EXTERNAL_AD_NETWORK_DEFAULTS) {
      const existing = await this.getByName(row.integration_name);
      await this.upsert({
        ...existing,
        integration_name: row.integration_name,
        integration_type: existing?.integration_type || row.integration_type,
        is_enabled: existing?.is_enabled ?? true,
        weekly_budget_cap: existing?.weekly_budget_cap ?? 0,
        monthly_budget_cap: existing?.monthly_budget_cap ?? 0,
        last_modified_by: userId,
      });
    }
    return true;
  },

  async canUseIntegration(integrationName, projectedCost = 0) {
    const config = await this.getByName(integrationName);
    if (!config) {
      return {
        allowed: false,
        reason: `Integration "${integrationName}" is not configured`,
      };
    }
    if (!config?.is_enabled) {
      return { allowed: false, reason: `${config.integration_name} is disabled` };
    }

    const weeklyCap = Number(config?.weekly_budget_cap || 0);
    const monthlyCap = Number(config?.monthly_budget_cap || 0);
    const weeklyUsage = Number(config?.current_weekly_usage || 0);
    const monthlyUsage = Number(config?.current_monthly_usage || 0);
    const nextCost = Number(projectedCost || 0);

    if (weeklyCap > 0 && weeklyUsage + nextCost > weeklyCap) {
      return { allowed: false, reason: `${config.integration_name} weekly cap exceeded` };
    }
    if (monthlyCap > 0 && monthlyUsage + nextCost > monthlyCap) {
      return { allowed: false, reason: `${config.integration_name} monthly cap exceeded` };
    }
    return { allowed: true, reason: null, config };
  },

  async recordUsage(integrationName, costDelta = 0) {
    const config = await this.getByName(integrationName);
    if (!config) return null;
    return this.upsert({
      ...config,
      integration_name: config.integration_name,
      current_weekly_usage: Number(config?.current_weekly_usage || 0) + Number(costDelta || 0),
      current_monthly_usage: Number(config?.current_monthly_usage || 0) + Number(costDelta || 0),
    });
  },

  async bulkSetEnabledByType(type, isEnabled, userId = null) {
    const { data: all, error: fetchError } = await supabase
      ?.from('integration_settings')
      ?.select('*')
      ?.eq('integration_type', type);
    
    if (fetchError) throw fetchError;
    if (!all || all.length === 0) return [];

    const rows = all.map(i => ({
      ...i,
      is_enabled: isEnabled,
      last_modified_by: userId,
      updated_at: new Date()?.toISOString()
    }));

    const { data, error } = await supabase
      ?.from('integration_settings')
      ?.upsert(rows, { onConflict: 'integration_name' });
    
    if (error) throw error;
    return data;
  },
};
