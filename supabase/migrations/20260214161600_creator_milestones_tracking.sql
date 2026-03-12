-- Creator Milestones Tracking Table
CREATE TABLE IF NOT EXISTS public.creator_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_creator_milestones_creator_id ON public.creator_milestones(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_milestones_amount ON public.creator_milestones(amount);

-- RLS Policies
ALTER TABLE public.creator_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their milestones" ON public.creator_milestones FOR SELECT USING (creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()));
CREATE POLICY "System creates milestones" ON public.creator_milestones FOR INSERT WITH CHECK (true);