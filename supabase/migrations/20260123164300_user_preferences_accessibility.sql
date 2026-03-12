-- User Preferences and Accessibility Settings Migration
-- Stores font size, theme, and accessibility preferences for users

-- Add preferences column to existing user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"fontSize": 15, "theme": "light"}'::jsonb;

-- Create index for faster preference queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_preferences ON public.user_profiles USING GIN (preferences);

-- Update existing users with default preferences if null
UPDATE public.user_profiles
SET preferences = '{"fontSize": 15, "theme": "light"}'::jsonb
WHERE preferences IS NULL;