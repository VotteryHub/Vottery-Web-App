import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const SecurityControls = ({ settings, onUpdate }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const activeSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, USA',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, USA',
      lastActive: '1 hour ago',
      current: false
    }
  ];

  const securityLogs = [
    { id: 1, action: 'Login', device: 'Chrome on Windows', time: '2 hours ago', status: 'success' },
    { id: 2, action: 'Password Changed', device: 'Chrome on Windows', time: '3 days ago', status: 'success' },
    { id: 3, action: 'Failed Login Attempt', device: 'Unknown', time: '5 days ago', status: 'failed' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Security Controls
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage your account security and authentication settings
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon name="Shield" size={24} className="text-green-500" />
            <div>
              <h4 className="font-semibold text-foreground">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <Button
            variant={twoFactorEnabled ? 'outline' : 'default'}
            size="sm"
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
          >
            {twoFactorEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
        {twoFactorEnabled && (
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Scan this QR code with your authenticator app
            </p>
            <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mb-3">
              <Icon name="QrCode" size={120} className="text-gray-400" />
            </div>
            <Input placeholder="Enter 6-digit code" />
          </div>
        )}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon name="Key" size={24} className="text-blue-500" />
            <div>
              <h4 className="font-semibold text-foreground">Password Management</h4>
              <p className="text-sm text-muted-foreground">
                Update your password regularly for better security
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            Change Password
          </Button>
        </div>
        {showPasswordForm && (
          <div className="space-y-3">
            <Input type="password" label="Current Password" placeholder="Enter current password" />
            <Input type="password" label="New Password" placeholder="Enter new password" />
            <Input type="password" label="Confirm Password" placeholder="Confirm new password" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(false)}>
                Cancel
              </Button>
              <Button size="sm">Update Password</Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-foreground mb-3">Active Sessions</h4>
        <div className="space-y-3">
          {activeSessions?.map((session) => (
            <div
              key={session?.id}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Icon name="Monitor" size={20} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {session?.device}
                    {session?.current && (
                      <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session?.location} • {session?.lastActive}
                  </p>
                </div>
              </div>
              {!session?.current && (
                <Button variant="ghost" size="sm" iconName="X">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-foreground mb-3">Security Audit Log</h4>
        <div className="space-y-2">
          {securityLogs?.map((log) => (
            <div
              key={log?.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Icon
                  name={log?.status === 'success' ? 'CheckCircle' : 'XCircle'}
                  size={18}
                  className={log?.status === 'success' ? 'text-green-500' : 'text-red-500'}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{log?.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {log?.device} • {log?.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="Download" size={20} className="text-primary" />
          <h4 className="font-semibold text-foreground">Cryptographic Key Backup</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Download your cryptographic keys for secure backup and recovery
        </p>
        <Button variant="outline" iconName="Download">
          Download Keys
        </Button>
      </div>
    </div>
  );
};

export default SecurityControls;
