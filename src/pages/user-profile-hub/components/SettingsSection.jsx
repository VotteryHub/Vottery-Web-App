import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SettingsSection = ({ settings, onSettingsChange }) => {
  const [activeSection, setActiveSection] = useState('privacy');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(settings?.twoFactorEnabled);
  const [emailNotifications, setEmailNotifications] = useState(settings?.emailNotifications);
  const [pushNotifications, setPushNotifications] = useState(settings?.pushNotifications);

  const sections = [
    { id: 'privacy', label: 'Privacy & Security', icon: 'Shield' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'appearance', label: 'Appearance', icon: 'Palette' },
    { id: 'language', label: 'Language & Region', icon: 'Globe' },
    { id: 'keys', label: 'Cryptographic Keys', icon: 'Key' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' },
  ];

  const timezoneOptions = [
    { value: 'utc', label: 'UTC' },
    { value: 'est', label: 'Eastern Time (EST)' },
    { value: 'pst', label: 'Pacific Time (PST)' },
    { value: 'gmt', label: 'Greenwich Mean Time (GMT)' },
  ];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
        <div className="lg:border-r border-border bg-muted/30">
          <div className="p-4 md:p-5 lg:p-6 space-y-1">
            {sections?.map((section) => (
              <button
                key={section?.id}
                onClick={() => setActiveSection(section?.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250 ${
                  activeSection === section?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={section?.icon} size={18} />
                <span className="hidden sm:inline lg:hidden xl:inline">{section?.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 p-4 md:p-6 lg:p-8">
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
                  Privacy & Security
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Manage your privacy settings and security preferences
                </p>
              </div>

              <div className="space-y-4">
                <Checkbox
                  label="Enable Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e?.target?.checked)}
                />

                <Checkbox
                  label="Public Profile"
                  description="Allow others to view your profile and achievements"
                  checked={settings?.publicProfile}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, publicProfile: e?.target?.checked })
                  }
                />

                <Checkbox
                  label="Show Voting History"
                  description="Display your voting participation on your profile (vote contents remain private)"
                  checked={settings?.showVotingHistory}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, showVotingHistory: e?.target?.checked })
                  }
                />

                <Checkbox
                  label="Allow Friend Requests"
                  description="Let other users send you friend requests"
                  checked={settings?.allowFriendRequests}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, allowFriendRequests: e?.target?.checked })
                  }
                />
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="font-heading font-semibold text-foreground mb-4">
                  Active Sessions
                </h4>
                <div className="space-y-3">
                  {settings?.activeSessions?.map((session) => (
                    <div
                      key={session?.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Icon name={session?.device === 'desktop' ? 'Monitor' : 'Smartphone'} size={20} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{session?.location}</p>
                          <p className="text-xs text-muted-foreground">
                            Last active: {session?.lastActive}
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
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
                  Notification Preferences
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose how you want to be notified about platform activities
                </p>
              </div>

              <div className="space-y-4">
                <Checkbox
                  label="Email Notifications"
                  description="Receive updates via email"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e?.target?.checked)}
                />

                <Checkbox
                  label="Push Notifications"
                  description="Get real-time notifications in your browser"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e?.target?.checked)}
                />

                <div className="pl-6 space-y-3 border-l-2 border-primary/20">
                  <Checkbox
                    label="Election Updates"
                    description="New elections matching your interests"
                    checked={settings?.notifyElections}
                    disabled={!emailNotifications && !pushNotifications}
                  />

                  <Checkbox
                    label="Voting Reminders"
                    description="Reminders for elections you're participating in"
                    checked={settings?.notifyVotingReminders}
                    disabled={!emailNotifications && !pushNotifications}
                  />

                  <Checkbox
                    label="Results Announcements"
                    description="When election results are published"
                    checked={settings?.notifyResults}
                    disabled={!emailNotifications && !pushNotifications}
                  />

                  <Checkbox
                    label="Lottery Draws"
                    description="Lottery draw results and prize notifications"
                    checked={settings?.notifyLottery}
                    disabled={!emailNotifications && !pushNotifications}
                  />

                  <Checkbox
                    label="Social Interactions"
                    description="Friend requests, messages, and mentions"
                    checked={settings?.notifySocial}
                    disabled={!emailNotifications && !pushNotifications}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
                  Appearance Settings
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Customize how Vottery looks for you
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Theme Preference
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['light', 'dark', 'system']?.map((theme) => (
                      <button
                        key={theme}
                        onClick={() => onSettingsChange({ ...settings, theme })}
                        className={`p-4 rounded-lg border-2 transition-all duration-250 ${
                          settings?.theme === theme
                            ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon
                          name={theme === 'light' ? 'Sun' : theme === 'dark' ? 'Moon' : 'Monitor'}
                          size={24}
                          className="mx-auto mb-2"
                        />
                        <p className="text-sm font-medium text-foreground capitalize">{theme}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Checkbox
                  label="Reduce Motion"
                  description="Minimize animations and transitions"
                  checked={settings?.reduceMotion}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, reduceMotion: e?.target?.checked })
                  }
                />

                <Checkbox
                  label="High Contrast Mode"
                  description="Increase contrast for better readability"
                  checked={settings?.highContrast}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, highContrast: e?.target?.checked })
                  }
                />
              </div>
            </div>
          )}

          {activeSection === 'language' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
                  Language & Region
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Set your preferred language and regional settings
                </p>
              </div>

              <div className="space-y-4">
                <Select
                  label="Display Language"
                  description="Choose your preferred language for the interface"
                  options={languageOptions}
                  value={settings?.language}
                  onChange={(value) => onSettingsChange({ ...settings, language: value })}
                />

                <Select
                  label="Timezone"
                  description="Set your timezone for accurate date and time display"
                  options={timezoneOptions}
                  value={settings?.timezone}
                  onChange={(value) => onSettingsChange({ ...settings, timezone: value })}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['MM/DD/YYYY', 'DD/MM/YYYY']?.map((format) => (
                      <button
                        key={format}
                        onClick={() => onSettingsChange({ ...settings, dateFormat: format })}
                        className={`p-3 rounded-lg border transition-all duration-250 ${
                          settings?.dateFormat === format
                            ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 text-foreground'
                        }`}
                      >
                        <p className="text-sm font-medium">{format}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'keys' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
                  Cryptographic Keys
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Manage your encryption keys for secure voting
                </p>
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-start gap-3">
                <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning mb-1">Important Security Notice</p>
                  <p className="text-xs text-muted-foreground">
                    Your cryptographic keys are automatically managed by Vottery. Never share your
                    private keys with anyone.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Public Key</span>
                    <Button variant="ghost" size="sm" iconName="Copy">
                      Copy
                    </Button>
                  </div>
                  <code className="font-data text-xs text-muted-foreground break-all">
                    {settings?.publicKey}
                  </code>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Key Fingerprint</span>
                    <div className="crypto-indicator">
                      <Icon name="ShieldCheck" size={14} />
                      <span className="text-xs">Verified</span>
                    </div>
                  </div>
                  <code className="font-data text-xs text-muted-foreground">
                    {settings?.keyFingerprint}
                  </code>
                </div>

                <div className="pt-4 space-y-3">
                  <Button variant="outline" fullWidth iconName="Download" iconPosition="left">
                    Backup Keys
                  </Button>
                  <Button variant="outline" fullWidth iconName="RefreshCw" iconPosition="left">
                    Regenerate Keys
                  </Button>
                  <Button variant="destructive" fullWidth iconName="Trash2" iconPosition="left">
                    Revoke Keys
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;