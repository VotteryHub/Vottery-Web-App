import { supabase } from '../lib/supabase';

export const identityOrchestrationService = {
  /**
   * Call backend identity orchestrator (Sumsub primary, Veriff fallback).
   * This is a thin client wrapper around the Supabase Edge Function.
   */
  async verifyIdentity({ purpose, electionId, minAgeRequired, sessionContext = {}, sessionData = {} }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('identity-orchestrator', {
        body: {
          purpose,
          userId: user.id,
          electionId: electionId ?? null,
          minAgeRequired: minAgeRequired ?? null,
          geo: sessionContext?.geo ?? null,
          sessionContext,
          sessionData
        }
      });

      if (error) {
        throw new Error(error?.message || 'Verification failed');
      }

      return {
        success: data?.success === true,
        provider: data?.provider,
        confidence: data?.confidence ?? null,
        fallbackUsed: data?.fallbackUsed ?? false,
        raw: data
      };
    } catch (err) {
      return {
        success: false,
        error: err?.message || 'Identity verification failed'
      };
    }
  }
};

export default identityOrchestrationService;

