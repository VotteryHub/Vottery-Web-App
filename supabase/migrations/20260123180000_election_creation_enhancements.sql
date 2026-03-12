-- Add new columns to elections table for watch time type and percentage
ALTER TABLE public.elections
ADD COLUMN IF NOT EXISTS watch_time_type TEXT DEFAULT 'seconds' CHECK (watch_time_type IN ('seconds', 'percentage')),
ADD COLUMN IF NOT EXISTS min_watch_percentage INTEGER DEFAULT NULL CHECK (min_watch_percentage >= 1 AND min_watch_percentage <= 100),
ADD COLUMN IF NOT EXISTS start_time TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS end_time TEXT DEFAULT NULL;

-- Add comment for new columns
COMMENT ON COLUMN public.elections.watch_time_type IS 'Type of watch requirement: seconds or percentage';
COMMENT ON COLUMN public.elections.min_watch_percentage IS 'Minimum percentage of video that must be watched (1-100%)';
COMMENT ON COLUMN public.elections.start_time IS 'Start time for voting (HH:MM format)';
COMMENT ON COLUMN public.elections.end_time IS 'End time for voting (HH:MM format)';