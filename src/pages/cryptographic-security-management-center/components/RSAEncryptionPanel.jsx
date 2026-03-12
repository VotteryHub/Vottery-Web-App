import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cryptographicService } from '../../../services/cryptographicService';

const RSAEncryptionPanel = () => {
  const [keyStatus, setKeyStatus] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [encrypting, setEncrypting] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [encryptedResult, setEncryptedResult] = useState(null);

  useEffect(() => {
    loadKeyStatus();
  }, []);

  const loadKeyStatus = async () => {
    const { data } = cryptographicService?.rsa?.getKeyStatus();
    setKeyStatus(data);
  };

  const handleGenerateKeyPair = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const { data } = cryptographicService?.rsa?.generateKeyPair(2048);
    setGenerating(false);
    alert('RSA-2048 key pair generated successfully!');
    loadKeyStatus();
  };

  const handleEncryptTest = async () => {
    if (!testMessage) return;
    setEncrypting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockPublicKey = 'RSA_PUBLIC_KEY_MOCK';
    const { data } = cryptographicService?.rsa?.encrypt(testMessage, mockPublicKey);
    setEncryptedResult(data);
    setEncrypting(false);
  };

  return (
    <div className="space-y-6">
      {/* Key Status */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Key" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">RSA Key Management</h3>
            <p className="text-sm text-muted-foreground">RSA-2048 encryption key infrastructure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Active Keys</p>
            <p className="text-2xl font-bold text-foreground">{keyStatus?.activeKeys}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Pending Rotation</p>
            <p className="text-2xl font-bold text-foreground">{keyStatus?.pendingRotation}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Last Rotation</p>
            <p className="text-sm font-medium text-foreground">
              {keyStatus?.lastRotation ? new Date(keyStatus?.lastRotation)?.toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Compliance</p>
            <p className="text-sm font-medium text-success">{keyStatus?.complianceStatus}</p>
          </div>
        </div>

        <Button onClick={handleGenerateKeyPair} disabled={generating} iconName="Plus">
          {generating ? 'Generating...' : 'Generate New Key Pair'}
        </Button>
      </div>

      {/* Encryption Operations */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Lock" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Encryption Operations</h3>
            <p className="text-sm text-muted-foreground">Test RSA encryption and decryption</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Test Message</label>
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e?.target?.value)}
              placeholder="Enter message to encrypt..."
              className="w-full px-4 py-2 bg-muted/30 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button onClick={handleEncryptTest} disabled={!testMessage || encrypting} iconName="Lock">
            {encrypting ? 'Encrypting...' : 'Encrypt Message'}
          </Button>

          {encryptedResult && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Encrypted Result</p>
              <p className="text-xs font-data text-foreground break-all">{encryptedResult?.ciphertext}</p>
              <div className="flex items-center gap-2 mt-3">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-xs text-success">Encrypted with RSA-OAEP</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Digital Signatures */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="FileSignature" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Digital Signature Validation</h3>
            <p className="text-sm text-muted-foreground">RSA-SHA256 signature verification</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
            <span className="text-sm text-foreground">Signature Algorithm</span>
            <span className="text-sm font-medium text-success">RSA-SHA256</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="text-sm text-foreground">Signatures Verified Today</span>
            <span className="text-sm font-medium text-foreground">1,247</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="text-sm text-foreground">Verification Success Rate</span>
            <span className="text-sm font-medium text-foreground">99.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSAEncryptionPanel;