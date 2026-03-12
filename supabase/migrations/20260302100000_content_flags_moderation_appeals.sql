-- Community Moderation: content_flags, moderation_actions, content_appeals
-- Per Rough Dev. Docs cross-check report – wire moderation UI to real tables

-- =====================================================
-- CONTENT FLAGS (user/AI flagged content for review)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.content_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment', 'election')),
  content_id UUID NOT NULL,
  content_snippet TEXT,
  author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  flagger_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  violation_type TEXT NOT NULL CHECK (violation_type IN (
    'misinformation', 'spam', 'policy_violation', 'hate_speech', 'harassment', 'election_integrity', 'other'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  confidence_score DECIMAL(4,3) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  detection_method TEXT CHECK (detection_method IN ('ai', 'manual', 'user_report')) DEFAULT 'manual',
  status TEXT NOT NULL CHECK (status IN (
    'pending_review', 'under_review', 'auto_removed', 'approved', 'content_removed', 'user_warned', 'escalated'
  )) DEFAULT 'pending_review',
  reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_flags_status ON public.content_flags(status);
CREATE INDEX IF NOT EXISTS idx_content_flags_content ON public.content_flags(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_flags_created ON public.content_flags(created_at DESC);

-- =====================================================
-- MODERATION ACTIONS (audit trail of moderator decisions)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_id UUID NOT NULL REFERENCES public.content_flags(id) ON DELETE CASCADE,
  moderator_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN (
    'content_removed', 'user_warned', 'account_restricted', 'approved', 'escalated', 'dismissed'
  )),
  reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_actions_flag ON public.moderation_actions(flag_id);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_created ON public.moderation_actions(created_at DESC);

-- =====================================================
-- CONTENT APPEALS (user appeals against moderation decisions)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.content_appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_id UUID NOT NULL REFERENCES public.content_flags(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  appellant_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'upheld', 'overturned', 'dismissed')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  outcome TEXT CHECK (outcome IN ('upheld', 'overturned', 'dismissed')),
  outcome_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_appeals_flag ON public.content_appeals(flag_id);
CREATE INDEX IF NOT EXISTS idx_content_appeals_status ON public.content_appeals(status);
CREATE INDEX IF NOT EXISTS idx_content_appeals_appellant ON public.content_appeals(appellant_id);

-- Helper to avoid RLS recursion (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
GRANT EXECUTE ON FUNCTION public.is_admin_or_moderator() TO authenticated, anon;

-- RLS
ALTER TABLE public.content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_appeals ENABLE ROW LEVEL SECURITY;

-- content_flags: moderators and admins can read/write; authors can read own; anyone can insert (report)
CREATE POLICY content_flags_select ON public.content_flags FOR SELECT
  USING (auth.role() = 'service_role' OR public.is_admin_or_moderator() OR author_id = auth.uid());
CREATE POLICY content_flags_insert ON public.content_flags FOR INSERT WITH CHECK (true);
CREATE POLICY content_flags_update ON public.content_flags FOR UPDATE
  USING (auth.role() = 'service_role' OR public.is_admin_or_moderator());

-- moderation_actions: moderators/admins only
CREATE POLICY moderation_actions_select ON public.moderation_actions FOR SELECT
  USING (auth.role() = 'service_role' OR public.is_admin_or_moderator());
CREATE POLICY moderation_actions_insert ON public.moderation_actions FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR public.is_admin_or_moderator());

-- content_appeals: appellant can read own and insert; moderators can all
CREATE POLICY content_appeals_select ON public.content_appeals FOR SELECT
  USING (auth.role() = 'service_role' OR appellant_id = auth.uid() OR public.is_admin_or_moderator());
CREATE POLICY content_appeals_insert ON public.content_appeals FOR INSERT WITH CHECK (appellant_id = auth.uid());
CREATE POLICY content_appeals_update ON public.content_appeals FOR UPDATE
  USING (auth.role() = 'service_role' OR public.is_admin_or_moderator());

-- updated_at trigger for content_flags and content_appeals
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS content_flags_updated_at ON public.content_flags;
CREATE TRIGGER content_flags_updated_at BEFORE UPDATE ON public.content_flags
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS content_appeals_updated_at ON public.content_appeals;
CREATE TRIGGER content_appeals_updated_at BEFORE UPDATE ON public.content_appeals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
