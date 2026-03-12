import React, { useState, useEffect } from 'react';
import { Webhook, Activity, GitBranch, Zap, Database, TrendingUp } from 'lucide-react';
import ConditionalRoutingPanel from './components/ConditionalRoutingPanel';
import PayloadTransformationPanel from './components/PayloadTransformationPanel';
import CrossSystemCorrelationPanel from './components/CrossSystemCorrelationPanel';
import WorkflowVisualizationPanel from './components/WorkflowVisualizationPanel';
import PerformanceOptimizationPanel from './components/PerformanceOptimizationPanel';
import IntegrationHealthPanel from './components/IntegrationHealthPanel';

const AdvancedWebhookOrchestrationEventCorrelationCenter = () => {
  const [dashboardStats, setDashboardStats] = useState({
    activeWebhooks: 42,
    eventsProcessed: 15847,
    correlationMatches: 3256,
    avgProcessingTime: 145,
    successRate: 98.7,
    activeWorkflows: 18
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate real-time updates
      setDashboardStats(prev => ({
        ...prev,
        eventsProcessed: prev?.eventsProcessed + Math.floor(Math.random() * 10),
        correlationMatches: prev?.correlationMatches + Math.floor(Math.random() * 3),
        avgProcessingTime: Math.max(120, Math.min(180, prev?.avgProcessingTime + Math.floor(Math.random() * 10 - 5)))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Advanced Webhook Orchestration & Event Correlation Center
            </h1>
            <p className="text-gray-600">
              Intelligent Conditional Routing, Real-Time Payload Transformation & Cross-System Event Correlation
            </p>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
            <Activity className="w-5 h-5 text-purple-600 animate-pulse" />
            <span className="text-sm font-medium text-purple-700">
              Live • Updated {lastUpdate?.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Webhook className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">ACTIVE</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.activeWebhooks}</div>
          <div className="text-sm text-gray-600">Active Webhooks</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">TODAY</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.eventsProcessed?.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Events Processed</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <GitBranch className="w-8 h-8 text-teal-600" />
            <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded">MATCHED</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.correlationMatches?.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Correlation Matches</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">AVG</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.avgProcessingTime}ms</div>
          <div className="text-sm text-gray-600">Processing Time</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">RATE</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.successRate}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-8 h-8 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">RUNNING</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.activeWorkflows}</div>
          <div className="text-sm text-gray-600">Active Workflows</div>
        </div>
      </div>

      {/* Main Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ConditionalRoutingPanel />
        <PayloadTransformationPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CrossSystemCorrelationPanel />
        <WorkflowVisualizationPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceOptimizationPanel />
        <IntegrationHealthPanel />
      </div>
    </div>
  );
};

export default AdvancedWebhookOrchestrationEventCorrelationCenter;