import React, { useState } from 'react';
import { Mail, Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const EmailDashboardPanel = () => {
  const [campaigns] = useState([
    { id: 1, name: 'Compliance Reports', type: 'Regulatory', status: 'active', sent: 2847, rate: 99.2 },
    { id: 2, name: 'Dispute Notifications', type: 'Alert', status: 'active', sent: 1892, rate: 98.5 },
    { id: 3, name: 'ML Feedback Alerts', type: 'System', status: 'active', sent: 3421, rate: 97.8 },
    { id: 4, name: 'Stakeholder Updates', type: 'Communication', status: 'active', sent: 1567, rate: 99.1 },
    { id: 5, name: 'Audit Trail Reports', type: 'Compliance', status: 'scheduled', sent: 0, rate: 0 }
  ]);

  const [apiHealth] = useState({
    status: 'operational',
    uptime: 99.98,
    lastCheck: '30s ago',
    responseTime: '145ms'
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Activity className="w-5 h-5 text-green-600 animate-pulse" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'paused':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Mail className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'paused':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Email Campaign Dashboard</h2>
            <p className="text-sm text-gray-600">Active campaigns and delivery tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">API Healthy</span>
        </div>
      </div>

      {/* Resend API Health */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900">Resend API Integration</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">OPERATIONAL</span>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-3">
          <div>
            <div className="text-sm text-gray-600">Uptime</div>
            <div className="text-lg font-bold text-green-600">{apiHealth?.uptime}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Response Time</div>
            <div className="text-lg font-bold text-blue-600">{apiHealth?.responseTime}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Last Check</div>
            <div className="text-lg font-bold text-gray-900">{apiHealth?.lastCheck}</div>
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {campaigns?.map((campaign) => (
          <div
            key={campaign?.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-3 flex-1">
              {getStatusIcon(campaign?.status)}
              <div className="flex-1">
                <div className="font-medium text-gray-900">{campaign?.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {campaign?.type} • {campaign?.sent?.toLocaleString()} sent
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {campaign?.status === 'active' && (
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">{campaign?.rate}%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign?.status)}`}>
                {campaign?.status?.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-xs text-gray-600">Active Campaigns</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">98.7%</div>
            <div className="text-xs text-gray-600">Avg Delivery</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">12.8k</div>
            <div className="text-xs text-gray-600">Total Sent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDashboardPanel;