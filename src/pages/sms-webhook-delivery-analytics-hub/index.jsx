import React, { useState, useEffect } from 'react';
import { telnyxSMSService } from '../../services/telnyxSMSService';
import { smsAlertTemplateService } from '../../services/smsAlertTemplateService';
import { BarChart3, TrendingUp, AlertCircle, Download, Filter, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function SMSWebhookDeliveryAnalyticsHub() {
  const [deliveryLogs, setDeliveryLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [complianceReport, setComplianceReport] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, filterProvider, filterStatus]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [analyticsResult, logsResult, complianceResult] = await Promise.all([
        telnyxSMSService?.getDeliveryAnalytics(timeRange),
        telnyxSMSService?.getDeliveryLogs({
          provider: filterProvider !== 'all' ? filterProvider : undefined,
          status: filterStatus !== 'all' ? filterStatus : undefined,
          limit: 100
        }),
        smsAlertTemplateService?.getComplianceReport(timeRange === '24h' ? '7d' : timeRange)
      ]);

      if (analyticsResult?.data) setAnalytics(analyticsResult?.data);
      if (logsResult?.data) setDeliveryLogs(logsResult?.data);
      if (complianceResult?.data) setComplianceReport(complianceResult?.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast?.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Provider', 'Phone Number', 'Message Type', 'Status'];
    const rows = deliveryLogs?.map(log => [
      new Date(log?.sentAt)?.toLocaleString(),
      log?.provider,
      log?.phoneNumber,
      log?.messageType || 'N/A',
      log?.status
    ]);

    const csvContent = [
      headers?.join(','),
      ...rows?.map(row => row?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sms-delivery-analytics-${new Date()?.toISOString()}.csv`;
    a?.click();
    toast?.success('Analytics exported to CSV');
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'bounced': return 'bg-orange-100 text-orange-800';
      case 'blocked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-8 h-8 animate-pulse mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">SMS Webhook & Delivery Analytics Hub</h1>
        <p className="text-gray-600 mt-2">Comprehensive webhook management for Telnyx delivery receipts, bounce notifications, and automated failover switching</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e?.target?.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Providers</option>
              <option value="telnyx">Telnyx</option>
              <option value="twilio">Twilio</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e?.target?.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="bounced">Bounced</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <button
            onClick={exportToCSV}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Total Messages</h3>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics?.total}</p>
            <p className="text-xs text-gray-500 mt-1">{timeRange === '1h' ? 'Last hour' : timeRange === '24h' ? 'Last 24 hours' : `Last ${timeRange}`}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Failover Events</h3>
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-900">{analytics?.failoverCount}</p>
            <p className="text-xs text-gray-500 mt-1">Automatic provider switches</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Blocked Messages</h3>
              <Filter className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-900">{analytics?.blockedCount}</p>
            <p className="text-xs text-gray-500 mt-1">Gamification filtered</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Overall Success</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">
              {analytics?.total > 0 
                ? (((analytics?.telnyx?.delivered + analytics?.twilio?.delivered) / analytics?.total) * 100)?.toFixed(1)
                : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Delivery success rate</p>
          </div>
        </div>
      )}

      {/* Provider Performance Comparison */}
      {analytics && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Provider Performance Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Telnyx Performance */}
            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Telnyx (Primary)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Sent</span>
                  <span className="text-lg font-bold text-gray-900">{analytics?.telnyx?.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Delivered</span>
                  <span className="text-lg font-bold text-green-600">{analytics?.telnyx?.delivered}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Failed</span>
                  <span className="text-lg font-bold text-red-600">{analytics?.telnyx?.failed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bounced</span>
                  <span className="text-lg font-bold text-orange-600">{analytics?.telnyx?.bounced}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Delivery Rate</span>
                    <span className="text-2xl font-bold text-purple-600">{analytics?.telnyx?.deliveryRate}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Twilio Performance */}
            <div className="border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-900 mb-3">Twilio (Fallback)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Sent</span>
                  <span className="text-lg font-bold text-gray-900">{analytics?.twilio?.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Delivered</span>
                  <span className="text-lg font-bold text-green-600">{analytics?.twilio?.delivered}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Failed</span>
                  <span className="text-lg font-bold text-red-600">{analytics?.twilio?.failed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bounced</span>
                  <span className="text-lg font-bold text-orange-600">{analytics?.twilio?.bounced}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Delivery Rate</span>
                    <span className="text-2xl font-bold text-red-600">{analytics?.twilio?.deliveryRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Report */}
      {complianceReport && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">GDPR/TCPA Compliance Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-semibold">Opted In</p>
              <p className="text-2xl font-bold text-green-900">{complianceReport?.optedIn}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 font-semibold">Opted Out</p>
              <p className="text-2xl font-bold text-red-900">{complianceReport?.optedOut}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-600 font-semibold">Pending Consent</p>
              <p className="text-2xl font-bold text-yellow-900">{complianceReport?.pending}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-semibold">Compliance Rate</p>
              <p className="text-2xl font-bold text-blue-900">{complianceReport?.complianceRate}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Logs Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Delivery Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Provider</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phone Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Message Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deliveryLogs?.length > 0 ? (
                deliveryLogs?.map((log) => (
                  <tr key={log?.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(log?.sentAt)?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded capitalize ${
                        log?.provider === 'telnyx' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log?.provider}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{log?.phoneNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{log?.messageType || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded capitalize ${getStatusBadgeColor(log?.status)}`}>
                        {log?.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {log?.message}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No delivery logs found for selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SMSWebhookDeliveryAnalyticsHub;