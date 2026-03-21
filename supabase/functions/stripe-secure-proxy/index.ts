import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.87.1';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { getCorsHeaders } from '../shared/corsConfig.ts';
import {
  getClientIp,
  logSqlInjectionEvent,
  scanPayloadForSqlInjection,
} from '../shared/sqlInjectionDetection.ts';
import { enforceUserEndpointHourlyLimit } from '../shared/userEndpointRateLimit.ts';

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const clientIp = getClientIp(req);
    const sqli = scanPayloadForSqlInjection(body);
    if (sqli.blocking) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: user.id,
        endpoint: '/stripe-secure-proxy',
        result: sqli,
        blocked: true,
      });
      return new Response(
        JSON.stringify({ error: 'Invalid request payload.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (sqli.hit) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: user.id,
        endpoint: '/stripe-secure-proxy',
        result: sqli,
        blocked: false,
      });
    }

    const rl = await enforceUserEndpointHourlyLimit(
      supabaseClient,
      user.id,
      '/stripe-secure-proxy',
      120
    );
    if (!rl.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded for payment actions. Try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, payload } = body;

    let response;

    switch (action) {
      case 'create_payment_intent':
        response = await createPaymentIntent(stripe, user.id, payload, supabaseClient);
        break;
      case 'create_payout':
        response = await createPayout(stripe, user.id, payload, supabaseClient);
        break;
      case 'create_customer':
        response = await createCustomer(stripe, user, payload, supabaseClient);
        break;
      case 'attach_payment_method':
        response = await attachPaymentMethod(stripe, user.id, payload, supabaseClient);
        break;
      case 'create_subscription':
        response = await createSubscription(stripe, user.id, payload, supabaseClient);
        break;
      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function createPaymentIntent(
  stripe: Stripe,
  userId: string,
  payload: any,
  supabaseClient: any
) {
  // Validate amount
  if (!payload.amount || payload.amount < 50) {
    throw new Error('Invalid amount. Minimum $0.50');
  }

  // Get or create Stripe customer
  const { data: profile } = await supabaseClient
    .from('user_profiles')
    .select('stripe_customer_id, email')
    .eq('id', userId)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email,
      metadata: { user_id: userId },
    });
    customerId = customer.id;

    await supabaseClient
      .from('user_profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', userId);
  }

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: payload.amount,
    currency: payload.currency || 'usd',
    customer: customerId,
    metadata: {
      user_id: userId,
      purpose: payload.purpose || 'vp_purchase',
    },
  });

  // Log transaction
  await supabaseClient.from('wallet_transactions').insert({
    user_id: userId,
    transaction_type: 'purchase',
    amount: payload.amount / 100,
    currency: payload.currency || 'usd',
    stripe_payment_intent_id: paymentIntent.id,
    status: 'pending',
  });

  return { clientSecret: paymentIntent.client_secret };
}

async function createPayout(
  stripe: Stripe,
  userId: string,
  payload: any,
  supabaseClient: any
) {
  // Validate payout request (amount in cents; min $10)
  if (!payload.amount || payload.amount < 1000) {
    throw new Error('Minimum payout amount is $10.00');
  }

  const amountCents = payload.amount;
  const amountDollars = amountCents / 100;

  // Load profile: balance, Stripe, and country for country-based revenue split
  const { data: profile } = await supabaseClient
    .from('user_profiles')
    .select('vp_balance, stripe_account_id, country_code, country_iso')
    .eq('id', userId)
    .single();

  const wallet = profile;
  if (!wallet?.stripe_account_id) {
    throw new Error('Stripe account not connected. Please complete payout setup.');
  }

  // Verify sufficient balance (assuming 1 VP = $0.01)
  const requiredVP = amountCents / 10;
  if ((wallet.vp_balance ?? 0) < requiredVP) {
    throw new Error('Insufficient VP balance');
  }

  // Country-based payout calculation: get split for audit trail
  const countryCode = wallet.country_code ?? wallet.country_iso ?? null;
  let splitAudit: { creator_percentage?: number; platform_percentage?: number; split_source?: string } = {};
  try {
    const { data: splitRows } = await supabaseClient.rpc('calculate_revenue_split_with_country', {
      p_creator_id: userId,
      p_total_amount: amountDollars,
      p_country_code: countryCode,
    });
    const row = Array.isArray(splitRows) ? splitRows[0] : splitRows;
    if (row && typeof row.creator_percentage === 'number' && typeof row.platform_percentage === 'number') {
      splitAudit = {
        creator_percentage: row.creator_percentage,
        platform_percentage: row.platform_percentage,
        split_source: row.split_source ?? null,
      };
    }
  } catch (_) {
    // Non-fatal: proceed with payout; audit columns may stay null
  }

  // Create payout
  const payout = await stripe.payouts.create(
    {
      amount: amountCents,
      currency: 'usd',
      metadata: {
        user_id: userId,
      },
    },
    {
      stripeAccount: wallet.stripe_account_id,
    }
  );

  // Deduct VP using secure server-side function
  await supabaseClient.rpc('deduct_vp', {
    p_user_id: userId,
    p_amount: requiredVP,
    p_reason: 'payout',
    p_reference_id: payout.id,
  });

  // Log payout with country and split audit (priority hierarchy + audit trail)
  const insertPayload: Record<string, unknown> = {
    user_id: userId,
    redemption_type: 'cash',
    amount: amountDollars,
    stripe_payout_id: payout.id,
    status: 'processing',
    country_code: countryCode,
    creator_percentage: splitAudit.creator_percentage ?? null,
    platform_percentage: splitAudit.platform_percentage ?? null,
    split_source: splitAudit.split_source ?? null,
  };
  // wallet_id may be required; try to resolve one
  const { data: walletRow } = await supabaseClient.from('user_wallets').select('id').eq('user_id', userId).limit(1).single();
  if (walletRow?.id) insertPayload.wallet_id = walletRow.id;
  if (insertPayload.amount != null) {
    insertPayload.final_amount = insertPayload.amount;
    insertPayload.conversion_rate = 1.0;
  }

  await supabaseClient.from('prize_redemptions').insert(insertPayload);
  return { payout };
}

async function createCustomer(
  stripe: Stripe,
  user: any,
  payload: any,
  supabaseClient: any
) {
  const customer = await stripe.customers.create({
    email: user.email,
    name: payload.name,
    metadata: { user_id: user.id },
  });

  await supabaseClient
    .from('user_profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', user.id);

  return { customer };
}

async function attachPaymentMethod(
  stripe: Stripe,
  userId: string,
  payload: any,
  supabaseClient: any
) {
  const { data: profile } = await supabaseClient
    .from('user_profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (!profile?.stripe_customer_id) {
    throw new Error('Customer not found');
  }

  const paymentMethod = await stripe.paymentMethods.attach(
    payload.payment_method_id,
    { customer: profile.stripe_customer_id }
  );

  // Set as default if requested
  if (payload.set_default) {
    await stripe.customers.update(profile.stripe_customer_id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });
  }

  // Store in database
  await supabaseClient.from('payment_methods').insert({
    user_id: userId,
    stripe_payment_method_id: paymentMethod.id,
    type: paymentMethod.type,
    last4: paymentMethod.card?.last4,
    brand: paymentMethod.card?.brand,
    exp_month: paymentMethod.card?.exp_month,
    exp_year: paymentMethod.card?.exp_year,
    is_default: payload.set_default || false,
  });

  return { paymentMethod };
}

async function createSubscription(
  stripe: Stripe,
  userId: string,
  payload: any,
  supabaseClient: any
) {
  const { data: profile } = await supabaseClient
    .from('user_profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (!profile?.stripe_customer_id) {
    throw new Error('Customer not found');
  }

  const subscription = await stripe.subscriptions.create({
    customer: profile.stripe_customer_id,
    items: [{ price: payload.price_id }],
    metadata: { user_id: userId },
  });

  // Store subscription
  await supabaseClient.from('subscriptions').insert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: payload.price_id,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
  });

  return { subscription };
}