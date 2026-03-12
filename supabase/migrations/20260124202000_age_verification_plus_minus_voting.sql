-- =====================================================
-- AGE VERIFICATION & PLUS-MINUS VOTING MIGRATION
-- Timestamp: 20260124202000
-- =====================================================

-- Add Plus-Minus to voting_type enum
ALTER TYPE voting_type ADD VALUE IF NOT EXISTS 'Plus-Minus';

-- Add age verification columns to elections table
ALTER TABLE elections ADD COLUMN IF NOT EXISTS age_verification_required BOOLEAN DEFAULT false;
ALTER TABLE elections ADD COLUMN IF NOT EXISTS age_verification_methods JSONB DEFAULT '[]'::jsonb;
ALTER TABLE elections ADD COLUMN IF NOT EXISTS min_age_requirement INTEGER DEFAULT 18;
ALTER TABLE elections ADD COLUMN IF NOT EXISTS waterfall_verification BOOLEAN DEFAULT true;
ALTER TABLE elections ADD COLUMN IF NOT EXISTS biometric_required BOOLEAN DEFAULT false;

-- Add Plus-Minus voting score column to votes table
ALTER TABLE votes ADD COLUMN IF NOT EXISTS vote_scores JSONB DEFAULT '{}'::jsonb;

-- Create age_verification_records table
CREATE TABLE IF NOT EXISTS age_verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  verification_method TEXT NOT NULL CHECK (verification_method IN ('ai_facial', 'government_id', 'biometric', 'digital_wallet')),
  verification_status TEXT NOT NULL CHECK (verification_status IN ('pending', 'verified', 'failed', 'borderline')),
  confidence_score DECIMAL(5,2),
  estimated_age INTEGER,
  age_range_min INTEGER,
  age_range_max INTEGER,
  document_type TEXT,
  document_authenticity_score DECIMAL(5,2),
  liveness_check_passed BOOLEAN,
  biometric_match_score DECIMAL(5,2),
  fallback_triggered BOOLEAN DEFAULT false,
  data_deleted_at TIMESTAMPTZ,
  verification_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create digital_identity_wallets table (ISO 27001 compliant)
CREATE TABLE IF NOT EXISTS digital_identity_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  wallet_provider TEXT NOT NULL CHECK (wallet_provider IN ('yoti', 'agekey', 'ondato', 'internal')),
  wallet_token TEXT NOT NULL,
  encrypted_credentials TEXT NOT NULL,
  age_verified BOOLEAN DEFAULT false,
  verified_age_range TEXT,
  verification_date TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ,
  reusable BOOLEAN DEFAULT true,
  privacy_level TEXT DEFAULT 'minimal' CHECK (privacy_level IN ('minimal', 'standard', 'enhanced')),
  selective_disclosure_enabled BOOLEAN DEFAULT true,
  audit_trail JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create age_verification_audit_logs table (ISO 27001 compliance)
CREATE TABLE IF NOT EXISTS age_verification_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID REFERENCES age_verification_records(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create plus_minus_vote_analytics table
CREATE TABLE IF NOT EXISTS plus_minus_vote_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  option_id UUID REFERENCES election_options(id) ON DELETE CASCADE,
  positive_votes INTEGER DEFAULT 0,
  neutral_votes INTEGER DEFAULT 0,
  negative_votes INTEGER DEFAULT 0,
  weighted_score DECIMAL(10,2) DEFAULT 0,
  sentiment_distribution JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(election_id, option_id)
);

-- Create presentation slides table
CREATE TABLE IF NOT EXISTS presentation_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  created_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  slide_order INTEGER DEFAULT 0,
  media_url TEXT,
  media_type TEXT DEFAULT 'none' CHECK (media_type IN ('none', 'image', 'video', 'poll', 'voting')),
  animations JSONB DEFAULT '{}'::jsonb,
  interactive_elements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audience questions table
CREATE TABLE IF NOT EXISTS audience_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  moderated_by UUID REFERENCES user_profiles(id),
  moderated_at TIMESTAMPTZ,
  moderator_notes TEXT,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add allow_audience_questions column to elections
ALTER TABLE elections ADD COLUMN IF NOT EXISTS allow_audience_questions BOOLEAN DEFAULT false;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_age_verification_user ON age_verification_records(user_id);
CREATE INDEX IF NOT EXISTS idx_age_verification_election ON age_verification_records(election_id);
CREATE INDEX IF NOT EXISTS idx_age_verification_status ON age_verification_records(verification_status);
CREATE INDEX IF NOT EXISTS idx_digital_wallet_user ON digital_identity_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_plus_minus_analytics_election ON plus_minus_vote_analytics(election_id);
CREATE INDEX IF NOT EXISTS idx_presentation_slides_election ON presentation_slides(election_id);
CREATE INDEX IF NOT EXISTS idx_presentation_slides_order ON presentation_slides(election_id, slide_order);
CREATE INDEX IF NOT EXISTS idx_audience_questions_election ON audience_questions(election_id);
CREATE INDEX IF NOT EXISTS idx_audience_questions_status ON audience_questions(moderation_status);

-- RLS Policies for age_verification_records
ALTER TABLE age_verification_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verification records"
  ON age_verification_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verification records"
  ON age_verification_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all verification records"
  ON age_verification_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for digital_identity_wallets
ALTER TABLE digital_identity_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet"
  ON digital_identity_wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet"
  ON digital_identity_wallets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON digital_identity_wallets FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for age_verification_audit_logs
ALTER TABLE age_verification_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON age_verification_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for plus_minus_vote_analytics
ALTER TABLE plus_minus_vote_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plus-minus analytics"
  ON plus_minus_vote_analytics FOR SELECT
  USING (true);

CREATE POLICY "System can update plus-minus analytics"
  ON plus_minus_vote_analytics FOR ALL
  USING (true);

-- RLS Policies for presentation_slides
ALTER TABLE presentation_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view slides for elections they have access to"
  ON presentation_slides FOR SELECT
  USING (true);

CREATE POLICY "Creators can insert own slides"
  ON presentation_slides FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update own slides"
  ON presentation_slides FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete own slides"
  ON presentation_slides FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for audience_questions
ALTER TABLE audience_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approved questions"
  ON audience_questions FOR SELECT
  USING (
    moderation_status = 'approved' OR
    auth.uid() = submitted_by OR
    EXISTS (
      SELECT 1 FROM elections
      WHERE id = election_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can submit questions"
  ON audience_questions FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Election creators can moderate questions"
  ON audience_questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM elections
      WHERE id = election_id AND created_by = auth.uid()
    )
  );

-- Function to auto-delete temporary verification data after 24 hours
CREATE OR REPLACE FUNCTION auto_delete_verification_data()
RETURNS void AS $$
BEGIN
  UPDATE age_verification_records
  SET 
    verification_metadata = '{}'::jsonb,
    data_deleted_at = NOW()
  WHERE 
    created_at < NOW() - INTERVAL '24 hours'
    AND data_deleted_at IS NULL
    AND verification_status IN ('verified', 'failed');
END;
$$ LANGUAGE plpgsql;

-- Function to update plus-minus vote analytics
CREATE OR REPLACE FUNCTION update_plus_minus_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update analytics when vote is cast
  IF TG_OP = 'INSERT' THEN
    -- Process vote_scores JSONB to update analytics
    INSERT INTO plus_minus_vote_analytics (election_id, option_id, positive_votes, neutral_votes, negative_votes, weighted_score)
    SELECT 
      NEW.election_id,
      (jsonb_each_text(NEW.vote_scores)).key::UUID,
      CASE WHEN (jsonb_each_text(NEW.vote_scores)).value = '1' THEN 1 ELSE 0 END,
      CASE WHEN (jsonb_each_text(NEW.vote_scores)).value = '0' THEN 1 ELSE 0 END,
      CASE WHEN (jsonb_each_text(NEW.vote_scores)).value = '-1' THEN 1 ELSE 0 END,
      (jsonb_each_text(NEW.vote_scores)).value::INTEGER
    FROM jsonb_each_text(NEW.vote_scores)
    ON CONFLICT (election_id, option_id) DO UPDATE
    SET 
      positive_votes = plus_minus_vote_analytics.positive_votes + EXCLUDED.positive_votes,
      neutral_votes = plus_minus_vote_analytics.neutral_votes + EXCLUDED.neutral_votes,
      negative_votes = plus_minus_vote_analytics.negative_votes + EXCLUDED.negative_votes,
      weighted_score = plus_minus_vote_analytics.weighted_score + EXCLUDED.weighted_score,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for plus-minus vote analytics
DROP TRIGGER IF EXISTS trigger_update_plus_minus_analytics ON votes;
CREATE TRIGGER trigger_update_plus_minus_analytics
  AFTER INSERT ON votes
  FOR EACH ROW
  WHEN (NEW.vote_scores IS NOT NULL AND NEW.vote_scores != '{}'::jsonb)
  EXECUTE FUNCTION update_plus_minus_analytics();

DO $$
BEGIN
  RAISE NOTICE 'Age verification and Plus-Minus voting migration completed successfully';
END $$;