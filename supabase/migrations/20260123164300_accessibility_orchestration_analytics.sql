-- Extend user_profiles with accessibility preferences
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"fontSize": 15, "theme": "light", "highContrast": false, "reducedMotion": false, "dyslexiaFont": false}'::jsonb;

-- Create unified_incident_orchestration table
CREATE TABLE IF NOT EXISTS public.unified_incident_orchestration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES public.incident_response_workflows(id) ON DELETE CASCADE,
    orchestration_type TEXT NOT NULL,
    perplexity_threat_analysis JSONB,
    claude_decision_reasoning JSONB,
    openai_semantic_matching JSONB,
    cascading_actions JSONB DEFAULT '[]'::jsonb,
    stakeholder_escalation JSONB DEFAULT '[]'::jsonb,
    execution_status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    automated_responses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create cross_domain_intelligence_analytics table
CREATE TABLE IF NOT EXISTS public.cross_domain_intelligence_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_type TEXT NOT NULL,
    perplexity_threat_forecasting JSONB,
    claude_dispute_patterns JSONB,
    openai_semantic_insights JSONB,
    intelligence_correlations JSONB DEFAULT '[]'::jsonb,
    strategic_recommendations JSONB DEFAULT '[]'::jsonb,
    confidence_score NUMERIC(5,2),
    actionable_insights JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create accessibility_analytics table for Google Analytics tracking
CREATE TABLE IF NOT EXISTS public.accessibility_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB,
    font_size INTEGER,
    theme TEXT,
    high_contrast BOOLEAN,
    reduced_motion BOOLEAN,
    engagement_metrics JSONB DEFAULT '{}'::jsonb,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_unified_incident_orchestration_incident_id ON public.unified_incident_orchestration(incident_id);
CREATE INDEX IF NOT EXISTS idx_unified_incident_orchestration_status ON public.unified_incident_orchestration(execution_status);
CREATE INDEX IF NOT EXISTS idx_cross_domain_intelligence_type ON public.cross_domain_intelligence_analytics(analysis_type);
CREATE INDEX IF NOT EXISTS idx_accessibility_analytics_user_id ON public.accessibility_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_accessibility_analytics_event_type ON public.accessibility_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_accessibility_analytics_created_at ON public.accessibility_analytics(created_at);

-- Enable RLS
ALTER TABLE public.unified_incident_orchestration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_domain_intelligence_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessibility_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for unified_incident_orchestration
CREATE POLICY "authenticated_users_view_orchestration"
ON public.unified_incident_orchestration
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_manage_orchestration"
ON public.unified_incident_orchestration
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- RLS Policies for cross_domain_intelligence_analytics
CREATE POLICY "authenticated_users_view_intelligence"
ON public.cross_domain_intelligence_analytics
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_manage_intelligence"
ON public.cross_domain_intelligence_analytics
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- RLS Policies for accessibility_analytics
CREATE POLICY "users_view_own_accessibility_analytics"
ON public.accessibility_analytics
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users_manage_own_accessibility_analytics"
ON public.accessibility_analytics
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Mock data for testing
DO $$
DECLARE
    existing_user_id UUID;
    existing_incident_id UUID;
    orchestration_id UUID := gen_random_uuid();
    analytics_id UUID := gen_random_uuid();
BEGIN
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    SELECT id INTO existing_incident_id FROM public.incident_response_workflows LIMIT 1;
    
    IF existing_user_id IS NOT NULL THEN
        UPDATE public.user_profiles
        SET preferences = '{"fontSize": 15, "theme": "light", "highContrast": false, "reducedMotion": false, "dyslexiaFont": false}'::jsonb
        WHERE id = existing_user_id;
        
        INSERT INTO public.accessibility_analytics (id, user_id, event_type, event_data, font_size, theme, high_contrast, reduced_motion, engagement_metrics)
        VALUES (
            gen_random_uuid(),
            existing_user_id,
            'font_size_change',
            '{"action": "increase", "previous_size": 15, "new_size": 16}'::jsonb,
            16,
            'light',
            false,
            false,
            '{"session_duration": 120, "interactions": 5}'::jsonb
        );
    END IF;
    
    IF existing_incident_id IS NOT NULL THEN
        INSERT INTO public.unified_incident_orchestration (id, incident_id, orchestration_type, perplexity_threat_analysis, claude_decision_reasoning, cascading_actions, execution_status, priority)
        VALUES (
            orchestration_id,
            existing_incident_id,
            'fraud_detection_response',
            '{"threatLevel": "high", "threatScore": 85, "attackVectors": ["credential_stuffing", "account_takeover"]}'::jsonb,
            '{"confidence": 0.92, "recommendation": "immediate_account_freeze", "reasoning": "Multiple failed login attempts from suspicious IPs"}'::jsonb,
            '[{"action": "freeze_account", "status": "executed"}, {"action": "notify_security_team", "status": "pending"}]'::jsonb,
            'in_progress',
            'high'
        );
    END IF;
    
    INSERT INTO public.cross_domain_intelligence_analytics (id, analysis_type, perplexity_threat_forecasting, claude_dispute_patterns, openai_semantic_insights, intelligence_correlations, strategic_recommendations, confidence_score)
    VALUES (
        analytics_id,
        'fraud_pattern_analysis',
        '{"emergingThreats": ["synthetic_identity_fraud", "payment_card_testing"], "forecastedRisk": "high", "timeframe": "next_30_days"}'::jsonb,
        '{"commonDisputeTypes": ["unauthorized_transaction", "service_not_received"], "resolutionPatterns": ["evidence_based_ruling", "partial_refund"]}'::jsonb,
        '{"semanticClusters": ["financial_fraud", "identity_theft"], "matchConfidence": 0.88}'::jsonb,
        '[{"correlation": "high_fraud_risk_correlates_with_dispute_volume", "strength": 0.85}]'::jsonb,
        '[{"recommendation": "Implement enhanced KYC verification", "priority": "high", "impact": "reduce_fraud_by_40_percent"}]'::jsonb,
        0.87
    );
END $$;