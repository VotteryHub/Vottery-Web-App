-- Enforce election edit/delete rules after votes are cast
-- - Prevent deleting elections that already have votes
-- - Lock core election fields once any votes exist
-- - Allow creators to edit only rewards/prize fields and end date/time
-- - Enforce maximum 6 month extension of end date/time from creation

DO $$ BEGIN
  RAISE NOTICE 'Creating function public.enforce_election_edit_rules...';
END $$;

CREATE OR REPLACE FUNCTION public.enforce_election_edit_rules()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_end TIMESTAMPTZ;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- If no voters yet, allow full edit
    IF OLD.total_voters IS NULL OR OLD.total_voters = 0 THEN
      RETURN NEW;
    END IF;

    -- Enforce max 6 month extension from creation for end_date/end_time
    IF (NEW.end_date IS DISTINCT FROM OLD.end_date) OR (NEW.end_time IS DISTINCT FROM OLD.end_time) THEN
      IF NEW.end_date IS NOT NULL THEN
        BEGIN
          -- Expect ISO-style date (YYYY-MM-DD) and HH:MM time
          v_new_end := to_timestamp(
            NEW.end_date || ' ' || coalesce(NEW.end_time, '00:00'),
            'YYYY-MM-DD HH24:MI'
          );
        EXCEPTION WHEN others THEN
          RAISE EXCEPTION 'Invalid end_date/end_time format. Expected YYYY-MM-DD and HH:MM.';
        END;

        IF v_new_end > (OLD.created_at + interval '6 months') THEN
          RAISE EXCEPTION
            'Election end date/time cannot be more than 6 months after creation.';
        END IF;
      END IF;
    END IF;

    -- After votes exist, lock core fields.
    -- Allowed to change: prize_pool, number_of_winners, end_date, end_time, status.
    IF
      NEW.title IS DISTINCT FROM OLD.title
      OR NEW.description IS DISTINCT FROM OLD.description
      OR NEW.category IS DISTINCT FROM OLD.category
      OR NEW.voting_type IS DISTINCT FROM OLD.voting_type
      OR NEW.cover_image IS DISTINCT FROM OLD.cover_image
      OR NEW.cover_image_alt IS DISTINCT FROM OLD.cover_image_alt
      OR NEW.media_type IS DISTINCT FROM OLD.media_type
      OR NEW.media_url IS DISTINCT FROM OLD.media_url
      OR NEW.media_alt IS DISTINCT FROM OLD.media_alt
      OR NEW.minimum_watch_time IS DISTINCT FROM OLD.minimum_watch_time
      OR COALESCE(NEW.watch_time_type, '') IS DISTINCT FROM COALESCE(OLD.watch_time_type, '')
      OR COALESCE(NEW.min_watch_percentage, -1) IS DISTINCT FROM COALESCE(OLD.min_watch_percentage, -1)
      OR NEW.entry_fee IS DISTINCT FROM OLD.entry_fee
      OR NEW.is_gamified IS DISTINCT FROM OLD.is_gamified
      OR NEW.created_by IS DISTINCT FROM OLD.created_by
    THEN
      RAISE EXCEPTION
        'Election is locked after votes are cast; only rewards and end date/time may be edited.';
    END IF;

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Prevent deletion once votes have been cast
    IF OLD.total_voters IS NOT NULL AND OLD.total_voters > 0 THEN
      RAISE EXCEPTION 'Cannot delete election that already has votes.';
    END IF;
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_election_edit_rules ON public.elections;

CREATE TRIGGER trg_enforce_election_edit_rules
BEFORE UPDATE OR DELETE ON public.elections
FOR EACH ROW
EXECUTE FUNCTION public.enforce_election_edit_rules();

DO $$ BEGIN
  RAISE NOTICE 'Election edit/delete rules enforced via trg_enforce_election_edit_rules.';
END $$;

