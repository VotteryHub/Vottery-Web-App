import { supabase } from '../lib/supabase';

class PushNotificationService {
  constructor() {
    this.swRegistration = null;
    this.vapidPublicKey = null;
  }

  // Analyze user activity logs to find peak engagement windows
  async getOptimalSendTime(userId) {
    try {
      const { data, error } = await supabase?.from('user_activity_logs')?.select('created_at, activity_type')?.eq('user_id', userId)?.gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString())?.order('created_at', { ascending: false })?.limit(200);

      if (error || !data?.length) {
        return { optimalHour: 10, confidence: 'low', reason: 'No activity data available' };
      }

      // Analyze hourly activity distribution
      const hourCounts = new Array(24)?.fill(0);
      data?.forEach(log => {
        const hour = new Date(log?.created_at)?.getHours();
        hourCounts[hour]++;
      });

      const maxCount = Math.max(...hourCounts);
      const optimalHour = hourCounts?.indexOf(maxCount);
      const totalActivity = hourCounts?.reduce((a, b) => a + b, 0);
      const confidence = maxCount / totalActivity > 0.15 ? 'high' : maxCount / totalActivity > 0.08 ? 'medium' : 'low';

      return {
        optimalHour,
        confidence,
        reason: `Peak activity at ${optimalHour}:00 (${maxCount} interactions)`,
        hourlyDistribution: hourCounts
      };
    } catch (error) {
      console.error('[PushNotification] Error analyzing activity:', error);
      return { optimalHour: 10, confidence: 'low', reason: 'Analysis failed' };
    }
  }

  // Schedule notification with smart timing via Edge Function
  async scheduleSmartNotification(userId, notification) {
    try {
      let timing = null;
      const { data: edgeTiming, error: edgeError } = await supabase?.functions?.invoke('smart-push-timing', {
        body: { userId, notificationType: notification?.type || 'push' },
      });

      if (!edgeError && edgeTiming?.optimalHour !== undefined) {
        timing = {
          optimalHour: edgeTiming?.optimalHour,
          confidence: edgeTiming?.confidence || 'medium',
          reason: edgeTiming?.reason || 'Edge timing model',
        };
      } else {
        timing = await this.getOptimalSendTime(userId);
      }

      const now = new Date();
      const scheduledHour = timing?.optimalHour;
      let scheduledAt = new Date(now);
      scheduledAt?.setHours(scheduledHour, 0, 0, 0);
      if (scheduledAt <= now) scheduledAt?.setDate(scheduledAt?.getDate() + 1);

      const { data, error } = await supabase?.from('scheduled_notifications')?.insert({
          user_id: userId,
          title: notification?.title,
          body: notification?.body,
          data: notification?.data || {},
          scheduled_at: scheduledAt?.toISOString(),
          timing_confidence: timing?.confidence,
          optimal_hour: timing?.optimalHour
        })?.select()?.single();

      if (error) throw error;
      return { data, scheduledAt, timing, error: null };
    } catch (error) {
      console.error('[PushNotification] Schedule error:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  // Send immediate push notification
  async sendImmediate(userId, notification) {
    try {
      const { data, error } = await supabase?.from('notifications')?.insert({
          user_id: userId,
          title: notification?.title,
          message: notification?.body,
          type: notification?.type || 'push',
          data: notification?.data || {},
          is_read: false
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  // Get notification analytics for a user
  async getNotificationAnalytics(userId) {
    try {
      const { data, error } = await supabase?.from('notifications')?.select('created_at, is_read, type')?.eq('user_id', userId)?.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)?.toISOString());

      if (error) throw error;

      const total = data?.length || 0;
      const read = data?.filter(n => n?.is_read)?.length || 0;
      const openRate = total > 0 ? Math.round((read / total) * 100) : 0;

      return { data: { total, read, openRate }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  // Request browser push permission
  async requestPermission() {
    if (!('Notification' in window)) return { granted: false, reason: 'Browser not supported' };
    const permission = await Notification?.requestPermission();
    return { granted: permission === 'granted', permission };
  }

  // Check current permission status
  getPermissionStatus() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification?.permission;
  }
}

export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
