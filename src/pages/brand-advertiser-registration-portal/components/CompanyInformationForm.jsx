import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const CompanyInformationForm = ({ formData, onChange, errors }) => {
  const industryOptions = [
    { value: '', label: 'Select Industry' },
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'entertainment', label: 'Entertainment & Media' },
    { value: 'education', label: 'Education' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'food_beverage', label: 'Food & Beverage' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'other', label: 'Other' }
  ];

  const taxIdTypes = [
    { value: '', label: 'Select Tax ID Type' },
    { value: 'ein', label: 'EIN (Employer Identification Number)' },
    { value: 'vat', label: 'VAT Number' },
    { value: 'gst', label: 'GST Number' },
    { value: 'pan', label: 'PAN (Permanent Account Number)' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
          Company Information
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Provide your business details and authorized representative information
        </p>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Required Information</p>
            <p className="text-xs text-muted-foreground">
              All fields marked with * are required. Ensure information matches your official business registration documents.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-heading font-semibold text-foreground">Business Details</h4>
        
        <Input
          label="Business Name"
          type="text"
          placeholder="Enter your registered business name"
          value={formData?.businessName}
          onChange={(e) => onChange('businessName', e?.target?.value)}
          error={errors?.businessName}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Registration Number"
            type="text"
            placeholder="Business registration number"
            value={formData?.registrationNumber}
            onChange={(e) => onChange('registrationNumber', e?.target?.value)}
            error={errors?.registrationNumber}
            required
          />

          <Select
            label="Industry Classification"
            value={formData?.industryClassification}
            onChange={(e) => onChange('industryClassification', e?.target?.value)}
            options={industryOptions}
            error={errors?.industryClassification}
            required
          />
        </div>

        <Input
          label="Business Address"
          type="text"
          placeholder="Street address"
          value={formData?.businessAddress}
          onChange={(e) => onChange('businessAddress', e?.target?.value)}
          error={errors?.businessAddress}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Country"
            type="text"
            placeholder="Country"
            value={formData?.country}
            onChange={(e) => onChange('country', e?.target?.value)}
            error={errors?.country}
            required
          />

          <Input
            label="City"
            type="text"
            placeholder="City"
            value={formData?.city}
            onChange={(e) => onChange('city', e?.target?.value)}
            error={errors?.city}
          />

          <Input
            label="Postal Code"
            type="text"
            placeholder="Postal code"
            value={formData?.postalCode}
            onChange={(e) => onChange('postalCode', e?.target?.value)}
            error={errors?.postalCode}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Website"
            type="url"
            placeholder="https://www.example.com"
            value={formData?.website}
            onChange={(e) => onChange('website', e?.target?.value)}
            error={errors?.website}
          />

          <Input
            label="Business Email"
            type="email"
            placeholder="contact@business.com"
            value={formData?.businessEmail}
            onChange={(e) => onChange('businessEmail', e?.target?.value)}
            error={errors?.businessEmail}
            required
          />
        </div>

        <Input
          label="Business Phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData?.businessPhone}
          onChange={(e) => onChange('businessPhone', e?.target?.value)}
          error={errors?.businessPhone}
        />
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h4 className="text-lg font-heading font-semibold text-foreground">Authorized Representative</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Representative's full name"
            value={formData?.representativeName}
            onChange={(e) => onChange('representativeName', e?.target?.value)}
            error={errors?.representativeName}
            required
          />

          <Input
            label="Job Title"
            type="text"
            placeholder="e.g., CEO, Marketing Director"
            value={formData?.representativeTitle}
            onChange={(e) => onChange('representativeTitle', e?.target?.value)}
            error={errors?.representativeTitle}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="representative@business.com"
            value={formData?.representativeEmail}
            onChange={(e) => onChange('representativeEmail', e?.target?.value)}
            error={errors?.representativeEmail}
          />

          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData?.representativePhone}
            onChange={(e) => onChange('representativePhone', e?.target?.value)}
            error={errors?.representativePhone}
          />
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h4 className="text-lg font-heading font-semibold text-foreground">Tax Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tax ID Type"
            value={formData?.taxIdType}
            onChange={(e) => onChange('taxIdType', e?.target?.value)}
            options={taxIdTypes}
            error={errors?.taxIdType}
          />

          <Input
            label="Tax ID Number"
            type="text"
            placeholder="Enter tax identification number"
            value={formData?.taxIdNumber}
            onChange={(e) => onChange('taxIdNumber', e?.target?.value)}
            error={errors?.taxIdNumber}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInformationForm;