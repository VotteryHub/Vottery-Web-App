import { analytics } from '../hooks/useGoogleAnalytics';

const DISCORD_WEBHOOK_URL = import.meta.env?.VITE_DISCORD_WEBHOOK_URL;

const isConfigured = () => {
  return DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL !== 'your-discord-webhook-url-here';
};

const SEVERITY_COLORS = {
  critical: 0xFF0000,   // Red
  high: 0xFF6600,       // Orange
  medium: 0xFFCC00,     // Yellow
  low: 0x0099FF,        // Blue
  info: 0x00CC66,       // Green
  resolved: 0x00CC66,   // Green
};

const SEVERITY_EMOJIS = {
  critical: '🚨',
  high: '⚠️',
  medium: '🔶',
  low: '🔵',
  info: '✅',
  resolved: '✅',
};

export const discordWebhookService = {
  /**
   * Send a message to Discord webhook
   */
  async sendMessage(payload) {
    if (!isConfigured()) {
      console.info('[Discord] Webhook not configured. Set VITE_DISCORD_WEBHOOK_URL to enable notifications.');
      return { success: false, error: 'Discord webhook URL not configured' };
    }

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response?.ok) {
        throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
      }

      analytics?.trackEvent('discord_notification_sent', {
        type: payload?.embeds?.[0]?.title || 'unknown',
      });

      return { success: true };
    } catch (error) {
      console.error('[Discord] Failed to send webhook:', error?.message);
      return { success: false, error: error?.message };
    }
  },

  /**
   * Send an incident notification
   */
  async sendIncidentNotification(incident) {
    const severity = incident?.severity || incident?.threatLevel || 'medium';
    const emoji = SEVERITY_EMOJIS?.[severity] || SEVERITY_EMOJIS?.medium;
    const color = SEVERITY_COLORS?.[severity] || SEVERITY_COLORS?.medium;

    const payload = {
      username: 'Vottery Incident Bot',
      avatar_url: 'https://vottery5399.builtwithrocket.new/favicon.ico',
      embeds: [{
        title: `${emoji} Incident: ${incident?.title || incident?.incidentType || 'Unknown Incident'}`,
        description: incident?.description || 'No description provided.',
        color,
        fields: [
          { name: 'Severity', value: severity?.toUpperCase(), inline: true },
          { name: 'Status', value: incident?.status || 'Detected', inline: true },
          { name: 'Time', value: new Date()?.toUTCString(), inline: false },
          ...(incident?.affectedServices ? [{ name: 'Affected Services', value: incident?.affectedServices?.join(', '), inline: false }] : []),
        ],
        footer: { text: 'Vottery Platform Monitoring' },
        timestamp: new Date()?.toISOString(),
      }],
    };

    return this.sendMessage(payload);
  },

  /**
   * Send a system alert
   */
  async sendSystemAlert(alert) {
    const severity = alert?.severity || 'info';
    const emoji = SEVERITY_EMOJIS?.[severity] || SEVERITY_EMOJIS?.info;
    const color = SEVERITY_COLORS?.[severity] || SEVERITY_COLORS?.info;

    const payload = {
      username: 'Vottery Alert Bot',
      embeds: [{
        title: `${emoji} System Alert: ${alert?.title || 'Platform Alert'}`,
        description: alert?.message || alert?.description || 'System alert triggered.',
        color,
        fields: [
          { name: 'Type', value: alert?.type || 'System', inline: true },
          { name: 'Severity', value: severity?.toUpperCase(), inline: true },
          ...(alert?.metric ? [{ name: 'Metric', value: String(alert?.metric), inline: true }] : []),
        ],
        footer: { text: 'Vottery Platform • Real-time Monitoring' },
        timestamp: new Date()?.toISOString(),
      }],
    };

    return this.sendMessage(payload);
  },

  /**
   * Send incident resolution notification
   */
  async sendResolutionNotification(incident) {
    const payload = {
      username: 'Vottery Incident Bot',
      embeds: [{
        title: `✅ Resolved: ${incident?.title || 'Incident Resolved'}`,
        description: incident?.resolution || 'The incident has been resolved.',
        color: SEVERITY_COLORS?.resolved,
        fields: [
          { name: 'Duration', value: incident?.duration || 'Unknown', inline: true },
          { name: 'Resolved At', value: new Date()?.toUTCString(), inline: true },
        ],
        footer: { text: 'Vottery Platform Monitoring' },
        timestamp: new Date()?.toISOString(),
      }],
    };

    return this.sendMessage(payload);
  },

  /**
   * Send a performance alert
   */
  async sendPerformanceAlert(metric, value, threshold) {
    return this.sendSystemAlert({
      title: `Performance Threshold Exceeded`,
      message: `Metric **${metric}** reached **${value}** (threshold: ${threshold})`,
      type: 'Performance',
      severity: 'high',
      metric: `${value} / ${threshold}`,
    });
  },

  /**
   * Check if Discord webhook is configured
   */
  isConfigured,

  /**
   * Send a test notification
   */
  async sendTestNotification() {
    return this.sendSystemAlert({
      title: 'Test Notification',
      message: 'Discord webhook integration is working correctly! 🎉',
      type: 'Test',
      severity: 'info',
    });
  },
};

export default discordWebhookService;