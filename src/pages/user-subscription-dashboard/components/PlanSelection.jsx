import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { subscriptionService } from '../../../services/subscriptionService';
import { useAuth } from '../../../contexts/AuthContext';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const PlanSelection = ({ currentSubscription, availablePlans, onPlanSelected }) => {
  const { user, userProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState('');
  const HCAPTCHA_SITE_KEY = import.meta.env?.VITE_HCAPTCHA_SITE_KEY;
  const hcaptchaEnabled =
    HCAPTCHA_SITE_KEY && HCAPTCHA_SITE_KEY !== 'your-hcaptcha-site-key-here';

  const handleSelectPlan = async (plan) => {
    if (currentSubscription?.planId === plan?.id) {
      alert('This is your current plan');
      return;
    }
    if (hcaptchaEnabled && !captchaToken) {
      setCaptchaError('Complete captcha verification to continue with plan changes.');
      return;
    }

    try {
      setLoading(true);
      setCaptchaError('');
      setSelectedPlan(plan);

      if (currentSubscription) {
        // Upgrade/Downgrade existing subscription
        const result = await subscriptionService?.updateSubscription(
          currentSubscription?.stripeSubscriptionId,
          plan?.id
        );
        
        if (result?.error) {
          alert(`Error: ${result?.error?.message}`);
        } else {
          alert('Subscription updated successfully!');
          onPlanSelected();
        }
      } else {
        // Create new subscription
        const result = await subscriptionService?.createCheckoutSession(
          plan?.id,
          user?.id,
          userProfile?.email
        );

        if (result?.error) {
          alert(`Error: ${result?.error?.message}`);
        } else if (result?.data?.url) {
          window.location.href = result?.data?.url;
        }
      }
    } catch (error) {
      console.error('Plan selection error:', error);
      alert('Failed to process plan change');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const getPlanComparison = (plan) => {
    if (!currentSubscription) return null;
    
    const currentPrice = parseFloat(currentSubscription?.subscriptionPlans?.price);
    const newPrice = parseFloat(plan?.price);
    const difference = newPrice - currentPrice;
    
    if (difference > 0) {
      return {
        type: 'upgrade',
        label: 'Upgrade',
        color: 'text-green-600',
        icon: 'TrendingUp',
        message: `+${subscriptionService?.formatCurrency(difference)}/cycle`
      };
    } else if (difference < 0) {
      return {
        type: 'downgrade',
        label: 'Downgrade',
        color: 'text-blue-600',
        icon: 'TrendingDown',
        message: `${subscriptionService?.formatCurrency(difference)}/cycle`
      };
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Package" className="w-5 h-5 text-primary" />
            Choose Your Plan
          </h2>
          <Button
            onClick={() => setShowComparison(!showComparison)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Icon name="GitCompare" className="w-4 h-4" />
            {showComparison ? 'Hide' : 'Show'} Comparison
          </Button>
        </div>
        {hcaptchaEnabled && (
          <div className="mb-4">
            <div className="flex justify-center">
              <HCaptcha
                sitekey={HCAPTCHA_SITE_KEY}
                onVerify={(token) => {
                  setCaptchaToken(token);
                  setCaptchaError('');
                }}
                onExpire={() => setCaptchaToken(null)}
                theme="dark"
              />
            </div>
            {captchaError && (
              <p className="text-sm text-red-600 mt-2 text-center">{captchaError}</p>
            )}
          </div>
        )}

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availablePlans?.map((plan) => {
            const comparison = getPlanComparison(plan);
            const isCurrentPlan = currentSubscription?.planId === plan?.id;
            const isProcessing = loading && selectedPlan?.id === plan?.id;

            return (
              <div
                key={plan?.id}
                className={`relative p-6 rounded-lg border-2 transition-all ${
                  isCurrentPlan
                    ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-medium">
                      Current Plan
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {plan?.planName}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {plan?.planType} Plan
                  </p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {subscriptionService?.formatCurrency(plan?.price)?.split('.')?.[0]}
                    </span>
                    <span className="text-muted-foreground">
                      / {plan?.duration?.replace('_', ' ')}
                    </span>
                  </div>
                  {comparison && (
                    <div className={`flex items-center gap-1 mt-2 ${comparison?.color}`}>
                      <Icon name={comparison?.icon} className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {comparison?.label}: {comparison?.message}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-3 mb-6">
                  {plan?.features?.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Icon name="Check" className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan || isProcessing}
                  className="w-full"
                  variant={isCurrentPlan ? 'outline' : 'default'}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : comparison ? (
                    comparison?.label
                  ) : (
                    'Select Plan'
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        {showComparison && (
          <div className="mt-8 overflow-x-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">Feature Comparison</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Feature</th>
                  {availablePlans?.map((plan) => (
                    <th key={plan?.id} className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                      {plan?.planName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-foreground">Price</td>
                  {availablePlans?.map((plan) => (
                    <td key={plan?.id} className="text-center py-3 px-4 text-sm font-medium text-foreground">
                      {subscriptionService?.formatCurrency(plan?.price)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-foreground">Billing Cycle</td>
                  {availablePlans?.map((plan) => (
                    <td key={plan?.id} className="text-center py-3 px-4 text-sm text-foreground capitalize">
                      {plan?.duration?.replace('_', ' ')}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanSelection;