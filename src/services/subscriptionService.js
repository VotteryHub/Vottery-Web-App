import { supabase } from '../lib/supabase';

const STRIPE_PUBLISHABLE_KEY = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY;
const STRIPE_SECRET_KEY = import.meta.env?.STRIPE_SECRET_KEY;

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toSnakeCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const snakeKey = key?.replace(/[A-Z]/g, letter => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

export const subscriptionService = {
  // Get all active subscription plans
  async getSubscriptionPlans() {
    try {
      const { data, error } = await supabase
        ?.from('subscription_plans')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('price', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get user's current subscription
  async getUserSubscription(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_subscriptions')
        ?.select(`
          *,
          plan:plan_id(
            id,
            plan_name,
            plan_type,
            price,
            duration,
            features
          )
        `)
        ?.eq('user_id', userId)
        ?.eq('is_active', true)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Create Stripe customer
  async createStripeCustomer(userId, email, name) {
    try {
      const response = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email,
          name,
          metadata: JSON.stringify({ userId })
        })
      });

      const customer = await response?.json();
      
      if (!response?.ok) {
        throw new Error(customer?.error?.message || 'Failed to create Stripe customer');
      }

      // Store Stripe customer ID in user profile
      const { error: updateError } = await supabase
        ?.from('user_profiles')
        ?.update({ stripe_customer_id: customer?.id })
        ?.eq('id', userId);

      if (updateError) throw updateError;

      return { data: customer, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Create Stripe checkout session for subscription
  async createSubscriptionCheckout(planId, userId, successUrl, cancelUrl) {
    try {
      // Get plan details
      const { data: plan, error: planError } = await supabase
        ?.from('subscription_plans')
        ?.select('*')
        ?.eq('id', planId)
        ?.single();

      if (planError) throw planError;

      // Get user details
      const { data: user, error: userError } = await supabase
        ?.from('user_profiles')
        ?.select('email, name, stripe_customer_id')
        ?.eq('id', userId)
        ?.single();

      if (userError) throw userError;

      // Create or get Stripe customer
      let customerId = user?.stripe_customer_id;
      if (!customerId) {
        const { data: customer, error: customerError } = await this.createStripeCustomer(
          userId,
          user?.email,
          user?.name
        );
        if (customerError) throw customerError;
        customerId = customer?.id;
      }

      // Determine billing interval
      let interval = 'month';
      let intervalCount = 1;
      
      switch (plan?.duration) {
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
          throw new Error('Invalid subscription duration');
      }

      // Create Stripe checkout session
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          customer: customerId,
          mode: 'subscription',
          'line_items[0][price_data][currency]': 'usd',
          'line_items[0][price_data][product_data][name]': plan?.plan_name,
          'line_items[0][price_data][unit_amount]': Math.round(plan?.price * 100),
          'line_items[0][price_data][recurring][interval]': interval,
          'line_items[0][price_data][recurring][interval_count]': intervalCount,
          'line_items[0][quantity]': 1,
          success_url: successUrl,
          cancel_url: cancelUrl,
          'metadata[user_id]': userId,
          'metadata[plan_id]': planId,
        })
      });

      const session = await response?.json();
      
      if (!response?.ok) {
        throw new Error(session?.error?.message || 'Failed to create checkout session');
      }

      return { data: session, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      // Get subscription details
      const { data: subscription, error: subError } = await supabase
        ?.from('user_subscriptions')
        ?.select('stripe_subscription_id')
        ?.eq('id', subscriptionId)
        ?.single();

      if (subError) throw subError;

      // Cancel in Stripe
      const response = await fetch(
        `https://api.stripe.com/v1/subscriptions/${subscription?.stripe_subscription_id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          },
        }
      );

      const canceledSubscription = await response?.json();
      
      if (!response?.ok) {
        throw new Error(canceledSubscription?.error?.message || 'Failed to cancel subscription');
      }

      // Update in database
      const { error: updateError } = await supabase
        ?.from('user_subscriptions')
        ?.update({
          is_active: false,
          auto_renew: false,
          end_date: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', subscriptionId);

      if (updateError) throw updateError;

      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update subscription (upgrade/downgrade)
  async updateSubscription(subscriptionId, newPlanId) {
    try {
      // Get current subscription
      const { data: currentSub, error: subError } = await supabase
        ?.from('user_subscriptions')
        ?.select('stripe_subscription_id, user_id')
        ?.eq('id', subscriptionId)
        ?.single();

      if (subError) throw subError;

      // Get new plan details
      const { data: newPlan, error: planError } = await supabase
        ?.from('subscription_plans')
        ?.select('*')
        ?.eq('id', newPlanId)
        ?.single();

      if (planError) throw planError;

      // Get Stripe subscription
      const getResponse = await fetch(
        `https://api.stripe.com/v1/subscriptions/${currentSub?.stripe_subscription_id}`,
        {
          headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          },
        }
      );

      const stripeSubscription = await getResponse?.json();
      
      if (!getResponse?.ok) {
        throw new Error(stripeSubscription?.error?.message || 'Failed to get subscription');
      }

      // Determine new billing interval
      let interval = 'month';
      let intervalCount = 1;
      
      switch (newPlan?.duration) {
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
      }

      // Update subscription in Stripe
      const updateResponse = await fetch(
        `https://api.stripe.com/v1/subscriptions/${currentSub?.stripe_subscription_id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'items[0][id]': stripeSubscription?.items?.data[0]?.id,
            'items[0][price_data][currency]': 'usd',
            'items[0][price_data][product_data][name]': newPlan?.plan_name,
            'items[0][price_data][unit_amount]': Math.round(newPlan?.price * 100),
            'items[0][price_data][recurring][interval]': interval,
            'items[0][price_data][recurring][interval_count]': intervalCount,
            proration_behavior: 'create_prorations',
          })
        }
      );

      const updatedSubscription = await updateResponse?.json();
      
      if (!updateResponse?.ok) {
        throw new Error(updatedSubscription?.error?.message || 'Failed to update subscription');
      }

      // Update in database
      const { error: updateError } = await supabase
        ?.from('user_subscriptions')
        ?.update({
          plan_id: newPlanId,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', subscriptionId);

      if (updateError) throw updateError;

      return { data: updatedSubscription, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get subscription analytics (admin)
  async getSubscriptionAnalytics(startDate, endDate) {
    try {
      // Get all subscriptions in date range
      const { data: subscriptions, error: subError } = await supabase
        ?.from('user_subscriptions')
        ?.select(`
          *,
          plan:plan_id(
            plan_name,
            plan_type,
            price,
            duration
          ),
          user:user_id(
            name,
            email,
            country
          )
        `)
        ?.gte('created_at', startDate)
        ?.lte('created_at', endDate);

      if (subError) throw subError;

      // Calculate MRR (Monthly Recurring Revenue)
      const mrr = subscriptions?.reduce((sum, sub) => {
        if (!sub?.is_active) return sum;
        
        const price = parseFloat(sub?.plan?.price || 0);
        let monthlyValue = 0;
        
        switch (sub?.plan?.duration) {
          case 'monthly':
            monthlyValue = price;
            break;
          case '3_months':
            monthlyValue = price / 3;
            break;
          case 'half_yearly':
            monthlyValue = price / 6;
            break;
          case 'annual':
            monthlyValue = price / 12;
            break;
        }
        
        return sum + monthlyValue;
      }, 0) || 0;

      // Calculate churn rate
      const totalSubscriptions = subscriptions?.length || 0;
      const canceledSubscriptions = subscriptions?.filter(s => !s?.is_active)?.length || 0;
      const churnRate = totalSubscriptions > 0 ? (canceledSubscriptions / totalSubscriptions) * 100 : 0;

      // Calculate average revenue per user
      const totalRevenue = subscriptions?.reduce((sum, sub) => {
        return sum + parseFloat(sub?.plan?.price || 0);
      }, 0) || 0;
      const arpu = totalSubscriptions > 0 ? totalRevenue / totalSubscriptions : 0;

      // Group by plan type
      const byPlanType = subscriptions?.reduce((acc, sub) => {
        const type = sub?.plan?.plan_type || 'unknown';
        if (!acc?.[type]) {
          acc[type] = { count: 0, revenue: 0 };
        }
        acc[type].count++;
        acc[type].revenue += parseFloat(sub?.plan?.price || 0);
        return acc;
      }, {});

      // Group by duration
      const byDuration = subscriptions?.reduce((acc, sub) => {
        const duration = sub?.plan?.duration || 'unknown';
        if (!acc?.[duration]) {
          acc[duration] = { count: 0, revenue: 0 };
        }
        acc[duration].count++;
        acc[duration].revenue += parseFloat(sub?.plan?.price || 0);
        return acc;
      }, {});

      // Group by country
      const byCountry = subscriptions?.reduce((acc, sub) => {
        const country = sub?.user?.country || 'Unknown';
        if (!acc?.[country]) {
          acc[country] = { count: 0, revenue: 0 };
        }
        acc[country].count++;
        acc[country].revenue += parseFloat(sub?.plan?.price || 0);
        return acc;
      }, {});

      return {
        data: {
          mrr: mrr?.toFixed(2),
          totalSubscriptions,
          activeSubscriptions: subscriptions?.filter(s => s?.is_active)?.length || 0,
          canceledSubscriptions,
          churnRate: churnRate?.toFixed(2),
          totalRevenue: totalRevenue?.toFixed(2),
          arpu: arpu?.toFixed(2),
          byPlanType,
          byDuration,
          byCountry,
          subscriptions: toCamelCase(subscriptions)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get customer lifecycle metrics
  async getCustomerLifecycleMetrics() {
    try {
      // Get all subscriptions
      const { data: subscriptions, error } = await supabase
        ?.from('user_subscriptions')
        ?.select(`
          *,
          plan:plan_id(price, duration)
        `);

      if (error) throw error;

      // Calculate customer lifetime value
      const ltv = subscriptions?.reduce((sum, sub) => {
        return sum + parseFloat(sub?.plan?.price || 0);
      }, 0) / (subscriptions?.length || 1);

      // Calculate retention rate (active vs total)
      const activeCount = subscriptions?.filter(s => s?.is_active)?.length || 0;
      const retentionRate = (activeCount / (subscriptions?.length || 1)) * 100;

      // Calculate average subscription duration
      const avgDuration = subscriptions?.reduce((sum, sub) => {
        const start = new Date(sub?.start_date);
        const end = sub?.end_date ? new Date(sub?.end_date) : new Date();
        const days = (end - start) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0) / (subscriptions?.length || 1);

      return {
        data: {
          customerLifetimeValue: ltv?.toFixed(2),
          retentionRate: retentionRate?.toFixed(2),
          averageSubscriptionDays: Math.round(avgDuration),
          totalCustomers: subscriptions?.length || 0,
          activeCustomers: activeCount
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get payment analytics
  async getPaymentAnalytics(startDate, endDate) {
    try {
      // This would integrate with Stripe's payment intent data
      // For now, we'll use subscription data as proxy
      const { data: subscriptions, error } = await supabase
        ?.from('user_subscriptions')
        ?.select(`
          *,
          plan:plan_id(price)
        `)
        ?.gte('created_at', startDate)
        ?.lte('created_at', endDate);

      if (error) throw error;

      const successfulPayments = subscriptions?.filter(s => s?.is_active)?.length || 0;
      const totalAttempts = subscriptions?.length || 0;
      const successRate = totalAttempts > 0 ? (successfulPayments / totalAttempts) * 100 : 0;

      return {
        data: {
          totalPayments: totalAttempts,
          successfulPayments,
          failedPayments: totalAttempts - successfulPayments,
          successRate: successRate?.toFixed(2),
          totalRevenue: subscriptions?.reduce((sum, s) => {
            return sum + parseFloat(s?.plan?.price || 0);
          }, 0)?.toFixed(2)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Reactivate canceled subscription
  async reactivateSubscription(userId, planId) {
    try {
      const { data: user, error: userError } = await supabase
        ?.from('user_profiles')
        ?.select('stripe_customer_id')
        ?.eq('id', userId)
        ?.single();

      if (userError) throw userError;

      // Create new checkout session for reactivation
      return await this.createSubscriptionCheckout(
        planId,
        userId,
        `${window.location?.origin}/subscription-success`,
        `${window.location?.origin}/subscription-canceled`
      );
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};