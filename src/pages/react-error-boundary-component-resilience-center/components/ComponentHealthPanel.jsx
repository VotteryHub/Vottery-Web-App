import React from 'react';
import { Activity, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const ComponentHealthPanel = ({ componentHealth }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Component Health Monitoring
        </h3>
        <p className="text-neutral-600 mb-6">
          Real-time component performance metrics and failure prediction
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-700 font-medium">Healthy</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-700">{componentHealth?.healthyComponents}</p>
          <p className="text-sm text-neutral-600 mt-1">Components operating normally</p>
        </div>

        <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-700 font-medium">Warning</span>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-700">{componentHealth?.warningComponents}</p>
          <p className="text-sm text-neutral-600 mt-1">Components with degraded performance</p>
        </div>

        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-700 font-medium">Critical</span>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-700">{componentHealth?.criticalComponents}</p>
          <p className="text-sm text-neutral-600 mt-1">Components requiring immediate attention</p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg border border-neutral-200">
        <h4 className="font-semibold text-neutral-800 mb-4">Performance Metrics</h4>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Failure Rate</span>
              <span className="text-sm font-medium text-neutral-800">{componentHealth?.failureRate}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${componentHealth?.failureRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Recovery Rate</span>
              <span className="text-sm font-medium text-neutral-800">{componentHealth?.recoveryRate}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${componentHealth?.recoveryRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h4 className="font-semibold text-neutral-800">Automated Recovery Workflows</h4>
        </div>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Automatic component isolation on failure
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Graceful degradation with fallback UI
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Comprehensive error logging and reporting
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Predictive failure detection using ML algorithms
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ComponentHealthPanel;