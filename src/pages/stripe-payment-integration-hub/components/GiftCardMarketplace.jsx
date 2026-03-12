import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { stripeService } from '../../../services/stripeService';

const GiftCardMarketplace = ({ wallet, onSuccess }) => {
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [selectedDenomination, setSelectedDenomination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const retailers = stripeService?.getGiftCardRetailers();

  const handleRedeem = async () => {
    if (!selectedRetailer || !selectedDenomination) {
      setError('Please select a retailer and denomination');
      return;
    }

    if (selectedDenomination > parseFloat(wallet?.availableBalance || 0)) {
      setError('Insufficient balance');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await stripeService?.createGiftCardRedemption({
        retailer: selectedRetailer?.name,
        denomination: selectedDenomination,
        amount: selectedDenomination
      });

      if (result?.error) {
        setError(result?.error?.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSelectedRetailer(null);
          setSelectedDenomination(null);
          setSuccess(false);
          onSuccess?.();
        }, 3000);
      }
    } catch (err) {
      setError('Failed to redeem gift card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">Gift Card Marketplace</h2>
        <p className="text-muted-foreground mb-6">Instantly redeem your earnings for popular gift cards with zero fees</p>

        {/* Retailer Selection */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-4">Select Retailer</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {retailers?.map((retailer) => (
              <button
                key={retailer?.id}
                onClick={() => {
                  setSelectedRetailer(retailer);
                  setSelectedDenomination(null);
                  setError('');
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  selectedRetailer?.id === retailer?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-4xl mb-2">{retailer?.logo}</div>
                <p className="text-sm font-medium text-foreground">{retailer?.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Denomination Selection */}
        {selectedRetailer && (
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-4">Select Amount</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedRetailer?.denominations?.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedDenomination(amount);
                    setError('');
                  }}
                  disabled={amount > parseFloat(wallet?.availableBalance || 0)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedDenomination === amount
                      ? 'border-primary bg-primary/5'
                      : amount > parseFloat(wallet?.availableBalance || 0)
                      ? 'border-border bg-muted opacity-50 cursor-not-allowed' :'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {stripeService?.formatCurrency(amount)}
                  </p>
                  {amount > parseFloat(wallet?.availableBalance || 0) && (
                    <p className="text-xs text-red-500">Insufficient balance</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {selectedRetailer && selectedDenomination && (
          <div className="bg-muted rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Redemption Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Retailer</span>
                <span className="font-semibold text-foreground flex items-center gap-2">
                  <span className="text-2xl">{selectedRetailer?.logo}</span>
                  {selectedRetailer?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Gift Card Value</span>
                <span className="font-semibold text-foreground">
                  {stripeService?.formatCurrency(selectedDenomination)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-semibold text-green-600">
                  {stripeService?.formatCurrency(0)} (Free!)
                </span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total Deduction</span>
                  <span className="text-xl font-bold text-primary">
                    {stripeService?.formatCurrency(selectedDenomination)}
                  </span>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <div className="flex items-start gap-2">
                  <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    Gift card code will be sent to your registered email instantly after redemption
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle" size={20} className="text-green-600" />
              <p className="text-green-600 text-sm font-medium">
                Gift card redeemed successfully! Check your email for the code.
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={handleRedeem}
          disabled={!selectedRetailer || !selectedDenomination || loading}
          className="w-full"
          size="lg"
          iconName={loading ? 'Loader2' : 'Gift'}
          iconClassName={loading ? 'animate-spin' : ''}
          iconPosition="left"
        >
          {loading ? 'Processing...' : 'Redeem Gift Card'}
        </Button>
      </div>

      {/* Available Balance */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-foreground">
              {stripeService?.formatCurrency(wallet?.availableBalance || 0)}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Wallet" size={24} className="text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardMarketplace;