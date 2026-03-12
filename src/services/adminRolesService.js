import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toSnakeCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const snakeKey = key?.replace(/[A-Z]/g, letter => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

export const adminRolesService = {
  async getAllRoles() {
    try {
      const { data, error } = await supabase
        ?.from('admin_roles')
        ?.select('*')
        ?.order('role_name', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getUserAdminRoles(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_admin_roles')
        ?.select(`
          *,
          admin_roles(*)
        `)
        ?.eq('user_id', userId)
        ?.eq('is_active', true);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async assignRole(userId, roleId, assignedBy) {
    try {
      const { data, error } = await supabase
        ?.from('user_admin_roles')
        ?.insert({
          user_id: userId,
          role_id: roleId,
          assigned_by: assignedBy,
          is_active: true
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async revokeRole(userId, roleId) {
    try {
      const { data, error } = await supabase
        ?.from('user_admin_roles')
        ?.update({ is_active: false })
        ?.eq('user_id', userId)
        ?.eq('role_id', roleId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async checkPermission(userId, resource, action) {
    try {
      const { data: roles, error } = await supabase
        ?.from('user_admin_roles')
        ?.select(`
          admin_roles(permissions)
        `)
        ?.eq('user_id', userId)
        ?.eq('is_active', true);

      if (error) throw error;

      // Check if any role has the required permission
      const hasPermission = roles?.some(role => {
        const permissions = role?.admin_roles?.permissions;
        return permissions?.[resource]?.includes(action);
      });

      return { data: hasPermission, error: null };
    } catch (error) {
      return { data: false, error: { message: error?.message } };
    }
  },

  /** Update custom permissions for a role (admin only) */
  async updateRolePermissions(roleId, permissions) {
    try {
      const { data, error } = await supabase
        ?.from('admin_roles')
        ?.update({ permissions: permissions ?? {} })
        ?.eq('id', roleId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
};

export const platformControlsService = {
  async getFeatureToggles() {
    try {
      const { data, error } = await supabase
        ?.from('platform_feature_toggles')
        ?.select('*')
        ?.order('feature_category', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateFeatureToggle(featureName, updates) {
    try {
      const dbData = toSnakeCase(updates);

      const { data, error } = await supabase
        ?.from('platform_feature_toggles')
        ?.update(dbData)
        ?.eq('feature_name', featureName)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getCountryControls() {
    try {
      const { data, error } = await supabase
        ?.from('country_access_controls')
        ?.select('*')
        ?.order('country_name', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateCountryControl(countryCode, updates) {
    try {
      const dbData = toSnakeCase(updates);

      const { data, error } = await supabase
        ?.from('country_access_controls')
        ?.update(dbData)
        ?.eq('country_code', countryCode)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getIntegrationControls() {
    try {
      const { data, error } = await supabase
        ?.from('integration_controls')
        ?.select('*')
        ?.order('integration_type', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateIntegrationControl(integrationName, updates) {
    try {
      const dbData = toSnakeCase(updates);

      const { data, error } = await supabase
        ?.from('integration_controls')
        ?.update(dbData)
        ?.eq('integration_name', integrationName)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};