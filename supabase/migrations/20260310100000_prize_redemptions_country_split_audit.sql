-- Prize redemptions: add country and revenue-split audit columns for country-based payout calculation
-- Enables audit trail and display of which split (country/campaign/global) applied per payout.

ALTER TABLE public.prize_redemptions
  ADD COLUMN IF NOT EXISTS country_code TEXT,
  ADD COLUMN IF NOT EXISTS creator_percentage NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS platform_percentage NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS split_source TEXT;

CREATE INDEX IF NOT EXISTS idx_prize_redemptions_country_code ON public.prize_redemptions(country_code);
COMMENT ON COLUMN public.prize_redemptions.country_code IS 'Creator country at time of payout; used for country-based revenue split audit.';
COMMENT ON COLUMN public.prize_redemptions.split_source IS 'Source of split: country_specific, creator_override, campaign, global_config, fallback_default.';
