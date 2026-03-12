-- Ensure election_mcq_questions table has correct schema with question_text and correct_answer as value string
-- This migration is idempotent and safe to run multiple times

-- Add question_text column if it doesn't exist (some older schemas may use 'text')
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'election_mcq_questions'
      AND column_name = 'question_text'
  ) THEN
    ALTER TABLE public.election_mcq_questions ADD COLUMN question_text TEXT NOT NULL DEFAULT '';
  END IF;
END;
$$;

-- Ensure correct_answer column exists as TEXT (value string, not integer index)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'election_mcq_questions'
      AND column_name = 'correct_answer'
  ) THEN
    ALTER TABLE public.election_mcq_questions ADD COLUMN correct_answer TEXT NOT NULL DEFAULT '';
  END IF;
END;
$$;

-- Ensure user_mcq_responses table exists for storing voter responses
CREATE TABLE IF NOT EXISTS public.user_mcq_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL,
  selected_answer TEXT NOT NULL DEFAULT '',
  is_correct BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(election_id, user_id, question_id)
);

-- Enable RLS on user_mcq_responses
ALTER TABLE public.user_mcq_responses ENABLE ROW LEVEL SECURITY;

-- RLS: users can insert/select their own responses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_mcq_responses'
      AND policyname = 'Users can insert own mcq responses'
  ) THEN
    CREATE POLICY "Users can insert own mcq responses"
      ON public.user_mcq_responses
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_mcq_responses'
      AND policyname = 'Users can view own mcq responses'
  ) THEN
    CREATE POLICY "Users can view own mcq responses"
      ON public.user_mcq_responses
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_mcq_responses'
      AND policyname = 'Users can update own mcq responses'
  ) THEN
    CREATE POLICY "Users can update own mcq responses"
      ON public.user_mcq_responses
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END;
$$;

-- Index for fast lookups by election and user
CREATE INDEX IF NOT EXISTS idx_user_mcq_responses_election_user
  ON public.user_mcq_responses(election_id, user_id);
