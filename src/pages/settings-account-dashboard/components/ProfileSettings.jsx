import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { settingsService } from '../../../services/settingsService';

const ProfileSettings = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: settings?.name || '',
    username: settings?.username || '',
    email: settings?.email || '',
    phone: settings?.phone || '',
    bio: settings?.bio || '',
    location: settings?.location || '',
    website: settings?.website || '',
    occupation: settings?.occupation || ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');

      const { error } = await settingsService?.updateProfile(formData);
      if (error) throw new Error(error.message);

      setMessage('Profile updated successfully!');
      onUpdate();
    } catch (err) {
      setMessage(err?.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Profile Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Update your personal information and profile details
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
            {formData?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
            <Icon name="Camera" size={16} />
          </button>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">{formData?.name || 'User'}</h4>
          <p className="text-sm text-muted-foreground mb-2">@{formData?.username || 'username'}</p>
          <Button variant="outline" size="sm" iconName="Upload">
            Change Avatar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={formData?.name}
          onChange={(e) => handleChange('name', e?.target?.value)}
          placeholder="Enter your full name"
        />
        <Input
          label="Username"
          value={formData?.username}
          onChange={(e) => handleChange('username', e?.target?.value)}
          placeholder="Enter username"
        />
        <Input
          label="Email"
          type="email"
          value={formData?.email}
          onChange={(e) => handleChange('email', e?.target?.value)}
          placeholder="Enter email address"
        />
        <Input
          label="Phone"
          value={formData?.phone}
          onChange={(e) => handleChange('phone', e?.target?.value)}
          placeholder="Enter phone number"
        />
        <Input
          label="Location"
          value={formData?.location}
          onChange={(e) => handleChange('location', e?.target?.value)}
          placeholder="City, Country"
        />
        <Input
          label="Occupation"
          value={formData?.occupation}
          onChange={(e) => handleChange('occupation', e?.target?.value)}
          placeholder="Your occupation"
        />
        <Input
          label="Website"
          value={formData?.website}
          onChange={(e) => handleChange('website', e?.target?.value)}
          placeholder="https://yourwebsite.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
        <textarea
          value={formData?.bio}
          onChange={(e) => handleChange('bio', e?.target?.value)}
          placeholder="Tell us about yourself..."
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message?.includes('success')
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400' :'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
          }`}
        >
          <p className="text-sm">{message}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setFormData(settings)}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
