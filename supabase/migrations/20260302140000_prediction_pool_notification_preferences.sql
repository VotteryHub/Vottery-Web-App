-- Add notification_settings JSONB to user_preferences for Prediction Pool Notifications Hub
-- Keys: prediction_confirmations, prediction_countdowns, pool_resolutions, leaderboard_changes

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_preferences')
     AND NOT EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'user_preferences' AND column_name = 'notification_settings'
     ) THEN
    ALTER TABLE public.user_preferences ADD COLUMN notification_settings JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;
