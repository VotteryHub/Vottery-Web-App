import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import perplexityThreatIntelligenceService from '../../../services/perplexityThreatIntelligenceService';

function DeepDiveAnalysisPanel() {
  const [huntingQuery, setHuntingQuery] = useState('');
  const [hunting, setHunting] = useState(false);
  const [huntResults, setHuntResults] = useState(null);
  const [error, setError] = useState(null);

  const handleThreatHunting = async () => {
    if (!huntingQuery?.trim()) return;

    setHunting(true);
    setError(null);

    try {
      const results = await perplexityThreatIntelligenceService?.performThreatHunting(huntingQuery);
      setHuntResults(results);
    } catch (err) {
      setError(err?.message);
    } finally {
      setHunting(false);
    }
  };

  const predefinedQueries = [
    'Latest ransomware attack patterns 2024',
    'Emerging payment fraud techniques',
    'Account takeover prevention strategies',
    'Zero-day vulnerabilities in financial platforms',
    'Social engineering tactics targeting elections',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Search" size={24} className="text-indigo-600" />
          Deep-Dive Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Comprehensive threat investigation workflows with contextual reasoning chains and automated threat hunting
        </p>

        {/* Threat Hunting Interface */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Automated Threat Hunting</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Threat Intelligence Query
              </label>
              <textarea
                value={huntingQuery}
                onChange={(e) => setHuntingQuery(e?.target?.value)}
                placeholder="Enter your threat hunting query..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>

            {/* Predefined Queries */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Queries
              </label>
              <div className="flex flex-wrap gap-2">
                {predefinedQueries?.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHuntingQuery(query)}
                    className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleThreatHunting}
              disabled={!huntingQuery?.trim() || hunting}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              {hunting ? (
                <>
                  <Icon name="Loader" size={20} className="animate-spin" />
                  Hunting Threats...
                </>
              ) : (
                <>
                  <Icon name="Search" size={20} />
                  Start Threat Hunt
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">Threat Hunt Failed</h4>
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Hunt Results */}
        {huntResults && huntResults?.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="Target" size={20} className="text-indigo-600" />
              Threat Intelligence Results ({huntResults?.length})
            </h3>
            <div className="space-y-3">
              {huntResults?.map((result, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    <a href={result?.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      {result?.title}
                    </a>
                  </h4>
                  {result?.snippet && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{result?.snippet}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {result?.date && (
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={12} />
                        {result?.date}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Icon name="ExternalLink" size={12} />
                      <a href={result?.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        View Source
                      </a>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Evidence Correlation Matrix */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Grid" size={20} className="text-indigo-600" />
          Evidence Correlation Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Indicator Types</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">IP Addresses</span>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Domain Names</span>
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded text-xs font-semibold">189</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">File Hashes</span>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs font-semibold">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">User Patterns</span>
                <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded text-xs font-semibold">342</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Correlation Strength</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Strong Correlations</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">78</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Moderate Correlations</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">124</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: '62%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Weak Correlations</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">89</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contextual Reasoning Chains */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} className="text-indigo-600" />
          Contextual Reasoning Chains
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold text-sm">1</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">Initial Threat Detection</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Anomaly detected in payment processing patterns</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 font-semibold text-sm">2</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">Cross-Domain Correlation</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Linked to suspicious user behavior in elections module</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-semibold text-sm">3</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">Historical Pattern Matching</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Similar attack vector identified in 3 previous incidents</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-600 font-semibold text-sm">4</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">Threat Attribution</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Coordinated campaign with 87% confidence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeepDiveAnalysisPanel;