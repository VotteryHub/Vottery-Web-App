-- RBAC: Role switching, asset-level permissions, and extended RLS
-- Aligns with client: src/constants/roles.js, lib/constants/roles.dart

-- ============================================================================
-- 1. User roles (multi-role support for switching)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('voter', 'creator', 'advertiser', 'admin', 'super_admin', 'manager', 'moderator', 'developer')),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_select_own" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_roles_admin_all" ON public.user_roles
  FOR ALL USING (public.is_admin());

-- ============================================================================
-- 2. Asset-level permissions (per-election, per-campaign)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.asset_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type TEXT NOT NULL CHECK (asset_type IN ('election', 'campaign', 'ad_account')),
  asset_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL CHECK (permission IN ('view', 'edit', 'manage', 'admin')),
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(asset_type, asset_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_asset_permissions_asset ON public.asset_permissions(asset_type, asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_permissions_user ON public.asset_permissions(user_id);

ALTER TABLE public.asset_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "asset_permissions_select_own" ON public.asset_permissions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "asset_permissions_admin_all" ON public.asset_permissions
  FOR ALL USING (public.is_admin());

-- ============================================================================
-- 3. Role upgrade requests (for voters requesting creator/advertiser)
-- ============================================================================
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

CREATE POLICY "role_upgrade_requests_select_own" ON public.role_upgrade_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "role_upgrade_requests_insert_own" ON public.role_upgrade_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "role_upgrade_requests_admin_all" ON public.role_upgrade_requests
  FOR ALL USING (public.is_admin());

-- ============================================================================
-- 4. Elections INSERT: require creator role (replace permissive policy)
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can create elections" ON public.elections;
CREATE POLICY "elections_creator_insert" ON public.elections
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND public.has_any_role(ARRAY['creator', 'admin'])
  );

-- ============================================================================
-- 5. Sponsored elections: require advertiser role for INSERT
-- ============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sponsored_elections') THEN
    EXECUTE 'ALTER TABLE public.sponsored_elections ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "sponsored_elections_advertiser_insert" ON public.sponsored_elections';
    EXECUTE 'CREATE POLICY "sponsored_elections_advertiser_insert" ON public.sponsored_elections FOR INSERT WITH CHECK (public.has_any_role(ARRAY[''advertiser'', ''admin'']))';
  END IF;
END $$;
