import React, { useState } from 'react';
import { TrendingUp, AlertCircle, CheckCircle, Calculator } from 'lucide-react';

const StatisticalSignificancePanel = ({ experiments = [] }) => {
  const [selectedExperiment, setSelectedExperiment] = useState(experiments?.[0]);

  const statisticalMetrics = {
    confidence: 95.2,
    pValue: 0.048,
    effectSize: 0.34,
    sampleSize: 5420,
    requiredSampleSize: 6000,
    power: 0.82,
    bayesianProbability: 0.94
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 95) return { color: 'text-green-600 dark:text-green-400', label: 'High Confidence' };
    if (confidence >= 90) return { color: 'text-yellow-600 dark:text-yellow-400', label: 'Moderate Confidence' };
    return { color: 'text-red-600 dark:text-red-400', label: 'Low Confidence' };
  };

  const confidenceLevel = getConfidenceLevel(statisticalMetrics?.confidence);

  return (
    <div className="space-y-6">
      {/* Experiment Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Experiment
        </label>
        <select
          value={selectedExperiment?.id}
          onChange={(e) => setSelectedExperiment(experiments?.find(exp => exp?.id === parseInt(e?.target?.value)))}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          {experiments?.map((exp) => (
            <option key={exp?.id} value={exp?.id}>
              {exp?.name}
            </option>
          ))}
        </select>
      </div>
      {/* Statistical Confidence */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Statistical Confidence Analysis
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Confidence Interval */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Confidence Level</h3>
                <span className={`text-2xl font-bold ${confidenceLevel?.color}`}>
                  {statisticalMetrics?.confidence}%
                </span>
              </div>
              <div className="mb-4">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      statisticalMetrics?.confidence >= 95
                        ? 'bg-green-600'
                        : statisticalMetrics?.confidence >= 90
                        ? 'bg-yellow-600' :'bg-red-600'
                    }`}
                    style={{ width: `${statisticalMetrics?.confidence}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {statisticalMetrics?.confidence >= 95 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {confidenceLevel?.label}
                </span>
              </div>
            </div>

            {/* P-Value */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">P-Value</h3>
                <span className={`text-2xl font-bold ${
                  statisticalMetrics?.pValue < 0.05 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {statisticalMetrics?.pValue?.toFixed(3)}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Threshold (α)</span>
                  <span className="font-medium text-gray-900 dark:text-white">0.050</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`font-medium ${
                    statisticalMetrics?.pValue < 0.05 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {statisticalMetrics?.pValue < 0.05 ? 'Significant' : 'Not Significant'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Effect Size (Cohen's d)</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{statisticalMetrics?.effectSize}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Medium effect</div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Statistical Power</div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{(statisticalMetrics?.power * 100)?.toFixed(0)}%</div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Good power</div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="text-sm text-green-600 dark:text-green-400 mb-1">Sample Size</div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{statisticalMetrics?.sampleSize?.toLocaleString()}</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">{((statisticalMetrics?.sampleSize / statisticalMetrics?.requiredSampleSize) * 100)?.toFixed(0)}% of target</div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
              <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">Bayesian Probability</div>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{(statisticalMetrics?.bayesianProbability * 100)?.toFixed(1)}%</div>
              <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">Variant is better</div>
            </div>
          </div>
        </div>
      </div>
      {/* Sample Size Calculator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600" />
            Sample Size Calculator
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Baseline Conversion Rate (%)
              </label>
              <input
                type="number"
                defaultValue="2.5"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Detectable Effect (%)
              </label>
              <input
                type="number"
                defaultValue="10"
                step="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Desired Power
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                <option value="0.8">80% (Standard)</option>
                <option value="0.9">90% (High)</option>
                <option value="0.95">95% (Very High)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Required Sample Size per Variant</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statisticalMetrics?.requiredSampleSize?.toLocaleString()}</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              Estimated time to completion: 12-15 days at current traffic levels
            </p>
          </div>
        </div>
      </div>
      {/* Automated Conclusion Triggers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Automated Conclusion Triggers
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Confidence Threshold</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Auto-declare winner at 95% confidence</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Sample Size Reached</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Conclude test when target sample size is reached</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Bayesian Early Stopping</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Stop early if Bayesian probability exceeds 99%</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticalSignificancePanel;