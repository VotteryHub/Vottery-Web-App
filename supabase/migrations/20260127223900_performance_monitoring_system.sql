-- Performance Monitoring System Migration
-- Creates tables for tracking screen load times, user interactions, feature adoption, and conversion funnels

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  screen_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON public.performance_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_type ON public.performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_screen_name ON public.performance_metrics(screen_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON public.performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type_screen ON public.performance_metrics(metric_type, screen_name);

-- RLS Policies for performance_metrics
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to insert their own metrics
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'performance_metrics' 
    AND policyname = 'Users can insert their own metrics'
  ) THEN
    CREATE POLICY "Users can insert their own metrics"
      ON public.performance_metrics
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Allow users to view their own metrics
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'performance_metrics' 
    AND policyname = 'Users can view their own metrics'
  ) THEN
    CREATE POLICY "Users can view their own metrics"
      ON public.performance_metrics
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Allow admins to view all metrics
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'performance_metrics' 
    AND policyname = 'Admins can view all metrics'
  ) THEN
    CREATE POLICY "Admins can view all metrics"
      ON public.performance_metrics
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE user_profiles.user_id = auth.uid()
          AND user_profiles.role IN ('super_admin', 'admin', 'manager', 'analyst')
        )
      );
  END IF;
END $$;

-- Allow admins to delete old metrics
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'performance_metrics' 
    AND policyname = 'Admins can delete metrics'
  ) THEN
    CREATE POLICY "Admins can delete metrics"
      ON public.performance_metrics
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE user_profiles.user_id = auth.uid()
          AND user_profiles.role IN ('super_admin', 'admin')
        )
      );
  END IF;
END $$;

-- Function to get performance statistics
CREATE OR REPLACE FUNCTION public.get_performance_statistics(
  p_time_range TEXT DEFAULT '24h',
  p_screen_name TEXT DEFAULT NULL
)
RETURNS TABLE (
  metric_type TEXT,
  avg_value NUMERIC,
  min_value NUMERIC,
  max_value NUMERIC,
  p50_value NUMERIC,
  p95_value NUMERIC,
  count BIGINT
) AS $$
DECLARE
  v_start_date TIMESTAMPTZ;
BEGIN
  -- Calculate start date based on time range
  CASE p_time_range
    WHEN '1h' THEN v_start_date := now() - INTERVAL '1 hour';
    WHEN '24h' THEN v_start_date := now() - INTERVAL '24 hours';
    WHEN '7d' THEN v_start_date := now() - INTERVAL '7 days';
    WHEN '30d' THEN v_start_date := now() - INTERVAL '30 days';
    ELSE v_start_date := now() - INTERVAL '24 hours';
  END CASE;

  RETURN QUERY
  SELECT 
    pm.metric_type,
    AVG(pm.value) as avg_value,
    MIN(pm.value) as min_value,
    MAX(pm.value) as max_value,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY pm.value) as p50_value,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY pm.value) as p95_value,
    COUNT(*) as count
  FROM public.performance_metrics pm
  WHERE pm.created_at >= v_start_date
    AND (p_screen_name IS NULL OR pm.screen_name = p_screen_name)
  GROUP BY pm.metric_type
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get bottleneck screens
CREATE OR REPLACE FUNCTION public.get_bottleneck_screens(
  p_time_range TEXT DEFAULT '24h',
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  screen_name TEXT,
  avg_load_time NUMERIC,
  total_loads BIGINT,
  interaction_count BIGINT
) AS $$
DECLARE
  v_start_date TIMESTAMPTZ;
BEGIN
  -- Calculate start date based on time range
  CASE p_time_range
    WHEN '1h' THEN v_start_date := now() - INTERVAL '1 hour';
    WHEN '24h' THEN v_start_date := now() - INTERVAL '24 hours';
    WHEN '7d' THEN v_start_date := now() - INTERVAL '7 days';
    WHEN '30d' THEN v_start_date := now() - INTERVAL '30 days';
    ELSE v_start_date := now() - INTERVAL '24 hours';
  END CASE;

  RETURN QUERY
  SELECT 
    pm.screen_name,
    AVG(CASE WHEN pm.metric_type = 'screen_load' THEN pm.value ELSE NULL END) as avg_load_time,
    COUNT(CASE WHEN pm.metric_type = 'screen_load' THEN 1 ELSE NULL END) as total_loads,
    COUNT(CASE WHEN pm.metric_type = 'user_interaction' THEN 1 ELSE NULL END) as interaction_count
  FROM public.performance_metrics pm
  WHERE pm.created_at >= v_start_date
  GROUP BY pm.screen_name
  HAVING COUNT(CASE WHEN pm.metric_type = 'screen_load' THEN 1 ELSE NULL END) > 0
  ORDER BY avg_load_time DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old performance metrics (keep last 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_performance_metrics()
RETURNS void AS $$
BEGIN
  DELETE FROM public.performance_metrics
  WHERE created_at < now() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_performance_statistics(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_bottleneck_screens(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_old_performance_metrics() TO authenticated;

COMMENT ON TABLE public.performance_metrics IS 'Performance monitoring data for screen loads, interactions, and feature adoption';
COMMENT ON COLUMN public.performance_metrics.metric_type IS 'Type of metric (screen_load, user_interaction, feature_adoption, conversion_funnel, api_performance, web_vitals)';
COMMENT ON COLUMN public.performance_metrics.value IS 'Numeric value of the metric (e.g., load time in ms, interaction timestamp)';
COMMENT ON COLUMN public.performance_metrics.metadata IS 'Additional context and details about the metric';