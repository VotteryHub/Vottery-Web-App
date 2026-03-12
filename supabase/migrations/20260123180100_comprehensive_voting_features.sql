-- MCQ Pre-Voting Quiz System
CREATE TABLE IF NOT EXISTS public.election_mcq_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer TEXT,
  question_order INTEGER NOT NULL DEFAULT 0,
  is_mandatory BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_mcq_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.election_mcq_questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, election_id, question_id)
);

-- Winner Management System
CREATE TABLE IF NOT EXISTS public.election_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  winner_type TEXT NOT NULL CHECK (winner_type IN ('election_result', 'gamified_winner')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  option_id UUID REFERENCES public.election_options(id) ON DELETE SET NULL,
  rank_position INTEGER NOT NULL,
  vote_count INTEGER DEFAULT 0,
  vote_percentage DECIMAL(5,2) DEFAULT 0.00,
  prize_amount DECIMAL(12,2) DEFAULT 0.00,
  gamified_ticket_id TEXT,
  notification_sent BOOLEAN DEFAULT false,
  notification_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prize Distribution Tracking
CREATE TABLE IF NOT EXISTS public.prize_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  winner_id UUID NOT NULL REFERENCES public.election_winners(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prize_amount DECIMAL(12,2) NOT NULL,
  distribution_status TEXT NOT NULL DEFAULT 'pending' CHECK (distribution_status IN ('pending', 'processing', 'completed', 'failed', 'disputed')),
  payment_method TEXT,
  transaction_id TEXT,
  claim_initiated_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  dispute_reason TEXT,
  tracking_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creator Reputation System
CREATE TABLE IF NOT EXISTS public.creator_reputation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  reputation_score DECIMAL(5,2) DEFAULT 100.00,
  total_elections_created INTEGER DEFAULT 0,
  completed_elections INTEGER DEFAULT 0,
  prizes_distributed INTEGER DEFAULT 0,
  prizes_pending INTEGER DEFAULT 0,
  prizes_failed INTEGER DEFAULT 0,
  average_participant_rating DECIMAL(3,2) DEFAULT 0.00,
  dispute_count INTEGER DEFAULT 0,
  red_flag_count INTEGER DEFAULT 0,
  is_blacklisted BOOLEAN DEFAULT false,
  blacklist_reason TEXT,
  blacklisted_at TIMESTAMPTZ,
  verified_creator BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns to elections table
ALTER TABLE public.elections
ADD COLUMN IF NOT EXISTS vote_visibility TEXT DEFAULT 'visible' CHECK (vote_visibility IN ('hidden', 'visible', 'visible_after_vote')),
ADD COLUMN IF NOT EXISTS show_live_results BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS has_mcq_quiz BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS mcq_pass_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS mcq_minimum_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS winners_announced BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS winners_announced_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS prize_distribution_deadline TIMESTAMPTZ;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mcq_questions_election ON public.election_mcq_questions(election_id);
CREATE INDEX IF NOT EXISTS idx_mcq_responses_user_election ON public.user_mcq_responses(user_id, election_id);
CREATE INDEX IF NOT EXISTS idx_election_winners_election ON public.election_winners(election_id);
CREATE INDEX IF NOT EXISTS idx_election_winners_user ON public.election_winners(user_id);
CREATE INDEX IF NOT EXISTS idx_prize_distributions_status ON public.prize_distributions(distribution_status);
CREATE INDEX IF NOT EXISTS idx_creator_reputation_user ON public.creator_reputation(user_id);

-- RLS Policies for MCQ Questions
ALTER TABLE public.election_mcq_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "MCQ questions are viewable by authenticated users"
  ON public.election_mcq_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "MCQ questions can be created by election creators"
  ON public.election_mcq_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.elections
      WHERE elections.id = election_mcq_questions.election_id
      AND elections.created_by = auth.uid()
    )
  );

CREATE POLICY "MCQ questions can be updated by election creators"
  ON public.election_mcq_questions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.elections
      WHERE elections.id = election_mcq_questions.election_id
      AND elections.created_by = auth.uid()
    )
  );

-- RLS Policies for MCQ Responses
ALTER TABLE public.user_mcq_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own MCQ responses"
  ON public.user_mcq_responses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own MCQ responses"
  ON public.user_mcq_responses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for Election Winners
ALTER TABLE public.election_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Election winners are viewable by all authenticated users"
  ON public.election_winners FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Election winners can be created by system"
  ON public.election_winners FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.elections
      WHERE elections.id = election_winners.election_id
      AND elections.created_by = auth.uid()
    )
  );

-- RLS Policies for Prize Distributions
ALTER TABLE public.prize_distributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own prize distributions"
  ON public.prize_distributions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.elections
    WHERE elections.id = prize_distributions.election_id
    AND elections.created_by = auth.uid()
  ));

CREATE POLICY "Prize distributions can be created by election creators"
  ON public.prize_distributions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.elections
      WHERE elections.id = prize_distributions.election_id
      AND elections.created_by = auth.uid()
    )
  );

CREATE POLICY "Prize distributions can be updated by creators and winners"
  ON public.prize_distributions FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.elections
      WHERE elections.id = prize_distributions.election_id
      AND elections.created_by = auth.uid()
    )
  );

-- RLS Policies for Creator Reputation
ALTER TABLE public.creator_reputation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator reputation is viewable by all authenticated users"
  ON public.creator_reputation FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creator reputation can be created for own profile"
  ON public.creator_reputation FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Creator reputation can be updated by owner"
  ON public.creator_reputation FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Trigger to create creator reputation on first election
CREATE OR REPLACE FUNCTION create_creator_reputation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.creator_reputation (user_id, total_elections_created)
  VALUES (NEW.created_by, 1)
  ON CONFLICT (user_id) DO UPDATE
  SET total_elections_created = creator_reputation.total_elections_created + 1,
      updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_create_creator_reputation ON public.elections;
CREATE TRIGGER trigger_create_creator_reputation
  AFTER INSERT ON public.elections
  FOR EACH ROW
  EXECUTE FUNCTION create_creator_reputation();

-- Trigger to update creator reputation on prize distribution
CREATE OR REPLACE FUNCTION update_creator_reputation_on_prize()
RETURNS TRIGGER AS $$
DECLARE
  creator_id UUID;
BEGIN
  SELECT created_by INTO creator_id
  FROM public.elections
  WHERE id = NEW.election_id;

  IF NEW.distribution_status = 'completed' AND (OLD.distribution_status IS NULL OR OLD.distribution_status != 'completed') THEN
    UPDATE public.creator_reputation
    SET prizes_distributed = prizes_distributed + 1,
        prizes_pending = GREATEST(prizes_pending - 1, 0),
        reputation_score = LEAST(reputation_score + 2.0, 100.0),
        updated_at = NOW()
    WHERE user_id = creator_id;
  ELSIF NEW.distribution_status = 'failed' AND (OLD.distribution_status IS NULL OR OLD.distribution_status != 'failed') THEN
    UPDATE public.creator_reputation
    SET prizes_failed = prizes_failed + 1,
        prizes_pending = GREATEST(prizes_pending - 1, 0),
        reputation_score = GREATEST(reputation_score - 5.0, 0.0),
        red_flag_count = red_flag_count + 1,
        updated_at = NOW()
    WHERE user_id = creator_id;
  ELSIF NEW.distribution_status = 'pending' AND (OLD.distribution_status IS NULL OR OLD.distribution_status != 'pending') THEN
    UPDATE public.creator_reputation
    SET prizes_pending = prizes_pending + 1,
        updated_at = NOW()
    WHERE user_id = creator_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_creator_reputation_on_prize ON public.prize_distributions;
CREATE TRIGGER trigger_update_creator_reputation_on_prize
  AFTER INSERT OR UPDATE ON public.prize_distributions
  FOR EACH ROW
  EXECUTE FUNCTION update_creator_reputation_on_prize();

-- Function to calculate and announce winners
CREATE OR REPLACE FUNCTION calculate_election_winners(p_election_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_election RECORD;
  v_total_votes INTEGER;
  v_winners JSONB := '[]'::jsonb;
  v_option RECORD;
  v_rank INTEGER := 1;
BEGIN
  -- Get election details
  SELECT * INTO v_election FROM public.elections WHERE id = p_election_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Election not found');
  END IF;

  -- Get total votes
  SELECT COUNT(*) INTO v_total_votes FROM public.votes WHERE election_id = p_election_id;

  IF v_total_votes = 0 THEN
    RETURN jsonb_build_object('error', 'No votes cast');
  END IF;

  -- Calculate winners based on voting type
  IF v_election.voting_type = 'Plurality' THEN
    FOR v_option IN
      SELECT
        eo.id,
        eo.title,
        COUNT(v.id) as vote_count,
        ROUND((COUNT(v.id)::DECIMAL / v_total_votes) * 100, 2) as vote_percentage
      FROM public.election_options eo
      LEFT JOIN public.votes v ON v.selected_option_id = eo.id AND v.election_id = p_election_id
      WHERE eo.election_id = p_election_id
      GROUP BY eo.id, eo.title
      ORDER BY vote_count DESC
    LOOP
      INSERT INTO public.election_winners (
        election_id,
        winner_type,
        option_id,
        rank_position,
        vote_count,
        vote_percentage
      ) VALUES (
        p_election_id,
        'election_result',
        v_option.id,
        v_rank,
        v_option.vote_count,
        v_option.vote_percentage
      );

      v_winners := v_winners || jsonb_build_object(
        'rank', v_rank,
        'option_id', v_option.id,
        'title', v_option.title,
        'vote_count', v_option.vote_count,
        'vote_percentage', v_option.vote_percentage
      );

      v_rank := v_rank + 1;
    END LOOP;
  END IF;

  -- Mark election as winners announced
  UPDATE public.elections
  SET winners_announced = true,
      winners_announced_at = NOW(),
      updated_at = NOW()
  WHERE id = p_election_id;

  RETURN jsonb_build_object('success', true, 'winners', v_winners);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to select gamified winners
CREATE OR REPLACE FUNCTION select_gamified_winners(p_election_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_election RECORD;
  v_winner RECORD;
  v_rank INTEGER := 1;
  v_prize_per_winner DECIMAL(12,2);
  v_winners JSONB := '[]'::jsonb;
BEGIN
  -- Get election details
  SELECT * INTO v_election FROM public.elections WHERE id = p_election_id AND is_gamified = true;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Gamified election not found');
  END IF;

  -- Calculate prize per winner
  v_prize_per_winner := v_election.prize_pool / NULLIF(v_election.number_of_winners, 0);

  -- Select random winners
  FOR v_winner IN
    SELECT
      v.user_id,
      v.gamified_ticket_id,
      up.name,
      up.username,
      up.avatar
    FROM public.votes v
    JOIN public.user_profiles up ON up.id = v.user_id
    WHERE v.election_id = p_election_id
      AND v.gamified_ticket_id IS NOT NULL
    ORDER BY RANDOM()
    LIMIT v_election.number_of_winners
  LOOP
    INSERT INTO public.election_winners (
      election_id,
      winner_type,
      user_id,
      rank_position,
      prize_amount,
      gamified_ticket_id
    ) VALUES (
      p_election_id,
      'gamified_winner',
      v_winner.user_id,
      v_rank,
      v_prize_per_winner,
      v_winner.gamified_ticket_id
    );

    -- Create prize distribution record
    INSERT INTO public.prize_distributions (
      election_id,
      winner_id,
      user_id,
      prize_amount,
      distribution_status
    ) SELECT
      p_election_id,
      id,
      v_winner.user_id,
      v_prize_per_winner,
      'pending'
    FROM public.election_winners
    WHERE election_id = p_election_id
      AND user_id = v_winner.user_id
      AND winner_type = 'gamified_winner'
    ORDER BY created_at DESC
    LIMIT 1;

    v_winners := v_winners || jsonb_build_object(
      'rank', v_rank,
      'user_id', v_winner.user_id,
      'name', v_winner.name,
      'username', v_winner.username,
      'avatar', v_winner.avatar,
      'gamified_ticket_id', v_winner.gamified_ticket_id,
      'prize_amount', v_prize_per_winner
    );

    v_rank := v_rank + 1;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'winners', v_winners);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;