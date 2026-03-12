import React, { useState } from 'react';
import { FileText, Calendar, Send, CheckCircle } from 'lucide-react';

const ComplianceReportingPanel = () => {
  const [reports] = useState([
    { id: 1, type: 'Regulatory Submission', jurisdiction: 'US-Federal', schedule: 'Monthly', nextSend: '2 days', status: 'scheduled' },
    { id: 2, type: 'Audit Trail', jurisdiction: 'EU-GDPR', schedule: 'Weekly', nextSend: '1 day', status: 'scheduled' },
    { id: 3, type: 'Compliance Alert', jurisdiction: 'Multi-Jurisdiction', schedule: 'Real-time', nextSend: 'Active', status: 'active' },
    { id: 4, type: 'Financial Report', jurisdiction: 'US-State', schedule: 'Quarterly', nextSend: '45 days', status: 'scheduled' }
  ]);

  const [recentSubmissions] = useState([
    { id: 1, type: 'Monthly Compliance', sent: '2h ago', recipients: 12, status: 'delivered' },
    { id: 2, type: 'Audit Trail Report', sent: '5h ago', recipients: 8, status: 'delivered' },
    { id: 3, type: 'Regulatory Update', sent: '1d ago', recipients: 15, status: 'delivered' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Compliance Reporting Automation</h2>
            <p className="text-sm text-gray-600">Scheduled regulatory submissions and audit trails</p>
          </div>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Scheduled Reports
        </h3>
        <div className="space-y-2">
          {reports?.map((report) => (
            <div
              key={report?.id}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">{report?.type}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {report?.jurisdiction} • {report?.schedule}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{report?.nextSend}</div>
                  <div className="text-xs text-gray-600">Next Send</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  report?.status === 'active' ?'bg-green-100 text-green-700' :'bg-blue-100 text-blue-700'
                }`}>
                  {report?.status?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Send className="w-4 h-4 text-green-600" />
          Recent Submissions
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentSubmissions?.map((submission) => (
            <div
              key={submission?.id}
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="flex items-center gap-2 flex-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{submission?.type}</div>
                  <div className="text-xs text-gray-600">
                    {submission?.recipients} recipients • {submission?.sent}
                  </div>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                DELIVERED
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-xs text-gray-600">Active Schedules</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">847</div>
            <div className="text-xs text-gray-600">Sent This Month</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-xs text-gray-600">On-Time Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceReportingPanel;