import React from 'react';
import Icon from '../../../components/AppIcon';

const ApplicationReview = ({ formData, onChange, errors }) => {
  const ReviewSection = ({ title, icon, children }) => (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name={icon} size={20} className="text-primary" />
        </div>
        <h4 className="text-lg font-heading font-semibold text-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );

  const ReviewItem = ({ label, value }) => (
    <div className="flex items-start justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium text-foreground text-right">{value || 'Not provided'}</span>
    </div>
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-muted text-muted-foreground', icon: 'Clock', label: 'Pending' },
      processing: { color: 'bg-warning/10 text-warning', icon: 'Loader2', label: 'Processing' },
      verified: { color: 'bg-success/10 text-success', icon: 'CheckCircle', label: 'Verified' },
      approved: { color: 'bg-success/10 text-success', icon: 'CheckCircle', label: 'Approved' }
    };
    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={14} />
        {config?.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
          Application Review
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Review all information before submitting your registration
        </p>
      </div>

      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Final Review</p>
            <p className="text-xs text-muted-foreground">
              Please review all information carefully. You can go back to any step to make changes before submitting.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ReviewSection title="Company Information" icon="Building">
          <div className="space-y-1">
            <ReviewItem label="Business Name" value={formData?.businessName} />
            <ReviewItem label="Registration Number" value={formData?.registrationNumber} />
            <ReviewItem label="Industry" value={formData?.industryClassification} />
            <ReviewItem label="Country" value={formData?.country} />
            <ReviewItem label="Business Email" value={formData?.businessEmail} />
            <ReviewItem label="Website" value={formData?.website} />
            <ReviewItem label="Tax ID" value={formData?.taxIdNumber} />
          </div>
        </ReviewSection>

        <ReviewSection title="Authorized Representative" icon="User">
          <div className="space-y-1">
            <ReviewItem label="Name" value={formData?.representativeName} />
            <ReviewItem label="Title" value={formData?.representativeTitle} />
            <ReviewItem label="Email" value={formData?.representativeEmail} />
            <ReviewItem label="Phone" value={formData?.representativePhone} />
            <ReviewItem label="ID Type" value={formData?.representativeIdType} />
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">ID Document:</span>
              <span className="text-sm font-medium text-success">
                {formData?.representativeIdDocument ? 'Uploaded' : 'Not uploaded'}
              </span>
            </div>
          </div>
        </ReviewSection>

        <ReviewSection title="Identity Verification" icon="ShieldCheck">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">KYC Verification:</span>
              {getStatusBadge(formData?.kycStatus)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">AML Screening:</span>
              {getStatusBadge(formData?.amlStatus)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Facial Recognition:</span>
              {getStatusBadge(formData?.facialRecognitionStatus)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Additional Documents:</span>
              <span className="text-sm font-medium text-foreground">
                {formData?.verificationDocuments?.length || 0} uploaded
              </span>
            </div>
          </div>
        </ReviewSection>

        <ReviewSection title="Payment Method" icon="CreditCard">
          <div className="space-y-1">
            <ReviewItem label="Payment Processor" value={formData?.paymentProcessor} />
            {formData?.paymentProcessor === 'bank' && (
              <>
                <ReviewItem label="Bank Name" value={formData?.bankName} />
                <ReviewItem label="Account Number" value={formData?.bankAccountNumber ? '****' + formData?.bankAccountNumber?.slice(-4) : ''} />
              </>
            )}
            {formData?.paymentProcessor === 'credit_card' && (
              <ReviewItem label="Card" value={formData?.creditCardLast4 ? '****' + formData?.creditCardLast4 : ''} />
            )}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">PCI Compliant:</span>
              <span className="text-sm font-medium text-success">
                {formData?.pciCompliant ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </ReviewSection>

        <ReviewSection title="Compliance Screening" icon="Shield">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Background Check:</span>
              {getStatusBadge(formData?.backgroundCheckStatus)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sanctions Check:</span>
              {getStatusBadge(formData?.sanctionsCheckStatus)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Regulatory Approval:</span>
              {getStatusBadge(formData?.regulatoryApprovalStatus)}
            </div>
          </div>
        </ReviewSection>

        <ReviewSection title="Contract & Agreement" icon="FileText">
          <div className="space-y-1">
            <ReviewItem label="Contract Type" value={formData?.contractType} />
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Terms Accepted:</span>
              <span className={`text-sm font-medium ${formData?.agreedToTerms ? 'text-success' : 'text-destructive'}`}>
                {formData?.agreedToTerms ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Privacy Policy Accepted:</span>
              <span className={`text-sm font-medium ${formData?.agreedToPrivacyPolicy ? 'text-success' : 'text-destructive'}`}>
                {formData?.agreedToPrivacyPolicy ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Digital Signature:</span>
              <span className={`text-sm font-medium ${formData?.digitalSignature ? 'text-success' : 'text-destructive'}`}>
                {formData?.digitalSignature ? 'Signed' : 'Not signed'}
              </span>
            </div>
          </div>
        </ReviewSection>
      </div>

      <div className="bg-success/5 rounded-lg p-6 border border-success/20">
        <div className="flex items-start gap-3">
          <Icon name="CheckCircle" size={24} className="text-success mt-0.5" />
          <div>
            <p className="text-base font-semibold text-success mb-2">Ready to Submit</p>
            <p className="text-sm text-muted-foreground">
              Your application is complete and ready for submission. Once submitted, our team will review your application within 2-3 business days. You'll receive email notifications about your application status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReview;