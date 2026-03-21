-- Seasonal challenges engine with language and region targeting

CREATE TABLE IF NOT EXISTS public.seasonal_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  season_key TEXT NOT NULL,
  region_code TEXT NOT NULL DEFAULT 'global',
  language_code TEXT NOT NULL DEFAULT 'en',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  vp_reward INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seasonal_challenges_active_window
  ON public.seasonal_challenges(is_active, starts_at, ends_at);

CREATE INDEX IF NOT EXISTS idx_seasonal_challenges_region_lang
  ON public.seasonal_challenges(region_code, language_code);

ALTER TABLE public.seasonal_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active seasonal challenges" ON public.seasonal_challenges;
CREATE POLICY "Public read active seasonal challenges" ON public.seasonal_challenges
  FOR SELECT USING (is_active = true);

INSERT INTO public.seasonal_challenges (
  title,
  description,
  season_key,
  region_code,
  language_code,
  starts_at,
  ends_at,
  vp_reward
)
VALUES
  (
    'Spring Civic Sprint',
    'Complete 5 votes this spring season.',
    'spring_2026',
    'global',
    'en',
    NOW(),
    NOW() + INTERVAL '30 days',
    250
  ),
  (
    'Regional Community Challenge',
    'Vote in community elections in your region.',
    'spring_2026',
    'africa',
    'en',
    NOW(),
    NOW() + INTERVAL '30 days',
    300
  )
ON CONFLICT DO NOTHING;
