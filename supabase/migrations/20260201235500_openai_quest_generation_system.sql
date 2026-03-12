-- OpenAI Quest Generation System Migration
-- Creates tables for user quests, quest templates, and quest analytics

-- User Quests Table
CREATE TABLE IF NOT EXISTS public.user_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('voting', 'social', 'exploration', 'achievement')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  target_value INTEGER NOT NULL,
  current_progress INTEGER DEFAULT 0,
  vp_reward INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'cancelled')),
  requirements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_quests_user_id ON public.user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_status ON public.user_quests(status);
CREATE INDEX IF NOT EXISTS idx_user_quests_category ON public.user_quests(category);
CREATE INDEX IF NOT EXISTS idx_user_quests_expires_at ON public.user_quests(expires_at);

-- RLS Policies for user_quests
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quests"
  ON public.user_quests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quests"
  ON public.user_quests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quests"
  ON public.user_quests
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all quests"
  ON public.user_quests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Quest Analytics Table
CREATE TABLE IF NOT EXISTS public.quest_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.user_quests(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('started', 'progress_updated', 'completed', 'expired', 'cancelled')),
  progress_value INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quest_analytics_user_id ON public.quest_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_quest_analytics_quest_id ON public.quest_analytics(quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_analytics_event_type ON public.quest_analytics(event_type);

-- RLS Policies for quest_analytics
ALTER TABLE public.quest_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quest analytics"
  ON public.quest_analytics
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert quest analytics"
  ON public.quest_analytics
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all quest analytics"
  ON public.quest_analytics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Function to automatically expire quests
CREATE OR REPLACE FUNCTION expire_old_quests()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_quests
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at < NOW();
END;
$$;

-- Function to log quest analytics
CREATE OR REPLACE FUNCTION log_quest_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.quest_analytics (user_id, quest_id, event_type, progress_value)
    VALUES (NEW.user_id, NEW.id, 'started', NEW.current_progress);
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.current_progress != NEW.current_progress THEN
      INSERT INTO public.quest_analytics (user_id, quest_id, event_type, progress_value)
      VALUES (NEW.user_id, NEW.id, 'progress_updated', NEW.current_progress);
    END IF;
    
    IF OLD.status != NEW.status AND NEW.status = 'completed' THEN
      INSERT INTO public.quest_analytics (user_id, quest_id, event_type, progress_value)
      VALUES (NEW.user_id, NEW.id, 'completed', NEW.current_progress);
    END IF;
    
    IF OLD.status != NEW.status AND NEW.status = 'expired' THEN
      INSERT INTO public.quest_analytics (user_id, quest_id, event_type, progress_value)
      VALUES (NEW.user_id, NEW.id, 'expired', NEW.current_progress);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for quest analytics logging
DROP TRIGGER IF EXISTS trigger_log_quest_event ON public.user_quests;
CREATE TRIGGER trigger_log_quest_event
  AFTER INSERT OR UPDATE ON public.user_quests
  FOR EACH ROW
  EXECUTE FUNCTION log_quest_event();

-- Comments for documentation
COMMENT ON TABLE public.user_quests IS 'Stores user-assigned quests generated by OpenAI with progress tracking';
COMMENT ON TABLE public.quest_analytics IS 'Tracks quest lifecycle events for analytics and reporting';
COMMENT ON FUNCTION expire_old_quests() IS 'Automatically expires quests past their expiration date';
COMMENT ON FUNCTION log_quest_event() IS 'Logs quest lifecycle events to analytics table';
