import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle, Circle, User, FileText, CreditCard, ArrowRight, ArrowLeft, Shield, Award } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { creatorVerificationService } from '../../services/creatorVerificationService';
import { multiCurrencyPayoutService } from '../../services/multiCurrencyPayoutService';
import toast from 'react-hot-toast';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';

const CreatorOnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Identity Verification
    fullName: '',
    dateOfBirth: '',
    country: '',
    documentType: 'passport',
    documentNumber: '',
    
    // Tax Setup
    taxId: '',
    taxCountry: '',
    taxResidency: '',
    w9Completed: false,
    
    // Banking Configuration
    bankingMethod: 'bank_transfer',
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    swiftCode: '',
    iban: '',
    
    // First Earnings Milestone
    contentType: '',
    targetAudience: '',
    expectedMonthlyRevenue: ''
  });
  const [milestones, setMilestones] = useState({
    identityVerified: false,
    taxSetupComplete: false,
    bankingConfigured: false,
    firstEarningReceived: false
  });

  const steps = [
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'Verify your identity to start earning',
      icon: User,
      fields: ['fullName', 'dateOfBirth', 'country', 'documentType', 'documentNumber']
    },
    {
      id: 'tax',
      title: 'Tax Setup',
      description: 'Configure tax information for compliance',
      icon: FileText,
      fields: ['taxId', 'taxCountry', 'taxResidency']
    },
    {
      id: 'banking',
      title: 'Banking Method Configuration',
      description: 'Set up how you want to receive payments',
      icon: CreditCard,
      fields: ['bankingMethod', 'accountHolderName', 'accountNumber']
    },
    {
      id: 'milestone',
      title: 'First Earnings Milestone',
      description: 'Set your goals and start earning',
      icon: Award,
      fields: ['contentType', 'targetAudience', 'expectedMonthlyRevenue']
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepIndex) => {
    const step = steps?.[stepIndex];
    const requiredFields = step?.fields;
    
    for (const field of requiredFields) {
      if (!formData?.[field] || formData?.[field]?.toString()?.trim() === '') {
        toast?.error(`Please fill in all required fields for ${step?.title}`);
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      // Save progress for current step
      if (currentStep === 0) {
        // Identity Verification
        const result = await creatorVerificationService?.submitVerification({
          fullName: formData?.fullName,
          dateOfBirth: formData?.dateOfBirth,
          country: formData?.country,
          documentType: formData?.documentType,
          documentNumber: formData?.documentNumber
        });
        
        if (result?.error) {
          toast?.error(result?.error?.message || 'Verification failed');
          setLoading(false);
          return;
        }
        
        setMilestones(prev => ({ ...prev, identityVerified: true }));
        toast?.success('Identity verification submitted successfully!');
      } else if (currentStep === 1) {
        // Tax Setup
        setMilestones(prev => ({ ...prev, taxSetupComplete: true }));
        toast?.success('Tax information saved successfully!');
      } else if (currentStep === 2) {
        // Banking Configuration
        const result = await multiCurrencyPayoutService?.configureBankingMethod({
          method: formData?.bankingMethod,
          accountHolderName: formData?.accountHolderName,
          accountNumber: formData?.accountNumber,
          routingNumber: formData?.routingNumber,
          swiftCode: formData?.swiftCode,
          iban: formData?.iban,
          country: formData?.country
        });
        
        if (result?.error) {
          toast?.error(result?.error?.message || 'Banking configuration failed');
          setLoading(false);
          return;
        }
        
        setMilestones(prev => ({ ...prev, bankingConfigured: true }));
        toast?.success('Banking method configured successfully!');
      }

      if (currentStep < steps?.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      toast?.error(error?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast?.success('Onboarding completed! You can now start earning.');
    window.location.href = '/creator-earnings-command-center-with-stripe-integration';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Full Name *</label>
              <input
                type="text"
                value={formData?.fullName}
                onChange={(e) => handleInputChange('fullName', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
                placeholder="Enter your full legal name"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Date of Birth *</label>
              <input
                type="date"
                value={formData?.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Country *</label>
              <select
                value={formData?.country}
                onChange={(e) => handleInputChange('country', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
              >
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="IN">India</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Document Type *</label>
              <select
                value={formData?.documentType}
                onChange={(e) => handleInputChange('documentType', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
              >
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Document Number *</label>
              <input
                type="text"
                value={formData?.documentNumber}
                onChange={(e) => handleInputChange('documentNumber', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
                placeholder="Enter document number"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tax ID / SSN *</label>
              <input
                type="text"
                value={formData?.taxId}
                onChange={(e) => handleInputChange('taxId', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
                placeholder="Enter your tax identification number"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tax Country *</label>
              <select
                value={formData?.taxCountry}
                onChange={(e) => handleInputChange('taxCountry', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
              >
                <option value="">Select tax country</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="IN">India</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tax Residency Status *</label>
              <select
                value={formData?.taxResidency}
                onChange={(e) => handleInputChange('taxResidency', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
              >
                <option value="">Select residency status</option>
                <option value="resident">Tax Resident</option>
                <option value="non_resident">Non-Resident</option>
                <option value="dual">Dual Residency</option>
              </select>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Icon icon={Shield} className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Tax Compliance</p>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">Your tax information is encrypted and securely stored. We'll generate appropriate tax forms (1099, VAT, GST) based on your jurisdiction.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Banking Method *</label>
              <select
                value={formData?.bankingMethod}
                onChange={(e) => handleInputChange('bankingMethod', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
              >
                <option value="bank_transfer">Bank Transfer (ACH/Wire)</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe Direct</option>
                <option value="wise">Wise (TransferWise)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Account Holder Name *</label>
              <input
                type="text"
                value={formData?.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
                placeholder="Name on bank account"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Account Number *</label>
              <input
                type="text"
                value={formData?.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
                placeholder="Bank account number"
              />
            </div>
            {formData?.bankingMethod === 'bank_transfer' && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Routing Number</label>
                  <input
                    type="text"
                    value={formData?.routingNumber}
                    onChange={(e) => handleInputChange('routingNumber', e?.target?.value)}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
                    placeholder="9-digit routing number (US)"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">SWIFT/BIC Code</label>
                  <input
                    type="text"
                    value={formData?.swiftCode}
                    onChange={(e) => handleInputChange('swiftCode', e?.target?.value)}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
                    placeholder="For international transfers"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Primary Content Type *</label>
              <select
                value={formData?.contentType}
                onChange={(e) => handleInputChange('contentType', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
              >
                <option value="">Select content type</option>
                <option value="elections">Elections & Voting</option>
                <option value="videos">Video Content</option>
                <option value="articles">Articles & Blogs</option>
                <option value="courses">Courses & Tutorials</option>
                <option value="community">Community Building</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Audience *</label>
              <input
                type="text"
                value={formData?.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
                placeholder="e.g., Tech enthusiasts, Business professionals"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Expected Monthly Revenue *</label>
              <select
                value={formData?.expectedMonthlyRevenue}
                onChange={(e) => handleInputChange('expectedMonthlyRevenue', e?.target?.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
              >
                <option value="">Select revenue range</option>
                <option value="0-500">$0 - $500</option>
                <option value="500-2000">$500 - $2,000</option>
                <option value="2000-5000">$2,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000+">$10,000+</option>
              </select>
            </div>
            
            {/* Milestone Tracking */}
            <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl p-8 border border-green-500/10">
  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
    <Icon icon={Award} className="w-5 h-5 text-green-500" />
    Onboarding Progress
  </h3>
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <Icon icon={milestones?.identityVerified ? CheckCircle : Circle} className={`w-5 h-5 ${milestones?.identityVerified ? 'text-green-500' : 'text-slate-600'}`} />
      <span className={`text-[10px] font-black uppercase tracking-widest ${milestones?.identityVerified ? 'text-green-500' : 'text-slate-500'}`}>Identity Verified</span>
    </div>
    <div className="flex items-center gap-4">
      <Icon icon={milestones?.taxSetupComplete ? CheckCircle : Circle} className={`w-5 h-5 ${milestones?.taxSetupComplete ? 'text-green-500' : 'text-slate-600'}`} />
      <span className={`text-[10px] font-black uppercase tracking-widest ${milestones?.taxSetupComplete ? 'text-green-500' : 'text-slate-500'}`}>Tax Setup Complete</span>
    </div>
    <div className="flex items-center gap-4">
      <Icon icon={milestones?.bankingConfigured ? CheckCircle : Circle} className={`w-5 h-5 ${milestones?.bankingConfigured ? 'text-green-500' : 'text-slate-600'}`} />
      <span className={`text-[10px] font-black uppercase tracking-widest ${milestones?.bankingConfigured ? 'text-green-500' : 'text-slate-500'}`}>Banking Configured</span>
    </div>
    <div className="flex items-center gap-4">
      <Icon icon={Circle} className="w-5 h-5 text-slate-700" />
      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">First Earning Received (Pending)</span>
    </div>
  </div>
</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <GeneralPageLayout 
      title="Creator Onboarding Wizard"
      showSidebar={true}
      maxWidth="max-w-4xl"
    >
      <div className="w-full py-0">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps?.map((step, index) => (
              <React.Fragment key={step?.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    index < currentStep
                      ? 'bg-green-600 border-green-600 shadow-lg shadow-green-500/20'
                      : index === currentStep
                      ? 'bg-primary border-primary shadow-lg shadow-primary/20' :'bg-slate-800 border-slate-700'
                  }`}>
                    <Icon
                      icon={index < currentStep ? CheckCircle : step?.icon}
                      className={`w-5 h-5 ${
                        index <= currentStep ? 'text-white' : 'text-slate-500'
                      }`}
                    />
                  </div>
                  <p className={`text-[10px] mt-3 font-black uppercase tracking-widest ${
                    index <= currentStep ? 'text-white' : 'text-slate-500'
                  }`}>
                    {step?.title}
                  </p>
                </div>
                {index < steps?.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 mt-[-18px] ${
                    index < currentStep ? 'bg-green-600' : 'bg-slate-800'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 mb-8 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{steps?.[currentStep]?.title}</h2>
            <p className="text-slate-400 font-medium">{steps?.[currentStep]?.description}</p>
          </div>

          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
            variant="outline"
            className="flex items-center gap-2 px-6 py-4 rounded-2xl border-white/10 hover:bg-white/5 text-slate-300 font-black uppercase tracking-widest text-[10px]"
          >
            <Icon icon={ArrowLeft} className="w-4 h-4" />
            Back
          </Button>

          {currentStep < steps?.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 shadow-xl shadow-primary/20"
            >
              {loading ? 'Saving...' : 'Next Step'}
              <Icon icon={ArrowRight} className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-green-500/20"
            >
              Complete Onboarding
              <Icon icon={CheckCircle} className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default CreatorOnboardingWizard;