-- Auto-moderation: trigger content-moderation-trigger Edge on INSERT to posts, comments, elections.
-- Requires pg_net extension (enable in Dashboard → Database → Extensions if not already).
-- One-time setup: set base_url (and optionally auth header) in moderation_webhook_config.

-- pg_net creates schema "net" with http_post. Enable in Dashboard → Database → Extensions if needed.
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Config: set base_url to your project (e.g. https://YOUR_PROJECT_REF.supabase.co) to enable.
CREATE TABLE IF NOT EXISTS public.moderation_webhook_config (
  id INT PRIMARY KEY DEFAULT 1,
  base_url TEXT NOT NULL DEFAULT '',
  enabled BOOLEAN NOT NULL DEFAULT false,
  headers_json JSONB NOT NULL DEFAULT '{"Content-Type": "application/json"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO public.moderation_webhook_config (id, base_url, enabled)
VALUES (1, '', false)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.moderation_webhook_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only service_role and admins manage webhook config"
  ON public.moderation_webhook_config FOR ALL
  USING (auth.role() = 'service_role' OR (SELECT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))))
  WITH CHECK (auth.role() = 'service_role' OR (SELECT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))));

-- Trigger function: POST to Edge function when config is set and enabled.
CREATE OR REPLACE FUNCTION public.notify_content_moderation_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cfg RECORD;
  payload JSONB;
  req_url TEXT;
BEGIN
  SELECT base_url, enabled, headers_json INTO cfg
  FROM public.moderation_webhook_config
  WHERE id = 1
  LIMIT 1;

  IF cfg.base_url IS NULL OR trim(cfg.base_url) = '' OR cfg.enabled IS NOT TRUE THEN
    RETURN NEW;
  END IF;

  req_url := rtrim(cfg.base_url, '/') || '/functions/v1/content-moderation-trigger';
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', TG_TABLE_NAME,
    'record', to_jsonb(NEW)
  );

  PERFORM net.http_post(
    url := req_url,
    body := payload,
    headers := cfg.headers_json
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log but do not fail the insert
    RAISE WARNING 'moderation webhook failed: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Triggers (only if tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
    DROP TRIGGER IF EXISTS trigger_moderation_on_posts_insert ON public.posts;
    CREATE TRIGGER trigger_moderation_on_posts_insert
      AFTER INSERT ON public.posts
      FOR EACH ROW
      EXECUTE FUNCTION public.notify_content_moderation_on_insert();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'comments') THEN
    DROP TRIGGER IF EXISTS trigger_moderation_on_comments_insert ON public.comments;
    CREATE TRIGGER trigger_moderation_on_comments_insert
      AFTER INSERT ON public.comments
      FOR EACH ROW
      EXECUTE FUNCTION public.notify_content_moderation_on_insert();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'elections') THEN
    DROP TRIGGER IF EXISTS trigger_moderation_on_elections_insert ON public.elections;
    CREATE TRIGGER trigger_moderation_on_elections_insert
      AFTER INSERT ON public.elections
      FOR EACH ROW
      EXECUTE FUNCTION public.notify_content_moderation_on_insert();
  END IF;
END $$;

COMMENT ON TABLE public.moderation_webhook_config IS 'Set base_url to https://YOUR_PROJECT_REF.supabase.co and enabled=true to run content-moderation-trigger on every post/comment/election insert. Optionally set headers_json to include Authorization: Bearer YOUR_ANON_KEY.';
