-- =============================================================================
-- COPY THIS ENTIRE BLOCK → Supabase Dashboard → SQL Editor → Paste → Run
-- =============================================================================

-- 1. RBAC helper functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin', 'manager', 'moderator')
  );
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(required_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
      AND (
        role = ANY(required_roles)
        OR (role IN ('admin', 'super_admin', 'manager', 'moderator') AND 'admin' = ANY(required_roles))
        OR (role IN ('creator', 'admin', 'super_admin', 'manager', 'moderator') AND 'creator' = ANY(required_roles))
        OR (role IN ('advertiser', 'admin', 'super_admin', 'manager', 'moderator') AND 'advertiser' = ANY(required_roles))
      )
  );
$$;

GRANT EXECUTE ON FUNCTION public.has_any_role(TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_any_role(TEXT[]) TO anon;

-- 2. role_upgrade_requests table
CREATE TABLE IF NOT EXISTS public.role_upgrade_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_role TEXT NOT NULL CHECK (requested_role IN ('creator', 'advertiser')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_role_upgrade_requests_user ON public.role_upgrade_requests(user_id);
ALTER TABLE public.role_upgrade_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "role_upgrade_requests_select_own" ON public.role_upgrade_requests;
CREATE POLICY "role_upgrade_requests_select_own" ON public.role_upgrade_requests FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "role_upgrade_requests_insert_own" ON public.role_upgrade_requests;
CREATE POLICY "role_upgrade_requests_insert_own" ON public.role_upgrade_requests FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "role_upgrade_requests_admin_all" ON public.role_upgrade_requests;
CREATE POLICY "role_upgrade_requests_admin_all" ON public.role_upgrade_requests FOR ALL USING (public.is_admin());

-- 3. Elections RLS (only if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'elections') THEN
    DROP POLICY IF EXISTS "Admins have full access to elections" ON public.elections;
    DROP POLICY IF EXISTS "elections_public_read" ON public.elections;
    DROP POLICY IF EXISTS "elections_creator_insert" ON public.elections;
    DROP POLICY IF EXISTS "elections_creator_update" ON public.elections;
    DROP POLICY IF EXISTS "elections_creator_delete" ON public.elections;
    CREATE POLICY "elections_public_read" ON public.elections FOR SELECT USING (status IN ('active', 'completed', 'upcoming'));
    CREATE POLICY "elections_creator_insert" ON public.elections FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid() AND public.has_any_role(ARRAY['creator', 'admin']));
    CREATE POLICY "elections_creator_update" ON public.elections FOR UPDATE USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
    CREATE POLICY "elections_creator_delete" ON public.elections FOR DELETE USING (created_by = auth.uid() AND status IN ('draft', 'pending'));
    CREATE POLICY "elections_admin_all" ON public.elections FOR ALL USING (public.is_admin());
  END IF;
END $$;

-- 4. Election_options RLS (only if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'election_options') THEN
    DROP POLICY IF EXISTS "Admins have full access to election_options" ON public.election_options;
    DROP POLICY IF EXISTS "election_options_public_read" ON public.election_options;
    DROP POLICY IF EXISTS "election_options_creator_insert" ON public.election_options;
    DROP POLICY IF EXISTS "election_options_creator_update" ON public.election_options;
    CREATE POLICY "election_options_public_read" ON public.election_options FOR SELECT USING (EXISTS (SELECT 1 FROM public.elections WHERE elections.id = election_options.election_id AND elections.status IN ('active', 'completed', 'upcoming')));
    CREATE POLICY "election_options_creator_insert" ON public.election_options FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.elections WHERE elections.id = election_options.election_id AND elections.created_by = auth.uid()));
    CREATE POLICY "election_options_creator_update" ON public.election_options FOR UPDATE USING (EXISTS (SELECT 1 FROM public.elections WHERE elections.id = election_options.election_id AND elections.created_by = auth.uid()));
    CREATE POLICY "election_options_admin_all" ON public.election_options FOR ALL USING (public.is_admin());
  END IF;
END $$;

-- 5. Votes RLS (only if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'votes') THEN
    DROP POLICY IF EXISTS "Admins have full access to votes" ON public.votes;
    DROP POLICY IF EXISTS "votes_own_read" ON public.votes;
    DROP POLICY IF EXISTS "votes_own_insert" ON public.votes;
    CREATE POLICY "votes_own_read" ON public.votes FOR SELECT USING (user_id = auth.uid());
    CREATE POLICY "votes_own_insert" ON public.votes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
    CREATE POLICY "votes_admin_all" ON public.votes FOR ALL USING (public.is_admin());
  END IF;
END $$;

-- 6. Posts RLS (only if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'posts') THEN
    DROP POLICY IF EXISTS "Admins have full access to posts" ON public.posts;
    DROP POLICY IF EXISTS "posts_public_read" ON public.posts;
    DROP POLICY IF EXISTS "posts_authenticated_insert" ON public.posts;
    DROP POLICY IF EXISTS "posts_own_update" ON public.posts;
    DROP POLICY IF EXISTS "posts_own_delete" ON public.posts;
    CREATE POLICY "posts_public_read" ON public.posts FOR SELECT USING (true);
    CREATE POLICY "posts_authenticated_insert" ON public.posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());
    CREATE POLICY "posts_own_update" ON public.posts FOR UPDATE USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
    CREATE POLICY "posts_own_delete" ON public.posts FOR DELETE USING (created_by = auth.uid());
    CREATE POLICY "posts_admin_all" ON public.posts FOR ALL USING (public.is_admin());
  END IF;
END $$;

-- 7. asset_permissions (only if table exists - create or add policies)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'asset_permissions') THEN
    CREATE TABLE public.asset_permissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      asset_type TEXT NOT NULL CHECK (asset_type IN ('election', 'campaign', 'ad_account', 'organization')),
      asset_id UUID NOT NULL,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      permission_level TEXT NOT NULL DEFAULT 'view' CHECK (permission_level IN ('view', 'edit', 'manage', 'admin')),
      granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      expires_at TIMESTAMPTZ,
      UNIQUE(asset_type, asset_id, user_id)
    );
    CREATE INDEX IF NOT EXISTS idx_asset_permissions_user ON public.asset_permissions(user_id);
    CREATE INDEX IF NOT EXISTS idx_asset_permissions_asset ON public.asset_permissions(asset_type, asset_id);
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'asset_permissions') THEN
    ALTER TABLE public.asset_permissions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "asset_permissions_select_own" ON public.asset_permissions;
    DROP POLICY IF EXISTS "asset_permissions_own_read" ON public.asset_permissions;
    CREATE POLICY "asset_permissions_own_read" ON public.asset_permissions FOR SELECT USING (user_id = auth.uid());
    DROP POLICY IF EXISTS "asset_permissions_admin_all" ON public.asset_permissions;
    CREATE POLICY "asset_permissions_admin_all" ON public.asset_permissions FOR ALL USING (public.is_admin());
  END IF;
END $$;
