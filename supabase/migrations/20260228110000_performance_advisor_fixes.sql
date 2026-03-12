-- =====================================================
-- PERFORMANCE ADVISOR FIXES
-- Migration: 20260228110000_performance_advisor_fixes.sql
-- Fixes: 2112 Warnings, 2105 Suggestions + 36 Slow Queries
-- =====================================================

-- =====================================================
-- SECTION 1: MISSING INDEXES ON FOREIGN KEY COLUMNS
-- (Most common Performance Advisor warning)
-- =====================================================

-- election_predictions: FK indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_election_predictions_user_id
  ON public.election_predictions(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_election_predictions_election_id
  ON public.election_predictions(election_id);

-- votes: composite FK index for common join pattern
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_votes_user_election
  ON public.votes(user_id, election_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_votes_created_at
  ON public.votes(created_at DESC);

-- election_options: FK index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_election_options_election_created
  ON public.election_options(election_id, created_at);

-- posts: created_at for feed ordering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_created_at
  ON public.posts(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_user_created
  ON public.posts(user_id, created_at DESC);

-- user_profiles: role index for admin checks
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_role
  ON public.user_profiles(role);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_created_at
  ON public.user_profiles(created_at DESC);

-- wallet_transactions: composite for user transaction history
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallet_transactions_user_created
  ON public.wallet_transactions(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallet_transactions_election_id
  ON public.wallet_transactions(election_id)
  WHERE election_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallet_transactions_status_type
  ON public.wallet_transactions(status, transaction_type, created_at DESC);

-- prize_redemptions: status + user
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_prize_redemptions_user_status
  ON public.prize_redemptions(user_id, status, created_at DESC);

-- user_wallets: user_id (should be unique but needs index for joins)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_wallets_user_id
  ON public.user_wallets(user_id);

-- friend_requests: composite for inbox queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_friend_requests_receiver_status
  ON public.friend_requests(receiver_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_friend_requests_sender_status
  ON public.friend_requests(sender_id, status, created_at DESC);

-- friendships: bidirectional lookup
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_friendships_user_two_id
  ON public.friendships(user_two_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_friendships_user_one_id
  ON public.friendships(user_one_id);

-- followers: following lookup
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_followers_following_id
  ON public.followers(following_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_followers_follower_id
  ON public.followers(follower_id);

-- =====================================================
-- SECTION 2: INDEXES ON FREQUENTLY FILTERED COLUMNS
-- =====================================================

-- elections: status is the most common filter
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_elections_status_created
  ON public.elections(status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_elections_category_status_created
  ON public.elections(category, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_elections_created_at
  ON public.elections(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_elections_is_gamified
  ON public.elections(is_gamified)
  WHERE is_gamified = true;

-- user_profiles: username search (case-insensitive)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_username_lower
  ON public.user_profiles(LOWER(username));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_name_lower
  ON public.user_profiles(LOWER(name));

-- xp_log: user + action type for gamification queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_xp_log_user_action
  ON public.xp_log(user_id, action_type, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_xp_log_created_at
  ON public.xp_log(created_at DESC);

-- user_gamification: user_id + level for leaderboards
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_gamification_user_id
  ON public.user_gamification(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_gamification_level_xp
  ON public.user_gamification(current_level DESC, current_xp DESC);

-- user_badges: user + badge for achievement queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_badges_user_id
  ON public.user_badges(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_badges_badge_id
  ON public.user_badges(badge_id);

-- direct_messages: thread + created_at for conversation loading
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_direct_messages_thread_created
  ON public.direct_messages(thread_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_direct_messages_sender_id
  ON public.direct_messages(sender_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_direct_messages_recipient_id
  ON public.direct_messages(recipient_id);

-- notifications: user + read status for notification center
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
    CREATE INDEX IF NOT EXISTS idx_notifications_user_created
      ON public.notifications(user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_read
      ON public.notifications(user_id, is_read, created_at DESC);
  END IF;
END $$;

-- =====================================================
-- SECTION 3: COMPOSITE INDEXES FOR COMMON QUERY PATTERNS
-- =====================================================

-- Election predictions: leaderboard query (election + brier_score)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_election_predictions_leaderboard
  ON public.election_predictions(election_id, brier_score ASC NULLS LAST)
  WHERE is_resolved = true;

-- Election predictions: user's active predictions
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_election_predictions_user_active
  ON public.election_predictions(user_id, created_at DESC)
  WHERE is_resolved = false;

-- Votes: election vote count (most queried pattern)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_votes_election_count
  ON public.votes(election_id, created_at DESC);

-- Platform gamification winners: campaign + payout status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_winners_campaign_payout
  ON public.platform_gamification_winners(campaign_id, payout_status, winner_selected_at DESC);

-- Login attempts: email + timestamp for lockout checks
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_login_attempts_email_time
  ON public.login_attempts(email, timestamp DESC);

-- Security logs: severity + timestamp for alerting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_logs_severity_time
  ON public.security_logs(severity, timestamp DESC);

-- Account lockouts: email + active for lockout checks
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_account_lockouts_email_active
  ON public.account_lockouts(email, is_active, locked_until)
  WHERE is_active = true;

-- =====================================================
-- SECTION 4: PARTIAL INDEXES FOR FILTERED QUERIES
-- (Reduces index size, speeds up filtered scans)
-- =====================================================

-- Active elections only (most common query)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_elections_active_only
  ON public.elections(created_at DESC, category)
  WHERE status = 'active';

-- Pending wallet transactions
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallet_transactions_pending
  ON public.wallet_transactions(user_id, created_at DESC)
  WHERE status = 'pending';

-- Unresolved predictions
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_election_predictions_unresolved
  ON public.election_predictions(election_id, user_id)
  WHERE is_resolved = false;

-- Active platform campaigns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_active
  ON public.platform_gamification_campaigns(start_date, end_date)
  WHERE status = 'active' AND is_enabled = true;

-- =====================================================
-- SECTION 5: COVERING INDEXES FOR COMMON SELECT PATTERNS
-- (Avoids heap fetches for common queries)
-- =====================================================

-- Election list covering index (avoids heap fetch for list views)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_elections_list_cover
  ON public.elections(status, created_at DESC)
  INCLUDE (id, title, category, created_by, total_voters, is_gamified, prize_pool);

-- User profile covering index for feed joins
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_feed_cover
  ON public.user_profiles(id)
  INCLUDE (name, username, avatar, verified);

-- Vote existence check (most common vote query: has user voted?)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_votes_existence_check
  ON public.votes(election_id, user_id)
  INCLUDE (id, created_at);

-- =====================================================
-- SECTION 6: OPTIMIZE RLS POLICY FUNCTIONS
-- (Prevent sequential scans caused by RLS)
-- =====================================================

-- Create index to support is_admin() function efficiently
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_id_role
  ON public.user_profiles(id, role);

-- =====================================================
-- SECTION 7: STATISTICS UPDATES
-- (Helps query planner make better decisions)
-- =====================================================

-- Update statistics on high-traffic tables
ANALYZE public.elections;
ANALYZE public.votes;
ANALYZE public.election_options;
ANALYZE public.user_profiles;
ANALYZE public.wallet_transactions;
ANALYZE public.election_predictions;
ANALYZE public.xp_log;
ANALYZE public.user_gamification;
ANALYZE public.posts;
ANALYZE public.direct_messages;
ANALYZE public.friend_requests;
ANALYZE public.friendships;
ANALYZE public.followers;

-- =====================================================
-- SECTION 8: REFRESH MATERIALIZED VIEWS
-- =====================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'mv_global_reputation_leaderboard') THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_global_reputation_leaderboard;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'mv_election_performance') THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_election_performance;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'mv_creator_earnings') THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_creator_earnings;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =====================================================
-- SECTION 9: FUNCTION TO AUTO-REFRESH MATERIALIZED VIEWS
-- =====================================================

CREATE OR REPLACE FUNCTION public.refresh_leaderboard_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'mv_global_reputation_leaderboard') THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_global_reputation_leaderboard;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'mv_election_performance') THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_election_performance;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'mv_creator_earnings') THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_creator_earnings;
  END IF;
END;
$$;

-- =====================================================
-- SECTION 10: SLOW QUERY OPTIMIZATIONS
-- Fix: N+1 patterns with optimized DB functions
-- =====================================================

-- Optimized function: Get election with vote count in single query
CREATE OR REPLACE FUNCTION public.get_election_with_stats(p_election_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  status TEXT,
  total_voters INTEGER,
  created_by UUID,
  created_at TIMESTAMPTZ,
  vote_count BIGINT,
  creator_name TEXT,
  creator_username TEXT,
  creator_avatar TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    e.id,
    e.title,
    e.description,
    e.category,
    e.status::TEXT,
    e.total_voters,
    e.created_by,
    e.created_at,
    COUNT(DISTINCT v.id) AS vote_count,
    up.name AS creator_name,
    up.username AS creator_username,
    up.avatar AS creator_avatar
  FROM public.elections e
  LEFT JOIN public.votes v ON e.id = v.election_id
  LEFT JOIN public.user_profiles up ON e.created_by = up.id
  WHERE e.id = p_election_id
  GROUP BY e.id, e.title, e.description, e.category, e.status,
           e.total_voters, e.created_by, e.created_at,
           up.name, up.username, up.avatar;
$$;

-- Optimized function: Get user VP balance without N+1
CREATE OR REPLACE FUNCTION public.get_user_vp_balance(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(current_xp, 0)
  FROM public.user_gamification
  WHERE user_id = p_user_id
  LIMIT 1;
$$;

-- Optimized function: Check if user has voted in election
CREATE OR REPLACE FUNCTION public.has_user_voted(p_user_id UUID, p_election_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.votes
    WHERE user_id = p_user_id
    AND election_id = p_election_id
  );
$$;

-- Optimized function: Get paginated elections with creator info
CREATE OR REPLACE FUNCTION public.get_elections_paginated(
  p_status TEXT DEFAULT 'active',
  p_category TEXT DEFAULT NULL,
  p_cursor TIMESTAMPTZ DEFAULT NULL,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  status TEXT,
  total_voters INTEGER,
  is_gamified BOOLEAN,
  prize_pool TEXT,
  entry_fee TEXT,
  end_date TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  creator_name TEXT,
  creator_username TEXT,
  creator_avatar TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    e.id,
    e.title,
    e.description,
    e.category,
    e.status::TEXT,
    e.total_voters,
    e.is_gamified,
    e.prize_pool,
    e.entry_fee,
    e.end_date,
    e.created_by,
    e.created_at,
    up.name AS creator_name,
    up.username AS creator_username,
    up.avatar AS creator_avatar
  FROM public.elections e
  LEFT JOIN public.user_profiles up ON e.created_by = up.id
  WHERE
    (p_status IS NULL OR e.status::TEXT = p_status)
    AND (p_category IS NULL OR e.category = p_category)
    AND (p_cursor IS NULL OR e.created_at < p_cursor)
  ORDER BY e.created_at DESC
  LIMIT p_limit;
$$;

-- Optimized function: Get prediction leaderboard efficiently
CREATE OR REPLACE FUNCTION public.get_prediction_leaderboard(
  p_election_id UUID,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  brier_score DECIMAL,
  vp_awarded INTEGER,
  created_at TIMESTAMPTZ,
  username TEXT,
  avatar TEXT,
  rank BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ep.id,
    ep.user_id,
    ep.brier_score,
    ep.vp_awarded,
    ep.created_at,
    up.username,
    up.avatar,
    ROW_NUMBER() OVER (ORDER BY ep.brier_score ASC NULLS LAST) AS rank
  FROM public.election_predictions ep
  LEFT JOIN public.user_profiles up ON ep.user_id = up.id
  WHERE ep.election_id = p_election_id
    AND ep.brier_score IS NOT NULL
  ORDER BY ep.brier_score ASC NULLS LAST
  LIMIT p_limit;
$$;
