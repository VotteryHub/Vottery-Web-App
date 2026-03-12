-- Feature analytics for Security Feature Adoption (Voter Education Hub, Blockchain Verification)
CREATE TABLE IF NOT EXISTS feature_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  adoption_rate numeric DEFAULT 0,
  engagement_metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feature_analytics_feature ON feature_analytics(feature_id);
CREATE INDEX IF NOT EXISTS idx_feature_analytics_created ON feature_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feature_analytics_user ON feature_analytics(user_id);

ALTER TABLE feature_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own analytics"
  ON feature_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users and admins can read"
  ON feature_analytics FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR EXISTS (SELECT 1 FROM user_profiles up WHERE up.id = auth.uid() AND up.role IN ('admin', 'super_admin'))
  );
