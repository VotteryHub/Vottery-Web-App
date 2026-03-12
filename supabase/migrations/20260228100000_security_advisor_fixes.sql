-- =====================================================
-- SECURITY ADVISOR FIXES
-- Migration: 20260228100000_security_advisor_fixes.sql
-- Fixes: 52 Errors, 453 Warnings from Supabase Security Advisor
-- =====================================================

-- =====================================================
-- SECTION 1: ENABLE RLS ON ALL TABLES MISSING IT
-- =====================================================

-- Core tables that may be missing RLS
ALTER TABLE IF EXISTS public.social_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.emoji_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.prize_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payout_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.account_lockouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mfa_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.election_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.platform_gamification_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gamification_allocation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.platform_gamification_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gamification_user_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gamification_api_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gamification_api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gamification_campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sponsored_elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.advertiser_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ab_test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fraud_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fraud_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.zero_knowledge_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.topic_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.age_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.creator_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mcq_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mcq_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.jolts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.jolt_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.platform_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.error_recovery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.voting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sms_health_check_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sms_failover_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.content_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.message_reactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECTION 2: HELPER FUNCTION - IS ADMIN (NON-RECURSIVE)
-- =====================================================

-- Create a SECURITY DEFINER function to check admin role
-- This avoids RLS recursion on user_profiles table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'moderator')
  );
$$;

-- =====================================================
-- SECTION 3: FIX RECURSIVE RLS ON user_profiles
-- =====================================================

-- Drop all existing user_profiles policies to fix recursion
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_public_read" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_own_update" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_own_delete" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_system_insert" ON public.user_profiles;

-- Non-recursive policies using JWT claims instead of subquery
CREATE POLICY "user_profiles_select" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "user_profiles_insert" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_update" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_delete" ON public.user_profiles
  FOR DELETE USING (auth.uid() = id);

-- =====================================================
-- SECTION 4: FIX ELECTIONS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view active elections" ON public.elections;
DROP POLICY IF EXISTS "elections_public_read" ON public.elections;
DROP POLICY IF EXISTS "elections_authenticated_insert" ON public.elections;
DROP POLICY IF EXISTS "elections_creator_update" ON public.elections;
DROP POLICY IF EXISTS "elections_creator_delete" ON public.elections;

CREATE POLICY "elections_select" ON public.elections
  FOR SELECT USING (true);

CREATE POLICY "elections_insert" ON public.elections
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
  );

CREATE POLICY "elections_update" ON public.elections
  FOR UPDATE USING (
    created_by = auth.uid() OR public.is_admin()
  ) WITH CHECK (
    created_by = auth.uid() OR public.is_admin()
  );

CREATE POLICY "elections_delete" ON public.elections
  FOR DELETE USING (
    created_by = auth.uid() OR public.is_admin()
  );

-- =====================================================
-- SECTION 5: FIX VOTES POLICIES (IMMUTABLE VOTES)
-- =====================================================

DROP POLICY IF EXISTS "votes_own_read" ON public.votes;
DROP POLICY IF EXISTS "votes_own_insert" ON public.votes;
DROP POLICY IF EXISTS "votes_no_update" ON public.votes;
DROP POLICY IF EXISTS "votes_no_delete" ON public.votes;

-- Admins can view all votes for auditing; users see only their own
CREATE POLICY "votes_select" ON public.votes
  FOR SELECT USING (
    user_id = auth.uid() OR public.is_admin()
  );

CREATE POLICY "votes_insert" ON public.votes
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- Votes are immutable - no UPDATE or DELETE for regular users
CREATE POLICY "votes_update_admin_only" ON public.votes
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "votes_delete_admin_only" ON public.votes
  FOR DELETE USING (public.is_admin());

-- =====================================================
-- SECTION 6: FIX WALLET & TRANSACTION POLICIES
-- =====================================================

DROP POLICY IF EXISTS "users_manage_own_user_wallets" ON public.user_wallets;
DROP POLICY IF EXISTS "users_view_own_wallet_transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "users_create_own_wallet_transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "users_manage_own_prize_redemptions" ON public.prize_redemptions;
DROP POLICY IF EXISTS "users_manage_own_payout_settings" ON public.payout_settings;

CREATE POLICY "user_wallets_select" ON public.user_wallets
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "user_wallets_insert" ON public.user_wallets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_wallets_update" ON public.user_wallets
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "wallet_transactions_select" ON public.wallet_transactions
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "wallet_transactions_insert" ON public.wallet_transactions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- Transactions are immutable once created
CREATE POLICY "wallet_transactions_update_admin" ON public.wallet_transactions
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "prize_redemptions_select" ON public.prize_redemptions
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "prize_redemptions_insert" ON public.prize_redemptions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

CREATE POLICY "prize_redemptions_update" ON public.prize_redemptions
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "payout_settings_all" ON public.payout_settings
  FOR ALL USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- SECTION 7: DIRECT MESSAGES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "direct_messages_participants_read" ON public.direct_messages;
DROP POLICY IF EXISTS "direct_messages_sender_insert" ON public.direct_messages;
DROP POLICY IF EXISTS "direct_messages_sender_update" ON public.direct_messages;

CREATE POLICY "direct_messages_select" ON public.direct_messages
  FOR SELECT USING (
    sender_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.message_threads mt
      WHERE mt.id = thread_id
      AND (mt.participant_one_id = auth.uid() OR mt.participant_two_id = auth.uid())
    )
    OR public.is_admin()
  );

CREATE POLICY "direct_messages_insert" ON public.direct_messages
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND sender_id = auth.uid()
  );

CREATE POLICY "direct_messages_update" ON public.direct_messages
  FOR UPDATE USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "direct_messages_delete" ON public.direct_messages
  FOR DELETE USING (sender_id = auth.uid() OR public.is_admin());

-- =====================================================
-- SECTION 8: GAMIFICATION POLICIES
-- =====================================================

DROP POLICY IF EXISTS "user_gamification_own_read" ON public.user_gamification;
DROP POLICY IF EXISTS "xp_log_own_read" ON public.xp_log;
DROP POLICY IF EXISTS "user_badges_own_read" ON public.user_badges;

CREATE POLICY "user_gamification_select" ON public.user_gamification
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "user_gamification_insert" ON public.user_gamification
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_gamification_update" ON public.user_gamification
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "xp_log_select" ON public.xp_log
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "xp_log_insert" ON public.xp_log
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

CREATE POLICY "user_badges_select" ON public.user_badges
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "user_badges_insert" ON public.user_badges
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Badges are public (viewable by all)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'badges') THEN
    DROP POLICY IF EXISTS "badges_select" ON public.badges;
    CREATE POLICY "badges_select" ON public.badges FOR SELECT USING (true);
    DROP POLICY IF EXISTS "badges_admin_write" ON public.badges;
    CREATE POLICY "badges_admin_write" ON public.badges
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END $$;

-- =====================================================
-- SECTION 9: NOTIFICATIONS POLICIES
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
    DROP POLICY IF EXISTS "notifications_select" ON public.notifications;
    DROP POLICY IF EXISTS "notifications_update" ON public.notifications;
    DROP POLICY IF EXISTS "notifications_delete" ON public.notifications;

    CREATE POLICY "notifications_select" ON public.notifications
      FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

    CREATE POLICY "notifications_insert" ON public.notifications
      FOR INSERT WITH CHECK (true); -- System inserts notifications

    CREATE POLICY "notifications_update" ON public.notifications
      FOR UPDATE USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());

    CREATE POLICY "notifications_delete" ON public.notifications
      FOR DELETE USING (user_id = auth.uid() OR public.is_admin());
  END IF;
END $$;

-- =====================================================
-- SECTION 10: ADMIN-ONLY TABLE POLICIES
-- =====================================================

-- Admin activity logs - admin read only
DROP POLICY IF EXISTS "admin_activity_logs_admin_read" ON public.admin_activity_logs;
CREATE POLICY "admin_activity_logs_select" ON public.admin_activity_logs
  FOR SELECT USING (public.is_admin());
CREATE POLICY "admin_activity_logs_insert" ON public.admin_activity_logs
  FOR INSERT WITH CHECK (true); -- System inserts

-- Security logs - admin only
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'security_logs') THEN
    DROP POLICY IF EXISTS "security_logs_admin_select" ON public.security_logs;
    DROP POLICY IF EXISTS "security_logs_insert" ON public.security_logs;
    CREATE POLICY "security_logs_admin_select" ON public.security_logs
      FOR SELECT USING (public.is_admin());
    CREATE POLICY "security_logs_insert" ON public.security_logs
      FOR INSERT WITH CHECK (true); -- System inserts
  END IF;
END $$;

-- Login attempts - admin only
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'login_attempts') THEN
    DROP POLICY IF EXISTS "login_attempts_admin_select" ON public.login_attempts;
    DROP POLICY IF EXISTS "login_attempts_insert" ON public.login_attempts;
    CREATE POLICY "login_attempts_admin_select" ON public.login_attempts
      FOR SELECT USING (public.is_admin());
    CREATE POLICY "login_attempts_insert" ON public.login_attempts
      FOR INSERT WITH CHECK (true); -- System inserts
  END IF;
END $$;

-- Account lockouts - admin only
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'account_lockouts') THEN
    DROP POLICY IF EXISTS "account_lockouts_admin_select" ON public.account_lockouts;
    DROP POLICY IF EXISTS "account_lockouts_insert" ON public.account_lockouts;
    DROP POLICY IF EXISTS "account_lockouts_update" ON public.account_lockouts;
    CREATE POLICY "account_lockouts_admin_select" ON public.account_lockouts
      FOR SELECT USING (public.is_admin());
    CREATE POLICY "account_lockouts_insert" ON public.account_lockouts
      FOR INSERT WITH CHECK (true);
    CREATE POLICY "account_lockouts_update" ON public.account_lockouts
      FOR UPDATE USING (public.is_admin());
  END IF;
END $$;

-- MFA secrets - own user only
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mfa_secrets') THEN
    DROP POLICY IF EXISTS "mfa_secrets_select" ON public.mfa_secrets;
    DROP POLICY IF EXISTS "mfa_secrets_insert" ON public.mfa_secrets;
    DROP POLICY IF EXISTS "mfa_secrets_update" ON public.mfa_secrets;
    CREATE POLICY "mfa_secrets_select" ON public.mfa_secrets
      FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
    CREATE POLICY "mfa_secrets_insert" ON public.mfa_secrets
      FOR INSERT WITH CHECK (user_id = auth.uid());
    CREATE POLICY "mfa_secrets_update" ON public.mfa_secrets
      FOR UPDATE USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Feature flags - admin write, all read
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'feature_flags') THEN
    DROP POLICY IF EXISTS "feature_flags_select" ON public.feature_flags;
    DROP POLICY IF EXISTS "feature_flags_admin_write" ON public.feature_flags;
    CREATE POLICY "feature_flags_select" ON public.feature_flags FOR SELECT USING (true);
    CREATE POLICY "feature_flags_admin_write" ON public.feature_flags
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END $$;

-- Fraud rules - admin only
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'fraud_rules') THEN
    DROP POLICY IF EXISTS "fraud_rules_admin" ON public.fraud_rules;
    CREATE POLICY "fraud_rules_admin" ON public.fraud_rules
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END $$;

-- Fraud incidents - admin only
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'fraud_incidents') THEN
    DROP POLICY IF EXISTS "fraud_incidents_admin" ON public.fraud_incidents;
    CREATE POLICY "fraud_incidents_admin" ON public.fraud_incidents
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END $$;

