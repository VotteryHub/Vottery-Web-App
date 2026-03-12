import React from 'react';
import Icon from '../../../components/AppIcon';

const IntelligenceOverviewPanel = ({ intelligence, selectedDomains, setSelectedDomains, onRefresh }) => {
  const domains = [
    { id: 'financial', label: 'Financial Systems', icon: 'DollarSign', color: 'green' },
    { id: 'user_behavior', label: 'User Behavior', icon: 'Users', color: 'blue' },
    { id: 'compliance', label: 'Compliance', icon: 'Shield', color: 'purple' },
    { id: 'incidents', label: 'Incidents', icon: 'AlertTriangle', color: 'red' },
  ];

  const toggleDomain = (domainId) => {
    if (selectedDomains?.includes(domainId)) {
      setSelectedDomains(selectedDomains?.filter(d => d !== domainId));
    } else {
      setSelectedDomains([...selectedDomains, domainId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Domain Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Intelligence Domains</h3>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name="RefreshCw" size={16} />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {domains?.map((domain) => (
            <button
              key={domain?.id}
              onClick={() => toggleDomain(domain?.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedDomains?.includes(domain?.id)
                  ? `border-${domain?.color}-500 bg-${domain?.color}-50 dark:bg-${domain?.color}-900/10`
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Icon
                name={domain?.icon}
                size={24}
                className={selectedDomains?.includes(domain?.id) ? `text-${domain?.color}-600 dark:text-${domain?.color}-400` : 'text-gray-400'}
              />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-2">
                {domain?.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Consolidated Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Zap" size={24} className="text-purple-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Perplexity</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">85%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Threat Confidence</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Scale" size={24} className="text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Claude</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">88%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Decision Accuracy</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Sparkles" size={24} className="text-green-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">OpenAI</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">82%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Semantic Matching</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Database" size={24} className="text-orange-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Platform</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">95%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Data Quality</p>
        </div>
      </div>

      {/* AI Service Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">AI Service Status</h3>
        <div className="space-y-3">
          {[
            { name: 'Perplexity Threat Analysis', status: 'active', lastSync: '2 min ago', color: 'purple' },
            { name: 'Claude Dispute Reasoning', status: 'active', lastSync: '1 min ago', color: 'blue' },
            { name: 'OpenAI Semantic Matching', status: 'active', lastSync: '3 min ago', color: 'green' },
            { name: 'Platform Analytics', status: 'active', lastSync: 'Real-time', color: 'orange' },
          ]?.map((service, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 bg-${service?.color}-500 rounded-full animate-pulse`} />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {service?.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">Last sync: {service?.lastSync}</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                  {service?.status?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntelligenceOverviewPanel;