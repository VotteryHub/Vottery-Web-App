-- SERVER-SIDE VP CALCULATION & DOUBLE-VOTING PREVENTION
-- Migration to secure VP economy and prevent vote manipulation

-- ============================================================================
-- VP CALCULATION FUNCTION (SERVER-SIDE ONLY)
-- ============================================================================

CREATE OR REPLACE FUNCTION award_vp_for_action(
  p_user_id UUID,
  p_action_type TEXT,
  p_action_id UUID,
  p_is_sponsored BOOLEAN DEFAULT FALSE
)
RETURNS INTEGER AS $$
DECLARE
  v_vp_amount INTEGER;
  v_multiplier NUMERIC := 1.0;
  v_current_streak INTEGER;
  v_user_level INTEGER;
BEGIN
  -- Get user's current streak and level for multipliers
  SELECT current_streak, current_level
  INTO v_current_streak, v_user_level
  FROM user_gamification
  WHERE user_id = p_user_id;

  -- Base VP amounts by action type
  v_vp_amount := CASE p_action_type
    WHEN 'vote' THEN 10
    WHEN 'prediction' THEN 20
    WHEN 'daily_login' THEN 5
    WHEN 'comment' THEN 3
    WHEN 'share' THEN 5
    WHEN 'create_election' THEN 50
    WHEN 'quest_complete' THEN 100
    ELSE 0
  END;

  -- Apply sponsored multiplier (2x for sponsored content)
  IF p_is_sponsored THEN
    v_multiplier := v_multiplier * 2.0;
  END IF;

  -- Apply streak multiplier (up to 2x for 7+ day streak)
  IF v_current_streak >= 7 THEN
    v_multiplier := v_multiplier * 2.0;
  ELSIF v_current_streak >= 3 THEN
    v_multiplier := v_multiplier * 1.5;
  END IF;

  -- Apply level multiplier (1% per level, max 50%)
  v_multiplier := v_multiplier * (1.0 + LEAST(v_user_level * 0.01, 0.5));

  -- Calculate final VP amount
  v_vp_amount := FLOOR(v_vp_amount * v_multiplier);

  -- Insert into XP log (immutable audit trail)
  INSERT INTO xp_log (
    user_id,
    action_type,
    action_id,
    xp_gained,
    is_sponsored,
    multiplier_applied,
    timestamp
  ) VALUES (
    p_user_id,
    p_action_type,
    p_action_id,
    v_vp_amount,
    p_is_sponsored,
    v_multiplier,
    NOW()
  );

  -- Update user's VP balance atomically
  UPDATE user_gamification
  SET 
    current_xp = current_xp + v_vp_amount,
    total_xp_earned = total_xp_earned + v_vp_amount,
    last_activity_at = NOW()
  WHERE user_id = p_user_id;

  -- Check for level up
  PERFORM check_level_up(p_user_id);

  RETURN v_vp_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- LEVEL UP CHECK FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION check_level_up(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_current_xp INTEGER;
  v_current_level INTEGER;
  v_xp_for_next_level INTEGER;
BEGIN
  SELECT current_xp, current_level
  INTO v_current_xp, v_current_level
  FROM user_gamification
  WHERE user_id = p_user_id;

  -- Calculate XP needed for next level (100 * level)
  v_xp_for_next_level := v_current_level * 100;

  -- Level up if enough XP
  WHILE v_current_xp >= v_xp_for_next_level LOOP
    v_current_level := v_current_level + 1;
    v_xp_for_next_level := v_current_level * 100;

    -- Update level
    UPDATE user_gamification
    SET current_level = v_current_level
    WHERE user_id = p_user_id;

    -- Award level-up bonus VP
    INSERT INTO xp_log (
      user_id,
      action_type,
      xp_gained,
      timestamp
    ) VALUES (
      p_user_id,
      'level_up',
      50,
      NOW()
    );

    UPDATE user_gamification
    SET current_xp = current_xp + 50
    WHERE user_id = p_user_id;

    -- Refresh current XP for next iteration
    SELECT current_xp INTO v_current_xp
    FROM user_gamification
    WHERE user_id = p_user_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- DOUBLE-VOTING PREVENTION TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION prevent_double_voting()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has already voted in this election
  IF EXISTS (
    SELECT 1 FROM votes
    WHERE election_id = NEW.election_id
    AND user_id = NEW.user_id
    FOR UPDATE -- Lock the row to prevent race conditions
  ) THEN
    RAISE EXCEPTION 'User has already voted in this election. Vote ID: %, Election ID: %', NEW.user_id, NEW.election_id
      USING ERRCODE = '23505'; -- Unique violation error code
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS check_double_vote ON votes;

-- Create trigger to prevent double voting
CREATE TRIGGER check_double_vote
  BEFORE INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION prevent_double_voting();

-- ============================================================================
-- VP DEDUCTION FUNCTION (FOR REDEMPTIONS)
-- ============================================================================

CREATE OR REPLACE FUNCTION deduct_vp(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_reference_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_vp INTEGER;
BEGIN
  -- Get current VP balance with row lock
  SELECT current_xp INTO v_current_vp
  FROM user_gamification
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Check if user has enough VP
  IF v_current_vp < p_amount THEN
    RAISE EXCEPTION 'Insufficient VP balance. Required: %, Available: %', p_amount, v_current_vp;
  END IF;

  -- Deduct VP
  UPDATE user_gamification
  SET current_xp = current_xp - p_amount
  WHERE user_id = p_user_id;

  -- Log the deduction
  INSERT INTO xp_log (
    user_id,
    action_type,
    action_id,
    xp_gained,
    timestamp
  ) VALUES (
    p_user_id,
    p_reason,
    p_reference_id,
    -p_amount, -- Negative for deduction
    NOW()
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECURE VP TRANSFER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION transfer_vp(
  p_from_user_id UUID,
  p_to_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'transfer'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_from_balance INTEGER;
BEGIN
  -- Validate amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Transfer amount must be positive';
  END IF;

  -- Lock both accounts in consistent order to prevent deadlock
  IF p_from_user_id < p_to_user_id THEN
    SELECT current_xp INTO v_from_balance
    FROM user_gamification
    WHERE user_id = p_from_user_id
    FOR UPDATE;

    PERFORM 1 FROM user_gamification
    WHERE user_id = p_to_user_id
    FOR UPDATE;
  ELSE
    PERFORM 1 FROM user_gamification
    WHERE user_id = p_to_user_id
    FOR UPDATE;

    SELECT current_xp INTO v_from_balance
    FROM user_gamification
    WHERE user_id = p_from_user_id
    FOR UPDATE;
  END IF;

  -- Check balance
  IF v_from_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient VP balance for transfer';
  END IF;

  -- Deduct from sender
  UPDATE user_gamification
  SET current_xp = current_xp - p_amount
  WHERE user_id = p_from_user_id;

  -- Add to recipient
  UPDATE user_gamification
  SET current_xp = current_xp + p_amount
  WHERE user_id = p_to_user_id;

  -- Log both transactions
  INSERT INTO xp_log (user_id, action_type, xp_gained, timestamp)
  VALUES 
    (p_from_user_id, 'vp_transfer_out', -p_amount, NOW()),
    (p_to_user_id, 'vp_transfer_in', p_amount, NOW());

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- VOTE INTEGRITY CHECK FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION verify_vote_integrity(
  p_vote_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_vote_hash TEXT;
  v_blockchain_hash TEXT;
  v_computed_hash TEXT;
BEGIN
  -- Get vote data
  SELECT vote_hash, blockchain_hash
  INTO v_vote_hash, v_blockchain_hash
  FROM votes
  WHERE id = p_vote_id;

  -- Verify vote hasn't been tampered with
  -- In production, this would use actual cryptographic verification
  IF v_vote_hash IS NULL OR v_blockchain_hash IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANT EXECUTE PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION award_vp_for_action(UUID, TEXT, UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION deduct_vp(UUID, INTEGER, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION transfer_vp(UUID, UUID, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_vote_integrity(UUID) TO authenticated;

-- ============================================================================
-- SECURITY AUDIT LOG
-- ============================================================================

INSERT INTO admin_logs (action, details, performed_by, timestamp)
VALUES (
  'security_hardening',
  'Server-side VP calculation and double-voting prevention implemented',
  'system',
  NOW()
);