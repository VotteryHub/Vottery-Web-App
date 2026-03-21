import { supabase } from '../lib/supabase';

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

const normalizeWebhookLog = (log = {}) => {
  const normalizedStatus = log?.delivery_status || log?.status || (log?.success === true ? 'delivered' : null) || 'pending';
  const normalizedWebhookId = log?.webhook_id || log?.webhook_config_id || null;
  const normalizedStatusCode = log?.status_code || log?.http_status_code || null;
  const normalizedAttempts = log?.attempts || log?.attempt_count || 1;
  const normalizedResponseTimeMs = log?.response_time_ms || log?.duration_ms || null;
  return {
    ...log,
    webhook_id: normalizedWebhookId,
    delivery_status: normalizedStatus,
    status: normalizedStatus,
    status_code: normalizedStatusCode,
    attempts: normalizedAttempts,
    response_time_ms: normalizedResponseTimeMs
  };
};

export const webhookService = {
  async getUserWebhooks() {
    // Backward-compatible alias used by webhook integration hub.
    return this.listWebhooks();
  },

  async configureWebhook(webhookData) {
    try {
      const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_URL}/api/webhooks/configure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });

      const result = await response?.json();
      
      if (!response?.ok) {
        throw new Error(result.error || 'Failed to configure webhook');
      }

      return { data: result?.data, secretKey: result?.secretKey, error: null };
    } catch (error) {
      return { data: null, secretKey: null, error: { message: error?.message } };
    }
  },

  async listWebhooks() {
    try {
      const { data, error } = await supabase?.from('webhook_configurations')?.select('*')?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async deleteWebhook(webhookId) {
    try {
      const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_URL}/api/webhooks/${webhookId}`, {
        method: 'DELETE'
      });

      const result = await response?.json();
      
      if (!response?.ok) {
        throw new Error(result.error || 'Failed to delete webhook');
      }

      return { data: result, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async toggleWebhook(webhookId, isActive) {
    try {
      const { data, error } = await supabase?.from('webhook_configurations')?.update({ is_active: isActive })?.eq('id', webhookId)?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getWebhookLogs(webhookId, limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('webhook_delivery_logs')
        ?.select('*')
        ?.or(`webhook_id.eq.${webhookId},webhook_config_id.eq.${webhookId}`)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase((data || [])?.map(normalizeWebhookLog)), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getWebhookStats(webhookId) {
    try {
      const { data: logs, error } = await supabase
        ?.from('webhook_delivery_logs')
        ?.select('status,delivery_status,success,webhook_id,webhook_config_id')
        ?.or(`webhook_id.eq.${webhookId},webhook_config_id.eq.${webhookId}`);

      if (error) throw error;

      const normalizedLogs = (logs || [])?.map(normalizeWebhookLog);
      const isDelivered = (status) => ['delivered', 'success', 'sent']?.includes(status);
      const isFailed = (status) => ['failed', 'error', 'bounced']?.includes(status);
      const isPending = (status) => ['pending', 'queued', 'retrying']?.includes(status);

      const stats = {
        total: normalizedLogs?.length,
        delivered: normalizedLogs?.filter((l) => isDelivered(l?.delivery_status))?.length,
        failed: normalizedLogs?.filter((l) => isFailed(l?.delivery_status))?.length,
        pending: normalizedLogs?.filter((l) => isPending(l?.delivery_status))?.length
      };

      stats.successRate = stats?.total > 0 
        ? ((stats?.delivered / stats?.total) * 100)?.toFixed(2)
        : 0;

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getWebhookStatistics(webhookId) {
    // Backward-compatible alias with normalized shape expected by UI panels.
    const result = await this.getWebhookStats(webhookId);
    if (!result?.data) return result;
    const data = result.data;
    return {
      data: {
        totalDeliveries: data.total || 0,
        successfulDeliveries: data.delivered || 0,
        failedDeliveries: data.failed || 0,
        pendingDeliveries: data.pending || 0,
        successRate: Number(data.successRate || 0),
        averageResponseTime: data.averageResponseTime || 0
      },
      error: null
    };
  },

  getAvailableEventTypes() {
    return [
      {
        id: 'vote.cast',
        name: 'Vote Cast',
        description: 'Triggered when a voter casts their vote in a lottery election',
        payload: {
          voteId: 'UUID',
          electionId: 'UUID',
          userId: 'UUID',
          lotteryTicketId: 'string',
          timestamp: 'ISO 8601'
        }
      },
      {
        id: 'draw.completed',
        name: 'Draw Completed',
        description: 'Triggered when a lottery draw is completed and winners are selected',
        payload: {
          electionId: 'UUID',
          winners: 'array of user IDs',
          totalPrizePool: 'number',
          timestamp: 'ISO 8601'
        }
      },
      {
        id: 'winner.announced',
        name: 'Winner Announced',
        description: 'Triggered for each winner when prizes are distributed',
        payload: {
          electionId: 'UUID',
          userId: 'UUID',
          prizeTier: 'string',
          prizeAmount: 'number',
          timestamp: 'ISO 8601'
        }
      },
      {
        id: 'payment.succeeded',
        name: 'Payment Succeeded',
        description: 'Triggered when a participation fee payment is successfully processed',
        payload: {
          paymentIntentId: 'string',
          amount: 'number',
          currency: 'string',
          metadata: 'object'
        }
      },
      {
        id: 'payment.failed',
        name: 'Payment Failed',
        description: 'Triggered when a participation fee payment fails',
        payload: {
          paymentIntentId: 'string',
          errorMessage: 'string',
          metadata: 'object'
        }
      }
    ];
  }
};