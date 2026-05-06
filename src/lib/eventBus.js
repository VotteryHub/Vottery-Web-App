/**
 * Vottery Platform Event Bus
 * 
 * A lightweight, centralized event hub for cross-component signaling and analytics instrumentation.
 * Decouples action triggers from their multi-channel recording (Supabase, GA, Real-time UI).
 */

class EventBus {
  constructor() {
    this.listeners = {};
  }

  /**
   * Subscribe to an event
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  /**
   * Emit an event with optional data
   */
  emit(event, data = {}) {
    if (import.meta.env.DEV) {
      console.log(`[EventBus] ${event}:`, data);
    }

    if (!this.listeners[event]) return;
    
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[EventBus] Error in listener for ${event}:`, error);
      }
    });
  }
}

export const eventBus = new EventBus();

// Pre-defined core event types for type safety/intellisense
export const EVENTS = {
  // Auth Events
  AUTH_SIGNUP: 'auth:signup',
  AUTH_LOGIN: 'auth:login',
  AUTH_LOGOUT: 'auth:logout',
  
  // Election Events
  ELECTION_CREATED: 'election:created',
  ELECTION_VIEWED: 'election:viewed',
  ELECTION_DELETED: 'election:deleted',
  
  // Voting Events
  VOTE_CAST: 'vote:cast',
  VOTE_VERIFIED: 'vote:verified',
  VOTE_FLOW_STEP_VIEWED: 'vote:step_viewed',
  VOTE_FLOW_AUTO_ADVANCED: 'vote:auto_advanced',
  VOTE_FLOW_ERROR: 'vote:flow_error',
  
  // Admin Action Events
  ADMIN_ELECTION_APPROVED: 'admin:election_approved',
  ADMIN_ELECTION_REJECTED: 'admin:election_rejected',
  ADMIN_USER_SUSPENDED: 'admin:user_suspended',
  ADMIN_ROLE_UPDATED: 'admin:role_updated',
  ADMIN_CONFIG_CHANGED: 'admin:config_changed',
  
  // Content Events
  POST_CREATED: 'post:created',
  POST_ENGAGED: 'post:engaged', // like, comment, share
  
  // System Events
  SITE_LOADED: 'system:site_loaded',
  ERROR_ENCOUNTERED: 'system:error'
};
