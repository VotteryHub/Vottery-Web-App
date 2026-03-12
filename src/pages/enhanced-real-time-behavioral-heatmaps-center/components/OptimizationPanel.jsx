import React from 'react';
import { Lightbulb } from 'lucide-react';

const OptimizationPanel = () => {
  const recommendations = [
    {
      priority: 'high',
      title: 'Relocate CTA Button',
      impact: '+18% conversion',
      effort: 'Low',
      description: 'Move primary CTA to high-attention zone (top-right quadrant)',
      dataSource: 'Click prediction ML + Heatmap analysis'
    },
    {
      priority: 'high',
      title: 'Optimize Form Layout',
      impact: '+12% completion',
      effort: 'Medium',
      description: 'Reduce form fields from 8 to 5 based on interaction patterns',
      dataSource: 'Micro-interaction tracking'
    },
    {
      priority: 'medium',
      title: 'Adjust Navigation Menu',
      impact: '+8% engagement',
      effort: 'Low',
      description: 'Increase menu item spacing by 20% to reduce mis-clicks',
      dataSource: 'Mouse movement patterns'
    },
    {
      priority: 'medium',
      title: 'Enhance Visual Hierarchy',
      impact: '+15% attention',
      effort: 'Medium',
      description: 'Increase contrast for key elements in low-attention zones',
      dataSource: 'Attention zone analysis'
    },
    {
      priority: 'low',
      title: 'Optimize Load Sequence',
      impact: '+5% retention',
      effort: 'High',
      description: 'Prioritize above-fold content loading based on scroll behavior',
      dataSource: 'Scroll behavior tracking'
    }
  ];

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          label: 'High Priority'
        };
      case 'medium':
        return {
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          label: 'Medium Priority'
        };
      default:
        return {
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          label: 'Low Priority'
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Automated UI/UX Optimization Recommendations
            </h2>
            <p className="text-sm text-gray-600">
              Data-driven suggestions based on interaction analysis
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
          Export Report
        </button>
      </div>
      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations?.map((rec, idx) => {
          const config = getPriorityConfig(rec?.priority);
          return (
            <div
              key={idx}
              className={`p-5 rounded-lg border ${config?.bg} ${config?.border}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Lightbulb className={`w-5 h-5 ${config?.color}`} />
                    <h3 className="font-bold text-gray-900">{rec?.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color} ${config?.bg}`}
                    >
                      {config?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{rec?.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>
                      <strong>Impact:</strong> {rec?.impact}
                    </span>
                    <span>•</span>
                    <span>
                      <strong>Effort:</strong> {rec?.effort}
                    </span>
                    <span>•</span>
                    <span>
                      <strong>Source:</strong> {rec?.dataSource}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-all">
                    Apply
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all">
                    Test
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">5</div>
            <div className="text-xs text-gray-600">Active Recommendations</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">+58%</div>
            <div className="text-xs text-gray-600">Potential Impact</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-xs text-gray-600">Implemented This Month</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">94%</div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationPanel;