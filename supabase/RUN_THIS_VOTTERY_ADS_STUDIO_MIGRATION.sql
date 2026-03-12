-- =====================================================
-- VOTTERY ADS STUDIO – UNIFIED SCHEMA (Copy, paste & run in Supabase SQL Editor)
-- Single system: normal (display/video) + participatory/gamified + Spark ads
-- Campaign > Ad Group > Ad hierarchy; zone + country + region targeting;
-- Ad events + quality metrics; AdSense fallback unchanged
-- =====================================================

-- Enums (shared Web + Mobile)
DO $$ BEGIN
  CREATE TYPE vottery_campaign_objective AS ENUM (
    'reach', 'traffic', 'app_installs', 'conversions'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vottery_ad_type AS ENUM (
    'display', 'video', 'participatory', 'spark'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vottery_pricing_model AS ENUM (
    'cpm', 'cpc', 'ocpm', 'cpv'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vottery_placement_style AS ENUM (
    'tiktok_style', 'facebook_style', 'premium'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ad_event_type AS ENUM (
    'IMPRESSION', 'VIEW_2S', 'VIEW_6S', 'COMPLETE', 'CLICK', 'HIDE', 'REPORT'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 1. CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.vottery_ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  objective vottery_campaign_objective NOT NULL DEFAULT 'reach',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vottery_ad_campaigns_advertiser ON public.vottery_ad_campaigns(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_vottery_ad_campaigns_status ON public.vottery_ad_campaigns(status);

-- 2. AD GROUPS (targeting, placement, budget)
CREATE TABLE IF NOT EXISTS public.vottery_ad_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.vottery_ad_campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_zones INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6,7,8],
  target_countries TEXT[] DEFAULT '{}',
  placement_mode TEXT NOT NULL DEFAULT 'automatic' CHECK (placement_mode IN ('automatic', 'manual')),
  placement_slots TEXT[] DEFAULT '{}',
  daily_budget_cents INTEGER,
  lifetime_budget_cents INTEGER,
  schedule_start TIMESTAMPTZ,
  schedule_end TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vottery_ad_groups_campaign ON public.vottery_ad_groups(campaign_id);
CREATE INDEX IF NOT EXISTS idx_vottery_ad_groups_status ON public.vottery_ad_groups(status);

-- 3. GEO TARGETING (sub-national)
CREATE TABLE IF NOT EXISTS public.vottery_ad_targeting_geo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_group_id UUID NOT NULL REFERENCES public.vottery_ad_groups(id) ON DELETE CASCADE,
  country_iso TEXT NOT NULL,
  region_code TEXT,
  region_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ad_group_id, country_iso, region_code)
);

CREATE INDEX IF NOT EXISTS idx_vottery_ad_targeting_geo_ad_group ON public.vottery_ad_targeting_geo(ad_group_id);

-- 4. ADS (creative; normal / participatory / spark)
CREATE TABLE IF NOT EXISTS public.vottery_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_group_id UUID NOT NULL REFERENCES public.vottery_ad_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ad_type vottery_ad_type NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'pending_review', 'rejected', 'completed', 'archived')),
  creative JSONB DEFAULT '{}',
  election_id UUID REFERENCES public.elections(id) ON DELETE SET NULL,
  enable_gamification BOOLEAN DEFAULT FALSE,
  prize_pool_cents INTEGER,
  source_post_id UUID,
  bid_amount_cents INTEGER NOT NULL DEFAULT 0,
  pricing_model vottery_pricing_model NOT NULL DEFAULT 'cpm',
  quality_score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vottery_ads_ad_group ON public.vottery_ads(ad_group_id);
CREATE INDEX IF NOT EXISTS idx_vottery_ads_status ON public.vottery_ads(status);
CREATE INDEX IF NOT EXISTS idx_vottery_ads_type ON public.vottery_ads(ad_type);
CREATE INDEX IF NOT EXISTS idx_vottery_ads_election ON public.vottery_ads(election_id);
CREATE INDEX IF NOT EXISTS idx_vottery_ads_source_post ON public.vottery_ads(source_post_id);

-- 5. SPARK AD REFERENCES (dual-ID tracking)
CREATE TABLE IF NOT EXISTS public.spark_ad_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES public.vottery_ads(id) ON DELETE CASCADE,
  source_post_id UUID NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'moment' CHECK (source_type IN ('moment', 'jolt')),
  cta_label TEXT,
  cta_destination_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ad_id)
);

CREATE INDEX IF NOT EXISTS idx_spark_ad_references_post ON public.spark_ad_references(source_post_id);