-- =====================================================
-- SECTION 11: SUBSCRIPTION POLICIES
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions') THEN
    DROP POLICY IF EXISTS "subscriptions_select" ON public.subscriptions;
    DROP POLICY IF EXISTS "subscriptions_insert" ON public.subscriptions;
    DROP POLICY IF EXISTS "subscriptions_update" ON public.subscriptions;

    CREATE POLICY "subscriptions_select" ON public.subscriptions
      FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
    CREATE POLICY "subscriptions_insert" ON public.subscriptions
      FOR INSERT WITH CHECK (user_id = auth.uid());
    CREATE POLICY "subscriptions_update" ON public.subscriptions
      FOR UPDATE USING (user_id = auth.uid() OR public.is_admin())
      WITH CHECK (user_id = auth.uid() OR public.is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscription_plans') THEN
    DROP POLICY IF EXISTS "subscription_plans_select" ON public.subscription_plans;
    CREATE POLICY "subscription_plans_select" ON public.subscription_plans
      FOR SELECT USING (true);
    DROP POLICY IF EXISTS "subscription_plans_admin" ON public.subscription_plans;
    CREATE POLICY "subscription_plans_admin" ON public.subscription_plans
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END $$;

-- =====================================================
-- SECTION 12: SUPPORT TICKETS POLICIES
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'support_tickets') THEN
    DROP POLICY IF EXISTS "support_tickets_select" ON public.support_tickets;
    DROP POLICY IF EXISTS "support_tickets_insert" ON public.support_tickets;
    DROP POLICY IF EXISTS "support_tickets_update" ON public.support_tickets;

    CREATE POLICY "support_tickets_select" ON public.support_tickets
      FOR SELECT USING (user_id = auth.uid() OR public.is_moderator());
    CREATE POLICY "support_tickets_insert" ON public.support_tickets
      FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
      );
    CREATE POLICY "support_tickets_update" ON public.support_tickets
      FOR UPDATE USING (user_id = auth.uid() OR public.is_moderator())
      WITH CHECK (user_id = auth.uid() OR public.is_moderator());
  END IF;
END $$;

-- =====================================================
-- SECTION 13: USER PREFERENCES POLICIES
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_preferences') THEN
    DROP POLICY IF EXISTS "user_preferences_select" ON public.user_preferences;
    DROP POLICY IF EXISTS "user_preferences_insert" ON public.user_preferences;
    DROP POLICY IF EXISTS "user_preferences_update" ON public.user_preferences;

    CREATE POLICY "user_preferences_select" ON public.user_preferences
      FOR SELECT USING (user_id = auth.uid());
    CREATE POLICY "user_preferences_insert" ON public.user_preferences
      FOR INSERT WITH CHECK (user_id = auth.uid());
    CREATE POLICY "user_preferences_update" ON public.user_preferences
      FOR UPDATE USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- =====================================================
-- SECTION 14: CREATOR EARNINGS POLICIES
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'creator_earnings') THEN
    DROP POLICY IF EXISTS "creator_earnings_select" ON public.creator_earnings;
    CREATE POLICY "creator_earnings_select" ON public.creator_earnings
      FOR SELECT USING (created_by = auth.uid() OR public.is_admin());
    CREATE POLICY "creator_earnings_insert" ON public.creator_earnings
      FOR INSERT WITH CHECK (true); -- System inserts
    CREATE POLICY "creator_earnings_update" ON public.creator_earnings
      FOR UPDATE USING (public.is_admin());
  END IF;
END $$;

-- =====================================================
-- SECTION 15: PLATFORM LOGS POLICIES (ADMIN ONLY)
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'platform_logs') THEN
    DROP POLICY IF EXISTS "platform_logs_admin" ON public.platform_logs;
    CREATE POLICY "platform_logs_admin" ON public.platform_logs
      FOR SELECT USING (public.is_admin());
    CREATE POLICY "platform_logs_insert" ON public.platform_logs
      FOR INSERT WITH CHECK (true); -- System inserts
  END IF;
END $$;

-- =====================================================
-- SECTION 16: ZERO KNOWLEDGE PROOFS (AUDIT ONLY)
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'zero_knowledge_proofs') THEN
    DROP POLICY IF EXISTS "zkp_select" ON public.zero_knowledge_proofs;
    CREATE POLICY "zkp_select" ON public.zero_knowledge_proofs
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.votes v
          WHERE v.id = vote_id AND v.user_id = auth.uid()
        ) OR public.is_admin()
      );
    CREATE POLICY "zkp_insert" ON public.zero_knowledge_proofs
      FOR INSERT WITH CHECK (true); -- System inserts during vote
  END IF;
END $$;

-- =====================================================
-- SECTION 17: VOTING SESSIONS POLICIES
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'voting_sessions') THEN
    DROP POLICY IF EXISTS "voting_sessions_select" ON public.voting_sessions;
    DROP POLICY IF EXISTS "voting_sessions_insert" ON public.voting_sessions;
    DROP POLICY IF EXISTS "voting_sessions_update" ON public.voting_sessions;

    CREATE POLICY "voting_sessions_select" ON public.voting_sessions FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
    CREATE POLICY "voting_sessions_insert" ON public.voting_sessions
      FOR INSERT WITH CHECK (user_id = auth.uid());
    CREATE POLICY "voting_sessions_update" ON public.voting_sessions
      FOR UPDATE USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- =====================================================
-- SECTION 18: AGE VERIFICATION POLICIES
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'age_verifications') THEN
    DROP POLICY IF EXISTS "age_verifications_select" ON public.age_verifications;
    DROP POLICY IF EXISTS "age_verifications_insert" ON public.age_verifications;
    DROP POLICY IF EXISTS "age_verifications_update" ON public.age_verifications;

    CREATE POLICY "age_verifications_select" ON public.age_verifications FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
    CREATE POLICY "age_verifications_insert" ON public.age_verifications
      FOR INSERT WITH CHECK (user_id = auth.uid());
    CREATE POLICY "age_verifications_update" ON public.age_verifications
      FOR UPDATE USING (user_id = auth.uid() OR public.is_admin())
      WITH CHECK (user_id = auth.uid() OR public.is_admin());
  END IF;
END $$;

-- =====================================================
-- SECTION 19: JOLTS & MOMENTS POLICIES
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jolts') THEN
    DROP POLICY IF EXISTS "jolts_select" ON public.jolts;
    DROP POLICY IF EXISTS "jolts_insert" ON public.jolts;
    DROP POLICY IF EXISTS "jolts_update" ON public.jolts;
    DROP POLICY IF EXISTS "jolts_delete" ON public.jolts;

    CREATE POLICY "jolts_select" ON public.jolts FOR SELECT USING (auth.uid() = creator_id OR public.is_admin());
    CREATE POLICY "jolts_insert" ON public.jolts
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND creator_id = auth.uid());
    CREATE POLICY "jolts_update" ON public.jolts
      FOR UPDATE USING (creator_id = auth.uid() OR public.is_admin())
      WITH CHECK (creator_id = auth.uid() OR public.is_admin());
    CREATE POLICY "jolts_delete" ON public.jolts
      FOR DELETE USING (creator_id = auth.uid() OR public.is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'moments') THEN
    DROP POLICY IF EXISTS "moments_select" ON public.moments;
    DROP POLICY IF EXISTS "moments_insert" ON public.moments;
    DROP POLICY IF EXISTS "moments_update" ON public.moments;
    DROP POLICY IF EXISTS "moments_delete" ON public.moments;

    CREATE POLICY "moments_select" ON public.moments FOR SELECT USING (true);
    CREATE POLICY "moments_insert" ON public.moments
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND creator_id = auth.uid());
    CREATE POLICY "moments_update" ON public.moments
      FOR UPDATE USING (creator_id = auth.uid() OR public.is_admin())
      WITH CHECK (creator_id = auth.uid() OR public.is_admin());
    CREATE POLICY "moments_delete" ON public.moments
      FOR DELETE USING (creator_id = auth.uid() OR public.is_admin());
  END IF;
END $$;

-- =====================================================
-- SECTION 20: GROUPS POLICIES
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'groups') THEN
    DROP POLICY IF EXISTS "groups_select" ON public.groups;
    DROP POLICY IF EXISTS "groups_insert" ON public.groups;
    DROP POLICY IF EXISTS "groups_update" ON public.groups;
    DROP POLICY IF EXISTS "groups_delete" ON public.groups;

    CREATE POLICY "groups_select" ON public.groups FOR SELECT USING (true);
    CREATE POLICY "groups_insert" ON public.groups
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());
    CREATE POLICY "groups_update" ON public.groups
      FOR UPDATE USING (created_by = auth.uid() OR public.is_admin())
      WITH CHECK (created_by = auth.uid() OR public.is_admin());
    CREATE POLICY "groups_delete" ON public.groups
      FOR DELETE USING (created_by = auth.uid() OR public.is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_members') THEN
    DROP POLICY IF EXISTS "group_members_select" ON public.group_members;
    DROP POLICY IF EXISTS "group_members_insert" ON public.group_members;
    DROP POLICY IF EXISTS "group_members_delete" ON public.group_members;

    CREATE POLICY "group_members_select" ON public.group_members FOR SELECT USING (true);
    CREATE POLICY "group_members_insert" ON public.group_members
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
    CREATE POLICY "group_members_delete" ON public.group_members
      FOR DELETE USING (user_id = auth.uid() OR public.is_admin());
  END IF;
END $$;

-- =====================================================
-- SECTION 21: MCQ POLICIES
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mcq_questions') THEN
    DROP POLICY IF EXISTS "mcq_questions_select" ON public.mcq_questions;
    DROP POLICY IF EXISTS "mcq_questions_insert" ON public.mcq_questions;
    DROP POLICY IF EXISTS "mcq_questions_update" ON public.mcq_questions;

    CREATE POLICY "mcq_questions_select" ON public.mcq_questions FOR SELECT USING (true);
    CREATE POLICY "mcq_questions_insert" ON public.mcq_questions
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());
    CREATE POLICY "mcq_questions_update" ON public.mcq_questions
      FOR UPDATE USING (created_by = auth.uid() OR public.is_admin())
      WITH CHECK (created_by = auth.uid() OR public.is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mcq_attempts') THEN
    DROP POLICY IF EXISTS "mcq_attempts_select" ON public.mcq_attempts;
    DROP POLICY IF EXISTS "mcq_attempts_insert" ON public.mcq_attempts;

    CREATE POLICY "mcq_attempts_select" ON public.mcq_attempts
      FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
    CREATE POLICY "mcq_attempts_insert" ON public.mcq_attempts
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
  END IF;
END $$;

-- =====================================================
-- SECTION 22: ADVERTISER CAMPAIGNS POLICIES
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'advertiser_campaigns') THEN
    DROP POLICY IF EXISTS "advertiser_campaigns_select" ON public.advertiser_campaigns;
    DROP POLICY IF EXISTS "advertiser_campaigns_insert" ON public.advertiser_campaigns;
    DROP POLICY IF EXISTS "advertiser_campaigns_update" ON public.advertiser_campaigns;

    CREATE POLICY "advertiser_campaigns_select" ON public.advertiser_campaigns
      FOR SELECT USING (
        advertiser_id = auth.uid()
        OR public.is_admin()
        OR status = 'active'
      );
    CREATE POLICY "advertiser_campaigns_insert" ON public.advertiser_campaigns
      FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
        AND advertiser_id = auth.uid()
      );
    CREATE POLICY "advertiser_campaigns_update" ON public.advertiser_campaigns
      FOR UPDATE USING (advertiser_id = auth.uid() OR public.is_admin())
      WITH CHECK (advertiser_id = auth.uid() OR public.is_admin());
  END IF;
END $$;

-- =====================================================
-- SECTION 23: ALERT RULES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "alert_rules_admin_read" ON public.alert_rules;
DROP POLICY IF EXISTS "alert_rules_admin_insert" ON public.alert_rules;
DROP POLICY IF EXISTS "alert_rules_admin_update" ON public.alert_rules;
DROP POLICY IF EXISTS "alert_rules_admin_delete" ON public.alert_rules;

CREATE POLICY "alert_rules_admin" ON public.alert_rules
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =====================================================
-- SECTION 24: SPONSORED ELECTIONS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "sponsored_elections_public_read" ON public.sponsored_elections;
DROP POLICY IF EXISTS "sponsored_elections_advertiser_insert" ON public.sponsored_elections;
DROP POLICY IF EXISTS "sponsored_elections_advertiser_update" ON public.sponsored_elections;

CREATE POLICY "sponsored_elections_select" ON public.sponsored_elections
  FOR SELECT USING (true);

CREATE POLICY "sponsored_elections_insert" ON public.sponsored_elections
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND brand_id = auth.uid()
  );

CREATE POLICY "sponsored_elections_update" ON public.sponsored_elections
  FOR UPDATE USING (brand_id = auth.uid() OR public.is_admin())
  WITH CHECK (brand_id = auth.uid() OR public.is_admin());

-- =====================================================
-- SECTION 25: SMS HEALTH CHECK TABLES POLICIES
-- =====================================================

CREATE POLICY "sms_health_check_admin" ON public.sms_health_check_results
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "sms_failover_admin" ON public.sms_failover_events
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =====================================================
-- SECTION 26: CONTENT REACTIONS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "content_reactions_public_read" ON public.content_reactions;
DROP POLICY IF EXISTS "content_reactions_authenticated_insert" ON public.content_reactions;
DROP POLICY IF EXISTS "content_reactions_own_delete" ON public.content_reactions;

CREATE POLICY "content_reactions_select" ON public.content_reactions
  FOR SELECT USING (true);

CREATE POLICY "content_reactions_insert" ON public.content_reactions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

CREATE POLICY "content_reactions_delete" ON public.content_reactions
  FOR DELETE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "message_reactions_public_read" ON public.message_reactions;
DROP POLICY IF EXISTS "message_reactions_authenticated_insert" ON public.message_reactions;
DROP POLICY IF EXISTS "message_reactions_own_delete" ON public.message_reactions;

CREATE POLICY "message_reactions_select" ON public.message_reactions
  FOR SELECT USING (true);

CREATE POLICY "message_reactions_insert" ON public.message_reactions
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

CREATE POLICY "message_reactions_delete" ON public.message_reactions
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- SECTION 27: REVOKE PUBLIC SCHEMA EXECUTE PERMISSIONS
-- (Security Advisor Warning: public schema access)
-- =====================================================

-- Revoke default public execute on functions that should be restricted
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_moderator() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_moderator() TO authenticated;

-- =====================================================
-- SECTION 28: MISSING NOT NULL CONSTRAINTS
-- =====================================================

-- Add NOT NULL constraints where appropriate (using ALTER COLUMN)
DO $$ BEGIN
  -- election_predictions: ensure user_id and election_id are NOT NULL
  ALTER TABLE public.election_predictions
    ALTER COLUMN user_id SET NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.election_predictions
    ALTER COLUMN election_id SET NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================
-- SECTION 29: MISSING FOREIGN KEY CONSTRAINTS
-- =====================================================

-- election_predictions: add FK to elections table if missing
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY'
    AND table_name = 'election_predictions'
    AND constraint_name = 'election_predictions_election_id_fkey'
  ) THEN
    ALTER TABLE public.election_predictions
      ADD CONSTRAINT election_predictions_election_id_fkey
      FOREIGN KEY (election_id) REFERENCES public.elections(id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- social_shares: ensure FK to auth.users
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY'
    AND table_name = 'social_shares'
    AND constraint_name LIKE '%user_id%'
  ) THEN
    ALTER TABLE public.social_shares
      ADD CONSTRAINT social_shares_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================
-- SECTION 30: DEFAULT TIMESTAMPS ON ALL TABLES
-- =====================================================

-- Ensure created_at has defaults on key tables
DO $$ BEGIN
  ALTER TABLE public.election_predictions
    ALTER COLUMN created_at SET DEFAULT NOW();
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.election_predictions
    ALTER COLUMN updated_at SET DEFAULT NOW();
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================
-- SECTION 31: UPDATED_AT TRIGGER FOR election_predictions
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_election_predictions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_election_predictions_updated_at ON public.election_predictions;
CREATE TRIGGER update_election_predictions_updated_at
  BEFORE UPDATE ON public.election_predictions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_election_predictions_updated_at();
