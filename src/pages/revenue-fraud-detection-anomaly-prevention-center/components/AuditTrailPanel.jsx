import React, { useState } from 'react';
import { FileText, Download, Search, Filter } from 'lucide-react';

const AuditTrailPanel = () => {
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      timestamp: new Date()?.toISOString(),
      eventType: 'payout_manipulation_detected',
      severity: 'critical',
      creatorId: 'CR-10234',
      details: 'Payout deviation of 68% detected and blocked',
      action: 'account_frozen',
      investigator: 'System'
    },
    {
      id: 2,
      timestamp: new Date()?.toISOString(),
      eventType: 'override_abuse_flagged',
      severity: 'high',
      creatorId: 'CR-10456',
      details: '12 override modifications in 24 hours',
      action: 'escalated_to_admin',
      investigator: 'ML Algorithm'
    },
    {
      id: 3,
      timestamp: new Date()?.toISOString(),
      eventType: 'campaign_manipulation',
      severity: 'medium',
      creatorId: 'Multiple',
      details: 'Coordinated campaign split manipulation detected',
      action: 'monitoring_enabled',
      investigator: 'Correlation Engine'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-blue-600" />
          Comprehensive Audit Trail
        </h2>
        <p className="text-gray-600 mb-6">Complete investigation history with evidence collection and regulatory compliance documentation</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e?.target?.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Event Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Severity</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Creator ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Details</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Investigator</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs?.map((log) => (
                <tr key={log?.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(log.timestamp)?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-900">
                      {log?.eventType?.replace(/_/g, ' ')?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      log?.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      log?.severity === 'high'? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log?.severity?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{log?.creatorId}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{log?.details}</td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-blue-600">
                      {log?.action?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{log?.investigator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Evidence Collection</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Evidence Items</span>
              <span className="font-semibold text-gray-900">1,247</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Active Investigations</span>
              <span className="font-semibold text-gray-900">23</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Closed Cases</span>
              <span className="font-semibold text-gray-900">189</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Regulatory Compliance</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Compliance Reports</span>
              <span className="font-semibold text-gray-900">45</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Audit Requests</span>
              <span className="font-semibold text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Documentation Status</span>
              <span className="font-semibold text-green-600">Complete</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Investigation Tools</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
              Generate Report
            </button>
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-semibold hover:bg-gray-700">
              Export Evidence
            </button>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">
              Compliance Check
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrailPanel;