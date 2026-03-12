import React, { useState } from 'react';
import { GitBranch, Filter, Code, CheckCircle } from 'lucide-react';

const ConditionalRoutingPanel = () => {
  const [routingRules] = useState([
    {
      id: 1,
      name: 'High-Value Transaction Routing',
      condition: 'payload.amount > 1000',
      destination: 'Financial Review Service',
      priority: 'high',
      status: 'active',
      matchRate: 12
    },
    {
      id: 2,
      name: 'Fraud Alert Distribution',
      condition: 'payload.risk_score > 75',
      destination: 'Security Operations',
      priority: 'critical',
      status: 'active',
      matchRate: 8
    },
    {
      id: 3,
      name: 'User Activity Segmentation',
      condition: 'payload.event_type === "vote_cast"',
      destination: 'Analytics Pipeline',
      priority: 'medium',
      status: 'active',
      matchRate: 45
    },
    {
      id: 4,
      name: 'Compliance Event Routing',
      condition: 'payload.jurisdiction !== "US"',
      destination: 'International Compliance',
      priority: 'high',
      status: 'active',
      matchRate: 23
    }
  ]);

  const [routingStats] = useState({
    totalRoutes: 24,
    activeRoutes: 18,
    avgDecisionTime: 8,
    routingAccuracy: 99.4
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'blue';
      case 'low': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <GitBranch className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Conditional Routing Engine</h2>
            <p className="text-sm text-gray-600">Intelligent event distribution with visual workflow builders</p>
          </div>
        </div>
      </div>

      {/* Routing Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{routingStats?.totalRoutes}</div>
          <div className="text-xs text-gray-600">Total Routes</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{routingStats?.activeRoutes}</div>
          <div className="text-xs text-gray-600">Active Routes</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{routingStats?.avgDecisionTime}ms</div>
          <div className="text-xs text-gray-600">Decision Time</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-teal-50 to-white rounded-lg border border-teal-200">
          <div className="text-2xl font-bold text-teal-600">{routingStats?.routingAccuracy}%</div>
          <div className="text-xs text-gray-600">Accuracy</div>
        </div>
      </div>

      {/* Active Routing Rules */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-600" />
          Active Routing Rules
        </h3>
        <div className="space-y-3">
          {routingRules?.map((rule) => {
            const priorityColor = getPriorityColor(rule?.priority);
            return (
              <div
                key={rule?.id}
                className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-purple-300 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{rule?.name}</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4 text-gray-400" />
                      <code className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {rule?.condition}
                      </code>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Destination:</span> {rule?.destination}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium bg-${priorityColor}-100 text-${priorityColor}-700`}>
                      {rule?.priority?.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-600">{rule?.matchRate}% match</span>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`bg-${priorityColor}-500 h-full transition-all duration-500`}
                    style={{ width: `${rule?.matchRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decision Tree Visualization */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Decision Tree Preview</h3>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block p-3 bg-purple-100 rounded-lg mb-2">
                <GitBranch className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm text-gray-700">Incoming Event</div>
              <div className="my-2 text-gray-400">↓</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-2 bg-white rounded border border-gray-200">
                  <div className="text-xs font-medium text-gray-900">Condition 1</div>
                  <div className="text-xs text-gray-600 mt-1">Route A</div>
                </div>
                <div className="p-2 bg-white rounded border border-gray-200">
                  <div className="text-xs font-medium text-gray-900">Condition 2</div>
                  <div className="text-xs text-gray-600 mt-1">Route B</div>
                </div>
                <div className="p-2 bg-white rounded border border-gray-200">
                  <div className="text-xs font-medium text-gray-900">Default</div>
                  <div className="text-xs text-gray-600 mt-1">Route C</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionalRoutingPanel;