import React, { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, Zap, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const PredictiveRevenueModelingPanel = ({ forecast, historicalData, streams, onRefreshForecast, forecastDays, setForecastDays, isLoading }) => {
  const [expandedSection, setExpandedSection] = useState('summary');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const confidenceColor = (confidence) => {
    switch (confidence) {
      case 'high': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Unified Predictive Revenue Modeling</h2>
            <p className="text-gray-400 text-sm">Claude AI + OpenAI multi-model forecasting</p>
          </div>
        </div>
        <button
          onClick={onRefreshForecast}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Regenerate
        </button>
      </div>
      {/* Forecast period selector */}
      <div className="flex gap-2 mb-6">
        {[30, 60, 90]?.map(days => (
          <button
            key={days}
            onClick={() => setForecastDays(days)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              forecastDays === days
                ? 'bg-purple-600 text-white' :'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {days}-Day Forecast
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-800 rounded-lg"></div>
          <div className="h-40 bg-gray-800 rounded-lg"></div>
        </div>
      ) : forecast ? (
        <div className="space-y-4">
          {/* Main forecast card */}
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-700/30 rounded-xl p-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">Projected Revenue</p>
                <p className="text-3xl font-bold text-white">${forecast?.forecast_total?.toLocaleString()}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 text-xs">+{forecast?.growth_projection}%</span>
                </div>
              </div>
              <div className="text-center border-x border-purple-700/30">
                <p className="text-gray-400 text-xs mb-1">Low Estimate</p>
                <p className="text-xl font-bold text-yellow-400">${forecast?.confidence_interval?.low?.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-1">Conservative</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-1">High Estimate</p>
                <p className="text-xl font-bold text-green-400">${forecast?.confidence_interval?.high?.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-1">Optimistic</p>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {forecast?.summary && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">AI Analysis</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{forecast?.summary}</p>
            </div>
          )}

          {/* Stream forecasts */}
          <div>
            <button
              onClick={() => toggleSection('streams')}
              className="w-full flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <span className="text-white font-medium text-sm">Per-Stream Forecasts</span>
              {expandedSection === 'streams' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {expandedSection === 'streams' && (
              <div className="mt-2 space-y-2">
                {forecast?.stream_forecasts?.map((sf, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300 text-sm">{sf?.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">${sf?.forecast?.toLocaleString()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${confidenceColor(sf?.confidence)}`}>
                        {sf?.confidence}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Key drivers */}
          <div>
            <button
              onClick={() => toggleSection('drivers')}
              className="w-full flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <span className="text-white font-medium text-sm">Key Growth Drivers & Risks</span>
              {expandedSection === 'drivers' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {expandedSection === 'drivers' && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
                  <p className="text-green-400 text-xs font-medium mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Key Drivers
                  </p>
                  <ul className="space-y-1">
                    {forecast?.key_drivers?.map((d, i) => (
                      <li key={i} className="text-gray-300 text-xs flex items-start gap-1">
                        <span className="text-green-400 mt-0.5">•</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
                  <p className="text-red-400 text-xs font-medium mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Risks
                  </p>
                  <ul className="space-y-1">
                    {forecast?.risks?.map((r, i) => (
                      <li key={i} className="text-gray-300 text-xs flex items-start gap-1">
                        <span className="text-red-400 mt-0.5">•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Opportunities */}
          {forecast?.opportunities && (
            <div>
              <button
                onClick={() => toggleSection('opportunities')}
                className="w-full flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
              >
                <span className="text-white font-medium text-sm">Growth Opportunities</span>
                {expandedSection === 'opportunities' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {expandedSection === 'opportunities' && (
                <div className="mt-2 space-y-2">
                  {forecast?.opportunities?.map((opp, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-700/20 rounded-lg">
                      <span className="text-blue-400 text-sm">💡</span>
                      <p className="text-gray-300 text-sm">{opp}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Click Regenerate to generate AI forecast</p>
        </div>
      )}
    </div>
  );
};

export default PredictiveRevenueModelingPanel;
