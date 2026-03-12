import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { subscriptionService } from '../../../services/subscriptionService';
import { useAuth } from '../../../contexts/AuthContext';

const CheckoutSessionPanel = ({ plans, onRefresh }) => {
  const { user, userProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const handleCreateCheckout = async () => {
    if (!selectedPlan || !testEmail) {
      alert('Please select a plan and enter test email');
      return;
    }

    try {
      setLoading(true);
      const result = await subscriptionService?.createCheckoutSession(
        selectedPlan?.id,
        user?.id,
        testEmail
      );

      if (result?.error) {
        alert(`Error: ${result?.error?.message}`);
      } else if (result?.data?.url) {
        window.open(result?.data?.url, '_blank');
        onRefresh();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="ShoppingCart" className="w-5 h-5 text-primary" />
          Checkout Session Management
        </h2>

        {/* Test Checkout Creator */}
        <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
          <h3 className="font-medium text-foreground mb-3">Create Test Checkout Session</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Test Email
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e?.target?.value)}
                placeholder="customer@example.com"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Plan
              </label>
              <select
                value={selectedPlan?.id || ''}
                onChange={(e) => {
                  const plan = plans?.find(p => p?.id === e?.target?.value);
                  setSelectedPlan(plan);
                }}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a plan...</option>
                {plans?.map((plan) => (
                  <option key={plan?.id} value={plan?.id}>
                    {plan?.planName} - {subscriptionService?.formatCurrency(plan?.price)} / {plan?.duration}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleCreateCheckout}
              disabled={loading || !selectedPlan || !testEmail}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Session...
                </>
              ) : (
                <>
                  <Icon name="ExternalLink" className="w-4 h-4" />
                  Create Checkout Session
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Available Plans */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Available Subscription Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans?.map((plan) => (
              <div key={plan?.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{plan?.planName}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{plan?.planType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {subscriptionService?.formatCurrency(plan?.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">{plan?.duration}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {plan?.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                      <Icon name="Check" className="w-4 h-4 text-green-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSessionPanel;