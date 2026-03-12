import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import { stripeService } from '../../../services/stripeService';

const PaymentMethodsPanel = ({ wallet, paymentMethods, onSuccess }) => {
  const [payoutType, setPayoutType] = useState('bank_transfer');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const payoutOptions = [
    {
      type: 'bank_transfer',
      label: 'Bank Transfer',
      icon: 'Building2',
      description: 'Direct transfer to your bank account',
      fee: 2.5,
      processingTime: '2-3 business days'
    },
    {
      type: 'cash',
      label: 'Cash Withdrawal',
      icon: 'Banknote',
      description: 'Instant cash withdrawal',
      fee: 5.0,
      processingTime: 'Instant'
    }
  ];

  const selectedOption = payoutOptions?.find(opt => opt?.type === payoutType);
  const processingFee = selectedOption ? (parseFloat(amount || 0) * selectedOption?.fee / 100) : 0;
  const finalAmount = parseFloat(amount || 0) - processingFee;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess(false);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(wallet?.availableBalance || 0)) {
      setError('Insufficient balance');
      return;
    }

    if (parseFloat(amount) < 100) {
      setError('Minimum payout amount is ₹100');
      return;
    }

    try {
      setLoading(true);
      const result = await stripeService?.createCashPayout({
        amount: parseFloat(amount),
        processingFee,
        paymentDetails: {
          method: payoutType,
          requestedAt: new Date()?.toISOString()
        }
      });

      if (result?.error) {
        setError(result?.error?.message);
      } else {
        setSuccess(true);
        setAmount('');
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }
    } catch (err) {
      setError('Failed to process payout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-heading font-bold text-foreground mb-6">Cash Payout</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Payout Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {payoutOptions?.map((option) => (
                  <button
                    key={option?.type}
                    type="button"
                    onClick={() => setPayoutType(option?.type)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      payoutType === option?.type
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        payoutType === option?.type ? 'bg-primary text-white' : 'bg-muted text-foreground'
                      }`}>
                        <Icon name={option?.icon} size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground mb-1">{option?.label}</p>
                        <p className="text-xs text-muted-foreground mb-2">{option?.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Fee: {option?.fee}%</span>
                          <span className="text-muted-foreground">{option?.processingTime}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Amount (₹)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e?.target?.value)}
                placeholder="Enter amount"
                min="100"
                step="10"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Available Balance: {stripeService?.formatCurrency(wallet?.availableBalance || 0)}
              </p>
            </div>

            {amount && parseFloat(amount) >= 100 && (
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold text-foreground">
                    {stripeService?.formatCurrency(parseFloat(amount))}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processing Fee ({selectedOption?.fee}%)</span>
                  <span className="font-semibold text-foreground">
                    -{stripeService?.formatCurrency(processingFee)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">You'll Receive</span>
                    <span className="text-xl font-bold text-primary">
                      {stripeService?.formatCurrency(finalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-600 text-sm font-medium">Payout request submitted successfully!</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !amount || parseFloat(amount) < 100}
              className="w-full"
              size="lg"
              iconName={loading ? 'Loader2' : 'Send'}
              iconClassName={loading ? 'animate-spin' : ''}
              iconPosition="left"
            >
              {loading ? 'Processing...' : 'Request Payout'}
            </Button>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Shield" size={18} className="text-primary" />
            Security & Compliance
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
              <p className="text-muted-foreground">PCI DSS Level 1 Certified</p>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
              <p className="text-muted-foreground">256-bit SSL Encryption</p>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
              <p className="text-muted-foreground">RBI Compliant</p>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
              <p className="text-muted-foreground">Fraud Protection Enabled</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="CreditCard" size={18} className="text-primary" />
            Saved Payment Methods
          </h3>
          {paymentMethods?.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods?.slice(0, 3)?.map((method) => (
                <div key={method?.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Icon name="CreditCard" size={20} className="text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {method?.cardBrand?.toUpperCase()} •••• {method?.cardLastFour}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires {method?.cardExpMonth}/{method?.cardExpYear}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No saved payment methods</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPanel;