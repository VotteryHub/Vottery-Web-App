import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TwoFactorAuthPanel = ({ userId, onRefresh }) => {
  const [enabled, setEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);

  const handleEnable2FA = () => {
    setSetupStep(2);
    // Generate mock QR code and backup codes
    const mockBackupCodes = [
      'ABC123-DEF456',
      'GHI789-JKL012',
      'MNO345-PQR678',
      'STU901-VWX234',
      'YZA567-BCD890'
    ];
    setBackupCodes(mockBackupCodes);
  };

  const handleVerify = () => {
    if (verificationCode?.length === 6) {
      setEnabled(true);
      setSetupStep(3);
    }
  };

  const handleDisable2FA = () => {
    setEnabled(false);
    setSetupStep(1);
    setVerificationCode('');
    setBackupCodes([]);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Lock" size={32} className="text-primary" />
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">Two-Factor Authentication</h2>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>

        {!enabled && setupStep === 1 && (
          <div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Why enable 2FA?
                  </h3>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    Two-factor authentication adds an extra layer of security by requiring a verification code from your phone in addition to your password.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                <Icon name="Shield" size={20} className="text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Enhanced Security</h4>
                  <p className="text-xs text-muted-foreground">
                    Protect your account from unauthorized access even if your password is compromised
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                <Icon name="Smartphone" size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Mobile Verification</h4>
                  <p className="text-xs text-muted-foreground">
                    Use your phone to generate time-based verification codes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                <Icon name="Key" size={20} className="text-purple-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Backup Codes</h4>
                  <p className="text-xs text-muted-foreground">
                    Receive backup codes to access your account if you lose your phone
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleEnable2FA} iconName="Lock" className="w-full">
              Enable Two-Factor Authentication
            </Button>
          </div>
        )}

        {setupStep === 2 && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Step 1: Scan QR Code</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
              <div className="flex justify-center mb-4">
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name="QrCode" size={120} className="text-muted-foreground" />
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Manual entry key: ABCD-EFGH-IJKL-MNOP
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Step 2: Enter Verification Code</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter the 6-digit code from your authenticator app
              </p>
              <Input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e?.target?.value)}
                maxLength={6}
                className="text-center text-2xl font-mono tracking-widest"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSetupStep(1)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleVerify} 
                disabled={verificationCode?.length !== 6}
                className="flex-1"
              >
                Verify & Enable
              </Button>
            </div>
          </div>
        )}

        {enabled && setupStep === 3 && (
          <div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle" size={20} className="text-green-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                    Two-Factor Authentication Enabled
                  </h3>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    Your account is now protected with two-factor authentication
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Backup Codes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Save these backup codes in a secure location. You can use them to access your account if you lose your phone.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {backupCodes?.map((code, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg font-mono text-sm text-center">
                    {code}
                  </div>
                ))}
              </div>
              <Button variant="outline" iconName="Download" className="w-full">
                Download Backup Codes
              </Button>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Manage 2FA</h3>
              <div className="space-y-3">
                <Button variant="outline" iconName="RefreshCw" className="w-full justify-start">
                  Regenerate Backup Codes
                </Button>
                <Button variant="outline" iconName="Smartphone" className="w-full justify-start">
                  Change Authenticator Device
                </Button>
                <Button 
                  variant="outline" 
                  iconName="XCircle" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={handleDisable2FA}
                >
                  Disable Two-Factor Authentication
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Device Security Monitoring</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Monitor devices that have accessed your account
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
            <Icon name="Monitor" size={24} className="text-primary mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-foreground">Chrome on Windows</h4>
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                  Current
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Last active: Just now • IP: 192.168.1.1</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
            <Icon name="Smartphone" size={24} className="text-primary mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-foreground">Mobile App on iOS</h4>
                <button className="text-xs text-red-600 hover:underline">Remove</button>
              </div>
              <p className="text-xs text-muted-foreground">Last active: 2 hours ago • IP: 192.168.1.2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthPanel;