import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';

import { settingsService } from '../../services/settingsService';
import { useAuth } from '../../contexts/AuthContext';
import ProfileSettings from './components/ProfileSettings';
import SecurityControls from './components/SecurityControls';
import PrivacyPreferences from './components/PrivacyPreferences';
import BillingHistory from './components/BillingHistory';
import ConnectedIntegrations from './components/ConnectedIntegrations';
import DataExport from './components/DataExport';

const SettingsAccountDashboard = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error: settingsError } = await settingsService?.getSettings();

      if (settingsError) throw new Error(settingsError.message);
      setSettings(data);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: 'User' },
    { id: 'security', label: 'Security Controls', icon: 'Shield' },
    { id: 'privacy', label: 'Privacy Preferences', icon: 'Lock' },
    { id: 'billing', label: 'Billing History', icon: 'CreditCard' },
    { id: 'integrations', label: 'Connected Integrations', icon: 'Link' },
    { id: 'data', label: 'Data Export', icon: 'Download' }
  ];

  const filteredTabs = tabs?.filter((tab) =>
    tab?.label?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const getAccountSummary = () => {
    return {
      profileCompletion: calculateProfileCompletion(),
      securityScore: 85,
      activeIntegrations: 3,
      lastBillingDate: 'Jan 15, 2026'
    };
  };

  const calculateProfileCompletion = () => {
    if (!settings) return 0;
    const fields = ['name', 'username', 'email', 'avatar', 'bio', 'location'];
    const completed = fields?.filter((field) => settings?.[field])?.length;
    return Math.round((completed / fields?.length) * 100);
  };

  const summary = getAccountSummary();

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <LeftSidebar />

      <main className="lg:ml-64 xl:ml-72 pt-14">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
              Settings & Account
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings, security, and preferences
            </p>
          </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                to="/content-removed-appeal"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/50 text-sm font-medium text-foreground transition-colors"
              >
                <Icon name="Shield" size={18} />
                Content removed &amp; appeals
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="User" size={20} className="text-primary" />
                <span className="text-sm text-muted-foreground">Profile Completion</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{summary?.profileCompletion}%</span>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Shield" size={20} className="text-green-500" />
                <span className="text-sm text-muted-foreground">Security Score</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{summary?.securityScore}</span>
                <span className="text-sm text-green-500">Good</span>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Link" size={20} className="text-blue-500" />
                <span className="text-sm text-muted-foreground">Active Integrations</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{summary?.activeIntegrations}</span>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="CreditCard" size={20} className="text-purple-500" />
                <span className="text-sm text-muted-foreground">Last Billing</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-foreground">{summary?.lastBillingDate}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="border-b border-border p-4">
              <div className="relative">
                <Icon
                  name="Search"
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4">
              <div className="lg:border-r border-border bg-muted/30">
                <div className="p-4 space-y-1">
                  {filteredTabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab?.icon} size={18} />
                      <span>{tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3 p-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    {activeTab === 'profile' && (
                      <ProfileSettings settings={settings} onUpdate={loadSettings} />
                    )}
                    {activeTab === 'security' && (
                      <SecurityControls settings={settings} onUpdate={loadSettings} />
                    )}
                    {activeTab === 'privacy' && (
                      <PrivacyPreferences settings={settings} onUpdate={loadSettings} />
                    )}
                    {activeTab === 'billing' && <BillingHistory />}
                    {activeTab === 'integrations' && <ConnectedIntegrations />}
                    {activeTab === 'data' && <DataExport />}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsAccountDashboard;
