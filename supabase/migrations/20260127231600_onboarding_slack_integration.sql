-- =====================================================
-- ONBOARDING & SLACK INTEGRATION SYSTEM
-- Migration: 20260127231600_onboarding_slack_integration.sql
-- =====================================================

-- User Onboarding Progress Table
CREATE TABLE IF NOT EXISTS public.user_onboarding_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
    role TEXT NOT NULL DEFAULT 'voter',
    completed_steps JSONB DEFAULT '[]'::jsonb,
    current_step TEXT,
    completion_percentage INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    skipped BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Slack Notification Logs Table
CREATE TABLE IF NOT EXISTS public.slack_notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type TEXT NOT NULL,
    notification_data JSONB,
    delivery_status TEXT DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON public.user_onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_completed ON public.user_onboarding_progress(is_completed);
CREATE INDEX IF NOT EXISTS idx_slack_logs_alert_type ON public.slack_notification_logs(alert_type);
CREATE INDEX IF NOT EXISTS idx_slack_logs_status ON public.slack_notification_logs(delivery_status);
CREATE INDEX IF NOT EXISTS idx_slack_logs_created_at ON public.slack_notification_logs(created_at DESC);

-- RLS Policies for user_onboarding_progress
ALTER TABLE public.user_onboarding_progress ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view own onboarding progress" ON public.user_onboarding_progress;
    DROP POLICY IF EXISTS "Users can update own onboarding progress" ON public.user_onboarding_progress;
    DROP POLICY IF EXISTS "Admins can view all onboarding progress" ON public.user_onboarding_progress;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Users can view own onboarding progress"
    ON public.user_onboarding_progress
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding progress"
    ON public.user_onboarding_progress
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all onboarding progress"
    ON public.user_onboarding_progress
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'moderator')
        )
    );

-- RLS Policies for slack_notification_logs
ALTER TABLE public.slack_notification_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Admins can view slack logs" ON public.slack_notification_logs;
    DROP POLICY IF EXISTS "Admins can insert slack logs" ON public.slack_notification_logs;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Admins can view slack logs"
    ON public.slack_notification_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'moderator')
        )
    );

CREATE POLICY "Admins can insert slack logs"
    ON public.slack_notification_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'moderator')
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_onboarding_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Trigger for updated_at
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_onboarding_timestamp ON public.user_onboarding_progress;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

CREATE TRIGGER update_onboarding_timestamp
    BEFORE UPDATE ON public.user_onboarding_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.update_onboarding_updated_at();