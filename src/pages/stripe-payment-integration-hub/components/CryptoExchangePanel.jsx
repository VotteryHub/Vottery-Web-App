import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { stripeService } from '../../../services/stripeService';

const CryptoExchangePanel = ({ wallet, onSuccess }) => {
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const cryptocurrencies = stripeService?.getCryptocurrencies();

  const cryptoAmount = selectedCrypto && amount 
    ? parseFloat(amount) / selectedCrypto?.currentRate 
    : 0;
  const networkFee = selectedCrypto ? selectedCrypto?.networkFee * selectedCrypto?.currentRate : 0;
  const finalCryptoAmount = cryptoAmount - (selectedCrypto?.networkFee || 0);

  const handleWithdraw = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess(false);

    if (!selectedCrypto) {
      setError('Please select a cryptocurrency');
      return;
    }

    if (!amount || parseFloat(amount) < selectedCrypto?.minWithdrawal) {
      setError(`Minimum withdrawal amount is ${stripeService?.formatCurrency(selectedCrypto?.minWithdrawal)}`);
      return;
    }

    if (parseFloat(amount) > parseFloat(wallet?.availableBalance || 0)) {
      setError('Insufficient balance');
      return;
    }

    if (!walletAddress || walletAddress?.length < 26) {
      setError('Please enter a valid wallet address');
      return;
    }

    try {
      setLoading(true);
      const result = await stripeService?.createCryptoWithdrawal({
        cryptocurrency: selectedCrypto?.symbol,
        amount: parseFloat(amount),
        cryptoAmount: finalCryptoAmount,
        walletAddress,
        network: 'mainnet',
        exchangeRate: selectedCrypto?.currentRate,
        networkFee,
        conversionRate: 1 / selectedCrypto?.currentRate
      });

      if (result?.error) {
        setError(result?.error?.message);
      } else {
        setSuccess(true);
        setAmount('');
        setWalletAddress('');
        setTimeout(() => {
          setSuccess(false);
          onSuccess?.();
        }, 3000);
      }
    } catch (err) {
      setError('Failed to process withdrawal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">Cryptocurrency Withdrawal</h2>
          <p className="text-muted-foreground mb-6">Convert your earnings to cryptocurrency and withdraw to your wallet</p>

          <form onSubmit={handleWithdraw} className="space-y-6">
            {/* Cryptocurrency Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Select Cryptocurrency
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cryptocurrencies?.map((crypto) => (
                  <button
                    key={crypto?.id}
                    type="button"
                    onClick={() => {
                      setSelectedCrypto(crypto);
                      setError('');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedCrypto?.id === crypto?.id
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                        selectedCrypto?.id === crypto?.id ? 'bg-primary text-white' : 'bg-muted'
                      }`}>
                        {crypto?.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground mb-1">{crypto?.name}</p>
                        <p className="text-xs text-muted-foreground mb-2">{crypto?.symbol}</p>
                        <p className="text-sm font-medium text-foreground">
                          {stripeService?.formatCurrency(crypto?.currentRate)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedCrypto && (
              <>
                {/* Amount Input */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Amount (INR)
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e?.target?.value)}
                    placeholder="Enter amount in INR"
                    min={selectedCrypto?.minWithdrawal}
                    step="10"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Minimum: {stripeService?.formatCurrency(selectedCrypto?.minWithdrawal)} | 
                    Available: {stripeService?.formatCurrency(wallet?.availableBalance || 0)}
                  </p>
                </div>

                {/* Wallet Address */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {selectedCrypto?.symbol} Wallet Address
                  </label>
                  <Input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e?.target?.value)}
                    placeholder={`Enter your ${selectedCrypto?.symbol} wallet address`}
                    className="w-full font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Double-check your wallet address. Transactions cannot be reversed.
                  </p>
                </div>

                {/* Conversion Summary */}
                {amount && parseFloat(amount) >= selectedCrypto?.minWithdrawal && (
                  <div className="bg-muted rounded-lg p-6 space-y-3">
                    <h3 className="font-semibold text-foreground mb-4">Conversion Summary</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Amount (INR)</span>
                      <span className="font-semibold text-foreground">
                        {stripeService?.formatCurrency(parseFloat(amount))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Exchange Rate</span>
                      <span className="font-semibold text-foreground">
                        1 {selectedCrypto?.symbol} = {stripeService?.formatCurrency(selectedCrypto?.currentRate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">You'll Receive</span>
                      <span className="font-semibold text-foreground">
                        {stripeService?.formatCrypto(cryptoAmount, 8)} {selectedCrypto?.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Network Fee</span>
                      <span className="font-semibold text-foreground">
                        -{stripeService?.formatCrypto(selectedCrypto?.networkFee, 8)} {selectedCrypto?.symbol}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Final Amount</span>
                        <span className="text-xl font-bold text-primary">
                          {stripeService?.formatCrypto(finalCryptoAmount, 8)} {selectedCrypto?.symbol}
                        </span>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                      <div className="flex items-start gap-2">
                        <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5" />
                        <p className="text-xs text-yellow-700">
                          Cryptocurrency prices are volatile. The final amount may vary slightly based on market conditions at the time of processing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle" size={20} className="text-green-600" />
                  <p className="text-green-600 text-sm font-medium">
                    Withdrawal request submitted! Processing typically takes 1-2 hours.
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={!selectedCrypto || !amount || !walletAddress || loading}
              className="w-full"
              size="lg"
              iconName={loading ? 'Loader2' : 'Send'}
              iconClassName={loading ? 'animate-spin' : ''}
              iconPosition="left"
            >
              {loading ? 'Processing...' : 'Withdraw Cryptocurrency'}
            </Button>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={18} className="text-primary" />
            Live Exchange Rates
          </h3>
          <div className="space-y-3">
            {cryptocurrencies?.map((crypto) => (
              <div key={crypto?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{crypto?.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{crypto?.symbol}</p>
                    <p className="text-xs text-muted-foreground">{crypto?.name}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {stripeService?.formatCurrency(crypto?.currentRate)}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Rates updated every 5 minutes
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Shield" size={18} className="text-primary" />
            Security Tips
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
              <p className="text-muted-foreground">Always verify wallet address before confirming</p>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
              <p className="text-muted-foreground">Start with small test transactions</p>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
              <p className="text-muted-foreground">Enable 2FA on your crypto wallet</p>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
              <p className="text-muted-foreground">Transactions are irreversible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoExchangePanel;