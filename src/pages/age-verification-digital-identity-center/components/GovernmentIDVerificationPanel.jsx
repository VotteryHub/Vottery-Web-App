import React, { useState, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { ageVerificationService } from '../../../services/ageVerificationService';

const GovernmentIDVerificationPanel = ({ onVerificationComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [documentType, setDocumentType] = useState('passport');
  const [idImage, setIdImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const idInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  const documentTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'drivers_license', label: "Driver\'s License" },
    { value: 'national_id', label: 'National ID Card' },
    { value: 'residence_permit', label: 'Residence Permit' }
  ];

  const handleIDUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdImage(reader?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleSelfieUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfieImage(reader?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const performVerification = async () => {
    if (!idImage || !selfieImage) return;

    setLoading(true);
    try {
      const { data, error } = await ageVerificationService?.performGovernmentIDVerification(
        user?.id,
        'demo-election-id',
        { type: documentType, image: idImage },
        selfieImage
      );

      if (error) throw new Error(error?.message);

      setVerificationResult(data);
      onVerificationComplete?.(data);
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">High-Assurance ID Verification</h3>
            <p className="text-sm text-muted-foreground">
              For high-stakes scenarios (alcohol sales, gambling, restricted content), upload government-issued ID paired with live selfie. 
              AI checks document authenticity, hologram detection, and biometric face matching to prevent deepfakes.
            </p>
          </div>
        </div>
      </div>

      {/* Document Type Selection */}
      <Select
        label="Document Type"
        description="Select the type of government-issued ID you'll upload"
        options={documentTypes}
        value={documentType}
        onChange={setDocumentType}
      />

      {/* Upload Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ID Document Upload */}
        <div className="border-2 border-dashed border-border rounded-xl p-6">
          <div className="text-center space-y-4">
            {!idImage ? (
              <>
                <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                  <Icon name="CreditCard" size={32} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Upload ID Document</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Clear photo of your {documentTypes?.find(d => d?.value === documentType)?.label}
                  </p>
                  <input
                    ref={idInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleIDUpload}
                    className="hidden"
                  />
                  <Button onClick={() => idInputRef?.current?.click()} variant="outline">
                    <Icon name="Upload" size={18} />
                    Choose File
                  </Button>
                </div>
              </>
            ) : (
              <>
                <img src={idImage} alt="ID document" className="w-full h-40 object-cover rounded-lg border-2 border-border" />
                <Button onClick={() => idInputRef?.current?.click()} variant="outline" size="sm">
                  <Icon name="RefreshCw" size={16} />
                  Change
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Selfie Upload */}
        <div className="border-2 border-dashed border-border rounded-xl p-6">
          <div className="text-center space-y-4">
            {!selfieImage ? (
              <>
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Camera" size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Upload Live Selfie</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Recent photo of your face for biometric matching
                  </p>
                  <input
                    ref={selfieInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieUpload}
                    className="hidden"
                  />
                  <Button onClick={() => selfieInputRef?.current?.click()} variant="outline">
                    <Icon name="Upload" size={18} />
                    Choose File
                  </Button>
                </div>
              </>
            ) : (
              <>
                <img src={selfieImage} alt="Selfie" className="w-full h-40 object-cover rounded-lg border-2 border-border" />
                <Button onClick={() => selfieInputRef?.current?.click()} variant="outline" size="sm">
                  <Icon name="RefreshCw" size={16} />
                  Change
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Verify Button */}
      {idImage && selfieImage && (
        <Button onClick={performVerification} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Icon name="Loader" size={18} className="animate-spin" />
              Verifying Documents...
            </>
          ) : (
            <>
              <Icon name="ShieldCheck" size={18} />
              Verify Identity
            </>
          )}
        </Button>
      )}

      {/* Verification Result */}
      {verificationResult && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Verification Results</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              verificationResult?.verificationStatus === 'verified' 
                ? 'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
            }`}>
              {verificationResult?.verificationStatus?.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Document Authenticity</p>
              <p className="text-2xl font-bold text-foreground">{(verificationResult?.documentAuthenticityScore * 100)?.toFixed(1)}%</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Biometric Match</p>
              <p className="text-2xl font-bold text-foreground">{(verificationResult?.biometricMatchScore * 100)?.toFixed(1)}%</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Liveness Check</p>
              <p className="text-2xl font-bold text-foreground">{verificationResult?.livenessCheckPassed ? '✓ Passed' : '✗ Failed'}</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">Verification Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Document Type:</span>
                <span className="text-foreground font-medium">{verificationResult?.documentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">OCR Validation:</span>
                <span className="text-success font-medium">{verificationResult?.verificationMetadata?.ocrValidation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hologram Check:</span>
                <span className="text-success font-medium">{verificationResult?.verificationMetadata?.hologramCheck}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Microprint Verification:</span>
                <span className="text-success font-medium">{verificationResult?.verificationMetadata?.microPrintVerification}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Lock" size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">Anti-Spoofing Protection</p>
            <p className="text-xs text-muted-foreground">
              Our AI performs liveness detection to prevent deepfakes, stolen IDs, and photo manipulation. 
              All uploaded documents are encrypted and deleted within 24 hours after verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentIDVerificationPanel;