import React from 'react';
import Icon from '../../../components/AppIcon';

const MLDecisionEngine = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} />
          ML-Powered Decision Confidence Scoring
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Machine learning algorithms analyze incident patterns to provide confidence scores for automated responses
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Target" size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Model Accuracy</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">94.2%</div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" size={18} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-900 dark:text-green-300">Prediction Rate</span>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">89.7%</div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">Auto-Responses</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">1,247</div>
          </div>
        </div>

        {/* Decision Confidence Examples */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent ML Decisions</h4>
          {[
            { incident: 'Fraud Pattern Detected', confidence: 96, action: 'Account Freeze', status: 'executed' },
            { incident: 'Unusual Login Activity', confidence: 82, action: 'Email Notification', status: 'executed' },
            { incident: 'Payment Anomaly', confidence: 68, action: 'Manual Review', status: 'pending' },
          ]?.map((decision, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{decision?.incident}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  decision?.status === 'executed' ?'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {decision?.status?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">Action: {decision?.action}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        decision?.confidence >= 80 ? 'bg-green-600' : decision?.confidence >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${decision?.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{decision?.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contextual Action Routing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} />
          Contextual Action Routing
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Icon name="Check" size={16} className="text-green-600" />
            <span>Incident classification based on historical patterns</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Icon name="Check" size={16} className="text-green-600" />
            <span>Dynamic routing based on severity and confidence scores</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Icon name="Check" size={16} className="text-green-600" />
            <span>Adaptive learning from response outcomes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Icon name="Check" size={16} className="text-green-600" />
            <span>Real-time model updates with new incident data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLDecisionEngine;