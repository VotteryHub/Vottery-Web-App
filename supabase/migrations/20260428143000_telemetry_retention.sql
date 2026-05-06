-- Migration: Telemetry Optimization and Retention
-- Phase 14B: Indexes and Data Lifecycle Management

-- 1. Performance Indexes for Funnel Analysis
CREATE INDEX IF NOT EXISTS idx_user_engagement_signals_type_created 
ON public.user_engagement_signals(engagement_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_engagement_signals_content_created 
ON public.user_engagement_signals(content_item_id, created_at DESC);

-- 2. Infrastructure for Verification and Analytics
CREATE TABLE IF NOT EXISTS public.maintenance_logs (
    task_name TEXT PRIMARY KEY,
    last_run_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status TEXT
);

CREATE TABLE IF NOT EXISTS public.daily_funnel_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day DATE NOT NULL,
    election_id UUID NOT NULL,
    step_name TEXT NOT NULL,
    event_count INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(day, election_id, step_name)
);

CREATE INDEX IF NOT EXISTS idx_daily_funnel_metrics_day ON public.daily_funnel_metrics(day DESC);

-- 3. Maintenance Logic
CREATE OR REPLACE FUNCTION public.maintain_telemetry_data()
RETURNS void AS $$
BEGIN
    -- A. Aggregate yesterday's data into daily summaries
    INSERT INTO public.daily_funnel_metrics (day, election_id, step_name, event_count, unique_users)
    SELECT 
        created_at::date as day,
        content_item_id as election_id,
        metadata->>'stepName' as step_name,
        COUNT(*) as event_count,
        COUNT(DISTINCT user_id) as unique_users
    FROM public.user_engagement_signals
    WHERE created_at >= (CURRENT_DATE - INTERVAL '1 day')
      AND created_at < CURRENT_DATE
      AND engagement_type LIKE 'funnel_%'
      AND content_item_type = 'election' -- Ensure we are only aggregating election funnel events
    GROUP BY 1, 2, 3
    ON CONFLICT (day, election_id, step_name) DO UPDATE 
    SET event_count = EXCLUDED.event_count,
        unique_users = EXCLUDED.unique_users;

    -- B. Purge raw data older than 30 days
    DELETE FROM public.user_engagement_signals
    WHERE created_at < (CURRENT_DATE - INTERVAL '30 days')
      AND (engagement_type LIKE 'funnel_%' OR engagement_type = 'site_loaded');

    -- C. Purge daily summaries older than 12 months
    DELETE FROM public.daily_funnel_metrics
    WHERE day < (CURRENT_DATE - INTERVAL '12 months');

    -- D. Log the maintenance run for operational visibility
    INSERT INTO public.maintenance_logs (task_name, last_run_at, status)
    VALUES ('telemetry_retention', CURRENT_TIMESTAMP, 'success')
    ON CONFLICT (task_name) DO UPDATE 
    SET last_run_at = EXCLUDED.last_run_at,
        status = EXCLUDED.status;
END;
$$ LANGUAGE plpgsql;

-- NOTE: In a production Supabase environment, schedule this via pg_cron:
-- SELECT cron.schedule('maintain-telemetry', '0 2 * * *', 'SELECT public.maintain_telemetry_data()');
