import React from 'react';
import { Database, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

const DataConsistencyPanel = ({ syncOverview, screenData }) => {
  if (!syncOverview || !screenData) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Data Consistency Analytics</h2>
        <p className="text-gray-500">Loading consistency data...</p>
      </div>
    );
  }

  const consistencyDistribution = {
    excellent: screenData?.filter(s => s?.consistencyScore >= 95)?.length || 0,
    good: screenData?.filter(s => s?.consistencyScore >= 80 && s?.consistencyScore < 95)?.length || 0,
    fair: screenData?.filter(s => s?.consistencyScore >= 60 && s?.consistencyScore < 80)?.length || 0,
    poor: screenData?.filter(s => s?.consistencyScore < 60)?.length || 0
  };

  const totalScreens = screenData?.length || 1;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Database className="w-6 h-6 text-blue-600" />
          Data Consistency Analytics
        </h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {syncOverview?.averageConsistencyScore}% Avg
        </span>
      </div>

      {/* Consistency Score Gauge */}
      <div className="mb-6">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-blue-600">
                Overall Consistency
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {syncOverview?.averageConsistencyScore}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
            <div
              style={{ width: `${syncOverview?.averageConsistencyScore}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            ></div>
          </div>
        </div>
      </div>

      {/* Distribution */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Consistency Distribution</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">Excellent (≥95%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{consistencyDistribution?.excellent}</span>
              <span className="text-xs text-gray-500">
                ({((consistencyDistribution?.excellent / totalScreens) * 100)?.toFixed(0)}%)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">Good (80-94%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{consistencyDistribution?.good}</span>
              <span className="text-xs text-gray-500">
                ({((consistencyDistribution?.good / totalScreens) * 100)?.toFixed(0)}%)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-700">Fair (60-79%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{consistencyDistribution?.fair}</span>
              <span className="text-xs text-gray-500">
                ({((consistencyDistribution?.fair / totalScreens) * 100)?.toFixed(0)}%)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-gray-700">Poor (&lt;60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{consistencyDistribution?.poor}</span>
              <span className="text-xs text-gray-500">
                ({((consistencyDistribution?.poor / totalScreens) * 100)?.toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Eventual Consistency Monitoring */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Eventual Consistency</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Sync Lag</span>
            <span className="text-sm font-bold text-gray-900">&lt; 3s</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Auto-Correction</span>
            <span className="text-sm font-bold text-green-600">Enabled</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Audit Trail</span>
            <span className="text-sm font-bold text-blue-600">Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataConsistencyPanel;