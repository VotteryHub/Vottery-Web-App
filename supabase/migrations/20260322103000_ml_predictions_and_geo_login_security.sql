-- Canonical ml_predictions (churn + cross-feature ML parity) + geo login history for velocity checks.

CREATE TABLE IF NOT EXISTS public.ml_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  probability_score NUMERIC,
  risk_level TEXT,
  prediction_window TEXT,
  confidence_score NUMERIC,
  feature_payload JSONB DEFAULT '{}'::jsonb,
  predicted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ml_predictions_model_entity_unique
  ON public.ml_predictions (model_type, entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_ml_predictions_predicted_at
  ON public.ml_predictions (predicted_at DESC);

ALTER TABLE public.ml_predictions ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.ml_predictions IS 'Cross-feature ML scores (churn, fraud, etc.); Edge/service_role upserts.';

-- Geo login audit trail (Edge record-login-geo)
CREATE TABLE IF NOT EXISTS public.user_geo_login_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  country_iso TEXT,
  region TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_geo_login_user_created
  ON public.user_geo_login_events (user_id, created_at DESC);

ALTER TABLE public.user_geo_login_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_geo_login_events' AND policyname = 'Users read own geo login events'
  ) THEN
    CREATE POLICY "Users read own geo login events"
      ON public.user_geo_login_events
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

COMMENT ON TABLE public.user_geo_login_events IS 'IP/country snapshots on login; used for geo velocity / anomaly signals.';
