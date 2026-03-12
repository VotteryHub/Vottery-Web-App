import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import AdminToolbar from '../../components/ui/AdminToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { creatorVerificationService } from '../../services/creatorVerificationService';
import { useAuth } from '../../contexts/AuthContext';
import { analytics } from '../../hooks/useGoogleAnalytics';
import toast from 'react-hot-toast';

const CreatorCountryVerificationInterface = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('verification');
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [countries, setCountries] = useState([]);
  const [taxIdTypes, setTaxIdTypes] = useState([]);
  const [verificationHistory, setVerificationHistory] = useState([]);
  
  const [formData, setFormData] = useState({
    countryCode: '',
    taxId: '',
    taxIdType: '',
    bankAccountNumber: '',
    bankName: '',
    bankRoutingNumber: '',
    bankSwiftCode: '',
    bankAccountHolderName: '',
    complianceDocuments: [],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [validationResult, setValidationResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
    analytics?.trackEvent('creator_verification_interface_viewed', {
      user_id: user?.id
    });
  }, [user]);

  useEffect(() => {
    if (formData?.countryCode) {
      loadTaxIdTypes(formData?.countryCode);
    }
  }, [formData?.countryCode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statusResult, countriesResult, historyResult] = await Promise.all([
        creatorVerificationService?.getVerificationStatus(user?.id),
        creatorVerificationService?.getCountriesList(),
        creatorVerificationService?.getVerificationHistory(user?.id)
      ]);

      if (statusResult?.data) {
        setVerificationStatus(statusResult?.data);
        if (statusResult?.data?.countryCode) {
          setFormData(prev => ({
            ...prev,
            countryCode: statusResult?.data?.countryCode
          }));
        }
      }

      if (countriesResult?.data) setCountries(countriesResult?.data);
      if (historyResult?.data) setVerificationHistory(historyResult?.data);
    } catch (error) {
      console.error('Error loading verification data:', error);
      toast?.error('Failed to load verification data');
    } finally {
      setLoading(false);
    }
  };

  const loadTaxIdTypes = async (countryCode) => {
    try {
      const result = await creatorVerificationService?.getTaxIdTypes(countryCode);
      if (result?.data) {
        setTaxIdTypes(result?.data);
        if (result?.data?.length === 1) {
          setFormData(prev => ({
            ...prev,
            taxIdType: result?.data?.[0]?.taxIdType
          }));
        }
      }
    } catch (error) {
      console.error('Error loading tax ID types:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (field === 'taxId' || field === 'taxIdType') {
      setValidationResult(null);
    }
  };

  const handleValidateTaxId = async () => {
    if (!formData?.countryCode || !formData?.taxId || !formData?.taxIdType) {
      toast?.error('Please fill in country, tax ID, and tax ID type');
      return;
    }

    try {
      const result = await creatorVerificationService?.validateTaxId(
        formData?.countryCode,
        formData?.taxId,
        formData?.taxIdType
      );

      if (result?.data) {
        setValidationResult(result?.data);
        if (result?.data?.isValid) {
          toast?.success('Tax ID format is valid');
        } else {
          toast?.error(result?.data?.errorMessage);
        }
      }
    } catch (error) {
      toast?.error('Validation failed');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    try {
      const result = await creatorVerificationService?.uploadComplianceDocument(
        user?.id,
        file,
        'verification_document'
      );

      if (result?.data) {
        setFormData(prev => ({
          ...prev,
          complianceDocuments: [...prev?.complianceDocuments, result?.data]
        }));
        toast?.success('Document uploaded successfully');
      }
    } catch (error) {
      toast?.error('Failed to upload document');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.countryCode) newErrors.countryCode = 'Country is required';
    if (!formData?.taxId) newErrors.taxId = 'Tax ID is required';
    if (!formData?.taxIdType) newErrors.taxIdType = 'Tax ID type is required';
    if (!formData?.bankAccountNumber) newErrors.bankAccountNumber = 'Bank account number is required';
    if (!formData?.bankName) newErrors.bankName = 'Bank name is required';
    if (!formData?.bankAccountHolderName) newErrors.bankAccountHolderName = 'Account holder name is required';

    if (!validationResult?.isValid) {
      newErrors.taxId = 'Please validate your tax ID first';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const verificationData = {
        countryCode: formData?.countryCode,
        taxId: formData?.taxId,
        taxIdType: formData?.taxIdType,
        bankingDetails: {
          accountNumber: formData?.bankAccountNumber,
          bankName: formData?.bankName,
          routingNumber: formData?.bankRoutingNumber,
          swiftCode: formData?.bankSwiftCode,
          accountHolderName: formData?.bankAccountHolderName
        },
        complianceDocs: formData?.complianceDocuments,
        notes: formData?.notes
      };

      const result = await creatorVerificationService?.submitVerificationRequest(
        user?.id,
        verificationData
      );

      if (result?.error) throw new Error(result?.error?.message);

      toast?.success('Verification request submitted successfully');
      analytics?.trackEvent('creator_verification_submitted', {
        country_code: formData?.countryCode,
        tax_id_type: formData?.taxIdType
      });

      await loadData();
      setActiveTab('status');
    } catch (error) {
      toast?.error(error?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'verification', label: 'Verification Form', icon: 'FileText' },
    { id: 'status', label: 'Verification Status', icon: 'CheckCircle' },
    { id: 'history', label: 'History', icon: 'History' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-success';
      case 'in_review': return 'text-warning';
      case 'rejected': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return 'CheckCircle';
      case 'in_review': return 'Clock';
      case 'rejected': return 'XCircle';
      default: return 'AlertCircle';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Creator Country Verification | Vottery</title>
        <meta name="description" content="Verify your creator account with country-specific tax ID and banking details" />
      </Helmet>

      <HeaderNavigation />
      <AdminToolbar />

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3">
            🌍 Creator Country Verification
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Complete your country-specific verification to enable payouts
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {tabs?.map((tab) => {
              const isActive = activeTab === tab?.id;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-250 whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span className="text-sm font-medium">{tab?.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Verification Form Tab */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            {verificationStatus?.verificationStatus === 'verified' && (
              <div className="card bg-success/10 border-success">
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={24} className="text-success mt-0.5" />
                  <div>
                    <h3 className="font-heading font-semibold text-success mb-1">
                      Account Verified
                    </h3>
                    <p className="text-sm text-success/80">
                      Your account is verified and ready for payouts. You can update your information below if needed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Country Selection
              </h3>
              
              <Select
                label="Country"
                value={formData?.countryCode}
                onChange={(e) => handleChange('countryCode', e?.target?.value)}
                error={errors?.countryCode}
                required
                options={[
                  { value: '', label: 'Select your country' },
                  ...countries?.map(c => ({
                    value: c?.countryCode,
                    label: c?.countryName
                  }))
                ]}
              />
            </div>

            {formData?.countryCode && (
              <>
                <div className="card">
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Tax Identification
                  </h3>

                  <div className="space-y-4">
                    <Select
                      label="Tax ID Type"
                      value={formData?.taxIdType}
                      onChange={(e) => handleChange('taxIdType', e?.target?.value)}
                      error={errors?.taxIdType}
                      required
                      options={[
                        { value: '', label: 'Select tax ID type' },
                        ...taxIdTypes?.map(t => ({
                          value: t?.taxIdType,
                          label: `${t?.taxIdLabel} (${t?.formatDescription})`
                        }))
                      ]}
                    />

                    {formData?.taxIdType && taxIdTypes?.find(t => t?.taxIdType === formData?.taxIdType) && (
                      <div className="bg-muted/30 rounded-lg p-4 border border-border">
                        <div className="flex items-start gap-3">
                          <Icon name="Info" size={20} className="text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Format Requirements</p>
                            <p className="text-xs text-muted-foreground">
                              {taxIdTypes?.find(t => t?.taxIdType === formData?.taxIdType)?.formatDescription}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Example: {taxIdTypes?.find(t => t?.taxIdType === formData?.taxIdType)?.example}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Input
                          label="Tax ID Number"
                          type="text"
                          placeholder="Enter your tax ID"
                          value={formData?.taxId}
                          onChange={(e) => handleChange('taxId', e?.target?.value)}
                          error={errors?.taxId}
                          required
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={handleValidateTaxId}
                          variant="outline"
                          disabled={!formData?.taxId || !formData?.taxIdType}
                        >
                          <Icon name="CheckCircle" size={16} />
                          Validate
                        </Button>
                      </div>
                    </div>

                    {validationResult && (
                      <div className={`rounded-lg p-4 border ${
                        validationResult?.isValid
                          ? 'bg-success/10 border-success' :'bg-destructive/10 border-destructive'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Icon
                            name={validationResult?.isValid ? 'CheckCircle' : 'XCircle'}
                            size={20}
                            className={validationResult?.isValid ? 'text-success' : 'text-destructive'}
                          />
                          <p className={`text-sm font-medium ${
                            validationResult?.isValid ? 'text-success' : 'text-destructive'
                          }`}>
                            {validationResult?.isValid
                              ? 'Tax ID format is valid'
                              : validationResult?.errorMessage
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Banking Details
                  </h3>

                  <div className="space-y-4">
                    <Input
                      label="Account Holder Name"
                      type="text"
                      placeholder="Full name as it appears on bank account"
                      value={formData?.bankAccountHolderName}
                      onChange={(e) => handleChange('bankAccountHolderName', e?.target?.value)}
                      error={errors?.bankAccountHolderName}
                      required
                    />

                    <Input
                      label="Bank Name"
                      type="text"
                      placeholder="Name of your bank"
                      value={formData?.bankName}
                      onChange={(e) => handleChange('bankName', e?.target?.value)}
                      error={errors?.bankName}
                      required
                    />

                    <Input
                      label="Bank Account Number"
                      type="text"
                      placeholder="Your bank account number"
                      value={formData?.bankAccountNumber}
                      onChange={(e) => handleChange('bankAccountNumber', e?.target?.value)}
                      error={errors?.bankAccountNumber}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Routing Number (if applicable)"
                        type="text"
                        placeholder="Bank routing number"
                        value={formData?.bankRoutingNumber}
                        onChange={(e) => handleChange('bankRoutingNumber', e?.target?.value)}
                      />

                      <Input
                        label="SWIFT/BIC Code (if applicable)"
                        type="text"
                        placeholder="International transfers"
                        value={formData?.bankSwiftCode}
                        onChange={(e) => handleChange('bankSwiftCode', e?.target?.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                    Compliance Documentation
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="flex items-start gap-3">
                        <Icon name="Upload" size={20} className="text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Required Documents</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Government-issued ID (passport, driver's license, or national ID)</li>
                            <li>• Proof of address (utility bill or bank statement, dated within 3 months)</li>
                            <li>• Tax registration certificate (if applicable)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Upload Documents
                      </label>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                    </div>

                    {formData?.complianceDocuments?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Uploaded Documents:</p>
                        {formData?.complianceDocuments?.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                            <Icon name="FileText" size={16} className="text-primary" />
                            <span className="text-sm text-foreground flex-1">{doc?.documentType}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(doc?.uploadedAt)?.toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={formData?.notes}
                        onChange={(e) => handleChange('notes', e?.target?.value)}
                        placeholder="Any additional information for verification"
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !validationResult?.isValid}
                    className="min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Icon name="Loader" size={16} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Icon name="Send" size={16} />
                        Submit Verification
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && verificationStatus && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-semibold text-foreground">
                  Verification Status
                </h3>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  verificationStatus?.verificationStatus === 'verified'
                    ? 'bg-success/10 border-success'
                    : verificationStatus?.verificationStatus === 'in_review' ?'bg-warning/10 border-warning' :'bg-muted border-border'
                }`}>
                  <Icon
                    name={getStatusIcon(verificationStatus?.verificationStatus)}
                    size={20}
                    className={getStatusColor(verificationStatus?.verificationStatus)}
                  />
                  <span className={`text-sm font-medium capitalize ${
                    getStatusColor(verificationStatus?.verificationStatus)
                  }`}>
                    {verificationStatus?.verificationStatus?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Country</p>
                  <p className="text-base font-medium text-foreground">
                    {verificationStatus?.countryCode || 'Not set'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tax ID Verified</p>
                  <div className="flex items-center gap-2">
                    <Icon
                      name={verificationStatus?.taxIdVerified ? 'CheckCircle' : 'XCircle'}
                      size={16}
                      className={verificationStatus?.taxIdVerified ? 'text-success' : 'text-muted-foreground'}
                    />
                    <span className="text-base font-medium text-foreground">
                      {verificationStatus?.taxIdVerified ? 'Verified' : 'Not verified'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Banking Details</p>
                  <div className="flex items-center gap-2">
                    <Icon
                      name={verificationStatus?.bankingDetailsComplete ? 'CheckCircle' : 'XCircle'}
                      size={16}
                      className={verificationStatus?.bankingDetailsComplete ? 'text-success' : 'text-muted-foreground'}
                    />
                    <span className="text-base font-medium text-foreground">
                      {verificationStatus?.bankingDetailsComplete ? 'Complete' : 'Incomplete'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Documents Submitted</p>
                  <p className="text-base font-medium text-foreground">
                    {verificationStatus?.complianceDocsCount || 0} documents
                  </p>
                </div>

                {verificationStatus?.verifiedAt && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Verified At</p>
                    <p className="text-base font-medium text-foreground">
                      {new Date(verificationStatus?.verifiedAt)?.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="card">
            <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
              Verification History
            </h3>

            {verificationHistory?.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No verification history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {verificationHistory?.map((record) => (
                  <div key={record?.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          name={getStatusIcon(record?.newStatus)}
                          size={20}
                          className={getStatusColor(record?.newStatus)}
                        />
                        <span className="font-medium text-foreground capitalize">
                          {record?.previousStatus || 'Initial'} → {record?.newStatus?.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(record?.createdAt)?.toLocaleString()}
                      </span>
                    </div>

                    {record?.verificationNotes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {record?.verificationNotes}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>Country: {record?.countryCode}</span>
                      <span>Tax ID Type: {record?.taxIdType}</span>
                      {record?.documentsSubmitted?.length > 0 && (
                        <span>{record?.documentsSubmitted?.length} documents</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CreatorCountryVerificationInterface;