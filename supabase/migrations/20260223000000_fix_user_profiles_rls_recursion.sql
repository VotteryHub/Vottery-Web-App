-- FIX: Infinite recursion in user_profiles RLS policies
-- The policy "Admins have full access to profiles" on public.user_profiles
-- queries public.user_profiles itself, triggering infinite recursion.
--
-- Solution:
--   1. Drop all stale / conflicting policies from the first migration.
--   2. Create a SECURITY DEFINER helper function that reads user role
--      WITHOUT going through RLS (avoids recursion).
--   3. Policies that need to check admin role now call the helper function.

-- ============================================================================
-- STEP 1: Drop the recursive and duplicate policies left by the first migration
-- ============================================================================

DROP POLICY IF EXISTS "Admins have full access to profiles"  ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view all profiles"          ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile"         ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile"         ON public.user_profiles;

-- ============================================================================
-- STEP 2: Create a SECURITY DEFINER helper to check admin role safely
--         (SECURITY DEFINER bypasses RLS so there is no recursive call)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- Revoke direct execution from public; only the function itself runs with
-- elevated privileges (SECURITY DEFINER), callers don't need EXECUTE grant
-- for RLS policies because they run in the context of the policy evaluator.
-- But we grant EXECUTE to authenticated and anon so policies can call it.
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- ============================================================================
-- STEP 3: Replace any other policies on OTHER tables that inline the same
--         recursive subquery, swapping them for the safe helper function.
--         (These were created in migration 20260122041700 and later ones.)
-- ============================================================================

-- Elections – admin full access
DROP POLICY IF EXISTS "Admins have full access to elections" ON public.elections;
CREATE POLICY "Admins have full access to elections"
    ON public.elections FOR ALL
    USING (public.is_admin());

-- Election Options – admin full access
DROP POLICY IF EXISTS "Admins have full access to election_options" ON public.election_options;
CREATE POLICY "Admins have full access to election_options"
    ON public.election_options FOR ALL
    USING (public.is_admin());

-- Votes – admin full access
DROP POLICY IF EXISTS "Admins have full access to votes" ON public.votes;
CREATE POLICY "Admins have full access to votes"
    ON public.votes FOR ALL
    USING (public.is_admin());

-- Posts – admin full access
DROP POLICY IF EXISTS "Admins have full access to posts" ON public.posts;
CREATE POLICY "Admins have full access to posts"
    ON public.posts FOR ALL
    USING (public.is_admin());

-- Alert Rules (already use subquery referencing user_profiles – swap to helper)
DROP POLICY IF EXISTS "alert_rules_admin_read"   ON public.alert_rules;
DROP POLICY IF EXISTS "alert_rules_admin_insert" ON public.alert_rules;
DROP POLICY IF EXISTS "alert_rules_admin_update" ON public.alert_rules;
DROP POLICY IF EXISTS "alert_rules_admin_delete" ON public.alert_rules;

CREATE POLICY "alert_rules_admin_read"   ON public.alert_rules FOR SELECT USING (public.is_admin());
CREATE POLICY "alert_rules_admin_insert" ON public.alert_rules FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "alert_rules_admin_update" ON public.alert_rules FOR UPDATE USING (public.is_admin());
CREATE POLICY "alert_rules_admin_delete" ON public.alert_rules FOR DELETE USING (public.is_admin());

-- Admin Activity Logs
DROP POLICY IF EXISTS "admin_activity_logs_admin_read" ON public.admin_activity_logs;
CREATE POLICY "admin_activity_logs_admin_read"
    ON public.admin_activity_logs FOR SELECT
    USING (public.is_admin());

-- ============================================================================
-- STEP 4: Ensure the clean policies from migration 20260203120000 are present
--         (idempotent – they are already there but listed here for clarity)
-- ============================================================================

-- user_profiles_public_read  → USING (true)         [already exists, no change needed]
-- user_profiles_own_update   → USING (id=auth.uid()) [already exists]
-- user_profiles_own_delete   → USING (id=auth.uid()) [already exists]
-- user_profiles_system_insert → WITH CHECK (true)    [already exists]
