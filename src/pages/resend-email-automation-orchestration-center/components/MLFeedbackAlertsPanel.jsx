import React, { useState } from 'react';
import { Brain, TrendingUp, Target, Zap } from 'lucide-react';

const MLFeedbackAlertsPanel = () => {
  const [alerts] = useState([
    { id: 1, type: 'Model Performance', model: 'Fraud Detection v2.4', metric: 'Accuracy improved to 98.7%', confidence: 95, sent: '10m ago' },
    { id: 2, type: 'Training Complete', model: 'Content Safety v1.8', metric: 'Training completed successfully', confidence: 92, sent: '1h ago' },
    { id: 3, type: 'Accuracy Alert', model: 'Recommendation Engine', metric: 'Confidence score trending up', confidence: 89, sent: '2h ago' },
    { id: 4, type: 'Model Update', model: 'Sentiment Analysis v3.1', metric: 'New version deployed', confidence: 97, sent: '3h ago' }
  ]);

  const [feedbackMetrics] = useState({
    modelsMonitored: 12,
    alertsSent: 3421,
    avgConfidence: 94.2,
    activeModels: 8
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">ML Feedback Cycle Alerts</h2>
            <p className="text-sm text-gray-600">Automated model performance notifications</p>
          </div>
        </div>
      </div>

      {/* Feedback Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{feedbackMetrics?.modelsMonitored}</div>
          <div className="text-xs text-gray-600">Models Monitored</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{feedbackMetrics?.alertsSent?.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Alerts Sent</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{feedbackMetrics?.avgConfidence}%</div>
          <div className="text-xs text-gray-600">Avg Confidence</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-teal-50 to-white rounded-lg border border-teal-200">
          <div className="text-2xl font-bold text-teal-600">{feedbackMetrics?.activeModels}</div>
          <div className="text-xs text-gray-600">Active Models</div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {alerts?.map((alert) => (
          <div
            key={alert?.id}
            className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-purple-300 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-50 rounded">
                  {alert?.type === 'Model Performance' && <TrendingUp className="w-4 h-4 text-purple-600" />}
                  {alert?.type === 'Training Complete' && <Target className="w-4 h-4 text-green-600" />}
                  {alert?.type === 'Accuracy Alert' && <Zap className="w-4 h-4 text-yellow-600" />}
                  {alert?.type === 'Model Update' && <Brain className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{alert?.type}</div>
                  <div className="text-xs text-gray-600">{alert?.model}</div>
                </div>
              </div>
              <span className="text-xs text-gray-500">{alert?.sent}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">{alert?.metric}</div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-purple-600">{alert?.confidence}%</div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${alert?.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div>
            <div className="font-medium text-gray-900">Automated ML Monitoring</div>
            <div className="text-xs text-gray-600 mt-1">Continuous performance tracking with trend analysis</div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default MLFeedbackAlertsPanel;