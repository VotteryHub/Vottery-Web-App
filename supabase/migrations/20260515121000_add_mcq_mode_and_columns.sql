-- Add mcq_mode and require_mcq to elections table
ALTER TABLE public.elections 
ADD COLUMN IF NOT EXISTS require_mcq BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS mcq_mode TEXT DEFAULT 'answer_only',
ADD COLUMN IF NOT EXISTS mcq_passing_score_percentage INTEGER DEFAULT 70,
ADD COLUMN IF NOT EXISTS mcq_max_attempts INTEGER DEFAULT 3;

-- Ensure election_mcq_questions table is ready
CREATE TABLE IF NOT EXISTS public.election_mcq_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    options JSONB DEFAULT '[]'::jsonb,
    correct_answer TEXT,
    is_mandatory BOOLEAN DEFAULT TRUE,
    question_type TEXT DEFAULT 'multiple_choice',
    difficulty TEXT DEFAULT 'medium',
    is_required BOOLEAN DEFAULT TRUE,
    question_image_url TEXT,
    char_limit INTEGER DEFAULT 500,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for election_mcq_questions
ALTER TABLE public.election_mcq_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view election mcq questions" 
ON public.election_mcq_questions FOR SELECT USING (true);

CREATE POLICY "Creators can manage their mcq questions" 
ON public.election_mcq_questions FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.elections 
    WHERE id = election_mcq_questions.election_id 
    AND created_by = auth.uid()
));
