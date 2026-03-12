import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import perplexityThreatIntelligenceService from '../../../services/perplexityThreatIntelligenceService';

function RegulatoryComplianceForecastingPanel({ forecasts }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [forecastResult, setForecastResult] = useState(null);
  const [error, setError] = useState(null);

  const handleForecast = async () => {
    if (!selectedJurisdiction) return;

    setAnalyzing(true);
    setError(null);

    try {
      const result = await perplexityThreatIntelligenceService?.forecastRegulatoryCompliance(selectedJurisdiction);
      setForecastResult(result);
    } catch (err) {
      setError(err?.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPreparednessColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Shield" size={24} className="text-indigo-600" />
          Regulatory Compliance Forecasting
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Predictive analysis for upcoming regulatory changes with jurisdiction-specific intelligence and automated policy recommendations
        </p>

        {/* Forecast Generator */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Generate Compliance Forecast</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Jurisdiction
              </label>
              <select
                value={selectedJurisdiction}
                onChange={(e) => setSelectedJurisdiction(e?.target?.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Choose jurisdiction...</option>
                <option value="EU">European Union</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="APAC">Asia-Pacific</option>
                <option value="LATAM">Latin America</option>
              </select>
            </div>

            <button
              onClick={handleForecast}
              disabled={!selectedJurisdiction || analyzing}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              {analyzing ? (
                <>
                  <Icon name="Loader" size={20} className="animate-spin" />
                  Forecasting with Perplexity...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={20} />
                  Generate Forecast
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
                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">Forecast Failed</h4>
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Result */}
        {forecastResult && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="FileText" size={20} className="text-indigo-600" />
                Compliance Forecast Result
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {forecastResult?.forecast}
                </div>
              </div>
            </div>

            {/* Intelligence Sources */}
            {forecastResult?.searchResults && forecastResult?.searchResults?.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Regulatory Intelligence Sources</h4>
                <div className="space-y-2">
                  {forecastResult?.searchResults?.slice(0, 4)?.map((result, idx) => (
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
          </div>
        )}

        {/* Existing Forecasts */}
        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">Active Compliance Forecasts</h3>
          {forecasts?.map((forecast, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{forecast?.jurisdiction}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(forecast?.riskLevel)}`}>
                      {forecast?.riskLevel?.toUpperCase()} RISK
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-semibold">Type:</span> {forecast?.regulationType}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-semibold">Predicted Change:</span> {forecast?.predictedChange}
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Effective Date:</span> {forecast?.effectiveDate}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className={`text-2xl font-bold ${getPreparednessColor(forecast?.preparednessScore)} mb-1`}>
                    {forecast?.preparednessScore}%
                  </div>
                  <div className="text-xs text-gray-500">Preparedness</div>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Recommended Actions</h4>
                <div className="space-y-1">
                  {forecast?.recommendedActions?.map((action, actionIdx) => (
                    <div key={actionIdx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Icon name="CheckCircle" size={14} className="text-green-600" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Jurisdiction Coverage */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Globe" size={20} className="text-indigo-600" />
          Jurisdiction Coverage
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">EU</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">27 Countries</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">US</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">50 States</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">UK</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">4 Nations</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">APAC</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">12 Countries</div>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">LATAM</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">8 Countries</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegulatoryComplianceForecastingPanel;