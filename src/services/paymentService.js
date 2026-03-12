import { supabase } from '../lib/supabase';
import { revenueShareService } from './revenueShareService';

export const paymentService = {
  async createPaymentIntent(redemptionData, customerInfo) {
    try {
      // Calculate revenue split if creator payout
      let splitInfo = null;
      if (redemptionData?.creatorId && redemptionData?.totalAmount) {
        const splitResult = await revenueShareService?.calculateRevenueSplit(
          redemptionData?.creatorId,
          redemptionData?.totalAmount
        );
        
        if (splitResult?.data) {
          splitInfo = splitResult?.data;
        }
      }

      const { data, error } = await supabase?.functions?.invoke('create-payment-intent', {
        body: {
          redemptionData: {
            ...redemptionData,
            splitInfo // Include split information for payment processing
          },
          customerInfo
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to create payment intent' } };
    }
  },

  async confirmPayment(paymentIntentId) {
    try {
      const { data, error } = await supabase?.functions?.invoke('confirm-payment', {
        body: { paymentIntentId }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to confirm payment' } };
    }
  },

  formatAmount(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(amount);
  },

  getStripePublishableKey() {
    return import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY;
  }
};