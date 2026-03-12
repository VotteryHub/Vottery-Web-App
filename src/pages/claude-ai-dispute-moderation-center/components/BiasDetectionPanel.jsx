import React from 'react';
import Icon from '../../../components/AppIcon';

function BiasDetectionPanel({ disputes }) {
  const biasMetrics = {
    overallBiasScore: 8,
    demographicFairness: 94,
    decisionConsistency: 91,
    appealSuccessRate: 23,
    flaggedCases: 2,
  };

  const biasAnalysis = [
    {
      category: 'Demographic Bias',
      score: 94,
      status: 'excellent',
      findings: 'No significant demographic bias detected across age, gender, or location',
      recommendations: 'Continue monitoring quarterly',
    },
    {
      category: 'Decision Consistency',
      score: 91,
      status: 'good',
      findings: 'High consistency in similar case outcomes with minor variations',
      recommendations: 'Review edge cases for pattern refinement',
    },
    {
      category: 'Temporal Bias',
      score: 88,
      status: 'good',
      findings: 'Slight variation in decision patterns during high-volume periods',
      recommendations: 'Implement load balancing for peak times',
    },
    {
      category: 'Evidence Weighting',
      score: 85,
      status: 'acceptable',
      findings: 'Some inconsistency in evidence evaluation across dispute types',
      recommendations: 'Standardize evidence scoring methodology',
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'acceptable': return 'text-yellow-600';
      case 'concerning': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Shield" size={24} className="text-purple-600" />
          Bias Detection Monitoring
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Continuous monitoring for systematic bias, fairness assessments, and decision consistency analysis
        </p>

        {/* Overall Bias Score */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 mb-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Overall Bias Score</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lower scores indicate better fairness (0-100 scale)</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-1">{biasMetrics?.overallBiasScore}</div>
              <div className="text-sm font-semibold text-green-700 dark:text-green-300">EXCELLENT</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{biasMetrics?.demographicFairness}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Demographic Fairness</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{biasMetrics?.decisionConsistency}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Decision Consistency</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{biasMetrics?.appealSuccessRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Appeal Success Rate</div>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{biasMetrics?.flaggedCases}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Flagged Cases</div>
          </div>
        </div>

        {/* Bias Analysis Categories */}
        <div className="space-y-4">
          {biasAnalysis?.map((analysis, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{analysis?.category}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(analysis?.score)}`}>
                      {analysis?.score}%
                    </span>
                    <span className={`text-sm font-semibold ${getStatusColor(analysis?.status)}`}>
                      {analysis?.status?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <span className="font-semibold">Findings:</span> {analysis?.findings}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Recommendations:</span> {analysis?.recommendations}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-3">
                <div 
                  className={`h-full ${
                    analysis?.score >= 90 ? 'bg-green-500' :
                    analysis?.score >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysis?.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Flagged Cases */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} className="text-yellow-600" />
          Flagged Cases for Review
        </h3>
        <div className="space-y-3">
          <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white mb-1">DSP-2024-089</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Inconsistent evidence weighting detected</p>
              </div>
              <button className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
                Review
              </button>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Flagged: 2 hours ago</div>
          </div>
          <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white mb-1">DSP-2024-076</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Potential temporal bias during peak hours</p>
              </div>
              <button className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
                Review
              </button>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Flagged: 5 hours ago</div>
          </div>
        </div>
      </div>
      {/* Continuous Improvement */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-purple-600" />
          Continuous AI Model Improvement
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Automated bias detection feeds into model training for continuous fairness optimization
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2">
            <Icon name="RefreshCw" size={16} />
            Run Bias Analysis
          </button>
          <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-medium flex items-center gap-2">
            <Icon name="Download" size={16} />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default BiasDetectionPanel;