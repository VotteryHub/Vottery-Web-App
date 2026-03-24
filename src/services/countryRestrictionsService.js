import { supabase } from '../lib/supabase';

export const countryRestrictionsService = {
  async getAll() {
    const { data, error } = await supabase
      ?.from('country_restrictions')
      ?.select('*')
      ?.order('country_name');
    if (error) throw error;
    return data ?? [];
  },

  async getByCountryCode(countryCode) {
    const { data, error } = await supabase
      ?.from('country_restrictions')
      ?.select('*')
      ?.eq('country_code', countryCode)
      ?.single();
    if (error && error?.code !== 'PGRST116') throw error;
    return data;
  },

  async upsert(row) {
    const { data, error } = await supabase
      ?.from('country_restrictions')
      ?.upsert(
        {
          country_code: row?.country_code,
          country_name: row?.country_name ?? row?.country_code,
          is_enabled: row?.is_enabled ?? true,
          biometric_allowed: row?.biometric_allowed ?? true,
          fee_zone: row?.fee_zone ?? null,
          compliance_level: row?.compliance_level ?? 'moderate',
          data_residency: row?.data_residency ?? null,
          feature_overrides: row?.feature_overrides ?? {},
          updated_at: new Date()?.toISOString(),
          last_modified_by: row?.last_modified_by ?? undefined
        },
        { onConflict: 'country_code' }
      )
      ?.select()
      ?.single();
    if (error) throw error;
    return data;
  },

  async setEnabled(countryCode, isEnabled, userId = null) {
    return this.upsert({
      country_code: countryCode,
      country_name: countryCode,
      is_enabled: isEnabled,
      last_modified_by: userId
    });
  },

  async setBiometricAllowed(countryCode, allowed, userId = null) {
    const existing = await this.getByCountryCode(countryCode);
    return this.upsert({
      ...existing,
      country_code: countryCode,
      biometric_allowed: allowed,
      last_modified_by: userId
    });
  },

  async isCountryEnabled(countryCode) {
    if (!countryCode) return true;
    const country = await this.getByCountryCode(countryCode);
    if (!country) return true;
    return country?.is_enabled !== false;
  }
};
