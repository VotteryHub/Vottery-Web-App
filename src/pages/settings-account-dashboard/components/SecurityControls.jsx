import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { supabase } from '../../../lib/supabase';
import { userSecurityService } from '../../../services/userSecurityService';


const SecurityControls = ({ settings, onUpdate }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(settings?.twoFactorEnabled || false);
  const [twoFactorMethod, setTwoFactorMethod] = useState('totp');
  const [phone, setPhone] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [activeSessions, setActiveSessions] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    const { data: authData } = await supabase?.auth?.getUser();
    const userId = authData?.user?.id;
    if (!userId) return;

    const [sessionsResult, logsResult, twoFactorResult] = await Promise.all([
      userSecurityService?.getActiveSessions(userId),
      userSecurityService?.getSecurityEvents(userId, '30d'),
      userSecurityService?.getTwoFactorSettings(userId),
    ]);

    setActiveSessions((sessionsResult?.data || [])?.map((session, index) => ({
      id: session?.id || `session-${index}`,
      device: session?.device_name || session?.device_fingerprint || 'Unknown Device',
      location: session?.location || session?.ip_address || 'Unknown',
      lastActive: session?.last_activity_at || session?.created_at || '',
      current: !!session?.is_current,
    })));

    setSecurityLogs((logsResult?.data || [])?.slice(0, 10)?.map((item, index) => ({
      id: item?.id || `log-${index}`,
      action: item?.alert_type || item?.event_type || 'Security Event',
      device: item?.device_fingerprint || item?.ip_address || 'Unknown',
      time: item?.created_at || '',
      status: item?.severity === 'critical' || item?.severity === 'high' ? 'failed' : 'success',
    })));

    setTwoFactorEnabled(!!twoFactorResult?.data?.two_factor_enabled);
    setTwoFactorMethod(twoFactorResult?.data?.two_factor_method || 'totp');
    setPhone(twoFactorResult?.data?.two_factor_phone || '');
  };

  const handleTwoFactorToggle = async () => {
    setLoading(true);
    setStatusMessage('');
    try {
      const { data: authData } = await supabase?.auth?.getUser();
      const userId = authData?.user?.id;
      if (!userId) throw new Error('Not authenticated');
      const enabled = !twoFactorEnabled;
      const { error } = await userSecurityService?.updateTwoFactorSettings(userId, {
        enabled,
        method: twoFactorMethod,
        phone: twoFactorMethod === 'sms' ? phone : null,
      });
      if (error) throw new Error(error?.message);
      setTwoFactorEnabled(enabled);
      setStatusMessage(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}.`);
      onUpdate?.();
    } catch (error) {
      setStatusMessage(error?.message || 'Unable to update two-factor settings.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm?.next !== passwordForm?.confirm) {
      setStatusMessage('New password and confirmation do not match.');
      return;
    }
    setLoading(true);
    setStatusMessage('');
    try {
      const { error } = await supabase?.auth?.updateUser({ password: passwordForm?.next });
      if (error) throw error;
      setPasswordForm({ current: '', next: '', confirm: '' });
      setShowPasswordForm(false);
      setStatusMessage('Password updated successfully.');
    } catch (error) {
      setStatusMessage(error?.message || 'Password update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    setLoading(true);
    setStatusMessage('');
    try {
      const { data: authData } = await supabase?.auth?.getUser();
      const userId = authData?.user?.id;
      if (!userId) throw new Error('Not authenticated');
      const { error } = await userSecurityService?.revokeSession(userId, sessionId);
      if (error) throw new Error(error?.message);
      setStatusMessage('Session revoked.');
      await loadSecurityData();
    } catch (error) {
      setStatusMessage(error?.message || 'Unable to revoke session.');
    } finally {
      setLoading(false);
    }
  };

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
      {statusMessage && (
        <div className="p-3 rounded-lg bg-muted/40 border border-border text-sm text-foreground">
          {statusMessage}
        </div>
      )}

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
            onClick={handleTwoFactorToggle}
            disabled={loading}
          >
            {twoFactorEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
        <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-2">
          <button type="button" onClick={() => setTwoFactorMethod('totp')} className={`px-3 py-2 rounded-md border text-sm ${twoFactorMethod === 'totp' ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}>Authenticator</button>
          <button type="button" onClick={() => setTwoFactorMethod('email')} className={`px-3 py-2 rounded-md border text-sm ${twoFactorMethod === 'email' ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}>Email OTP</button>
          <button type="button" onClick={() => setTwoFactorMethod('sms')} className={`px-3 py-2 rounded-md border text-sm ${twoFactorMethod === 'sms' ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}>SMS OTP</button>
        </div>
        {twoFactorMethod === 'sms' && (
          <Input placeholder="Phone number for SMS OTP" value={phone} onChange={(e) => setPhone(e?.target?.value)} />
        )}
        {twoFactorEnabled && twoFactorMethod === 'totp' && (
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
            <Input type="password" label="Current Password" placeholder="Enter current password" value={passwordForm?.current} onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e?.target?.value }))} />
            <Input type="password" label="New Password" placeholder="Enter new password" value={passwordForm?.next} onChange={(e) => setPasswordForm((prev) => ({ ...prev, next: e?.target?.value }))} />
            <Input type="password" label="Confirm Password" placeholder="Confirm new password" value={passwordForm?.confirm} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e?.target?.value }))} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handlePasswordUpdate} disabled={loading}>Update Password</Button>
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
                <Button variant="ghost" size="sm" iconName="X" onClick={() => handleRevokeSession(session?.id)} disabled={loading}>
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
