-- VP/XP parity hardening for Web + Mobile
-- Adds shared catalogs and reminders used by both clients.

CREATE TABLE IF NOT EXISTS public.vp_charity_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  vp_to_usd_rate NUMERIC NOT NULL DEFAULT 1000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vp_crypto_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_symbol TEXT NOT NULL,
  vp_rate NUMERIC NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (token_symbol)
);

CREATE TABLE IF NOT EXISTS public.user_streak_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('streak_expiry_24h', 'streak_expiry_1h')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_streak_reminders_user_id
  ON public.user_streak_reminders(user_id);

CREATE INDEX IF NOT EXISTS idx_user_streak_reminders_scheduled_for
  ON public.user_streak_reminders(scheduled_for);

ALTER TABLE public.vp_charity_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vp_crypto_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streak_reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read charity partners" ON public.vp_charity_partners;
CREATE POLICY "Public read charity partners" ON public.vp_charity_partners
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read crypto rates" ON public.vp_crypto_rates;
CREATE POLICY "Public read crypto rates" ON public.vp_crypto_rates
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can read own streak reminders" ON public.user_streak_reminders;
CREATE POLICY "Users can read own streak reminders" ON public.user_streak_reminders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own streak reminders" ON public.user_streak_reminders;
CREATE POLICY "Users can insert own streak reminders" ON public.user_streak_reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own streak reminders" ON public.user_streak_reminders;
CREATE POLICY "Users can update own streak reminders" ON public.user_streak_reminders
  FOR UPDATE USING (auth.uid() = user_id);

INSERT INTO public.vp_charity_partners (partner_key, name, vp_to_usd_rate)
VALUES
  ('global_education_fund', 'Global Education Fund', 1000),
  ('clean_water_initiative', 'Clean Water Initiative', 1000),
  ('healthcare_access_foundation', 'Healthcare Access Foundation', 1000)
ON CONFLICT (partner_key) DO NOTHING;

INSERT INTO public.vp_crypto_rates (token_symbol, vp_rate)
VALUES
  ('USDC', 1000),
  ('USDT', 1000),
  ('BTC', 50000)
ON CONFLICT (token_symbol) DO UPDATE SET
  vp_rate = EXCLUDED.vp_rate,
  is_active = true,
  updated_at = NOW();
