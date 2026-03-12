-- Creator feedback for ML model training (Connect, payout disputes, etc.)
CREATE TABLE IF NOT EXISTS creator_feedback_for_training (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  source text NOT NULL DEFAULT 'stripe_connect',
  feedback_type text NOT NULL DEFAULT 'payout_dispute',
  content jsonb,
  label text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creator_feedback_creator ON creator_feedback_for_training(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_feedback_source ON creator_feedback_for_training(source);
CREATE INDEX IF NOT EXISTS idx_creator_feedback_created ON creator_feedback_for_training(created_at DESC);

ALTER TABLE creator_feedback_for_training ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can insert own feedback"
  ON creator_feedback_for_training FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Admins and service can read all"
  ON creator_feedback_for_training FOR SELECT
  USING (
    auth.uid() = creator_id
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
