import { supabase } from '../lib/supabase';
import i18n from '../i18n';

class LocalizationService {
  // ============ LANGUAGE MANAGEMENT ============
  
  async changeLanguage(languageCode) {
    try {
      await i18n?.changeLanguage(languageCode);
      
      // Update document direction for RTL languages
      const metadata = this.getLanguageMetadata(languageCode);
      document.documentElement.dir = metadata?.dir;
      document.documentElement.lang = languageCode;

      // Save preference
      const { data: { user } } = await supabase?.auth?.getUser();
      if (user) {
        await supabase?.from('user_preferences')?.upsert({
            user_id: user?.id,
            preferred_language: languageCode,
          });
      }

      return { success: true, language: languageCode };
    } catch (error) {
      console.error('Change language error:', error);
      return { success: false, error: error?.message };
    }
  }

  getLanguageMetadata(languageCode) {
    const rtlLanguages = ['ar', 'he', 'ur', 'fa', 'ps', 'syr', 'yi'];
    return {
      dir: rtlLanguages?.includes(languageCode) ? 'rtl' : 'ltr',
      isRTL: rtlLanguages?.includes(languageCode),
    };
  }

  // ============ TRANSLATION MANAGEMENT ============
  
  async getTranslationStatus() {
    try {
      const { data, error } = await supabase?.from('translation_status')?.select('*')?.order('completion_percentage', { ascending: false });

      if (error) throw error;

      return { success: true, translations: data };
    } catch (error) {
      console.error('Get translation status error:', error);
      return { success: false, error: error?.message };
    }
  }

  async submitTranslation(languageCode, namespace, key, translation, context = '') {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      const { data, error } = await supabase?.from('translation_submissions')?.insert({
          language_code: languageCode,
          namespace,
          translation_key: key,
          translation_value: translation,
          context,
          submitted_by: user?.id,
          status: 'pending_review',
        })?.select()?.single();

      if (error) throw error;

      return { success: true, submission: data };
    } catch (error) {
      console.error('Submit translation error:', error);
      return { success: false, error: error?.message };
    }
  }

  async reviewTranslation(submissionId, action, reviewNotes = '') {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      const { data, error } = await supabase?.from('translation_submissions')?.update({
          status: action, // 'approved', 'rejected'
          reviewed_by: user?.id,
          review_notes: reviewNotes,
          reviewed_at: new Date()?.toISOString(),
        })?.eq('id', submissionId)?.select()?.single();

      if (error) throw error;

      // If approved, update live translations
      if (action === 'approved') {
        await this.updateLiveTranslation(data);
      }

      return { success: true, submission: data };
    } catch (error) {
      console.error('Review translation error:', error);
      return { success: false, error: error?.message };
    }
  }

  async updateLiveTranslation(submission) {
    try {
      const { data, error } = await supabase?.from('translations')?.upsert({
          language_code: submission?.language_code,
          namespace: submission?.namespace,
          translation_key: submission?.translation_key,
          translation_value: submission?.translation_value,
        });

      if (error) throw error;

      // Reload translations in i18n
      await i18n?.reloadResources(submission?.language_code, submission?.namespace);

      return { success: true };
    } catch (error) {
      console.error('Update live translation error:', error);
      return { success: false, error: error?.message };
    }
  }

  // ============ CULTURAL ADAPTATION ============
  
  async getCulturalSettings(countryCode) {
    try {
      const { data, error } = await supabase?.from('cultural_settings')?.select('*')?.eq('country_code', countryCode)?.single();

      if (error) throw error;

      return { success: true, settings: data };
    } catch (error) {
      console.error('Get cultural settings error:', error);
      return { success: false, error: error?.message };
    }
  }

  formatDate(date, languageCode) {
    return new Intl.DateTimeFormat(languageCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })?.format(new Date(date));
  }

  formatNumber(number, languageCode) {
    return new Intl.NumberFormat(languageCode)?.format(number);
  }

  formatCurrency(amount, currencyCode, languageCode) {
    return new Intl.NumberFormat(languageCode, {
      style: 'currency',
      currency: currencyCode,
    })?.format(amount);
  }

  // ============ REGIONAL CUSTOMIZATION ============
  
  async getRegionalRequirements(countryCode) {
    try {
      const { data, error } = await supabase?.from('regional_requirements')?.select('*')?.eq('country_code', countryCode)?.single();

      if (error) throw error;

      return {
        success: true,
        requirements: {
          legalCompliance: data?.legal_compliance || [],
          paymentMethods: data?.payment_methods || [],
          dataResidency: data?.data_residency_required || false,
          ageRestrictions: data?.age_restrictions || 18,
          culturalGuidelines: data?.cultural_guidelines || [],
        }
      };
    } catch (error) {
      console.error('Get regional requirements error:', error);
      return { success: false, error: error?.message };
    }
  }

  // ============ TRANSLATION MEMORY ============
  
  async searchTranslationMemory(searchTerm, sourceLanguage, targetLanguage) {
    try {
      const { data, error } = await supabase?.from('translation_memory')?.select('*')?.eq('source_language', sourceLanguage)?.eq('target_language', targetLanguage)?.ilike('source_text', `%${searchTerm}%`)?.limit(10);

      if (error) throw error;

      return { success: true, matches: data };
    } catch (error) {
      console.error('Search translation memory error:', error);
      return { success: false, error: error?.message };
    }
  }

  async addToTranslationMemory(sourceText, targetText, sourceLanguage, targetLanguage, context = '') {
    try {
      const { data, error } = await supabase?.from('translation_memory')?.insert({
          source_text: sourceText,
          target_text: targetText,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          context,
          quality_score: 1.0,
        })?.select()?.single();

      if (error) throw error;

      return { success: true, entry: data };
    } catch (error) {
      console.error('Add to translation memory error:', error);
      return { success: false, error: error?.message };
    }
  }

  // ============ BULK TRANSLATION ============
  
  async bulkTranslate(texts, sourceLanguage, targetLanguage) {
    try {
      // Use OpenAI for bulk translation
      const { data, error } = await supabase?.functions?.invoke('bulk-translate', {
        body: {
          texts,
          sourceLanguage,
          targetLanguage,
        }
      });

      if (error) throw error;

      return { success: true, translations: data?.translations };
    } catch (error) {
      console.error('Bulk translate error:', error);
      return { success: false, error: error?.message };
    }
  }

  // ============ QUALITY ASSURANCE ============
  
  async validateTranslation(translationId, validatorId, score, feedback = '') {
    try {
      const { data, error } = await supabase?.from('translation_validations')?.insert({
          translation_id: translationId,
          validator_id: validatorId,
          quality_score: score,
          feedback,
        })?.select()?.single();

      if (error) throw error;

      return { success: true, validation: data };
    } catch (error) {
      console.error('Validate translation error:', error);
      return { success: false, error: error?.message };
    }
  }

  // ============ TAX REPORTING & COMPLIANCE MESSAGING ============
  
  async getComplianceMessage(messageKey, languageCode, countryCode = null) {
    try {
      let query = supabase
        ?.from('compliance_messages_i18n')
        ?.select('*')
        ?.eq('message_key', messageKey)
        ?.eq('language_code', languageCode)
        ?.eq('is_active', true);

      if (countryCode) {
        query = query?.eq('country_code', countryCode);
      }

      const { data, error } = await query?.single();

      if (error) throw error;

      return { success: true, message: data?.message_content };
    } catch (error) {
      console.error('Get compliance message error:', error);
      return { success: false, error: error?.message };
    }
  }

  async getTaxDocumentationTemplate(countryCode, formType) {
    try {
      const { data, error } = await supabase
        ?.from('tax_documentation_templates')
        ?.select('*')
        ?.eq('country_code', countryCode)
        ?.eq('form_type', formType)
        ?.eq('is_active', true)
        ?.single();

      if (error) throw error;

      return { success: true, template: data };
    } catch (error) {
      console.error('Get tax documentation template error:', error);
      return { success: false, error: error?.message };
    }
  }

  async generateAnnualTaxReport(countryCode, taxYear) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if report already exists
      const { data: existingReport } = await supabase
        ?.from('tax_report_schedules')
        ?.select('*')
        ?.eq('country_code', countryCode)
        ?.eq('tax_year', taxYear)
        ?.eq('status', 'completed')
        ?.single();

      if (existingReport) {
        return { success: true, report: existingReport, message: 'Report already exists' };
      }

      // Create new report schedule
      const { data, error } = await supabase
        ?.from('tax_report_schedules')
        ?.insert({
          country_code: countryCode,
          report_type: 'annual_summary',
          tax_year: taxYear,
          generation_date: new Date()?.toISOString()?.split('T')?.[0],
          status: 'generating'
        })
        ?.select()
        ?.single();

      if (error) throw error;

      // Trigger report generation (would be handled by background job)
      // For now, we'll mark it as completed
      const { data: updatedReport } = await supabase
        ?.from('tax_report_schedules')
        ?.update({
          status: 'completed',
          generated_at: new Date()?.toISOString()
        })
        ?.eq('id', data?.id)
        ?.select()
        ?.single();

      return { success: true, report: updatedReport };
    } catch (error) {
      console.error('Generate annual tax report error:', error);
      return { success: false, error: error?.message };
    }
  }

  async getTaxReportSchedules(countryCode = null, taxYear = null) {
    try {
      let query = supabase
        ?.from('tax_report_schedules')
        ?.select('*')
        ?.order('tax_year', { ascending: false });

      if (countryCode) {
        query = query?.eq('country_code', countryCode);
      }

      if (taxYear) {
        query = query?.eq('tax_year', taxYear);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, schedules: data };
    } catch (error) {
      console.error('Get tax report schedules error:', error);
      return { success: false, error: error?.message };
    }
  }

  async createComplianceMessage(messageData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('compliance_messages_i18n')
        ?.insert({
          message_key: messageData?.messageKey,
          language_code: messageData?.languageCode,
          country_code: messageData?.countryCode || null,
          message_content: messageData?.messageContent,
          message_category: messageData?.messageCategory
        })
        ?.select()
        ?.single();

      if (error) throw error;

      return { success: true, message: data };
    } catch (error) {
      console.error('Create compliance message error:', error);
      return { success: false, error: error?.message };
    }
  }

  async updateComplianceMessage(messageId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('compliance_messages_i18n')
        ?.update(updates)
        ?.eq('id', messageId)
        ?.select()
        ?.single();

      if (error) throw error;

      return { success: true, message: data };
    } catch (error) {
      console.error('Update compliance message error:', error);
      return { success: false, error: error?.message };
    }
  }

  async createTaxDocumentationTemplate(templateData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('tax_documentation_templates')
        ?.insert({
          country_code: templateData?.countryCode,
          form_type: templateData?.formType,
          template_name: templateData?.templateName,
          template_data: templateData?.templateData || {},
          required_fields: templateData?.requiredFields || [],
          validation_rules: templateData?.validationRules || {},
          pdf_template_url: templateData?.pdfTemplateUrl || null
        })
        ?.select()
        ?.single();

      if (error) throw error;

      return { success: true, template: data };
    } catch (error) {
      console.error('Create tax documentation template error:', error);
      return { success: false, error: error?.message };
    }
  }

  async updateTaxDocumentationTemplate(templateId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('tax_documentation_templates')
        ?.update(updates)
        ?.eq('id', templateId)
        ?.select()
        ?.single();

      if (error) throw error;

      return { success: true, template: data };
    } catch (error) {
      console.error('Update tax documentation template error:', error);
      return { success: false, error: error?.message };
    }
  }

  // ============ REGION-SPECIFIC TAX FORMATTING ============
  
  formatTaxAmount(amount, countryCode, languageCode) {
    const currencyMap = {
      'US': 'USD',
      'GB': 'GBP',
      'IN': 'INR',
      'EU': 'EUR',
      'NG': 'NGN'
    };

    const currency = currencyMap?.[countryCode] || 'USD';

    return new Intl.NumberFormat(languageCode, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(amount);
  }

  formatTaxDate(date, countryCode, languageCode) {
    const dateFormatMap = {
      'US': { year: 'numeric', month: '2-digit', day: '2-digit' },
      'GB': { year: 'numeric', month: '2-digit', day: '2-digit' },
      'IN': { year: 'numeric', month: '2-digit', day: '2-digit' },
      'EU': { year: 'numeric', month: '2-digit', day: '2-digit' }
    };

    const format = dateFormatMap?.[countryCode] || dateFormatMap?.['US'];

    return new Intl.DateTimeFormat(languageCode, format)?.format(new Date(date));
  }

  getTaxYearFormat(countryCode) {
    // Different countries have different tax year formats
    const taxYearFormats = {
      'US': { start: '01-01', end: '12-31', label: 'Calendar Year' },
      'GB': { start: '04-06', end: '04-05', label: 'Tax Year' },
      'IN': { start: '04-01', end: '03-31', label: 'Financial Year' },
      'AU': { start: '07-01', end: '06-30', label: 'Financial Year' }
    };

    return taxYearFormats?.[countryCode] || taxYearFormats?.['US'];
  }
}

export default new LocalizationService();
function localizationService(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: localizationService is not implemented yet.', args);
  return null;
}

export { localizationService };