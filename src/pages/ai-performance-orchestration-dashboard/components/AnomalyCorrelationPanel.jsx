import React from 'react';
import Icon from '../../../components/AppIcon';

const AnomalyCorrelationPanel = ({ analyses, metrics }) => {
  if (!analyses) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <Icon name="Brain" size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No AI Analysis Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Click "Analyze with AI" to generate anomaly correlation insights
        </p>
      </div>
    );
  }

  const { claudeAnalysis, perplexityAnalysis, openaiAnalysis, correlatedAnomalies, consensus } = analyses;

  return (
    <div className="space-y-6">
      {/* Consensus Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="Brain" size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              AI Consensus Analysis
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {consensus?.recommendation}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Confidence:</span>
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {consensus?.confidence}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Agreement:</span>
                <span className={`text-sm font-semibold capitalize ${
                  consensus?.agreementLevel === 'high' ? 'text-green-600 dark:text-green-400' :
                  consensus?.agreementLevel === 'medium'? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {consensus?.agreementLevel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Correlated Anomalies */}
      {correlatedAnomalies?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} />
            Correlated Anomalies Detected
          </h3>
          <div className="space-y-3">
            {correlatedAnomalies?.map((anomaly, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  anomaly?.severity === 'high' ? 'bg-red-100 dark:bg-red-900/40' :
                  anomaly?.severity === 'medium'? 'bg-yellow-100 dark:bg-yellow-900/40' : 'bg-blue-100 dark:bg-blue-900/40'
                }`}>
                  <Icon name="AlertCircle" size={18} className={`${
                    anomaly?.severity === 'high' ? 'text-red-600 dark:text-red-400' :
                    anomaly?.severity === 'medium'? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                      {anomaly?.type?.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      anomaly?.severity === 'high' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' :
                      anomaly?.severity === 'medium'? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                    }`}>
                      {anomaly?.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {anomaly?.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-500">Detected by:</span>
                    {anomaly?.sources?.map((source) => (
                      <span key={source} className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 rounded">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual AI Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claude Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
              <Icon name="Brain" size={20} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Claude Analysis</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Anthropic Claude Sonnet</p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {claudeAnalysis?.confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${claudeAnalysis?.confidence}%` }}
              />
            </div>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-6">
            {claudeAnalysis?.analysis}
          </div>
        </div>

        {/* Perplexity Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Icon name="Search" size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Perplexity Analysis</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sonar Reasoning Pro</p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {perplexityAnalysis?.confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${perplexityAnalysis?.confidence}%` }}
              />
            </div>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-6">
            {perplexityAnalysis?.analysis}
          </div>
        </div>

        {/* OpenAI Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <Icon name="Sparkles" size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">OpenAI Analysis</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">GPT-4o</p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {openaiAnalysis?.confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${openaiAnalysis?.confidence}%` }}
              />
            </div>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-6">
            {openaiAnalysis?.analysis}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyCorrelationPanel;
