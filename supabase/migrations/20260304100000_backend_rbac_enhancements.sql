-- Backend RBAC: Extend is_admin() and add has_any_role() for RLS
-- Aligns with client: src/constants/roles.js, lib/constants/roles.dart

-- Extend is_admin() to include all admin-like roles (super_admin, manager, moderator)
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
      AND role IN ('admin', 'super_admin', 'manager', 'moderator')
  );
$$;

-- New: Check if user has any of the given roles
CREATE OR REPLACE FUNCTION public.has_any_role(required_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE id = auth.uid()
      AND (
        role = ANY(required_roles)
        OR (role IN ('admin', 'super_admin', 'manager', 'moderator') AND 'admin' = ANY(required_roles))
        OR (role IN ('creator', 'admin', 'super_admin', 'manager', 'moderator') AND 'creator' = ANY(required_roles))
        OR (role IN ('advertiser', 'admin', 'super_admin', 'manager', 'moderator') AND 'advertiser' = ANY(required_roles))
      )
  );
$$;

GRANT EXECUTE ON FUNCTION public.has_any_role(TEXT[]) TO authenticated, anon;

-- RLS for platform_feature_toggles: admin only (replace public read)
ALTER TABLE IF EXISTS public.platform_feature_toggles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Everyone can view feature toggles" ON public.platform_feature_toggles;
DROP POLICY IF EXISTS "platform_feature_toggles_admin_all" ON public.platform_feature_toggles;
CREATE POLICY "platform_feature_toggles_admin_all" ON public.platform_feature_toggles
  FOR ALL USING (public.is_admin());

-- RLS for country_access_controls: admin only
ALTER TABLE IF EXISTS public.country_access_controls ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Everyone can view country controls" ON public.country_access_controls;
DROP POLICY IF EXISTS "country_access_controls_admin_all" ON public.country_access_controls;
CREATE POLICY "country_access_controls_admin_all" ON public.country_access_controls
  FOR ALL USING (public.is_admin());

-- RLS for integration_controls: admin only
ALTER TABLE IF EXISTS public.integration_controls ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Everyone can view integration controls" ON public.integration_controls;
DROP POLICY IF EXISTS "integration_controls_admin_all" ON public.integration_controls;
CREATE POLICY "integration_controls_admin_all" ON public.integration_controls
  FOR ALL USING (public.is_admin());

-- Admin roles: allow admins to update (for custom permissions)
DROP POLICY IF EXISTS "Everyone can view admin roles" ON public.admin_roles;
CREATE POLICY "admin_roles_select" ON public.admin_roles FOR SELECT USING (true);
CREATE POLICY "admin_roles_admin_update" ON public.admin_roles FOR UPDATE
  USING (public.is_admin()) WITH CHECK (public.is_admin());
