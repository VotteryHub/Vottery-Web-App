-- Social Feed Stabilization Migration
-- Timestamp: 20260414000000
-- Description: Unified posts schema, nested comments, and Brand/Agency restrictions

-- 1. CLEAN UP CONFUSING TABLES
DROP TABLE IF EXISTS public.social_posts CASCADE;

-- 2. UPDATE USER ROLES ENUM
-- We need to add the missing roles if they aren't there
DO $$ BEGIN
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'creator';
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'brand';
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'agency';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. ENHANCE POSTS TABLE
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS election_id UUID REFERENCES public.elections(id) ON DELETE SET NULL;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS ad_campaign_id UUID; -- Can be linked to a specific campaign system later
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT FALSE;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published'; -- 'draft', 'published', 'flagged'

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_posts_election_id ON public.posts(election_id);
CREATE INDEX IF NOT EXISTS idx_posts_is_sponsored ON public.posts(is_sponsored);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- 4. ENHANCE COMMENTS TABLE
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- Add index for threading
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);

-- 5. COUNTER SYNCHRONIZATION TRIGGERS
-- Function to sync comment counts
CREATE OR REPLACE FUNCTION public.sync_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.content_type = 'post' THEN
            UPDATE public.posts SET comments = comments + 1 WHERE id = NEW.content_id;
        ELSIF NEW.content_type = 'election' THEN
            UPDATE public.elections SET comments_enabled = true WHERE id = NEW.content_id; -- Just ensures it's reachable
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.content_type = 'post' THEN
            UPDATE public.posts SET comments = GREATEST(0, comments - 1) WHERE id = OLD.content_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_comment_counts ON public.comments;
CREATE TRIGGER trigger_sync_comment_counts
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.sync_comment_counts();

-- 6. RLS POLICIES

-- Ensure RLS is on
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Reset Posts Policies
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
CREATE POLICY "Anyone can view posts" ON public.posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
CREATE POLICY "Brand and Agency must link posts to election or campaign"
ON public.posts FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) AND
  (
    -- 1. Check if user is NOT brand/agency
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND (role NOT IN ('brand', 'agency'))
    )
    OR
    -- 2. If they ARE brand/agency, they MUST provide an election_id or ad_campaign_id
    (election_id IS NOT NULL OR ad_campaign_id IS NOT NULL)
  )
);

DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Reset Comments Policies
DROP POLICY IF EXISTS "Users can view all comments" ON public.comments;
CREATE POLICY "Users can view all comments" ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);
