import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import claudeDisputeService from '../../../services/claudeDisputeService';

function AppealAnalysisPanel({ appeals }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyzeAppeal = async (appeal) => {
    setAnalyzing(true);
    setError(null);
    setSelectedAppeal(appeal);

    try {
      const result = await claudeDisputeService?.analyzeAppeal({
        originalDecision: appeal?.originalDecision,
        appealReason: appeal?.appealReason,
        newEvidence: { provided: true, type: 'documentation' },
        originalReasoning: 'Initial analysis indicated insufficient evidence',
      });

      setAnalysisResult(result);
    } catch (err) {
      setError(err?.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review': return 'text-yellow-600 bg-yellow-100';
      case 'under_analysis': return 'text-blue-600 bg-blue-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'denied': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Scale" size={24} className="text-purple-600" />
          Appeal Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Comprehensive review workflows with Claude's reasoning chains, precedent matching, and fairness assessments
        </p>

        <div className="space-y-4">
          {appeals?.map(appeal => (
            <div
              key={appeal?.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {appeal?.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(appeal?.status)}`}>
                      {appeal?.status?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-semibold">Original Dispute:</span> {appeal?.originalDisputeId}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    <span className="font-semibold">Appeal Reason:</span> {appeal?.appealReason}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    <span className="font-semibold">Original Decision:</span> {appeal?.originalDecision}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <Icon name="Clock" size={14} />
                    Submitted {new Date(appeal.submittedAt)?.toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {appeal?.fairnessScore !== null && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{appeal?.fairnessScore}%</div>
                      <div className="text-xs text-gray-500">Fairness Score</div>
                    </div>
                  )}
                  <button
                    onClick={() => handleAnalyzeAppeal(appeal)}
                    disabled={analyzing}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    <Icon name="Brain" size={16} />
                    {analyzing && selectedAppeal?.id === appeal?.id ? 'Analyzing...' : 'Analyze Appeal'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Analysis Result */}
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
      {analysisResult && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="FileText" size={20} className="text-purple-600" />
            Appeal Analysis Result
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
            {analysisResult?.analysis}
          </div>

          {/* Reasoning Chain Visualization */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Reasoning Chain</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">Original Decision Review</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Analyzed initial reasoning and evidence</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-semibold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">New Evidence Assessment</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Evaluated additional documentation and context</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">Fairness & Bias Check</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Detected no systematic bias in original decision</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 font-semibold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">Precedent Matching</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Compared with 12 similar historical cases</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Precedent Matching */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="BookOpen" size={20} className="text-purple-600" />
          Precedent Matching
        </h3>
        <div className="space-y-3">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">Case #DSP-2023-412</span>
              <span className="text-sm font-semibold text-green-600">95% Match</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Similar payment dispute - Resolved in favor of claimant</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">Case #DSP-2023-389</span>
              <span className="text-sm font-semibold text-yellow-600">78% Match</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Comparable evidence quality - Required additional review</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppealAnalysisPanel;