import { supabase } from '../lib/supabase';

const APP_URL = import.meta.env?.VITE_APP_URL || 'https://vottery.com';

export const smsAlertService = {
  async sendSMSAlert(alertData) {
    try {
      const { to, message, alertId, severity } = alertData;

      if (!to || !message) {
        throw new Error('Missing required fields: to, message');
      }

      const { data, error } = await supabase?.functions?.invoke('send-sms-alert', {
        body: {
          to,
          message,
          alertId,
          severity
        }
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error sending SMS alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendCriticalFraudAlert(alert, adminPhoneNumbers) {
    try {
      const message = `🚨 CRITICAL FRAUD ALERT\n\n${alert?.title}\n\nScore: ${alert?.metadata?.fraudScore}/100\nSeverity: ${alert?.severity?.toUpperCase()}\n\n${alert?.message?.substring(0, 200)}...\n\nAction Required: Immediate Investigation`;

      const results = [];

      for (const phoneNumber of adminPhoneNumbers) {
        const result = await this.sendSMSAlert({
          to: phoneNumber,
          message,
          alertId: alert?.id,
          severity: alert?.severity
        });
        results?.push(result);
      }

      return { data: results, error: null };
    } catch (error) {
      console.error('Error sending critical fraud alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendComplianceAlert(alert, adminPhoneNumbers) {
    try {
      const message = `⚠️ COMPLIANCE ALERT\n\n${alert?.title}\n\nCategory: ${alert?.category}\nSeverity: ${alert?.severity?.toUpperCase()}\n\n${alert?.message?.substring(0, 200)}...\n\nReview Required`;

      const results = [];

      for (const phoneNumber of adminPhoneNumbers) {
        const result = await this.sendSMSAlert({
          to: phoneNumber,
          message,
          alertId: alert?.id,
          severity: alert?.severity
        });
        results?.push(result);
      }

      return { data: results, error: null };
    } catch (error) {
      console.error('Error sending compliance alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Twilio SMS Creator Alerts
  async sendEarningsMilestoneAlert(creatorId, milestone) {
    try {
      const { data: creator } = await supabase?.from('user_profiles')?.select('phone_number, full_name')?.eq('id', creatorId)?.single();

      if (!creator?.phone_number) {
        return { data: null, error: { message: 'No phone number on file' } };
      }

      const message = `🎉 Congratulations ${creator?.full_name}! You've reached a new earnings milestone: $${milestone?.amount?.toLocaleString()}! Keep creating amazing content. View details: ${APP_URL}/creator-earnings`;

      const { data, error } = await supabase?.functions?.invoke('send-sms-alert', {
        body: {
          to: creator?.phone_number,
          message,
          alertId: `milestone_${creatorId}_${Date.now()}`,
          severity: 'info'
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error sending earnings milestone alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendPartnershipRequestAlert(creatorId, brandName, opportunityTitle) {
    try {
      const { data: creator } = await supabase?.from('user_profiles')?.select('phone_number, full_name')?.eq('id', creatorId)?.single();

      if (!creator?.phone_number) {
        return { data: null, error: { message: 'No phone number on file' } };
      }

      const message = `🤝 New Partnership Opportunity! ${brandName} is interested in collaborating on "${opportunityTitle}". Review and respond: ${APP_URL}/creator-brand-partnership-portal`;

      const { data, error } = await supabase?.functions?.invoke('send-sms-alert', {
        body: {
          to: creator?.phone_number,
          message,
          alertId: `partnership_${creatorId}_${Date.now()}`,
          severity: 'medium'
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error sending partnership request alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendContentOptimizationAlert(creatorId, recommendations) {
    try {
      const { data: creator } = await supabase?.from('user_profiles')?.select('phone_number, full_name')?.eq('id', creatorId)?.single();

      if (!creator?.phone_number) {
        return { data: null, error: { message: 'No phone number on file' } };
      }

      const topRecommendation = recommendations?.[0];
      const message = `💡 Content Optimization Tip: ${topRecommendation?.title}. ${topRecommendation?.description?.substring(0, 100)}... Potential increase: ${topRecommendation?.potentialIncrease}. View full insights: ${APP_URL}/creator-earnings`;

      const { data, error } = await supabase?.functions?.invoke('send-sms-alert', {
        body: {
          to: creator?.phone_number,
          message,
          alertId: `optimization_${creatorId}_${Date.now()}`,
          severity: 'low'
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error sending content optimization alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendPartnershipAcceptedAlert(creatorId, brandName) {
    try {
      const { data: creator } = await supabase?.from('user_profiles')?.select('phone_number, full_name')?.eq('id', creatorId)?.single();
      if (!creator?.phone_number) return { data: null, error: { message: 'No phone number on file' } };
      const message = `🤝 Partnership accepted! ${brandName} accepted your proposal. View your contract: ${APP_URL}/creator-brand-partnership-portal`;
      const { data, error } = await supabase?.functions?.invoke('send-sms-alert', {
        body: { to: creator.phone_number, message, alertId: `partnership_accepted_${creatorId}_${Date.now()}`, severity: 'medium' },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error sending partnership accepted alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendMonetizationOpportunityAlert(creatorId, opportunity) {
    try {
      const { data: creator } = await supabase?.from('user_profiles')?.select('phone_number, full_name')?.eq('id', creatorId)?.single();

      if (!creator?.phone_number) {
        return { data: null, error: { message: 'No phone number on file' } };
      }

      const message = `⏰ Time-Sensitive Opportunity! ${opportunity?.title} - Potential earnings: $${opportunity?.potentialEarnings?.toLocaleString()}. Expires in ${opportunity?.expiresIn}. Act now: ${APP_URL}/creator-brand-partnership-portal`;

      const { data, error } = await supabase?.functions?.invoke('send-sms-alert', {
        body: {
          to: creator?.phone_number,
          message,
          alertId: `monetization_${creatorId}_${Date.now()}`,
          severity: 'high'
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error sending monetization opportunity alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Monitor earnings and trigger milestone alerts
  async monitorEarningsMilestones(creatorId) {
    try {
      const { data: earnings } = await this.getCreatorEarningsOverview(creatorId);
      const totalEarnings = earnings?.totalEarnings || 0;

      // Define milestones
      const milestones = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000];

      // Check if creator has reached a new milestone
      const { data: lastMilestone } = await supabase?.from('creator_milestones')?.select('amount')?.eq('creator_id', creatorId)?.order('amount', { ascending: false })?.limit(1)?.single();

      const lastMilestoneAmount = lastMilestone?.amount || 0;
      const newMilestone = milestones?.find(m => m > lastMilestoneAmount && totalEarnings >= m);

      if (newMilestone) {
        // Record milestone
        await supabase?.from('creator_milestones')?.insert({
          creator_id: creatorId,
          amount: newMilestone,
          achieved_at: new Date()?.toISOString()
        });

        // Send SMS alert
        await this.sendEarningsMilestoneAlert(creatorId, { amount: newMilestone });
      }

      return { data: { milestone: newMilestone }, error: null };
    } catch (error) {
      console.error('Error monitoring earnings milestones:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  formatPhoneNumber(phoneNumber) {
    // Remove all non-numeric characters
    const cleaned = phoneNumber?.replace(/\D/g, '');
    
    // Add +1 for US numbers if not present
    if (cleaned?.length === 10) {
      return `+1${cleaned}`;
    }
    
    // Add + if not present
    if (!phoneNumber?.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return phoneNumber;
  }
};