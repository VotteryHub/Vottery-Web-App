import { supabase } from '../lib/supabase';

export const localeService = {
  /**
   * Fetch enabled supported locales ordered by sort_order.
   */
  async getSupportedLocales() {
    try {
      const { data, error } = await supabase
        .from('supported_locales')
        .select('locale_code, language_code, region_code, name, is_default, sort_order')
        .eq('enabled', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching supported locales:', error);
      return { success: false, error: error?.message };
    }
  }
};

export default localeService;

