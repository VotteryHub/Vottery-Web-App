import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { anthropicSecurityReasoningService } from '../../../services/anthropicSecurityReasoningService';

const RootCauseAnalysisPanel = ({ incident, onSelectIncident, incidents }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const performRootCauseAnalysis = async (inc) => {
    setLoading(true);
    try {
      const { data, error } = await anthropicSecurityReasoningService?.performRootCauseAnalysis(inc);
      if (error) throw error;
      setAnalysis(data);
    } catch (error) {
      console.error('Error performing root cause analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!incident) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
        <Icon name="Search" size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Select an Incident</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Choose an incident to perform root cause analysis</p>
        {incidents?.length > 0 && (
          <button
            onClick={() => onSelectIncident(incidents?.[0])}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Analyze First Incident
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="Search" size={24} className="text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Root Cause Analysis</h3>
            <p className="text-gray-700 dark:text-gray-300">Systematic investigation to identify primary root causes and vulnerability chains</p>
            <div className="mt-4">
              <button
                onClick={() => performRootCauseAnalysis(incident)}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors text-sm font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Icon name="Search" size={16} />
                    Perform Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {analysis && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Icon name="AlertCircle" size={20} />
              Primary Root Cause
            </h3>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{analysis?.primaryRootCause?.cause}</span>
                <span className="text-sm px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 font-medium">
                  {analysis?.primaryRootCause?.severity}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{analysis?.primaryRootCause?.description}</p>
              <div className="text-xs text-blue-600 dark:text-blue-400">Confidence: {analysis?.primaryRootCause?.confidence}%</div>
            </div>
          </div>

          {analysis?.contributingFactors?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Icon name="List" size={20} />
                Contributing Factors
              </h3>
              <div className="space-y-3">
                {analysis?.contributingFactors?.map((factor, index) => (
                  <div key={index} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{factor?.factor}</span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">{factor?.confidence}% confidence</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{factor?.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis?.vulnerabilityChain?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Icon name="Link" size={20} />
                Vulnerability Chain
              </h3>
              <div className="space-y-3">
                {analysis?.vulnerabilityChain?.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      {index < analysis?.vulnerabilityChain?.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{step?.step}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{step?.vulnerability}</p>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          step?.exploited ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                        }`}>
                          {step?.exploited ? 'Exploited' : 'Not Exploited'}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400">Confidence: {step?.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RootCauseAnalysisPanel;