-- 6. AD EVENTS (fact table for quality & attribution)
CREATE TABLE IF NOT EXISTS public.ad_events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES public.vottery_ads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type ad_event_type NOT NULL,
  slot_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_ad_events_ad_id ON public.ad_events(ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_events_user_id ON public.ad_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_events_timestamp ON public.ad_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ad_events_type ON public.ad_events(event_type);

-- 7. AD QUALITY METRICS
CREATE TABLE IF NOT EXISTS public.ad_quality_metrics (
  ad_id UUID PRIMARY KEY REFERENCES public.vottery_ads(id) ON DELETE CASCADE,
  hook_rate NUMERIC(5,2) DEFAULT 0,
  hold_rate NUMERIC(5,2) DEFAULT 0,
  neg_score NUMERIC(10,2) DEFAULT 0,
  quality_score NUMERIC(8,2) DEFAULT 100,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PLACEMENT SLOTS
CREATE TABLE IF NOT EXISTS public.vottery_placement_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key TEXT NOT NULL UNIQUE,
  placement_style vottery_placement_style NOT NULL,
  platform TEXT NOT NULL DEFAULT 'all' CHECK (platform IN ('web', 'mobile', 'all')),
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.vottery_placement_slots (slot_key, placement_style, platform, label) VALUES
  ('top_view', 'premium', 'all', 'TopView'),
  ('feed_post', 'tiktok_style', 'all', 'Feed/Post'),
  ('moments', 'tiktok_style', 'all', 'Moments'),
  ('jolts', 'tiktok_style', 'all', 'Jolts'),
  ('creators_marketplace', 'facebook_style', 'all', 'Creators Services/Marketplace'),
  ('recommended_groups', 'facebook_style', 'all', 'Recommended Groups'),
  ('trending_topics', 'facebook_style', 'all', 'Trending Topics'),
  ('recommended_elections', 'facebook_style', 'all', 'Recommended Elections'),
  ('elections_voting_ui', 'facebook_style', 'all', 'Elections Voting Screen'),
  ('elections_verification_ui', 'facebook_style', 'all', 'Elections Verification Screen'),
  ('elections_audit_ui', 'facebook_style', 'all', 'Elections Audit Screen'),
  ('top_earners', 'facebook_style', 'all', 'Top Earners'),
  ('accuracy_champions', 'facebook_style', 'all', 'Accuracy Champions'),
  ('right_column', 'facebook_style', 'web', 'Right Column')
ON CONFLICT (slot_key) DO NOTHING;

-- 9. ADMIN CONFIG
CREATE TABLE IF NOT EXISTS public.vottery_ads_admin_config (
  key TEXT PRIMARY KEY,
  value_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.vottery_ads_admin_config (key, value_json) VALUES
  ('min_daily_budget_cents', '500'),
  ('min_campaign_budget_cents', '10000'),
  ('max_report_count_emergency_brake', '5'),
  ('attribution_click_days', '7'),
  ('attribution_view_days', '1')
ON CONFLICT (key) DO NOTHING;

-- 10. RLS
ALTER TABLE public.vottery_ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vottery_ad_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vottery_ad_targeting_geo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vottery_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spark_ad_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vottery_placement_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vottery_ads_admin_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vottery_campaigns_select_own" ON public.vottery_ad_campaigns;
CREATE POLICY "vottery_campaigns_select_own" ON public.vottery_ad_campaigns FOR SELECT USING (auth.uid() = advertiser_id);
DROP POLICY IF EXISTS "vottery_campaigns_all_own" ON public.vottery_ad_campaigns;
CREATE POLICY "vottery_campaigns_all_own" ON public.vottery_ad_campaigns FOR ALL USING (auth.uid() = advertiser_id);

DROP POLICY IF EXISTS "vottery_ad_groups_select" ON public.vottery_ad_groups;
CREATE POLICY "vottery_ad_groups_select" ON public.vottery_ad_groups FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.vottery_ad_campaigns c WHERE c.id = campaign_id AND c.advertiser_id = auth.uid())
);
DROP POLICY IF EXISTS "vottery_ad_groups_all" ON public.vottery_ad_groups;
CREATE POLICY "vottery_ad_groups_all" ON public.vottery_ad_groups FOR ALL USING (
  EXISTS (SELECT 1 FROM public.vottery_ad_campaigns c WHERE c.id = campaign_id AND c.advertiser_id = auth.uid())
);

DROP POLICY IF EXISTS "vottery_targeting_geo_select" ON public.vottery_ad_targeting_geo;
CREATE POLICY "vottery_targeting_geo_select" ON public.vottery_ad_targeting_geo FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.vottery_ad_groups ag
    JOIN public.vottery_ad_campaigns c ON c.id = ag.campaign_id
    WHERE ag.id = ad_group_id AND c.advertiser_id = auth.uid()
  )
);
DROP POLICY IF EXISTS "vottery_targeting_geo_all" ON public.vottery_ad_targeting_geo;
CREATE POLICY "vottery_targeting_geo_all" ON public.vottery_ad_targeting_geo FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.vottery_ad_groups ag
    JOIN public.vottery_ad_campaigns c ON c.id = ag.campaign_id
    WHERE ag.id = ad_group_id AND c.advertiser_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "vottery_ads_select" ON public.vottery_ads;
CREATE POLICY "vottery_ads_select" ON public.vottery_ads FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.vottery_ad_groups ag
    JOIN public.vottery_ad_campaigns c ON c.id = ag.campaign_id
    WHERE ag.id = ad_group_id AND (c.advertiser_id = auth.uid() OR status = 'active')
  )
);
DROP POLICY IF EXISTS "vottery_ads_insert_update" ON public.vottery_ads;
CREATE POLICY "vottery_ads_insert_update" ON public.vottery_ads FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.vottery_ad_groups ag
    JOIN public.vottery_ad_campaigns c ON c.id = ag.campaign_id
    WHERE ag.id = ad_group_id AND c.advertiser_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "spark_ad_ref_select" ON public.spark_ad_references;
CREATE POLICY "spark_ad_ref_select" ON public.spark_ad_references FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.vottery_ads a
    JOIN public.vottery_ad_groups ag ON ag.id = a.ad_group_id
    JOIN public.vottery_ad_campaigns c ON c.id = ag.campaign_id
    WHERE a.id = ad_id AND c.advertiser_id = auth.uid()
  )
);
DROP POLICY IF EXISTS "spark_ad_ref_all" ON public.spark_ad_references;
CREATE POLICY "spark_ad_ref_all" ON public.spark_ad_references FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.vottery_ads a
    JOIN public.vottery_ad_groups ag ON ag.id = a.ad_group_id
    JOIN public.vottery_ad_campaigns c ON c.id = ag.campaign_id
    WHERE a.id = ad_id AND c.advertiser_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "ad_events_insert_own" ON public.ad_events;
CREATE POLICY "ad_events_insert_own" ON public.ad_events FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "ad_events_select_own" ON public.ad_events;
CREATE POLICY "ad_events_select_own" ON public.ad_events FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "ad_events_select_advertiser" ON public.ad_events;
CREATE POLICY "ad_events_select_advertiser" ON public.ad_events FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.vottery_ads a
    JOIN public.vottery_ad_groups ag ON ag.id = a.ad_group_id
    JOIN public.vottery_ad_campaigns c ON c.id = ag.campaign_id
    WHERE a.id = ad_id AND c.advertiser_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "ad_quality_metrics_select" ON public.ad_quality_metrics;
CREATE POLICY "ad_quality_metrics_select" ON public.ad_quality_metrics FOR SELECT USING (true);

DROP POLICY IF EXISTS "vottery_placement_slots_select" ON public.vottery_placement_slots;
CREATE POLICY "vottery_placement_slots_select" ON public.vottery_placement_slots FOR SELECT USING (true);

DROP POLICY IF EXISTS "vottery_ads_admin_config_select" ON public.vottery_ads_admin_config;
CREATE POLICY "vottery_ads_admin_config_select" ON public.vottery_ads_admin_config FOR SELECT USING (true);

-- 11. EMERGENCY BRAKE TRIGGER (REPORT count > threshold → PENDING_REVIEW)
CREATE OR REPLACE FUNCTION public.check_ad_safety_on_report()
RETURNS TRIGGER AS $$
DECLARE
  report_count INTEGER;
  max_reports INTEGER;
BEGIN
  IF NEW.event_type <> 'REPORT' THEN
    RETURN NEW;
  END IF;

  SELECT (value_json#>>'{}')::INTEGER INTO max_reports
  FROM public.vottery_ads_admin_config
  WHERE key = 'max_report_count_emergency_brake'
  LIMIT 1;
  IF max_reports IS NULL THEN
    max_reports := 5;
  END IF;

  SELECT COUNT(*) INTO report_count
  FROM public.ad_events
  WHERE ad_id = NEW.ad_id AND event_type = 'REPORT';

  IF report_count > max_reports THEN
    UPDATE public.vottery_ads
    SET status = 'pending_review', updated_at = NOW()
    WHERE id = NEW.ad_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_ad_events_emergency_safety ON public.ad_events;
CREATE TRIGGER trg_ad_events_emergency_safety
  AFTER INSERT ON public.ad_events
  FOR EACH ROW
  WHEN (NEW.event_type = 'REPORT')
  EXECUTE PROCEDURE public.check_ad_safety_on_report();
