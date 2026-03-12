-- =====================================================
-- COMPREHENSIVE PERFORMANCE OPTIMIZATION MIGRATION
-- Date: 2026-02-04
-- Purpose: Implement all database optimizations from testing report
-- =====================================================

-- =====================================================
-- SECTION 1: COMPOSITE INDEXES FOR COMPLEX QUERIES
-- =====================================================

-- Elections: Optimize filtering by user, status, and date
CREATE INDEX IF NOT EXISTS idx_elections_user_status_date 
  ON public.elections(created_by, status, created_at DESC);

-- Elections: Optimize category filtering
CREATE INDEX IF NOT EXISTS idx_elections_category_status 
  ON public.elections(category, created_at DESC) 
  WHERE status = 'active';

-- VP Transactions: Optimize user transaction history
CREATE INDEX IF NOT EXISTS idx_vp_transactions_user_date 
  ON public.wallet_transactions(user_id, created_at DESC);

-- VP Transactions: Optimize transaction type queries
CREATE INDEX IF NOT EXISTS idx_vp_transactions_type_status 
  ON public.wallet_transactions(transaction_type, status, created_at DESC);

-- Votes: Optimize election vote counting (removed is_valid filter - column doesn't exist)
CREATE INDEX IF NOT EXISTS idx_votes_election_created 
  ON public.votes(election_id, created_at DESC);

-- User Profiles: Optimize reputation queries
CREATE INDEX IF NOT EXISTS idx_profiles_reputation_created 
  ON public.user_profiles(reputation_score DESC, total_elections_created DESC, created_at DESC);

-- Messages: Optimize conversation queries
CREATE INDEX IF NOT EXISTS idx_messages_conversation_date 
  ON public.direct_messages(thread_id, created_at DESC);

-- Ad Slots: Optimize slot allocation queries (if zone_id exists in ad_slots table)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'ad_slots' 
    AND column_name = 'zone_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_ad_slots_zone_status 
      ON public.ad_slots(zone_id, status, priority DESC);
  END IF;
END $$;

-- =====================================================
-- SECTION 2: MATERIALIZED VIEWS FOR LEADERBOARDS
-- =====================================================

-- Global Reputation Leaderboard (using actual columns)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_global_reputation_leaderboard AS
SELECT 
  up.id,
  up.username,
  up.name,
  up.avatar,
  up.reputation_score,
  up.total_elections_created,
  up.prizes_delivered,
  ROW_NUMBER() OVER (ORDER BY up.reputation_score DESC, up.total_elections_created DESC) as rank
FROM public.user_profiles up
WHERE up.reputation_score > 0
ORDER BY up.reputation_score DESC, up.total_elections_created DESC
LIMIT 1000;

CREATE UNIQUE INDEX ON mv_global_reputation_leaderboard(id);
CREATE INDEX ON mv_global_reputation_leaderboard(rank);

-- Election Performance View (using valid transaction_type enum values)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_election_performance AS
SELECT 
  e.id,
  e.title,
  e.category,
  e.status,
  e.created_by,
  e.created_at,
  COUNT(DISTINCT v.id) as total_votes,
  COALESCE(SUM(vt.amount), 0) as total_vp_distributed
FROM public.elections e
LEFT JOIN public.votes v ON e.id = v.election_id
LEFT JOIN public.wallet_transactions vt ON e.id = vt.election_id AND vt.transaction_type = 'winning'
WHERE e.status IN ('active', 'completed')
GROUP BY e.id, e.title, e.category, e.status, e.created_by, e.created_at
ORDER BY total_votes DESC
LIMIT 1000;

CREATE UNIQUE INDEX ON mv_election_performance(id);
CREATE INDEX ON mv_election_performance(total_votes DESC);
CREATE INDEX ON mv_election_performance(category, total_votes DESC);

-- Creator Earnings View (using wallet_transactions with valid enum values)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_creator_earnings AS
SELECT
  up.id as creator_id,
  up.username,
  up.name,
  COUNT(DISTINCT e.id) as total_elections,
  COUNT(DISTINCT v.id) as total_votes_received,
  COALESCE(SUM(CASE WHEN wt.transaction_type = 'payout' THEN wt.amount ELSE 0 END), 0) as total_earnings,
  COALESCE(SUM(CASE WHEN wt.transaction_type = 'payout' AND wt.status = 'completed' THEN wt.amount ELSE 0 END), 0) as paid_earnings,
  COALESCE(SUM(CASE WHEN wt.transaction_type = 'payout' AND wt.status = 'pending' THEN wt.amount ELSE 0 END), 0) as pending_earnings
FROM public.user_profiles up
LEFT JOIN public.elections e ON up.id = e.created_by
LEFT JOIN public.votes v ON e.id = v.election_id
LEFT JOIN public.wallet_transactions wt ON up.id = wt.user_id AND wt.transaction_type = 'payout'
GROUP BY up.id, up.username, up.name
HAVING COUNT(DISTINCT e.id) > 0
ORDER BY total_earnings DESC
LIMIT 1000;

CREATE UNIQUE INDEX ON mv_creator_earnings(creator_id);
CREATE INDEX ON mv_creator_earnings(total_earnings DESC);

-- =====================================================
-- SECTION 3: PARTIAL INDEXES FOR FILTERED QUERIES
-- =====================================================

-- Active elections only
CREATE INDEX IF NOT EXISTS idx_elections_active 
  ON public.elections(created_at DESC) 
  WHERE status = 'active';

-- Pending transactions only
CREATE INDEX IF NOT EXISTS idx_transactions_pending 
  ON public.wallet_transactions(created_at DESC) 
  WHERE status = 'pending';

-- Completed votes only
CREATE INDEX IF NOT EXISTS idx_votes_completed 
  ON public.votes(election_id, created_at DESC);

-- Unread messages only (if is_read column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'direct_messages' 
    AND column_name = 'is_read'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_messages_unread 
      ON public.direct_messages(recipient_id, created_at DESC) 
      WHERE is_read = false;
  END IF;
END $$;

-- =====================================================
-- SECTION 4: COVERING INDEXES FOR COMMON QUERIES
-- =====================================================

-- Election list with creator info
CREATE INDEX IF NOT EXISTS idx_elections_list_covering 
  ON public.elections(status, created_at DESC) 
  INCLUDE (title, category, created_by);

-- Vote counting with user info
CREATE INDEX IF NOT EXISTS idx_votes_counting_covering 
  ON public.votes(election_id) 
  INCLUDE (user_id, created_at);

-- Transaction history with details
CREATE INDEX IF NOT EXISTS idx_transactions_history_covering 
  ON public.wallet_transactions(user_id, created_at DESC) 
  INCLUDE (transaction_type, amount, status);

-- =====================================================
-- SECTION 5: OPTIMIZED FUNCTIONS
-- =====================================================

-- Function: Get daily platform statistics (using valid enum values)
CREATE OR REPLACE FUNCTION public.get_daily_platform_stats(p_date DATE)
RETURNS TABLE (
  date DATE,
  total_elections INTEGER,
  active_elections INTEGER,
  total_votes INTEGER,
  total_users INTEGER,
  total_vp_distributed NUMERIC
) AS $$
DECLARE
  v_total_elections INTEGER;
  v_active_elections INTEGER;
  v_total_votes INTEGER;
  v_total_users INTEGER;
  v_total_vp_distributed NUMERIC;
BEGIN
  -- Count total elections created on date
  SELECT COUNT(*)
  INTO v_total_elections
  FROM public.elections
  WHERE DATE(created_at) = p_date;

  -- Count active elections on date
  SELECT COUNT(*)
  INTO v_active_elections
  FROM public.elections
  WHERE DATE(created_at) = p_date
  AND status = 'active';

  -- Count total votes on date
  SELECT COUNT(*)
  INTO v_total_votes
  FROM public.votes
  WHERE DATE(created_at) = p_date;

  -- Count total users registered on date
  SELECT COUNT(*)
  INTO v_total_users
  FROM public.user_profiles
  WHERE DATE(created_at) = p_date;

  -- Sum VP distributed on date (using valid enum value 'winning')
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total_vp_distributed
  FROM public.wallet_transactions
  WHERE DATE(created_at) = p_date
  AND transaction_type = 'winning';

  -- Count active elections on date
  SELECT COUNT(*)
  INTO v_active_elections
  FROM public.elections
  WHERE status = 'active'
  AND DATE(created_at) <= p_date
  AND (DATE(end_date) >= p_date OR end_date IS NULL);

  RETURN QUERY SELECT 
    p_date,
    v_total_elections,
    v_active_elections,
    v_total_votes,
    v_total_users,
    v_total_vp_distributed;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Get user engagement metrics
CREATE OR REPLACE FUNCTION public.get_user_engagement_metrics(p_user_id UUID)
RETURNS TABLE (
  user_id UUID,
  total_votes INTEGER,
  total_elections_created INTEGER,
  total_vp_earned NUMERIC,
  total_vp_spent NUMERIC,
  engagement_score NUMERIC
) AS $$
DECLARE
  v_total_votes INTEGER;
  v_total_elections INTEGER;
  v_total_vp_earned NUMERIC;
  v_total_vp_spent NUMERIC;
  v_engagement_score NUMERIC;
BEGIN
  -- Count total votes
  SELECT COUNT(*)
  INTO v_total_votes
  FROM public.votes
  WHERE user_id = p_user_id;

  -- Count total elections created
  SELECT COUNT(*)
  INTO v_total_elections
  FROM public.elections
  WHERE created_by = p_user_id;

  -- Sum VP earned (using valid enum value 'winning')
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total_vp_earned
  FROM public.wallet_transactions
  WHERE user_id = p_user_id
  AND transaction_type = 'winning'
  AND status = 'completed';

  -- Sum VP spent (using valid enum value 'redemption')
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total_vp_spent
  FROM public.wallet_transactions
  WHERE user_id = p_user_id
  AND transaction_type = 'redemption'
  AND status = 'completed';

  -- Calculate engagement score
  v_engagement_score := (v_total_votes * 1.0) + (v_total_elections * 5.0) + (v_total_vp_earned * 0.1);

  RETURN QUERY SELECT 
    p_user_id,
    v_total_votes,
    v_total_elections,
    v_total_vp_earned,
    v_total_vp_spent,
    v_engagement_score;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- SECTION 6: ANALYZE TABLES
-- =====================================================

-- Analyze all critical tables (removed creator_payouts reference)
ANALYZE public.user_profiles;
ANALYZE public.elections;
ANALYZE public.votes;
ANALYZE public.wallet_transactions;
ANALYZE public.direct_messages;

-- =====================================================
-- SECTION 7: REFRESH MATERIALIZED VIEWS
-- =====================================================

-- Refresh all materialized views
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_global_reputation_leaderboard;
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_election_performance;
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_creator_earnings;