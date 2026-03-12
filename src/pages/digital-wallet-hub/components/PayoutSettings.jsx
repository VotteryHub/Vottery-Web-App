import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const PayoutSettings = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    autoPayoutEnabled: false,
    minimumPayoutThreshold: 100,
    preferredMethod: 'bank_transfer',
    payoutSchedule: 'manual',
    bankDetails: {},
    cryptoWalletAddress: '',
    paypalEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        autoPayoutEnabled: settings?.autoPayoutEnabled || false,
        minimumPayoutThreshold: settings?.minimumPayoutThreshold || 100,
        preferredMethod: settings?.preferredMethod || 'bank_transfer',
        payoutSchedule: settings?.payoutSchedule || 'manual',
        bankDetails: settings?.bankDetails || {},
        cryptoWalletAddress: settings?.cryptoWalletAddress || '',
        paypalEmail: settings?.paypalEmail || ''
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess(false);

    try {
      setLoading(true);
      const result = await onUpdate?.(formData);

      if (result?.error) {
        setError(result?.error?.message);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-heading font-bold text-foreground mb-6">Payout Settings</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={formData?.autoPayoutEnabled}
                  onChange={(e) => handleChange('autoPayoutEnabled', e?.target?.checked)}
                  className="mt-1"
                />
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Enable Automated Payouts
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Automatically process payouts when your balance reaches the threshold
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Minimum Payout Threshold
                </label>
                <Input
                  type="number"
                  value={formData?.minimumPayoutThreshold}
                  onChange={(e) => handleChange('minimumPayoutThreshold', parseFloat(e?.target?.value))}
                  min="100"
                  step="100"
                  disabled={!formData?.autoPayoutEnabled}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum: ₹100
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Payout Schedule
                </label>
                <Select
                  value={formData?.payoutSchedule}
                  onChange={(e) => handleChange('payoutSchedule', e?.target?.value)}
                  disabled={!formData?.autoPayoutEnabled}
                  className="w-full"
                >
                  <option value="manual">Manual</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Preferred Payout Method
              </label>
              <Select
                value={formData?.preferredMethod}
                onChange={(e) => handleChange('preferredMethod', e?.target?.value)}
                className="w-full"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="crypto_wallet">Cryptocurrency</option>
              </Select>
            </div>

            {formData?.preferredMethod === 'bank_transfer' && (
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-foreground">Bank Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Account Holder Name"
                    value={formData?.bankDetails?.accountName || ''}
                    onChange={(e) => handleChange('bankDetails', { ...formData?.bankDetails, accountName: e?.target?.value })}
                  />
                  <Input
                    placeholder="Account Number"
                    value={formData?.bankDetails?.accountNumber || ''}
                    onChange={(e) => handleChange('bankDetails', { ...formData?.bankDetails, accountNumber: e?.target?.value })}
                  />
                  <Input
                    placeholder="IFSC Code"
                    value={formData?.bankDetails?.ifscCode || ''}
                    onChange={(e) => handleChange('bankDetails', { ...formData?.bankDetails, ifscCode: e?.target?.value })}
                  />
                  <Input
                    placeholder="Bank Name"
                    value={formData?.bankDetails?.bankName || ''}
                    onChange={(e) => handleChange('bankDetails', { ...formData?.bankDetails, bankName: e?.target?.value })}
                  />
                </div>
              </div>
            )}

            {formData?.preferredMethod === 'paypal' && (
              <div className="p-4 bg-muted rounded-lg">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  PayPal Email
                </label>
                <Input
                  type="email"
                  placeholder="your-email@example.com"
                  value={formData?.paypalEmail}
                  onChange={(e) => handleChange('paypalEmail', e?.target?.value)}
                  className="w-full"
                />
              </div>
            )}

            {formData?.preferredMethod === 'crypto_wallet' && (
              <div className="p-4 bg-muted rounded-lg">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Crypto Wallet Address
                </label>
                <Input
                  placeholder="0x..."
                  value={formData?.cryptoWalletAddress}
                  onChange={(e) => handleChange('cryptoWalletAddress', e?.target?.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supports BTC, ETH, and USDT
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
                <p className="text-sm text-green-700">Settings updated successfully!</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              iconName={loading ? 'Loader' : 'Save'}
              className="w-full"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-foreground">Security</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>All transactions are encrypted</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>Multi-factor authentication enabled</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>Fraud protection active</span>
            </li>
          </ul>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Icon name="AlertTriangle" size={20} className="text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">Important Notes</h3>
              <ul className="text-sm text-orange-700 space-y-2">
                <li>• Verify your bank details carefully</li>
                <li>• Processing times vary by method</li>
                <li>• Fees may apply to certain methods</li>
                <li>• Contact support for any issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutSettings;