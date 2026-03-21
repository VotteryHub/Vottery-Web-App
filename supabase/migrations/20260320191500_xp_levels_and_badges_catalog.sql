-- XP/Badge parity catalog hardening

CREATE TABLE IF NOT EXISTS public.level_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level INTEGER NOT NULL UNIQUE,
  unlock_key TEXT NOT NULL,
  unlock_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.level_unlocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read level unlocks" ON public.level_unlocks;
CREATE POLICY "Public read level unlocks" ON public.level_unlocks
  FOR SELECT USING (true);

INSERT INTO public.level_unlocks (level, unlock_key, unlock_name)
SELECT
  gs.level,
  'level_unlock_' || gs.level,
  'Level ' || gs.level || ' Unlock'
FROM generate_series(1, 100) AS gs(level)
ON CONFLICT (level) DO NOTHING;

-- Ensure at least 50 active achievements exist for badge system.
-- Reuses the existing public.achievements table when present.
DO $$
DECLARE
  v_has_table BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'achievements'
  ) INTO v_has_table;

  IF v_has_table THEN
    INSERT INTO public.achievements (
      achievement_key,
      title,
      description,
      requirement_type,
      requirement_value,
      vp_reward,
      xp_reward,
      is_active,
      display_order
    )
    SELECT
      'badge_' || gs.n,
      'Badge #' || gs.n,
      'Milestone badge ' || gs.n,
      'count',
      gs.n,
      10 + gs.n,
      5 + gs.n,
      true,
      gs.n
    FROM generate_series(1, 60) AS gs(n)
    ON CONFLICT (achievement_key) DO NOTHING;
  END IF;
END $$;
