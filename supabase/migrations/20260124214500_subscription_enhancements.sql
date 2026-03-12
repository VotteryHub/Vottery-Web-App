-- Add stripe_subscription_id to user_subscriptions for webhook tracking
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE;

-- Create index for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_id 
ON public.user_subscriptions(stripe_subscription_id);

-- Add comment
COMMENT ON COLUMN public.user_subscriptions.stripe_subscription_id IS 'Stripe subscription ID for webhook event tracking';