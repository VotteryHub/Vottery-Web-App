import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import claudeDisputeService from '../../../services/claudeDisputeService';

function ClaudeIntegrationPanel({ disputes, onAnalyze }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedDisputeId, setSelectedDisputeId] = useState('');
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!selectedDisputeId) return;

    const dispute = disputes?.find(d => d?.id === selectedDisputeId);
    if (!dispute) return;

    setAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await claudeDisputeService?.analyzeDispute({
        type: dispute?.type,
        description: dispute?.description,
        evidence: { provided: true, quality: 'high', documents: 3 },
        parties: dispute?.parties,
        amount: dispute?.amount,
      });

      setAnalysisResult(result);
      onAnalyze(dispute);
    } catch (err) {
      setError(err?.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Brain" size={24} className="text-purple-600" />
          Claude AI Integration
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Natural language dispute analysis with contextual reasoning and automated evidence evaluation
        </p>

        {/* Analysis Input */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Analyze Dispute with Claude</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Dispute
              </label>
              <select
                value={selectedDisputeId}
                onChange={(e) => setSelectedDisputeId(e?.target?.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Choose a dispute...</option>
                {disputes?.map(dispute => (
                  <option key={dispute?.id} value={dispute?.id}>
                    {dispute?.id} - {dispute?.type?.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedDisputeId || analyzing}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              {analyzing ? (
                <>
                  <Icon name="Loader" size={20} className="animate-spin" />
                  Analyzing with Claude AI...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={20} />
                  Analyze with Claude Sonnet 4.5
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
                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">Analysis Failed</h4>
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Result */}
        {analysisResult && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="FileText" size={20} className="text-purple-600" />
                Claude AI Analysis Result
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {analysisResult?.analysis}
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{analysisResult?.usage?.input_tokens || 0}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Input Tokens</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{analysisResult?.usage?.output_tokens || 0}</div>
                <div className="text-sm text-green-700 dark:text-green-300">Output Tokens</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{analysisResult?.usage?.total_tokens || 0}</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Total Tokens</div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Multi-Factor Decision Matrix */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Grid" size={20} className="text-purple-600" />
          Multi-Factor Decision Matrix
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Evidence Quality</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Documentation</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Credibility</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">78%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completeness</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">65%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Compliance Factors</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Regulatory</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Policy Adherence</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '88%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">88%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">45%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClaudeIntegrationPanel;