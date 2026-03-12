import React, { useState, useEffect } from 'react';
import { RefreshCw, Cpu, Settings, Activity } from 'lucide-react';

const AutomatedLearningLoopPanel = () => {
  const [learningData, setLearningData] = useState({
    activeLoops: 0,
    refinementStatus: 'active',
    recentAdjustments: [],
    loopMetrics: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearningData();
  }, []);

  const fetchLearningData = async () => {
    try {
      setLoading(true);
      // Simulated data - integrate with actual learning loop service
      setTimeout(() => {
        setLearningData({
          activeLoops: 12,
          refinementStatus: 'active',
          recentAdjustments: [
            {
              id: 1,
              algorithm: 'Fraud Detection Neural Network',
              parameter: 'Learning Rate',
              adjustment: '0.001 → 0.0008',
              reason: 'Convergence optimization',
              impact: 'High',
              timestamp: '3 min ago'
            },
            {
              id: 2,
              algorithm: 'Appeal Classification Model',
              parameter: 'Dropout Rate',
              adjustment: '0.3 → 0.25',
              reason: 'Overfitting prevention',
              impact: 'Medium',
              timestamp: '12 min ago'
            },
            {
              id: 3,
              algorithm: 'Threat Prediction Ensemble',
              parameter: 'Ensemble Weights',
              adjustment: '[0.4, 0.3, 0.3] → [0.45, 0.35, 0.2]',
              reason: 'Performance rebalancing',
              impact: 'High',
              timestamp: '28 min ago'
            },
            {
              id: 4,
              algorithm: 'Dispute Resolution Classifier',
              parameter: 'Regularization',
              adjustment: '0.01 → 0.015',
              reason: 'Generalization improvement',
              impact: 'Low',
              timestamp: '45 min ago'
            }
          ],
          loopMetrics: {
            avgCycleTime: 4.2,
            successRate: 96.8,
            parametersOptimized: 847,
            accuracyGain: 8.3
          }
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching learning data:', error);
      setLoading(false);
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-orange-100 text-orange-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <RefreshCw className="w-5 h-5 text-green-600 animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Automated Learning Loop</h2>
            <p className="text-sm text-gray-600">Continuous model refinement & optimization</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">{learningData?.activeLoops} Active</span>
          </div>
        </div>
      </div>
      {/* Loop Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
          <p className="text-xs font-medium text-gray-600 mb-1">Avg Cycle Time</p>
          {loading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-xl font-bold text-gray-900">{learningData?.loopMetrics?.avgCycleTime}s</p>
          )}
        </div>

        <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
          <p className="text-xs font-medium text-gray-600 mb-1">Success Rate</p>
          {loading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-xl font-bold text-gray-900">{learningData?.loopMetrics?.successRate}%</p>
          )}
        </div>

        <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <p className="text-xs font-medium text-gray-600 mb-1">Parameters Optimized</p>
          {loading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-xl font-bold text-gray-900">{learningData?.loopMetrics?.parametersOptimized}</p>
          )}
        </div>

        <div className="p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-100">
          <p className="text-xs font-medium text-gray-600 mb-1">Accuracy Gain</p>
          {loading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-xl font-bold text-gray-900">+{learningData?.loopMetrics?.accuracyGain}%</p>
          )}
        </div>
      </div>
      {/* Recent Adjustments */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Recent Algorithm Adjustments
        </h3>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 })?.map((_, idx) => (
              <div key={idx} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : (
            learningData?.recentAdjustments?.map((adjustment) => (
              <div
                key={adjustment?.id}
                className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-900">{adjustment?.algorithm}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(adjustment?.impact)}`}>
                      {adjustment?.impact}
                    </span>
                    <span className="text-xs text-gray-500">{adjustment?.timestamp}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500 mb-1">Parameter</p>
                    <p className="font-medium text-gray-900">{adjustment?.parameter}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Adjustment</p>
                    <p className="font-mono text-gray-900">{adjustment?.adjustment}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Reason</p>
                    <p className="text-gray-900">{adjustment?.reason}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomatedLearningLoopPanel;