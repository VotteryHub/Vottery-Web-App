import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.10.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { getCorsHeaders } from '../shared/corsConfig.ts';
import {
  getClientIp,
  logSqlInjectionEvent,
  scanPayloadForSqlInjection,
} from '../shared/sqlInjectionDetection.ts';
import { enforceUserEndpointHourlyLimit } from '../shared/userEndpointRateLimit.ts';

// Add this block - Declare Deno types for TypeScript compatibility
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const body = await req.json();
    const clientIp = getClientIp(req);
    const sqli = scanPayloadForSqlInjection(body);
    if (sqli.blocking) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: null,
        endpoint: '/create-subscription-checkout',
        result: sqli,
        blocked: true,
      });
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (sqli.hit) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: null,
        endpoint: '/create-subscription-checkout',
        result: sqli,
        blocked: false,
      });
    }

    const { planId, userId, email } = body;

    if (!planId || !userId || !email) {
      throw new Error('Missing required fields: planId, userId, email');
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user || user.id !== userId) {
      throw new Error('Unauthorized: userId must match session');
    }

    const rl = await enforceUserEndpointHourlyLimit(
      userClient,
      user.id,
      '/create-subscription-checkout',
      30
    );
    if (!rl.allowed) {
      return new Response(JSON.stringify({ error: 'Checkout rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get subscription plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      throw new Error('Subscription plan not found');
    }

    // Get or create Stripe customer
    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    let customerId = wallet?.stripe_customer_id;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          user_id: userId
        }
      });

      customerId = customer.id;

      // Update wallet with customer ID
      await supabase
        .from('user_wallets')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userId);
    }

    // Create Stripe Price if not exists
    const priceAmount = Math.round(parseFloat(plan.price) * 100); // Convert to cents
    
    let interval = 'month';
    let intervalCount = 1;
    
    switch (plan.duration) {
      case 'monthly':
        interval = 'month';
        intervalCount = 1;
        break;
      case '3_months':
        interval = 'month';
        intervalCount = 3;
        break;
      case 'half_yearly':
        interval = 'month';
        intervalCount = 6;
        break;
      case 'annual':
        interval = 'year';
        intervalCount = 1;
        break;
      default:
        interval = 'month';
        intervalCount = 1;
    }

    const price = await stripe.prices.create({
      unit_amount: priceAmount,
      currency: 'usd',
      recurring: {
        interval: interval as 'month' | 'year',
        interval_count: intervalCount
      },
      product_data: {
        name: plan.plan_name,
        description: `${plan.plan_type} subscription - ${plan.duration}`
      }
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/user-subscription-dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/user-subscription-dashboard?canceled=true`,
      metadata: {
        user_id: userId,
        plan_id: planId
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_id: planId,
          subscriber_type: plan.plan_type
        }
      }
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});