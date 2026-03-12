import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { settingsService } from '../../../services/settingsService';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const PrivacyPreferences = ({ settings, onUpdate }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    // Profile Visibility
    profileVisibility: 'public', // public | friends | private
    publicProfile: true,
    showVotingHistory: false,
    showOnlineStatus: true,
    shareActivityFeed: true,
    // Activity Status
    hideActivityStatus: false,
    hideActivityFromElections: false,
    hideActivityFromGroups: false,
    hideActivityFromMessages: false,
    // Contact Preferences
    allowFriendRequests: true,
    allowMessageRequests: true,
    whoCanMessage: 'everyone', // everyone | friends | nobody
    whoCanSeeProfile: 'public', // public | friends | private
    // Data Sharing
    shareDataWithPartners: false,
    shareDataForAds: false,
    shareDataForResearch: false,
    shareDataForAnalytics: true,
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    contactByEmail: true,
    contactBySMS: false,
    contactByPush: true,
    contactByInApp: true,
  });
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState('visibility');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, [user?.id]);

  const loadPreferences = async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        ?.from('user_preferences')
        ?.select('preferences')
        ?.eq('user_id', user?.id)
        ?.eq('preference_type', 'privacy_settings')
        ?.single();

      if (data?.preferences) {
        setPreferences(prev => ({ ...prev, ...data?.preferences }));
      }
    } catch (err) {
      // No saved preferences yet
    }
  };

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev?.[key] }));
  };

  const handleSelect = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Save to user_preferences table (granular privacy toggles)
      if (user?.id) {
        const { error } = await supabase
          ?.from('user_preferences')
          ?.upsert({
            user_id: user?.id,
            preference_type: 'privacy_settings',
            preferences,
            updated_at: new Date()?.toISOString()
          }, { onConflict: 'user_id,preference_type' });
        if (error) throw error;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onUpdate?.();
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ id, title, icon, children }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon name={icon} size={18} className="text-primary" />
          <span className="font-semibold text-foreground">{title}</span>
        </div>
        <Icon name={expandedSection === id ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground" />
      </button>
      {expandedSection === id && (
        <div className="p-4 space-y-3">{children}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">Privacy Preferences</h3>
        <p className="text-sm text-muted-foreground">Granular control over your data sharing and visibility settings</p>
      </div>
      <Section id="visibility" title="Profile Visibility" icon="Eye">
        <div className="mb-3">
          <label className="text-sm font-medium text-foreground mb-2 block">Who can see your profile?</label>
          <div className="flex gap-2">
            {['public', 'friends', 'private']?.map(opt => (
              <button
                key={opt}
                onClick={() => handleSelect('profileVisibility', opt)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  preferences?.profileVisibility === opt
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                {opt === 'public' ? '🌍 Public' : opt === 'friends' ? '👥 Friends' : '🔒 Private'}
              </button>
            ))}
          </div>
        </div>
        <Checkbox label="Show Voting History" description="Display your voting participation on your profile" checked={preferences?.showVotingHistory} onChange={() => handleToggle('showVotingHistory')} />
        <Checkbox label="Share Activity Feed" description="Allow your activities to appear in friends' feeds" checked={preferences?.shareActivityFeed} onChange={() => handleToggle('shareActivityFeed')} />
      </Section>
      <Section id="activity" title="Activity Status Visibility" icon="Activity">
        <Checkbox label="Hide Activity Status" description="Don't show when you're online or last active" checked={preferences?.hideActivityStatus} onChange={() => handleToggle('hideActivityStatus')} />
        <Checkbox label="Hide from Elections" description="Don't show your activity in election feeds" checked={preferences?.hideActivityFromElections} onChange={() => handleToggle('hideActivityFromElections')} />
        <Checkbox label="Hide from Groups" description="Don't show your activity in group feeds" checked={preferences?.hideActivityFromGroups} onChange={() => handleToggle('hideActivityFromGroups')} />
        <Checkbox label="Hide from Messages" description="Don't show read receipts or typing indicators" checked={preferences?.hideActivityFromMessages} onChange={() => handleToggle('hideActivityFromMessages')} />
      </Section>
      <Section id="contact" title="Contact Preferences" icon="MessageSquare">
        <div className="mb-3">
          <label className="text-sm font-medium text-foreground mb-2 block">Who can send you messages?</label>
          <div className="flex gap-2">
            {['everyone', 'friends', 'nobody']?.map(opt => (
              <button
                key={opt}
                onClick={() => handleSelect('whoCanMessage', opt)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  preferences?.whoCanMessage === opt
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <Checkbox label="Allow Friend Requests" description="Let others send you friend requests" checked={preferences?.allowFriendRequests} onChange={() => handleToggle('allowFriendRequests')} />
        <Checkbox label="Email Contact" description="Allow contact via email notifications" checked={preferences?.contactByEmail} onChange={() => handleToggle('contactByEmail')} />
        <Checkbox label="SMS Contact" description="Allow contact via SMS notifications" checked={preferences?.contactBySMS} onChange={() => handleToggle('contactBySMS')} />
        <Checkbox label="Push Notifications" description="Allow push notification contact" checked={preferences?.contactByPush} onChange={() => handleToggle('contactByPush')} />
        <Checkbox label="In-App Notifications" description="Allow in-app notification contact" checked={preferences?.contactByInApp} onChange={() => handleToggle('contactByInApp')} />
      </Section>
      <Section id="data" title="Data Sharing Per Feature" icon="Database">
        <p className="text-xs text-muted-foreground mb-3">Control how your data is used across platform features</p>
        <Checkbox label="Analytics & Insights" description="Share data to improve your personalized recommendations" checked={preferences?.shareDataForAnalytics} onChange={() => handleToggle('shareDataForAnalytics')} />
        <Checkbox label="Personalized Ads" description="Allow your data to be used for targeted advertising" checked={preferences?.shareDataForAds} onChange={() => handleToggle('shareDataForAds')} />
        <Checkbox label="Platform Research" description="Contribute anonymized data to platform research" checked={preferences?.shareDataForResearch} onChange={() => handleToggle('shareDataForResearch')} />
        <Checkbox label="Third-Party Partners" description="Share data with trusted platform partners" checked={preferences?.shareDataWithPartners} onChange={() => handleToggle('shareDataWithPartners')} />
      </Section>
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} variant="primary">
          {saving ? 'Saving...' : 'Save Privacy Settings'}
        </Button>
        {saved && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <Icon name="CheckCircle" size={14} /> Settings saved!
          </span>
        )}
      </div>
    </div>
  );
};

export default PrivacyPreferences;
