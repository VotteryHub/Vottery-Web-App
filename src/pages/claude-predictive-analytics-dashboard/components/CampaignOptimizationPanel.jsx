import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign, Users, Zap, Loader, AlertCircle } from 'lucide-react';
import claudePredictiveAnalyticsService from '../../../services/claudePredictiveAnalyticsService';

function CampaignOptimizationPanel() {
  const [loading, setLoading] = useState(false);
  const [optimizations, setOptimizations] = useState(null);
  const [error, setError] = useState(null);

  const generateOptimizations = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: optimizationError } = await claudePredictiveAnalyticsService?.generateCampaignOptimizations();
      if (optimizationError) throw new Error(optimizationError.message);
      setOptimizations(data);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact) => {
    if (impact === 'high') return 'bg-green-100 text-green-800';
    if (impact === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-green-600" />
          Campaign Optimization Recommendations
        </h2>
        
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600 flex-1">
            Generate AI-powered optimization recommendations for active campaigns
          </p>
          <button
            onClick={generateOptimizations}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate Optimizations
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
            <h3 className="font-semibold text-red-900 mb-1">Optimization Failed</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Optimization Results */}
      {optimizations && (
        <>
          {/* Campaign-Specific Optimizations */}
          {optimizations?.campaignOptimizations?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign-Specific Recommendations</h3>
              <div className="space-y-6">
                {optimizations?.campaignOptimizations?.map((campaign, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{campaign?.campaignName}</h4>
                        <p className="text-sm text-gray-500">Campaign ID: {campaign?.campaignId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getImpactColor(campaign?.expectedImpact)}`}>
                        {campaign?.expectedImpact} impact
                      </span>
                    </div>
                    <div className="space-y-2">
                      {campaign?.recommendations?.map((rec, recIndex) => (
                        <div key={recIndex} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-green-700 font-bold text-xs">{recIndex + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget Reallocations */}
          {optimizations?.budgetReallocations?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Budget Reallocation Suggestions
              </h3>
              <div className="space-y-3">
                {optimizations?.budgetReallocations?.map((reallocation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">{reallocation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Targeting Improvements */}
          {optimizations?.targetingImprovements?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Targeting Improvements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimizations?.targetingImprovements?.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-blue-700" />
                    </div>
                    <p className="text-sm text-gray-700">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creative Optimizations */}
          {optimizations?.creativeOptimizations?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Creative Optimization Ideas
              </h3>
              <div className="space-y-3">
                {optimizations?.creativeOptimizations?.map((creative, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-700 font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{creative}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Priority Actions */}
          {optimizations?.priorityActions?.length > 0 && (
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Priority Actions (Immediate)
              </h3>
              <div className="space-y-3">
                {optimizations?.priorityActions?.map((action, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-sm text-white">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !optimizations && !error && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Optimizations Generated</h3>
          <p className="text-gray-600 mb-4">Click "Generate Optimizations" to receive AI-powered campaign improvement recommendations</p>
        </div>
      )}
    </div>
  );
}

export default CampaignOptimizationPanel;
