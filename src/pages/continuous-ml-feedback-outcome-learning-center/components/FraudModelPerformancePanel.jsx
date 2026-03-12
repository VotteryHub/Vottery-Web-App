import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, Target, Zap } from 'lucide-react';

const FraudModelPerformancePanel = () => {
  const [performanceData, setPerformanceData] = useState({
    detectionAccuracy: 0,
    falsePositiveRate: 0,
    threatPredictionScore: 0,
    optimizationCycles: 0,
    performanceHistory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      // Simulated data - integrate with actual fraud model performance service
      setTimeout(() => {
        setPerformanceData({
          detectionAccuracy: 94.7,
          falsePositiveRate: 3.2,
          threatPredictionScore: 91.8,
          optimizationCycles: 1247,
          performanceHistory: [
            { metric: 'Detection Accuracy', current: 94.7, previous: 92.1, change: 2.6, trend: 'up' },
            { metric: 'False Positive Rate', current: 3.2, previous: 5.8, change: -2.6, trend: 'down' },
            { metric: 'Threat Prediction', current: 91.8, previous: 88.4, change: 3.4, trend: 'up' },
            { metric: 'Response Time', current: 127, previous: 189, change: -62, trend: 'down', unit: 'ms' }
          ]
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Fraud Model Performance</h2>
            <p className="text-sm text-gray-600">Real-time accuracy & optimization tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
          <Zap className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">{performanceData?.optimizationCycles} cycles</span>
        </div>
      </div>
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-gray-600">Detection Accuracy</span>
          </div>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900">{performanceData?.detectionAccuracy}%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">+2.6% improvement</span>
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-600">False Positive Rate</span>
          </div>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900">{performanceData?.falsePositiveRate}%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-blue-600 rotate-180" />
                <span className="text-xs text-blue-600 font-medium">-2.6% reduction</span>
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-gray-600">Threat Prediction</span>
          </div>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900">{performanceData?.threatPredictionScore}%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">+3.4% improvement</span>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Performance History */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Performance Evolution</h3>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 })?.map((_, idx) => (
              <div key={idx} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : (
            performanceData?.performanceHistory?.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{item?.metric}</span>
                  <div className="flex items-center gap-2">
                    {item?.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-blue-500 rotate-180" />
                    )}
                    <span className={`text-sm font-semibold ${
                      item?.trend === 'up' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {item?.change > 0 ? '+' : ''}{item?.change}{item?.unit || '%'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Previous: {item?.previous}{item?.unit || '%'}</span>
                  <span className="text-xs font-medium text-gray-700">Current: {item?.current}{item?.unit || '%'}</span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item?.trend === 'up' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(item?.current / (item?.previous + item?.current)) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FraudModelPerformancePanel;