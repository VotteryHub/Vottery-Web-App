import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle, TrendingUp, DollarSign, Activity } from 'lucide-react';
import GeminiMonitoringService from '../../services/geminiMonitoringService';

const AIDependencyRiskMitigationCommandCenter = () => {
  const [serviceHealth, setServiceHealth] = useState([]);
  const [caseReports, setCaseReports] = useState([]);
  const [monitoring, setMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [costAnalysis, setCostAnalysis] = useState(null);

  useEffect(() => {
    loadServiceHealth();
    loadCaseReports();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadServiceHealth();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadServiceHealth = async () => {
    try {
      const health = await GeminiMonitoringService?.getServiceHealthStatus();
      setServiceHealth(health);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading service health:', error);
    }
  };

  const loadCaseReports = async () => {
    try {
      const reports = await GeminiMonitoringService?.getCaseReports({ status: 'pending_review' });
      setCaseReports(reports);
    } catch (error) {
      console.error('Error loading case reports:', error);
    }
  };

  const handleMonitorServices = async () => {
    setMonitoring(true);
    try {
      await GeminiMonitoringService?.monitorAIServices();
      await loadServiceHealth();
      await loadCaseReports();
    } catch (error) {
      console.error('Error monitoring services:', error);
    } finally {
      setMonitoring(false);
    }
  };

  const handleGenerateCaseReport = async (service) => {
    try {
      const metrics = await GeminiMonitoringService?.getServiceMetrics(service);
      const analysis = await GeminiMonitoringService?.analyzeServicePerformance(service, metrics);
      await GeminiMonitoringService?.generateCaseReport(service, metrics, analysis);
      await loadCaseReports();
    } catch (error) {
      console.error('Error generating case report:', error);
    }
  };

  const handleViewCostAnalysis = async (serviceName) => {
    try {
      const analysis = await GeminiMonitoringService?.getCostBenefitAnalysis(serviceName);
      setCostAnalysis({ service: serviceName, ...analysis });
      setSelectedService(serviceName);
    } catch (error) {
      console.error('Error loading cost analysis:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5" />;
      case 'degraded': case'critical':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Dependency Risk Mitigation Command Center
          </h1>
          <p className="text-gray-600">
            Comprehensive monitoring and fallback orchestration for OpenAI, Anthropic, and Perplexity services with Gemini as intelligent monitoring agent
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Monitoring Control</h2>
              <p className="text-sm text-gray-600">
                Last updated: {lastUpdate ? lastUpdate?.toLocaleTimeString() : 'Never'}
              </p>
            </div>
            <button
              onClick={handleMonitorServices}
              disabled={monitoring}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${monitoring ? 'animate-spin' : ''}`} />
              {monitoring ? 'Monitoring...' : 'Run Monitoring'}
            </button>
          </div>
        </div>

        {/* Service Status Matrix */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Service Status Matrix</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {serviceHealth?.map((service) => (
              <div key={service?.service} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {service?.service}
                  </h3>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service?.status)}`}>
                    {getStatusIcon(service?.status)}
                    {service?.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-medium text-gray-900">{service?.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Error Rate:</span>
                    <span className="font-medium text-gray-900">{service?.errorRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Check:</span>
                    <span className="font-medium text-gray-900">
                      {service?.lastCheck ? new Date(service.lastCheck)?.toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleGenerateCaseReport(service?.service)}
                    className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
                  >
                    Generate Report
                  </button>
                  <button
                    onClick={() => handleViewCostAnalysis(service?.service)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Cost Analysis
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gemini Monitoring Agent Panel */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-6 mb-6 border border-purple-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Gemini Monitoring Agent</h2>
              <p className="text-gray-700 mb-4">
                Intelligent service efficiency analysis with predictive failure detection and automated performance benchmarking
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Active Monitoring</div>
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Services Tracked</div>
                  <div className="text-2xl font-bold text-purple-600">{serviceHealth?.length}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Pending Reports</div>
                  <div className="text-2xl font-bold text-purple-600">{caseReports?.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Case Reports */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Automated Case Report Generation</h2>
          {caseReports?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No pending case reports</p>
            </div>
          ) : (
            <div className="space-y-4">
              {caseReports?.map((report) => (
                <div key={report?.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {report?.service_name} Performance Issue
                      </h3>
                      <p className="text-sm text-gray-600">
                        Generated: {new Date(report.created_at)?.toLocaleString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      {report?.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <div className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                      {report?.report_content}
                    </div>
                  </div>
                  <button
                    onClick={() => window.location.href = `/gemini-fallback-orchestration-hub?reportId=${report?.id}`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Review & Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cost-Benefit Analysis */}
        {costAnalysis && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Cost-Benefit Analysis: {selectedService} → Gemini
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Monthly Savings</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    ${costAnalysis?.monthlySavings?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Performance Improvement</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    +{costAnalysis?.performanceImprovement || '0'}%
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">ROI Timeline</h3>
                  <p className="text-gray-700">{costAnalysis?.roiTimeline || 'Unknown'}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Risk Assessment</h3>
                  <p className="text-gray-700">{costAnalysis?.riskLevel || 'Unknown'}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Recommendation</h3>
                  <p className="text-gray-700">{costAnalysis?.recommendation || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDependencyRiskMitigationCommandCenter;