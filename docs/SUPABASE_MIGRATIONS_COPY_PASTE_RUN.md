# Supabase Migrations — Copy, Paste & Run

Run these in **Supabase Dashboard → SQL Editor**, one block at a time, in order.

---

## Run order

| # | Migration | Purpose |
|---|-----------|--------|
| 1 | Seed exhaustive feature toggles | 28 base toggles |
| 2 | Seed domain feature toggles | 46 domain-level toggles |
| 3 | Platform feature toggles public read | RLS: app can read toggles for gating |
| 4 | Seed comprehensive audit toggles | 150+ audit toggles |

---

## 1. Seed exhaustive feature toggles (20260309130000)

Copy everything below this line, paste into SQL Editor, click **Run**.

```sql
-- Seed exhaustive platform feature toggles (one toggle per platform feature)
-- Uses feature_key if present, else feature_name. Idempotent.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'platform_feature_toggles' AND column_name = 'category') THEN
    INSERT INTO public.platform_feature_toggles (feature_name, category, is_enabled)
    SELECT v.feature_name, v.cat, v.is_enabled FROM (VALUES
      ('election_creation', 'core'::text, true),
      ('gamified_elections', 'core', true),
      ('social_sharing', 'social', true),
      ('comments_system', 'social', true),
      ('emoji_reactions', 'social', true),
      ('direct_messaging', 'social', true),
      ('ai_content_moderation', 'ai', true),
      ('ai_fraud_detection', 'ai', true),
      ('biometric_voting', 'security', true),
      ('blockchain_verification', 'security', true),
      ('stripe_payments', 'payment', true),
      ('wallet_system', 'payment', true),
      ('advanced_analytics', 'analytics', true),
      ('predictive_analytics', 'analytics', true),
      ('participatory_advertising', 'payment', true),
      ('live_results', 'core', true),
      ('vote_change_approval', 'core', true),
      ('abstention_tracking', 'analytics', true),
      ('creator_success_academy', 'core', true),
      ('country_restrictions', 'security', true),
      ('platform_integrations', 'payment', true),
      ('notifications_resend', 'social', true),
      ('notifications_sms', 'social', true),
      ('google_analytics', 'analytics', true),
      ('content_moderation_webhooks', 'ai', true),
      ('vote_verification_portal', 'core', true),
      ('prediction_pools', 'core', true),
      ('multi_language', 'core', true)
    ) AS v(feature_name, cat, is_enabled)
    WHERE NOT EXISTS (SELECT 1 FROM public.platform_feature_toggles p WHERE p.feature_name = v.feature_name);
  ELSE
    INSERT INTO public.platform_feature_toggles (feature_name, feature_category, is_enabled)
    SELECT v.feature_name, v.cat, v.is_enabled FROM (VALUES
      ('election_creation', 'core'::text, true),
      ('gamified_elections', 'core', true),
      ('social_sharing', 'social', true),
      ('comments_system', 'social', true),
      ('emoji_reactions', 'social', true),
      ('direct_messaging', 'social', true),
      ('ai_content_moderation', 'ai', true),
      ('ai_fraud_detection', 'ai', true),
      ('biometric_voting', 'security', true),
      ('blockchain_verification', 'security', true),
      ('stripe_payments', 'payment', true),
      ('wallet_system', 'payment', true),
      ('advanced_analytics', 'analytics', true),
      ('predictive_analytics', 'analytics', true),
      ('participatory_advertising', 'payment', true),
      ('live_results', 'core', true),
      ('vote_change_approval', 'core', true),
      ('abstention_tracking', 'analytics', true),
      ('creator_success_academy', 'core', true),
      ('country_restrictions', 'security', true),
      ('platform_integrations', 'payment', true),
      ('notifications_resend', 'social', true),
      ('notifications_sms', 'social', true),
      ('google_analytics', 'analytics', true),
      ('content_moderation_webhooks', 'ai', true),
      ('vote_verification_portal', 'core', true),
      ('prediction_pools', 'core', true),
      ('multi_language', 'core', true)
    ) AS v(feature_name, cat, is_enabled)
    WHERE NOT EXISTS (SELECT 1 FROM public.platform_feature_toggles p WHERE p.feature_name = v.feature_name);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'platform_feature_toggles' AND column_name = 'feature_key') THEN
    UPDATE public.platform_feature_toggles
    SET feature_key = lower(replace(replace(feature_name, ' ', '_'), '-', '_'))
    WHERE feature_key IS NULL AND feature_name IS NOT NULL;
  END IF;
END $$;
```

---

## 2. Seed domain feature toggles (20260309140000)

Copy everything below, paste into SQL Editor, click **Run**.

```sql
-- Seed domain-level platform feature toggles. Idempotent.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'platform_feature_toggles' AND column_name = 'category') THEN
    INSERT INTO public.platform_feature_toggles (feature_name, category, is_enabled)
    SELECT v.feature_name, v.cat, v.is_enabled FROM (VALUES
      ('onboarding_wizard', 'core'::text, false),
      ('search_discovery_hub', 'core', false),
      ('accessibility_localization', 'core', true),
      ('user_feedback_portal', 'social', false),
      ('collaborative_voting_room', 'core', false),
      ('location_based_voting', 'core', false),
      ('external_voter_gate', 'core', false),
      ('plus_minus_voting', 'core', false),
      ('mcq_pre_voting_interface', 'core', false),
      ('groups_communities', 'social', false),
      ('moments_jolts_content', 'social', false),
      ('push_notifications', 'social', false),
      ('real_time_winner_notifications', 'social', false),
      ('creator_monetization_studio', 'payment', false),
      ('creator_earnings_command_center', 'payment', false),
      ('creator_analytics_growth', 'analytics', false),
      ('moments_jolts_studio', 'core', false),
      ('carousel_premium_management', 'core', false),
      ('creator_compliance_verification', 'security', false),
      ('creator_community_hub', 'social', false),
      ('ai_creator_tools', 'ai', false),
      ('mcq_creation_live_injection', 'core', false),
      ('presentation_audience_qa', 'core', false),
      ('participatory_ads_studio', 'payment', false),
      ('campaign_management_dashboard', 'payment', false),
      ('advertiser_analytics_roi', 'analytics', false),
      ('ad_slot_manager', 'payment', false),
      ('brand_advertiser_registration', 'payment', false),
      ('content_moderation_center', 'ai', true),
      ('fraud_detection_dashboards', 'ai', true),
      ('incident_response_center', 'security', false),
      ('payout_automation', 'payment', true),
      ('compliance_regulatory', 'security', false),
      ('performance_monitoring', 'analytics', false),
      ('ai_orchestration', 'ai', false),
      ('realtime_infrastructure', 'core', false),
      ('webhook_api_management', 'core', false),
      ('alert_management', 'ai', false),
      ('sms_management_admin', 'social', false),
      ('executive_reporting', 'analytics', false),
      ('bulk_management', 'core', false),
      ('admin_platform_logs', 'analytics', false),
      ('enterprise_white_label', 'core', false),
      ('enterprise_sso', 'security', false),
      ('feature_implementation_notifications', 'social', false),
      ('creator_prize_compliance', 'security', false)
    ) AS v(feature_name, cat, is_enabled)
    WHERE NOT EXISTS (SELECT 1 FROM public.platform_feature_toggles p WHERE p.feature_name = v.feature_name);
  ELSE
    INSERT INTO public.platform_feature_toggles (feature_name, feature_category, is_enabled)
    SELECT v.feature_name, v.cat, v.is_enabled FROM (VALUES
      ('onboarding_wizard', 'core'::text, false),
      ('search_discovery_hub', 'core', false),
      ('accessibility_localization', 'core', true),
      ('user_feedback_portal', 'social', false),
      ('collaborative_voting_room', 'core', false),
      ('location_based_voting', 'core', false),
      ('external_voter_gate', 'core', false),
      ('plus_minus_voting', 'core', false),
      ('mcq_pre_voting_interface', 'core', false),
      ('groups_communities', 'social', false),
      ('moments_jolts_content', 'social', false),
      ('push_notifications', 'social', false),
      ('real_time_winner_notifications', 'social', false),
      ('creator_monetization_studio', 'payment', false),
      ('creator_earnings_command_center', 'payment', false),
      ('creator_analytics_growth', 'analytics', false),
      ('moments_jolts_studio', 'core', false),
      ('carousel_premium_management', 'core', false),
      ('creator_compliance_verification', 'security', false),
      ('creator_community_hub', 'social', false),
      ('ai_creator_tools', 'ai', false),
      ('mcq_creation_live_injection', 'core', false),
      ('presentation_audience_qa', 'core', false),
      ('participatory_ads_studio', 'payment', false),
      ('campaign_management_dashboard', 'payment', false),
      ('advertiser_analytics_roi', 'analytics', false),
      ('ad_slot_manager', 'payment', false),
      ('brand_advertiser_registration', 'payment', false),
      ('content_moderation_center', 'ai', true),
      ('fraud_detection_dashboards', 'ai', true),
      ('incident_response_center', 'security', false),
      ('payout_automation', 'payment', true),
      ('compliance_regulatory', 'security', false),
      ('performance_monitoring', 'analytics', false),
      ('ai_orchestration', 'ai', false),
      ('realtime_infrastructure', 'core', false),
      ('webhook_api_management', 'core', false),
      ('alert_management', 'ai', false),
      ('sms_management_admin', 'social', false),
      ('executive_reporting', 'analytics', false),
      ('bulk_management', 'core', false),
      ('admin_platform_logs', 'analytics', false),
      ('enterprise_white_label', 'core', false),
      ('enterprise_sso', 'security', false),
      ('feature_implementation_notifications', 'social', false),
      ('creator_prize_compliance', 'security', false)
    ) AS v(feature_name, cat, is_enabled)
    WHERE NOT EXISTS (SELECT 1 FROM public.platform_feature_toggles p WHERE p.feature_name = v.feature_name);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'platform_feature_toggles' AND column_name = 'feature_key') THEN
    UPDATE public.platform_feature_toggles
    SET feature_key = lower(replace(replace(feature_name, ' ', '_'), '-', '_'))
    WHERE feature_key IS NULL AND feature_name IS NOT NULL;
  END IF;
END $$;
```

---

## 3. Platform feature toggles public read (20260309150000)

Copy everything below, paste into SQL Editor, click **Run**.

**Note:** Requires `public.is_admin()` to exist. If you get an error, ensure your RBAC migration (e.g. `20260304100000_backend_rbac_enhancements.sql`) has been run first.

```sql
-- Allow all users to SELECT platform_feature_toggles for app gating. Write stays admin-only.

DROP POLICY IF EXISTS "platform_feature_toggles_admin_all" ON public.platform_feature_toggles;

CREATE POLICY "platform_feature_toggles_select_all"
  ON public.platform_feature_toggles FOR SELECT
  USING (true);

CREATE POLICY "platform_feature_toggles_admin_insert"
  ON public.platform_feature_toggles FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "platform_feature_toggles_admin_update"
  ON public.platform_feature_toggles FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "platform_feature_toggles_admin_delete"
  ON public.platform_feature_toggles FOR DELETE
  USING (public.is_admin());
```

---

## 4. Seed comprehensive audit toggles (20260309160000)

Copy the full SQL from your project file and run it in the SQL Editor.

**File:** `supabase/migrations/20260309160000_seed_comprehensive_audit_toggles.sql`

Because the script is long (~470 lines), use one of these options:

**Option A — Run from file (recommended)**  
1. Open `supabase/migrations/20260309160000_seed_comprehensive_audit_toggles.sql` in your editor.  
2. Select All (Ctrl+A / Cmd+A), Copy.  
3. Paste into Supabase SQL Editor, Run.

**Option B — Run via Supabase CLI**  
From the project root (where `supabase/` lives):

```bash
supabase db push
```

Or run only this migration if your CLI is linked:

```bash
supabase migration up
```

---

## Quick checklist

- [ ] **1** — Seed exhaustive feature toggles (28 rows)
- [ ] **2** — Seed domain feature toggles (46 rows)
- [ ] **3** — Platform feature toggles public read (RLS)
- [ ] **4** — Seed comprehensive audit toggles (open file, copy all, paste, run)

After all four: **Admin Control Center → Platform Controls → Platform Features** will list all toggles with search and category filter; Web and Mobile can read toggles for feature gating.
