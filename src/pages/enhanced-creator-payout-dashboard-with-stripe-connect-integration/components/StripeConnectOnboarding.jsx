import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const StripeConnectOnboarding = ({ stripeStatus, onStatusChange, userId }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(stripeStatus === 'active' ? 3 : stripeStatus === 'pending' ? 2 : 1);

  const steps = [
    { id: 1, label: 'Create Express Account', icon: 'UserPlus', description: 'Set up your Stripe Express account via /v1/accounts API' },
    { id: 2, label: 'Verify Identity', icon: 'Shield', description: 'Complete identity verification and bank account setup' },
    { id: 3, label: 'Account Active', icon: 'CheckCircle', description: 'Your account is verified and ready to receive payouts' }
  ];

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      // Simulate Stripe Connect Express account creation via /v1/accounts
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockAccountId = `acct_${Math.random()?.toString(36)?.substr(2, 16)}`;
      localStorage.setItem('stripe_connect_account_id', mockAccountId);
      localStorage.setItem('stripe_connect_status', 'pending');
      onStatusChange('pending');
      setStep(2);
    } catch (err) {
      console.error('Failed to create account:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteVerification = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.setItem('stripe_connect_status', 'active');
      onStatusChange('active');
      setStep(3);
    } catch (err) {
      console.error('Failed to verify:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-foreground mb-6">Stripe Connect Express Onboarding</h3>
        <div className="flex items-center justify-between mb-8">
          {steps?.map((s, i) => (
            <React.Fragment key={s?.id}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  step >= s?.id
                    ? 'bg-primary border-primary text-white' :'border-gray-300 text-gray-400'
                }`}>
                  {step > s?.id ? (
                    <Icon name="Check" size={20} />
                  ) : (
                    <Icon name={s?.icon} size={20} />
                  )}
                </div>
                <span className={`text-xs font-medium text-center max-w-20 ${
                  step >= s?.id ? 'text-primary' : 'text-muted-foreground'
                }`}>{s?.label}</span>
              </div>
              {i < steps?.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  step > s?.id ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CreditCard" size={32} className="text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-foreground mb-2">Create Your Stripe Express Account</h4>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Connect your bank account to receive creator payouts. We use Stripe Connect Express for secure, fast payments.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <p className="text-sm font-medium text-foreground mb-2">What you'll need:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Icon name="Check" size={14} className="text-green-500" /> Government-issued ID</li>
                <li className="flex items-center gap-2"><Icon name="Check" size={14} className="text-green-500" /> Bank account details</li>
                <li className="flex items-center gap-2"><Icon name="Check" size={14} className="text-green-500" /> Tax information (SSN/EIN)</li>
              </ul>
            </div>
            <button
              onClick={handleCreateAccount}
              disabled={loading}
              className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2 mx-auto"
            >
              {loading ? <Icon name="Loader" size={18} className="animate-spin" /> : <Icon name="ExternalLink" size={18} />}
              {loading ? 'Creating Account...' : 'Start Onboarding with Stripe'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={32} className="text-yellow-600" />
            </div>
            <h4 className="text-xl font-semibold text-foreground mb-2">Complete Identity Verification</h4>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Stripe requires identity verification to comply with financial regulations. This typically takes 1-2 business days.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
              {[
                { label: 'Account Created', status: 'done', icon: 'CheckCircle' },
                { label: 'ID Verification', status: 'pending', icon: 'Clock' },
                { label: 'Bank Account', status: 'pending', icon: 'Clock' },
                { label: 'Tax Info', status: 'pending', icon: 'Clock' }
              ]?.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Icon name={item?.icon} size={16} className={item?.status === 'done' ? 'text-green-500' : 'text-yellow-500'} />
                  <span className="text-sm text-foreground">{item?.label}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleCompleteVerification}
              disabled={loading}
              className="px-8 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 disabled:opacity-50 transition-colors flex items-center gap-2 mx-auto"
            >
              {loading ? <Icon name="Loader" size={18} className="animate-spin" /> : <Icon name="ExternalLink" size={18} />}
              {loading ? 'Verifying...' : 'Complete Verification on Stripe'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-foreground mb-2">Account Active & Verified!</h4>
            <p className="text-muted-foreground mb-6">Your Stripe Connect Express account is fully set up. You can now receive creator payouts.</p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-green-700 dark:text-green-400">
                Account ID: {localStorage.getItem('stripe_connect_account_id') || 'acct_connected'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeConnectOnboarding;
