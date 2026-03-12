-- Error Recovery System Migration
-- Creates tables for centralized error logging, retry tracking, and recovery analytics

-- Error Logs Table
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  component_name TEXT,
  screen_name TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_agent TEXT,
  url TEXT,
  retry_attempts INTEGER DEFAULT 0,
  recovered BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON public.error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_screen_name ON public.error_logs(screen_name);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_recovered ON public.error_logs(recovered);
CREATE INDEX IF NOT EXISTS idx_error_logs_component_name ON public.error_logs(component_name);

-- RLS Policies for error_logs
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to insert their own errors
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'error_logs' 
    AND policyname = 'Users can insert their own errors'
  ) THEN
    CREATE POLICY "Users can insert their own errors"
      ON public.error_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Allow users to view their own errors
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'error_logs' 
    AND policyname = 'Users can view their own errors'
  ) THEN
    CREATE POLICY "Users can view their own errors"
      ON public.error_logs
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Allow admins to view all errors
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'error_logs' 
    AND policyname = 'Admins can view all errors'
  ) THEN
    CREATE POLICY "Admins can view all errors"
      ON public.error_logs
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role IN ('admin', 'moderator')
        )
      );
  END IF;
END $$;

-- Allow admins to delete old errors
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'error_logs' 
    AND policyname = 'Admins can delete errors'
  ) THEN
    CREATE POLICY "Admins can delete errors"
      ON public.error_logs
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_error_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_error_logs_updated_at ON public.error_logs;
CREATE TRIGGER trigger_update_error_logs_updated_at
  BEFORE UPDATE ON public.error_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_error_logs_updated_at();

-- Function to clean up old error logs (keep last 30 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_error_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.error_logs
  WHERE created_at < now() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.cleanup_old_error_logs() TO authenticated;

COMMENT ON TABLE public.error_logs IS 'Centralized error logging for automatic retry and recovery tracking';
COMMENT ON COLUMN public.error_logs.error_type IS 'Type of error (e.g., ComponentError, NetworkError, retry_success)';
COMMENT ON COLUMN public.error_logs.retry_attempts IS 'Number of automatic retry attempts made';
COMMENT ON COLUMN public.error_logs.recovered IS 'Whether the error was successfully recovered';
COMMENT ON COLUMN public.error_logs.metadata IS 'Additional context and debugging information';