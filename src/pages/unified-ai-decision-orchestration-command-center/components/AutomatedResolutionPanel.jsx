import React from 'react';
import Icon from '../../../components/AppIcon';

const AutomatedResolutionPanel = ({ selectedIncident, aiAnalyses }) => {
  if (!selectedIncident) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Select an incident to view automated resolution</p>
      </div>
    );
  }

  const hasAnalysis = aiAnalyses?.claude || aiAnalyses?.perplexity || aiAnalyses?.openai;

  const resolutionSteps = [
    {
      id: 1,
      title: 'Dispute Resolution Chain',
      description: 'Multi-AI analysis of dispute context and evidence',
      status: hasAnalysis ? 'completed' : 'pending',
      duration: '2.3s',
    },
    {
      id: 2,
      title: 'Evidence Analysis Sequence',
      description: 'Cross-reference evidence across all AI models',
      status: hasAnalysis ? 'in_progress' : 'pending',
      duration: '1.8s',
    },
    {
      id: 3,
      title: 'Policy Enforcement',
      description: 'Apply platform policies based on AI recommendations',
      status: 'pending',
      duration: '0.5s',
    },
    {
      id: 4,
      title: 'Stakeholder Notification',
      description: 'Multi-channel alerts to affected parties',
      status: 'pending',
      duration: '1.2s',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Real-Time Multi-Step Workflow */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="GitBranch" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Real-Time Multi-Step Workflow Execution
          </h3>
        </div>

        <div className="space-y-4">
          {resolutionSteps?.map((step, index) => (
            <div key={step?.id} className="relative">
              {index < resolutionSteps?.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
              )}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${
                  step?.status === 'completed'
                    ? 'bg-green-100 dark:bg-green-900/20'
                    : step?.status === 'in_progress' ?'bg-blue-100 dark:bg-blue-900/20' :'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Icon
                    name={
                      step?.status === 'completed'
                        ? 'CheckCircle2'
                        : step?.status === 'in_progress' ?'Loader' :'Circle'
                    }
                    size={24}
                    className={`${
                      step?.status === 'completed'
                        ? 'text-green-600 dark:text-green-400'
                        : step?.status === 'in_progress' ?'text-blue-600 dark:text-blue-400 animate-spin' :'text-gray-400 dark:text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{step?.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{step?.duration}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step?.description}</p>
                  {step?.status === 'in_progress' && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Tracking Across All AI Models */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Activity" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Progress Tracking Across All AI Models
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon name="Brain" size={20} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Claude Analysis</span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                aiAnalyses?.claude
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {aiAnalyses?.claude ? 'Completed' : 'Pending'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: aiAnalyses?.claude ? '100%' : '0%' }}
              />
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon name="Zap" size={20} className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Perplexity Analysis</span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                aiAnalyses?.perplexity
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {aiAnalyses?.perplexity ? 'Completed' : 'Pending'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: aiAnalyses?.perplexity ? '100%' : '0%' }}
              />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon name="Sparkles" size={20} className="text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">OpenAI Analysis</span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                aiAnalyses?.openai
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {aiAnalyses?.openai ? 'Completed' : 'Pending'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: aiAnalyses?.openai ? '100%' : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Sliders" size={24} className="text-primary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Custom AI Weighting
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Adjust the influence of each AI model based on your preferences and historical performance.
          </p>
          <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
            Configure Weights
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="TrendingUp" size={24} className="text-primary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ML Optimization
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Machine learning continuously improves decision-making based on approval patterns.
          </p>
          <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
            View Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomatedResolutionPanel;