import React from 'react';
import Icon from '../../../components/AppIcon';

function ThreatScenarioSimulationPanel({ scenarios }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'monitoring': return 'text-yellow-600 bg-yellow-100';
      case 'planned': return 'text-gray-600 bg-gray-100';
      case 'mitigated': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Activity" size={24} className="text-indigo-600" />
          Threat Scenario Simulation
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Interactive threat scenario modeling with predictive impact analysis and mitigation strategy testing
        </p>

        {/* Active Simulations */}
        <div className="space-y-4">
          {scenarios?.map(scenario => (
            <div
              key={scenario?.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {scenario?.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(scenario?.severity)}`}>
                      {scenario?.severity?.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(scenario?.mitigationStatus)}`}>
                      {scenario?.mitigationStatus?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{scenario?.name}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Forecast Horizon:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">{scenario?.forecastHorizon}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                      <span className="ml-2 font-semibold text-indigo-600">{scenario?.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-semibold">Predicted Impact:</span> {scenario?.predictedImpact}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {scenario?.affectedDomains?.map((domain, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">{scenario?.confidence}%</div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <Icon name="Play" size={14} />
                  Run Simulation
                </button>
                <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                  <Icon name="Settings" size={14} />
                </button>
                <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                  <Icon name="Download" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Simulation Parameters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Sliders" size={20} className="text-indigo-600" />
          Simulation Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attack Vector Intensity
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="65"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Defense Capability
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="78"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Weak</span>
              <span>Moderate</span>
              <span>Strong</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Horizon (days)
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="30">30 days</option>
              <option value="60" selected>60 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Simulation Iterations
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000" selected>1,000</option>
              <option value="5000">5,000</option>
            </select>
          </div>
        </div>
      </div>
      {/* Simulation Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="BarChart" size={20} className="text-indigo-600" />
          Simulation Results
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">34%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Breach Probability</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">$127K</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Impact</div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">18h</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Detection Time</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">82%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Mitigation Success</div>
          </div>
        </div>
      </div>
      {/* Mitigation Strategies */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} className="text-indigo-600" />
          Recommended Mitigation Strategies
        </h3>
        <div className="space-y-3">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">Enhanced Multi-Factor Authentication</span>
              <span className="text-sm font-semibold text-green-600">+45% Effectiveness</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Implement hardware token-based 2FA for high-risk accounts</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">Real-Time Behavioral Analysis</span>
              <span className="text-sm font-semibold text-green-600">+38% Effectiveness</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Deploy ML-powered anomaly detection across all domains</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">Automated Response Playbooks</span>
              <span className="text-sm font-semibold text-green-600">+32% Effectiveness</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pre-configured incident response workflows for common attack patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreatScenarioSimulationPanel;