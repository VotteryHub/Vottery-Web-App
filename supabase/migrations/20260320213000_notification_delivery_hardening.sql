-- Delivery hardening for winner and streak notification workflows

CREATE TABLE IF NOT EXISTS public.notification_delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('winner_announcement', 'streak_expiration')),
  channel TEXT NOT NULL CHECK (channel IN ('in_app', 'email', 'sms', 'dm', 'push')),
  entity_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_delivery_logs_user_id
  ON public.notification_delivery_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_notification_delivery_logs_category
  ON public.notification_delivery_logs(category);

CREATE INDEX IF NOT EXISTS idx_notification_delivery_logs_status
  ON public.notification_delivery_logs(status);

CREATE INDEX IF NOT EXISTS idx_notification_delivery_logs_created_at
  ON public.notification_delivery_logs(created_at DESC);

ALTER TABLE public.notification_delivery_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notification delivery logs" ON public.notification_delivery_logs;
CREATE POLICY "Users can read own notification delivery logs"
  ON public.notification_delivery_logs
  FOR SELECT
  USING (auth.uid() = user_id);
