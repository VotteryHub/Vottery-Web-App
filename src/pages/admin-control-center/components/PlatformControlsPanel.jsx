import React, { useState, useEffect } from 'react';
import { Settings, Globe, Zap, DollarSign, AlertCircle, CheckCircle, TrendingUp, ShieldCheck, ChevronRight, Search, Compass, ChevronDown } from 'lucide-react';
import adminControlsService from '../../../services/adminControlsService';
import { navigationService } from '../../../services/navigationService';

const PlatformControlsPanel = () => {
  const [activeTab, setActiveTab] = useState('features');
  const [features, setFeatures] = useState([]);
  const [countries, setCountries] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    
    if (activeTab === 'features') {
      const result = await adminControlsService?.getAllFeatures();
      if (result?.success) setFeatures(result?.features);
    } else if (activeTab === 'countries') {
      const result = await adminControlsService?.getAllCountries();
      if (result?.success) setCountries(result?.countries);
    } else if (activeTab === 'integrations') {
      const result = await adminControlsService?.getAllIntegrations();
      if (result?.success) setIntegrations(result?.integrations);
    }
    
    setLoading(false);
  };

  const handleToggleFeature = async (featureKey, currentState) => {
    const result = await adminControlsService?.toggleFeature(featureKey, !currentState);
    if (result?.success) {
      setMessage({ type: 'success', text: `Feature ${!currentState ? 'enabled' : 'disabled'} successfully` });
      loadData();
    } else {
      setMessage({ type: 'error', text: result?.error });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggleCountry = async (countryCode, currentState) => {
    const result = await adminControlsService?.toggleCountry(countryCode, !currentState);
    if (result?.success) {
      setMessage({ type: 'success', text: `Country ${!currentState ? 'enabled' : 'disabled'} successfully` });
      loadData();
    } else {
      setMessage({ type: 'error', text: result?.error });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggleIntegration = async (integrationKey, currentState) => {
    const result = await adminControlsService?.toggleIntegration(integrationKey, !currentState);
    if (result?.success) {
      setMessage({ type: 'success', text: `Integration ${!currentState ? 'enabled' : 'disabled'} successfully` });
      loadData();
    } else {
      setMessage({ type: 'error', text: result?.error });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdateIntegrationLimits = async (integrationKey, weeklyLimit, monthlyLimit) => {
    const result = await adminControlsService?.updateIntegrationLimits(integrationKey, weeklyLimit, monthlyLimit);
    if (result?.success) {
      setMessage({ type: 'success', text: 'Integration limits updated successfully' });
      loadData();
    } else {
      setMessage({ type: 'error', text: result?.error });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message?.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message?.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message?.text}</span>
        </div>
      )}
      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'features', label: 'Platform Features', icon: Settings },
            { id: 'countries', label: 'Country Controls', icon: Globe },
            { id: 'integrations', label: 'Integration Limits', icon: Zap },
            { id: 'verification', label: 'Verification & Compliance', icon: ShieldCheck },
            { id: 'explorer', label: 'Platform Explorer', icon: Globe },
          ].map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Features Tab */}
      {activeTab === 'features' && (
        <FeaturesPanel 
          features={features} 
          onToggle={handleToggleFeature}
          loading={loading}
        />
      )}
      {/* Countries Tab */}
      {activeTab === 'countries' && (
        <CountriesPanel 
          countries={countries} 
          onToggle={handleToggleCountry}
          loading={loading}
        />
      )}
      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <IntegrationsPanel 
          integrations={integrations} 
          onToggle={handleToggleIntegration}
          onUpdateLimits={handleUpdateIntegrationLimits}
          loading={loading}
        />
      )}
      {/* Verification Tab */}
      {activeTab === 'verification' && (
        <VerificationSettingsPanel 
          features={features}
          onToggle={handleToggleFeature}
          loading={loading}
        />
      )}
      {/* Explorer Tab */}
      {activeTab === 'explorer' && (
        <PlatformExplorerPanel />
      )}
    </div>
  );
};

import Icon from '../../../components/AppIcon';

const PlatformExplorerPanel = () => {
  const categories = navigationService.getCategories();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.map(cat => ({
    name: cat,
    screens: navigationService.getScreensByCategory(cat).filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(c => c.screens.length > 0);

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#0b0e14] rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-white/5 animate-in fade-in zoom-in-95 duration-500">
      <div className="p-8 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900/50">
        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-3">
          <Compass className="w-6 h-6 text-indigo-500" />
          Sitemap & Platform Explorer
        </h3>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search across 143+ screens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-950 border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all text-sm font-bold text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="p-2 space-y-1">
        {filteredCategories.map((cat) => {
          const iconName = navigationService.getCategoryIcon(cat.name);
          const isExpanded = expandedCategory === cat.name;

          return (
            <div key={cat.name} className="w-full">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  isExpanded ? 'bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-white/5' : 'hover:bg-gray-200/50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isExpanded ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 group-hover:bg-indigo-500 group-hover:text-white border border-gray-100 dark:border-white/5 shadow-sm'
                  }`}>
                    <Icon name={iconName} size={22} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <h4 className={`font-black text-[14px] uppercase tracking-tight transition-colors ${isExpanded ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-400'}`}>
                      {cat.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{cat.screens.length} Screens</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-indigo-500/10 text-indigo-500 rotate-90' : 'text-gray-300 group-hover:text-indigo-500'}`}>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-in slide-in-from-top-4 duration-300">
                  {cat.screens.map((screen) => (
                    <a
                      key={screen.id}
                      href={screen.path}
                      className="group/item p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl hover:border-indigo-500 hover:shadow-xl transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                         <Icon name="ExternalLink" size={12} className="text-indigo-400" />
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                           <Icon name={screen.icon || 'Circle'} size={14} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {screen.id}
                        </span>
                      </div>
                      <p className="text-sm font-black text-gray-900 dark:text-white leading-tight mb-1">{screen.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{screen.path}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Features Panel Component — search, category filter, and full list from audit
const FeaturesPanel = ({ features, onToggle, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const categories = ['all', ...new Set((features || []).map(f => f.feature_category).filter(Boolean))];
  const filtered = (features || [])
    .filter(f => {
      const matchSearch = !searchTerm || (f?.feature_name?.toLowerCase?.() ?? '').includes(searchTerm.toLowerCase())
        || (f?.feature_key?.toLowerCase?.() ?? '').includes(searchTerm.toLowerCase())
        || (f?.description?.toLowerCase?.() ?? '').includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'all' || f?.feature_category === categoryFilter;
      return matchSearch && matchCat;
    });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Platform Features Control</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Turn features on or off. Disabled features are hidden or blocked for users. All audit features are listed here.
      </p>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or key..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white capitalize"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All categories' : cat}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading features...</div>
      ) : (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {categoryFilter === 'all' ? (
            <div className="space-y-3">
              {filtered.map((feature) => (
                <div key={feature?.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">{feature?.feature_name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{feature?.feature_key}</div>
                    {feature?.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{feature?.description}</div>
                    )}
                    {feature?.requires_subscription && (
                      <span className="inline-block mt-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
                        Requires Subscription
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggle(feature?.feature_key ?? feature?.feature_name, feature?.is_enabled)}
                    className={`ml-4 shrink-0 relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      feature?.is_enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label={feature?.is_enabled ? 'Disable' : 'Enable'}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                        feature?.is_enabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            categories.filter(c => c !== 'all').map((category) => (
              <div key={category} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">{category}</h4>
                <div className="space-y-3">
                  {filtered.filter(f => f?.feature_category === category).map((feature) => (
                    <div key={feature?.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white">{feature?.feature_name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature?.description}</div>
                        {feature?.requires_subscription && (
                          <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                            Requires Subscription
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggle(feature?.feature_key ?? feature?.feature_name, feature?.is_enabled)}
                        className={`ml-4 relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          feature?.is_enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            feature?.is_enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-500">No features match your search.</div>
          )}
        </div>
      )}
    </div>
  );
};

// Countries Panel Component
const CountriesPanel = ({ countries, onToggle, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = countries?.filter(country =>
    country?.country_name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Country Access Controls</h3>
        <input
          type="text"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading countries...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
          {filteredCountries?.map((country) => (
            <div key={country?.id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-gray-900">{country?.country_name}</div>
                <button
                  onClick={() => onToggle(country?.country_code, country?.is_enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    country?.is_enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      country?.is_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Biometric:</span>
                  <span className={`font-semibold ${country?.biometric_enabled ? 'text-green-600' : 'text-red-600'}`}>
                    {country?.biometric_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Max Duration:</span>
                  <span className="font-semibold">{country?.max_election_duration_days} days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Integrations Panel Component
const IntegrationsPanel = ({ integrations, onToggle, onUpdateLimits, loading }) => {
  const [editingLimits, setEditingLimits] = useState(null);

  const getSpendPercentage = (current, limit) => {
    if (!limit || limit === 0) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Integration Controls & Cost Limits</h3>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading integrations...</div>
      ) : (
        <div className="space-y-4">
          {integrations?.map((integration) => {
            const weeklyPercentage = getSpendPercentage(integration?.current_weekly_spend, integration?.weekly_cost_limit);
            const monthlyPercentage = getSpendPercentage(integration?.current_monthly_spend, integration?.monthly_cost_limit);
            const isEditing = editingLimits === integration?.id;

            return (
              <div key={integration?.id} className="p-6 border-2 border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      integration?.integration_type === 'payment' ? 'bg-green-100' :
                      integration?.integration_type === 'ai' ? 'bg-purple-100' :
                      integration?.integration_type === 'analytics' ? 'bg-blue-100' :
                      integration?.integration_type === 'communication'? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {integration?.integration_type === 'payment' && <DollarSign className="w-6 h-6 text-green-600" />}
                      {integration?.integration_type === 'ai' && <Zap className="w-6 h-6 text-purple-600" />}
                      {integration?.integration_type === 'analytics' && <TrendingUp className="w-6 h-6 text-blue-600" />}
                      {integration?.integration_type === 'communication' && <Globe className="w-6 h-6 text-yellow-600" />}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{integration?.integration_name}</div>
                      <div className="text-sm text-gray-600 capitalize">{integration?.integration_type}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggle(integration?.integration_key, integration?.is_enabled)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      integration?.is_enabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        integration?.is_enabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {/* Cost Limits */}
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Cost Limit ($)</label>
                      <input
                        type="number"
                        defaultValue={integration?.weekly_cost_limit}
                        id={`weekly-${integration?.id}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Cost Limit ($)</label>
                      <input
                        type="number"
                        defaultValue={integration?.monthly_cost_limit}
                        id={`monthly-${integration?.id}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const weeklyLimit = parseFloat(document.getElementById(`weekly-${integration?.id}`)?.value);
                          const monthlyLimit = parseFloat(document.getElementById(`monthly-${integration?.id}`)?.value);
                          onUpdateLimits(integration?.integration_key, weeklyLimit, monthlyLimit);
                          setEditingLimits(null);
                        }}
                        className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingLimits(null)}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Weekly Spend */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Weekly Spend</span>
                        <span className="font-semibold text-gray-900">
                          ${integration?.current_weekly_spend?.toFixed(2) || '0.00'} / ${integration?.weekly_cost_limit?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            weeklyPercentage >= 90 ? 'bg-red-500' :
                            weeklyPercentage >= 70 ? 'bg-yellow-500': 'bg-green-500'
                          }`}
                          style={{ width: `${weeklyPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Monthly Spend */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Monthly Spend</span>
                        <span className="font-semibold text-gray-900">
                          ${integration?.current_monthly_spend?.toFixed(2) || '0.00'} / ${integration?.monthly_cost_limit?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            monthlyPercentage >= 90 ? 'bg-red-500' :
                            monthlyPercentage >= 70 ? 'bg-yellow-500': 'bg-green-500'
                          }`}
                          style={{ width: `${monthlyPercentage}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingLimits(integration?.id)}
                      className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 text-sm"
                    >
                      Edit Limits
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const VerificationSettingsPanel = ({ features, onToggle, loading }) => {
  const [markup, setMarkup] = useState(20);
  const identityFeature = features?.find(f => f.feature_name === 'identity_verification_global');
  const ageFeature = features?.find(f => f.feature_name === 'age_verification_global');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          Global Verification Controls
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div>
              <div className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">Identity Verification (Global)</div>
              <p className="text-xs text-gray-500 mt-1">Master switch for all Sumsub/Veriff identity checks across the platform.</p>
            </div>
            <button
              onClick={() => onToggle('identity_verification_global', identityFeature?.is_enabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                identityFeature?.is_enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span className={`inline-block h-6 h-6 transform rounded-full bg-white transition-transform ${identityFeature?.is_enabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div>
              <div className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">Age Verification (Global)</div>
              <p className="text-xs text-gray-500 mt-1">Master switch for all AI-powered facial age estimation gates.</p>
            </div>
            <button
              onClick={() => onToggle('age_verification_global', ageFeature?.is_enabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                ageFeature?.is_enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span className={`inline-block h-6 h-6 transform rounded-full bg-white transition-transform ${ageFeature?.is_enabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-indigo-600" />
          Revenue & Billing Configuration
        </h3>
        
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">Platform Verification Markup</span>
            <span className="text-lg font-black text-indigo-600">{markup}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={markup}
            onChange={(e) => setMarkup(parseInt(e.target.value))}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between mt-2 text-[10px] text-indigo-500 font-bold uppercase">
            <span>0% (Cost Only)</span>
            <span>50%</span>
            <span>100% (High Margin)</span>
          </div>
          <p className="mt-4 text-xs text-indigo-700/70 dark:text-indigo-400/70 italic">
            * This markup is automatically added to the provider cost (Sumsub/Veriff) for all paid verification events.
          </p>
          <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            Apply Configuration Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformControlsPanel;