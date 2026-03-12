import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Icon from '../../../components/AppIcon';


const ParticipationFeeControls = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [globalEnabled, setGlobalEnabled] = useState(false);
  const [disabledCountries, setDisabledCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const allCountries = [
    // Region 1: US & Canada
    { code: 'US', name: 'United States', region: 'Region 1' },
    { code: 'CA', name: 'Canada', region: 'Region 1' },
    // Region 2: Western Europe
    { code: 'GB', name: 'United Kingdom', region: 'Region 2' },
    { code: 'FR', name: 'France', region: 'Region 2' },
    { code: 'DE', name: 'Germany', region: 'Region 2' },
    { code: 'IT', name: 'Italy', region: 'Region 2' },
    { code: 'ES', name: 'Spain', region: 'Region 2' },
    { code: 'NL', name: 'Netherlands', region: 'Region 2' },
    { code: 'BE', name: 'Belgium', region: 'Region 2' },
    { code: 'CH', name: 'Switzerland', region: 'Region 2' },
    { code: 'AT', name: 'Austria', region: 'Region 2' },
    { code: 'SE', name: 'Sweden', region: 'Region 2' },
    { code: 'NO', name: 'Norway', region: 'Region 2' },
    { code: 'DK', name: 'Denmark', region: 'Region 2' },
    { code: 'FI', name: 'Finland', region: 'Region 2' },
    // Region 3: Eastern Europe & Russia
    { code: 'RU', name: 'Russia', region: 'Region 3' },
    { code: 'PL', name: 'Poland', region: 'Region 3' },
    { code: 'UA', name: 'Ukraine', region: 'Region 3' },
    { code: 'CZ', name: 'Czech Republic', region: 'Region 3' },
    { code: 'RO', name: 'Romania', region: 'Region 3' },
    { code: 'HU', name: 'Hungary', region: 'Region 3' },
    { code: 'BG', name: 'Bulgaria', region: 'Region 3' },
    // Region 4: Africa
    { code: 'ZA', name: 'South Africa', region: 'Region 4' },
    { code: 'NG', name: 'Nigeria', region: 'Region 4' },
    { code: 'EG', name: 'Egypt', region: 'Region 4' },
    { code: 'KE', name: 'Kenya', region: 'Region 4' },
    { code: 'GH', name: 'Ghana', region: 'Region 4' },
    { code: 'ET', name: 'Ethiopia', region: 'Region 4' },
    { code: 'TZ', name: 'Tanzania', region: 'Region 4' },
    { code: 'UG', name: 'Uganda', region: 'Region 4' },
    // Region 5: Latin America & Caribbean
    { code: 'BR', name: 'Brazil', region: 'Region 5' },
    { code: 'MX', name: 'Mexico', region: 'Region 5' },
    { code: 'AR', name: 'Argentina', region: 'Region 5' },
    { code: 'CO', name: 'Colombia', region: 'Region 5' },
    { code: 'CL', name: 'Chile', region: 'Region 5' },
    { code: 'PE', name: 'Peru', region: 'Region 5' },
    { code: 'VE', name: 'Venezuela', region: 'Region 5' },
    { code: 'CU', name: 'Cuba', region: 'Region 5' },
    // Region 6: Middle East, Asia, Eurasia, Melanesia, Micronesia, Polynesia
    { code: 'IN', name: 'India', region: 'Region 6' },
    { code: 'PK', name: 'Pakistan', region: 'Region 6' },
    { code: 'BD', name: 'Bangladesh', region: 'Region 6' },
    { code: 'ID', name: 'Indonesia', region: 'Region 6' },
    { code: 'PH', name: 'Philippines', region: 'Region 6' },
    { code: 'VN', name: 'Vietnam', region: 'Region 6' },
    { code: 'TH', name: 'Thailand', region: 'Region 6' },
    { code: 'MY', name: 'Malaysia', region: 'Region 6' },
    { code: 'SA', name: 'Saudi Arabia', region: 'Region 6' },
    { code: 'AE', name: 'United Arab Emirates', region: 'Region 6' },
    { code: 'TR', name: 'Turkey', region: 'Region 6' },
    { code: 'IR', name: 'Iran', region: 'Region 6' },
    { code: 'IQ', name: 'Iraq', region: 'Region 6' },
    { code: 'IL', name: 'Israel', region: 'Region 6' },
    // Region 7: Australasia
    { code: 'AU', name: 'Australia', region: 'Region 7' },
    { code: 'NZ', name: 'New Zealand', region: 'Region 7' },
    { code: 'TW', name: 'Taiwan', region: 'Region 7' },
    { code: 'KR', name: 'South Korea', region: 'Region 7' },
    { code: 'JP', name: 'Japan', region: 'Region 7' },
    { code: 'SG', name: 'Singapore', region: 'Region 7' },
    // Region 8: China, Macau, Hong Kong
    { code: 'CN', name: 'China', region: 'Region 8' },
    { code: 'HK', name: 'Hong Kong', region: 'Region 8' },
    { code: 'MO', name: 'Macau', region: 'Region 8' },
  ];

  useEffect(() => {
    fetchControls();
  }, []);

  const fetchControls = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase?.from('admin_participation_controls')?.select('*')?.eq('feature_name', 'participation_fees')?.single();

      if (error) throw error;

      if (data) {
        setGlobalEnabled(data?.globally_enabled || false);
        setDisabledCountries(data?.disabled_countries || []);
      }
    } catch (error) {
      console.error('Error fetching controls:', error);
      setMessage({ type: 'error', text: 'Failed to load participation fee controls' });
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalToggle = async () => {
    try {
      setSaving(true);
      const newValue = !globalEnabled;

      const { error } = await supabase?.from('admin_participation_controls')?.update({ 
          globally_enabled: newValue,
          updated_at: new Date()?.toISOString()
        })?.eq('feature_name', 'participation_fees');

      if (error) throw error;

      setGlobalEnabled(newValue);
      setMessage({ 
        type: 'success', 
        text: `Participation fees ${newValue ? 'enabled' : 'disabled'} globally` 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating global toggle:', error);
      setMessage({ type: 'error', text: 'Failed to update global setting' });
    } finally {
      setSaving(false);
    }
  };

  const handleCountryToggle = async (countryCode) => {
    try {
      setSaving(true);
      let updatedDisabledCountries;

      if (disabledCountries?.includes(countryCode)) {
        updatedDisabledCountries = disabledCountries?.filter(c => c !== countryCode);
      } else {
        updatedDisabledCountries = [...disabledCountries, countryCode];
      }

      const { error } = await supabase?.from('admin_participation_controls')?.update({ 
          disabled_countries: updatedDisabledCountries,
          updated_at: new Date()?.toISOString()
        })?.eq('feature_name', 'participation_fees');

      if (error) throw error;

      setDisabledCountries(updatedDisabledCountries);
      setMessage({ 
        type: 'success', 
        text: `Country settings updated successfully` 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating country toggle:', error);
      setMessage({ type: 'error', text: 'Failed to update country setting' });
    } finally {
      setSaving(false);
    }
  };

  const filteredCountries = allCountries?.filter(country =>
    country?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    country?.code?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    country?.region?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const groupedCountries = filteredCountries?.reduce((acc, country) => {
    if (!acc?.[country?.region]) {
      acc[country?.region] = [];
    }
    acc?.[country?.region]?.push(country);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              Global Participation Fee Control
            </h3>
            <p className="text-sm text-muted-foreground">
              Enable or disable participation fees across the entire platform. When disabled, all elections will be free to participate.
            </p>
          </div>
          <button
            onClick={handleGlobalToggle}
            disabled={saving}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              globalEnabled ? 'bg-success' : 'bg-muted'
            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                globalEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            globalEnabled ? 'bg-success' : 'bg-destructive'
          }`} />
          <span className="text-sm font-medium text-foreground">
            Status: {globalEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {message?.text && (
        <div className={`rounded-lg p-4 ${
          message?.type === 'success' ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'
        }`}>
          <div className="flex items-center gap-2">
            <Icon 
              name={message?.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
              size={18} 
              className={message?.type === 'success' ? 'text-success' : 'text-destructive'} 
            />
            <p className={`text-sm font-medium ${
              message?.type === 'success' ? 'text-success' : 'text-destructive'
            }`}>
              {message?.text}
            </p>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Country-Wise Participation Fee Controls
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Disable participation fees for specific countries. Users from disabled countries will not be able to create paid elections.
          </p>
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search countries by name, code, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedCountries)?.map(([region, countries]) => (
            <div key={region} className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                {region}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {countries?.map((country) => {
                  const isDisabled = disabledCountries?.includes(country?.code);
                  return (
                    <div
                      key={country?.code}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        isDisabled 
                          ? 'bg-destructive/5 border-destructive/20' :'bg-muted/30 border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{country?.code === 'US' ? '🇺🇸' : country?.code === 'CA' ? '🇨🇦' : '🌍'}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{country?.name}</p>
                          <p className="text-xs text-muted-foreground">{country?.code}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCountryToggle(country?.code)}
                        disabled={saving}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          !isDisabled ? 'bg-success' : 'bg-destructive'
                        } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            !isDisabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredCountries?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No countries found matching your search</p>
          </div>
        )}
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex gap-3">
          <Icon name="Info" size={18} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Important Notes
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Global disable overrides all country-specific settings</li>
              <li>Disabled countries cannot create or participate in paid elections</li>
              <li>Existing paid elections from disabled countries will remain active</li>
              <li>Changes take effect immediately for new election creation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipationFeeControls;