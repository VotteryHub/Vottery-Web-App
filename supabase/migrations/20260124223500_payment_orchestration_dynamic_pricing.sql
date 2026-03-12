-- Enhanced Payment Orchestration and Dynamic Pricing Schema
-- Migration: 20260124223500_payment_orchestration_dynamic_pricing.sql

-- Payment Provider Configuration
CREATE TABLE IF NOT EXISTS public.payment_provider_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  fixed_fee DECIMAL(10, 2) DEFAULT 0,
  percentage_fee DECIMAL(5, 2) DEFAULT 0,
  avg_processing_time INTEGER DEFAULT 0, -- in seconds
  supported_currencies TEXT[] DEFAULT ARRAY['USD', 'EUR', 'GBP'],
  min_transaction_amount DECIMAL(10, 2) DEFAULT 0,
  max_transaction_amount DECIMAL(10, 2) DEFAULT 1000000,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zone-specific Payment Routing Rules
CREATE TABLE IF NOT EXISTS public.zone_payment_routing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id INTEGER NOT NULL,
  preferred_providers TEXT[] DEFAULT ARRAY[]::TEXT[],
  blocked_providers TEXT[] DEFAULT ARRAY[]::TEXT[],
  routing_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Payment Preferences
CREATE TABLE IF NOT EXISTS public.user_payment_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_provider TEXT,
  blocked_providers TEXT[] DEFAULT ARRAY[]::TEXT[],
  auto_routing BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Payment Routing Logs
CREATE TABLE IF NOT EXISTS public.payment_routing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  transaction_type TEXT NOT NULL,
  zone_id INTEGER,
  selected_provider TEXT NOT NULL,
  routing_reason TEXT NOT NULL,
  estimated_cost DECIMAL(10, 2),
  estimated_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Transactions
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  transaction_type TEXT NOT NULL,
  processing_fee DECIMAL(10, 2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing Intelligence (Competitor Data)
CREATE TABLE IF NOT EXISTS public.pricing_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type TEXT NOT NULL,
  competitor_name TEXT,
  price DECIMAL(10, 2) NOT NULL,
  features JSONB DEFAULT '[]',
  market_position TEXT,
  data_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing Recommendations
CREATE TABLE IF NOT EXISTS public.pricing_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  current_price DECIMAL(10, 2) NOT NULL,
  recommended_price DECIMAL(10, 2) NOT NULL,
  elasticity JSONB DEFAULT '{}',
  revenue_impact TEXT,
  positioning TEXT,
  segment_pricing JSONB DEFAULT '{}',
  confidence DECIMAL(3, 2) DEFAULT 0.85,
  status TEXT DEFAULT 'pending',
  analysis_data JSONB DEFAULT '{}',
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Cost Optimizations (removed FK constraint to non-existent advertiser_campaigns table)
CREATE TABLE IF NOT EXISTS public.ad_cost_optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID,
  current_cpm DECIMAL(10, 2),
  recommended_cpm DECIMAL(10, 2),
  current_cpc DECIMAL(10, 2),
  recommended_cpc DECIMAL(10, 2),
  current_cpe DECIMAL(10, 2),
  recommended_cpe DECIMAL(10, 2),
  bid_adjustments JSONB DEFAULT '{}',
  budget_allocation JSONB DEFAULT '{}',
  reasoning TEXT,
  demand_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recommendation Insights
CREATE TABLE IF NOT EXISTS public.recommendation_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  insights JSONB NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign Suggestions
CREATE TABLE IF NOT EXISTS public.campaign_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_theme TEXT NOT NULL,
  targeting_params JSONB DEFAULT '{}',
  budget_allocation JSONB DEFAULT '{}',
  expected_metrics JSONB DEFAULT '{}',
  creative_direction TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default payment provider configurations
INSERT INTO public.payment_provider_config (provider_name, is_active, fixed_fee, percentage_fee, avg_processing_time, supported_currencies)
VALUES
  ('stripe', true, 0.30, 2.9, 5, ARRAY['USD', 'EUR', 'GBP', 'INR']),
  ('paypal', true, 0.49, 3.49, 10, ARRAY['USD', 'EUR', 'GBP']),
  ('crypto', true, 0.00, 1.5, 600, ARRAY['USD', 'USDT', 'BTC', 'ETH'])
ON CONFLICT (provider_name) DO NOTHING;

-- Insert sample pricing intelligence data
INSERT INTO public.pricing_intelligence (plan_type, competitor_name, price, features, market_position)
VALUES
  ('individual', 'Competitor A', 12.99, '["Unlimited elections", "Basic analytics"]', 'premium'),
  ('individual', 'Competitor B', 7.99, '["Limited elections", "Basic support"]', 'budget'),
  ('organization', 'Competitor A', 59.99, '["Team collaboration", "Advanced analytics"]', 'premium'),
  ('organization', 'Competitor B', 39.99, '["Team features", "Standard support"]', 'mid-market');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_routing_logs_user_id ON public.payment_routing_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_routing_logs_provider ON public.payment_routing_logs(selected_provider);
CREATE INDEX IF NOT EXISTS idx_payment_routing_logs_created_at ON public.payment_routing_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_pricing_recommendations_plan_id ON public.pricing_recommendations(plan_id);
CREATE INDEX IF NOT EXISTS idx_pricing_recommendations_status ON public.pricing_recommendations(status);
CREATE INDEX IF NOT EXISTS idx_ad_cost_optimizations_campaign_id ON public.ad_cost_optimizations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_insights_user_id ON public.recommendation_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_suggestions_advertiser_id ON public.campaign_suggestions(advertiser_id);

-- Enable RLS
ALTER TABLE public.payment_provider_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zone_payment_routing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payment_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_routing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_cost_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Payment Provider Config (Admin only)
CREATE POLICY "Admin can manage payment provider config" ON public.payment_provider_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view active payment providers" ON public.payment_provider_config
  FOR SELECT USING (is_active = true);

-- User Payment Preferences
CREATE POLICY "Users can manage their own payment preferences" ON public.user_payment_preferences
  FOR ALL USING (user_id = auth.uid());

-- Payment Routing Logs
CREATE POLICY "Users can view their own routing logs" ON public.payment_routing_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can view all routing logs" ON public.payment_routing_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payment Transactions
CREATE POLICY "Users can view their own transactions" ON public.payment_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can view all transactions" ON public.payment_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Pricing Intelligence (Admin only)
CREATE POLICY "Admin can manage pricing intelligence" ON public.pricing_intelligence
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Pricing Recommendations (Admin only)
CREATE POLICY "Admin can manage pricing recommendations" ON public.pricing_recommendations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Ad Cost Optimizations (Admin and Advertisers)
CREATE POLICY "Admin can manage all ad cost optimizations" ON public.ad_cost_optimizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Recommendation Insights
CREATE POLICY "Users can view their own insights" ON public.recommendation_insights
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can manage all insights" ON public.recommendation_insights
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Campaign Suggestions
CREATE POLICY "Advertisers can view their own suggestions" ON public.campaign_suggestions
  FOR SELECT USING (advertiser_id = auth.uid());

CREATE POLICY "Admin can manage all suggestions" ON public.campaign_suggestions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DO $$
BEGIN
  RAISE NOTICE 'Payment orchestration and dynamic pricing schema created successfully';
END $$;