-- Support tickets: schema referenced by RLS in 20260228100000_security_advisor_fixes.sql
-- (policies apply only if the table exists; this migration creates it on fresh installs.)

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL UNIQUE DEFAULT (
    'TKT-' || to_char(timezone('utc', now()), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6))
  ),
  type TEXT NOT NULL DEFAULT 'general',
  subject TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to_id UUID,
  assigned_to_name TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  response_time_minutes INT DEFAULT 0,
  sla_status TEXT DEFAULT 'on_track',
  satisfaction_rating INT,
  resolution_time_minutes INT,
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT support_tickets_priority_chk CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  CONSTRAINT support_tickets_status_chk CHECK (status IN ('open', 'in_progress', 'resolved', 'escalated', 'closed'))
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at DESC);

CREATE OR REPLACE FUNCTION public.support_tickets_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE PROCEDURE public.support_tickets_set_updated_at();

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "support_tickets_select" ON public.support_tickets;
DROP POLICY IF EXISTS "support_tickets_insert" ON public.support_tickets;
DROP POLICY IF EXISTS "support_tickets_update" ON public.support_tickets;

CREATE POLICY "support_tickets_select" ON public.support_tickets
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_moderator());

CREATE POLICY "support_tickets_insert" ON public.support_tickets
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "support_tickets_update" ON public.support_tickets
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_moderator())
  WITH CHECK (user_id = auth.uid() OR public.is_moderator());
