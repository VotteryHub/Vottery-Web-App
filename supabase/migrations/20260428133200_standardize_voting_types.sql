-- Migration: Standardize Voting Types
-- Phase V2: Add canonical column and backfill logic

-- 1. Add the canonical column (nullable to allow gradual backfill)
ALTER TABLE elections ADD COLUMN IF NOT EXISTS voting_type_canonical TEXT;

-- 2. Create a function to normalize voting types (similar to app utility)
CREATE OR REPLACE FUNCTION normalize_voting_type_string(type_str TEXT)
RETURNS TEXT AS $$
DECLARE
    normalized TEXT;
BEGIN
    IF type_str IS NULL THEN
        RETURN 'plurality';
    END IF;

    normalized := lower(trim(regexp_replace(type_str, '[\s_]+', '-', 'g')));

    IF normalized IN ('approval-voting', 'approval') THEN
        RETURN 'approval';
    ELSIF normalized IN ('ranked-choice', 'ranked', 'rcv') THEN
        RETURN 'ranked-choice';
    ELSIF normalized IN ('plurality', 'standard', 'single-choice') THEN
        RETURN 'plurality';
    ELSIF normalized IN ('plus-minus', 'score', 'quadratic') THEN
        RETURN 'plus-minus';
    ELSE
        -- Default to plurality if not matched, but keep it if it's already a known type
        IF normalized IN ('plurality', 'approval', 'ranked-choice', 'plus-minus') THEN
            RETURN normalized;
        END IF;
        RETURN 'plurality';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. Backfill existing rows
UPDATE elections 
SET voting_type_canonical = normalize_voting_type_string(voting_type)
WHERE voting_type_canonical IS NULL;

-- 4. Create a trigger to maintain the canonical column on insert/update
CREATE OR REPLACE FUNCTION maintain_voting_type_canonical()
RETURNS TRIGGER AS $$
BEGIN
    NEW.voting_type_canonical := normalize_voting_type_string(NEW.voting_type);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_maintain_voting_type_canonical ON elections;
CREATE TRIGGER trigger_maintain_voting_type_canonical
BEFORE INSERT OR UPDATE OF voting_type ON elections
FOR EACH ROW
EXECUTE FUNCTION maintain_voting_type_canonical();

-- 5. Add a comment for documentation
COMMENT ON COLUMN elections.voting_type_canonical IS 'Canonical, standardized voting type used for internal logic (plurality, approval, ranked-choice, plus-minus).';
