import React, { useState } from 'react';
import { Database, Link, GitMerge, TrendingUp } from 'lucide-react';

const CrossSystemCorrelationPanel = () => {
  const [correlations] = useState([
    {
      id: 1,
      name: 'Vote-to-Payment Correlation',
      systems: ['Supabase', 'Stripe'],
      events: ['vote.cast', 'payment.succeeded'],
      matchRate: 98,
      avgCorrelationTime: 245,
      status: 'active'
    },
    {
      id: 2,
      name: 'Fraud-to-Alert Workflow',
      systems: ['Perplexity AI', 'Resend', 'Slack'],
      events: ['fraud.detected', 'email.sent', 'alert.posted'],
      matchRate: 100,
      avgCorrelationTime: 180,
      status: 'active'
    },
    {
      id: 3,
      name: 'User-Registration-Verification',
      systems: ['Supabase', 'Resend', 'Internal API'],
      events: ['user.created', 'email.verification', 'profile.completed'],
      matchRate: 96,
      avgCorrelationTime: 320,
      status: 'active'
    },
    {
      id: 4,
      name: 'Campaign-Analytics-Sync',
      systems: ['Google Analytics', 'Supabase', 'Datadog'],
      events: ['campaign.viewed', 'analytics.tracked', 'metric.logged'],
      matchRate: 94,
      avgCorrelationTime: 150,
      status: 'active'
    }
  ]);

  const [correlationStats] = useState({
    totalCorrelations: 3256,
    activeWorkflows: 12,
    avgMatchTime: 198,
    successRate: 97.2
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 rounded-lg">
            <GitMerge className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cross-System Event Correlation</h2>
            <p className="text-sm text-gray-600">Automated event matching with dependency tracking & audit trails</p>
          </div>
        </div>
      </div>
      {/* Correlation Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-teal-50 to-white rounded-lg border border-teal-200">
          <div className="text-2xl font-bold text-teal-600">{correlationStats?.totalCorrelations?.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Total Today</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{correlationStats?.activeWorkflows}</div>
          <div className="text-xs text-gray-600">Active Workflows</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{correlationStats?.avgMatchTime}ms</div>
          <div className="text-xs text-gray-600">Avg Match Time</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{correlationStats?.successRate}%</div>
          <div className="text-xs text-gray-600">Success Rate</div>
        </div>
      </div>
      {/* Active Correlations */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Link className="w-4 h-4 text-teal-600" />
          Active Correlation Workflows
        </h3>
        <div className="space-y-3">
          {correlations?.map((correlation) => (
            <div
              key={correlation?.id}
              className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-teal-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{correlation?.name}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                      {correlation?.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {correlation?.systems?.map((system, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {system}
                        </span>
                        {idx < correlation?.systems?.length - 1 && (
                          <span className="text-gray-400">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Events:</span> {correlation?.events?.join(' → ')}
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-semibold text-teal-600">{correlation?.matchRate}%</div>
                  <div className="text-xs text-gray-600">match rate</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs">
                  <span className="text-gray-600">Avg Correlation Time:</span>
                  <span className="ml-1 font-medium text-gray-900">{correlation?.avgCorrelationTime}ms</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-600">Systems:</span>
                  <span className="ml-1 font-medium text-gray-900">{correlation?.systems?.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Correlation Flow Visualization */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-teal-600" />
          Correlation Flow Example
        </h3>
        <div className="p-4 bg-gradient-to-br from-teal-50 to-white rounded-lg border border-teal-200">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="inline-block p-2 bg-blue-100 rounded mb-1">
                <Database className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xs font-medium text-gray-900">Supabase</div>
              <div className="text-xs text-gray-600">vote.cast</div>
            </div>
            <div className="flex-shrink-0 mx-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-center flex-1">
              <div className="inline-block p-2 bg-purple-100 rounded mb-1">
                <Database className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xs font-medium text-gray-900">Stripe</div>
              <div className="text-xs text-gray-600">payment.succeeded</div>
            </div>
            <div className="flex-shrink-0 mx-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-center flex-1">
              <div className="inline-block p-2 bg-green-100 rounded mb-1">
                <Database className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-xs font-medium text-gray-900">Analytics</div>
              <div className="text-xs text-gray-600">event.tracked</div>
            </div>
          </div>
          <div className="mt-3 text-center text-xs text-gray-600">
            <span className="font-medium">Correlation ID:</span> corr_1234567890 • <span className="font-medium">Match Time:</span> 245ms
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossSystemCorrelationPanel;