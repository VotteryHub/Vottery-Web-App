import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { subscriptionService } from '../../../services/subscriptionService';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const SubscriptionControls = ({ subscription, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState('');
  const HCAPTCHA_SITE_KEY = import.meta.env?.VITE_HCAPTCHA_SITE_KEY;
  const hcaptchaEnabled =
    HCAPTCHA_SITE_KEY && HCAPTCHA_SITE_KEY !== 'your-hcaptcha-site-key-here';

  const handleToggleAutoRenew = async () => {
    if (!subscription) return;
    if (hcaptchaEnabled && !captchaToken) {
      setCaptchaError('Complete captcha verification to update subscription controls.');
      return;
    }

    try {
      setLoading(true);
      setCaptchaError('');
      const result = await subscriptionService?.toggleAutoRenewal(
        subscription?.id,
        !subscription?.autoRenew
      );

      if (result?.error) {
        alert(`Error: ${result?.error?.message}`);
      } else {
        alert(`Auto-renewal ${!subscription?.autoRenew ? 'enabled' : 'disabled'} successfully`);
        onUpdate();
      }
    } catch (error) {
      console.error('Toggle auto-renew error:', error);
      alert('Failed to update auto-renewal setting');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.stripeSubscriptionId) {
      alert('No active subscription to cancel');
      return;
    }
    if (hcaptchaEnabled && !captchaToken) {
      setCaptchaError('Complete captcha verification to cancel subscription.');
      return;
    }

    try {
      setLoading(true);
      setCaptchaError('');
      const result = await subscriptionService?.cancelSubscription(
        subscription?.stripeSubscriptionId
      );

      if (result?.error) {
        alert(`Error: ${result?.error?.message}`);
      } else {
        alert('Subscription canceled successfully. You can continue using it until the end of the billing period.');
        setShowCancelDialog(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      alert('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const handlePauseSubscription = async () => {
    if (!subscription) return;
    if (hcaptchaEnabled && !captchaToken) {
      setCaptchaError('Complete captcha verification to pause subscription.');
      return;
    }

    try {
      setLoading(true);
      setCaptchaError('');
      const result = await subscriptionService?.toggleAutoRenewal(
        subscription?.id,
        false
      );

      if (result?.error) {
        alert(`Error: ${result?.error?.message}`);
      } else {
        alert('Subscription pause scheduled: auto-renewal disabled.');
        onUpdate();
      }
    } catch (error) {
      console.error('Pause subscription error:', error);
      alert('Failed to pause subscription');
    } finally {
      setLoading(false);
    }
  };

  if (!subscription) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No active subscription to manage</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Icon name="Settings" className="w-5 h-5 text-primary" />
          Subscription Controls
        </h2>
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

        {/* Auto-Renewal Control */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border mb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="RefreshCw" className="w-5 h-5 text-primary" />
                <h3 className="font-medium text-foreground">Auto-Renewal</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {subscription?.autoRenew
                  ? 'Your subscription will automatically renew at the end of the billing period.' :'Your subscription will not renew automatically. You will need to manually renew it.'}
              </p>
              <Button
                onClick={handleToggleAutoRenew}
                disabled={loading}
                variant={subscription?.autoRenew ? 'outline' : 'default'}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Updating...
                  </>
                ) : subscription?.autoRenew ? (
                  <>
                    <Icon name="X" className="w-4 h-4" />
                    Disable Auto-Renewal
                  </>
                ) : (
                  <>
                    <Icon name="Check" className="w-4 h-4" />
                    Enable Auto-Renewal
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Pause Subscription */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border mb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Pause" className="w-5 h-5 text-orange-600" />
                <h3 className="font-medium text-foreground">Pause Subscription</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Temporarily pause your subscription for up to 3 months. Your data will be preserved.
              </p>
              <Button
                onClick={handlePauseSubscription}
                variant="outline"
                className="flex items-center gap-2"
                disabled={loading || !subscription?.autoRenew}
              >
                <Icon name="Pause" className="w-4 h-4" />
                {subscription?.autoRenew ? 'Pause Subscription' : 'Already Paused'}
              </Button>
            </div>
          </div>
        </div>

        {/* Cancel Subscription */}
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="AlertTriangle" className="w-5 h-5 text-red-600" />
                <h3 className="font-medium text-red-900">Cancel Subscription</h3>
              </div>
              <p className="text-sm text-red-800 mb-3">
                Cancel your subscription. You'll continue to have access until the end of your current billing period.
              </p>
              <Button
                onClick={() => setShowCancelDialog(true)}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-100"
              >
                <Icon name="XCircle" className="w-4 h-4" />
                Cancel Subscription
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Icon name="AlertTriangle" className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Cancel Subscription?</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to cancel your subscription? You'll continue to have access until{' '}
              <strong>{new Date(subscription?.endDate)?.toLocaleDateString()}</strong>.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCancelDialog(false)}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Keep Subscription
              </Button>
              <Button
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Canceling...
                  </>
                ) : (
                  'Yes, Cancel'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionControls;