import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle, Circle, User, FileText, CreditCard, ArrowRight, ArrowLeft, Shield, Award } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { creatorVerificationService } from '../../services/creatorVerificationService';
import { multiCurrencyPayoutService } from '../../services/multiCurrencyPayoutService';
import toast from 'react-hot-toast';

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={formData?.fullName}
                onChange={(e) => handleInputChange('fullName', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full legal name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                value={formData?.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
              <select
                value={formData?.country}
                onChange={(e) => handleInputChange('country', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
              <select
                value={formData?.documentType}
                onChange={(e) => handleInputChange('documentType', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Number *</label>
              <input
                type="text"
                value={formData?.documentNumber}
                onChange={(e) => handleInputChange('documentNumber', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter document number"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID / SSN *</label>
              <input
                type="text"
                value={formData?.taxId}
                onChange={(e) => handleInputChange('taxId', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your tax identification number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax Country *</label>
              <select
                value={formData?.taxCountry}
                onChange={(e) => handleInputChange('taxCountry', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax Residency Status *</label>
              <select
                value={formData?.taxResidency}
                onChange={(e) => handleInputChange('taxResidency', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select residency status</option>
                <option value="resident">Tax Resident</option>
                <option value="non_resident">Non-Resident</option>
                <option value="dual">Dual Residency</option>
              </select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon icon={Shield} className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Tax Compliance</p>
                  <p className="text-sm text-blue-700">Your tax information is encrypted and securely stored. We'll generate appropriate tax forms (1099, VAT, GST) based on your jurisdiction.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banking Method *</label>
              <select
                value={formData?.bankingMethod}
                onChange={(e) => handleInputChange('bankingMethod', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bank_transfer">Bank Transfer (ACH/Wire)</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe Direct</option>
                <option value="wise">Wise (TransferWise)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
              <input
                type="text"
                value={formData?.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Name on bank account"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
              <input
                type="text"
                value={formData?.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bank account number"
              />
            </div>
            {formData?.bankingMethod === 'bank_transfer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                  <input
                    type="text"
                    value={formData?.routingNumber}
                    onChange={(e) => handleInputChange('routingNumber', e?.target?.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="9-digit routing number (US)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SWIFT/BIC Code</label>
                  <input
                    type="text"
                    value={formData?.swiftCode}
                    onChange={(e) => handleInputChange('swiftCode', e?.target?.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Content Type *</label>
              <select
                value={formData?.contentType}
                onChange={(e) => handleInputChange('contentType', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience *</label>
              <input
                type="text"
                value={formData?.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Tech enthusiasts, Business professionals"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Monthly Revenue *</label>
              <select
                value={formData?.expectedMonthlyRevenue}
                onChange={(e) => handleInputChange('expectedMonthlyRevenue', e?.target?.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon icon={Award} className="w-6 h-6 text-green-600" />
                Your Onboarding Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon icon={milestones?.identityVerified ? CheckCircle : Circle} className={`w-5 h-5 ${milestones?.identityVerified ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${milestones?.identityVerified ? 'text-green-700 font-medium' : 'text-gray-600'}`}>Identity Verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon={milestones?.taxSetupComplete ? CheckCircle : Circle} className={`w-5 h-5 ${milestones?.taxSetupComplete ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${milestones?.taxSetupComplete ? 'text-green-700 font-medium' : 'text-gray-600'}`}>Tax Setup Complete</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon={milestones?.bankingConfigured ? CheckCircle : Circle} className={`w-5 h-5 ${milestones?.bankingConfigured ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${milestones?.bankingConfigured ? 'text-green-700 font-medium' : 'text-gray-600'}`}>Banking Configured</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon={Circle} className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">First Earning Received (Pending)</span>
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
    <>
      <Helmet>
        <title>Creator Onboarding Wizard | Election Platform</title>
        <meta name="description" content="Complete your creator onboarding from registration through first monetization" />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <HeaderNavigation />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Onboarding</h1>
            <p className="text-gray-600">Complete these steps to start earning on our platform</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps?.map((step, index) => (
                <React.Fragment key={step?.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      index < currentStep
                        ? 'bg-green-600 border-green-600'
                        : index === currentStep
                        ? 'bg-blue-600 border-blue-600' :'bg-white border-gray-300'
                    }`}>
                      <Icon
                        icon={index < currentStep ? CheckCircle : step?.icon}
                        className={`w-6 h-6 ${
                          index <= currentStep ? 'text-white' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <p className={`text-xs mt-2 font-medium ${
                      index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step?.title}
                    </p>
                  </div>
                  {index < steps?.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 mb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps?.[currentStep]?.title}</h2>
              <p className="text-gray-600">{steps?.[currentStep]?.description}</p>
            </div>

            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Icon icon={ArrowLeft} className="w-4 h-4" />
              Back
            </Button>

            {currentStep < steps?.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? 'Saving...' : 'Next'}
                <Icon icon={ArrowRight} className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                Complete Onboarding
                <Icon icon={CheckCircle} className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatorOnboardingWizard;