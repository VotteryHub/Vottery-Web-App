import React from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import GeminiFallbackOrchestrationHub from '../gemini-fallback-orchestration-hub/index';

/**
 * Automatic AI Failover — same operational surface as Gemini Fallback Orchestration Hub
 * (Supabase ai_service_fallback_config, case reports, readiness). Distinct admin URL for parity with Mobile.
 */
export default function AutomaticAIFailoverEngineControlCenter() {
  return (
    <>
      <Helmet>
        <title>Automatic AI Failover Engine | Vottery</title>
        <meta
          name="description"
          content="Automatic AI provider failover, manual approvals, and fallback configuration."
        />
      </Helmet>
      <HeaderNavigation />
      <GeminiFallbackOrchestrationHub />
    </>
  );
}
