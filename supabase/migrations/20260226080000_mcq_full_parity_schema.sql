-- MCQ Full Parity Schema Migration
-- Adds all missing tables and fields for Flutter/React MCQ feature parity

-- Add missing columns to elections table
ALTER TABLE public.elections
  ADD COLUMN IF NOT EXISTS require_mcq BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS mcq_passing_score_percentage INTEGER DEFAULT 70,
  ADD COLUMN IF NOT EXISTS mcq_max_attempts INTEGER DEFAULT 3;

-- Add missing columns to election_mcq_questions table
ALTER TABLE public.election_mcq_questions
  ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'multiple_choice',
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS question_image_url TEXT,
  ADD COLUMN IF NOT EXISTS char_limit INTEGER DEFAULT 500;

-- voter_mcq_responses table (renamed from user_mcq_responses)
CREATE TABLE IF NOT EXISTS public.voter_mcq_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID,
  selected_answer TEXT,
  is_correct BOOLEAN,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(election_id, voter_id, question_id)
);

-- voter_mcq_attempts table
CREATE TABLE IF NOT EXISTS public.voter_mcq_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  score_percentage NUMERIC(5,2),
  passed BOOLEAN DEFAULT FALSE,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- voter_free_text_responses table
CREATE TABLE IF NOT EXISTS public.voter_free_text_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID,
  answer_text TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(election_id, voter_id, question_id)
);

-- live_question_injection_queue table
CREATE TABLE IF NOT EXISTS public.live_question_injection_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer TEXT,
  question_type TEXT DEFAULT 'multiple_choice',
  scheduled_for TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'broadcasted', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  broadcasted_at TIMESTAMPTZ
);

-- Ensure created_by column exists (handles tables created before this column was added)
ALTER TABLE public.live_question_injection_queue
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- live_question_broadcasts table
CREATE TABLE IF NOT EXISTS public.live_question_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
  injection_id UUID REFERENCES public.live_question_injection_queue(id) ON DELETE CASCADE,
  question_text TEXT,
  options JSONB DEFAULT '[]'::jsonb,
  broadcasted_at TIMESTAMPTZ DEFAULT NOW(),
  total_voters INTEGER DEFAULT 0
);

-- live_question_response_analytics table
CREATE TABLE IF NOT EXISTS public.live_question_response_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
  broadcast_id UUID REFERENCES public.live_question_broadcasts(id) ON DELETE CASCADE,
  total_responses INTEGER DEFAULT 0,
  response_rate NUMERIC(5,4) DEFAULT 0,
  answer_distribution JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- mcq_option_image_metadata table
CREATE TABLE IF NOT EXISTS public.mcq_option_image_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
  question_id UUID,
  option_index INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(election_id, question_id, option_index)
);

-- Ensure uploaded_by column exists on mcq_option_image_metadata (handles pre-existing tables without this column)
ALTER TABLE public.mcq_option_image_metadata
  ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id);

-- mcq_image_gallery_exports table
CREATE TABLE IF NOT EXISTS public.mcq_image_gallery_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
  exported_by UUID REFERENCES auth.users(id),
  export_data JSONB DEFAULT '{}'::jsonb,
  exported_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure exported_by column exists on mcq_image_gallery_exports (handles pre-existing tables without this column)
ALTER TABLE public.mcq_image_gallery_exports
  ADD COLUMN IF NOT EXISTS exported_by UUID REFERENCES auth.users(id);

-- RLS Policies
ALTER TABLE public.voter_mcq_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voter_mcq_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voter_free_text_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_question_injection_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_question_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_question_response_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcq_option_image_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcq_image_gallery_exports ENABLE ROW LEVEL SECURITY;

-- voter_mcq_responses policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'voter_mcq_responses' AND policyname = 'voter_mcq_responses_select') THEN
    CREATE POLICY voter_mcq_responses_select ON public.voter_mcq_responses FOR SELECT USING (auth.uid() = voter_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'voter_mcq_responses' AND policyname = 'voter_mcq_responses_insert') THEN
    CREATE POLICY voter_mcq_responses_insert ON public.voter_mcq_responses FOR INSERT WITH CHECK (auth.uid() = voter_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'voter_mcq_responses' AND policyname = 'voter_mcq_responses_upsert') THEN
    CREATE POLICY voter_mcq_responses_upsert ON public.voter_mcq_responses FOR UPDATE USING (auth.uid() = voter_id);
  END IF;
END $$;

-- voter_mcq_attempts policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'voter_mcq_attempts' AND policyname = 'voter_mcq_attempts_select') THEN
    CREATE POLICY voter_mcq_attempts_select ON public.voter_mcq_attempts FOR SELECT USING (auth.uid() = voter_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'voter_mcq_attempts' AND policyname = 'voter_mcq_attempts_insert') THEN
    CREATE POLICY voter_mcq_attempts_insert ON public.voter_mcq_attempts FOR INSERT WITH CHECK (auth.uid() = voter_id);
  END IF;
END $$;

-- voter_free_text_responses policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'voter_free_text_responses' AND policyname = 'voter_free_text_responses_select') THEN
    CREATE POLICY voter_free_text_responses_select ON public.voter_free_text_responses FOR SELECT USING (auth.uid() = voter_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'voter_free_text_responses' AND policyname = 'voter_free_text_responses_insert') THEN
    CREATE POLICY voter_free_text_responses_insert ON public.voter_free_text_responses FOR INSERT WITH CHECK (auth.uid() = voter_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'voter_free_text_responses' AND policyname = 'voter_free_text_responses_upsert') THEN
    CREATE POLICY voter_free_text_responses_upsert ON public.voter_free_text_responses FOR UPDATE USING (auth.uid() = voter_id);
  END IF;
END $$;

-- live_question_injection_queue policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'live_question_injection_queue' AND policyname = 'live_injection_queue_select') THEN
    CREATE POLICY live_injection_queue_select ON public.live_question_injection_queue FOR SELECT USING (TRUE);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'live_question_injection_queue' AND policyname = 'live_injection_queue_insert') THEN
    CREATE POLICY live_injection_queue_insert ON public.live_question_injection_queue FOR INSERT WITH CHECK (auth.uid() = created_by);
  END IF;
END $$;

-- live_question_broadcasts policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'live_question_broadcasts' AND policyname = 'live_broadcasts_select') THEN
    CREATE POLICY live_broadcasts_select ON public.live_question_broadcasts FOR SELECT USING (TRUE);
  END IF;
END $$;

-- live_question_response_analytics policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'live_question_response_analytics' AND policyname = 'live_response_analytics_select') THEN
    CREATE POLICY live_response_analytics_select ON public.live_question_response_analytics FOR SELECT USING (TRUE);
  END IF;
END $$;

-- mcq_option_image_metadata policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_option_image_metadata' AND policyname = 'mcq_option_images_select') THEN
    CREATE POLICY mcq_option_images_select ON public.mcq_option_image_metadata FOR SELECT USING (TRUE);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_option_image_metadata' AND policyname = 'mcq_option_images_insert') THEN
    CREATE POLICY mcq_option_images_insert ON public.mcq_option_image_metadata FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_option_image_metadata' AND policyname = 'mcq_option_images_upsert') THEN
    CREATE POLICY mcq_option_images_upsert ON public.mcq_option_image_metadata FOR UPDATE USING (auth.uid() = uploaded_by);
  END IF;
END $$;

-- mcq_image_gallery_exports policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_image_gallery_exports' AND policyname = 'mcq_gallery_exports_select') THEN
    CREATE POLICY mcq_gallery_exports_select ON public.mcq_image_gallery_exports FOR SELECT USING (auth.uid() = exported_by);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcq_image_gallery_exports' AND policyname = 'mcq_gallery_exports_insert') THEN
    CREATE POLICY mcq_gallery_exports_insert ON public.mcq_image_gallery_exports FOR INSERT WITH CHECK (auth.uid() = exported_by);
  END IF;
END $$;

-- Stored procedure: broadcast_live_question
CREATE OR REPLACE FUNCTION public.broadcast_live_question(p_injection_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_injection RECORD;
  v_broadcast_id UUID;
BEGIN
  SELECT * INTO v_injection FROM public.live_question_injection_queue WHERE id = p_injection_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Injection not found');
  END IF;

  INSERT INTO public.live_question_broadcasts (election_id, injection_id, question_text, options, broadcasted_at)
  VALUES (v_injection.election_id, p_injection_id, v_injection.question_text, v_injection.options, NOW())
  RETURNING id INTO v_broadcast_id;

  UPDATE public.live_question_injection_queue
  SET status = 'broadcasted', broadcasted_at = NOW()
  WHERE id = p_injection_id;

  RETURN jsonb_build_object('success', true, 'broadcast_id', v_broadcast_id);
END;
$$;

-- Stored procedure: calculate_mcq_score
CREATE OR REPLACE FUNCTION public.calculate_mcq_score(
  p_voter_id UUID,
  p_election_id UUID,
  p_attempt_number INTEGER DEFAULT 1
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total INTEGER := 0;
  v_correct INTEGER := 0;
  v_score_pct NUMERIC(5,2) := 0;
  v_passing_score INTEGER := 70;
  v_passed BOOLEAN := FALSE;
BEGIN
  SELECT COUNT(*) INTO v_total
  FROM public.election_mcq_questions
  WHERE election_id = p_election_id
    AND (question_type IS NULL OR question_type = 'multiple_choice');

  SELECT COUNT(*) INTO v_correct
  FROM public.voter_mcq_responses vmr
  JOIN public.election_mcq_questions emq ON vmr.question_id = emq.id
  WHERE vmr.voter_id = p_voter_id
    AND vmr.election_id = p_election_id
    AND vmr.selected_answer = emq.correct_answer;

  IF v_total > 0 THEN
    v_score_pct := ROUND((v_correct::NUMERIC / v_total::NUMERIC) * 100, 2);
  END IF;

  SELECT COALESCE(mcq_passing_score_percentage, 70) INTO v_passing_score
  FROM public.elections WHERE id = p_election_id;

  v_passed := v_score_pct >= v_passing_score;

  RETURN jsonb_build_object(
    'total_questions', v_total,
    'correct_answers', v_correct,
    'score_percentage', v_score_pct,
    'passed', v_passed
  );
END;
$$;
