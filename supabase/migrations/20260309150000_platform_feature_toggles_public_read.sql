-- Allow all users (including anon) to SELECT platform_feature_toggles so the app can gate
-- features by is_enabled. Write (INSERT/UPDATE/DELETE) remains admin-only.
-- Required for: Web and Mobile feature gating without admin session.

DROP POLICY IF EXISTS "platform_feature_toggles_admin_all" ON public.platform_feature_toggles;

-- Anyone can read toggles (for feature gating in app)
CREATE POLICY "platform_feature_toggles_select_all"
  ON public.platform_feature_toggles FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "platform_feature_toggles_admin_insert"
  ON public.platform_feature_toggles FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "platform_feature_toggles_admin_update"
  ON public.platform_feature_toggles FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "platform_feature_toggles_admin_delete"
  ON public.platform_feature_toggles FOR DELETE
  USING (public.is_admin());
