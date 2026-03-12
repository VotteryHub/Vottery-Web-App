-- Social shares tracking table
CREATE TABLE IF NOT EXISTS social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  platform TEXT NOT NULL,
  share_url TEXT NOT NULL,
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emoji reactions table
CREATE TABLE IF NOT EXISTS emoji_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id, emoji)
);

-- Add comments_enabled column to elections
ALTER TABLE elections ADD COLUMN IF NOT EXISTS comments_enabled BOOLEAN DEFAULT true;

-- Add comments_enabled column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS comments_enabled BOOLEAN DEFAULT true;

-- Add vote_visibility column to elections (if not exists)
ALTER TABLE elections ADD COLUMN IF NOT EXISTS vote_visibility TEXT DEFAULT 'visible';
ALTER TABLE elections ADD COLUMN IF NOT EXISTS vote_visibility_changed_at TIMESTAMPTZ;

-- Add reputation tracking columns to user_profiles (if not exists)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS prizes_delivered INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS prizes_failed INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_blacklisted BOOLEAN DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS blacklist_reason TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS blacklisted_at TIMESTAMPTZ;

-- Add winner notification tracking to elections
ALTER TABLE elections ADD COLUMN IF NOT EXISTS winners_announced BOOLEAN DEFAULT false;
ALTER TABLE elections ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMPTZ;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_shares_content ON social_shares(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_social_shares_user ON social_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_content ON comments(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_emoji_reactions_content ON emoji_reactions(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_emoji_reactions_user ON emoji_reactions(user_id);

-- RLS Policies for social_shares
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all shares"
  ON social_shares FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own shares"
  ON social_shares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for emoji_reactions
ALTER TABLE emoji_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all reactions"
  ON emoji_reactions FOR SELECT
  USING (true);

CREATE POLICY "Users can create reactions"
  ON emoji_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
  ON emoji_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Function to increment comment count
CREATE OR REPLACE FUNCTION increment_comment_count(table_name TEXT, row_id UUID)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE %I SET comments = COALESCE(comments, 0) + 1 WHERE id = $1', table_name)
  USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement comment count
CREATE OR REPLACE FUNCTION decrement_comment_count(table_name TEXT, row_id UUID)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE %I SET comments = GREATEST(COALESCE(comments, 0) - 1, 0) WHERE id = $1', table_name)
  USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment share count
CREATE OR REPLACE FUNCTION increment_share_count(table_name TEXT, row_id UUID)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE %I SET shares = COALESCE(shares, 0) + 1 WHERE id = $1', table_name)
  USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update prize distribution status and reputation
CREATE OR REPLACE FUNCTION update_creator_reputation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    -- Increment prizes_delivered and reputation_score
    UPDATE user_profiles
    SET 
      prizes_delivered = COALESCE(prizes_delivered, 0) + 1,
      reputation_score = COALESCE(reputation_score, 0) + 10
    WHERE id = (SELECT created_by FROM elections WHERE id = NEW.election_id);
  ELSIF NEW.status = 'disputed' AND OLD.status != 'disputed' THEN
    -- Increment prizes_failed and decrease reputation_score
    UPDATE user_profiles
    SET 
      prizes_failed = COALESCE(prizes_failed, 0) + 1,
      reputation_score = GREATEST(COALESCE(reputation_score, 0) - 50, 0)
    WHERE id = (SELECT created_by FROM elections WHERE id = NEW.election_id);
    
    -- Auto-blacklist if 3+ failed prizes
    UPDATE user_profiles
    SET 
      is_blacklisted = true,
      blacklist_reason = 'Multiple prize delivery failures',
      blacklisted_at = NOW()
    WHERE id = (SELECT created_by FROM elections WHERE id = NEW.election_id)
      AND prizes_failed >= 3
      AND is_blacklisted = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prize_distribution_reputation_trigger
  AFTER UPDATE ON prize_distributions
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_creator_reputation();

-- Notification for comments
CREATE OR REPLACE FUNCTION notify_comment_created()
RETURNS TRIGGER AS $$
DECLARE
  content_creator_id UUID;
BEGIN
  -- Get content creator ID
  IF NEW.content_type = 'election' THEN
    SELECT created_by INTO content_creator_id FROM elections WHERE id = NEW.content_id;
  ELSIF NEW.content_type = 'post' THEN
    SELECT user_id INTO content_creator_id FROM posts WHERE id = NEW.content_id;
  END IF;
  
  -- Create notification for content creator (if not self-comment)
  IF content_creator_id IS NOT NULL AND content_creator_id != NEW.user_id THEN
    INSERT INTO activity_feed (user_id, actor_id, activity_type, title, description, reference_id)
    VALUES (
      content_creator_id,
      NEW.user_id,
      'comment_received',
      'New Comment',
      'Someone commented on your content',
      NEW.content_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_notification_trigger
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_comment_created();