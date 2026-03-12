import { supabase } from '../lib/supabase';
import { trackEvent } from '../hooks/useGoogleAnalytics';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

export const accessibilityAnalyticsService = {
  async trackFontSizeChange(userId, action, newSize, previousSize) {
    try {
      const eventData = { action, new_size: newSize, previous_size: previousSize, timestamp: new Date()?.toISOString() };
      trackEvent('accessibility_font_change', { action, new_size: newSize, previous_size: previousSize, user_id: userId });

      const { data, error } = await supabase?.from('accessibility_analytics')?.insert({
        user_id: userId,
        event_type: 'font_size_change',
        event_data: eventData,
        font_size: newSize,
        theme: localStorage.getItem('vottery-theme') || 'light',
        high_contrast: false,
        reduced_motion: false,
        session_id: this.getSessionId()
      })?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async trackThemeChange(userId, newTheme, previousTheme) {
    try {
      const eventData = { new_theme: newTheme, previous_theme: previousTheme, timestamp: new Date()?.toISOString() };
      trackEvent('accessibility_theme_change', { new_theme: newTheme, previous_theme: previousTheme, user_id: userId });

      const { data, error } = await supabase?.from('accessibility_analytics')?.insert({
        user_id: userId,
        event_type: 'theme_change',
        event_data: eventData,
        font_size: parseInt(localStorage.getItem('vottery-font-size') || '15'),
        theme: newTheme,
        high_contrast: false,
        reduced_motion: false,
        session_id: this.getSessionId()
      })?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async trackAccessibilityFeatureUsage(userId, featureType, featureValue) {
    try {
      const eventData = { feature_type: featureType, feature_value: featureValue, timestamp: new Date()?.toISOString() };
      trackEvent('accessibility_feature_usage', { feature_type: featureType, feature_value: featureValue, user_id: userId });

      const { data, error } = await supabase?.from('accessibility_analytics')?.insert({
        user_id: userId,
        event_type: 'feature_usage',
        event_data: eventData,
        font_size: parseInt(localStorage.getItem('vottery-font-size') || '15'),
        theme: localStorage.getItem('vottery-theme') || 'light',
        high_contrast: featureType === 'high_contrast' ? featureValue : false,
        reduced_motion: featureType === 'reduced_motion' ? featureValue : false,
        session_id: this.getSessionId()
      })?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAccessibilityMetrics(userId, timeframe = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();
      if (timeframe === '7d') startDate?.setDate(now?.getDate() - 7);
      else if (timeframe === '30d') startDate?.setDate(now?.getDate() - 30);
      else if (timeframe === '90d') startDate?.setDate(now?.getDate() - 90);

      const { data, error } = await supabase?.from('accessibility_analytics')?.select('*')?.eq('user_id', userId)?.gte('created_at', startDate?.toISOString())?.order('created_at', { ascending: false });
      if (error) throw error;

      const metrics = this.calculateMetrics(data);
      return { data: metrics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAggregatedAccessibilityInsights(timeframe = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();
      if (timeframe === '7d') startDate?.setDate(now?.getDate() - 7);
      else if (timeframe === '30d') startDate?.setDate(now?.getDate() - 30);
      else if (timeframe === '90d') startDate?.setDate(now?.getDate() - 90);

      const { data, error } = await supabase?.from('accessibility_analytics')?.select('*')?.gte('created_at', startDate?.toISOString());
      if (error) throw error;

      const insights = this.calculateAggregatedInsights(data);
      return { data: insights, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  calculateMetrics(data) {
    const fontSizeChanges = data?.filter(d => d?.event_type === 'font_size_change');
    const themeChanges = data?.filter(d => d?.event_type === 'theme_change');
    const featureUsage = data?.filter(d => d?.event_type === 'feature_usage');

    const fontSizeDistribution = {};
    fontSizeChanges?.forEach(change => {
      const size = change?.font_size;
      fontSizeDistribution[size] = (fontSizeDistribution?.[size] || 0) + 1;
    });

    const themeDistribution = {};
    themeChanges?.forEach(change => {
      const theme = change?.theme;
      themeDistribution[theme] = (themeDistribution?.[theme] || 0) + 1;
    });

    return {
      totalEvents: data?.length,
      fontSizeChanges: fontSizeChanges?.length,
      themeChanges: themeChanges?.length,
      featureUsage: featureUsage?.length,
      fontSizeDistribution,
      themeDistribution,
      mostUsedFontSize: Object.keys(fontSizeDistribution)?.reduce((a, b) => fontSizeDistribution?.[a] > fontSizeDistribution?.[b] ? a : b, '15'),
      mostUsedTheme: Object.keys(themeDistribution)?.reduce((a, b) => themeDistribution?.[a] > themeDistribution?.[b] ? a : b, 'light')
    };
  },

  calculateAggregatedInsights(data) {
    const totalUsers = new Set(data?.map(d => d?.user_id))?.size;
    const recommendations = [];

    const largeFontUsers = data?.filter(d => d?.font_size >= 18)?.length;
    if (largeFontUsers / totalUsers > 0.3) {
      recommendations?.push({ recommendation: 'Consider increasing default font size', reason: 'Over 30% of users prefer larger fonts', priority: 'high' });
    }

    const darkThemeUsers = data?.filter(d => d?.theme === 'dark')?.length;
    if (darkThemeUsers / totalUsers > 0.5) {
      recommendations?.push({ recommendation: 'Consider dark mode as default for new users', reason: 'Over 50% of users prefer dark theme', priority: 'medium' });
    }

    return { totalUsers, totalEvents: data?.length, recommendations };
  },

  getSessionId() {
    let sessionId = sessionStorage.getItem('vottery-session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`;
      sessionStorage.setItem('vottery-session-id', sessionId);
    }
    return sessionId;
  }
};