import { supabase } from '../lib/supabase';

/**
 * Platform Logging Service
 * Handles client-side and server-side logging with automatic categorization
 */

class PlatformLoggingService {
  /**
   * Log an event to the platform_logs table
   * @param {Object} logData - Log data
   * @param {string} logData.level - Log level (debug, info, warn, error, critical)
   * @param {string} logData.category - Log category
   * @param {string} logData.eventType - Event type identifier
   * @param {string} logData.message - Log message
   * @param {Object} logData.metadata - Additional metadata
   * @param {boolean} logData.sensitiveData - Whether log contains sensitive data
   */
  async log({
    level = 'info',
    category,
    eventType,
    message,
    metadata = {},
    sensitiveData = false
  }) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      const logEntry = {
        user_id: user?.id || null,
        log_level: level,
        log_category: category,
        event_type: eventType,
        message,
        metadata,
        sensitive_data: sensitiveData,
        ip_address: null, // Client-side can't reliably get IPuser_agent: navigator?.userAgent || null,request_id: this.generateRequestId(),session_id: this.getSessionId(),source: 'client'
      };

      const { error } = await supabase?.from('platform_logs')?.insert(logEntry);

      if (error) {
        console.error('Failed to log event:', error);
      }
    } catch (error) {
      console.error('Logging service error:', error);
    }
  }

  /**
   * Log user activity
   */
  async logUserActivity(eventType, message, metadata = {}) {
    return this.log({
      level: 'info',
      category: 'user_activity',
      eventType,
      message,
      metadata,
      sensitiveData: false
    });
  }

  /**
   * Log security event
   */
  async logSecurityEvent(eventType, message, metadata = {}) {
    return this.log({
      level: 'warn',
      category: 'security',
      eventType,
      message,
      metadata,
      sensitiveData: true
    });
  }

  /**
   * Log payment transaction
   */
  async logPayment(eventType, message, metadata = {}) {
    return this.log({
      level: 'info',
      category: 'payment',
      eventType,
      message,
      metadata,
      sensitiveData: true
    });
  }

  /**
   * Log voting action
   */
  async logVoting(eventType, message, metadata = {}) {
    return this.log({
      level: 'info',
      category: 'voting',
      eventType,
      message,
      metadata,
      sensitiveData: false
    });
  }

  /**
   * Log AI analysis result
   */
  async logAIAnalysis(eventType, message, metadata = {}) {
    return this.log({
      level: 'info',
      category: 'ai_analysis',
      eventType,
      message,
      metadata,
      sensitiveData: true
    });
  }

  /**
   * Log fraud detection event
   */
  async logFraudDetection(eventType, message, metadata = {}) {
    return this.log({
      level: 'warn',
      category: 'fraud_detection',
      eventType,
      message,
      metadata,
      sensitiveData: true
    });
  }

  /**
   * Log authentication event
   */
  async logAuthentication(eventType, message, metadata = {}) {
    return this.log({
      level: 'info',
      category: 'authentication',
      eventType,
      message,
      metadata,
      sensitiveData: true
    });
  }

  /**
   * Log performance metric
   */
  async logPerformance(eventType, message, metadata = {}) {
    return this.log({
      level: 'debug',
      category: 'performance',
      eventType,
      message,
      metadata,
      sensitiveData: false
    });
  }

  /**
   * Log error
   */
  async logError(eventType, message, metadata = {}) {
    return this.log({
      level: 'error',
      category: 'system',
      eventType,
      message,
      metadata,
      sensitiveData: false
    });
  }

  /**
   * Get user's own logs
   */
  async getUserLogs({
    limit = 50,
    offset = 0,
    category = null,
    level = null,
    startDate = null,
    endDate = null
  } = {}) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase?.from('platform_logs')?.select('*', { count: 'exact' })?.eq('user_id', user?.id)?.eq('sensitive_data', false)?.order('created_at', { ascending: false });

      if (category) {
        query = query?.eq('log_category', category);
      }

      if (level) {
        query = query?.eq('log_level', level);
      }

      if (startDate) {
        query = query?.gte('created_at', startDate);
      }

      if (endDate) {
        query = query?.lte('created_at', endDate);
      }

      query = query?.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return { logs: data || [], total: count || 0 };
    } catch (error) {
      console.error('Failed to fetch user logs:', error);
      throw error;
    }
  }

  /**
   * Get all logs (admin only)
   */
  async getAllLogs({
    limit = 50,
    offset = 0,
    category = null,
    level = null,
    userId = null,
    startDate = null,
    endDate = null,
    searchTerm = null
  } = {}) {
    try {
      let query = supabase?.from('platform_logs')?.select('*, user_profiles(username, email)', { count: 'exact' })?.order('created_at', { ascending: false });

      if (category) {
        query = query?.eq('log_category', category);
      }

      if (level) {
        query = query?.eq('log_level', level);
      }

      if (userId) {
        query = query?.eq('user_id', userId);
      }

      if (startDate) {
        query = query?.gte('created_at', startDate);
      }

      if (endDate) {
        query = query?.lte('created_at', endDate);
      }

      if (searchTerm) {
        query = query?.or(`message.ilike.%${searchTerm}%,event_type.ilike.%${searchTerm}%`);
      }

      query = query?.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return { logs: data || [], total: count || 0 };
    } catch (error) {
      console.error('Failed to fetch all logs:', error);
      throw error;
    }
  }

  /**
   * Get log statistics
   */
  async getLogStatistics(userId = null) {
    try {
      let query = supabase?.from('platform_logs')?.select('log_category, log_level, created_at');

      if (userId) {
        query = query?.eq('user_id', userId)?.eq('sensitive_data', false);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate statistics
      const stats = {
        total: data?.length || 0,
        byCategory: {},
        byLevel: {},
        byDate: {}
      };

      data?.forEach(log => {
        // Count by category
        stats.byCategory[log.log_category] = (stats?.byCategory?.[log?.log_category] || 0) + 1;
        
        // Count by level
        stats.byLevel[log.log_level] = (stats?.byLevel?.[log?.log_level] || 0) + 1;
        
        // Count by date
        const date = new Date(log.created_at)?.toISOString()?.split('T')?.[0];
        stats.byDate[date] = (stats?.byDate?.[date] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to fetch log statistics:', error);
      throw error;
    }
  }

  /**
   * Export user logs
   */
  async exportUserLogs(format = 'json') {
    try {
      const { logs } = await this.getUserLogs({ limit: 10000 });

      if (format === 'json') {
        const dataStr = JSON.stringify(logs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `user-logs-${new Date()?.toISOString()}.json`;
        link?.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        const headers = ['Timestamp', 'Level', 'Category', 'Event Type', 'Message'];
        const rows = logs?.map(log => [
          new Date(log.created_at)?.toISOString(),
          log?.log_level,
          log?.log_category,
          log?.event_type,
          log?.message
        ]);
        
        const csvContent = [
          headers?.join(','),
          ...rows?.map(row => row?.map(cell => `"${cell}"`)?.join(','))
        ]?.join('\n');
        
        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `user-logs-${new Date()?.toISOString()}.csv`;
        link?.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export logs:', error);
      throw error;
    }
  }

  // Helper methods
  generateRequestId() {
    return `req_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`;
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('platform_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`;
      sessionStorage.setItem('platform_session_id', sessionId);
    }
    return sessionId;
  }
}

export default new PlatformLoggingService();