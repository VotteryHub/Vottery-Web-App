-- User Feedback Portal: Feature Requests, Voting, and Implementation Tracking
-- Migration: 20260204164200_user_feedback_feature_requests.sql

-- Feature Requests Table
CREATE TABLE IF NOT EXISTS public.feature_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('elections', 'analytics', 'payments', 'security', 'ai', 'communication', 'gamification', 'other')),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'planned', 'in_progress', 'implemented', 'rejected')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  vote_count INTEGER DEFAULT 0,
  implementation_date TIMESTAMPTZ,
  rejection_reason TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature Votes Table
CREATE TABLE IF NOT EXISTS public.feature_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_request_id UUID NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feature_request_id, user_id)
);

-- Feature Implementation Notifications Table
CREATE TABLE IF NOT EXISTS public.feature_implementation_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_request_id UUID NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('status_change', 'implementation_complete', 'comment_added')),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature Comments Table
CREATE TABLE IF NOT EXISTS public.feature_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_request_id UUID NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post-Launch Engagement Tracking Table
CREATE TABLE IF NOT EXISTS public.feature_engagement_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_request_id UUID NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  engagement_type TEXT NOT NULL CHECK (engagement_type IN ('first_use', 'daily_use', 'feedback_submitted', 'rating_given')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_feature_requests_user_id ON public.feature_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_requests_status ON public.feature_requests(status);
CREATE INDEX IF NOT EXISTS idx_feature_requests_category ON public.feature_requests(category);
CREATE INDEX IF NOT EXISTS idx_feature_requests_vote_count ON public.feature_requests(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_feature_requests_created_at ON public.feature_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feature_votes_feature_request_id ON public.feature_votes(feature_request_id);
CREATE INDEX IF NOT EXISTS idx_feature_votes_user_id ON public.feature_votes(user_id);

CREATE INDEX IF NOT EXISTS idx_feature_notifications_user_id ON public.feature_implementation_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_notifications_read ON public.feature_implementation_notifications(read);

CREATE INDEX IF NOT EXISTS idx_feature_comments_feature_request_id ON public.feature_comments(feature_request_id);
CREATE INDEX IF NOT EXISTS idx_feature_engagement_feature_request_id ON public.feature_engagement_tracking(feature_request_id);

-- RLS Policies
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_implementation_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_engagement_tracking ENABLE ROW LEVEL SECURITY;

-- Feature Requests Policies
CREATE POLICY "Users can view all feature requests"
  ON public.feature_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create feature requests"
  ON public.feature_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feature requests"
  ON public.feature_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Feature Votes Policies
CREATE POLICY "Users can view all votes"
  ON public.feature_votes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create votes"
  ON public.feature_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON public.feature_votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON public.feature_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON public.feature_implementation_notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.feature_implementation_notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Comments Policies
CREATE POLICY "Users can view all comments"
  ON public.feature_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON public.feature_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.feature_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Engagement Tracking Policies
CREATE POLICY "Users can view engagement tracking"
  ON public.feature_engagement_tracking FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create engagement tracking"
  ON public.feature_engagement_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to update vote count
CREATE OR REPLACE FUNCTION update_feature_request_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feature_requests
    SET vote_count = vote_count + CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END,
        updated_at = NOW()
    WHERE id = NEW.feature_request_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.feature_requests
    SET vote_count = vote_count + CASE WHEN NEW.vote_type = 'upvote' THEN 2 ELSE -2 END,
        updated_at = NOW()
    WHERE id = NEW.feature_request_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feature_requests
    SET vote_count = vote_count - CASE WHEN OLD.vote_type = 'upvote' THEN 1 ELSE -1 END,
        updated_at = NOW()
    WHERE id = OLD.feature_request_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for vote count updates
DROP TRIGGER IF EXISTS trigger_update_vote_count ON public.feature_votes;
CREATE TRIGGER trigger_update_vote_count
  AFTER INSERT OR UPDATE OR DELETE ON public.feature_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_request_vote_count();

-- Function to create notifications on status change
CREATE OR REPLACE FUNCTION notify_feature_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.feature_implementation_notifications (feature_request_id, user_id, notification_type, message)
    VALUES (
      NEW.id,
      NEW.user_id,
      CASE WHEN NEW.status = 'implemented' THEN 'implementation_complete' ELSE 'status_change' END,
      'Your feature request "' || NEW.title || '" status changed to: ' || NEW.status
    );
    
    -- Notify all voters
    INSERT INTO public.feature_implementation_notifications (feature_request_id, user_id, notification_type, message)
    SELECT 
      NEW.id,
      fv.user_id,
      CASE WHEN NEW.status = 'implemented' THEN 'implementation_complete' ELSE 'status_change' END,
      'Feature request "' || NEW.title || '" status changed to: ' || NEW.status
    FROM public.feature_votes fv
    WHERE fv.feature_request_id = NEW.id AND fv.user_id != NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for status change notifications
DROP TRIGGER IF EXISTS trigger_notify_status_change ON public.feature_requests;
CREATE TRIGGER trigger_notify_status_change
  AFTER UPDATE ON public.feature_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_feature_status_change();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_feature_requests_updated_at ON public.feature_requests;
CREATE TRIGGER update_feature_requests_updated_at
  BEFORE UPDATE ON public.feature_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_feature_comments_updated_at ON public.feature_comments;
CREATE TRIGGER update_feature_comments_updated_at
  BEFORE UPDATE ON public.feature_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.feature_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feature_votes TO authenticated;
GRANT SELECT, UPDATE ON public.feature_implementation_notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.feature_comments TO authenticated;
GRANT SELECT, INSERT ON public.feature_engagement_tracking TO authenticated;

-- Analyze tables for query optimization
ANALYZE public.feature_requests;
ANALYZE public.feature_votes;
ANALYZE public.feature_implementation_notifications;
ANALYZE public.feature_comments;
ANALYZE public.feature_engagement_tracking;