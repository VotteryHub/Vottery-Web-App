import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import AdminToolbar from '../../components/ui/AdminToolbar';
import Icon from '../../components/AppIcon';

import { adminRolesService, platformControlsService } from '../../services/adminRolesService';

const AdvancedAdminRoleManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [featureToggles, setFeatureToggles] = useState([]);
  const [countryControls, setCountryControls] = useState([]);
  const [integrationControls, setIntegrationControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [permissionsJson, setPermissionsJson] = useState('{}');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'roles') {
        const { data } = await adminRolesService?.getAllRoles();
        setRoles(data || []);
      } else if (activeTab === 'features') {
        const { data } = await platformControlsService?.getFeatureToggles();
        setFeatureToggles(data || []);
      } else if (activeTab === 'countries') {
        const { data } = await platformControlsService?.getCountryControls();
        setCountryControls(data || []);
      } else if (activeTab === 'integrations') {
        const { data } = await platformControlsService?.getIntegrationControls();
        setIntegrationControls(data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async (featureName, isEnabled) => {
    await platformControlsService?.updateFeatureToggle(featureName, { isEnabled });
    loadData();
  };

  const handleToggleCountry = async (countryCode, isEnabled) => {
    await platformControlsService?.updateCountryControl(countryCode, { isEnabled });
    loadData();
  };

  const handleToggleIntegration = async (integrationName, isEnabled) => {
    await platformControlsService?.updateIntegrationControl(integrationName, { isEnabled });
    loadData();
  };

  const handleUpdateCostLimit = async (integrationName, type, value) => {
    const updates = type === 'weekly' 
      ? { weeklyCostLimit: parseFloat(value) }
      : { monthlyCostLimit: parseFloat(value) };
    await platformControlsService?.updateIntegrationControl(integrationName, updates);
    loadData();
  };

  const handleEditPermissions = (role) => {
    setEditingRole(role);
    setPermissionsJson(JSON.stringify(role?.permissions || {}, null, 2));
  };

  const handleSavePermissions = async () => {
    if (!editingRole?.id) return;
    try {
      const parsed = JSON.parse(permissionsJson);
      await adminRolesService?.updateRolePermissions(editingRole?.id, parsed);
      setEditingRole(null);
      loadData();
    } catch (e) {
      alert('Invalid JSON: ' + (e?.message || 'Failed to parse'));
    }
  };

  const tabs = [
    { id: 'roles', label: 'Admin Roles', icon: 'Shield' },
    { id: 'features', label: 'Feature Toggles', icon: 'Sliders' },
    { id: 'countries', label: 'Country Controls', icon: 'Globe' },
    { id: 'integrations', label: 'Integration Controls', icon: 'Plug' }
  ];

  const filteredRoles = roles?.filter(role => 
    role?.displayName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const filteredFeatures = featureToggles?.filter(feature => 
    feature?.featureName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const filteredCountries = countryControls?.filter(country => 
    country?.countryName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    country?.countryCode?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const filteredIntegrations = integrationControls?.filter(integration => 
    integration?.integrationName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Advanced Admin Role Management System - Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <AdminToolbar />

      <main className="lg:ml-64 xl:ml-72 pt-14">
        <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
              Advanced Admin Role Management System
            </h1>
            <p className="text-muted-foreground">
              Comprehensive multi-role administration with granular permissions and platform controls
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {tabs?.map(tab => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-250 ${
                      activeTab === tab?.id
                        ? 'bg-primary text-white' :'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    {tab?.label}
                  </button>
                ))}
              </div>
              <div className="w-full md:w-auto">
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader" size={32} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'roles' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRoles?.map(role => (
                    <div key={role?.id} className="bg-card rounded-xl border border-border p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
                            {role?.displayName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {role?.description}
                          </p>
                        </div>
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name="Shield" size={20} className="text-primary" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Permissions
                        </p>
                        <div className="flex flex-wrap gap-2 items-center">
                          {Object.keys(role?.permissions || {})?.map(resource => (
                            <span
                              key={resource}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium"
                            >
                              {resource}
                            </span>
                          ))}
                          <button
                            onClick={() => handleEditPermissions(role)}
                            className="ml-2 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-md"
                          >
                            Edit Permissions
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                {editingRole && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-card rounded-xl border border-border p-6 max-w-lg w-full max-h-[80vh] overflow-auto">
                      <h3 className="text-lg font-semibold mb-2">Edit Permissions: {editingRole?.displayName}</h3>
                      <p className="text-sm text-muted-foreground mb-3">Customize role permissions (JSON format)</p>
                      <textarea
                        value={permissionsJson}
                        onChange={(e) => setPermissionsJson(e.target.value)}
                        className="w-full h-48 p-3 font-mono text-sm rounded-lg border border-border bg-muted/30"
                        placeholder='{"users": ["view", "edit"], "elections": ["view"]}'
                      />
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => setEditingRole(null)} className="px-4 py-2 rounded-lg border bg-muted">Cancel</button>
                        <button onClick={handleSavePermissions} className="px-4 py-2 rounded-lg bg-primary text-white">Save</button>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-3">
                  {filteredFeatures?.map(feature => (
                    <div key={feature?.id} className="bg-card rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            feature?.isEnabled ? 'bg-success/10' : 'bg-muted'
                          }`}>
                            <Icon 
                              name={feature?.isEnabled ? 'Check' : 'X'} 
                              size={20} 
                              className={feature?.isEnabled ? 'text-success' : 'text-muted-foreground'}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">
                              {feature?.featureName?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Category: {feature?.featureCategory}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleFeature(feature?.featureName, !feature?.isEnabled)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-250 ${
                            feature?.isEnabled
                              ? 'bg-success/10 text-success hover:bg-success/20' :'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {feature?.isEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'countries' && (
                <div className="space-y-3">
                  {filteredCountries?.map(country => (
                    <div key={country?.id} className="bg-card rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-3xl">
                            {String.fromCodePoint(...[...country?.countryCode?.toUpperCase()]?.map(c => 127397 + c?.charCodeAt(0)))}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">
                              {country?.countryName}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-muted-foreground">
                                Code: {country?.countryCode}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-md ${
                                country?.biometricAllowed
                                  ? 'bg-success/10 text-success' :'bg-warning/10 text-warning'
                              }`}>
                                {country?.biometricAllowed ? 'Biometric Allowed' : 'Biometric Restricted'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleCountry(country?.countryCode, !country?.isEnabled)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-250 ${
                            country?.isEnabled
                              ? 'bg-success/10 text-success hover:bg-success/20' :'bg-destructive/10 text-destructive hover:bg-destructive/20'
                          }`}
                        >
                          {country?.isEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="space-y-4">
                  {filteredIntegrations?.map(integration => (
                    <div key={integration?.id} className="bg-card rounded-xl border border-border p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            integration?.isEnabled ? 'bg-success/10' : 'bg-muted'
                          }`}>
                            <Icon 
                              name="Plug" 
                              size={24} 
                              className={integration?.isEnabled ? 'text-success' : 'text-muted-foreground'}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-heading font-semibold text-foreground">
                              {integration?.integrationName}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Type: {integration?.integrationType?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleIntegration(integration?.integrationName, !integration?.isEnabled)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-250 ${
                            integration?.isEnabled
                              ? 'bg-success/10 text-success hover:bg-success/20' :'bg-destructive/10 text-destructive hover:bg-destructive/20'
                          }`}
                        >
                          {integration?.isEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Weekly Cost Limit ($)
                          </label>
                          <input
                            type="number"
                            value={integration?.weeklyCostLimit || 0}
                            onChange={(e) => handleUpdateCostLimit(integration?.integrationName, 'weekly', e?.target?.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            step="0.01"
                            min="0"
                          />
                          <p className="text-xs text-muted-foreground">
                            Current spend: ${integration?.currentWeeklySpend?.toFixed(2) || '0.00'}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            Monthly Cost Limit ($)
                          </label>
                          <input
                            type="number"
                            value={integration?.monthlyCostLimit || 0}
                            onChange={(e) => handleUpdateCostLimit(integration?.integrationName, 'monthly', e?.target?.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            step="0.01"
                            min="0"
                          />
                          <p className="text-xs text-muted-foreground">
                            Current spend: ${integration?.currentMonthlySpend?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          integration?.apiKeyConfigured ? 'bg-success' : 'bg-warning'
                        }`} />
                        <span className="text-sm text-muted-foreground">
                          {integration?.apiKeyConfigured ? 'API Key Configured' : 'API Key Not Configured'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdvancedAdminRoleManagementSystem;