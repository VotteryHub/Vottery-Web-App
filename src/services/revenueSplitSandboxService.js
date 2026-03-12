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

export const revenueSplitSandboxService = {
  // Get all sandbox configurations
  async getAllSandboxConfigs() {
    try {
      const { data, error } = await supabase
        ?.from('revenue_split_sandbox_config')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get active sandbox configurations
  async getActiveSandboxConfigs() {
    try {
      const { data, error } = await supabase
        ?.from('revenue_split_sandbox_config')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Create sandbox configuration
  async createSandboxConfig(configData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...configData,
        createdBy: user?.id
      });

      const { data, error } = await supabase
        ?.from('revenue_split_sandbox_config')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update sandbox configuration
  async updateSandboxConfig(configId, updates) {
    try {
      const dbData = toSnakeCase({
        ...updates,
        updatedAt: new Date()?.toISOString()
      });

      const { data, error } = await supabase
        ?.from('revenue_split_sandbox_config')
        ?.update(dbData)
        ?.eq('id', configId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Delete sandbox configuration
  async deleteSandboxConfig(configId) {
    try {
      const { error } = await supabase
        ?.from('revenue_split_sandbox_config')
        ?.delete()
        ?.eq('id', configId);

      if (error) throw error;
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Calculate sandbox payouts
  async calculateSandboxPayouts(sandboxConfigId, testRevenue = 100000) {
    try {
      const { data, error } = await supabase
        ?.rpc('calculate_sandbox_payouts', {
          p_sandbox_config_id: sandboxConfigId,
          p_test_revenue: testRevenue
        });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Validate sandbox configuration
  async validateSandboxConfig(sandboxConfigId) {
    try {
      const { data, error } = await supabase
        ?.rpc('validate_sandbox_config', {
          p_sandbox_config_id: sandboxConfigId
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Create test scenario
  async createTestScenario(scenarioData) {
    try {
      const dbData = toSnakeCase(scenarioData);

      const { data, error } = await supabase
        ?.from('revenue_split_test_scenarios')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get test scenarios for sandbox config
  async getTestScenarios(sandboxConfigId) {
    try {
      const { data, error } = await supabase
        ?.from('revenue_split_test_scenarios')
        ?.select('*')
        ?.eq('sandbox_config_id', sandboxConfigId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update test scenario
  async updateTestScenario(scenarioId, updates) {
    try {
      const dbData = toSnakeCase(updates);

      const { data, error } = await supabase
        ?.from('revenue_split_test_scenarios')
        ?.update(dbData)
        ?.eq('id', scenarioId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Store sandbox payout results
  async storeSandboxPayouts(payoutData) {
    try {
      const dbData = toSnakeCase(payoutData);

      const { data, error } = await supabase
        ?.from('revenue_split_sandbox_payouts')
        ?.insert(dbData)
        ?.select();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get sandbox payout results
  async getSandboxPayouts(sandboxConfigId) {
    try {
      const { data, error } = await supabase
        ?.from('revenue_split_sandbox_payouts')
        ?.select('*')
        ?.eq('sandbox_config_id', sandboxConfigId)
        ?.order('calculated_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Store validation results
  async storeValidationResults(validationData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...validationData,
        validatedBy: user?.id,
        validatedAt: new Date()?.toISOString()
      });

      const { data, error } = await supabase
        ?.from('revenue_split_sandbox_validations')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get validation results
  async getValidationResults(sandboxConfigId) {
    try {
      const { data, error } = await supabase
        ?.from('revenue_split_sandbox_validations')
        ?.select('*')
        ?.eq('sandbox_config_id', sandboxConfigId)
        ?.order('validated_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Migrate sandbox to production
  async migrateSandboxToProduction(sandboxConfigId, migrationType) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.rpc('migrate_sandbox_to_production', {
          p_sandbox_config_id: sandboxConfigId,
          p_migration_type: migrationType,
          p_approved_by: user?.id
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get migration history
  async getMigrationHistory(sandboxConfigId) {
    try {
      const { data, error } = await supabase
        ?.from('revenue_split_sandbox_migrations')
        ?.select('*')
        ?.eq('sandbox_config_id', sandboxConfigId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};