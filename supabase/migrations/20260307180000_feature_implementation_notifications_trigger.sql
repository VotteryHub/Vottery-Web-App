-- Notify submitter and upvoters when a feature request is marked implemented
-- Migration: 20260307180000_feature_implementation_notifications_trigger.sql

CREATE OR REPLACE FUNCTION public.notify_feature_implemented()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec RECORD;
  msg TEXT;
BEGIN
  IF NEW.status = 'implemented' AND (OLD.status IS NULL OR OLD.status IS DISTINCT FROM 'implemented') THEN
    msg := 'Your requested feature "' || COALESCE(NEW.title, '') || '" has been implemented.';
    -- Notify the submitter
    INSERT INTO public.feature_implementation_notifications (feature_request_id, user_id, notification_type, message, read)
    VALUES (NEW.id, NEW.user_id, 'implementation_complete', msg, FALSE);
    -- Notify all users who upvoted (excluding submitter to avoid duplicate)
    FOR rec IN
      SELECT DISTINCT fv.user_id
      FROM public.feature_votes fv
      WHERE fv.feature_request_id = NEW.id
        AND fv.vote_type = 'upvote'
        AND fv.user_id IS NOT NULL
        AND fv.user_id != NEW.user_id
    LOOP
      INSERT INTO public.feature_implementation_notifications (feature_request_id, user_id, notification_type, message, read)
      VALUES (NEW.id, rec.user_id, 'implementation_complete', msg, FALSE);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notify_feature_implemented ON public.feature_requests;
CREATE TRIGGER trigger_notify_feature_implemented
  AFTER UPDATE OF status ON public.feature_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_feature_implemented();

COMMENT ON FUNCTION public.notify_feature_implemented() IS 'Creates feature_implementation_notifications for submitter and upvoters when status becomes implemented.';
