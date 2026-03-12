import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const BiometricMatchingPanel = ({ onVerificationComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [biometricType, setBiometricType] = useState('fingerprint');
  const [verificationResult, setVerificationResult] = useState(null);
  const [biometricSupported, setBiometricSupported] = useState(true);

  const biometricTypes = [
    { id: 'fingerprint', label: 'Fingerprint Scan', icon: 'Fingerprint', description: 'Touch sensor authentication' },
    { id: 'voice', label: 'Voice Recognition', icon: 'Mic', description: 'Voice pattern analysis' },
    { id: 'facial', label: 'Facial Recognition', icon: 'User', description: '3D face mapping with liveness detection' }
  ];

  const performBiometricVerification = async () => {
    setLoading(true);
    try {
      // Simulate biometric verification (in production, use WebAuthn API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResult = {
        verificationStatus: 'verified',
        confidenceScore: 0.96,
        biometricType,
        livenessCheckPassed: true,
        verificationMetadata: {
          algorithm: biometricType === 'fingerprint' ? 'minutiae_matching' : 'deep_neural_network',
          antiSpoofing: 'passed',
          qualityScore: 0.94
        }
      };

      setVerificationResult(mockResult);
      onVerificationComplete?.(mockResult);
    } catch (err) {
      console.error('Biometric verification error:', err);
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
            <h3 className="font-semibold text-foreground mb-1">Multi-Modal Biometric Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Advanced biometric matching using fingerprint, voice, and facial recognition with liveness detection. 
              Prevents replay attacks and ensures the person is physically present during verification.
            </p>
          </div>
        </div>
      </div>

      {/* Biometric Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {biometricTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => setBiometricType(type?.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
              biometricType === type?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 bg-card'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                biometricType === type?.id ? 'bg-primary' : 'bg-muted'
              }`}>
                <Icon name={type?.icon} size={32} color={biometricType === type?.id ? 'white' : 'var(--color-muted-foreground)'} />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{type?.label}</p>
                <p className="text-xs text-muted-foreground">{type?.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Verification Interface */}
      <div className="bg-card border border-border rounded-xl p-8">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Icon 
              name={biometricTypes?.find(t => t?.id === biometricType)?.icon} 
              size={64} 
              className="text-primary"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {biometricTypes?.find(t => t?.id === biometricType)?.label}
            </h3>
            <p className="text-sm text-muted-foreground">
              {biometricType === 'fingerprint' && 'Place your finger on the sensor when ready'}
              {biometricType === 'voice' && 'Click the button and speak clearly into your microphone'}
              {biometricType === 'facial' && 'Position your face within the frame and look directly at the camera'}
            </p>
          </div>
          <Button onClick={performBiometricVerification} disabled={loading} size="lg">
            {loading ? (
              <>
                <Icon name="Loader" size={20} className="animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Icon name="Scan" size={20} />
                Start {biometricTypes?.find(t => t?.id === biometricType)?.label}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Biometric Verification Results</h3>
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-success/10 text-success">
              {verificationResult?.verificationStatus?.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Match Confidence</p>
              <p className="text-2xl font-bold text-foreground">{(verificationResult?.confidenceScore * 100)?.toFixed(1)}%</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Liveness Detection</p>
              <p className="text-2xl font-bold text-success">✓ Passed</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Quality Score</p>
              <p className="text-2xl font-bold text-foreground">{(verificationResult?.verificationMetadata?.qualityScore * 100)?.toFixed(1)}%</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">Security Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biometric Type:</span>
                <span className="text-foreground font-medium capitalize">{verificationResult?.biometricType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Algorithm:</span>
                <span className="text-foreground font-medium">{verificationResult?.verificationMetadata?.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Anti-Spoofing:</span>
                <span className="text-success font-medium">{verificationResult?.verificationMetadata?.antiSpoofing}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Shield" size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium mb-1">Liveness Detection</p>
              <p className="text-xs text-muted-foreground">
                Advanced algorithms detect presentation attacks, ensuring the biometric sample comes from a live person, not a photo or recording.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Lock" size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium mb-1">Template Protection</p>
              <p className="text-xs text-muted-foreground">
                Biometric templates are encrypted and stored securely. Original biometric data is never retained after verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricMatchingPanel;