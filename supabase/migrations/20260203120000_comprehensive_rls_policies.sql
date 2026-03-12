-- COMPREHENSIVE ROW LEVEL SECURITY (RLS) POLICIES
-- Migration to secure all database tables with proper access controls
-- Prevents unauthorized data access and manipulation

-- NOTE: Enum values are added in migration 20260203115900_add_enum_values.sql
-- which MUST run before this migration

-- ============================================================================
-- ENABLE RLS ON ALL CRITICAL TABLES
-- ============================================================================

ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.election_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.content_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.prize_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sponsored_elections ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- DROP EXISTING POLICIES (IDEMPOTENT)
-- ============================================================================

-- User Profiles
DROP POLICY IF EXISTS "user_profiles_public_read" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_own_update" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_own_delete" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_system_insert" ON public.user_profiles;

-- Elections
DROP POLICY IF EXISTS "elections_public_read" ON public.elections;
DROP POLICY IF EXISTS "elections_authenticated_insert" ON public.elections;
DROP POLICY IF EXISTS "elections_creator_update" ON public.elections;
DROP POLICY IF EXISTS "elections_creator_delete" ON public.elections;

-- Votes
DROP POLICY IF EXISTS "votes_own_read" ON public.votes;
DROP POLICY IF EXISTS "votes_own_insert" ON public.votes;
DROP POLICY IF EXISTS "votes_no_update" ON public.votes;
DROP POLICY IF EXISTS "votes_no_delete" ON public.votes;

-- Election Options
DROP POLICY IF EXISTS "election_options_public_read" ON public.election_options;
DROP POLICY IF EXISTS "election_options_creator_insert" ON public.election_options;
DROP POLICY IF EXISTS "election_options_creator_update" ON public.election_options;

-- Comments
DROP POLICY IF EXISTS "comments_public_read" ON public.comments;
DROP POLICY IF EXISTS "comments_authenticated_insert" ON public.comments;
DROP POLICY IF EXISTS "comments_own_update" ON public.comments;
DROP POLICY IF EXISTS "comments_own_delete" ON public.comments;

-- Message Reactions
DROP POLICY IF EXISTS "message_reactions_public_read" ON public.message_reactions;
DROP POLICY IF EXISTS "message_reactions_authenticated_insert" ON public.message_reactions;
DROP POLICY IF EXISTS "message_reactions_own_delete" ON public.message_reactions;

-- Content Reactions
DROP POLICY IF EXISTS "content_reactions_public_read" ON public.content_reactions;
DROP POLICY IF EXISTS "content_reactions_authenticated_insert" ON public.content_reactions;
DROP POLICY IF EXISTS "content_reactions_own_delete" ON public.content_reactions;

-- Gamification
DROP POLICY IF EXISTS "user_gamification_own_read" ON public.user_gamification;
DROP POLICY IF EXISTS "xp_log_own_read" ON public.xp_log;
DROP POLICY IF EXISTS "user_badges_own_read" ON public.user_badges;

-- Wallet & Payments
DROP POLICY IF EXISTS "wallet_transactions_own_read" ON public.wallet_transactions;
DROP POLICY IF EXISTS "prize_redemptions_own_read" ON public.prize_redemptions;

-- Messaging
DROP POLICY IF EXISTS "direct_messages_participants_read" ON public.direct_messages;
DROP POLICY IF EXISTS "direct_messages_sender_insert" ON public.direct_messages;
DROP POLICY IF EXISTS "direct_messages_sender_update" ON public.direct_messages;

-- Posts
DROP POLICY IF EXISTS "posts_public_read" ON public.posts;
DROP POLICY IF EXISTS "posts_authenticated_insert" ON public.posts;
DROP POLICY IF EXISTS "posts_own_update" ON public.posts;
DROP POLICY IF EXISTS "posts_own_delete" ON public.posts;

-- Alert Rules
DROP POLICY IF EXISTS "alert_rules_admin_read" ON public.alert_rules;
DROP POLICY IF EXISTS "alert_rules_admin_insert" ON public.alert_rules;
DROP POLICY IF EXISTS "alert_rules_admin_update" ON public.alert_rules;
DROP POLICY IF EXISTS "alert_rules_admin_delete" ON public.alert_rules;

-- Admin Activity Logs
DROP POLICY IF EXISTS "admin_activity_logs_admin_read" ON public.admin_activity_logs;

-- Sponsored Elections
DROP POLICY IF EXISTS "sponsored_elections_public_read" ON public.sponsored_elections;
DROP POLICY IF EXISTS "sponsored_elections_advertiser_insert" ON public.sponsored_elections;
DROP POLICY IF EXISTS "sponsored_elections_advertiser_update" ON public.sponsored_elections;

-- ============================================================================
-- USER PROFILES POLICIES
-- ============================================================================

-- Anyone can view public user profiles
CREATE POLICY "user_profiles_public_read" ON public.user_profiles
  FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "user_profiles_own_update" ON public.user_profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Users can delete their own profile
CREATE POLICY "user_profiles_own_delete" ON public.user_profiles
  FOR DELETE
  USING (id = auth.uid());

-- System can insert profiles (via trigger)
CREATE POLICY "user_profiles_system_insert" ON public.user_profiles
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- ELECTIONS POLICIES
-- ============================================================================

-- Anyone can view active, completed, and upcoming elections
CREATE POLICY "elections_public_read" ON public.elections
  FOR SELECT
  USING (status IN ('active', 'completed', 'upcoming'));

-- Authenticated users can create elections
CREATE POLICY "elections_authenticated_insert" ON public.elections
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

-- Creators can update their own elections
CREATE POLICY "elections_creator_update" ON public.elections
  FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Creators can delete their own draft/pending elections
CREATE POLICY "elections_creator_delete" ON public.elections
  FOR DELETE
  USING (created_by = auth.uid() AND status IN ('draft', 'pending'));

-- ============================================================================
-- VOTES POLICIES (CRITICAL SECURITY)
-- ============================================================================

-- Users can only view their own votes
CREATE POLICY "votes_own_read" ON public.votes
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can only insert their own votes
CREATE POLICY "votes_own_insert" ON public.votes
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    user_id = auth.uid()
  );

-- NO UPDATE OR DELETE ALLOWED (votes are immutable)
CREATE POLICY "votes_no_update" ON public.votes
  FOR UPDATE
  USING (false);

CREATE POLICY "votes_no_delete" ON public.votes
  FOR DELETE
  USING (false);

-- ============================================================================
-- ELECTION OPTIONS POLICIES
-- ============================================================================

-- Anyone can view options for active elections
CREATE POLICY "election_options_public_read" ON public.election_options
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.elections
      WHERE elections.id = election_options.election_id
      AND elections.status IN ('active', 'completed', 'upcoming')
    )
  );

-- Election creators can insert options
CREATE POLICY "election_options_creator_insert" ON public.election_options
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.elections
      WHERE elections.id = election_options.election_id
      AND elections.created_by = auth.uid()
    )
  );

-- Election creators can update options
CREATE POLICY "election_options_creator_update" ON public.election_options
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.elections
      WHERE elections.id = election_options.election_id
      AND elections.created_by = auth.uid()
    )
  );

-- ============================================================================
-- COMMENTS POLICIES
-- ============================================================================

-- Anyone can view comments on public elections
CREATE POLICY "comments_public_read" ON public.comments
  FOR SELECT
  USING (true);

-- Authenticated users can create comments
CREATE POLICY "comments_authenticated_insert" ON public.comments
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can update their own comments
CREATE POLICY "comments_own_update" ON public.comments
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own comments
CREATE POLICY "comments_own_delete" ON public.comments
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- MESSAGE REACTIONS POLICIES
-- ============================================================================

-- Anyone can view message reactions
CREATE POLICY "message_reactions_public_read" ON public.message_reactions
  FOR SELECT
  USING (true);

-- Authenticated users can create message reactions
CREATE POLICY "message_reactions_authenticated_insert" ON public.message_reactions
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can delete their own message reactions
CREATE POLICY "message_reactions_own_delete" ON public.message_reactions
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- CONTENT REACTIONS POLICIES
-- ============================================================================

-- Anyone can view content reactions
CREATE POLICY "content_reactions_public_read" ON public.content_reactions
  FOR SELECT
  USING (true);

-- Authenticated users can create content reactions
CREATE POLICY "content_reactions_authenticated_insert" ON public.content_reactions
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can delete their own content reactions
CREATE POLICY "content_reactions_own_delete" ON public.content_reactions
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- GAMIFICATION POLICIES
-- ============================================================================

-- Users can view their own gamification data
CREATE POLICY "user_gamification_own_read" ON public.user_gamification
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can view their own XP log
CREATE POLICY "xp_log_own_read" ON public.xp_log
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can view their own badges
CREATE POLICY "user_badges_own_read" ON public.user_badges
  FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- WALLET & PAYMENT POLICIES
-- ============================================================================

-- Users can view their own wallet transactions
CREATE POLICY "wallet_transactions_own_read" ON public.wallet_transactions
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can view their own prize redemptions
CREATE POLICY "prize_redemptions_own_read" ON public.prize_redemptions
  FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- DIRECT MESSAGES POLICIES
-- ============================================================================

-- Users can view messages where they are sender or recipient
CREATE POLICY "direct_messages_participants_read" ON public.direct_messages
  FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Users can send messages
CREATE POLICY "direct_messages_sender_insert" ON public.direct_messages
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND sender_id = auth.uid());

-- Users can update their own messages
CREATE POLICY "direct_messages_sender_update" ON public.direct_messages
  FOR UPDATE
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- ============================================================================
-- POSTS POLICIES
-- ============================================================================

-- Anyone can view public posts
CREATE POLICY "posts_public_read" ON public.posts
  FOR SELECT
  USING (true);

-- Authenticated users can create posts
CREATE POLICY "posts_authenticated_insert" ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can update their own posts
CREATE POLICY "posts_own_update" ON public.posts
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own posts
CREATE POLICY "posts_own_delete" ON public.posts
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- ALERT RULES POLICIES
-- ============================================================================

-- Admin users can view alert rules
CREATE POLICY "alert_rules_admin_read" ON public.alert_rules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admin users can create alert rules
CREATE POLICY "alert_rules_admin_insert" ON public.alert_rules
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admin users can update alert rules
CREATE POLICY "alert_rules_admin_update" ON public.alert_rules
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admin users can delete alert rules
CREATE POLICY "alert_rules_admin_delete" ON public.alert_rules
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- ============================================================================
-- ADMIN ACTIVITY LOGS POLICIES (ADMIN ONLY)
-- ============================================================================

-- Admin users can view admin activity logs
CREATE POLICY "admin_activity_logs_admin_read" ON public.admin_activity_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- ============================================================================
-- SPONSORED ELECTIONS POLICIES
-- ============================================================================

-- Anyone can view active sponsored elections
CREATE POLICY "sponsored_elections_public_read" ON public.sponsored_elections
  FOR SELECT
  USING (true);

-- Advertisers can create sponsored elections
CREATE POLICY "sponsored_elections_advertiser_insert" ON public.sponsored_elections
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Advertisers can update their own sponsored elections
CREATE POLICY "sponsored_elections_advertiser_update" ON public.sponsored_elections
  FOR UPDATE
  USING (advertiser_id = auth.uid())
  WITH CHECK (advertiser_id = auth.uid());

-- ============================================================================
-- SECURITY VALIDATION
-- ============================================================================

-- Verify RLS is enabled on critical tables
DO $$
DECLARE
  critical_tables TEXT[] := ARRAY[
    'user_profiles',
    'elections',
    'votes',
    'election_options',
    'comments',
    'message_reactions',
    'content_reactions',
    'user_gamification',
    'xp_log',
    'user_badges',
    'wallet_transactions',
    'prize_redemptions',
    'direct_messages',
    'posts',
    'alert_rules',
    'admin_activity_logs',
    'sponsored_elections'
  ];
  table_name TEXT;
  rls_enabled BOOLEAN;
BEGIN
  FOREACH table_name IN ARRAY critical_tables
  LOOP
    SELECT relrowsecurity INTO rls_enabled
    FROM pg_class
    WHERE relname = table_name AND relnamespace = 'public'::regnamespace;
    
    IF NOT rls_enabled THEN
      RAISE WARNING 'RLS not enabled on table: %', table_name;
    END IF;
  END LOOP;
END $$;