import { supabase } from '../lib/supabase';

class AdminControlsService {
  // ============ PLATFORM FEATURES MANAGEMENT ============
  
  async getAllFeatures() {
    try {
      const { data, error } = await supabase?.from('platform_feature_toggles')?.select('*')?.order('feature_name', { ascending: true });
      if (error) throw error;
      const features = (data || []).map((f) => ({
        ...f,
        feature_key: f.feature_key ?? f.feature_name?.toLowerCase?.()?.replace(/\s+/g, '_'),
        feature_category: f.category ?? f.feature_category
      }));
      return { success: true, features };
    } catch (error) {
      console.error('Get all features error:', error);
      return { success: false, error: error?.message };
    }
  }

  async toggleFeature(featureKey, enabled) {
    try {
      const key = String(featureKey || '').trim();
      let { data, error } = await supabase?.from('platform_feature_toggles')?.update({ is_enabled: enabled, updated_at: new Date()?.toISOString() })?.eq('feature_key', key)?.select()?.single();
      if (error || !data) {
        const res = await supabase?.from('platform_feature_toggles')?.update({ is_enabled: enabled, updated_at: new Date()?.toISOString() })?.eq('feature_name', key)?.select()?.single();
        if (res?.error) throw res.error;
        return { success: true, feature: res?.data };
      }
      return { success: true, feature: data };
    } catch (error) {
      console.error('Toggle feature error:', error);
      return { success: false, error: error?.message };
    }
  }

  async updateFeatureCountries(featureKey, enabledCountries, disabledCountries) {
    try {
      const { data, error } = await supabase?.from('platform_feature_toggles')?.update({
          enabled_countries: enabledCountries ?? [],
          disabled_countries: disabledCountries ?? [],
          updated_at: new Date()?.toISOString()
        })?.eq('feature_key', featureKey)?.select()?.single();
      if (error) throw error;
      return { success: true, feature: data };
    } catch (error) {
      console.error('Update feature countries error:', error);
      return { success: false, error: error?.message };
    }
  }

  // ============ COUNTRY ACCESS CONTROLS ============
  
  async getAllCountries() {
    try {
      const { data, error } = await supabase?.from('country_access_controls')?.select('*')?.order('country_name', { ascending: true });

      if (error) throw error;

      return { success: true, countries: data };
    } catch (error) {
      console.error('Get all countries error:', error);
      return { success: false, error: error?.message };
    }
  }

  async toggleCountry(countryCode, enabled) {
    try {
      const { data, error } = await supabase?.from('country_access_controls')?.update({ is_enabled: enabled, updated_at: new Date()?.toISOString() })?.eq('country_code', countryCode)?.select()?.single();

      if (error) throw error;

      return { success: true, country: data };
    } catch (error) {
      console.error('Toggle country error:', error);
      return { success: false, error: error?.message };
    }
  }

  async updateCountrySettings(countryCode, settings) {
    try {
      const { data, error } = await supabase?.from('country_access_controls')?.update({
          ...settings,
          updated_at: new Date()?.toISOString()
        })?.eq('country_code', countryCode)?.select()?.single();

      if (error) throw error;

      return { success: true, country: data };
    } catch (error) {
      console.error('Update country settings error:', error);
      return { success: false, error: error?.message };
    }
  }

  // ============ INTEGRATION CONTROLS ============
  
  async getAllIntegrations() {
    try {
      const { data, error } = await supabase?.from('integration_controls')?.select('*')?.order('integration_type', { ascending: true });

      if (error) throw error;

      return { success: true, integrations: data };
    } catch (error) {
      console.error('Get all integrations error:', error);
      return { success: false, error: error?.message };
    }
  }

  async toggleIntegration(integrationKeyOrName, enabled) {
    try {
      const col = 'integration_name';
      const { data, error } = await supabase?.from('integration_controls')?.update({ is_enabled: enabled, updated_at: new Date()?.toISOString() })?.eq(col, integrationKeyOrName)?.select()?.single();
      if (error) {
        const byKey = await supabase?.from('integration_controls')?.update({ is_enabled: enabled, updated_at: new Date()?.toISOString() })?.eq('integration_key', integrationKeyOrName)?.select()?.single();
        if (byKey?.error) throw error;
        return { success: true, integration: byKey?.data };
      }
      return { success: true, integration: data };
    } catch (error) {
      console.error('Toggle integration error:', error);
      return { success: false, error: error?.message };
    }
  }

  async updateIntegrationLimits(integrationKeyOrName, weeklyCostLimit, monthlyCostLimit) {
    try {
      const col = 'integration_name';
      let { data, error } = await supabase?.from('integration_controls')?.update({
          weekly_cost_limit: weeklyCostLimit,
          monthly_cost_limit: monthlyCostLimit,
          updated_at: new Date()?.toISOString()
        })?.eq(col, integrationKeyOrName)?.select()?.single();
      if (error) {
        const res = await supabase?.from('integration_controls')?.update({
          weekly_cost_limit: weeklyCostLimit,
          monthly_cost_limit: monthlyCostLimit,
          updated_at: new Date()?.toISOString()
        })?.eq('integration_key', integrationKeyOrName)?.select()?.single();
        if (res?.error) throw error;
        return { success: true, integration: res?.data };
      }
      return { success: true, integration: data };
    } catch (error) {
      console.error('Update integration limits error:', error);
      return { success: false, error: error?.message };
    }
  }

  async getIntegrationUsage(integrationKey, startDate, endDate) {
    try {
      const { data, error } = await supabase?.from('integration_usage_logs')?.select('*')?.eq('integration_key', integrationKey)?.gte('created_at', startDate)?.lte('created_at', endDate)?.order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate total cost
      const totalCost = data?.reduce((sum, log) => sum + parseFloat(log?.cost || 0), 0);

      return { success: true, usage: data, totalCost };
    } catch (error) {
      console.error('Get integration usage error:', error);
      return { success: false, error: error?.message };
    }
  }

  async logIntegrationUsage(integrationKey, operation, cost, metadata = {}) {
    try {
      const { data, error } = await supabase?.from('integration_usage_logs')?.insert({
          integration_key: integrationKey,
          operation,
          cost,
          status: 'success',
          metadata,
        })?.select()?.single();

      if (error) throw error;

      // Update current spend
      await this.updateIntegrationSpend(integrationKey, cost);

      return { success: true, log: data };
    } catch (error) {
      console.error('Log integration usage error:', error);
      return { success: false, error: error?.message };
    }
  }

  async updateIntegrationSpend(integrationKeyOrName, cost) {
    try {
      const byName = await supabase?.from('integration_controls')?.select('*')?.eq('integration_name', integrationKeyOrName)?.single();
      const byKey = await supabase?.from('integration_controls')?.select('*')?.eq('integration_key', integrationKeyOrName)?.single();
      const integration = byName?.data ?? byKey?.data;
      const keyCol = byName?.data ? 'integration_name' : 'integration_key';
      if (!integration) throw new Error('Integration not found');

      const { error } = await supabase?.from('integration_controls')?.update({
          current_weekly_spend: parseFloat(integration?.current_weekly_spend || 0) + parseFloat(cost),
          current_monthly_spend: parseFloat(integration?.current_monthly_spend || 0) + parseFloat(cost),
        })?.eq(keyCol, integrationKeyOrName);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Update integration spend error:', error);
      return { success: false, error: error?.message };
    }
  }

  // ============ ADMIN ROLES MANAGEMENT ============
  
  async getAllRoles() {
    try {
      const { data, error } = await supabase?.from('admin_roles')?.select('*')?.order('role_name', { ascending: true });

      if (error) throw error;

      return { success: true, roles: data };
    } catch (error) {
      console.error('Get all roles error:', error);
      return { success: false, error: error?.message };
    }
  }

  async assignRole(userId, roleId, assignedBy) {
    try {
      const { data, error } = await supabase?.from('user_role_assignments')?.insert({
          user_id: userId,
          role_id: roleId,
          assigned_by: assignedBy,
          is_active: true,
        })?.select()?.single();

      if (error) throw error;

      return { success: true, assignment: data };
    } catch (error) {
      console.error('Assign role error:', error);
      return { success: false, error: error?.message };
    }
  }

  async revokeRole(userId, roleId) {
    try {
      const { data, error } = await supabase?.from('user_role_assignments')?.update({ is_active: false })?.eq('user_id', userId)?.eq('role_id', roleId)?.select()?.single();

      if (error) throw error;

      return { success: true, assignment: data };
    } catch (error) {
      console.error('Revoke role error:', error);
      return { success: false, error: error?.message };
    }
  }

  async getUserRoles(userId) {
    try {
      const { data, error } = await supabase?.from('user_role_assignments')?.select(`
          *,
          admin_roles (*)
        `)?.eq('user_id', userId)?.eq('is_active', true);

      if (error) throw error;

      return { success: true, roles: data };
    } catch (error) {
      console.error('Get user roles error:', error);
      return { success: false, error: error?.message };
    }
  }
}

export default new AdminControlsService();