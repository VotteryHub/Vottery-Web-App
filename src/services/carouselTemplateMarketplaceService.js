import { supabase } from '../lib/supabase';
import { stripeService } from './stripeService';

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

export const carouselTemplateMarketplaceService = {
  // Get all templates
  async getAllTemplates(filters = {}) {
    try {
      let query = supabase
        ?.from('carousel_templates')
        ?.select(`
          *,
          creator:creator_id(
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        ?.eq('is_active', true)
        ?.order('total_purchases', { ascending: false });

      if (filters?.carouselType) {
        query = query?.eq('carousel_type', filters?.carouselType);
      }

      if (filters?.category) {
        query = query?.eq('category', filters?.category);
      }

      if (filters?.creatorId) {
        query = query?.eq('creator_id', filters?.creatorId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching templates:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get template by ID
  async getTemplateById(templateId) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_templates')
        ?.select(`
          *,
          creator:creator_id(
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        ?.eq('id', templateId)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching template:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Create template
  async createTemplate(templateData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...templateData,
        creatorId: user?.id,
        revenueSplitCreator: 70,
        revenueSplitPlatform: 30
      });

      const { data, error } = await supabase
        ?.from('carousel_templates')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error creating template:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update template
  async updateTemplate(templateId, updates) {
    try {
      const dbData = toSnakeCase(updates);
      const { data, error } = await supabase
        ?.from('carousel_templates')
        ?.update(dbData)
        ?.eq('id', templateId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error updating template:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Purchase template
  async purchaseTemplate(templateId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get template details
      const { data: template, error: templateError } = await this.getTemplateById(templateId);
      if (templateError) throw templateError;

      // Calculate revenue split (70/30)
      const creatorRevenue = (template?.price * 0.70)?.toFixed(2);
      const platformRevenue = (template?.price * 0.30)?.toFixed(2);

      // Create Stripe payment intent
      const { data: paymentIntent, error: paymentError } = await stripeService?.createPaymentIntent({
        amount: Math.round(template?.price * 100),
        currency: 'usd',
        metadata: {
          template_id: templateId,
          buyer_id: user?.id,
          creator_id: template?.creatorId,
          creator_revenue: creatorRevenue,
          platform_revenue: platformRevenue
        }
      });

      if (paymentError) throw new Error('Failed to create payment intent');

      // Create purchase record
      const { data, error } = await supabase
        ?.from('carousel_template_purchases')
        ?.insert(toSnakeCase({
          templateId,
          buyerId: user?.id,
          creatorId: template?.creatorId,
          purchasePrice: template?.price,
          creatorRevenue: parseFloat(creatorRevenue),
          platformRevenue: parseFloat(platformRevenue),
          paymentStatus: 'pending',
          stripePaymentIntentId: paymentIntent?.id
        }))
        ?.select()
        ?.single();

      if (error) throw error;

      return { 
        data: { 
          purchase: toCamelCase(data), 
          clientSecret: paymentIntent?.client_secret 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error purchasing template:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Complete purchase (after payment confirmation)
  async completePurchase(purchaseId) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_template_purchases')
        ?.update({ payment_status: 'completed' })
        ?.eq('id', purchaseId)
        ?.select()
        ?.single();

      if (error) throw error;

      // Update template statistics
      await supabase
        ?.from('carousel_templates')
        ?.update({
          total_purchases: supabase?.raw('total_purchases + 1'),
          total_revenue: supabase?.raw(`total_revenue + ${data?.purchase_price}`)
        })
        ?.eq('id', data?.template_id);

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error completing purchase:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get creator's templates
  async getCreatorTemplates(creatorId) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_templates')
        ?.select('*')
        ?.eq('creator_id', creatorId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching creator templates:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get purchase history
  async getPurchaseHistory(userId) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_template_purchases')
        ?.select(`
          *,
          template:template_id(
            id,
            template_name,
            carousel_type,
            preview_images
          ),
          creator:creator_id(
            id,
            full_name,
            username
          )
        `)
        ?.eq('buyer_id', userId)
        ?.order('purchased_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get revenue analytics for creator
  async getCreatorRevenueAnalytics(creatorId) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_template_purchases')
        ?.select('creator_revenue, purchased_at, payment_status')
        ?.eq('creator_id', creatorId)
        ?.eq('payment_status', 'completed');

      if (error) throw error;

      const totalRevenue = data?.reduce((sum, p) => sum + parseFloat(p?.creator_revenue), 0);
      const totalSales = data?.length;
      const avgRevenue = totalSales > 0 ? totalRevenue / totalSales : 0;

      return { 
        data: {
          totalRevenue: totalRevenue?.toFixed(2),
          totalSales,
          avgRevenue: avgRevenue?.toFixed(2),
          purchases: toCamelCase(data)
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Apply template to carousel
  async applyTemplate(templateId, carouselId) {
    try {
      const { data: template } = await this.getTemplateById(templateId);
      if (!template) throw new Error('Template not found');

      // Return template data for application
      return { 
        data: {
          templateData: template?.templateData,
          carouselType: template?.carouselType,
          applied: true
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error applying template:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};