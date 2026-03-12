import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import claudePredictiveAnalyticsService from '../../../services/claudePredictiveAnalyticsService';

function RevenueForecastPanel() {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [timeframe, setTimeframe] = useState(30);
  const [error, setError] = useState(null);

  const generateForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: forecastError } = await claudePredictiveAnalyticsService?.generateRevenueForecast(timeframe);
      if (forecastError) throw new Error(forecastError.message);
      setForecast(data);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-purple-600" />
          Revenue Forecast Generator
        </h2>
        
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forecast Timeframe (Days)
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(Number(e?.target?.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
            </select>
          </div>

          <button
            onClick={generateForecast}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Generate Forecast
              </>
            )}
          </button>
        </div>
      </div>
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Forecast Generation Failed</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
      {/* Forecast Results */}
      {forecast && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Projected</h3>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${forecast?.summary?.totalProjected?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Next {timeframe} days</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Expected Range</h3>
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">
                ${forecast?.summary?.minExpected?.toLocaleString() || '0'} - ${forecast?.summary?.maxExpected?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Min - Max projection</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Confidence Level</h3>
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {forecast?.summary?.confidenceLevel || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Forecast accuracy</p>
            </div>
          </div>

          {/* Daily Projections */}
          {forecast?.dailyProjections?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Revenue Projections</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Projected Revenue</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecast?.dailyProjections?.slice(0, 10)?.map((day, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{day?.date}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                          ${day?.revenue?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            day?.confidence === 'high' ? 'bg-green-100 text-green-800' :
                            day?.confidence === 'medium'? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {day?.confidence}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Revenue Drivers */}
          {forecast?.drivers?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Key Revenue Drivers
              </h3>
              <div className="space-y-3">
                {forecast?.drivers?.map((driver, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">{driver}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Factors */}
          {forecast?.risks?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                Risk Factors
              </h3>
              <div className="space-y-3">
                {forecast?.risks?.map((risk, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">{risk}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {forecast?.recommendations?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Actions</h3>
              <div className="space-y-3">
                {forecast?.recommendations?.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border border-purple-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {/* Empty State */}
      {!loading && !forecast && !error && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Forecast Generated</h3>
          <p className="text-gray-600 mb-4">Select a timeframe and click "Generate Forecast" to create AI-powered revenue predictions</p>
        </div>
      )}
    </div>
  );
}

export default RevenueForecastPanel;
