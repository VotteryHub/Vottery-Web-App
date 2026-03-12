import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const StripeConnectOnboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessType: 'individual',
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    ssn: '',
    businessName: '',
    businessEin: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: ''
  });

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleNext = async () => {
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      setLoading(true);
      try {
        await new Promise(r => setTimeout(r, 1500));
        onComplete?.(formData);
      } finally {
        setLoading(false);
      }
    }
  };

  const steps = [
    { id: 1, label: 'Business Info', icon: 'User' },
    { id: 2, label: 'Personal Details', icon: 'FileText' },
    { id: 3, label: 'Address', icon: 'MapPin' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
          <Icon name="CreditCard" size={20} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Stripe Connect Onboarding</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Set up your creator payment account</p>
        </div>
      </div>
      {/* Step Indicators */}
      <div className="flex items-center gap-2 mb-6">
        {steps?.map((s, idx) => (
          <React.Fragment key={s?.id}>
            <div className={`flex items-center gap-2 ${
              step >= s?.id ? 'text-indigo-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step > s?.id ? 'bg-green-500 text-white' :
                step === s?.id ? 'bg-indigo-600 text-white': 'bg-gray-200 dark:bg-gray-600 text-gray-500'
              }`}>
                {step > s?.id ? <Icon name="Check" size={14} /> : s?.id}
              </div>
              <span className="text-xs font-medium hidden sm:block">{s?.label}</span>
            </div>
            {idx < steps?.length - 1 && (
              <div className={`flex-1 h-0.5 ${
                step > s?.id ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Step 1: Business Info */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ id: 'individual', label: 'Individual / Sole Proprietor', icon: 'User' }, { id: 'company', label: 'Company / LLC', icon: 'Building2' }]?.map(bt => (
                <button
                  key={bt?.id}
                  onClick={() => handleChange('businessType', bt?.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    formData?.businessType === bt?.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' :'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Icon name={bt?.icon} size={18} className={formData?.businessType === bt?.id ? 'text-indigo-600 mb-1' : 'text-gray-500 mb-1'} />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{bt?.label}</p>
                </button>
              ))}
            </div>
          </div>
          {formData?.businessType === 'company' && (
            <>
              <Input label="Business Name" placeholder="Legal business name" value={formData?.businessName} onChange={(e) => handleChange('businessName', e?.target?.value)} required />
              <Input label="EIN (Employer ID Number)" placeholder="XX-XXXXXXX" value={formData?.businessEin} onChange={(e) => handleChange('businessEin', e?.target?.value)} required />
            </>
          )}
          <Input label="Email Address" type="email" placeholder="creator@example.com" value={formData?.email} onChange={(e) => handleChange('email', e?.target?.value)} required />
          <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" value={formData?.phone} onChange={(e) => handleChange('phone', e?.target?.value)} required />
        </div>
      )}
      {/* Step 2: Personal Details */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" placeholder="John" value={formData?.firstName} onChange={(e) => handleChange('firstName', e?.target?.value)} required />
            <Input label="Last Name" placeholder="Doe" value={formData?.lastName} onChange={(e) => handleChange('lastName', e?.target?.value)} required />
          </div>
          <Input label="Date of Birth" type="date" value={formData?.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e?.target?.value)} required />
          <Input label="Last 4 digits of SSN" type="password" placeholder="XXXX" maxLength={4} value={formData?.ssn} onChange={(e) => handleChange('ssn', e?.target?.value?.replace(/\D/g, '')?.slice(0, 4))} required />
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <Icon name="Lock" size={12} className="inline mr-1" />
              Your SSN is encrypted and used only for identity verification per Stripe's security standards.
            </p>
          </div>
        </div>
      )}
      {/* Step 3: Address */}
      {step === 3 && (
        <div className="space-y-4">
          <Input label="Street Address" placeholder="123 Main St" value={formData?.address} onChange={(e) => handleChange('address', e?.target?.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" placeholder="New York" value={formData?.city} onChange={(e) => handleChange('city', e?.target?.value)} required />
            <Input label="State" placeholder="NY" value={formData?.state} onChange={(e) => handleChange('state', e?.target?.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="ZIP Code" placeholder="10001" value={formData?.zipCode} onChange={(e) => handleChange('zipCode', e?.target?.value)} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
              <select value={formData?.country} onChange={(e) => handleChange('country', e?.target?.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500">
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
              </select>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-6">
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
        ) : <div />}
        <Button onClick={handleNext} disabled={loading} className="flex items-center gap-2">
          {loading ? <Icon name="Loader" size={16} className="animate-spin" /> : null}
          {step === 3 ? (loading ? 'Submitting...' : 'Submit Application') : 'Continue'}
          {step < 3 && <Icon name="ArrowRight" size={16} />}
        </Button>
      </div>
    </div>
  );
};

export default StripeConnectOnboarding;
