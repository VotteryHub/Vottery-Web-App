import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { anthropicSecurityReasoningService } from '../../../services/anthropicSecurityReasoningService';

const ContextualAnalysisPanel = ({ incident, onSelectIncident, incidents }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeIncident = async (inc) => {
    setLoading(true);
    try {
      const { data, error } = await anthropicSecurityReasoningService?.analyzeSecurityIncident(inc);
      if (error) throw error;
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing incident:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!incident) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
        <Icon name="Brain" size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Select an Incident</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Choose an incident from the Active Incidents tab to perform Claude-powered contextual analysis</p>
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
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="Brain" size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Claude Contextual Analysis</h3>
            <p className="text-gray-700 dark:text-gray-300">Advanced contextual analysis of security incidents with confidence-scored findings</p>
            <div className="mt-4">
              <button
                onClick={() => analyzeIncident(incident)}
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
                    <Icon name="Brain" size={16} />
                    Analyze with Claude
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
              <Icon name="Shield" size={20} />
              Threat Assessment
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Severity</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{analysis?.threatAssessment?.severity}</div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confidence</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analysis?.confidenceScore}%</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">{analysis?.threatAssessment?.description}</p>
            </div>
          </div>

          {analysis?.attackVectors?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Icon name="Target" size={20} />
                Attack Vectors
              </h3>
              <div className="space-y-3">
                {analysis?.attackVectors?.map((vector, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{vector?.vector}</span>
                      <span className="text-sm text-blue-600 dark:text-blue-400">{vector?.confidence}% confidence</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{vector?.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis?.reasoningChain?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Icon name="GitBranch" size={20} />
                Reasoning Chain
              </h3>
              <div className="space-y-3">
                {analysis?.reasoningChain?.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      {index < analysis?.reasoningChain?.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{step?.step}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{step?.finding}</p>
                      <div className="text-xs text-blue-600 dark:text-blue-400">Confidence: {step?.confidence}%</div>
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

export default ContextualAnalysisPanel;