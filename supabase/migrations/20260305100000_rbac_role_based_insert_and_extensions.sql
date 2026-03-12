-- P0 Backend RBAC: Enforce creator/advertiser role on INSERT
-- Elections: only creator or admin can create
-- Sponsored elections: only advertiser or admin can create
-- Extends has_any_role() usage for RLS

-- Drop permissive insert policies
DROP POLICY IF EXISTS "elections_authenticated_insert" ON public.elections;
DROP POLICY IF EXISTS "sponsored_elections_advertiser_insert" ON public.sponsored_elections;

-- Elections: creator or admin can insert
CREATE POLICY "elections_creator_or_admin_insert" ON public.elections
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
    AND public.has_any_role(ARRAY['creator', 'admin'])
  );

-- Sponsored elections: advertiser or admin can insert
CREATE POLICY "sponsored_elections_advertiser_or_admin_insert" ON public.sponsored_elections
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND public.has_any_role(ARRAY['advertiser', 'admin'])
  );

-- Sponsored elections: advertiser or admin can update
DROP POLICY IF EXISTS "sponsored_elections_advertiser_update" ON public.sponsored_elections;
CREATE POLICY "sponsored_elections_advertiser_or_admin_update" ON public.sponsored_elections
  FOR UPDATE
  USING (public.has_any_role(ARRAY['advertiser', 'admin']))
  WITH CHECK (public.has_any_role(ARRAY['advertiser', 'admin']));
