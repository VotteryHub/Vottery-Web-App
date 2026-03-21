import { supabase } from '../lib/supabase';
import { IncomingWebhook } from '@slack/webhook';
import axios from 'axios';

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

export const brandAlertService = {
  async getBudgetMonitoringDashboard(timeRange = '24h') {
    try {
      const now = new Date();
      const rangeStart = new Date(now);
      if (timeRange === '1h') rangeStart.setHours(now.getHours() - 1);
      else if (timeRange === '7d') rangeStart.setDate(now.getDate() - 7);
      else if (timeRange === '30d') rangeStart.setDate(now.getDate() - 30);
      else rangeStart.setDate(now.getDate() - 1);

      const { data, error } = await supabase
        ?.from('sponsored_elections')
        ?.select('id,election_id,budget_total,budget_spent,total_engagements,cost_per_vote,status,created_at,updated_at')
        ?.gte('updated_at', rangeStart.toISOString())
        ?.order('updated_at', { ascending: false })
        ?.limit(100);

      if (error) throw error;

      const campaigns = (data || [])?.map((row) => {
        const budgetTotal = Number(row?.budget_total || 0);
        const budgetSpent = Number(row?.budget_spent || 0);
        const spendPercentage = budgetTotal > 0 ? (budgetSpent / budgetTotal) * 100 : 0;
        const status = spendPercentage >= 90 ? 'critical' : spendPercentage >= 75 ? 'warning' : 'healthy';
        const remainingBudget = Math.max(budgetTotal - budgetSpent, 0);
        return {
          id: row?.id,
          electionId: row?.election_id,
          budgetTotal,
          budgetSpent,
          spendPercentage,
          status,
          burnRate: Number(row?.cost_per_vote || 0),
          totalEngagements: Number(row?.total_engagements || 0),
          remainingBudget,
          updatedAt: row?.updated_at,
        };
      });

      const totalBudget = campaigns.reduce((sum, c) => sum + c.budgetTotal, 0);
      const totalSpent = campaigns.reduce((sum, c) => sum + c.budgetSpent, 0);
      const averageBurnRate = campaigns.length > 0
        ? campaigns.reduce((sum, c) => sum + c.burnRate, 0) / campaigns.length
        : 0;

      return {
        data: {
          campaigns,
          analytics: {
            totalBudget,
            totalSpent,
            criticalCampaigns: campaigns.filter((c) => c.spendPercentage >= 90).length,
            averageBurnRate,
          },
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async monitorBudgetThresholds() {
    try {
      const { data: campaigns, error } = await supabase
        ?.from('sponsored_elections')
        ?.select(`
          *,
          elections:election_id(title, category),
          brand:user_profiles!brand_id(name, email)
        `)
        ?.eq('status', 'active')
        ?.gte('budget_spent', supabase?.raw('budget_total * 0.90'))
        ?.is('alert_sent_at', null);

      if (error) throw error;

      for (const campaign of campaigns || []) {
        await this.sendBudgetAlert(campaign);
      }

      return { data: { monitored: campaigns?.length || 0 }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendBudgetAlert(campaign) {
    try {
      const budgetPercentage = ((campaign?.budget_spent / campaign?.budget_total) * 100)?.toFixed(2);
      const remainingBudget = campaign?.budget_total - campaign?.budget_spent;

      const alertData = {
        campaignId: campaign?.id,
        electionTitle: campaign?.elections?.title,
        brandName: campaign?.brand?.name,
        budgetTotal: campaign?.budget_total,
        budgetSpent: campaign?.budget_spent,
        budgetPercentage,
        remainingBudget,
        totalEngagements: campaign?.total_engagements,
        costPerVote: campaign?.cost_per_vote,
        timestamp: new Date()?.toISOString()
      };

      // Send to Slack
      const slackResult = await this.sendSlackAlert(alertData);

      // Send to Discord
      const discordResult = await this.sendDiscordAlert(alertData);

      // Mark alert as sent
      await supabase
        ?.from('sponsored_elections')
        ?.update({ alert_sent_at: new Date()?.toISOString() })
        ?.eq('id', campaign?.id);

      // Log alert delivery
      await this.logAlertDelivery({
        campaignId: campaign?.id,
        alertType: 'budget_threshold',
        threshold: 90,
        slackStatus: slackResult?.success ? 'delivered' : 'failed',
        discordStatus: discordResult?.success ? 'delivered' : 'failed',
        alertData
      });

      return { success: true, slack: slackResult, discord: discordResult };
    } catch (error) {
      console.error('Error sending budget alert:', error);
      return { success: false, error: error?.message };
    }
  },

  async sendSlackAlert(alertData) {
    try {
      const slackWebhookUrl = import.meta.env?.VITE_SLACK_WEBHOOK_URL;
      if (!slackWebhookUrl) {
        return { success: false, error: 'Slack webhook URL not configured' };
      }

      const webhook = new IncomingWebhook(slackWebhookUrl);

      const message = {
        text: `🚨 *Budget Alert: ${alertData?.budgetPercentage}% Spent*`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `🚨 Budget Alert: ${alertData?.budgetPercentage}% Spent`,
              emoji: true
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Campaign:*\n${alertData?.electionTitle}`
              },
              {
                type: 'mrkdwn',
                text: `*Brand:*\n${alertData?.brandName}`
              },
              {
                type: 'mrkdwn',
                text: `*Budget Spent:*\n$${alertData?.budgetSpent?.toLocaleString()} / $${alertData?.budgetTotal?.toLocaleString()}`
              },
              {
                type: 'mrkdwn',
                text: `*Remaining:*\n$${alertData?.remainingBudget?.toLocaleString()}`
              },
              {
                type: 'mrkdwn',
                text: `*Total Engagements:*\n${alertData?.totalEngagements?.toLocaleString()}`
              },
              {
                type: 'mrkdwn',
                text: `*Cost Per Vote:*\n$${alertData?.costPerVote?.toFixed(2)}`
              }
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `⚠️ *Action Required:* Your campaign has reached 90% of its budget. Consider increasing budget or pausing campaign to prevent overspend.`
            }
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '💰 Increase Budget',
                  emoji: true
                },
                style: 'primary',
                url: `${window?.location?.origin}/campaign-management-dashboard`
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '⏸️ Pause Campaign',
                  emoji: true
                },
                style: 'danger',
                url: `${window?.location?.origin}/campaign-management-dashboard`
              }
            ]
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `🕐 Alert sent at ${new Date(alertData?.timestamp)?.toLocaleString()}`
              }
            ]
          }
        ]
      };

      await webhook?.send(message);
      return { success: true, channel: 'slack' };
    } catch (error) {
      console.error('Slack alert error:', error);
      return { success: false, error: error?.message };
    }
  },

  async sendDiscordAlert(alertData) {
    try {
      const discordWebhookUrl = import.meta.env?.VITE_DISCORD_WEBHOOK_URL;
      if (!discordWebhookUrl) {
        return { success: false, error: 'Discord webhook URL not configured' };
      }

      const embed = {
        title: `🚨 Budget Alert: ${alertData?.budgetPercentage}% Spent`,
        description: `Your campaign **${alertData?.electionTitle}** has reached 90% of its budget threshold.`,
        color: 0xFF6B6B, // Red color
        fields: [
          {
            name: '💼 Brand',
            value: alertData?.brandName,
            inline: true
          },
          {
            name: '💰 Budget Spent',
            value: `$${alertData?.budgetSpent?.toLocaleString()} / $${alertData?.budgetTotal?.toLocaleString()}`,
            inline: true
          },
          {
            name: '📊 Remaining Budget',
            value: `$${alertData?.remainingBudget?.toLocaleString()}`,
            inline: true
          },
          {
            name: '👥 Total Engagements',
            value: alertData?.totalEngagements?.toLocaleString(),
            inline: true
          },
          {
            name: '💵 Cost Per Vote',
            value: `$${alertData?.costPerVote?.toFixed(2)}`,
            inline: true
          },
          {
            name: '📈 Budget Percentage',
            value: `${alertData?.budgetPercentage}%`,
            inline: true
          },
          {
            name: '⚠️ Action Required',
            value: 'Consider increasing budget or pausing campaign to prevent overspend. Enable proactive sales outreach.',
            inline: false
          }
        ],
        footer: {
          text: `Alert sent at ${new Date(alertData?.timestamp)?.toLocaleString()}`
        },
        timestamp: alertData?.timestamp
      };

      await axios?.post(discordWebhookUrl, {
        embeds: [embed],
        username: 'Budget Alert Bot',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
      });

      return { success: true, channel: 'discord' };
    } catch (error) {
      console.error('Discord alert error:', error);
      return { success: false, error: error?.message };
    }
  },

  async logAlertDelivery(logData) {
    try {
      const { error } = await supabase
        ?.from('brand_alert_logs')
        ?.insert(toSnakeCase(logData));

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error logging alert delivery:', error);
      return { success: false, error: error?.message };
    }
  },

  async getAlertHistory(campaignId = null, limit = 50) {
    try {
      let query = supabase
        ?.from('brand_alert_logs')
        ?.select('*')
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (campaignId) {
        query = query?.eq('campaign_id', campaignId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async configureAlertChannels(config) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('brand_alert_configurations')
        ?.upsert({
          user_id: user?.id,
          ...toSnakeCase(config)
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAlertConfiguration() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('brand_alert_configurations')
        ?.select('*')
        ?.eq('user_id', user?.id)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};
