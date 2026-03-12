import React, { useState, useEffect } from 'react';
import { Bitcoin, TrendingUp, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { platformGamificationService } from '../../../services/platformGamificationService';

const CryptoConversionsPanel = ({ vpBalance, onRedemption }) => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [vpAmount, setVpAmount] = useState(5000);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({
    BTC: { rate: 0.000023, fee: 0.001, name: 'Bitcoin', symbol: '₿' },
    ETH: { rate: 0.00038, fee: 0.002, name: 'Ethereum', symbol: 'Ξ' },
    USDC: { rate: 0.95, fee: 0.01, name: 'USD Coin', symbol: '$' },
    USDT: { rate: 0.95, fee: 0.01, name: 'Tether', symbol: '$' }
  });

  const cryptoOptions = [
    { id: 'BTC', name: 'Bitcoin', icon: '₿', color: 'orange' },
    { id: 'ETH', name: 'Ethereum', icon: 'Ξ', color: 'blue' },
    { id: 'USDC', name: 'USD Coin', icon: '$', color: 'green' },
    { id: 'USDT', name: 'Tether', icon: '$', color: 'teal' }
  ];

  const calculateConversion = () => {
    const rate = exchangeRates?.[selectedCrypto];
    const cryptoAmount = vpAmount * rate?.rate;
    const networkFee = cryptoAmount * rate?.fee;
    const finalAmount = cryptoAmount - networkFee;
    return { cryptoAmount, networkFee, finalAmount };
  };

  const handleConvert = async () => {
    if (vpBalance < vpAmount) {
      alert('Insufficient VP balance');
      return;
    }

    if (vpAmount < 5000) {
      alert('Minimum conversion amount is 5,000 VP');
      return;
    }

    try {
      setProcessing(true);
      const { finalAmount } = calculateConversion();
      await platformGamificationService?.redeemVP({
        type: 'crypto_conversion',
        cryptocurrency: selectedCrypto,
        vpAmount: vpAmount,
        cryptoAmount: finalAmount
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onRedemption?.();
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Conversion failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const { cryptoAmount, networkFee, finalAmount } = calculateConversion();
  const rate = exchangeRates?.[selectedCrypto];

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-300">Conversion Successful!</p>
            <p className="text-sm text-green-700 dark:text-green-400">Your cryptocurrency will be transferred to your wallet within 24 hours.</p>
          </div>
        </div>
      )}
      {/* Important Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-yellow-900 dark:text-yellow-300 text-sm">Important Information</p>
          <ul className="text-xs text-yellow-700 dark:text-yellow-400 mt-2 space-y-1 list-disc list-inside">
            <li>Minimum conversion: 5,000 VP</li>
            <li>Exchange rates update every 5 minutes</li>
            <li>Network fees apply to all conversions</li>
            <li>Transfers complete within 24 hours</li>
            <li>Ensure your wallet address is correct</li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Calculator */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bitcoin className="w-5 h-5 text-orange-600" />
            Crypto Conversion Calculator
          </h3>

          {/* Cryptocurrency Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Cryptocurrency
            </label>
            <div className="grid grid-cols-2 gap-3">
              {cryptoOptions?.map((crypto) => (
                <button
                  key={crypto?.id}
                  onClick={() => setSelectedCrypto(crypto?.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCrypto === crypto?.id
                      ? `border-${crypto?.color}-500 bg-${crypto?.color}-50 dark:bg-${crypto?.color}-900/20`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{crypto?.icon}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{crypto?.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{crypto?.id}</div>
                </button>
              ))}
            </div>
          </div>

          {/* VP Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              VP Amount to Convert
            </label>
            <input
              type="number"
              value={vpAmount}
              onChange={(e) => setVpAmount(parseInt(e?.target?.value) || 0)}
              min="5000"
              step="1000"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold"
            />
            <div className="flex gap-2 mt-2">
              {[5000, 10000, 25000, 50000]?.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setVpAmount(amount)}
                  className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {amount?.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Conversion Breakdown */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Exchange Rate:</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                1 VP = {rate?.rate} {selectedCrypto}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Crypto Amount:</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {rate?.symbol}{cryptoAmount?.toFixed(8)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Network Fee ({(rate?.fee * 100)?.toFixed(1)}%):</span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                -{rate?.symbol}{networkFee?.toFixed(8)}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900 dark:text-white">You'll Receive:</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {rate?.symbol}{finalAmount?.toFixed(8)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={processing || vpBalance < vpAmount || vpAmount < 5000}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Convert to {selectedCrypto}
              </>
            )}
          </button>
        </div>

        {/* Exchange Rates Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Current Exchange Rates
          </h3>

          <div className="space-y-4">
            {Object.entries(exchangeRates)?.map(([crypto, data]) => (
              <div
                key={crypto}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{data?.symbol}</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{data?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{crypto}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {data?.rate} {crypto}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">per VP</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Network Fee:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{(data?.fee * 100)?.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-900 dark:text-blue-300">
              <strong>Note:</strong> Exchange rates are indicative and may vary at the time of conversion. Network fees cover blockchain transaction costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoConversionsPanel;