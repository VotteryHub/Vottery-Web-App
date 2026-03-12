import React, { useState } from 'react';

import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';


const IdentityVerificationForm = ({ formData, onChange, errors }) => {
  const [dragActive, setDragActive] = useState(false);

  const idTypes = [
    { value: '', label: 'Select ID Type' },
    { value: 'passport', label: 'Passport' },
    { value: 'drivers_license', label: "Driver\'s License" },
    { value: 'national_id', label: 'National ID Card' },
    { value: 'other', label: 'Other Government ID' }
  ];

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e, field) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      const file = e?.dataTransfer?.files?.[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(field, event?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleFileInput = (e, field) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      const file = e?.target?.files?.[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(field, event?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleVerificationDocumentUpload = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      const file = e?.target?.files?.[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const newDoc = {
          id: Date.now(),
          name: file?.name,
          data: event?.target?.result,
          uploadedAt: new Date()?.toISOString()
        };
        onChange('verificationDocuments', [...(formData?.verificationDocuments || []), newDoc]);
      };
      reader?.readAsDataURL(file);
    }
  };

  const removeDocument = (docId) => {
    onChange('verificationDocuments', formData?.verificationDocuments?.filter(doc => doc?.id !== docId));
  };

  const startKYCVerification = () => {
    onChange('kycStatus', 'processing');
    // Simulate verification process
    setTimeout(() => {
      onChange('kycStatus', 'verified');
    }, 3000);
  };

  const startAMLVerification = () => {
    onChange('amlStatus', 'processing');
    setTimeout(() => {
      onChange('amlStatus', 'verified');
    }, 3000);
  };

  const startFacialRecognition = () => {
    onChange('facialRecognitionStatus', 'processing');
    setTimeout(() => {
      onChange('facialRecognitionStatus', 'verified');
    }, 3000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-muted text-muted-foreground', icon: 'Clock', label: 'Pending' },
      processing: { color: 'bg-warning/10 text-warning', icon: 'Loader2', label: 'Processing' },
      verified: { color: 'bg-success/10 text-success', icon: 'CheckCircle', label: 'Verified' },
      failed: { color: 'bg-destructive/10 text-destructive', icon: 'XCircle', label: 'Failed' }
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
          Identity Verification
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Upload identification documents and complete automated verification checks
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-heading font-semibold text-foreground">Representative ID Document</h4>
        
        <Select
          label="ID Document Type"
          value={formData?.representativeIdType}
          onChange={(e) => onChange('representativeIdType', e?.target?.value)}
          options={idTypes}
          error={errors?.representativeIdType}
          required
        />

        {!formData?.representativeIdDocument ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-250 ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => handleDrop(e, 'representativeIdDocument')}
          >
            <Icon name="Upload" size={32} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground mb-2">Drop ID document here</p>
            <p className="text-xs text-muted-foreground mb-4">or</p>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('id-upload')?.click()}>
              Browse Files
            </Button>
            <input
              id="id-upload"
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => handleFileInput(e, 'representativeIdDocument')}
            />
          </div>
        ) : (
          <div className="relative bg-muted rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={24} className="text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">ID Document Uploaded</p>
                <p className="text-xs text-muted-foreground">Document ready for verification</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                onClick={() => onChange('representativeIdDocument', null)}
              >
                Remove
              </Button>
            </div>
          </div>
        )}
        {errors?.representativeIdDocument && (
          <p className="text-sm text-destructive">{errors?.representativeIdDocument}</p>
        )}
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h4 className="text-lg font-heading font-semibold text-foreground">Additional Verification Documents</h4>
        <p className="text-sm text-muted-foreground">Upload business registration, proof of address, or other supporting documents</p>
        
        <div className="space-y-3">
          {formData?.verificationDocuments?.map((doc) => (
            <div key={doc?.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border">
              <Icon name="File" size={20} className="text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{doc?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Uploaded {new Date(doc?.uploadedAt)?.toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Trash2"
                onClick={() => removeDocument(doc?.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          iconName="Plus"
          onClick={() => document.getElementById('verification-docs-upload')?.click()}
        >
          Add Document
        </Button>
        <input
          id="verification-docs-upload"
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleVerificationDocumentUpload}
        />
        {errors?.verificationDocuments && (
          <p className="text-sm text-destructive">{errors?.verificationDocuments}</p>
        )}
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h4 className="text-lg font-heading font-semibold text-foreground">Automated Verification Status</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">KYC Verification</span>
              {getStatusBadge(formData?.kycStatus)}
            </div>
            <p className="text-xs text-muted-foreground mb-3">Know Your Customer identity check</p>
            {formData?.kycStatus === 'pending' && (
              <Button size="sm" variant="outline" onClick={startKYCVerification} className="w-full">
                Start Verification
              </Button>
            )}
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">AML Screening</span>
              {getStatusBadge(formData?.amlStatus)}
            </div>
            <p className="text-xs text-muted-foreground mb-3">Anti-Money Laundering check</p>
            {formData?.amlStatus === 'pending' && (
              <Button size="sm" variant="outline" onClick={startAMLVerification} className="w-full">
                Start Screening
              </Button>
            )}
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Facial Recognition</span>
              {getStatusBadge(formData?.facialRecognitionStatus)}
            </div>
            <p className="text-xs text-muted-foreground mb-3">Biometric identity verification</p>
            {formData?.facialRecognitionStatus === 'pending' && (
              <Button size="sm" variant="outline" onClick={startFacialRecognition} className="w-full">
                Start Scan
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerificationForm;