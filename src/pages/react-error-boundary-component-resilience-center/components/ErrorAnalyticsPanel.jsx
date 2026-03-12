import React from 'react';
import { BarChart3, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

const ErrorAnalyticsPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Error Analytics
        </h3>
        <p className="text-neutral-600 mb-6">
          Comprehensive error analytics for continuous platform stability improvement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600 text-sm font-medium">Error Frequency</span>
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-neutral-800">23</p>
          <p className="text-xs text-green-600 mt-1">↓ 35% from last week</p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600 text-sm font-medium">Avg Resolution Time</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-neutral-800">1.2s</p>
          <p className="text-xs text-blue-600 mt-1">↑ 20% faster</p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600 text-sm font-medium">Success Rate</span>
            <AlertCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-neutral-800">97.9%</p>
          <p className="text-xs text-green-600 mt-1">↑ 2.1% improvement</p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg border border-neutral-200">
        <h4 className="font-semibold text-neutral-800 mb-4">Top Error Categories</h4>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-neutral-700">Network Errors</span>
              <span className="text-sm font-medium text-neutral-800">8</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '35%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-neutral-700">State Management</span>
              <span className="text-sm font-medium text-neutral-800">6</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '26%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-neutral-700">Rendering Issues</span>
              <span className="text-sm font-medium text-neutral-800">5</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '22%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-neutral-700">API Errors</span>
              <span className="text-sm font-medium text-neutral-800">4</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '17%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorAnalyticsPanel;