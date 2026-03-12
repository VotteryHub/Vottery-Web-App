import React, { useState, useEffect } from 'react';
import { BarChart3, Target, Award, TrendingUp } from 'lucide-react';

const LearningEffectivenessPanel = () => {
  const [effectivenessData, setEffectivenessData] = useState({
    overallScore: 0,
    confidenceMetrics: [],
    reliabilityScore: 0,
    improvementAreas: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEffectivenessData();
  }, []);

  const fetchEffectivenessData = async () => {
    try {
      setLoading(true);
      // Simulated data - integrate with actual learning effectiveness service
      setTimeout(() => {
        setEffectivenessData({
          overallScore: 92.4,
          confidenceMetrics: [
            { category: 'Fraud Detection', confidence: 94.2, reliability: 96.8, samples: 5234 },
            { category: 'Dispute Resolution', confidence: 91.7, reliability: 93.5, samples: 3421 },
            { category: 'Appeal Analysis', confidence: 89.3, reliability: 91.2, samples: 1876 },
            { category: 'Threat Prediction', confidence: 93.8, reliability: 95.1, samples: 4567 }
          ],
          reliabilityScore: 94.2,
          improvementAreas: [
            { area: 'Appeal Analysis Accuracy', current: 89.3, target: 92.0, priority: 'High' },
            { area: 'False Positive Reduction', current: 3.2, target: 2.5, priority: 'Medium' },
            { area: 'Response Time Optimization', current: 127, target: 100, priority: 'Low', unit: 'ms' }
          ]
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching effectiveness data:', error);
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
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
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Learning Effectiveness</h2>
            <p className="text-sm text-gray-600">Performance metrics & improvement tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
          <Target className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">{effectivenessData?.overallScore}%</span>
        </div>
      </div>
      {/* Confidence Metrics */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Confidence & Reliability Metrics
        </h3>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 })?.map((_, idx) => (
              <div key={idx} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : (
            effectivenessData?.confidenceMetrics?.map((metric, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{metric?.category}</span>
                  <span className="text-xs text-gray-500">{metric?.samples?.toLocaleString()} samples</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Confidence Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${metric?.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{metric?.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Reliability</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${metric?.reliability}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{metric?.reliability}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Improvement Areas */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Strategic Improvement Areas
        </h3>
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 3 })?.map((_, idx) => (
              <div key={idx} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : (
            effectivenessData?.improvementAreas?.map((area, idx) => (
              <div key={idx} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{area?.area}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(area?.priority)}`}>
                    {area?.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    Current: <span className="font-semibold text-gray-900">{area?.current}{area?.unit || '%'}</span>
                  </span>
                  <span className="text-gray-600">
                    Target: <span className="font-semibold text-gray-900">{area?.target}{area?.unit || '%'}</span>
                  </span>
                  <span className="text-gray-600">
                    Gap: <span className="font-semibold text-orange-600">
                      {Math.abs(area?.target - area?.current)?.toFixed(1)}{area?.unit || '%'}
                    </span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningEffectivenessPanel;