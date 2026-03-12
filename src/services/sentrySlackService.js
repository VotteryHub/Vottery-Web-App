/**
 * Sentry Alert Service
 * Forwards critical errors from Sentry to Discord via discordWebhookService.
 * Uses VITE_DISCORD_WEBHOOK_URL (same as VP economy, fraud, performance alerts).
 */

import { discordWebhookService } from './discordWebhookService';

export const sentrySlackService = {
  async notifyCriticalError({ title, message, level = 'error', extra = {} }) {
    if (!discordWebhookService?.isConfigured?.()) return;
    try {
      await discordWebhookService.sendSystemAlert({
        title: `Sentry: ${title || 'Critical Error'}`,
        message: message || 'No details',
        type: 'Sentry',
        severity: level === 'fatal' ? 'critical' : 'high',
        metric: extra?.event_id ? `Event ID: ${extra.event_id}` : undefined,
      });
    } catch (err) {
      console.warn('Sentry Discord notification failed:', err);
    }
  },
};
