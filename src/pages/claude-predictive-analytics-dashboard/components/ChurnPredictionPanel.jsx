import React, { useState } from 'react';
import { Users, AlertTriangle, TrendingDown, Shield, Target, Loader } from 'lucide-react';
import claudePredictiveAnalyticsService from '../../../services/claudePredictiveAnalyticsService';

function ChurnPredictionPanel() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const generatePrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: predictionError } = await claudePredictiveAnalyticsService?.predictUserChurn();
      if (predictionError) throw new Error(predictionError.message);
      setPrediction(data);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          User Churn Prediction
        </h2>
        
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600 flex-1">
            Analyze user behavior patterns and predict churn risk across different segments
          </p>
          <button
            onClick={generatePrediction}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Predict Churn
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Prediction Failed</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Prediction Results */}
      {prediction && (
        <>
          {/* Overall Churn Rate */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Predicted Churn Rate (30 Days)</h3>
              <TrendingDown className="w-6 h-6" />
            </div>
            <p className="text-4xl font-bold mb-2">{prediction?.predictedChurnRate?.toFixed(1)}%</p>
            <p className="text-blue-100 text-sm">Based on current user behavior patterns</p>
          </div>

          {/* Segment Risk Scores */}
          {prediction?.segmentRisks?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Churn Risk by Segment</h3>
              <div className="space-y-4">
                {prediction?.segmentRisks?.map((segment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{segment?.segment}</h4>
                        <p className="text-sm text-gray-600">{segment?.userCount?.toLocaleString()} users</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(segment?.riskScore)}`}>
                          {segment?.riskScore}/100
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {segment?.churnProbability?.toFixed(1)}% churn probability
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          segment?.riskScore >= 70 ? 'bg-red-600' :
                          segment?.riskScore >= 40 ? 'bg-yellow-600': 'bg-green-600'
                        }`}
                        style={{ width: `${segment?.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Churn Indicators */}
          {prediction?.indicators?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Key Churn Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prediction?.indicators?.map((indicator, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-700 font-bold text-xs">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{indicator}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* High-Risk Profile */}
          {prediction?.highRiskProfile && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                High-Risk User Profile
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="space-y-2">
                  {Object.entries(prediction?.highRiskProfile)?.map(([key, value], index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                      </span>
                      <span className="text-sm text-gray-900 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Retention Strategies */}
          {prediction?.retentionStrategies?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Retention Strategies</h3>
              <div className="space-y-3">
                {prediction?.retentionStrategies?.map((strategy, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border border-green-200 rounded-lg hover:shadow-md transition-shadow bg-green-50">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-medium">{strategy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !prediction && !error && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Churn Prediction Available</h3>
          <p className="text-gray-600 mb-4">Click "Predict Churn" to analyze user behavior and identify at-risk segments</p>
        </div>
      )}
    </div>
  );
}

export default ChurnPredictionPanel;
