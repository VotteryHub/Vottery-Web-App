import React from 'react';
import Icon from '../../../components/AppIcon';

function CrossDomainCorrelationPanel({ correlations }) {
  const getStrengthColor = (strength) => {
    if (strength >= 0.8) return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    if (strength >= 0.6) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'investigating': return 'text-blue-600 bg-blue-100';
      case 'mitigated': return 'text-green-600 bg-green-100';
      case 'monitoring': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Network" size={24} className="text-indigo-600" />
          Cross-Domain Correlation Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Automated threat intelligence sharing between financial systems, user behavior analytics, and compliance monitoring
        </p>

        {/* Correlation Matrix */}
        <div className="space-y-4">
          {correlations?.map(correlation => (
            <div
              key={correlation?.correlationId}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {correlation?.correlationId}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(correlation?.status)}`}>
                      {correlation?.status?.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{correlation?.pattern}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Icon name="Users" size={14} />
                      {correlation?.affectedUsers} users affected
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      Detected {new Date(correlation.detectedAt)?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {correlation?.domains?.map((domain, idx) => (
                      <span key={idx} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                        {domain?.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">{Math.round(correlation?.strength * 100)}%</div>
                  <div className="text-xs text-gray-500">Correlation Strength</div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStrengthColor(correlation?.strength)}`}>
                      {correlation?.strength >= 0.8 ? 'STRONG' : correlation?.strength >= 0.6 ? 'MODERATE' : 'WEAK'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Correlation Strength Bar */}
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                  style={{ width: `${correlation?.strength * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Real-Time Pattern Matching */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} className="text-indigo-600" />
          Real-Time Pattern Matching Algorithms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Active Algorithms</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Behavioral Clustering</span>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs font-semibold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Anomaly Detection</span>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs font-semibold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Temporal Correlation</span>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs font-semibold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Graph Analysis</span>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs font-semibold">ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Performance Metrics</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Detection Accuracy</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">94.2%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '94.2%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">False Positive Rate</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">3.8%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: '3.8%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Processing Speed</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">1.2s avg</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Domain Intelligence Sharing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Share2" size={20} className="text-indigo-600" />
          Automated Intelligence Sharing
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-1">247</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Shared Indicators</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-1">89</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cross-Domain Alerts</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-1">34</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Prevented Incidents</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrossDomainCorrelationPanel;