import { supabase } from '../lib/supabase';
import { analytics } from '../hooks/useGoogleAnalytics';

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

export const taxComplianceService = {
  // Get tax form templates
  async getTaxFormTemplates(countryCode = null, formType = null) {
    try {
      let query = supabase
        ?.from('tax_form_templates')
        ?.select('*')
        ?.eq('is_active', true);

      if (countryCode) {
        query = query?.eq('country_code', countryCode);
      }

      if (formType) {
        query = query?.eq('form_type', formType);
      }

      const { data, error } = await query?.order('form_name', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Generate tax document
  async generateTaxDocument(creatorId, formType, countryCode, taxYear) {
    try {
      const { data, error } = await supabase
        ?.rpc('generate_tax_document', {
          p_creator_id: creatorId,
          p_form_type: formType,
          p_country_code: countryCode,
          p_tax_year: taxYear
        });

      if (error) throw error;

      analytics?.trackEvent('tax_document_generated', {
        form_type: formType,
        country_code: countryCode,
        tax_year: taxYear
      });

      return { data: { documentId: data }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get creator tax documents
  async getCreatorTaxDocuments(creatorId = null, filters = {}) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const userId = creatorId || user?.id;
      if (!userId) throw new Error('Not authenticated');

      let query = supabase
        ?.from('creator_tax_documents')
        ?.select('*')
        ?.eq('creator_id', userId)
        ?.order('created_at', { ascending: false });

      if (filters?.formType) {
        query = query?.eq('form_type', filters?.formType);
      }

      if (filters?.taxYear) {
        query = query?.eq('tax_year', filters?.taxYear);
      }

      if (filters?.status) {
        query = query?.eq('document_status', filters?.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get compliance checklists
  async getComplianceChecklists(countryCode = null) {
    try {
      let query = supabase
        ?.from('compliance_checklists')
        ?.select('*')
        ?.eq('is_active', true);

      if (countryCode) {
        query = query?.eq('country_code', countryCode);
      }

      const { data, error } = await query?.order('checklist_name', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get creator compliance status
  async getCreatorComplianceStatus(creatorId = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const userId = creatorId || user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('creator_compliance_status')
        ?.select(`
          *,
          compliance_checklists(*)
        `)
        ?.eq('creator_id', userId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update compliance status
  async updateComplianceStatus(statusId, updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...updates,
        updatedAt: new Date()?.toISOString()
      });

      const { data, error } = await supabase
        ?.from('creator_compliance_status')
        ?.update(dbData)
        ?.eq('id', statusId)
        ?.select()
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('compliance_status_updated', {
        status_id: statusId,
        completion_percentage: updates?.completionPercentage
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get expiring documents
  async getExpiringDocuments(daysAhead = 30) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const futureDate = new Date();
      futureDate?.setDate(futureDate?.getDate() + daysAhead);

      const { data, error } = await supabase
        ?.from('document_expiration_tracking')
        ?.select('*')
        ?.eq('creator_id', user?.id)
        ?.gte('expiration_date', new Date()?.toISOString())
        ?.lte('expiration_date', futureDate?.toISOString())
        ?.order('expiration_date', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get renewal reminders
  async getRenewalReminders(creatorId = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const userId = creatorId || user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('automated_renewal_reminders')
        ?.select('*')
        ?.eq('creator_id', userId)
        ?.gte('reminder_date', new Date()?.toISOString())
        ?.order('reminder_date', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Schedule expiration reminders
  async scheduleExpirationReminders() {
    try {
      const { data, error } = await supabase
        ?.rpc('schedule_expiration_reminders');

      if (error) throw error;

      analytics?.trackEvent('expiration_reminders_scheduled', {
        reminders_count: data
      });

      return { data: { remindersScheduled: data }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get jurisdiction requirements
  async getJurisdictionRequirements(countryCode = null) {
    try {
      let query = supabase
        ?.from('jurisdiction_requirements')
        ?.select('*')
        ?.eq('is_active', true);

      if (countryCode) {
        query = query?.eq('country_code', countryCode);
      }

      const { data, error } = await query?.order('country_code', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get compliance statistics
  async getComplianceStatistics(creatorId = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const userId = creatorId || user?.id;
      if (!userId) throw new Error('Not authenticated');

      const [documentsResult, statusResult, expiringResult] = await Promise.all([
        this.getCreatorTaxDocuments(userId),
        this.getCreatorComplianceStatus(userId),
        this.getExpiringDocuments(30)
      ]);

      const documents = documentsResult?.data || [];
      const statuses = statusResult?.data || [];
      const expiring = expiringResult?.data || [];

      const statistics = {
        totalDocuments: documents?.length,
        generatedDocuments: documents?.filter(d => d?.documentStatus === 'generated')?.length,
        submittedDocuments: documents?.filter(d => d?.documentStatus === 'submitted')?.length,
        expiredDocuments: documents?.filter(d => d?.documentStatus === 'expired')?.length,
        totalChecklists: statuses?.length,
        completedChecklists: statuses?.filter(s => s?.status === 'completed')?.length,
        inProgressChecklists: statuses?.filter(s => s?.status === 'in_progress')?.length,
        expiringDocuments: expiring?.length,
        averageCompletionRate: statuses?.length > 0
          ? statuses?.reduce((sum, s) => sum + parseFloat(s?.completionPercentage || 0), 0) / statuses?.length
          : 0,
        documentsByType: this.groupByType(documents),
        documentsByCountry: this.groupByCountry(documents)
      };

      return { data: statistics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  groupByType(documents) {
    const grouped = {};
    documents?.forEach(doc => {
      const type = doc?.formType;
      grouped[type] = (grouped?.[type] || 0) + 1;
    });
    return grouped;
  },

  groupByCountry(documents) {
    const grouped = {};
    documents?.forEach(doc => {
      const country = doc?.countryCode;
      grouped[country] = (grouped?.[country] || 0) + 1;
    });
    return grouped;
  },

  // Generate annual tax report
  async generateAnnualTaxReport(creatorId, taxYear, countryCode) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const userId = creatorId || user?.id;
      if (!userId) throw new Error('Not authenticated');

      // Get all earnings for the tax year
      const { data: earnings } = await supabase
        ?.from('wallet_transactions')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.eq('transaction_type', 'winning')
        ?.gte('created_at', `${taxYear}-01-01`)
        ?.lte('created_at', `${taxYear}-12-31`);

      const totalEarnings = earnings?.reduce((sum, e) => sum + parseFloat(e?.amount || 0), 0) || 0;

      // Get all payouts for the tax year
      const { data: payouts } = await supabase
        ?.from('multi_currency_payouts')
        ?.select('*')
        ?.eq('creator_id', userId)
        ?.gte('created_at', `${taxYear}-01-01`)
        ?.lte('created_at', `${taxYear}-12-31`);

      const totalPayouts = payouts?.reduce((sum, p) => sum + parseFloat(p?.net_amount || 0), 0) || 0;

      const reportData = {
        creatorId: userId,
        taxYear,
        countryCode,
        totalEarnings,
        totalPayouts,
        earningsCount: earnings?.length || 0,
        payoutsCount: payouts?.length || 0,
        generatedAt: new Date()?.toISOString()
      };

      analytics?.trackEvent('annual_tax_report_generated', {
        tax_year: taxYear,
        country_code: countryCode,
        total_earnings: totalEarnings
      });

      return { data: reportData, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};