import { supabase } from '../lib/supabase';
import googleAnalyticsService from './googleAnalyticsService';

/**
 * Security Monitoring Service
 * Real-time threat detection and security event tracking
 */

class SecurityMonitoringService {
  constructor() {
    this.alertThresholds = {
      corsViolations: 10,
      rateLimitBreaches: 50,
      sqlInjectionAttempts: 5,
      webhookReplayAttempts: 3
    };
  }

  /**
   * Log CORS policy violation
   */
  async logCORSViolation(origin, endpoint, userId = null) {
    try {
      const { error } = await supabase?.from('security_cors_violations')?.insert({
          origin,
          endpoint,
          user_id: userId,
          user_agent: navigator.userAgent,
          timestamp: new Date()?.toISOString()
        });

      if (error) throw error;

      // Track in Google Analytics
      googleAnalyticsService?.trackSecurityEvent('cors_violation', {
        origin,
        endpoint
      });

      // Check if threshold exceeded
      await this.checkCORSThreshold(origin);
    } catch (error) {
      console.error('Failed to log CORS violation:', error);
    }
  }

  /**
   * Log rate limit breach attempt
   */
  async logRateLimitBreach(ipAddress, endpoint, userId = null) {
    try {
      const { error } = await supabase?.from('security_rate_limit_breaches')?.insert({
          ip_address: ipAddress,
          endpoint,
          user_id: userId,
          timestamp: new Date()?.toISOString()
        });

      if (error) throw error;

      // Track in Google Analytics
      googleAnalyticsService?.trackSecurityEvent('rate_limit_breach', {
        endpoint,
        ip_address: ipAddress
      });

      // Check if threshold exceeded
      await this.checkRateLimitThreshold(ipAddress);
    } catch (error) {
      console.error('Failed to log rate limit breach:', error);
    }
  }

  /**
   * Log webhook replay attack attempt
   */
  async logWebhookReplay(webhookId, signature, timestamp) {
    try {
      const { error } = await supabase?.from('security_webhook_replays')?.insert({
          webhook_id: webhookId,
          signature,
          original_timestamp: timestamp,
          detected_at: new Date()?.toISOString()
        });

      if (error) throw error;

      // Track in Google Analytics
      googleAnalyticsService?.trackSecurityEvent('webhook_replay_attempt', {
        webhook_id: webhookId
      });
    } catch (error) {
      console.error('Failed to log webhook replay:', error);
    }
  }

  /**
   * Log SQL injection attempt
   */
  async logSQLInjection(input, endpoint, userId = null) {
    try {
      const { error } = await supabase?.from('security_sql_injection_attempts')?.insert({
          malicious_input: input,
          endpoint,
          user_id: userId,
          ip_address: await this.getCurrentIP(),
          timestamp: new Date()?.toISOString()
        });

      if (error) throw error;

      // Track in Google Analytics
      googleAnalyticsService?.trackSecurityEvent('sql_injection_attempt', {
        endpoint
      });

      // Immediate alert for SQL injection
      await this.triggerSecurityAlert('sql_injection', {
        endpoint,
        userId,
        input: input?.substring(0, 100)
      });
    } catch (error) {
      console.error('Failed to log SQL injection attempt:', error);
    }
  }

  /**
   * Get real-time security metrics
   */
  async getSecurityMetrics(timeRange = '1h') {
    try {
      const minutes = timeRange === '1h' ? 60 : timeRange === '24h' ? 1440 : 10080;
      const startTime = new Date(Date.now() - minutes * 60 * 1000)?.toISOString();

      // Fetch all security events in parallel
      const [corsData, rateLimitData, webhookData, sqlData] = await Promise.all([
        this.getCORSViolations(startTime),
        this.getRateLimitBreaches(startTime),
        this.getWebhookReplays(startTime),
        this.getSQLInjectionAttempts(startTime)
      ]);

      return {
        corsViolations: {
          total: corsData?.length,
          recent: corsData?.slice(0, 10),
          topOrigins: this.getTopOrigins(corsData)
        },
        rateLimitBreaches: {
          total: rateLimitData?.length,
          recent: rateLimitData?.slice(0, 10),
          topIPs: this.getTopIPs(rateLimitData)
        },
        webhookReplays: {
          total: webhookData?.length,
          recent: webhookData?.slice(0, 10)
        },
        sqlInjectionAttempts: {
          total: sqlData?.length,
          recent: sqlData?.slice(0, 10),
          topEndpoints: this.getTopEndpoints(sqlData)
        },
        overallThreatLevel: this.calculateThreatLevel({
          cors: corsData?.length,
          rateLimit: rateLimitData?.length,
          webhook: webhookData?.length,
          sql: sqlData?.length
        })
      };
    } catch (error) {
      console.error('Failed to get security metrics:', error);
      throw error;
    }
  }

  /**
   * Get CORS violations
   */
  async getCORSViolations(startTime) {
    const { data, error } = await supabase?.from('security_cors_violations')?.select('*')?.gte('timestamp', startTime)?.order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get rate limit breaches
   */
  async getRateLimitBreaches(startTime) {
    const { data, error } = await supabase?.from('security_rate_limit_breaches')?.select('*')?.gte('timestamp', startTime)?.order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get webhook replay attempts
   */
  async getWebhookReplays(startTime) {
    const { data, error } = await supabase?.from('security_webhook_replays')?.select('*')?.gte('detected_at', startTime)?.order('detected_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get SQL injection attempts
   */
  async getSQLInjectionAttempts(startTime) {
    const { data, error } = await supabase?.from('security_sql_injection_attempts')?.select('*')?.gte('timestamp', startTime)?.order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Calculate overall threat level
   */
  calculateThreatLevel(counts) {
    const score = 
      (counts?.cors * 1) +
      (counts?.rateLimit * 0.5) +
      (counts?.webhook * 3) +
      (counts?.sql * 5);

    if (score >= 100) return { level: 'critical', color: 'red', score };
    if (score >= 50) return { level: 'high', color: 'orange', score };
    if (score >= 20) return { level: 'medium', color: 'yellow', score };
    return { level: 'low', color: 'green', score };
  }

  /**
   * Get top origins from CORS violations
   */
  getTopOrigins(violations) {
    const originCounts = {};
    violations?.forEach(v => {
      originCounts[v.origin] = (originCounts?.[v?.origin] || 0) + 1;
    });

    return Object.entries(originCounts)?.map(([origin, count]) => ({ origin, count }))?.sort((a, b) => b?.count - a?.count)?.slice(0, 5);
  }

  /**
   * Get top IPs from rate limit breaches
   */
  getTopIPs(breaches) {
    const ipCounts = {};
    breaches?.forEach(b => {
      ipCounts[b.ip_address] = (ipCounts?.[b?.ip_address] || 0) + 1;
    });

    return Object.entries(ipCounts)?.map(([ip, count]) => ({ ip, count }))?.sort((a, b) => b?.count - a?.count)?.slice(0, 5);
  }

  /**
   * Get top endpoints from SQL injection attempts
   */
  getTopEndpoints(attempts) {
    const endpointCounts = {};
    attempts?.forEach(a => {
      endpointCounts[a.endpoint] = (endpointCounts?.[a?.endpoint] || 0) + 1;
    });

    return Object.entries(endpointCounts)?.map(([endpoint, count]) => ({ endpoint, count }))?.sort((a, b) => b?.count - a?.count)?.slice(0, 5);
  }

  /**
   * Check CORS threshold and trigger alert
   */
  async checkCORSThreshold(origin) {
    const recentViolations = await this.getCORSViolations(
      new Date(Date.now() - 60 * 60 * 1000)?.toISOString()
    );

    const originViolations = recentViolations?.filter(v => v?.origin === origin);
    
    if (originViolations?.length >= this.alertThresholds?.corsViolations) {
      await this.triggerSecurityAlert('cors_threshold_exceeded', {
        origin,
        count: originViolations?.length
      });
    }
  }

  /**
   * Check rate limit threshold and trigger alert
   */
  async checkRateLimitThreshold(ipAddress) {
    const recentBreaches = await this.getRateLimitBreaches(
      new Date(Date.now() - 60 * 60 * 1000)?.toISOString()
    );

    const ipBreaches = recentBreaches?.filter(b => b?.ip_address === ipAddress);
    
    if (ipBreaches?.length >= this.alertThresholds?.rateLimitBreaches) {
      await this.triggerSecurityAlert('rate_limit_threshold_exceeded', {
        ip_address: ipAddress,
        count: ipBreaches?.length
      });
    }
  }

  /**
   * Trigger security alert
   */
  async triggerSecurityAlert(alertType, details) {
    try {
      const { error } = await supabase?.from('security_alerts')?.insert({
          alert_type: alertType,
          details,
          severity: this.getAlertSeverity(alertType),
          triggered_at: new Date()?.toISOString(),
          status: 'active'
        });

      if (error) throw error;

      // Track in Google Analytics
      googleAnalyticsService?.trackSecurityEvent('security_alert_triggered', {
        alert_type: alertType,
        severity: this.getAlertSeverity(alertType)
      });
    } catch (error) {
      console.error('Failed to trigger security alert:', error);
    }
  }

  /**
   * Get alert severity
   */
  getAlertSeverity(alertType) {
    const severityMap = {
      sql_injection: 'critical',
      webhook_replay_attempt: 'high',
      cors_threshold_exceeded: 'medium',
      rate_limit_threshold_exceeded: 'medium'
    };

    return severityMap?.[alertType] || 'low';
  }

  /**
   * Get current IP address
   */
  async getCurrentIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response?.json();
      return data?.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Get active security alerts
   */
  async getActiveAlerts() {
    try {
      const { data, error } = await supabase?.from('security_alerts')?.select('*')?.eq('status', 'active')?.order('triggered_at', { ascending: false })?.limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get active alerts:', error);
      return [];
    }
  }

  /**
   * Resolve security alert
   */
  async resolveAlert(alertId) {
    try {
      const { error } = await supabase?.from('security_alerts')?.update({ 
          status: 'resolved',
          resolved_at: new Date()?.toISOString()
        })?.eq('id', alertId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      throw error;
    }
  }
}

export default new SecurityMonitoringService();