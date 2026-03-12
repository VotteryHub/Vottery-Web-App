import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

const GoogleAnalyticsIntegrationPanel = ({ errorMetrics }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Google Analytics Integration
        </h3>
        <p className="text-neutral-600 mb-6">
          Error event tracking, user impact analysis, and production stability monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg border border-neutral-200">
          <h4 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Error Event Tracking
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
              <span className="text-sm text-neutral-700">Total Errors Tracked</span>
              <span className="font-semibold text-neutral-800">{errorMetrics?.totalErrors}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
              <span className="text-sm text-neutral-700">Resolved Errors</span>
              <span className="font-semibold text-green-600">{errorMetrics?.resolvedErrors}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
              <span className="text-sm text-neutral-700">Active Errors</span>
              <span className="font-semibold text-orange-600">{errorMetrics?.activeErrors}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-neutral-200">
          <h4 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            User Impact Metrics
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
              <span className="text-sm text-neutral-700">Impact Level</span>
              <span className={`font-semibold ${
                errorMetrics?.userImpact === 'Low' ? 'text-green-600' :
                errorMetrics?.userImpact === 'Medium' ? 'text-orange-600' : 'text-red-600'
              }`}>
                {errorMetrics?.userImpact}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
              <span className="text-sm text-neutral-700">Avg Recovery Time</span>
              <span className="font-semibold text-neutral-800">{errorMetrics?.avgRecoveryTime}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
              <span className="text-sm text-neutral-700">Affected Users</span>
              <span className="font-semibold text-neutral-800">127</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-neutral-800 mb-4">Tracked Events</h4>
        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span><strong>component_error</strong> - Component failure events with error details</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span><strong>user_impact</strong> - User experience degradation metrics</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span><strong>performance_regression</strong> - Performance degradation tracking</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span><strong>error_recovery</strong> - Successful error recovery events</span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg border border-neutral-200">
        <h4 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Performance Regression Monitoring
        </h4>
        <p className="text-sm text-neutral-600 mb-4">
          Continuous monitoring of platform stability metrics to detect performance regressions in production
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-neutral-50 rounded">
            <p className="text-xs text-neutral-600 mb-1">Load Time</p>
            <p className="text-lg font-semibold text-neutral-800">1.2s</p>
            <p className="text-xs text-green-600">↓ 15% improvement</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded">
            <p className="text-xs text-neutral-600 mb-1">Error Rate</p>
            <p className="text-lg font-semibold text-neutral-800">0.02%</p>
            <p className="text-xs text-green-600">↓ 45% reduction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsIntegrationPanel;