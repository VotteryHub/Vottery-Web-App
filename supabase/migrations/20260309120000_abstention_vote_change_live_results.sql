-- Abstention tracking source, live results lock, vote change audit markers
-- Run after elections and vote_abstentions / vote_edit_history exist

-- 1. vote_abstentions: add source to distinguish explicit vs viewed_no_vote
ALTER TABLE public.vote_abstentions
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'viewed_no_vote'
  CHECK (source IN ('viewed_no_vote', 'explicit'));

-- 2. elections: live_results_locked_at (once show_live_results is true, cannot revert)
ALTER TABLE public.elections
  ADD COLUMN IF NOT EXISTS live_results_locked_at TIMESTAMPTZ;

-- 3. vote_audit_markers: when vote change is not allowed but user attempted change
CREATE TABLE IF NOT EXISTS public.vote_audit_markers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL DEFAULT 'vote_change_attempt_disallowed',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vote_audit_markers_election ON public.vote_audit_markers(election_id);
CREATE INDEX IF NOT EXISTS idx_vote_audit_markers_user ON public.vote_audit_markers(user_id);

ALTER TABLE public.vote_audit_markers ENABLE ROW LEVEL SECURITY;

-- Creators see audit markers for their elections; admins see all
DROP POLICY IF EXISTS "vote_audit_markers_creator_admin" ON public.vote_audit_markers;
CREATE POLICY "vote_audit_markers_creator_admin" ON public.vote_audit_markers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.elections e WHERE e.id = election_id AND e.created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.role = 'admin')
  );

-- Service role / backend can insert (voters never read this table from client)
DROP POLICY IF EXISTS "vote_audit_markers_insert_authenticated" ON public.vote_audit_markers;
CREATE POLICY "vote_audit_markers_insert_authenticated" ON public.vote_audit_markers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 4. vote_abstentions: user can view own; creator and admin can view for reports
DROP POLICY IF EXISTS "Users can view own abstentions" ON public.vote_abstentions;
CREATE POLICY "vote_abstentions_select_own_creator_admin" ON public.vote_abstentions
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.elections e WHERE e.id = election_id AND e.created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.role = 'admin')
  );

-- 5. vote_edit_history: voter sees own; creator sees and can approve/reject for their elections
DROP POLICY IF EXISTS "Users can view own edit history" ON public.vote_edit_history;
CREATE POLICY "vote_edit_history_select_own_or_creator" ON public.vote_edit_history
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.elections e WHERE e.id = election_id AND e.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "vote_edit_history_creator_update" ON public.vote_edit_history;
CREATE POLICY "vote_edit_history_creator_update" ON public.vote_edit_history
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.elections e WHERE e.id = election_id AND e.created_by = auth.uid())
  );
