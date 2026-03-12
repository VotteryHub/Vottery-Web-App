import { supabase } from '../lib/supabase';
import { analytics } from '../hooks/useGoogleAnalytics';

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

export const bulkManagementService = {
  async createBulkOperation(operationData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('bulk_operations')
        ?.insert({
          ...toSnakeCase(operationData),
          created_by: user?.id,
          total_items: operationData?.targetEntityIds?.length || 0,
          progress_percentage: 0
        })
        ?.select()
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('bulk_operation_created', {
        operation_type: operationData?.operationType,
        total_items: operationData?.targetEntityIds?.length
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getBulkOperations(filters = {}) {
    try {
      let query = supabase
        ?.from('bulk_operations')
        ?.select(`
          *,
          created_by_profile:created_by(id, name, username, email)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.operationType && filters?.operationType !== 'all') {
        query = query?.eq('operation_type', filters?.operationType);
      }

      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getBulkOperationDetails(operationId) {
    try {
      const [operationResult, itemsResult, logsResult] = await Promise.all([
        supabase
          ?.from('bulk_operations')
          ?.select('*, created_by_profile:created_by(id, name, username, email)')
          ?.eq('id', operationId)
          ?.single(),
        supabase
          ?.from('bulk_operation_items')
          ?.select('*')
          ?.eq('bulk_operation_id', operationId)
          ?.order('created_at', { ascending: false }),
        supabase
          ?.from('bulk_operation_logs')
          ?.select('*')
          ?.eq('bulk_operation_id', operationId)
          ?.order('created_at', { ascending: false })
          ?.limit(100)
      ]);

      if (operationResult?.error) throw operationResult?.error;

      return {
        data: {
          operation: toCamelCase(operationResult?.data),
          items: toCamelCase(itemsResult?.data || []),
          logs: toCamelCase(logsResult?.data || [])
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateBulkOperationProgress(operationId, progressData) {
    try {
      const { data, error } = await supabase
        ?.from('bulk_operations')
        ?.update({
          ...toSnakeCase(progressData),
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', operationId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async executeBulkOperation(operationId) {
    try {
      const { data: operation } = await supabase
        ?.from('bulk_operations')
        ?.select('*')
        ?.eq('id', operationId)
        ?.single();

      if (!operation) throw new Error('Operation not found');

      await supabase
        ?.from('bulk_operations')
        ?.update({
          status: 'processing',
          started_at: new Date()?.toISOString()
        })
        ?.eq('id', operationId);

      const targetIds = operation?.target_entity_ids || [];
      const batchSize = operation?.batch_size || 50;
      let processed = 0;
      let successful = 0;
      let failed = 0;

      for (let i = 0; i < targetIds?.length; i += batchSize) {
        const batch = targetIds?.slice(i, i + batchSize);
        
        for (const entityId of batch) {
          try {
            await this.processEntity(operation, entityId);
            successful++;
          } catch (error) {
            failed++;
            await this.logError(operationId, entityId, error?.message);
          }
          processed++;

          const progress = (processed / targetIds?.length) * 100;
          await this.updateBulkOperationProgress(operationId, {
            processedItems: processed,
            successfulItems: successful,
            failedItems: failed,
            progressPercentage: progress?.toFixed(2)
          });
        }
      }

      const finalStatus = failed === 0 ? 'completed' : (successful > 0 ? 'partially_completed' : 'failed');
      await supabase
        ?.from('bulk_operations')
        ?.update({
          status: finalStatus,
          completed_at: new Date()?.toISOString()
        })
        ?.eq('id', operationId);

      return { data: { processed, successful, failed }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async processEntity(operation, entityId) {
    const { data: beforeState } = await supabase
      ?.from(operation?.target_entity_type)
      ?.select('*')
      ?.eq('id', entityId)
      ?.single();

    switch (operation?.operation_type) {
      case 'election_approval':
        await supabase
          ?.from('elections')
          ?.update({ status: 'active' })
          ?.eq('id', entityId);
        break;
      case 'election_rejection':
        await supabase
          ?.from('elections')
          ?.update({ status: 'rejected' })
          ?.eq('id', entityId);
        break;
      case 'user_suspension':
        await supabase
          ?.from('user_profiles')
          ?.update({ is_active: false })
          ?.eq('id', entityId);
        break;
      case 'user_activation':
        await supabase
          ?.from('user_profiles')
          ?.update({ is_active: true })
          ?.eq('id', entityId);
        break;
      default:
        throw new Error('Unsupported operation type');
    }

    const { data: afterState } = await supabase
      ?.from(operation?.target_entity_type)
      ?.select('*')
      ?.eq('id', entityId)
      ?.single();

    await supabase
      ?.from('bulk_operation_items')
      ?.insert({
        bulk_operation_id: operation?.id,
        entity_id: entityId,
        entity_type: operation?.target_entity_type,
        status: 'completed',
        before_state: beforeState,
        after_state: afterState,
        processed_at: new Date()?.toISOString()
      });
  },

  async logError(operationId, entityId, errorMessage) {
    await supabase
      ?.from('bulk_operation_logs')
      ?.insert({
        bulk_operation_id: operationId,
        log_level: 'error',
        message: `Failed to process entity ${entityId}`,
        details: { entity_id: entityId, error: errorMessage }
      });
  },

  async rollbackBulkOperation(operationId) {
    try {
      const { data: items } = await supabase
        ?.from('bulk_operation_items')
        ?.select('*')
        ?.eq('bulk_operation_id', operationId)
        ?.eq('status', 'completed');

      if (!items || items?.length === 0) {
        throw new Error('No items to rollback');
      }

      let rolledBack = 0;
      for (const item of items) {
        try {
          await supabase
            ?.from(item?.entity_type)
            ?.update(item?.before_state)
            ?.eq('id', item?.entity_id);

          await supabase
            ?.from('bulk_operation_items')
            ?.update({
              status: 'rolled_back',
              rollback_executed: true,
              rollback_at: new Date()?.toISOString()
            })
            ?.eq('id', item?.id);

          rolledBack++;
        } catch (error) {
          await this.logError(operationId, item?.entity_id, `Rollback failed: ${error?.message}`);
        }
      }

      await supabase
        ?.from('bulk_operations')
        ?.update({ status: 'rolled_back' })
        ?.eq('id', operationId);

      analytics?.trackEvent('bulk_operation_rolled_back', {
        operation_id: operationId,
        items_rolled_back: rolledBack
      });

      return { data: { rolledBack }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getBulkOperationStatistics(timeRange = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch(timeRange) {
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        case '90d':
          startDate?.setDate(now?.getDate() - 90);
          break;
        default:
          startDate?.setDate(now?.getDate() - 30);
      }

      const { data, error } = await supabase
        ?.from('bulk_operations')
        ?.select('*')
        ?.gte('created_at', startDate?.toISOString());

      if (error) throw error;

      const totalOperations = data?.length || 0;
      const completedOperations = data?.filter(op => op?.status === 'completed')?.length || 0;
      const failedOperations = data?.filter(op => op?.status === 'failed')?.length || 0;
      const rolledBackOperations = data?.filter(op => op?.status === 'rolled_back')?.length || 0;
      const totalItemsProcessed = data?.reduce((sum, op) => sum + (op?.processed_items || 0), 0);
      const avgSuccessRate = totalOperations > 0 
        ? (data?.reduce((sum, op) => sum + ((op?.successful_items || 0) / (op?.total_items || 1) * 100), 0) / totalOperations)
        : 0;

      return {
        data: {
          totalOperations,
          completedOperations,
          failedOperations,
          rolledBackOperations,
          totalItemsProcessed,
          avgSuccessRate: avgSuccessRate?.toFixed(2),
          successRate: totalOperations > 0 ? ((completedOperations / totalOperations) * 100)?.toFixed(2) : 0
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  subscribeToOperationUpdates(operationId, callback) {
    const channel = supabase
      ?.channel(`bulk_operation_${operationId}`)
      ?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bulk_operations',
          filter: `id=eq.${operationId}`
        },
        (payload) => {
          callback({
            eventType: payload?.eventType,
            data: toCamelCase(payload?.new || payload?.old)
          });
        }
      )
      ?.subscribe();

    return channel;
  },

  unsubscribeFromOperationUpdates(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  }
};