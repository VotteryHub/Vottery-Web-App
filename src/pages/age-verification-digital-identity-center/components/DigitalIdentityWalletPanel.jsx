import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { ageVerificationService } from '../../../services/ageVerificationService';

const DigitalIdentityWalletPanel = ({ wallet, onWalletUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [walletProvider, setWalletProvider] = useState('yoti');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const providers = [
    { value: 'yoti', label: 'Yoti Keys', description: 'Leading digital identity provider' },
    { value: 'agekey', label: 'AgeKey', description: 'Age verification specialist' },
    { value: 'ondato', label: 'Ondato', description: 'EU-compliant identity verification' },
    { value: 'internal', label: 'Internal Wallet', description: 'Platform-managed wallet' }
  ];

  const createWallet = async () => {
    setLoading(true);
    try {
      const { data, error } = await ageVerificationService?.createDigitalWallet(
        user?.id,
        walletProvider,
        {
          ageRange: '18+',
          verifiedAt: new Date()?.toISOString()
        }
      );

      if (error) throw new Error(error?.message);

      onWalletUpdate?.(data);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Wallet creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const useWalletForVerification = async (electionId) => {
    setLoading(true);
    try {
      const { data, error } = await ageVerificationService?.verifyWithDigitalWallet(
        user?.id,
        electionId
      );

      if (error) throw new Error(error?.message);

      alert('Verification successful using digital wallet!');
    } catch (err) {
      console.error('Wallet verification error:', err);
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
            <h3 className="font-semibold text-foreground mb-1">Reusable Digital Identity Wallet</h3>
            <p className="text-sm text-muted-foreground">
              Emerging 2026 standard: Verify age once with a trusted provider, then use cryptographic tokens (Yoti Keys, AgeKey) 
              to prove age on other sites without resharing sensitive data. Privacy-preserving and convenient.
            </p>
          </div>
        </div>
      </div>

      {!wallet && !showCreateForm ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
            <Icon name="Wallet" size={48} className="text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Digital Wallet Found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create a reusable digital identity wallet to streamline future age verifications across multiple elections.
            </p>
            <Button onClick={() => setShowCreateForm(true)} size="lg">
              <Icon name="Plus" size={20} />
              Create Digital Wallet
            </Button>
          </div>
        </div>
      ) : showCreateForm ? (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Create Digital Identity Wallet</h3>

          <Select
            label="Wallet Provider"
            description="Choose your preferred identity verification provider"
            options={providers}
            value={walletProvider}
            onChange={setWalletProvider}
          />

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">Selected Provider</h4>
            <p className="text-sm text-muted-foreground">
              {providers?.find(p => p?.value === walletProvider)?.description}
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={createWallet} disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Icon name="Loader" size={18} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Icon name="Check" size={18} />
                  Create Wallet
                </>
              )}
            </Button>
            <Button onClick={() => setShowCreateForm(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Wallet Details */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Icon name="Wallet" size={24} color="white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Digital Identity Wallet</h3>
                  <p className="text-sm text-muted-foreground capitalize">{wallet?.walletProvider} Provider</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-success/10 text-success">
                ✓ Active
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Age Verified</p>
                <p className="text-lg font-bold text-foreground">{wallet?.ageVerified ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-card/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Verified Age Range</p>
                <p className="text-lg font-bold text-foreground">{wallet?.verifiedAgeRange || 'N/A'}</p>
              </div>
              <div className="bg-card/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Verification Date</p>
                <p className="text-sm font-medium text-foreground">
                  {wallet?.verificationDate ? new Date(wallet?.verificationDate)?.toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="bg-card/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Expiry Date</p>
                <p className="text-sm font-medium text-foreground">
                  {wallet?.expiryDate ? new Date(wallet?.expiryDate)?.toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Features */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Privacy & Security Features</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Eye" size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Selective Disclosure</span>
                </div>
                <div className="px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">
                  {wallet?.selectiveDisclosureEnabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="RefreshCw" size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Reusable Credentials</span>
                </div>
                <div className="px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">
                  {wallet?.reusable ? 'Yes' : 'No'}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Shield" size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Privacy Level</span>
                </div>
                <div className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary capitalize">
                  {wallet?.privacyLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium mb-1">How to Use Your Wallet</p>
                <p className="text-xs text-muted-foreground">
                  When voting in elections that require age verification, simply select "Use Digital Wallet" instead of uploading documents again. 
                  Your cryptographic token will prove your age without revealing additional personal information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalIdentityWalletPanel;