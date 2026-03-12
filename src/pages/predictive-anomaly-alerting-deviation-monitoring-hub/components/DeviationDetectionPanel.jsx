import React, { useState } from 'react';
import { TrendingUp, AlertCircle, Target, Activity } from 'lucide-react';

const DeviationDetectionPanel = () => {
  const [deviationData, setDeviationData] = useState([
    {
      id: 1,
      metric: 'Revenue Forecasts',
      totalPredictions: 342,
      deviationsDetected: 47,
      avgDeviation: 12.3,
      criticalAlerts: 8,
      status: 'monitoring'
    },
    {
      id: 2,
      metric: 'User Engagement Predictions',
      totalPredictions: 478,
      deviationsDetected: 62,
      avgDeviation: 9.7,
      criticalAlerts: 5,
      status: 'active'
    },
    {
      id: 3,
      metric: 'Fraud Pattern Projections',
      totalPredictions: 215,
      deviationsDetected: 28,
      avgDeviation: 15.8,
      criticalAlerts: 12,
      status: 'critical'
    },
    {
      id: 4,
      metric: 'Campaign Performance Estimates',
      totalPredictions: 212,
      deviationsDetected: 35,
      avgDeviation: 11.2,
      criticalAlerts: 6,
      status: 'monitoring'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'active': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
          Deviation Detection Engine
        </h2>
        <p className="text-gray-600 mb-6">Monitoring revenue forecasts, user engagement predictions, fraud pattern projections, and campaign performance estimates with statistical significance testing</p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Predictions</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Deviations Detected</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Deviation</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Critical Alerts</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {deviationData?.map((item) => (
                <tr key={item?.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900">{item?.metric}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-900">{item?.totalPredictions}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-orange-600">{item?.deviationsDetected}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${
                      item?.avgDeviation >= 15 ? 'text-red-600' : item?.avgDeviation >= 10 ? 'text-orange-600' : 'text-yellow-600'
                    }`}>
                      {item?.avgDeviation}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-red-600">{item?.criticalAlerts}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 border-2 rounded-full text-xs font-semibold uppercase ${getStatusColor(item?.status)}`}>
                      {item?.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Statistical Significance Testing
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">P-value threshold</span>
              <span className="text-blue-600 font-semibold">0.05</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Confidence level</span>
              <span className="text-blue-600 font-semibold">95%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Sample size</span>
              <span className="text-blue-600 font-semibold">1,247</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">Statistical validity</span>
              <span className="text-green-600 font-semibold">Confirmed</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
            Anomaly Classification
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-gray-900">Critical (&gt;20% deviation)</span>
              <span className="text-red-600 font-semibold">23</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-900">High (15-20% deviation)</span>
              <span className="text-orange-600 font-semibold">47</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-900">Medium (10-15% deviation)</span>
              <span className="text-yellow-600 font-semibold">82</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">Low (&lt;10% deviation)</span>
              <span className="text-gray-600 font-semibold">1,095</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-green-600" />
          Real-time Deviation Monitoring
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Active Monitors</p>
            <p className="text-2xl font-bold text-gray-900">4</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Checks per Hour</p>
            <p className="text-2xl font-bold text-gray-900">60</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Response Time</p>
            <p className="text-2xl font-bold text-gray-900">&lt; 1s</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Uptime</p>
            <p className="text-2xl font-bold text-gray-900">99.9%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviationDetectionPanel;