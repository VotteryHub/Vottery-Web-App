import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, DollarSign, Zap, Activity, Clock, Shield, FileText } from 'lucide-react';
import geminiMonitoringAgentService from '../../services/geminiMonitoringAgentService';
import { supabase } from '../../lib/supabase';

const AIServicePerformanceAnalyticsAlertCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [serviceMetrics, setServiceMetrics] = useState([]);
  const [caseReports, setCaseReports] = useState([]);
  const [monitoringStats, setMonitoringStats] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh every 30 seconds
    let refreshInterval;
    if (autoRefresh) {
      refreshInterval = setInterval(() => {
        loadDashboardData();
      }, 30000);
    }

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [autoRefresh]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load service metrics
      const { data: metrics } = await supabase?.from('ai_service_performance_metrics')?.select('*')?.gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString())?.order('created_at', { ascending: false });

      // Group by service
      const groupedMetrics = {};
      metrics?.forEach(metric => {
        if (!groupedMetrics?.[metric?.service_name]) {
          groupedMetrics[metric.service_name] = [];
        }
        groupedMetrics?.[metric?.service_name]?.push(metric);
      });

      const serviceData = Object.keys(groupedMetrics)?.map(serviceName => {
        const serviceMetrics = groupedMetrics?.[serviceName];
        const avgResponseTime = serviceMetrics?.reduce((sum, m) => sum + (m?.response_time || 0), 0) / serviceMetrics?.length;
        const errorRate = serviceMetrics?.filter(m => m?.status === 'error')?.length / serviceMetrics?.length;
        const avgCost = serviceMetrics?.reduce((sum, m) => sum + (m?.cost || 0), 0) / serviceMetrics?.length;
        const avgAccuracy = serviceMetrics?.reduce((sum, m) => sum + (m?.accuracy || 0), 0) / serviceMetrics?.length;

        return {
          name: serviceName,
          avgResponseTime,
          errorRate,
          avgCost,
          avgAccuracy,
          totalRequests: serviceMetrics?.length,
          status: errorRate > 0.05 ? 'degraded' : avgResponseTime > 5000 ? 'warning' : 'healthy'
        };
      });

      setServiceMetrics(serviceData);

      // Load case reports
      const reports = await geminiMonitoringAgentService?.getCaseReports({ limit: 20 });
      setCaseReports(reports);

      // Load monitoring stats
      const stats = await geminiMonitoringAgentService?.getMonitoringStats('24h');
      setMonitoringStats(stats);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveTakeover = async (reportId) => {
    try {
      const adminNotes = prompt('Enter approval notes (optional):');
      await geminiMonitoringAgentService?.approveTakeover(reportId, adminNotes || '');
      alert('✅ Gemini takeover approved successfully!');
      loadDashboardData();
    } catch (error) {
      console.error('Error approving takeover:', error);
      alert('Failed to approve takeover');
    }
  };

  const handleRejectTakeover = async (reportId) => {
    try {
      const adminNotes = prompt('Enter rejection reason:');
      if (!adminNotes) return;
      
      await geminiMonitoringAgentService?.rejectTakeover(reportId, adminNotes);
      alert('❌ Gemini takeover rejected');
      loadDashboardData();
    } catch (error) {
      console.error('Error rejecting takeover:', error);
      alert('Failed to reject takeover');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'degraded': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'degraded': return <TrendingDown className="w-5 h-5" />;
      case 'critical': return <XCircle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              AI Service Performance Analytics & Alert Center
            </h1>
            <p className="text-gray-600 mt-2">
              Gemini intelligent monitoring agent supervising OpenAI, Anthropic, and Perplexity
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e?.target?.checked)}
                className="rounded"
              />
              Auto-refresh (30s)
            </label>
            <button
              onClick={loadDashboardData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>
      {/* Monitoring Stats */}
      {monitoringStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monitoring Cycles</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{monitoringStats?.totalCycles}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Issues Detected</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{monitoringStats?.totalIssuesDetected}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Services Monitored</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{monitoringStats?.servicesMonitored?.length || 0}</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Issues/Cycle</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{monitoringStats?.averageIssuesPerCycle}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', label: 'Service Overview', icon: Activity },
              { id: 'alerts', label: 'Active Alerts', icon: AlertTriangle },
              { id: 'reports', label: 'Case Reports', icon: FileText },
              { id: 'cost', label: 'Cost Analysis', icon: DollarSign }
            ]?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab?.id
                    ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab?.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* Tab Content */}
      <div className="space-y-6">
        {/* Service Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {serviceMetrics?.map(service => (
              <div key={service?.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold capitalize">{service?.name}</h3>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service?.status)}`}>
                    {getStatusIcon(service?.status)}
                    {service?.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Avg Response Time
                    </span>
                    <span className="font-medium">{service?.avgResponseTime?.toFixed(0)}ms</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Error Rate
                    </span>
                    <span className="font-medium">{(service?.errorRate * 100)?.toFixed(2)}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Avg Cost
                    </span>
                    <span className="font-medium">${service?.avgCost?.toFixed(4)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Accuracy
                    </span>
                    <span className="font-medium">{(service?.avgAccuracy * 100)?.toFixed(1)}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Total Requests
                    </span>
                    <span className="font-medium">{service?.totalRequests}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Case Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Gemini Case Reports</h2>
              <p className="text-sm text-gray-600 mt-1">Review and approve/reject Gemini takeover requests</p>
            </div>

            <div className="divide-y divide-gray-200">
              {caseReports?.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No case reports found. All services are performing optimally!</p>
                </div>
              ) : (
                caseReports?.map(report => (
                  <div key={report?.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold capitalize">{report?.service_name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report?.severity)}`}>
                            {report?.severity}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            report?.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                            report?.status === 'approved'? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {report?.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {report?.case_report?.executive_summary || 'Performance degradation detected'}
                        </p>

                        {report?.case_report?.cost_benefit_analysis && (
                          <div className="bg-blue-50 rounded-lg p-4 mb-3">
                            <h4 className="font-medium text-sm mb-2">💰 Cost-Benefit Analysis</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Current Cost:</p>
                                <p className="font-medium">{report?.case_report?.cost_benefit_analysis?.current_service_cost}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Gemini Cost:</p>
                                <p className="font-medium">{report?.case_report?.cost_benefit_analysis?.gemini_cost}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Potential Savings:</p>
                                <p className="font-medium text-green-600">{report?.case_report?.cost_benefit_analysis?.cost_savings_percentage}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {report?.case_report?.recommendation && (
                          <div className="bg-purple-50 rounded-lg p-4 mb-3">
                            <h4 className="font-medium text-sm mb-2">🤖 Gemini Recommendation</h4>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Action:</strong> {report?.case_report?.recommendation?.action}
                            </p>
                            <p className="text-sm text-gray-600">{report?.case_report?.recommendation?.reasoning}</p>
                          </div>
                        )}

                        {report?.requesting_takeover && report?.case_report?.permission_request && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <h4 className="font-medium text-sm mb-2 text-orange-800">⚠️ Takeover Request</h4>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Justification:</strong> {report?.case_report?.permission_request?.justification}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Rollback Plan:</strong> {report?.case_report?.permission_request?.rollback_plan}
                            </p>
                          </div>
                        )}
                      </div>

                      {report?.status === 'pending_review' && report?.requesting_takeover && (
                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => handleApproveTakeover(report?.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                          >
                            ✅ Approve Takeover
                          </button>
                          <button
                            onClick={() => handleRejectTakeover(report?.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                          >
                            ❌ Reject
                          </button>
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
                          >
                            📄 View Full Report
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Created: {new Date(report.created_at)?.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Active Performance Alerts</h2>
            <div className="space-y-4">
              {serviceMetrics?.filter(s => s?.status !== 'healthy')?.map(service => (
                <div key={service?.name} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold capitalize">{service?.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(service?.status)}`}>
                      {service?.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {service?.status === 'degraded' ? 'High error rate detected' : 'Slow response times detected'}
                  </p>
                </div>
              ))}
              {serviceMetrics?.filter(s => s?.status !== 'healthy')?.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">No active alerts. All services operating normally.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cost Analysis Tab */}
        {activeTab === 'cost' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Cost Efficiency Analysis</h2>
            <div className="space-y-4">
              {serviceMetrics?.map(service => (
                <div key={service?.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold capitalize">{service?.name}</h3>
                    <span className="text-lg font-bold">${(service?.avgCost * service?.totalRequests)?.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Avg Cost/Request</p>
                      <p className="font-medium">${service?.avgCost?.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Requests</p>
                      <p className="font-medium">{service?.totalRequests}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Cost (24h)</p>
                      <p className="font-medium">${(service?.avgCost * service?.totalRequests)?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Full Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Full Case Report</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(selectedReport?.case_report, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIServicePerformanceAnalyticsAlertCenter;