import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ConcurrentUserSimulation from './components/ConcurrentUserSimulation';
import EndpointStressTesting from './components/EndpointStressTesting';
import BottleneckIdentification from './components/BottleneckIdentification';
import SLAValidationDashboard from './components/SLAValidationDashboard';
import PerformanceProfiling from './components/PerformanceProfiling';
import { apiPerformanceService } from '../../services/apiPerformanceService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import PerScreenMetrics from './components/PerScreenMetrics';
import PerformancePlaybooksPanel from './components/PerformancePlaybooksPanel';

const LoadTestingPerformanceAnalyticsCenter = () => {
  const [activeTab, setActiveTab] = useState('simulation');
  const [testingData, setTestingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState(null);

  useEffect(() => {
    loadTestingData();
  }, []);

  useEffect(() => {
    analytics?.trackEvent('load_testing_viewed', {
      active_tab: activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab]);

  const loadTestingData = async () => {
    try {
      setLoading(true);

      const performanceData = await apiPerformanceService?.monitorAPIPerformance('24h');
      const pd = performanceData?.data;
      const metrics = pd?.metrics;
      const totalReq = pd?.totalRequests ?? 0;
      const avgMs = metrics?.avgResponseTime != null ? parseFloat(metrics.avgResponseTime) : null;
      const latencySec = avgMs != null ? avgMs / 1000 : 1.87;

      const defaultEndpoints = [
        { name: '/api/elections', avgResponseTime: 145, p95: 287, p99: 456, throughput: 1200, errorRate: 0.01, status: 'healthy' },
        { name: '/api/votes', avgResponseTime: 98, p95: 178, p99: 234, throughput: 2340, errorRate: 0.0, status: 'healthy' },
        { name: '/api/users', avgResponseTime: 156, p95: 298, p99: 412, throughput: 890, errorRate: 0.01, status: 'healthy' },
        { name: '/api/payments', avgResponseTime: 342, p95: 678, p99: 1234, throughput: 450, errorRate: 0.05, status: 'warning' },
        { name: '/api/analytics', avgResponseTime: 234, p95: 456, p99: 678, throughput: 670, errorRate: 0.02, status: 'healthy' }
      ];

      const realEndpoints =
        totalReq > 0 && avgMs != null
          ? [
              {
                name: 'api_request_logs (24h aggregate)',
                avgResponseTime: Math.round(avgMs),
                p95: Math.round(parseFloat(metrics?.p95ResponseTime) || avgMs),
                p99: Math.round(parseFloat(metrics?.p99ResponseTime) || avgMs * 1.2),
                throughput: Math.round(totalReq),
                errorRate: (parseFloat(metrics?.errorRate) || 0) / 100,
                status: parseFloat(metrics?.errorRate) > 5 ? 'warning' : 'healthy'
              }
            ]
          : null;

      const realBottlenecks =
        pd?.bottlenecks?.length > 0
          ? pd.bottlenecks.map((b, i) => ({
              endpoint: b.endpoint,
              severity: b.severity,
              issue: Array.isArray(b.issues) ? b.issues.join(', ') : 'Elevated latency or errors',
              recommendation: 'Review caching, indexes, and upstream dependencies',
              impact: b.severity === 'critical' || b.severity === 'high' ? 'high' : 'medium',
              id: i
            }))
          : null;

      // Aggregate load testing data (live api_request_logs when available)
      const loadTestData = {
        activeTests: totalReq > 0 ? 1 : 2,
        completedTests: totalReq > 0 ? totalReq : 45,
        slaCompliance: {
          uptime: 99.97,
          latency: latencySec,
          uptimeTarget: 99.9,
          latencyTarget: 2.0,
          uptimeStatus: 'passing',
          latencyStatus: latencySec <= 2 ? 'passing' : 'warning'
        },
        concurrentUsers: {
          current: totalReq > 0 ? Math.min(5000, totalReq) : 342,
          peak: totalReq > 0 ? Math.min(10000, totalReq) : 1250,
          target: 5000,
          utilizationRate: totalReq > 0 ? Math.min(100, (totalReq / 5000) * 100) : 6.8
        },
        endpoints: realEndpoints || defaultEndpoints,
        bottlenecks:
          realBottlenecks || [
            {
              endpoint: '/api/payments',
              severity: 'high',
              issue: 'High P95 response time',
              recommendation: 'Optimize payment gateway integration',
              impact: 'high'
            },
            {
              endpoint: '/api/elections',
              severity: 'medium',
              issue: 'Database query optimization needed',
              recommendation: 'Add composite index',
              impact: 'medium'
            }
          ],
        performanceProfile: {
          cpuUsage: 68,
          memoryUsage: 72,
          databaseConnections: 85,
          networkLatency: Math.round(avgMs || 45),
          diskIO: 54
        },
        testHistory: [
          { id: 1, name: 'Peak Load Test', date: new Date(Date.now() - 86400000), users: 5000, duration: 3600, status: 'passed', slaCompliance: 98.5 },
          { id: 2, name: 'Stress Test', date: new Date(Date.now() - 172800000), users: 10000, duration: 1800, status: 'failed', slaCompliance: 87.3 },
          { id: 3, name: 'Endurance Test', date: new Date(Date.now() - 259200000), users: 2000, duration: 7200, status: 'passed', slaCompliance: 99.2 }
        ],
        _ingest: { totalRequests: totalReq, analyzedAt: pd?.analyzedAt }
      };

      setTestingData(loadTestData);
    } catch (error) {
      console.error('Error loading testing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startLoadTest = (config) => {
    setActiveTest({
      ...config,
      startTime: new Date(),
      status: 'running'
    });
    analytics?.trackEvent('load_test_started', {
      users: config?.users,
      duration: config?.duration,
      endpoints: config?.endpoints?.length
    });
  };

  const tabs = [
    { id: 'simulation', label: 'User Simulation', icon: 'Users' },
    { id: 'stress', label: 'Stress Testing', icon: 'Zap' },
    { id: 'bottleneck', label: 'Bottleneck ID', icon: 'AlertTriangle' },
    { id: 'profiling', label: 'Performance Profiling', icon: 'Activity' },
    { id: 'sla', label: 'SLA Validation', icon: 'CheckCircle' },
    { id: 'per_screen', label: 'Per-Screen Metrics', icon: 'Monitor' },
  ];

  return (
    <>
      <Helmet>
        <title>Load Testing & Performance Analytics Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Load Testing & Performance Analytics Center
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive performance profiling with SLA validation for 99.9% uptime and &lt;2s latency
                </p>
              </div>
              <div className="flex items-center gap-3">
                {testingData?.slaCompliance && (
                  <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        testingData?.slaCompliance?.uptimeStatus === 'passing' ? 'bg-green-500' : 'bg-red-500'
                      } animate-pulse`} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Uptime: {testingData?.slaCompliance?.uptime}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        testingData?.slaCompliance?.latencyStatus === 'passing' ? 'bg-green-500' : 'bg-red-500'
                      } animate-pulse`} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Latency: {testingData?.slaCompliance?.latency}s
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => startLoadTest({ users: 1000, duration: 300, endpoints: ['/api/elections'] })}
                  className="flex items-center gap-2"
                >
                  <Icon name="Play" size={16} />
                  Start Test
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader" size={32} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'simulation' && <ConcurrentUserSimulation data={testingData} activeTest={activeTest} onStartTest={startLoadTest} />}
              {activeTab === 'stress' && <EndpointStressTesting endpoints={testingData?.endpoints} />}
              {activeTab === 'bottleneck' && <BottleneckIdentification bottlenecks={testingData?.bottlenecks} endpoints={testingData?.endpoints} />}
              {activeTab === 'sla' && <SLAValidationDashboard slaData={testingData?.slaCompliance} testHistory={testingData?.testHistory} />}
              {activeTab === 'profiling' && <PerformanceProfiling profile={testingData?.performanceProfile} />}
              {activeTab === 'per_screen' && <PerScreenMetrics />}
              {activeTab === 'playbooks' && <PerformancePlaybooksPanel />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LoadTestingPerformanceAnalyticsCenter;