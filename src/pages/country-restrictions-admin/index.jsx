import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { countryRestrictionsService } from '../../services/countryRestrictionsService';
import { useAuth } from '../../contexts/AuthContext';
import { WORLD_COUNTRIES as COUNTRY_LIST } from '../../constants/worldCountries';

const CountryRestrictionsAdmin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [restrictions, setRestrictions] = useState([]);
  const [search, setSearch] = useState('');
  const [filterEnabled, setFilterEnabled] = useState('all'); // all | enabled | disabled
  const [saving, setSaving] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = async () => {
    setLoading(true);
    try {
      const data = await countryRestrictionsService.getAll();
      setRestrictions(data);
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to load country restrictions' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const mapByCode = restrictions.reduce((acc, r) => { acc[r?.country_code] = r; return acc; }, {});

  const handleToggle = async (countryCode, countryName, currentEnabled) => {
    setSaving(countryCode);
    setMessage({ type: '', text: '' });
    try {
      await countryRestrictionsService.upsert({
        country_code: countryCode,
        country_name: countryName,
        is_enabled: !currentEnabled,
        last_modified_by: user?.id
      });
      await load();
      setMessage({ type: 'success', text: `${countryName} ${!currentEnabled ? 'enabled' : 'restricted'}` });
    } catch (e) {
      setMessage({ type: 'error', text: e?.message ?? 'Update failed' });
    } finally {
      setSaving(null);
    }
  };

  const handleBiometricToggle = async (countryCode, currentAllowed) => {
    setSaving(countryCode);
    try {
      await countryRestrictionsService.setBiometricAllowed(countryCode, !currentAllowed, user?.id);
      await load();
    } catch (e) {
      setMessage({ type: 'error', text: e?.message ?? 'Update failed' });
    } finally {
      setSaving(null);
    }
  };

  const handleBulkToggle = async (enable) => {
    if (!window.confirm(`Are you sure you want to ${enable ? 'enable' : 'restrict'} platform access for ALL countries? This is a high-impact operation.`)) return;
    setLoading(true);
    try {
      await countryRestrictionsService.bulkUpdateAccess(enable, user?.id, COUNTRY_LIST);
      await load();
      setMessage({ type: 'success', text: `All countries ${enable ? 'enabled' : 'restricted'}` });
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: e?.message ?? 'Bulk update failed' });
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries = COUNTRY_LIST.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const r = mapByCode[c.code];
    const enabled = r ? r.is_enabled : true;
    if (filterEnabled === 'enabled') return matchSearch && enabled;
    if (filterEnabled === 'disabled') return matchSearch && !enabled;
    return matchSearch;
  });

  return (
    <>
      <Helmet>
        <title>Country Restrictions - Vottery Admin</title>
      </Helmet>
      <HeaderNavigation />
      <main className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
                <Icon name="Globe" size={28} />
                Country Restrict / Derestrict
              </h1>
              <p className="text-muted-foreground mt-1">
                Enable or disable platform access and biometric usage per country.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleBulkToggle(true)} disabled={loading}>
                Enable All
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleBulkToggle(false)} disabled={loading}>
                Restrict All
              </Button>
              <Button variant="secondary" size="sm" onClick={load} disabled={loading}>
                Refresh
              </Button>
            </div>
          </div>

          {message?.text && (
            <div className={`mb-4 p-3 rounded-lg ${message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
              {message.text}
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-4">
            <Input
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e?.target?.value)}
              className="max-w-xs"
            />
            <select
              value={filterEnabled}
              onChange={(e) => setFilterEnabled(e?.target?.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-foreground"
            >
              <option value="all">All</option>
              <option value="enabled">Enabled only</option>
              <option value="disabled">Restricted only</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 font-semibold text-foreground">Country</th>
                      <th className="p-3 font-semibold text-foreground">Code</th>
                      <th className="p-3 font-semibold text-foreground">Platform access</th>
                      <th className="p-3 font-semibold text-foreground">Biometric allowed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCountries.map((c) => {
                      const r = mapByCode[c.code];
                      const isEnabled = r ? r.is_enabled : true;
                      const biometricAllowed = r ? r.biometric_allowed !== false : true;
                      return (
                        <tr key={c.code} className="border-t border-border hover:bg-muted/30">
                          <td className="p-3">{c.name}</td>
                          <td className="p-3 font-mono">{c.code}</td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={() => handleToggle(c.code, c.name, isEnabled)}
                              disabled={saving === c.code}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${isEnabled ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/20 text-red-700 dark:text-red-400'}`}
                            >
                              {saving === c.code ? '…' : isEnabled ? 'Enabled' : 'Restricted'}
                            </button>
                          </td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={() => handleBiometricToggle(c.code, biometricAllowed)}
                              disabled={saving === c.code}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${biometricAllowed ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400' : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'}`}
                            >
                              {biometricAllowed ? 'Yes' : 'No'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default CountryRestrictionsAdmin;
