import { supabase } from '../lib/supabase';

/**
 * Load Testing Auto-Response Service
 * Wires Production Load Testing Suite to trigger automated incident responses:
 * - Scale Supabase connections at 500K+ users
 * - Pause high-risk elections
 * - Activate circuit breakers
 * - One-click rollback
 * - Publishes to orchestration_workflows for same pipeline as other incidents
 */
export const loadTestingAutoResponseService = {
  THRESHOLD_500K: 500000,
  THRESHOLD_1M: 1000000,

  /**
   * Publish load-test event to orchestration pipeline (orchestration_workflows)
   * so auto-response uses the same pipeline as other incidents. Uses allowed
   * workflow_type 'incident_escalation' and trigger_source 'manual'.
   */
  async publishToOrchestration({ simulatedUsers, action, reason }) {
    try {
      const { data: session } = await supabase?.auth?.getSession();
      const userId = session?.data?.session?.user?.id || null;
      const priority = simulatedUsers >= this.THRESHOLD_1M ? 10 : simulatedUsers >= this.THRESHOLD_500K ? 9 : 8;

      await supabase?.from('orchestration_workflows')?.insert({
        workflow_name: `Load test auto-response (${simulatedUsers} users)`,
        workflow_type: 'incident_escalation',
        trigger_source: 'manual',
        status: 'active',
        priority,
        trigger_conditions: { simulatedUsers, action, reason, source: 'load_testing_suite' },
        execution_sequence: [
          { step: 1, action: action === 'scale' || action === 'full' ? 'scale_connections' : 'notify' },
          { step: 2, action: action === 'pause_elections' || action === 'full' ? 'pause_high_risk_elections' : 'notify' },
          { step: 3, action: action === 'circuit_breaker' || action === 'full' ? 'activate_circuit_breakers' : 'notify' },
        ],
        created_by: userId,
      });

      return { ok: true };
    } catch (e) {
      console.error('[LoadTestingAutoResponse] publishToOrchestration:', e);
      return { ok: false };
    }
  },

  /**
   * Trigger automated incident response when load exceeds threshold
   * @param {Object} options - { action, simulatedUsers, reason }
   * @returns {Promise<{data, error}>}
   */
  async triggerAutoResponse(options = {}) {
    try {
      const { action = 'full', simulatedUsers = 0, reason = 'Load test threshold exceeded' } = options;

      if (simulatedUsers >= this.THRESHOLD_500K) {
        await this.publishToOrchestration({ simulatedUsers, action, reason });
      }

      const { data, error } = await supabase?.functions?.invoke('load-testing-auto-response', {
        body: {
          action, // 'scale' | 'pause_elections' | 'circuit_breaker' | 'rollback' | 'full'
          simulatedUsers,
          reason,
          timestamp: new Date()?.toISOString(),
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[LoadTestingAutoResponse] Error:', err);
      // Fallback: log and notify when Edge function not deployed
      return {
        data: { triggered: false, message: 'Edge function load-testing-auto-response not deployed. Configure Supabase Edge Function.' },
        error: { message: err?.message },
      };
    }
  },

  /**
   * Scale Supabase connections (triggers infrastructure scaling)
   */
  async scaleConnections(simulatedUsers) {
    return this.triggerAutoResponse({
      action: 'scale',
      simulatedUsers,
      reason: `Simulated ${simulatedUsers} users - scale Supabase connections`,
    });
  },

  /**
   * Pause high-risk elections during load
   */
  async pauseHighRiskElections() {
    return this.triggerAutoResponse({
      action: 'pause_elections',
      reason: 'Load test triggered - pausing high-risk elections',
    });
  },

  /**
   * Activate circuit breakers
   */
  async activateCircuitBreakers() {
    return this.triggerAutoResponse({
      action: 'circuit_breaker',
      reason: 'Load test triggered - activating circuit breakers',
    });
  },

  /**
   * One-click rollback
   */
  async rollback() {
    return this.triggerAutoResponse({
      action: 'rollback',
      reason: 'Manual rollback from Load Testing Suite',
    });
  },

  /**
   * Full auto-response: scale + pause + circuit breakers
   */
  async triggerFullResponse(simulatedUsers) {
    return this.triggerAutoResponse({
      action: 'full',
      simulatedUsers,
      reason: `Load exceeded ${this.THRESHOLD_500K} - full auto-response`,
    });
  },
};
