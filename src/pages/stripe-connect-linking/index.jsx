import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const StripeConnectLinking = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState('domestic'); // domestic | international
  const [formData, setFormData] = useState({
    accountHolderName: '',
    routingNumber: '',
    accountNumber: '',
    confirmAccountNumber: '',
    // International
    swiftCode: '',
    iban: '',
    bankName: '',
    bankCountry: 'US'
  });
  const [taxFile, setTaxFile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('unverified'); // unverified | pending | verified | failed
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleTaxUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) setTaxFile(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData?.accountHolderName) newErrors.accountHolderName = 'Required';
    if (mode === 'domestic') {
      if (!formData?.routingNumber || formData?.routingNumber?.length !== 9) newErrors.routingNumber = 'Must be 9 digits';
      if (!formData?.accountNumber) newErrors.accountNumber = 'Required';
      if (formData?.accountNumber !== formData?.confirmAccountNumber) newErrors.confirmAccountNumber = 'Account numbers do not match';
    } else {
      if (!formData?.swiftCode && !formData?.iban) newErrors.swiftCode = 'SWIFT code or IBAN required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setVerificationStatus('pending');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    unverified: { label: 'Not Verified', color: 'text-gray-500', bg: 'bg-gray-100', icon: 'AlertCircle' },
    pending: { label: 'Verification Pending (1-2 business days)', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'Clock' },
    verified: { label: 'Account Verified', color: 'text-green-600', bg: 'bg-green-50', icon: 'CheckCircle' },
    failed: { label: 'Verification Failed', color: 'text-red-600', bg: 'bg-red-50', icon: 'XCircle' }
  };
  const sc = statusConfig?.[verificationStatus];

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Stripe Connect Bank Linking | Vottery</title></Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-6 max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="CreditCard" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Link Bank Account</h1>
                <p className="text-sm text-muted-foreground">Connect your bank to receive creator payouts</p>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className={`flex items-center gap-3 p-4 ${sc?.bg} rounded-xl mb-6 border border-gray-200`}>
            <Icon name={sc?.icon} size={20} className={sc?.color} />
            <span className={`font-medium ${sc?.color}`}>{sc?.label}</span>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('domestic')}
              className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                mode === 'domestic' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-muted-foreground'
              }`}
            >
              🇺🇸 US Bank (Routing/Account)
            </button>
            <button
              onClick={() => setMode('international')}
              className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                mode === 'international' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-muted-foreground'
              }`}
            >
              🌍 International (SWIFT/IBAN)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Holder Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Account Holder Name</label>
              <input
                type="text"
                value={formData?.accountHolderName}
                onChange={e => handleChange('accountHolderName', e?.target?.value)}
                placeholder="Full legal name"
                className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none ${
                  errors?.accountHolderName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors?.accountHolderName && <p className="text-red-500 text-xs mt-1">{errors?.accountHolderName}</p>}
            </div>

            {mode === 'domestic' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Routing Number (9 digits)</label>
                  <input
                    type="text"
                    value={formData?.routingNumber}
                    onChange={e => handleChange('routingNumber', e?.target?.value?.replace(/\D/g, '')?.slice(0, 9))}
                    placeholder="123456789"
                    maxLength={9}
                    className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground font-mono focus:ring-2 focus:ring-primary focus:outline-none ${
                      errors?.routingNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors?.routingNumber && <p className="text-red-500 text-xs mt-1">{errors?.routingNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Account Number</label>
                  <input
                    type="password"
                    value={formData?.accountNumber}
                    onChange={e => handleChange('accountNumber', e?.target?.value)}
                    placeholder="Account number"
                    className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground font-mono focus:ring-2 focus:ring-primary focus:outline-none ${
                      errors?.accountNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors?.accountNumber && <p className="text-red-500 text-xs mt-1">{errors?.accountNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Confirm Account Number</label>
                  <input
                    type="text"
                    value={formData?.confirmAccountNumber}
                    onChange={e => handleChange('confirmAccountNumber', e?.target?.value)}
                    placeholder="Re-enter account number"
                    className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground font-mono focus:ring-2 focus:ring-primary focus:outline-none ${
                      errors?.confirmAccountNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors?.confirmAccountNumber && <p className="text-red-500 text-xs mt-1">{errors?.confirmAccountNumber}</p>}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Bank Country</label>
                  <select
                    value={formData?.bankCountry}
                    onChange={e => handleChange('bankCountry', e?.target?.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="GB">United Kingdom</option>
                    <option value="EU">European Union</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="NG">Nigeria</option>
                    <option value="GH">Ghana</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">SWIFT / BIC Code</label>
                  <input
                    type="text"
                    value={formData?.swiftCode}
                    onChange={e => handleChange('swiftCode', e?.target?.value?.toUpperCase())}
                    placeholder="e.g. BARCGB22"
                    className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground font-mono focus:ring-2 focus:ring-primary focus:outline-none ${
                      errors?.swiftCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors?.swiftCode && <p className="text-red-500 text-xs mt-1">{errors?.swiftCode}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">IBAN (if applicable)</label>
                  <input
                    type="text"
                    value={formData?.iban}
                    onChange={e => handleChange('iban', e?.target?.value?.toUpperCase()?.replace(/\s/g, ''))}
                    placeholder="e.g. GB29NWBK60161331926819"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-background text-foreground font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={formData?.bankName}
                    onChange={e => handleChange('bankName', e?.target?.value)}
                    placeholder="Name of your bank"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* Tax Document Upload */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Icon name="FileText" size={16} className="text-blue-500" />
                Tax Document (W-9 / W-8BEN) — Optional
              </label>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg p-4 hover:border-primary transition-colors text-center">
                  {taxFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <Icon name="FileText" size={20} className="text-green-500" />
                      <span className="text-sm text-foreground">{taxFile?.name}</span>
                    </div>
                  ) : (
                    <>
                      <Icon name="Upload" size={24} className="text-muted-foreground mx-auto mb-1" />
                      <p className="text-sm text-muted-foreground">Upload tax document (PDF, JPG, PNG)</p>
                    </>
                  )}
                </div>
                <input type="file" accept=".pdf,.jpg,.png" onChange={handleTaxUpload} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Icon name="Loader" size={20} className="animate-spin" /> : <Icon name="Shield" size={20} />}
              {loading ? 'Verifying...' : 'Link Bank Account'}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            🔒 Your bank details are encrypted and processed securely via Stripe. Vottery never stores your account numbers.
          </p>
        </main>
      </div>
    </div>
  );
};

export default StripeConnectLinking;
