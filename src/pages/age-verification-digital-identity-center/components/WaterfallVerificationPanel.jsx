import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { ageVerificationService } from '../../../services/ageVerificationService';

const WaterfallVerificationPanel = ({ onVerificationComplete }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationResults, setVerificationResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      id: 1,
      method: 'ai_facial',
      label: 'AI Facial Estimation',
      description: 'Low-friction initial verification',
      icon: 'User',
      threshold: 0.85
    },
    {
      id: 2,
      method: 'government_id',
      label: 'Government ID Verification',
      description: 'High-assurance fallback for borderline cases',
      icon: 'CreditCard',
      threshold: 0.90
    },
    {
      id: 3,
      method: 'biometric',
      label: 'Biometric Matching',
      description: 'Maximum security for critical scenarios',
      icon: 'Fingerprint',
      threshold: 0.95
    }
  ];

  const performWaterfallVerification = async () => {
    setLoading(true);
    try {
      const { data, requiresFallback, nextMethod, error } = await ageVerificationService?.performWaterfallVerification(
        user?.id,
        'demo-election-id',
        'ai_facial'
      );

      if (error) throw new Error(error?.message);

      setVerificationResults([...verificationResults, data]);

      if (requiresFallback) {
        setCurrentStep(currentStep + 1);
      } else {
        onVerificationComplete?.(data);
      }
    } catch (err) {
      console.error('Waterfall verification error:', err);
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
            <h3 className="font-semibold text-foreground mb-1">Waterfall Verification Approach</h3>
            <p className="text-sm text-muted-foreground">
              Progressive security layers: Start with low-friction AI facial estimation. If confidence is borderline (within 3-year buffer), 
              automatically escalate to government ID verification. For maximum security scenarios, proceed to biometric matching.
            </p>
          </div>
        </div>
      </div>

      {/* Waterfall Steps Visualization */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Verification Flow</h3>
        <div className="space-y-4">
          {steps?.map((step, index) => {
            const isActive = currentStep === step?.id;
            const isCompleted = currentStep > step?.id;
            const result = verificationResults?.find(r => r?.verificationMethod === step?.method);

            return (
              <div key={step?.id}>
                <div className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                  isActive ? 'border-primary bg-primary/5' :
                  isCompleted ? 'border-success bg-success/5': 'border-border bg-muted/30'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-success' : isActive ?'bg-primary': 'bg-muted'
                  }`}>
                    {isCompleted ? (
                      <Icon name="Check" size={24} color="white" />
                    ) : (
                      <Icon name={step?.icon} size={24} color={isActive ? 'white' : 'var(--color-muted-foreground)'} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">Step {step?.id}: {step?.label}</h4>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                          Current
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{step?.description}</p>
                    {result && (
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Confidence: <span className="font-medium text-foreground">{(result?.confidenceScore * 100)?.toFixed(1)}%</span>
                        </span>
                        <span className="text-muted-foreground">
                          Status: <span className={`font-medium ${
                            result?.verificationStatus === 'verified' ? 'text-success' : 'text-warning'
                          }`}>{result?.verificationStatus}</span>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Threshold: {(step?.threshold * 100)?.toFixed(0)}%
                  </div>
                </div>
                {index < steps?.length - 1 && (
                  <div className="flex justify-center py-2">
                    <Icon name="ArrowDown" size={20} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      {currentStep <= steps?.length && (
        <Button onClick={performWaterfallVerification} disabled={loading} className="w-full" size="lg">
          {loading ? (
            <>
              <Icon name="Loader" size={20} className="animate-spin" />
              Verifying Step {currentStep}...
            </>
          ) : (
            <>
              <Icon name="Play" size={20} />
              Start {steps?.find(s => s?.id === currentStep)?.label}
            </>
          )}
        </Button>
      )}

      {/* Risk Assessment */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Risk-Based Escalation</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
            <Icon name="CheckCircle" size={18} className="text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Low Risk (Confidence ≥ 85%)</p>
              <p className="text-xs text-muted-foreground">AI facial estimation sufficient. No additional verification required.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
            <Icon name="AlertTriangle" size={18} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Medium Risk (Confidence 70-85%)</p>
              <p className="text-xs text-muted-foreground">Borderline case. Escalate to government ID verification for higher assurance.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
            <Icon name="AlertCircle" size={18} className="text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">High Risk (Confidence &lt; 70%)</p>
              <p className="text-xs text-muted-foreground">Critical scenario. Require biometric matching with liveness detection.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Minimization */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">Data Minimization Principle</p>
            <p className="text-xs text-muted-foreground">
              Each verification step collects only the minimum data required. If AI facial estimation passes, no ID documents are requested. 
              Temporary data (selfies, documents) is deleted within 24 hours. Only the binary "age verified" signal is retained.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterfallVerificationPanel;