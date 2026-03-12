import React, { useState, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { ageVerificationService } from '../../../services/ageVerificationService';

const AIFacialEstimationPanel = ({ onVerificationComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const performVerification = async () => {
    if (!imagePreview) return;

    setLoading(true);
    try {
      const { data, error } = await ageVerificationService?.performFacialAgeEstimation(
        user?.id,
        'demo-election-id', // Replace with actual election ID
        imagePreview
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
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Privacy-First Age Estimation</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered facial biometrics estimate age range without requiring ID or storing personal data. 
              Leading providers: Yoti, Ondato. Fast, low-friction entry point with 3-year buffer for borderline cases.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
        {!imagePreview ? (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Camera" size={40} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Upload Selfie for Age Estimation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Take a clear photo of your face. The AI will analyze facial features to estimate your age range.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button onClick={() => fileInputRef?.current?.click()}>
                <Icon name="Upload" size={18} />
                Choose Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <img src={imagePreview} alt="Uploaded selfie" className="w-48 h-48 mx-auto rounded-lg object-cover border-2 border-border" />
            <div className="flex gap-3 justify-center">
              <Button onClick={() => fileInputRef?.current?.click()} variant="outline">
                <Icon name="RefreshCw" size={18} />
                Change Photo
              </Button>
              <Button onClick={performVerification} disabled={loading}>
                {loading ? (
                  <>
                    <Icon name="Loader" size={18} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Icon name="Zap" size={18} />
                    Verify Age
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Verification Results</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              verificationResult?.verificationStatus === 'verified' 
                ? 'bg-success/10 text-success' :'bg-warning/10 text-warning'
            }`}>
              {verificationResult?.verificationStatus?.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Estimated Age</p>
              <p className="text-2xl font-bold text-foreground">{verificationResult?.estimatedAge}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Age Range</p>
              <p className="text-2xl font-bold text-foreground">
                {verificationResult?.ageRangeMin}-{verificationResult?.ageRangeMax}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Confidence</p>
              <p className="text-2xl font-bold text-foreground">{(verificationResult?.confidenceScore * 100)?.toFixed(1)}%</p>
            </div>
          </div>

          {verificationResult?.fallbackTriggered && (
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Borderline Result Detected</p>
                  <p className="text-sm text-muted-foreground">
                    Confidence score is within the 3-year buffer zone. We recommend escalating to Government ID verification for higher assurance.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">AI Analysis Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Algorithm:</span>
                <span className="text-foreground font-medium">{verificationResult?.verificationMetadata?.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bias Detection:</span>
                <span className="text-success font-medium">{verificationResult?.verificationMetadata?.biasDetection}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Liveness Check:</span>
                <span className="text-success font-medium">{verificationResult?.verificationMetadata?.livenessCheck ? 'Passed' : 'Failed'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Image Quality:</span>
                <span className="text-foreground font-medium">{verificationResult?.verificationMetadata?.imageQuality}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Minimization Notice */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">Data Minimization & Privacy</p>
            <p className="text-xs text-muted-foreground">
              We collect only the binary "over 18/not" signal. Your selfie is deleted immediately after analysis (within 24 hours). 
              No exact date of birth is stored. Compliant with GDPR and ISO/IEC 27566-1:2025 standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFacialEstimationPanel;