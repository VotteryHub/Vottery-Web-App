-- Election Predictions Table for Prediction Pools
-- Migration: 20260228000000_election_predictions_table.sql

DO $$ BEGIN
  -- Create election_predictions table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.election_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    election_id UUID NOT NULL,
    predictions JSONB NOT NULL DEFAULT '{}',
    brier_score DECIMAL(10, 6),
    vp_awarded INTEGER DEFAULT 0,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
EXCEPTION WHEN duplicate_table THEN
  NULL;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_election_predictions_user_id ON public.election_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_election_predictions_election_id ON public.election_predictions(election_id);
CREATE INDEX IF NOT EXISTS idx_election_predictions_brier_score ON public.election_predictions(brier_score ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_election_predictions_created_at ON public.election_predictions(created_at DESC);

-- Enable RLS
ALTER TABLE public.election_predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
  CREATE POLICY "Users can view all predictions"
    ON public.election_predictions FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own predictions"
    ON public.election_predictions FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own predictions"
    ON public.election_predictions FOR UPDATE
    USING (auth.uid() = user_id AND is_resolved = FALSE);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
