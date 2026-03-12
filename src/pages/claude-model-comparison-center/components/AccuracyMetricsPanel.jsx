import React from 'react';
import Icon from '../../../components/AppIcon';

const AccuracyMetricsPanel = ({ history, taskType }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Target" size={20} />
          Accuracy & Quality Metrics
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Response quality analysis for {taskType?.replace('_', ' ')} tasks
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Icon name="Zap" size={16} className="text-blue-600" />
              Claude 3.5 Sonnet
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response Quality</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">94%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Reasoning Depth</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">88%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Contextual Understanding</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">92%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Icon name="Brain" size={16} className="text-purple-600" />
              Claude 3 Opus
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response Quality</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">97%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '97%' }} />
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Reasoning Depth</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">96%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Contextual Understanding</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">95%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Analysis:</strong> Opus shows 3-8% higher accuracy across all metrics, making it ideal for complex reasoning tasks where precision is critical. Sonnet offers excellent performance for speed-sensitive applications.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="CheckCircle" size={20} />
          Task Completion Rates
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Successful Completions</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Last 100 tests</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">98/100</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Sonnet</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">99/100</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Opus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccuracyMetricsPanel;