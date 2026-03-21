-- Add regional currency display preference

ALTER TABLE IF EXISTS public.user_language_preferences
  ADD COLUMN IF NOT EXISTS currency_format TEXT DEFAULT 'local';
