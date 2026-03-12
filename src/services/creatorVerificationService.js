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

export const creatorVerificationService = {
  // Get creator verification status
  async getVerificationStatus(creatorId) {
    try {
      const { data, error } = await supabase
        ?.rpc('get_creator_verification_status', {
          p_creator_id: creatorId
        });

      if (error) throw error;
      return { data: toCamelCase(data?.[0]), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get tax ID types for a country
  async getTaxIdTypes(countryCode = null) {
    try {
      let query = supabase
        ?.from('tax_id_types_reference')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('country_name', { ascending: true });

      if (countryCode) {
        query = query?.eq('country_code', countryCode);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Validate tax ID
  async validateTaxId(countryCode, taxId, taxIdType) {
    try {
      const { data, error } = await supabase
        ?.rpc('validate_tax_id', {
          p_country_code: countryCode,
          p_tax_id: taxId,
          p_tax_id_type: taxIdType
        });

      if (error) throw error;
      return { data: toCamelCase(data?.[0]), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update creator verification details
  async updateVerificationDetails(creatorId, details) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase(details);

      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update({
          ...dbData,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', creatorId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Submit verification request
  async submitVerificationRequest(creatorId, verificationData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Validate tax ID first
      const validationResult = await this.validateTaxId(
        verificationData?.countryCode,
        verificationData?.taxId,
        verificationData?.taxIdType
      );

      if (validationResult?.error || !validationResult?.data?.isValid) {
        return {
          data: null,
          error: {
            message: validationResult?.data?.errorMessage || 'Tax ID validation failed'
          }
        };
      }

      const dbData = toSnakeCase({
        countryCode: verificationData?.countryCode,
        taxId: verificationData?.taxId,
        taxIdType: verificationData?.taxIdType,
        bankingDetails: verificationData?.bankingDetails,
        complianceDocs: verificationData?.complianceDocs,
        verificationStatus: 'in_review',
        verificationNotes: verificationData?.notes
      });

      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update({
          ...dbData,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', creatorId)
        ?.select()
        ?.single();

      if (error) throw error;

      // Insert history record
      await supabase
        ?.from('creator_verification_history')
        ?.insert({
          creator_id: creatorId,
          country_code: verificationData?.countryCode,
          tax_id: verificationData?.taxId,
          tax_id_type: verificationData?.taxIdType,
          previous_status: 'pending',
          new_status: 'in_review',
          verification_notes: 'Verification request submitted',
          documents_submitted: verificationData?.complianceDocs || []
        });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Admin: Update verification status
  async updateVerificationStatus(creatorId, newStatus, notes = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.rpc('update_creator_verification', {
          p_creator_id: creatorId,
          p_new_status: newStatus,
          p_verification_notes: notes,
          p_verified_by: user?.id
        });

      if (error) throw error;
      return { data: { success: data }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get verification history
  async getVerificationHistory(creatorId) {
    try {
      const { data, error } = await supabase
        ?.from('creator_verification_history')
        ?.select('*')
        ?.eq('creator_id', creatorId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get all pending verifications (admin)
  async getPendingVerifications() {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('id, username, full_name, country_code, tax_id_type, verification_status, created_at')
        ?.in('verification_status', ['in_review', 'pending'])
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get verified creators by country
  async getVerifiedCreatorsByCountry(countryCode = null) {
    try {
      let query = supabase
        ?.from('user_profiles')
        ?.select('id, username, full_name, country_code, verified_at')
        ?.eq('verification_status', 'verified')
        ?.eq('tax_id_verified', true);

      if (countryCode) {
        query = query?.eq('country_code', countryCode);
      }

      const { data, error } = await query?.order('verified_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Upload compliance document
  async uploadComplianceDocument(creatorId, file, documentType) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${creatorId}/${documentType}_${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase?.storage
        ?.from('compliance-documents')
        ?.upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase?.storage
        ?.from('compliance-documents')
        ?.getPublicUrl(fileName);

      return {
        data: {
          fileName,
          publicUrl,
          documentType,
          uploadedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get countries list
  async getCountriesList() {
    try {
      const { data, error } = await supabase
        ?.from('tax_id_types_reference')
        ?.select('country_code, country_name')
        ?.eq('is_active', true)
        ?.order('country_name', { ascending: true });

      if (error) throw error;

      // Remove duplicates
      const uniqueCountries = data?.reduce((acc, curr) => {
        if (!acc?.find(c => c?.country_code === curr?.country_code)) {
          acc?.push(curr);
        }
        return acc;
      }, []);

      return { data: toCamelCase(uniqueCountries), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};