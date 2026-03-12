-- Add creator_can_see_totals to elections (creator choice to see or hide vote totals during election)
ALTER TABLE public.elections
  ADD COLUMN IF NOT EXISTS creator_can_see_totals BOOLEAN DEFAULT true;

COMMENT ON COLUMN public.elections.creator_can_see_totals IS 'When true, the election creator can view live vote totals while the election is open; can be toggled mid-election.';
