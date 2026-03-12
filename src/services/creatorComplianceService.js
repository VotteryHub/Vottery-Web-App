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

export const creatorComplianceService = {
  // ============ TAX FORM GENERATION ============
  
  async generateTaxForm(creatorId, countryCode, taxYear, formType) {
    try {
      const { data, error } = await supabase
        ?.rpc('generate_tax_form', {
          p_creator_id: creatorId,
          p_country_code: countryCode,
          p_tax_year: taxYear,
          p_form_type: formType
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getCreatorTaxForms(creatorId, filters = {}) {
    try {
      let query = supabase
        ?.from('creator_tax_forms')
        ?.select('*')
        ?.eq('creator_id', creatorId)
        ?.order('tax_year', { ascending: false });

      if (filters?.taxYear) {
        query = query?.eq('tax_year', filters?.taxYear);
      }

      if (filters?.formType) {
        query = query?.eq('form_type', filters?.formType);
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateTaxFormStatus(formId, status, notes = null) {
    try {
      const updates = { status, updated_at: new Date()?.toISOString() };

      if (status === 'sent') {
        updates.sent_to_creator_at = new Date()?.toISOString();
      } else if (status === 'filed') {
        updates.filed_with_authority_at = new Date()?.toISOString();
      }

      const { data, error } = await supabase
        ?.from('creator_tax_forms')
        ?.update(toSnakeCase(updates))
        ?.eq('id', formId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getExpiringTaxForms(daysAhead = 30) {
    try {
      const futureDate = new Date();
      futureDate?.setDate(futureDate?.getDate() + daysAhead);

      const { data, error } = await supabase
        ?.from('creator_tax_forms')
        ?.select(`
          *,
          creator:creator_id(id, username, full_name, email)
        `)
        ?.not('expiration_date', 'is', null)
        ?.lte('expiration_date', futureDate?.toISOString())
        ?.in('status', ['generated', 'sent'])
        ?.order('expiration_date', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // ============ COMPLIANCE CHECKLISTS ============
  
  async getComplianceChecklist(countryCode) {
    try {
      const { data, error } = await supabase
        ?.from('compliance_checklists')
        ?.select('*')
        ?.eq('country_code', countryCode)
        ?.eq('is_active', true)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAllComplianceChecklists() {
    try {
      const { data, error } = await supabase
        ?.from('compliance_checklists')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('country_name', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createComplianceChecklist(checklistData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase(checklistData);

      const { data, error } = await supabase
        ?.from('compliance_checklists')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateComplianceChecklist(countryCode, updates) {
    try {
      const dbData = toSnakeCase(updates);

      const { data, error } = await supabase
        ?.from('compliance_checklists')
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

  // ============ COMPLIANCE DOCUMENTS ============
  
  async getCreatorComplianceDocuments(creatorId, filters = {}) {
    try {
      let query = supabase
        ?.from('creator_compliance_documents')
        ?.select('*')
        ?.eq('creator_id', creatorId)
        ?.order('created_at', { ascending: false });

      if (filters?.documentType) {
        query = query?.eq('document_type', filters?.documentType);
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.countryCode) {
        query = query?.eq('country_code', filters?.countryCode);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async uploadComplianceDocument(documentData, file) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${user?.id}/${documentData?.documentType}_${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase?.storage
        ?.from('compliance-documents')
        ?.upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase?.storage
        ?.from('compliance-documents')
        ?.getPublicUrl(fileName);

      // Insert document record
      const dbData = toSnakeCase({
        creatorId: user?.id,
        ...documentData,
        documentUrl: urlData?.publicUrl,
        fileSize: file?.size,
        mimeType: file?.type,
        status: 'pending'
      });

      const { data, error } = await supabase
        ?.from('creator_compliance_documents')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async reviewComplianceDocument(documentId, status, reviewNotes = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('creator_compliance_documents')
        ?.update({
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date()?.toISOString(),
          review_notes: reviewNotes
        })
        ?.eq('id', documentId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getExpiringDocuments(daysAhead = 30) {
    try {
      const futureDate = new Date();
      futureDate?.setDate(futureDate?.getDate() + daysAhead);

      const { data, error } = await supabase
        ?.from('creator_compliance_documents')
        ?.select(`
          *,
          creator:creator_id(id, username, full_name, email)
        `)
        ?.not('expiration_date', 'is', null)
        ?.lte('expiration_date', futureDate?.toISOString())
        ?.eq('status', 'approved')
        ?.order('expiration_date', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // ============ RENEWAL REMINDERS ============
  
  async getDocumentRenewalReminders(creatorId = null, status = 'scheduled') {
    try {
      let query = supabase
        ?.from('document_renewal_reminders')
        ?.select(`
          *,
          document:document_id(*),
          creator:creator_id(id, username, full_name, email)
        `)
        ?.eq('status', status)
        ?.order('scheduled_for', { ascending: true });

      if (creatorId) {
        query = query?.eq('creator_id', creatorId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getPendingReminders() {
    try {
      const now = new Date()?.toISOString();

      const { data, error } = await supabase
        ?.from('document_renewal_reminders')
        ?.select(`
          *,
          document:document_id(*),
          creator:creator_id(id, username, full_name, email)
        `)
        ?.eq('status', 'scheduled')
        ?.lte('scheduled_for', now)
        ?.order('scheduled_for', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async markReminderAsSent(reminderId) {
    try {
      const { data, error } = await supabase
        ?.from('document_renewal_reminders')
        ?.update({
          status: 'sent',
          sent_at: new Date()?.toISOString()
        })
        ?.eq('id', reminderId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // ============ ANALYTICS ============
  
  async getComplianceAnalytics(creatorId = null) {
    try {
      let documentsQuery = supabase
        ?.from('creator_compliance_documents')
        ?.select('*');

      let taxFormsQuery = supabase
        ?.from('creator_tax_forms')
        ?.select('*');

      if (creatorId) {
        documentsQuery = documentsQuery?.eq('creator_id', creatorId);
        taxFormsQuery = taxFormsQuery?.eq('creator_id', creatorId);
      }

      const [documentsResult, taxFormsResult] = await Promise.all([
        documentsQuery,
        taxFormsQuery
      ]);

      if (documentsResult?.error) throw documentsResult?.error;
      if (taxFormsResult?.error) throw taxFormsResult?.error;

      const documents = documentsResult?.data || [];
      const taxForms = taxFormsResult?.data || [];

      const analytics = {
        documents: {
          total: documents?.length,
          byStatus: {
            pending: documents?.filter(d => d?.status === 'pending')?.length,
            approved: documents?.filter(d => d?.status === 'approved')?.length,
            rejected: documents?.filter(d => d?.status === 'rejected')?.length,
            expired: documents?.filter(d => d?.status === 'expired')?.length
          },
          byType: {},
          expiringIn30Days: documents?.filter(d => {
            if (!d?.expiration_date) return false;
            const expDate = new Date(d?.expiration_date);
            const now = new Date();
            const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
            return diffDays > 0 && diffDays <= 30;
          })?.length
        },
        taxForms: {
          total: taxForms?.length,
          byStatus: {
            generated: taxForms?.filter(f => f?.status === 'generated')?.length,
            sent: taxForms?.filter(f => f?.status === 'sent')?.length,
            filed: taxForms?.filter(f => f?.status === 'filed')?.length,
            expired: taxForms?.filter(f => f?.status === 'expired')?.length
          },
          byFormType: {},
          totalEarnings: taxForms?.reduce((sum, f) => sum + parseFloat(f?.total_earnings || 0), 0)
        }
      };

      // Group documents by type
      documents?.forEach(doc => {
        const type = doc?.document_type || 'unknown';
        analytics.documents.byType[type] = (analytics?.documents?.byType?.[type] || 0) + 1;
      });

      // Group tax forms by type
      taxForms?.forEach(form => {
        const type = form?.form_type || 'unknown';
        analytics.taxForms.byFormType[type] = (analytics?.taxForms?.byFormType?.[type] || 0) + 1;
      });

      return { data: analytics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};