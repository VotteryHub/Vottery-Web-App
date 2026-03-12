import { supabase } from '../lib/supabase';

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
    const { data, error } = await supabase
      ?.from('integration_settings')
      ?.select('*')
      ?.eq('integration_name', integrationName)
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
  }
};
