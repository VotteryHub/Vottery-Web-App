import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { unifiedIncidentResponseService } from '../../../services/unifiedIncidentResponseService';

const DualAIIntegrationPanel = ({ selectedIncident }) => {
  const [perplexityAnalysis, setPerplexityAnalysis] = useState(null);
  const [claudeAnalysis, setClaudeAnalysis] = useState(null);
  const [loading, setLoading] = useState({ perplexity: false, claude: false });

  const analyzeWithPerplexity = async () => {
    if (!selectedIncident) return;
    setLoading({ ...loading, perplexity: true });
    try {
      const result = await unifiedIncidentResponseService?.analyzeIncidentWithPerplexity(selectedIncident);
      setPerplexityAnalysis(result);
    } catch (error) {
      console.error('Perplexity analysis error:', error);
    } finally {
      setLoading({ ...loading, perplexity: false });
    }
  };

  const analyzeWithClaude = async () => {
    if (!selectedIncident) return;
    setLoading({ ...loading, claude: true });
    try {
      const result = await unifiedIncidentResponseService?.analyzeIncidentWithClaude(selectedIncident);
      setClaudeAnalysis(result);
    } catch (error) {
      console.error('Claude analysis error:', error);
    } finally {
      setLoading({ ...loading, claude: false });
    }
  };

  if (!selectedIncident) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Select an incident to analyze with AI</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Perplexity Extended Reasoning */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Perplexity Threat Analysis
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Extended Reasoning Engine</p>
            </div>
          </div>
          <button
            onClick={analyzeWithPerplexity}
            disabled={loading?.perplexity}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
          >
            {loading?.perplexity ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Analyzing...
              </>
            ) : (
              <>
                <Icon name="Play" size={16} />
                Analyze
              </>
            )}
          </button>
        </div>

        {perplexityAnalysis ? (
          <div className="space-y-4">
            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">
                Threat Intelligence Analysis
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {perplexityAnalysis?.analysis}
              </p>
            </div>
            {perplexityAnalysis?.searchResults?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Related Intelligence Sources
                </h4>
                <div className="space-y-2">
                  {perplexityAnalysis?.searchResults?.slice(0, 3)?.map((result, idx) => (
                    <a
                      key={idx}
                      href={result?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {result?.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result?.url}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="Brain" size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click Analyze to get threat intelligence from Perplexity
            </p>
          </div>
        )}
      </div>

      {/* Claude Decision Reasoning */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Icon name="GitBranch" size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Claude Decision Reasoning
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Nuanced Policy Analysis</p>
            </div>
          </div>
          <button
            onClick={analyzeWithClaude}
            disabled={loading?.claude}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
          >
            {loading?.claude ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Analyzing...
              </>
            ) : (
              <>
                <Icon name="Play" size={16} />
                Analyze
              </>
            )}
          </button>
        </div>

        {claudeAnalysis ? (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Decision Analysis & Reasoning
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {claudeAnalysis?.analysis}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="Scale" size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click Analyze to get decision reasoning from Claude
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DualAIIntegrationPanel;