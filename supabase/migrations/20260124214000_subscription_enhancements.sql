-- =====================================================
-- SUBSCRIPTION ENHANCEMENTS FOR STRIPE INTEGRATION
-- Created: 2026-01-24 21:40:00
-- Purpose: Add Stripe integration fields and billing automation
-- =====================================================

-- Add Stripe fields to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- Add Stripe fields to user_subscriptions
ALTER TABLE public.user_subscriptions
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS billing_cycle_anchor TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'trialing', 'unpaid'));

-- Add Stripe product ID to subscription plans
ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Create subscription billing history table
CREATE TABLE IF NOT EXISTS public.subscription_billing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
    stripe_invoice_id TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL CHECK (status IN ('paid', 'open', 'void', 'uncollectible')),
    billing_reason TEXT,
    invoice_pdf TEXT,
    payment_intent_id TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create subscription payment retry log
CREATE TABLE IF NOT EXISTS public.subscription_payment_retries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
    stripe_invoice_id TEXT,
    attempt_number INTEGER DEFAULT 1,
    retry_date TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed')),
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_user_profiles_stripe_customer ON public.user_profiles(stripe_customer_id);
CREATE INDEX idx_user_subscriptions_stripe ON public.user_subscriptions(stripe_subscription_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_billing_history_subscription ON public.subscription_billing_history(subscription_id);
CREATE INDEX idx_billing_history_invoice ON public.subscription_billing_history(stripe_invoice_id);
CREATE INDEX idx_payment_retries_subscription ON public.subscription_payment_retries(subscription_id);

-- RLS Policies for billing history
ALTER TABLE public.subscription_billing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own billing history"
ON public.subscription_billing_history FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_subscriptions
        WHERE user_subscriptions.id = subscription_billing_history.subscription_id
        AND user_subscriptions.user_id = auth.uid()
    )
);

-- RLS Policies for payment retries
ALTER TABLE public.subscription_payment_retries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment retries"
ON public.subscription_payment_retries FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_subscriptions
        WHERE user_subscriptions.id = subscription_payment_retries.subscription_id
        AND user_subscriptions.user_id = auth.uid()
    )
);

-- Function to check expiring subscriptions (for automated renewal)
CREATE OR REPLACE FUNCTION check_expiring_subscriptions()
RETURNS TABLE (
    subscription_id UUID,
    user_id UUID,
    plan_id UUID,
    end_date TIMESTAMPTZ,
    days_until_expiry INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        us.id,
        us.user_id,
        us.plan_id,
        us.end_date,
        EXTRACT(DAY FROM (us.end_date - CURRENT_TIMESTAMP))::INTEGER
    FROM public.user_subscriptions us
    WHERE us.is_active = true
    AND us.auto_renew = true
    AND us.end_date <= CURRENT_TIMESTAMP + INTERVAL '7 days'
    ORDER BY us.end_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get subscription analytics
CREATE OR REPLACE FUNCTION get_subscription_analytics(
    start_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP - INTERVAL '30 days',
    end_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_subscriptions', COUNT(*),
        'active_subscriptions', COUNT(*) FILTER (WHERE is_active = true),
        'canceled_subscriptions', COUNT(*) FILTER (WHERE is_active = false),
        'total_revenue', COALESCE(SUM(sp.price), 0),
        'mrr', COALESCE(SUM(
            CASE 
                WHEN sp.duration = 'monthly' THEN sp.price
                WHEN sp.duration = '3_months' THEN sp.price / 3
                WHEN sp.duration = 'half_yearly' THEN sp.price / 6
                WHEN sp.duration = 'annual' THEN sp.price / 12
                ELSE 0
            END
        ) FILTER (WHERE us.is_active = true), 0),
        'churn_rate', 
            CASE 
                WHEN COUNT(*) > 0 THEN 
                    (COUNT(*) FILTER (WHERE is_active = false)::FLOAT / COUNT(*)::FLOAT) * 100
                ELSE 0
            END
    ) INTO result
    FROM public.user_subscriptions us
    LEFT JOIN public.subscription_plans sp ON us.plan_id = sp.id
    WHERE us.created_at >= start_date
    AND us.created_at <= end_date;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ 
BEGIN
    RAISE NOTICE 'Subscription enhancement migration completed successfully';
END $$;