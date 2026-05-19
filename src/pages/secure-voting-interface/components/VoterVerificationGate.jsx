import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { walletService } from '../../../services/walletService';

const VoterVerificationGate = ({ election, onComplete, onCancel }) => {
  const { user } = useAuth();
  const [currentSubStep, setCurrentSubStep] = useState('summary'); // summary, fee, age, identity
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    if (user?.id) {
      walletService.getUserWallet(user.id).then(({ data }) => setWallet(data));
    }
  }, [user?.id]);

  // Determine required steps based on election settings
  const requiresFee = election?.entryFee !== 'Free';
  const requiresAge = election?.ageVerificationRequired;
  const requiresIdentity = election?.identityVerificationRequired;

  const steps = [
    { id: 'summary', title: 'Participation Requirements', icon: 'Shield' },
    ...(requiresFee ? [{ id: 'fee', title: 'Participation Fee', icon: 'DollarSign' }] : []),
    ...(requiresAge ? [{ id: 'age', title: 'Age Verification', icon: 'UserCheck' }] : []),
    ...(requiresIdentity ? [{ id: 'identity', title: 'Identity Verification', icon: 'Fingerprint' }] : []),
  ];

  const handleStart = () => {
    if (requiresFee) setCurrentSubStep('fee');
    else if (requiresAge) setCurrentSubStep('age');
    else if (requiresIdentity) setCurrentSubStep('identity');
    else onComplete();
  };

  const handleFeePayment = async () => {
    setLoading(true);
    setError('');
    try {
      // Parse fee amount
      const feeAmount = parseFloat(election?.entryFee?.replace(/[^0-9.]/g, '') || 0);
      const balance = parseFloat(wallet?.availableBalance || 0);

      if (balance < feeAmount) {
        throw new Error('Insufficient balance in your eWallet.');
      }

      // Simulate payment logic (in real app, call walletService.createTransaction)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (requiresAge) setCurrentSubStep('age');
      else if (requiresIdentity) setCurrentSubStep('identity');
      else onComplete();
    } catch (err) {
      setError(err?.message || 'Payment failed. Please check your wallet balance.');
    } finally {
      setLoading(false);
    }
  };

  const handleAgeVerification = async () => {
    setLoading(true);
    setError('');
    try {
      // Waterfall Approach
      // Step 1: AI Facial Age Estimation
      console.log('Running Facial Age Estimation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate borderline case or success
      const isBorderline = Math.random() > 0.7;
      if (isBorderline) {
        console.log('Age borderline - falling back to Government ID');
        // In a real app, this would trigger the ID upload flow
      }

      if (requiresIdentity) setCurrentSubStep('identity');
      else onComplete();
    } catch (err) {
      setError('Age verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleIdentityVerification = async () => {
    setLoading(true);
    setError('');
    try {
      // Identity verification logic (Sumsub/Veriff integration)
      await new Promise(resolve => setTimeout(resolve, 2500));
      onComplete();
    } catch (err) {
      setError('Identity verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentSubStep) {
      case 'summary':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground">Participation Gated</h2>
              <p className="text-muted-foreground mt-2">
                This election has mandatory participation requirements to ensure integrity.
              </p>
            </div>

            <div className="space-y-3">
              {steps.filter(s => s.id !== 'summary').map((step, idx) => (
                <div key={step.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                  <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-sm">
                    <Icon name={step.icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">{step.title}</p>
                    <p className="text-xs text-muted-foreground">Verification required before voting</p>
                  </div>
                  <div className="ml-auto">
                    <Icon name="Circle" size={16} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleStart} fullWidth size="lg">
                Start Verification
                <Icon name="ArrowRight" size={20} />
              </Button>
              <Button onClick={onCancel} variant="ghost" fullWidth>
                Back to Hub
              </Button>
            </div>
          </div>
        );

      case 'fee':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="DollarSign" size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground">Participation Fee</h2>
              <p className="text-muted-foreground mt-2">
                A fee is required to participate in this election.
              </p>
            </div>

            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center">
              <p className="text-sm font-medium text-green-600 uppercase tracking-widest mb-1">Fee Amount</p>
              <p className="text-4xl font-black text-foreground">{election?.entryFee}</p>
              <div className="mt-4 pt-4 border-t border-green-500/10 flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Your Balance:</span>
                <span className="font-bold text-foreground">{walletService.formatCurrency(wallet?.availableBalance || 0)}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button onClick={handleFeePayment} loading={loading} fullWidth size="lg">
                Pay & Continue
              </Button>
              <Button onClick={() => setCurrentSubStep('summary')} variant="ghost" fullWidth disabled={loading}>
                Back
              </Button>
            </div>
          </div>
        );

      case 'age':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="UserCheck" size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground">Age Verification</h2>
              <p className="text-muted-foreground mt-2">
                We need to estimate your age using facial biometrics.
              </p>
            </div>

            <div className="aspect-video bg-muted rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center gap-4">
              {loading ? (
                <>
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm font-medium text-foreground">Analyzing facial features...</p>
                  <p className="text-xs text-muted-foreground italic">Waterfall: Step 1 (AI Estimation)</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="Camera" size={28} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Camera Access Required</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      No images or personal data will be stored. We only estimate your age range.
                    </p>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center">
                {error}
              </div>
            )}

            {!loading && (
              <div className="flex flex-col gap-3">
                <Button onClick={handleAgeVerification} fullWidth size="lg">
                  Verify Age Now
                </Button>
                <Button onClick={() => setCurrentSubStep('summary')} variant="ghost" fullWidth>
                  Back
                </Button>
              </div>
            )}
          </div>
        );

      case 'identity':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Fingerprint" size={32} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground">Identity Verification</h2>
              <p className="text-muted-foreground mt-2">
                One-time government ID verification required.
              </p>
            </div>

            <div className="bg-muted/30 border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-background rounded-xl shadow-sm">
                  <Icon name="FileText" size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Secure ID Matching</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Powered by Sumsub. Your data is encrypted and used only for deduplication.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button onClick={handleIdentityVerification} loading={loading} fullWidth size="lg">
                Verify Identity
              </Button>
              <Button onClick={() => setCurrentSubStep('summary')} variant="ghost" fullWidth disabled={loading}>
                Back
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-background border border-border rounded-[32px] shadow-democratic-xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 md:p-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VoterVerificationGate;
