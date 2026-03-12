-- =====================================================
-- VOTTERY PLATFORM: Vote in Elections Comprehensive Features
-- Migration: 20260123181500_vote_in_elections_comprehensive_features.sql
-- =====================================================

-- 1. MCQ PRE-VOTING SYSTEM
-- =====================================================

-- MCQ Questions Table
CREATE TABLE public.election_mcq_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_order INTEGER DEFAULT 0,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_answer TEXT,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User MCQ Responses Table
CREATE TABLE public.user_mcq_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.election_mcq_questions(id) ON DELETE CASCADE,
    selected_answer TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    answered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(election_id, user_id, question_id)
);

-- 2. WINNER TRACKING & PRIZE DISTRIBUTION
-- =====================================================

-- Prize Distribution Table
CREATE TABLE public.prize_distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    winner_user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    prize_amount TEXT,
    gamified_ticket_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'delivered', 'disputed')),
    claim_date TIMESTAMPTZ,
    delivery_date TIMESTAMPTZ,
    tracking_info JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. CREATOR REPUTATION SYSTEM
-- =====================================================

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS total_elections_created INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prizes_delivered INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prizes_failed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_blacklisted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS blacklist_reason TEXT,
ADD COLUMN IF NOT EXISTS blacklisted_at TIMESTAMPTZ;

-- 4. VOTE VISIBILITY CONTROLS
-- =====================================================

ALTER TABLE public.elections
ADD COLUMN IF NOT EXISTS vote_visibility TEXT DEFAULT 'hidden' CHECK (vote_visibility IN ('hidden', 'visible', 'visible_after_vote')),
ADD COLUMN IF NOT EXISTS show_live_results BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS results_update_interval INTEGER DEFAULT 15;

-- 5. INDEXES
-- =====================================================

CREATE INDEX idx_mcq_questions_election_id ON public.election_mcq_questions(election_id);
CREATE INDEX idx_mcq_responses_election_user ON public.user_mcq_responses(election_id, user_id);
CREATE INDEX idx_prize_distributions_election_id ON public.prize_distributions(election_id);
CREATE INDEX idx_prize_distributions_winner_id ON public.prize_distributions(winner_user_id);
CREATE INDEX idx_user_profiles_reputation ON public.user_profiles(reputation_score);
CREATE INDEX idx_user_profiles_blacklisted ON public.user_profiles(is_blacklisted);

-- 6. FUNCTIONS
-- =====================================================

-- Function to check if user completed MCQ requirements
CREATE OR REPLACE FUNCTION public.check_mcq_completion(p_election_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    total_questions INTEGER;
    answered_questions INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_questions
    FROM public.election_mcq_questions
    WHERE election_id = p_election_id AND is_mandatory = true;

    IF total_questions = 0 THEN
        RETURN true;
    END IF;

    SELECT COUNT(*) INTO answered_questions
    FROM public.user_mcq_responses
    WHERE election_id = p_election_id AND user_id = p_user_id;

    RETURN answered_questions >= total_questions;
END;
$$;

-- Function to update creator reputation on prize delivery
CREATE OR REPLACE FUNCTION public.update_creator_reputation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    creator_id UUID;
BEGIN
    SELECT created_by INTO creator_id
    FROM public.elections
    WHERE id = NEW.election_id;

    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        UPDATE public.user_profiles
        SET 
            prizes_delivered = prizes_delivered + 1,
            reputation_score = LEAST(reputation_score + 5, 100)
        WHERE id = creator_id;
    ELSIF NEW.status = 'disputed' AND OLD.status != 'disputed' THEN
        UPDATE public.user_profiles
        SET 
            prizes_failed = prizes_failed + 1,
            reputation_score = GREATEST(reputation_score - 10, 0)
        WHERE id = creator_id;
    END IF;

    RETURN NEW;
END;
$$;

-- Function to auto-blacklist creators with poor reputation
CREATE OR REPLACE FUNCTION public.check_creator_blacklist()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.reputation_score < 30 AND NEW.prizes_failed >= 3 THEN
        NEW.is_blacklisted := true;
        NEW.blacklist_reason := 'Failed to deliver prizes multiple times';
        NEW.blacklisted_at := CURRENT_TIMESTAMP;
    END IF;

    RETURN NEW;
END;
$$;

-- 7. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.election_mcq_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mcq_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prize_distributions ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES
-- =====================================================

-- MCQ Questions - Public can view, creators can manage
CREATE POLICY "public_view_mcq_questions"
ON public.election_mcq_questions
FOR SELECT
TO public
USING (true);

CREATE POLICY "creators_manage_mcq_questions"
ON public.election_mcq_questions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.elections
        WHERE id = election_id AND created_by = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.elections
        WHERE id = election_id AND created_by = auth.uid()
    )
);

-- MCQ Responses - Users can view and create their own
CREATE POLICY "users_view_own_mcq_responses"
ON public.user_mcq_responses
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users_create_mcq_responses"
ON public.user_mcq_responses
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Prize Distributions - Winners and creators can view
CREATE POLICY "winners_view_own_prizes"
ON public.prize_distributions
FOR SELECT
TO authenticated
USING (winner_user_id = auth.uid());

CREATE POLICY "creators_view_election_prizes"
ON public.prize_distributions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.elections
        WHERE id = election_id AND created_by = auth.uid()
    )
);

CREATE POLICY "creators_manage_prizes"
ON public.prize_distributions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.elections
        WHERE id = election_id AND created_by = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.elections
        WHERE id = election_id AND created_by = auth.uid()
    )
);

-- 9. TRIGGERS
-- =====================================================

CREATE TRIGGER update_prize_distribution_timestamp
    BEFORE UPDATE ON public.prize_distributions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creator_reputation_on_prize_status
    AFTER UPDATE ON public.prize_distributions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_creator_reputation();

CREATE TRIGGER check_creator_blacklist_trigger
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    WHEN (NEW.reputation_score IS DISTINCT FROM OLD.reputation_score)
    EXECUTE FUNCTION public.check_creator_blacklist();

-- 10. COMPLETION NOTICE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Vote in Elections comprehensive features migration completed successfully';
END $$;