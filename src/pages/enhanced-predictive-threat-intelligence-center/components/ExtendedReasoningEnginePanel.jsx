import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import perplexityThreatIntelligenceService from '../../../services/perplexityThreatIntelligenceService';

function ExtendedReasoningEnginePanel({ threatScenarios }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (scenario) => {
    setAnalyzing(true);
    setError(null);
    setSelectedScenario(scenario);

    try {
      const result = await perplexityThreatIntelligenceService?.analyzeDeepThreatPatterns({
        type: scenario?.name,
        patterns: { observed: 'coordinated_activity', frequency: 'increasing' },
        historical: { similar_incidents: 12, avg_impact: 'high' },
        indicators: scenario?.affectedDomains,
      });

      setAnalysisResult(result);
    } catch (err) {
      setError(err?.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Brain" size={24} className="text-indigo-600" />
          Extended Reasoning Engine
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Perplexity integration for complex threat scenario modeling, behavioral pattern evolution, and multi-vector attack prediction
        </p>

        {/* Threat Scenarios */}
        <div className="space-y-4">
          {threatScenarios?.map(scenario => (
            <div
              key={scenario?.id}
              className={`border rounded-lg p-4 transition-all ${
                selectedScenario?.id === scenario?.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' :'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {scenario?.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(scenario?.severity)}`}>
                      {scenario?.severity?.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{scenario?.name}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Forecast Horizon:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">{scenario?.forecastHorizon}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                      <span className="ml-2 font-semibold text-indigo-600">{scenario?.confidence}%</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600 dark:text-gray-400">Affected Domains:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {scenario?.affectedDomains?.map((domain, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                            {domain}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    <span className="font-semibold">Predicted Impact:</span> {scenario?.predictedImpact}
                  </p>
                </div>

                <button
                  onClick={() => handleAnalyze(scenario)}
                  disabled={analyzing}
                  className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  <Icon name="Sparkles" size={16} />
                  {analyzing && selectedScenario?.id === scenario?.id ? 'Analyzing...' : 'Deep Analysis'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="AlertCircle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">Analysis Failed</h4>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      {/* Analysis Result */}
      {analysisResult && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="FileText" size={20} className="text-indigo-600" />
            Perplexity Extended Reasoning Analysis
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
            {analysisResult?.analysis}
          </div>

          {/* Search Results */}
          {analysisResult?.searchResults && analysisResult?.searchResults?.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Intelligence Sources</h4>
              <div className="space-y-2">
                {analysisResult?.searchResults?.slice(0, 3)?.map((result, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <Icon name="ExternalLink" size={14} className="text-indigo-600 flex-shrink-0 mt-1" />
                    <div>
                      <a href={result?.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
                        {result?.title}
                      </a>
                      {result?.date && <span className="text-gray-500 ml-2">({result?.date})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Questions */}
          {analysisResult?.relatedQuestions && analysisResult?.relatedQuestions?.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Related Investigation Areas</h4>
              <div className="space-y-2">
                {analysisResult?.relatedQuestions?.map((question, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Icon name="HelpCircle" size={14} className="text-indigo-600 flex-shrink-0 mt-1" />
                    <span>{question}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Behavioral Pattern Evolution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-indigo-600" />
          Behavioral Pattern Evolution
        </h3>
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">Attack Sophistication</span>
              <span className="text-sm font-semibold text-red-600">+35% (30 days)</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-red-500" style={{ width: '78%' }}></div>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">Coordination Level</span>
              <span className="text-sm font-semibold text-orange-600">+22% (30 days)</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-orange-500" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">Evasion Techniques</span>
              <span className="text-sm font-semibold text-yellow-600">+18% (30 days)</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-yellow-500" style={{ width: '52%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExtendedReasoningEnginePanel;