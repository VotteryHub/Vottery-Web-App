import React, { useState } from 'react';
import { AlertTriangle, Activity, Link, Shield, Wrench, Loader } from 'lucide-react';
import claudePredictiveAnalyticsService from '../../../services/claudePredictiveAnalyticsService';

function AnomalyCorrelationPanel() {
  const [loading, setLoading] = useState(false);
  const [correlation, setCorrelation] = useState(null);
  const [error, setError] = useState(null);

  const generateCorrelation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: correlationError } = await claudePredictiveAnalyticsService?.correlateAnomalies();
      if (correlationError) throw new Error(correlationError.message);
      setCorrelation(data);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === 'critical') return 'bg-red-100 text-red-800 border-red-300';
    if (severity === 'high') return 'bg-orange-100 text-orange-800 border-orange-300';
    if (severity === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          Anomaly Correlation Analysis
        </h2>
        
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600 flex-1">
            Detect and correlate anomalies across performance, revenue, and user behavior metrics
          </p>
          <button
            onClick={generateCorrelation}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Correlate Anomalies
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
            <h3 className="font-semibold text-red-900 mb-1">Correlation Analysis Failed</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Correlation Results */}
      {correlation && (
        <>
          {/* Impact Assessment */}
          {correlation?.impactAssessment && (
            <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Overall Impact Assessment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {correlation?.impactAssessment?.severity && (
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm text-white/80 mb-1">Severity Level</p>
                    <p className="text-2xl font-bold capitalize">{correlation?.impactAssessment?.severity}</p>
                  </div>
                )}
                {correlation?.impactAssessment?.affectedUsers && (
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm text-white/80 mb-1">Affected Users</p>
                    <p className="text-2xl font-bold">{correlation?.impactAssessment?.affectedUsers?.toLocaleString()}</p>
                  </div>
                )}
                {correlation?.impactAssessment?.revenueImpact && (
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm text-white/80 mb-1">Revenue Impact</p>
                    <p className="text-2xl font-bold">${correlation?.impactAssessment?.revenueImpact?.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Anomaly Clusters */}
          {correlation?.anomalyClusters?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Link className="w-5 h-5 text-orange-600" />
                Correlated Anomaly Clusters
              </h3>
              <div className="space-y-6">
                {correlation?.anomalyClusters?.map((cluster, index) => (
                  <div key={index} className={`border-2 rounded-lg p-5 ${getSeverityColor(cluster?.severity)}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Cluster #{cluster?.id || index + 1}</h4>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/50">
                        {cluster?.severity} severity
                      </span>
                    </div>

                    {/* Anomalies in Cluster */}
                    {cluster?.anomalies?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Detected Anomalies:</p>
                        <div className="space-y-2">
                          {cluster?.anomalies?.map((anomaly, aIndex) => (
                            <div key={aIndex} className="flex items-center gap-2 text-sm text-gray-700 bg-white/30 rounded p-2">
                              <Activity className="w-4 h-4 flex-shrink-0" />
                              <span>{anomaly}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Correlation */}
                    {cluster?.correlation && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Correlation:</p>
                        <p className="text-sm text-gray-800 bg-white/30 rounded p-3">{cluster?.correlation}</p>
                      </div>
                    )}

                    {/* Root Cause */}
                    {cluster?.rootCause && (
                      <div className="bg-white/40 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Root Cause Analysis:</p>
                        <p className="text-sm text-gray-800">{cluster?.rootCause}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remediation Actions */}
          {correlation?.remediationActions?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                Remediation Actions
              </h3>
              <div className="space-y-3">
                {correlation?.remediationActions?.map((action, index) => {
                  const priorityColor = action?.priority === 'high' ? 'border-red-300 bg-red-50' :
                                       action?.priority === 'medium'? 'border-yellow-300 bg-yellow-50' : 'border-blue-300 bg-blue-50';
                  return (
                    <div key={index} className={`border-2 rounded-lg p-4 ${priorityColor}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              action?.priority === 'high' ? 'bg-red-200 text-red-800' :
                              action?.priority === 'medium'? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'
                            }`}>
                              {action?.priority} priority
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 font-medium mb-1">{action?.action}</p>
                          {action?.expectedOutcome && (
                            <p className="text-xs text-gray-600">Expected: {action?.expectedOutcome}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Preventive Measures */}
          {correlation?.preventiveMeasures?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Preventive Measures
              </h3>
              <div className="space-y-3">
                {correlation?.preventiveMeasures?.map((measure, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-green-700" />
                    </div>
                    <p className="text-sm text-gray-700">{measure}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !correlation && !error && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Anomaly Correlation Available</h3>
          <p className="text-gray-600 mb-4">Click "Correlate Anomalies" to detect and analyze patterns across platform metrics</p>
        </div>
      )}
    </div>
  );
}

export default AnomalyCorrelationPanel;
