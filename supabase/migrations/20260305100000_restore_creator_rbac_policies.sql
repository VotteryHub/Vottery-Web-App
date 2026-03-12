-- Restore creator-friendly RLS policies for elections, votes, election_options, posts.
-- The fix_user_profiles migration made these admin-only; creators need to create/manage elections.
-- Uses has_any_role() from 20260304100000_backend_rbac_enhancements.sql.
-- Admin full access is preserved via is_admin(); we ADD creator/voter policies.

-- ============================================================================
-- ELECTIONS: Add creator + public read policies (admin full access already exists)
-- ============================================================================

-- Public read for active/completed/upcoming elections
DROP POLICY IF EXISTS "elections_public_read" ON public.elections;
CREATE POLICY "elections_public_read" ON public.elections
  FOR SELECT
  USING (status IN ('active', 'completed', 'upcoming'));

-- Creator insert: users with creator or admin role can create
DROP POLICY IF EXISTS "elections_creator_insert" ON public.elections;
CREATE POLICY "elections_creator_insert" ON public.elections
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
    AND public.has_any_role(ARRAY['creator', 'admin'])
  );

-- Creator update: own elections only
DROP POLICY IF EXISTS "elections_creator_update" ON public.elections;
CREATE POLICY "elections_creator_update" ON public.elections
  FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Creator delete: own draft/pending only
DROP POLICY IF EXISTS "elections_creator_delete" ON public.elections;
CREATE POLICY "elections_creator_delete" ON public.elections
  FOR DELETE
  USING (created_by = auth.uid() AND status IN ('draft', 'pending'));

-- ============================================================================
-- ELECTION_OPTIONS: Add creator policies (admin full access already exists)
-- ============================================================================

DROP POLICY IF EXISTS "election_options_public_read" ON public.election_options;
CREATE POLICY "election_options_public_read" ON public.election_options
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.elections
      WHERE elections.id = election_options.election_id
      AND elections.status IN ('active', 'completed', 'upcoming')
    )
  );

DROP POLICY IF EXISTS "election_options_creator_insert" ON public.election_options;
CREATE POLICY "election_options_creator_insert" ON public.election_options
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.elections
      WHERE elections.id = election_options.election_id
      AND elections.created_by = auth.uid()
    )
  );

DROP POLICY IF EXISTS "election_options_creator_update" ON public.election_options;
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
-- VOTES: Add user policies (admin full access already exists)
-- ============================================================================

DROP POLICY IF EXISTS "votes_own_read" ON public.votes;
CREATE POLICY "votes_own_read" ON public.votes
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "votes_own_insert" ON public.votes;
CREATE POLICY "votes_own_insert" ON public.votes
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- ============================================================================
-- POSTS: Add user policies (admin full access already exists)
-- ============================================================================

DROP POLICY IF EXISTS "posts_public_read" ON public.posts;
CREATE POLICY "posts_public_read" ON public.posts
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "posts_authenticated_insert" ON public.posts;
CREATE POLICY "posts_authenticated_insert" ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

DROP POLICY IF EXISTS "posts_own_update" ON public.posts;
CREATE POLICY "posts_own_update" ON public.posts
  FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "posts_own_delete" ON public.posts;
CREATE POLICY "posts_own_delete" ON public.posts
  FOR DELETE
  USING (created_by = auth.uid());
