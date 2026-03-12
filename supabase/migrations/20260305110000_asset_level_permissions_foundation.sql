-- Asset-level permissions foundation for future per-election, per-campaign RBAC.
-- Aligns with Facebook/TikTok asset-level permission model.

-- Asset permissions: who can do what on which asset
CREATE TABLE IF NOT EXISTS public.asset_permissions (
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

ALTER TABLE public.asset_permissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own permissions
CREATE POLICY "asset_permissions_own_read" ON public.asset_permissions
  FOR SELECT USING (user_id = auth.uid());

-- Admins can manage all
CREATE POLICY "asset_permissions_admin_all" ON public.asset_permissions
  FOR ALL USING (public.is_admin());

-- Asset owners can grant permissions (future: check via elections.created_by, etc.)
-- For now, only admins can insert/update/delete
CREATE POLICY "asset_permissions_admin_insert" ON public.asset_permissions
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "asset_permissions_admin_update" ON public.asset_permissions
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "asset_permissions_admin_delete" ON public.asset_permissions
  FOR DELETE USING (public.is_admin());

COMMENT ON TABLE public.asset_permissions IS 'Foundation for per-election, per-campaign RBAC. Extend with triggers for election/campaign owners.';
