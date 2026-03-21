declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.87.1';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { checkWebhookIdempotency, validateStripeWebhook } from '../shared/webhookSecurity.ts';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response('Webhook signature missing', { status: 400 });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const body = await req.text();
    const replayCheck = await validateStripeWebhook(signature, body, webhookSecret);
    if (!replayCheck.valid || !replayCheck.timestamp) {
      return new Response('Invalid webhook timestamp', { status: 400 });
    }

    const isUniqueWebhook = await checkWebhookIdempotency(
      req.headers.get('stripe-event-id') ?? crypto.randomUUID(),
      replayCheck.timestamp
    );
    if (!isUniqueWebhook) {
      return new Response('Duplicate webhook rejected', { status: 409 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object, supabaseClient);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object, supabaseClient);
        break;
      case 'payout.paid':
        await handlePayoutSuccess(event.data.object, supabaseClient);
        break;
      case 'payout.failed':
        await handlePayoutFailure(event.data.object, supabaseClient);
        break;
      case 'customer.subscription.created': case'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object, supabaseClient);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object, supabaseClient);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Webhook error:', (err as any).message);
    return new Response(`Webhook Error: ${(err as any).message}`, { status: 400 });
  }
});

async function handlePaymentSuccess(paymentIntent: any, supabaseClient: any) {
  const userId = paymentIntent.metadata.user_id;
  const amount = paymentIntent.amount;

  // Update transaction status
  await supabaseClient
    .from('wallet_transactions')
    .update({ status: 'completed' })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  // Award VP based on purchase amount (100 VP per dollar)
  const vpAmount = Math.floor(amount / 10);
  await supabaseClient.rpc('award_vp_for_action', {
    p_user_id: userId,
    p_action_type: 'vp_purchase',
    p_action_id: paymentIntent.id,
    p_is_sponsored: false,
  });

  // Log security event
  await supabaseClient.from('security_logs').insert({
    event_type: 'payment_success',
    user_id: userId,
    details: { payment_intent_id: paymentIntent.id, amount, vp_awarded: vpAmount },
    timestamp: new Date().toISOString(),
  });
}

async function handlePaymentFailure(paymentIntent: any, supabaseClient: any) {
  await supabaseClient
    .from('wallet_transactions')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  // Log security event
  await supabaseClient.from('security_logs').insert({
    event_type: 'payment_failure',
    user_id: paymentIntent.metadata.user_id,
    details: { payment_intent_id: paymentIntent.id, error: paymentIntent.last_payment_error },
    timestamp: new Date().toISOString(),
  });
}

async function handlePayoutSuccess(payout: any, supabaseClient: any) {
  await supabaseClient
    .from('prize_redemptions')
    .update({ status: 'completed' })
    .eq('stripe_payout_id', payout.id);

  // Log security event
  await supabaseClient.from('security_logs').insert({
    event_type: 'payout_success',
    user_id: payout.metadata.user_id,
    details: { payout_id: payout.id, amount: payout.amount },
    timestamp: new Date().toISOString(),
  });
}

async function handlePayoutFailure(payout: any, supabaseClient: any) {
  await supabaseClient
    .from('prize_redemptions')
    .update({ status: 'failed' })
    .eq('stripe_payout_id', payout.id);

  // Refund VP to user
  const { data: redemption } = await supabaseClient
    .from('prize_redemptions')
    .select('user_id, amount')
    .eq('stripe_payout_id', payout.id)
    .single();

  if (redemption) {
    const vpAmount = Math.floor(redemption.amount * 100);
    await supabaseClient.rpc('award_vp_for_action', {
      p_user_id: redemption.user_id,
      p_action_type: 'payout_refund',
      p_action_id: payout.id,
      p_is_sponsored: false,
    });
  }

  // Log security event
  await supabaseClient.from('security_logs').insert({
    event_type: 'payout_failure',
    user_id: payout.metadata.user_id,
    details: { payout_id: payout.id, failure_code: payout.failure_code },
    timestamp: new Date().toISOString(),
  });
}

async function handleSubscriptionUpdate(subscription: any, supabaseClient: any) {
  const userId = subscription.metadata.user_id;

  await supabaseClient
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    });
}

async function handleSubscriptionCancellation(subscription: any, supabaseClient: any) {
  await supabaseClient
    .from('subscriptions')
    .update({ status: 'canceled', canceled_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subscription.id);
}