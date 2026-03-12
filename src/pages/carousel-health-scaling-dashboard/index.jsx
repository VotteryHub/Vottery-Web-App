import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import carouselHealthScalingService from '../../services/carouselHealthScalingService';
import { Activity, Server, Zap, TrendingUp, AlertTriangle, CheckCircle, Cpu, HardDrive, Clock, BarChart3, Lightbulb } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function CarouselHealthScalingDashboard() {
  const [loading, setLoading] = useState(false);
  const [capacityMetrics, setCapacityMetrics] = useState(null);
  const [autoScalingTriggers, setAutoScalingTriggers] = useState([]);
  const [infrastructureOptimization, setInfrastructureOptimization] = useState([]);
  const [loadBalancing, setLoadBalancing] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('capacity');
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    loadAllMetrics();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadAllMetrics();
    }, 30000);

    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadAllMetrics = async () => {
    setLoading(true);
    try {
      const [
        capacityResult,
        scalingResult,
        optimizationResult,
        balancingResult,
        performanceResult
      ] = await Promise.all([
        carouselHealthScalingService?.getSystemCapacityMetrics(),
        carouselHealthScalingService?.monitorAutoScalingTriggers(),
        carouselHealthScalingService?.getInfrastructureOptimization(),
        carouselHealthScalingService?.trackLoadBalancing(),
        carouselHealthScalingService?.getPerformanceMetrics('24h')
      ]);

      if (capacityResult?.data) setCapacityMetrics(capacityResult?.data);
      if (scalingResult?.data) setAutoScalingTriggers(scalingResult?.data);
      if (optimizationResult?.data) setInfrastructureOptimization(optimizationResult?.data);
      if (balancingResult?.data) setLoadBalancing(balancingResult?.data);
      if (performanceResult?.data) setPerformanceMetrics(performanceResult?.data);
    } catch (err) {
      toast?.error('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': case'Excellent':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Normal': case'Good':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Warning': case'Fair':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Critical': case'Poor':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Helmet>
        <title>Carousel Health & Scaling Dashboard | Vottery</title>
      </Helmet>
      <Toaster position="top-right" />
      <HeaderNavigation />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Carousel Health & Scaling Dashboard
              </h1>
              <p className="text-gray-600">
                Real-time system capacity, auto-scaling triggers, and infrastructure optimization monitoring
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Activity className="w-4 h-4 animate-pulse text-green-600" />
                Auto-refresh: 30s
              </div>
              <button
                onClick={loadAllMetrics}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    Refresh Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6 border border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('capacity')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'capacity' ?'bg-blue-600 text-white' :'text-gray-700 hover:bg-gray-100'
              }`}
            >
              System Capacity
            </button>
            <button
              onClick={() => setActiveTab('scaling')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'scaling' ?'bg-blue-600 text-white' :'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Auto-Scaling
            </button>
            <button
              onClick={() => setActiveTab('optimization')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'optimization' ?'bg-blue-600 text-white' :'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Infrastructure
            </button>
            <button
              onClick={() => setActiveTab('balancing')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'balancing' ?'bg-blue-600 text-white' :'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Load Balancing
            </button>
          </div>
        </div>

        {/* System Capacity Tab */}
        {activeTab === 'capacity' && capacityMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(capacityMetrics)?.map(([type, metrics]) => (
              <div key={type} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 capitalize">{type} Carousel</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(metrics?.status)}`}>
                    {metrics?.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Utilization Rate</span>
                      <span className="text-lg font-bold text-gray-900">{metrics?.utilizationRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          parseFloat(metrics?.utilizationRate) > 85 ? 'bg-red-600' :
                          parseFloat(metrics?.utilizationRate) > 70 ? 'bg-yellow-600': 'bg-green-600'
                        }`}
                        style={{ width: `${metrics?.utilizationRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Current Load</div>
                      <div className="text-lg font-bold text-gray-900">{metrics?.currentLoad}</div>
                      <div className="text-xs text-gray-500">req/s</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Max Capacity</div>
                      <div className="text-lg font-bold text-gray-900">{metrics?.maxCapacity}</div>
                      <div className="text-xs text-gray-500">req/s</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-xs text-blue-700 font-medium mb-1">Available Capacity</div>
                    <div className="text-2xl font-bold text-blue-900">{metrics?.availableCapacity}</div>
                    <div className="text-xs text-blue-700">requests per second</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 font-medium mb-1">Recommended Action</div>
                    <div className="text-sm text-gray-900">{metrics?.recommendedAction}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auto-Scaling Tab */}
        {activeTab === 'scaling' && autoScalingTriggers?.length > 0 && (
          <div className="space-y-6">
            {autoScalingTriggers?.map((trigger, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Server className="w-6 h-6 text-blue-600" />
                    <h3 className="text-2xl font-semibold text-gray-900 capitalize">{trigger?.carouselType} Carousel</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(trigger?.status)}`}>
                      {trigger?.status}
                    </span>
                    {trigger?.autoScaleTriggered && (
                      <span className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-200 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Auto-Scale Triggered
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Response Time</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{trigger?.metrics?.responseTime}ms</div>
                    <div className={`text-xs mt-1 ${
                      parseFloat(trigger?.metrics?.responseTime) > trigger?.thresholds?.responseTime?.critical ? 'text-red-600' :
                      parseFloat(trigger?.metrics?.responseTime) > trigger?.thresholds?.responseTime?.warning ? 'text-yellow-600': 'text-green-600'
                    }`}>
                      Threshold: {trigger?.thresholds?.responseTime?.warning}ms
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Error Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{trigger?.metrics?.errorRate}%</div>
                    <div className={`text-xs mt-1 ${
                      parseFloat(trigger?.metrics?.errorRate) > trigger?.thresholds?.errorRate?.critical ? 'text-red-600' :
                      parseFloat(trigger?.metrics?.errorRate) > trigger?.thresholds?.errorRate?.warning ? 'text-yellow-600': 'text-green-600'
                    }`}>
                      Threshold: {trigger?.thresholds?.errorRate?.warning}%
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Throughput</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{trigger?.metrics?.throughput}</div>
                    <div className="text-xs text-gray-500 mt-1">req/s</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">CPU Usage</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{trigger?.metrics?.cpuUsage}%</div>
                    <div className={`text-xs mt-1 ${
                      parseFloat(trigger?.metrics?.cpuUsage) > trigger?.thresholds?.cpuUsage?.critical ? 'text-red-600' :
                      parseFloat(trigger?.metrics?.cpuUsage) > trigger?.thresholds?.cpuUsage?.warning ? 'text-yellow-600': 'text-green-600'
                    }`}>
                      Threshold: {trigger?.thresholds?.cpuUsage?.warning}%
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <HardDrive className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Memory Usage</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{trigger?.metrics?.memoryUsage}%</div>
                    <div className={`text-xs mt-1 ${
                      parseFloat(trigger?.metrics?.memoryUsage) > trigger?.thresholds?.memoryUsage?.critical ? 'text-red-600' :
                      parseFloat(trigger?.metrics?.memoryUsage) > trigger?.thresholds?.memoryUsage?.warning ? 'text-yellow-600': 'text-green-600'
                    }`}>
                      Threshold: {trigger?.thresholds?.memoryUsage?.warning}%
                    </div>
                  </div>
                </div>

                {/* Scaling Recommendation */}
                <div className={`rounded-lg p-4 border ${
                  trigger?.autoScaleTriggered ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className={`w-5 h-5 ${trigger?.autoScaleTriggered ? 'text-red-600' : 'text-blue-600'}`} />
                    <span className={`text-sm font-medium ${trigger?.autoScaleTriggered ? 'text-red-900' : 'text-blue-900'}`}>
                      Scaling Recommendation
                    </span>
                  </div>
                  <div className={`text-sm ${trigger?.autoScaleTriggered ? 'text-red-800' : 'text-blue-800'}`}>
                    {trigger?.scalingRecommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Infrastructure Optimization Tab */}
        {activeTab === 'optimization' && infrastructureOptimization?.length > 0 && (
          <div className="space-y-6">
            {infrastructureOptimization?.map((optimization, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 capitalize">{optimization?.carouselType} Carousel</h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(optimization?.priority)}`}>
                    {optimization?.priority} Priority
                  </span>
                </div>

                {/* Current Performance */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Avg Response Time</div>
                    <div className="text-2xl font-bold text-gray-900">{optimization?.currentPerformance?.avgResponseTime}ms</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">P95 Response Time</div>
                    <div className="text-2xl font-bold text-gray-900">{optimization?.currentPerformance?.p95ResponseTime}ms</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Error Rate</div>
                    <div className="text-2xl font-bold text-gray-900">{optimization?.currentPerformance?.errorRate}%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Throughput</div>
                    <div className="text-2xl font-bold text-gray-900">{optimization?.currentPerformance?.throughput}</div>
                  </div>
                </div>

                {/* Bottlenecks */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-900">Identified Bottlenecks</span>
                  </div>
                  <ul className="space-y-2">
                    {optimization?.bottlenecks?.map((bottleneck, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-yellow-800">
                        <span className="text-yellow-600 mt-1">•</span>
                        <span>{bottleneck}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Optimization Recommendations</span>
                  </div>
                  <ul className="space-y-2">
                    {optimization?.recommendations?.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Estimated Impact */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Estimated Impact</span>
                  </div>
                  <div className="text-sm text-green-800">{optimization?.estimatedImpact}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load Balancing Tab */}
        {activeTab === 'balancing' && loadBalancing && (
          <>
            {/* Overview Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg p-8 mb-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Load Balancing Overview</h2>
                  <p className="text-purple-100">Distribution across carousel types</p>
                </div>
                <Activity className="w-12 h-12 text-purple-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-purple-200 text-sm mb-2">Total Requests</div>
                  <div className="text-4xl font-bold mb-2">{loadBalancing?.totalRequests?.toLocaleString()}</div>
                  <div className="text-sm text-purple-100">Last hour</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-purple-200 text-sm mb-2">Balance Score</div>
                  <div className="text-4xl font-bold mb-2">{loadBalancing?.balanceScore}</div>
                  <div className="text-sm text-purple-100">{loadBalancing?.balanceStatus}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-purple-200 text-sm mb-2">Active Carousels</div>
                  <div className="text-4xl font-bold mb-2">{loadBalancing?.carouselLoads?.length}</div>
                  <div className="text-sm text-purple-100">Types monitored</div>
                </div>
              </div>
            </div>

            {/* Carousel Loads */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {loadBalancing?.carouselLoads?.map((load, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 capitalize">{load?.carouselType}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(load?.balanceStatus)}`}>
                      {load?.balanceStatus}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500 mb-1">Request Count</div>
                      <div className="text-3xl font-bold text-gray-900">{load?.requestCount?.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">{load?.requestsPerMinute} req/min</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Avg Response</div>
                        <div className="text-lg font-bold text-gray-900">{load?.avgResponseTime}ms</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Error Rate</div>
                        <div className="text-lg font-bold text-gray-900">{load?.errorRate}%</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-2">Load Distribution</div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-purple-600 h-3 rounded-full transition-all"
                          style={{ width: `${load?.loadDistribution}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{load?.loadDistribution}% of total</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 font-medium mb-1">Errors</div>
                      <div className="text-sm text-gray-900">{load?.errorCount} errors</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Load Balancing Recommendations</h2>
              </div>
              <ul className="space-y-3">
                {loadBalancing?.recommendations?.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CarouselHealthScalingDashboard;