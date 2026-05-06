import { eventBus, EVENTS } from '../lib/eventBus';
import { supabase } from '../lib/supabase';
import { feedRankingService } from './feedRankingService';
import { googleAnalyticsService } from './googleAnalyticsService';
import { adminLogService } from './adminLogService';

/**
 * EventBusRecorder
 * 
 * Automatically subscribes to core platform events and persists them to:
 * 1. user_engagement_signals (for user analytics/DAU/MAU)
 * 2. admin_activity_logs (for audit trails)
 * 3. googleAnalyticsService (for external tracking)
 */
class EventBusRecorder {
  constructor() {
    this.isInitialized = false;
    this.lastEventTimes = {}; // Per-type rate limiting
    this.eventDebounceMs = 100; // Lower threshold to allow rapid but legitimate sequences
    this.seenSteps = new Set(); // Per-session dedupe for steps
  }

  initialize() {
    if (this.isInitialized) return;

    // --- AUTH EVENTS ---
    eventBus.on(EVENTS.AUTH_LOGIN, (data) => this.recordUserSignal('login', data));
    eventBus.on(EVENTS.AUTH_SIGNUP, (data) => this.recordUserSignal('signup', data));

    // --- ELECTION EVENTS ---
    eventBus.on(EVENTS.ELECTION_CREATED, (data) => this.recordUserSignal('create_election', data));
    eventBus.on(EVENTS.ELECTION_VIEWED, (data) => this.recordUserSignal('view_election', data));

    // --- VOTING EVENTS ---
    eventBus.on(EVENTS.VOTE_CAST, (data) => this.recordUserSignal('cast_vote', data));

    // --- ADMIN EVENTS (Audit Logging) ---
    eventBus.on(EVENTS.ADMIN_ELECTION_APPROVED, (data) => this.recordAdminAction('election_approval', data));
    eventBus.on(EVENTS.ADMIN_ELECTION_REJECTED, (data) => this.recordAdminAction('election_rejection', data));
    eventBus.on(EVENTS.ADMIN_CONFIG_CHANGED, (data) => this.recordAdminAction('system_configuration', data));

    // --- VOTING FUNNEL TELEMETRY ---
    eventBus.on(EVENTS.VOTE_FLOW_STEP_VIEWED, (data) => {
      const dedupeKey = `${data.electionId}:${data.stepName}`;
      if (this.seenSteps.has(dedupeKey)) return; // Only log each step once per session
      
      this.recordFunnelEvent('step_viewed', data);
      this.seenSteps.add(dedupeKey);
    });

    eventBus.on(EVENTS.VOTE_FLOW_AUTO_ADVANCED, (data) => this.recordFunnelEvent('auto_advance', data));
    eventBus.on(EVENTS.VOTE_FLOW_ERROR, (data) => this.recordFunnelEvent('flow_error', data));

    this.isInitialized = true;
    console.log('[EventBusRecorder] Initialized with Per-Type Rate Limiting.');
  }

  /**
   * Persists a generic engagement signal to use for DAU/MAU/Trends
   */
  async recordUserSignal(signalType, data) {
    if (!this.checkRateLimit(signalType)) return;
    try {
      // 1. Record in Database (for platform analytics)
      await feedRankingService.recordEngagementSignal({
        engagementType: signalType,
        contentItemId: data.contentId || data.electionId || data.id,
        contentItemType: data.contentType || 'system',
        metadata: data.metadata || {}
      });

      // 2. Track in Google Analytics
      googleAnalyticsService.trackEvent(signalType, data.category || 'user_activity', data.label || '', data.value || 0);
      
    } catch (error) {
      console.error(`[EventBusRecorder] Failed to record signal ${signalType}:`, error);
    }
  }

  /**
   * Records critical admin actions to the audit log
   */
  async recordAdminAction(actionType, data) {
    try {
      await adminLogService.createActivityLog({
        actionType,
        actionDescription: data.description || `Admin performed ${actionType}`,
        affectedEntityType: data.entityType,
        affectedEntityId: data.entityId,
        severity: data.severity || 'info',
        complianceRelevant: data.isCompliance || false,
        metadata: data.metadata || {}
      });

      // Also track in standard GA
      googleAnalyticsService.trackEvent('admin_action', actionType, data.entityId || '', 1);

    } catch (error) {
      console.error(`[EventBusRecorder] Failed to record admin action ${actionType}:`, error);
    }
  }

  /**
   * Records voting funnel telemetry
   */
  async recordFunnelEvent(eventType, data) {
    const signalType = `funnel_${eventType}`;
    if (!this.checkRateLimit(signalType)) return;
    try {
      // 1. Record in Database (for platform analytics)
      await feedRankingService.recordEngagementSignal({
        engagementType: signalType,
        contentItemId: data.electionId,
        contentItemType: 'election', // Must match public.content_item_type enum
        metadata: data
      });

      // 2. Track in Google Analytics
      googleAnalyticsService.trackEvent('voting_funnel', eventType, data.electionId, 1);
      
    } catch (error) {
      console.error(`[EventBusRecorder] Failed to record funnel event ${eventType}:`, error);
    }
  }

  /**
   * Prevents event spam loops per event type
   */
  checkRateLimit(type) {
    const now = Date.now();
    const lastTime = this.lastEventTimes[type] || 0;
    
    if (now - lastTime < this.eventDebounceMs) {
      return false; // Dropping event to prevent spam
    }
    
    this.lastEventTimes[type] = now;
    return true;
  }
}

export const eventBusRecorder = new EventBusRecorder();
