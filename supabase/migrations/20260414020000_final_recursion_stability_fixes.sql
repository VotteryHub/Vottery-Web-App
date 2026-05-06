-- =====================================================
-- FINAL STABILIZATION: RLS Recursion Fix & Relationship Sync
-- Migration: 20260414020000_final_recursion_stability_fixes.sql
-- =====================================================

BEGIN;

-- 1. SECURITY DEFINER HELPERS (Avoids RLS Recursion)
-- =====================================================

-- Safe Group Membership Check
CREATE OR REPLACE FUNCTION public.is_group_member(p_group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id
    AND user_id = auth.uid()
  );
$$;

-- Safe Group Admin/Moderator Check
CREATE OR REPLACE FUNCTION public.is_group_admin(p_group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id
    AND user_id = auth.uid()
    AND role IN ('admin', 'moderator')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_group_member(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_group_admin(UUID) TO authenticated, anon;

-- 2. PURGE RECURSIVE GROUP POLICIES
-- =====================================================

-- Drop all variants of recursive policies on group_members
DROP POLICY IF EXISTS "Group members are viewable by group members" ON public.group_members;
DROP POLICY IF EXISTS "group_members_select" ON public.group_members;
DROP POLICY IF EXISTS "group_members_insert" ON public.group_members;
DROP POLICY IF EXISTS "group_members_delete" ON public.group_members;

-- Drop all variants of recursive policies on groups
DROP POLICY IF EXISTS "Public groups are viewable by everyone" ON public.groups;
DROP POLICY IF EXISTS "Group admins can update groups" ON public.groups;
DROP POLICY IF EXISTS "groups_select" ON public.groups;
DROP POLICY IF EXISTS "groups_insert" ON public.groups;
DROP POLICY IF EXISTS "groups_update" ON public.groups;
DROP POLICY IF EXISTS "groups_delete" ON public.groups;

-- 3. APPLY CLEAN POLICIES
-- =====================================================

-- NEW Group Membership Policies (Non-Recursive)
CREATE POLICY "group_members_select_v2" ON public.group_members
  FOR SELECT USING (true); -- Everyone can see who is in a group (common social pattern)

CREATE POLICY "group_members_insert_v2" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "group_members_delete_v2" ON public.group_members
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- NEW Groups Policies (Non-Recursive)
CREATE POLICY "groups_select_v2" ON public.groups
  FOR SELECT USING (
    is_private = FALSE 
    OR created_by = auth.uid() 
    OR public.is_group_member(id)
    OR public.is_admin()
  );

CREATE POLICY "groups_insert_v2" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "groups_update_v2" ON public.groups
  FOR UPDATE USING (
    created_by = auth.uid() 
    OR public.is_group_admin(id)
    OR public.is_admin()
  );

CREATE POLICY "groups_delete_v2" ON public.groups
  FOR DELETE USING (
    created_by = auth.uid() 
    OR public.is_admin()
  );

-- 4. RELATIONSHIP STANDARDIZATION & AUDIT
-- =====================================================

-- Ensure elections table uses user_profiles(id) for created_by
-- This is often missed if migrated from auth.users
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'elections' AND column_name = 'created_by'
  ) THEN
    -- Check if FK already exists, if not add it
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'elections_created_by_fkey'
      AND table_name = 'elections'
    ) THEN
      ALTER TABLE public.elections
      ADD CONSTRAINT elections_created_by_fkey
      FOREIGN KEY (created_by) REFERENCES public.user_profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- 5. RE-COMMIT PREVIOUS FIXES (JUST IN CASE)
-- =====================================================

-- Ensure platform_activities exists and RLS is enabled
CREATE TABLE IF NOT EXISTS public.platform_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.platform_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "platform_activities_select" ON public.platform_activities;
CREATE POLICY "platform_activities_select" ON public.platform_activities
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "platform_activities_insert" ON public.platform_activities;
CREATE POLICY "platform_activities_insert" ON public.platform_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ensure publication is healthy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'platform_activities'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE platform_activities;
  END IF;
END $$;

COMMIT;
