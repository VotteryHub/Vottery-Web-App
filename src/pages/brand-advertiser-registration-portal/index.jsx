import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProgressIndicator from './components/ProgressIndicator';
import CompanyInformationForm from './components/CompanyInformationForm';
import IdentityVerificationForm from './components/IdentityVerificationForm';
import PaymentMethodSetupForm from './components/PaymentMethodSetupForm';
import ComplianceScreeningPanel from './components/ComplianceScreeningPanel';
import ContractManagementPanel from './components/ContractManagementPanel';
import ApplicationReview from './components/ApplicationReview';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { CAMPAIGN_MANAGEMENT_ROUTE } from '../../constants/votteryAdsConstants';

const BrandAdvertiserRegistrationPortal = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const steps = [
    { id: 'company', label: 'Company Info', component: CompanyInformationForm },
    { id: 'identity', label: 'Identity Verification', component: IdentityVerificationForm },
    { id: 'payment', label: 'Payment Setup', component: PaymentMethodSetupForm },
    { id: 'compliance', label: 'Compliance', component: ComplianceScreeningPanel },
    { id: 'contract', label: 'Contract', component: ContractManagementPanel },
    { id: 'review', label: 'Review', component: ApplicationReview }
  ];

  const [formData, setFormData] = useState({
    // Company Information
    businessName: '',
    registrationNumber: '',
    industryClassification: '',
    businessAddress: '',
    country: '',
    city: '',
    postalCode: '',
    website: '',
    businessEmail: '',
    businessPhone: '',
    
    // Authorized Representative
    representativeName: '',
    representativeTitle: '',
    representativeEmail: '',
    representativePhone: '',
    representativeIdDocument: null,
    representativeIdType: '',
    
    // Tax Information
    taxIdNumber: '',
    taxIdType: '',
    taxDocument: null,
    
    // Identity Verification
    kycStatus: 'pending',
    amlStatus: 'pending',
    facialRecognitionStatus: 'pending',
    verificationDocuments: [],
    
    // Payment Method
    paymentProcessor: '',
    bankAccountNumber: '',
    bankName: '',
    bankRoutingNumber: '',
    creditCardLast4: '',
    digitalWalletId: '',
    pciCompliant: false,
    
    // Compliance
    backgroundCheckStatus: 'pending',
    sanctionsCheckStatus: 'pending',
    regulatoryApprovalStatus: 'pending',
    complianceNotes: '',
    
    // Contract
    contractType: 'standard',
    contractTerms: '',
    digitalSignature: null,
    signatureDate: '',
    agreedToTerms: false,
    agreedToPrivacyPolicy: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Company Information
        if (!formData?.businessName?.trim()) newErrors.businessName = 'Business name is required';
        if (!formData?.registrationNumber?.trim()) newErrors.registrationNumber = 'Registration number is required';
        if (!formData?.industryClassification) newErrors.industryClassification = 'Industry classification is required';
        if (!formData?.businessEmail?.trim()) newErrors.businessEmail = 'Business email is required';
        if (!formData?.country?.trim()) newErrors.country = 'Country is required';
        if (!formData?.taxIdNumber?.trim()) newErrors.taxIdNumber = 'Tax ID is required';
        if (!formData?.representativeName?.trim()) newErrors.representativeName = 'Representative name is required';
        break;

      case 2: // Identity Verification
        if (!formData?.representativeIdDocument) newErrors.representativeIdDocument = 'ID document is required';
        if (!formData?.representativeIdType) newErrors.representativeIdType = 'ID type is required';
        if (formData?.verificationDocuments?.length === 0) {
          newErrors.verificationDocuments = 'At least one verification document is required';
        }
        break;

      case 3: // Payment Setup
        if (!formData?.paymentProcessor) newErrors.paymentProcessor = 'Payment processor is required';
        if (formData?.paymentProcessor === 'bank' && !formData?.bankAccountNumber?.trim()) {
          newErrors.bankAccountNumber = 'Bank account number is required';
        }
        if (!formData?.pciCompliant) newErrors.pciCompliant = 'PCI compliance confirmation is required';
        break;

      case 4: // Compliance
        // Compliance checks are automated, no validation needed
        break;

      case 5: // Contract
        if (!formData?.contractType) newErrors.contractType = 'Contract type is required';
        if (!formData?.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms';
        if (!formData?.agreedToPrivacyPolicy) newErrors.agreedToPrivacyPolicy = 'You must agree to the privacy policy';
        if (!formData?.digitalSignature) newErrors.digitalSignature = 'Digital signature is required';
        break;

      case 6: // Review
        // Final review, no additional validation
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps?.length) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        analytics?.trackEvent('registration_step_completed', {
          step: currentStep,
          step_name: steps?.[currentStep - 1]?.label
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setIsSubmitting(true);
      
      // Simulate API call for registration submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      analytics?.trackEvent('advertiser_registration_submitted', {
        business_name: formData?.businessName,
        industry: formData?.industryClassification,
        payment_processor: formData?.paymentProcessor
      });

      setShowSuccessMessage(true);
      
      setTimeout(() => {
        navigate(CAMPAIGN_MANAGEMENT_ROUTE);
      }, 3000);
    } catch (error) {
      console.error('Registration submission failed:', error);
      setErrors({ submit: 'Failed to submit registration. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps?.[currentStep - 1]?.component;

  return (
    <GeneralPageLayout 
      title="Brand Advertiser Registration Portal" 
      description="Streamlined registration portal for new brand advertisers with identity verification, payment setup, compliance screening, and contract management."
      showSidebar={false}
      maxWidth="max-w-[1200px]"
    >
      <div className="w-full">
          {showSuccessMessage ? (
            <div className="bg-card rounded-xl border border-border p-8 md:p-12 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={40} color="var(--color-success)" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
                Registration Submitted Successfully!
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-6">
                Your application is under review. You'll receive a notification once approved.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>Redirecting to dashboard...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Brand Advertiser Registration
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Complete the registration process to start advertising on Vottery platform
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                <ProgressIndicator
                  currentStep={currentStep}
                  totalSteps={steps?.length}
                  steps={steps}
                />

                <div className="mt-8">
                  <CurrentStepComponent
                    formData={formData}
                    onChange={handleChange}
                    errors={errors}
                  />
                </div>

                {errors?.submit && (
                  <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{errors?.submit}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1 || isSubmitting}
                    iconName="ChevronLeft"
                  >
                    Back
                  </Button>

                  {currentStep < steps?.length ? (
                    <Button
                      onClick={handleNext}
                      disabled={isSubmitting}
                      iconName="ChevronRight"
                      iconPosition="right"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      iconName={isSubmitting ? 'Loader2' : 'Check'}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
    </GeneralPageLayout>
  );
};

export default BrandAdvertiserRegistrationPortal;