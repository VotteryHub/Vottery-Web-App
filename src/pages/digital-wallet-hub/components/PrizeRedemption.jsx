import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { walletService } from '../../../services/walletService';

const PrizeRedemption = ({ wallet, onSuccess }) => {
  const [redemptionType, setRedemptionType] = useState('bank_transfer');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const redemptionOptions = [
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
    },
    {
      type: 'gift_card',
      label: 'Gift Card',
      icon: 'Gift',
      description: 'Convert to popular gift cards',
      fee: 0,
      processingTime: 'Instant'
    },
    {
      type: 'crypto',
      label: 'Cryptocurrency',
      icon: 'Bitcoin',
      description: 'Transfer to crypto wallet',
      fee: 1.0,
      processingTime: '1-2 hours'
    }
  ];

  const selectedOption = redemptionOptions?.find(opt => opt?.type === redemptionType);
  const processingFee = selectedOption ? (parseFloat(amount) * selectedOption?.fee / 100) : 0;
  const finalAmount = parseFloat(amount) - processingFee;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess(false);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(wallet?.availableBalance)) {
      setError('Insufficient balance');
      return;
    }

    if (parseFloat(amount) < 100) {
      setError('Minimum redemption amount is ₹100');
      return;
    }

    try {
      setLoading(true);
      const result = await walletService?.createRedemption({
        redemptionType,
        amount: parseFloat(amount),
        conversionRate: 1.0,
        finalAmount,
        processingFee,
        paymentDetails: {
          method: redemptionType,
          requestedAt: new Date()?.toISOString()
        },
        notes: `Redemption via ${selectedOption?.label}`
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
      setError('Failed to process redemption. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-6">Redeem Your Winnings</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Select Redemption Method</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {redemptionOptions?.map((option) => (
                <button
                  key={option?.type}
                  type="button"
                  onClick={() => setRedemptionType(option?.type)}
                  className={`p-4 rounded-lg border-2 transition-all duration-250 text-left ${
                    redemptionType === option?.type
                      ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name={option?.icon} size={20} className={redemptionType === option?.type ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="font-semibold text-foreground">{option?.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{option?.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Amount to Redeem</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e?.target?.value)}
              min="100"
              step="0.01"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Available: {walletService?.formatCurrency(wallet?.availableBalance || 0, wallet?.currency)}
            </p>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Redemption Amount</span>
                <span className="font-medium text-foreground">
                  {walletService?.formatCurrency(parseFloat(amount), wallet?.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing Fee ({selectedOption?.fee}%)</span>
                <span className="font-medium text-orange-600">
                  -{walletService?.formatCurrency(processingFee, wallet?.currency)}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-semibold text-foreground">You Will Receive</span>
                <span className="font-bold text-primary text-lg">
                  {walletService?.formatCurrency(finalAmount, wallet?.currency)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Processing Time: {selectedOption?.processingTime}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <Icon name="AlertCircle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900 mb-1">Redemption Successful!</p>
                <p className="text-xs text-green-700">Your request is being processed.</p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !amount || parseFloat(amount) <= 0}
            iconName={loading ? 'Loader' : 'Send'}
            className="w-full"
          >
            {loading ? 'Processing...' : 'Submit Redemption Request'}
          </Button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Redemption Information</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Minimum redemption amount: ₹100</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Processing fees vary by method</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Bank transfers take 2-3 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Gift cards and crypto are instant</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Available Redemption Options</h3>
          <div className="space-y-3">
            {redemptionOptions?.map((option) => (
              <div key={option?.type} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <Icon name={option?.icon} size={18} className="text-primary" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{option?.label}</p>
                    <p className="text-xs text-muted-foreground">{option?.processingTime}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-orange-600">{option?.fee}% fee</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeRedemption;