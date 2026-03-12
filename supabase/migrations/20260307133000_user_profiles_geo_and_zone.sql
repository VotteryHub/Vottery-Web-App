-- =====================================================
-- User geo + purchasing power zone fields (for ads targeting + analytics)
-- Adds structured geo fields and purchasing_power_zone to:
-- - public.user_profiles (primary Vottery profile table in this repo)
-- - public.profiles (if exists; some clients use it)
-- =====================================================

-- user_profiles
ALTER TABLE IF EXISTS public.user_profiles
  ADD COLUMN IF NOT EXISTS purchasing_power_zone INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS country_iso TEXT,
  ADD COLUMN IF NOT EXISTS region_code TEXT,
  ADD COLUMN IF NOT EXISTS region_name TEXT;

CREATE INDEX IF NOT EXISTS idx_user_profiles_pp_zone ON public.user_profiles(purchasing_power_zone);
CREATE INDEX IF NOT EXISTS idx_user_profiles_country_iso ON public.user_profiles(country_iso);
CREATE INDEX IF NOT EXISTS idx_user_profiles_region_code ON public.user_profiles(region_code);

-- profiles (optional: only if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    EXECUTE $sql$
      ALTER TABLE public.profiles
        ADD COLUMN IF NOT EXISTS purchasing_power_zone INTEGER DEFAULT 1,
        ADD COLUMN IF NOT EXISTS country_iso TEXT,
        ADD COLUMN IF NOT EXISTS region_code TEXT,
        ADD COLUMN IF NOT EXISTS region_name TEXT;
    $sql$;
  END IF;
END $$;

