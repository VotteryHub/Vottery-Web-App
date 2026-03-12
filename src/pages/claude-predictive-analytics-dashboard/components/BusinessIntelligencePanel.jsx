import React, { useState } from 'react';
import { BarChart3, FileText, TrendingUp, Target, Calendar, Loader, AlertCircle } from 'lucide-react';
import claudePredictiveAnalyticsService from '../../../services/claudePredictiveAnalyticsService';

function BusinessIntelligencePanel() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: reportError } = await claudePredictiveAnalyticsService?.generateBusinessIntelligenceReport();
      if (reportError) throw new Error(reportError.message);
      setReport(data);
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
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          Comprehensive Business Intelligence Report
        </h2>
        
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600 flex-1">
            Generate a comprehensive executive summary synthesizing all predictive analytics
          </p>
          <button
            onClick={generateReport}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generate Report
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
            <h3 className="font-semibold text-red-900 mb-1">Report Generation Failed</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Report Results */}
      {report && (
        <>
          {/* Executive Summary */}
          {report?.executiveSummary && (
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Executive Summary
              </h3>
              <p className="text-white/90 leading-relaxed">{report?.executiveSummary}</p>
            </div>
          )}

          {/* Key Insights */}
          {report?.keyInsights?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Key Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report?.keyInsights?.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-700 font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategic Priorities */}
          {report?.strategicPriorities?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Strategic Priorities
              </h3>
              <div className="space-y-4">
                {report?.strategicPriorities?.map((priority, index) => (
                  <div key={index} className="border-2 border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-700 font-bold">{priority?.priority || index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{priority?.action}</h4>
                        <div className="flex flex-wrap gap-2">
                          {priority?.impact && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              Impact: {priority?.impact}
                            </span>
                          )}
                          {priority?.effort && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              Effort: {priority?.effort}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          {report?.riskAssessment && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Risk Assessment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risks */}
                {report?.riskAssessment?.risks?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Identified Risks</h4>
                    <div className="space-y-2">
                      {report?.riskAssessment?.risks?.map((risk, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">{risk}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mitigation */}
                {report?.riskAssessment?.mitigation?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Mitigation Strategies</h4>
                    <div className="space-y-2">
                      {report?.riskAssessment?.mitigation?.map((strategy, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <Target className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">{strategy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Opportunities */}
          {report?.opportunities?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Growth Opportunities
              </h3>
              <div className="space-y-3">
                {report?.opportunities?.map((opportunity, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-blue-700" />
                    </div>
                    <p className="text-sm text-gray-700">{opportunity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 30-Day Action Plan */}
          {report?.actionPlan?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                30-Day Action Plan
              </h3>
              <div className="space-y-4">
                {report?.actionPlan?.map((week, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Week {week?.week}</h4>
                    <div className="space-y-2">
                      {week?.actions?.map((action, actionIndex) => (
                        <div key={actionIndex} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                          <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-indigo-700 font-bold text-xs">{actionIndex + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !report && !error && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Business Intelligence Report Available</h3>
          <p className="text-gray-600 mb-4">Click "Generate Report" to create a comprehensive executive summary with strategic insights</p>
        </div>
      )}
    </div>
  );
}

export default BusinessIntelligencePanel;
