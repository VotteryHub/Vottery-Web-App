import React, { useState } from 'react';
import { Search, Download, Filter, FileText } from 'lucide-react';

const DeviationInvestigationPanel = () => {
  const [investigationLogs, setInvestigationLogs] = useState([
    {
      id: 1,
      metric: 'Revenue Forecast',
      predicted: 38500,
      actual: 45230,
      deviation: 17.5,
      rootCause: 'Unexpected surge in premium subscriptions',
      resolution: 'Model updated with new subscription patterns',
      investigator: 'AI Analysis Engine',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 2,
      metric: 'User Engagement',
      predicted: 10450,
      actual: 8920,
      deviation: -14.6,
      rootCause: 'Platform maintenance window reduced active users',
      resolution: 'Maintenance events added to prediction model',
      investigator: 'System Administrator',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 3,
      metric: 'Fraud Detection Rate',
      predicted: 2.8,
      actual: 3.5,
      deviation: 25.0,
      rootCause: 'New fraud pattern emerged from coordinated attacks',
      resolution: 'Fraud detection algorithm enhanced',
      investigator: 'Security Team',
      timestamp: new Date()?.toISOString()
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Search className="w-6 h-6 mr-2 text-blue-600" />
          Deviation Investigation Tools
        </h2>
        <p className="text-gray-600 mb-6">Comprehensive investigation workflows, evidence collection, and prediction accuracy analysis for continuous forecasting optimization</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search investigation logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>

        <div className="space-y-4">
          {investigationLogs?.map((log) => (
            <div key={log?.id} className="border-2 border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{log?.metric}</h3>
                  <p className="text-sm text-gray-600">Deviation: {log?.deviation > 0 ? '+' : ''}{log?.deviation}%</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  Math.abs(log?.deviation) >= 20 ? 'bg-red-100 text-red-800' :
                  Math.abs(log?.deviation) >= 15 ? 'bg-orange-100 text-orange-800': 'bg-yellow-100 text-yellow-800'
                }`}>
                  {Math.abs(log?.deviation) >= 20 ? 'Critical' : Math.abs(log?.deviation) >= 15 ? 'High' : 'Medium'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Predicted Value</p>
                  <p className="text-xl font-bold text-blue-600">{log?.predicted?.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Actual Value</p>
                  <p className="text-xl font-bold text-green-600">{log?.actual?.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Root Cause Analysis</p>
                  <p className="text-sm text-gray-700">{log?.rootCause}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Resolution</p>
                  <p className="text-sm text-gray-700">{log?.resolution}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Investigator: <span className="font-semibold">{log?.investigator}</span></p>
                  <p className="text-xs text-gray-600">Date: {new Date(log.timestamp)?.toLocaleString()}</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                  View Full Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Total Investigations</h3>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">127</p>
          <p className="text-sm text-gray-600">All-time investigations</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Resolved Cases</h3>
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">115</p>
          <p className="text-sm text-gray-600">90.6% resolution rate</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Cases</h3>
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">12</p>
          <p className="text-sm text-gray-600">Currently under review</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Accuracy Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Accuracy improvement (30 days)</span>
              <span className="text-blue-600 font-semibold">+4.2%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">Model updates applied</span>
              <span className="text-green-600 font-semibold">23</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-900">Pattern recognition enhancements</span>
              <span className="text-purple-600 font-semibold">15</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-900">False positive reduction</span>
              <span className="text-orange-600 font-semibold">-2.8%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-gray-900">Critical deviations prevented</span>
              <span className="text-red-600 font-semibold">47</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">Continuous optimization cycles</span>
              <span className="text-gray-900 font-semibold">Daily</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviationInvestigationPanel;