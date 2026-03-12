import React, { useState } from 'react';
import { TrendingUp, AlertCircle, Activity, Target } from 'lucide-react';

const PredictiveFailurePanel = () => {
  const [predictions] = useState([
    {
      id: 1,
      component: 'Primary WebSocket',
      risk: 'low',
      probability: 12,
      indicator: 'Latency trending up',
      action: 'Monitor',
      eta: '6h'
    },
    {
      id: 2,
      component: 'Database Connection Pool',
      risk: 'medium',
      probability: 45,
      indicator: 'Connection saturation',
      action: 'Scale up recommended',
      eta: '2h'
    },
    {
      id: 3,
      component: 'Message Queue',
      risk: 'low',
      probability: 8,
      indicator: 'Normal operation',
      action: 'No action required',
      eta: 'N/A'
    }
  ]);

  const [healthScores] = useState([
    { component: 'WebSocket Infrastructure', score: 98, trend: 'stable' },
    { component: 'Conflict Resolution', score: 96, trend: 'improving' },
    { component: 'Failover System', score: 99, trend: 'stable' },
    { component: 'AI Synchronization', score: 97, trend: 'stable' }
  ]);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Predictive Failure Detection</h2>
            <p className="text-sm text-gray-600">AI-powered anomaly detection with proactive health monitoring</p>
          </div>
        </div>
      </div>

      {/* Health Scores */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          System Health Scores
        </h3>
        <div className="space-y-3">
          {healthScores?.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">{item?.component}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    item?.trend === 'improving' ?'bg-green-100 text-green-700' :'bg-blue-100 text-blue-700'
                  }`}>
                    {item?.trend}
                  </span>
                  <span className="font-semibold text-gray-900">{item?.score}/100</span>
                </div>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                  style={{ width: `${item?.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Failure Predictions */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-600" />
          Failure Predictions
        </h3>
        <div className="space-y-3">
          {predictions?.map((prediction) => {
            const riskColor = getRiskColor(prediction?.risk);
            return (
              <div
                key={prediction?.id}
                className={`p-4 bg-${riskColor}-50 rounded-lg border border-${riskColor}-200`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className={`w-4 h-4 text-${riskColor}-600`} />
                      <span className="font-semibold text-gray-900">{prediction?.component}</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-2">{prediction?.indicator}</div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Recommended Action:</span> {prediction?.action}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium bg-${riskColor}-100 text-${riskColor}-700`}>
                      {prediction?.risk?.toUpperCase()} RISK
                    </span>
                    <span className="text-xs text-gray-600">ETA: {prediction?.eta}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Failure Probability</span>
                    <span className="font-medium text-gray-900">{prediction?.probability}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`bg-${riskColor}-500 h-full transition-all duration-500`}
                      style={{ width: `${prediction?.probability}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anomaly Detection Status */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Anomaly Detection Status</h3>
            <span className="text-xs font-medium text-green-600">ACTIVE</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-600">Patterns Analyzed</div>
              <div className="font-semibold text-gray-900">24,567</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Anomalies Detected</div>
              <div className="font-semibold text-orange-600">3</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">False Positives</div>
              <div className="font-semibold text-gray-900">0.2%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveFailurePanel;