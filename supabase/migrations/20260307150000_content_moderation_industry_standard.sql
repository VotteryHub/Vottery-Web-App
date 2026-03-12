-- Content Moderation: Industry-standard fixes and Mobile parity
-- 1) content_moderation_results allow 'election'
-- 2) elections.moderation_notes if missing
-- 3) moderation_log, moderation_config, user_moderation_history, moderation_reviews (Mobile)
-- 4) policy_categories config
-- 5) notifications table for content_removed (if not exists)

-- ========== 1. content_moderation_results: allow 'election' ==========
DO $$
DECLARE
  cname TEXT;
BEGIN
  SELECT tc.constraint_name INTO cname
  FROM information_schema.table_constraints tc
  JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
  WHERE tc.table_schema = 'public' AND tc.table_name = 'content_moderation_results'
    AND tc.constraint_type = 'CHECK' AND ccu.column_name = 'content_type'
  LIMIT 1;
  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.content_moderation_results DROP CONSTRAINT IF EXISTS %I', cname);
  END IF;
  ALTER TABLE public.content_moderation_results
    ADD CONSTRAINT content_moderation_results_content_type_check
    CHECK (content_type IN ('post', 'comment', 'election'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ========== 2. elections: moderation_notes ==========
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'elections' AND column_name = 'moderation_notes'
  ) THEN
    ALTER TABLE public.elections ADD COLUMN moderation_notes TEXT;
  END IF;
END $$;

-- ========== 3. Mobile parity: moderation_log, moderation_config, user_moderation_history, moderation_reviews ==========
CREATE TABLE IF NOT EXISTS public.moderation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  content_text TEXT,
  media_urls TEXT[] DEFAULT '{}',
  violation_categories JSONB DEFAULT '[]'::jsonb,
  is_safe BOOLEAN NOT NULL DEFAULT true,
  confidence_score DECIMAL(4,3) DEFAULT 0,
  action_taken TEXT NOT NULL DEFAULT 'approved' CHECK (action_taken IN ('approved', 'flagged', 'removed')),
  removed_automatically BOOLEAN DEFAULT false,
  claude_reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_moderation_log_content ON public.moderation_log(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_moderation_log_created ON public.moderation_log(created_at DESC);

CREATE TABLE IF NOT EXISTS public.moderation_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  violation_category TEXT NOT NULL,
  confidence_threshold DECIMAL(4,3) NOT NULL DEFAULT 0.85,
  auto_remove_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_type, violation_category)
);
CREATE INDEX IF NOT EXISTS idx_moderation_config_content ON public.moderation_config(content_type);

-- Seed default config
INSERT INTO public.moderation_config (content_type, violation_category, confidence_threshold, auto_remove_enabled)
VALUES
  ('post', 'hate_speech', 0.85, true),
  ('post', 'violence', 0.85, true),
  ('post', 'spam', 0.9, true),
  ('comment', 'hate_speech', 0.85, true),
  ('comment', 'harassment', 0.85, true),
  ('comment', 'spam', 0.9, true)
ON CONFLICT (content_type, violation_category) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.user_moderation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  violation_type TEXT NOT NULL,
  action_taken TEXT NOT NULL DEFAULT 'warned' CHECK (action_taken IN ('warned', 'content_removed', 'account_restricted')),
  content_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_moderation_history_user ON public.user_moderation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_moderation_history_created ON public.user_moderation_history(created_at DESC);

CREATE TABLE IF NOT EXISTS public.moderation_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_moderation_reviews_status ON public.moderation_reviews(status);
CREATE INDEX IF NOT EXISTS idx_moderation_reviews_content ON public.moderation_reviews(content_type, content_id);

-- RLS for new tables
ALTER TABLE public.moderation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_moderation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_reviews ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'moderation_log' AND policyname = 'Service and admin can manage moderation_log') THEN
    CREATE POLICY "Service and admin can manage moderation_log" ON public.moderation_log FOR ALL
      USING (auth.role() = 'service_role' OR public.is_admin_or_moderator())
      WITH CHECK (auth.role() = 'service_role' OR public.is_admin_or_moderator());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'moderation_config' AND policyname = 'Admin read moderation_config') THEN
    CREATE POLICY "Admin read moderation_config" ON public.moderation_config FOR SELECT USING (public.is_admin_or_moderator());
    CREATE POLICY "Service insert moderation_config" ON public.moderation_config FOR INSERT WITH CHECK (auth.role() = 'service_role' OR public.is_admin_or_moderator());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_moderation_history' AND policyname = 'Users see own moderation history') THEN
    CREATE POLICY "Users see own moderation history" ON public.user_moderation_history FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Service insert user_moderation_history" ON public.user_moderation_history FOR INSERT WITH CHECK (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'moderation_reviews' AND policyname = 'Moderators manage moderation_reviews') THEN
    CREATE POLICY "Moderators manage moderation_reviews" ON public.moderation_reviews FOR ALL USING (public.is_admin_or_moderator()) WITH CHECK (public.is_admin_or_moderator());
  END IF;
END $$;

-- ========== 4. policy_categories (structured policy list) ==========
CREATE TABLE IF NOT EXISTS public.policy_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  severity_default TEXT NOT NULL DEFAULT 'medium' CHECK (severity_default IN ('low', 'medium', 'high', 'critical')),
  auto_remove_threshold DECIMAL(4,3) DEFAULT 0.85,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.policy_categories (name, description, severity_default, auto_remove_threshold)
VALUES
  ('hate_speech', 'Content that attacks people based on protected attributes', 'high', 0.85),
  ('harassment', 'Bullying or targeted harassment', 'high', 0.85),
  ('violence', 'Violent or graphic content', 'high', 0.85),
  ('spam', 'Spam or repetitive promotional content', 'medium', 0.9),
  ('misinformation', 'False or misleading information', 'medium', 0.88),
  ('election_integrity', 'Content that undermines election integrity', 'high', 0.85),
  ('policy_violation', 'Other policy violations', 'medium', 0.85),
  ('safe', 'No violation', 'low', 1.0)
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.policy_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read policy_categories" ON public.policy_categories FOR SELECT USING (true);

-- ========== 5. notifications: ensure table and columns for content_removed ==========
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'type') THEN
    ALTER TABLE public.notifications ADD COLUMN type TEXT NOT NULL DEFAULT 'info';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'title') THEN
    ALTER TABLE public.notifications ADD COLUMN title TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'metadata') THEN
    ALTER TABLE public.notifications ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'message') THEN
    ALTER TABLE public.notifications ADD COLUMN message TEXT NOT NULL DEFAULT '';
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read, created_at DESC);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notifications_select" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update" ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete" ON public.notifications;
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT USING (user_id = auth.uid() OR (SELECT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')));
CREATE POLICY "notifications_insert" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications_delete" ON public.notifications FOR DELETE USING (user_id = auth.uid());
