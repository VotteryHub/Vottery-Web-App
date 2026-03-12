import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const BankAccountSetup = ({ onSave }) => {
  const [bankingMode, setBankingMode] = useState('us'); // 'us' | 'international'
  const [formData, setFormData] = useState({
    routingNumber: '',
    accountNumber: '',
    confirmAccountNumber: '',
    accountHolderName: '',
    bankName: '',
    swiftCode: '',
    ibanNumber: '',
    bankCountry: ''
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData?.accountHolderName?.trim()) newErrors.accountHolderName = 'Account holder name is required';
    if (bankingMode === 'us') {
      if (!formData?.routingNumber?.trim() || formData?.routingNumber?.length !== 9) newErrors.routingNumber = 'Valid 9-digit routing number required';
      if (!formData?.accountNumber?.trim()) newErrors.accountNumber = 'Account number is required';
      if (formData?.accountNumber !== formData?.confirmAccountNumber) newErrors.confirmAccountNumber = 'Account numbers do not match';
    } else {
      if (!formData?.swiftCode?.trim()) newErrors.swiftCode = 'SWIFT/BIC code is required';
      if (!formData?.ibanNumber?.trim()) newErrors.ibanNumber = 'IBAN number is required';
      if (!formData?.bankCountry?.trim()) newErrors.bankCountry = 'Bank country is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      onSave?.(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <Icon name="Building2" size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Bank Account Setup</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Link your bank account for payouts</p>
        </div>
      </div>
      {/* Banking Mode Toggle */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <button
          onClick={() => setBankingMode('us')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            bankingMode === 'us' ?'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' :'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          🇺🇸 US Banking (ACH)
        </button>
        <button
          onClick={() => setBankingMode('international')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            bankingMode === 'international' ?'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' :'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          🌍 International (SWIFT/IBAN)
        </button>
      </div>
      <div className="space-y-4">
        <Input
          label="Account Holder Name"
          placeholder="Full legal name on bank account"
          value={formData?.accountHolderName}
          onChange={(e) => handleChange('accountHolderName', e?.target?.value)}
          error={errors?.accountHolderName}
          required
        />

        {bankingMode === 'us' ? (
          <>
            <Input
              label="Bank Name"
              placeholder="e.g. Chase, Bank of America"
              value={formData?.bankName}
              onChange={(e) => handleChange('bankName', e?.target?.value)}
            />
            <Input
              label="Routing Number"
              placeholder="9-digit routing number"
              value={formData?.routingNumber}
              onChange={(e) => handleChange('routingNumber', e?.target?.value?.replace(/\D/g, '')?.slice(0, 9))}
              error={errors?.routingNumber}
              required
            />
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-400">
              <Icon name="Info" size={12} className="inline mr-1" />
              Find your routing number on the bottom-left of your check or in your bank's app.
            </div>
            <Input
              label="Account Number"
              type="password"
              placeholder="Bank account number"
              value={formData?.accountNumber}
              onChange={(e) => handleChange('accountNumber', e?.target?.value)}
              error={errors?.accountNumber}
              required
            />
            <Input
              label="Confirm Account Number"
              type="password"
              placeholder="Re-enter account number"
              value={formData?.confirmAccountNumber}
              onChange={(e) => handleChange('confirmAccountNumber', e?.target?.value)}
              error={errors?.confirmAccountNumber}
              required
            />
          </>
        ) : (
          <>
            <Input
              label="Bank Country"
              placeholder="e.g. United Kingdom, Germany"
              value={formData?.bankCountry}
              onChange={(e) => handleChange('bankCountry', e?.target?.value)}
              error={errors?.bankCountry}
              required
            />
            <Input
              label="SWIFT / BIC Code"
              placeholder="e.g. BARCGB22"
              value={formData?.swiftCode}
              onChange={(e) => handleChange('swiftCode', e?.target?.value?.toUpperCase())}
              error={errors?.swiftCode}
              required
            />
            <Input
              label="IBAN Number"
              placeholder="e.g. GB29NWBK60161331926819"
              value={formData?.ibanNumber}
              onChange={(e) => handleChange('ibanNumber', e?.target?.value?.toUpperCase()?.replace(/\s/g, ''))}
              error={errors?.ibanNumber}
              required
            />
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-400">
              <Icon name="AlertTriangle" size={12} className="inline mr-1" />
              International transfers may take 3-5 business days and may incur additional fees.
            </div>
          </>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          {saving ? <Icon name="Loader" size={16} className="animate-spin" /> : <Icon name="Save" size={16} />}
          {saving ? 'Saving...' : 'Save Bank Account'}
        </Button>
      </div>
    </div>
  );
};

export default BankAccountSetup;
