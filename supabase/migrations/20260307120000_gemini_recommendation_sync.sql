-- Gemini Recommendation Sync (replaces Shaped AI)
-- Adds recommendation_synced_at to votes and recommendation_sync_logs table for Gemini-based sync.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'recommendation_synced_at') THEN
    ALTER TABLE votes ADD COLUMN recommendation_synced_at TIMESTAMPTZ;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_votes_recommendation_synced ON votes(recommendation_synced_at) WHERE recommendation_synced_at IS NULL;

CREATE TABLE IF NOT EXISTS recommendation_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  events_processed INTEGER DEFAULT 0,
  duration INTEGER,
  status TEXT CHECK (status IN ('success', 'failed', 'partial')),
  provider TEXT DEFAULT 'gemini',
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommendation_sync_logs_created ON recommendation_sync_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendation_sync_logs_provider ON recommendation_sync_logs(provider);
