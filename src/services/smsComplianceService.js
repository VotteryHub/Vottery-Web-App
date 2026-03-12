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

export const smsComplianceService = {
  // Get user consent preferences
  async getUserConsent(userId) {
    try {
      const { data, error } = await supabase
        ?.from('sms_consent_preferences')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting user consent:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update user consent preferences
  async updateUserConsent(userId, preferences) {
    try {
      const { data, error } = await supabase
        ?.from('sms_consent_preferences')
        ?.upsert({
          user_id: userId,
          ...toSnakeCase(preferences),
          updated_at: new Date()?.toISOString()
        }, { onConflict: 'user_id' })
        ?.select()
        ?.single();

      if (error) throw error;

      // Log compliance audit
      await supabase?.from('sms_compliance_audit')?.insert({
        user_id: userId,
        action: 'consent_updated',
        details: preferences,
        compliance_type: 'GDPR'
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error updating user consent:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Add user to opt-out list
  async addToOptOutList(phoneNumber, reason, provider = 'both') {
    try {
      const { data, error } = await supabase
        ?.from('sms_suppression_list')
        ?.insert({
          phone_number: phoneNumber,
          reason,
          provider,
          suppression_type: 'opt_out',
          added_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (error) throw error;

      // Log compliance audit
      await supabase?.from('sms_compliance_audit')?.insert({
        action: 'opt_out_added',
        details: { phoneNumber, reason, provider },
        compliance_type: 'TCPA'
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error adding to opt-out list:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Check if phone number is opted out
  async isOptedOut(phoneNumber, provider = 'both') {
    try {
      let query = supabase
        ?.from('sms_suppression_list')
        ?.select('*')
        ?.eq('phone_number', phoneNumber)
        ?.eq('suppression_type', 'opt_out');

      if (provider !== 'both') {
        query = query?.in('provider', [provider, 'both']);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: { optedOut: data?.length > 0, records: toCamelCase(data) }, error: null };
    } catch (error) {
      console.error('Error checking opt-out status:', error);
      return { data: { optedOut: false }, error: { message: error?.message } };
    }
  },

  // Get opt-out list
  async getOptOutList(filters = {}) {
    try {
      let query = supabase
        ?.from('sms_suppression_list')
        ?.select('*')
        ?.eq('suppression_type', 'opt_out')
        ?.order('added_at', { ascending: false });

      if (filters?.provider) {
        query = query?.in('provider', [filters?.provider, 'both']);
      }

      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting opt-out list:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get compliance audit trail
  async getComplianceAudit(filters = {}) {
    try {
      let query = supabase
        ?.from('sms_compliance_audit')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      if (filters?.userId) {
        query = query?.eq('user_id', filters?.userId);
      }

      if (filters?.complianceType) {
        query = query?.eq('compliance_type', filters?.complianceType);
      }

      if (filters?.timeRange) {
        const now = new Date();
        let startDate;
        
        switch (filters?.timeRange) {
          case '24h':
            startDate = new Date(now.setHours(now.getHours() - 24));
            break;
          case '7d':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case '30d':
            startDate = new Date(now.setDate(now.getDate() - 30));
            break;
          default:
            startDate = new Date(now.setHours(now.getHours() - 24));
        }

        query = query?.gte('created_at', startDate?.toISOString());
      }

      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting compliance audit:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Generate compliance report
  async generateComplianceReport(timeRange = '30d') {
    try {
      const [auditResult, optOutResult, consentResult] = await Promise.all([
        this.getComplianceAudit({ timeRange }),
        this.getOptOutList({}),
        supabase?.from('sms_consent_preferences')?.select('*')
      ]);

      const audit = auditResult?.data || [];
      const optOuts = optOutResult?.data || [];
      const consents = consentResult?.data || [];

      const report = {
        period: timeRange,
        generatedAt: new Date()?.toISOString(),
        summary: {
          totalAuditEvents: audit?.length,
          totalOptOuts: optOuts?.length,
          totalConsents: consents?.length,
          gdprCompliant: consents?.filter(c => c?.gdpr_consent)?.length,
          tcpaCompliant: consents?.filter(c => c?.tcpa_consent)?.length
        },
        auditEvents: audit,
        optOutList: optOuts,
        consentPreferences: toCamelCase(consents)
      };

      return { data: report, error: null };
    } catch (error) {
      console.error('Error generating compliance report:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get message retention policy status
  async getRetentionPolicyStatus() {
    try {
      const { data, error } = await supabase
        ?.from('sms_delivery_log')
        ?.select('created_at')
        ?.order('created_at', { ascending: true })
        ?.limit(1)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;

      const oldestMessage = data?.created_at ? new Date(data?.created_at) : null;
      const now = new Date();
      const retentionDays = oldestMessage 
        ? Math.floor((now - oldestMessage) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        data: {
          oldestMessageDate: oldestMessage,
          retentionDays,
          policyCompliant: retentionDays <= 90 // Example: 90-day retention policy
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting retention policy status:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};
