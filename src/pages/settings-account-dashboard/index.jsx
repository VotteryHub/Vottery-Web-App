import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
    <GeneralPageLayout title="Account Settings" showSidebar={true}>
      <div className="w-full py-0">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
              Control Center
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium">
              Manage your account identity, security protocols, and privacy preferences.
            </p>
          </div>
          
          <Link
            to="/content-removed-appeal"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all backdrop-blur-md"
          >
            <Icon name="Shield" size={16} className="text-primary" />
            Security Appeals
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="premium-glass p-6 rounded-3xl border border-white/5 bg-primary/5 group hover:bg-primary/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="User" size={16} className="text-primary" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Profile Status</span>
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{summary?.profileCompletion}% Complete</p>
          </div>
          <div className="premium-glass p-6 rounded-3xl border border-white/5 bg-green-500/5 group hover:bg-green-500/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Shield" size={16} className="text-green-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Security Score</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-white tracking-tight">{summary?.securityScore}</p>
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Optimal</span>
            </div>
          </div>
          <div className="premium-glass p-6 rounded-3xl border border-white/5 bg-blue-500/5 group hover:bg-blue-500/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Link" size={16} className="text-blue-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sync Nodes</span>
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{summary?.activeIntegrations} Connected</p>
          </div>
          <div className="premium-glass p-6 rounded-3xl border border-white/5 bg-purple-500/5 group hover:bg-purple-500/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="CreditCard" size={16} className="text-purple-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ledger Balance</span>
            </div>
            <p className="text-lg font-black text-white tracking-tight truncate">{summary?.lastBillingDate}</p>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="border-b border-white/5 p-6 bg-white/5">
            <div className="relative max-w-md">
              <Icon
                name="Search"
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                placeholder="SEARCH SETTINGS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full pl-12 pr-6 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-white font-bold text-xs uppercase tracking-widest placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[600px]">
            <div className="lg:border-r border-white/5 bg-white/5">
              <div className="p-4 space-y-2">
                {filteredTabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                      activeTab === tab?.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 p-8 lg:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5 mb-8 flex items-center gap-4">
                  <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0" />
                  <p className="text-sm font-bold text-destructive-foreground">{error}</p>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-b-primary animate-spin" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing Vault...</p>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default SettingsAccountDashboard;
