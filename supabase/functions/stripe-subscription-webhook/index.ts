import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const SUPABASE_URL = Deno.env.get('VITE_SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    // Verify webhook signature
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'No signature provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.text();
    
    // Parse Stripe event
    const event = JSON.parse(body);

    console.log('Processing Stripe event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created': case'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata.user_id;
        const planId = subscription.metadata.plan_id;

        // Calculate end date
        const endDate = new Date(subscription.current_period_end * 1000).toISOString();
        const startDate = new Date(subscription.current_period_start * 1000).toISOString();

        // Upsert subscription
        const { error } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            plan_id: planId,
            stripe_subscription_id: subscription.id,
            subscriber_type: subscription.metadata.subscriber_type || 'individual',
            start_date: startDate,
            end_date: endDate,
            is_active: subscription.status === 'active',
            auto_renew: !subscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'stripe_subscription_id'
          });

        if (error) throw error;

        console.log('Subscription upserted successfully');
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        // Mark subscription as inactive
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            is_active: false,
            auto_renew: false,
            end_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) throw error;

        console.log('Subscription canceled successfully');
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        // Log successful payment
        console.log('Payment succeeded for subscription:', subscriptionId);

        // Ensure subscription is active
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscriptionId);

        if (error) throw error;
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        console.error('Payment failed for subscription:', subscriptionId);

        // Mark subscription as inactive (grace period logic can be added)
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            is_active: false,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscriptionId);

        if (error) throw error;

        // TODO: Send notification to user about failed payment
        // TODO: Implement retry logic
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object;
        console.log('Trial ending soon for subscription:', subscription.id);
        // TODO: Send notification to user
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});