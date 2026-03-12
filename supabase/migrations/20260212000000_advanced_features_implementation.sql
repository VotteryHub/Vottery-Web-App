-- Advanced Search & Discovery System
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  results_count INTEGER DEFAULT 0,
  search_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON public.saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON public.search_analytics(query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created ON public.search_analytics(created_at);

-- Historical Performance Tracking
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.performance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  threshold_value NUMERIC,
  current_value NUMERIC,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'acknowledged')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON public.performance_metrics(metric_type, created_at);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_status ON public.performance_alerts(status, created_at);

-- Guided Onboarding System
CREATE TABLE IF NOT EXISTS public.user_onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
  completed_tours TEXT[] DEFAULT '{}',
  skipped_tours TEXT[] DEFAULT '{}',
  current_step JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user ON public.user_onboarding_progress(user_id);

-- Feature Flag System
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key TEXT UNIQUE NOT NULL,
  flag_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_segments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.feature_flag_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key TEXT NOT NULL,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  variant TEXT DEFAULT 'default',
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON public.feature_flags(flag_key);
CREATE INDEX IF NOT EXISTS idx_feature_flag_analytics_key ON public.feature_flag_analytics(flag_key, created_at);
CREATE INDEX IF NOT EXISTS idx_feature_flag_analytics_user ON public.feature_flag_analytics(user_id);

-- Groups Discovery & Management
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  topic TEXT,
  avatar TEXT,
  cover_image TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  member_count INTEGER DEFAULT 0,
  election_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.group_elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, election_id)
);

CREATE INDEX IF NOT EXISTS idx_groups_topic ON public.groups(topic);
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON public.groups(created_by);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_elections_group ON public.group_elections(group_id);

-- RLS Policies for Advanced Search
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own saved searches" ON public.saved_searches;
  DROP POLICY IF EXISTS "Users can create own saved searches" ON public.saved_searches;
  DROP POLICY IF EXISTS "Users can delete own saved searches" ON public.saved_searches;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Users can view own saved searches"
  ON public.saved_searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own saved searches"
  ON public.saved_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved searches"
  ON public.saved_searches FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for Onboarding
ALTER TABLE public.user_onboarding_progress ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own onboarding progress" ON public.user_onboarding_progress;
  DROP POLICY IF EXISTS "Users can update own onboarding progress" ON public.user_onboarding_progress;
  DROP POLICY IF EXISTS "Users can insert own onboarding progress" ON public.user_onboarding_progress;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Users can view own onboarding progress"
  ON public.user_onboarding_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding progress"
  ON public.user_onboarding_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding progress"
  ON public.user_onboarding_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Public groups are viewable by everyone" ON public.groups;
  DROP POLICY IF EXISTS "Users can create groups" ON public.groups;
  DROP POLICY IF EXISTS "Group admins can update groups" ON public.groups;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Public groups are viewable by everyone"
  ON public.groups FOR SELECT
  USING (is_private = FALSE OR created_by = auth.uid() OR EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = groups.id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group admins can update groups"
  ON public.groups FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = groups.id AND user_id = auth.uid() AND role = 'admin'
  ));

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Group members are viewable by group members" ON public.group_members;
  DROP POLICY IF EXISTS "Users can join public groups" ON public.group_members;
  DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Group members are viewable by group members"
  ON public.group_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.groups
    WHERE id = group_members.group_id AND (
      is_private = FALSE OR
      created_by = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.group_id = groups.id AND gm.user_id = auth.uid()
      )
    )
  ));

CREATE POLICY "Users can join public groups"
  ON public.group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.groups
    WHERE id = group_members.group_id AND is_private = FALSE
  ));

CREATE POLICY "Users can leave groups"
  ON public.group_members FOR DELETE
  USING (auth.uid() = user_id);

-- Function to get search suggestions
CREATE OR REPLACE FUNCTION get_search_suggestions(search_query TEXT, suggestion_limit INTEGER DEFAULT 10)
RETURNS TABLE (suggestion TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT query
  FROM public.search_analytics
  WHERE query ILIKE search_query || '%'
  ORDER BY search_count DESC
  LIMIT suggestion_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups
    SET member_count = member_count + 1
    WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups
    SET member_count = member_count - 1
    WHERE id = OLD.group_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_group_member_count ON public.group_members;

CREATE TRIGGER trigger_update_group_member_count
AFTER INSERT OR DELETE ON public.group_members
FOR EACH ROW EXECUTE FUNCTION update_group_member_count();