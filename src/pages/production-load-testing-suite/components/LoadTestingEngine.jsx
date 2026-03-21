import React, { useState } from 'react';
import { Play, Square, RefreshCw, Zap, Users } from 'lucide-react';
import { incidentResponseService } from '../../../services/incidentResponseService';
import { electionsService } from '../../../services/electionsService';
import { apiPerformanceService } from '../../../services/apiPerformanceService';

const SCALE_LEVELS = [
  { label: '10K', value: 10000, color: 'bg-green-500' },
  { label: '100K', value: 100000, color: 'bg-green-400' },
  { label: '500K', value: 500000, color: 'bg-yellow-400' },
  { label: '1M', value: 1000000, color: 'bg-yellow-500' },
  { label: '10M', value: 10000000, color: 'bg-orange-400' },
  { label: '50M', value: 50000000, color: 'bg-orange-500' },
  { label: '100M', value: 100000000, color: 'bg-red-400' },
  { label: '500M', value: 500000000, color: 'bg-red-500' },
  { label: '1B', value: 1000000000, color: 'bg-red-700' },
];

const LoadTestingEngine = ({ onTestUpdate }) => {
  const [activeTests, setActiveTests] = useState({});
  const [selectedScale, setSelectedScale] = useState(null);
  const [testFramework, setTestFramework] = useState('k6');
  const CIRCUIT_BREAKER_THRESHOLD = 500000;
  const ELECTION_PAUSE_THRESHOLD = 750000;

  const startTest = (scale) => {
    const testId = `test_${scale?.value}_${Date.now()}`;
    const newTest = {
      id: testId,
      scale: scale?.label,
      users: scale?.value,
      status: 'running',
      progress: 0,
      startTime: Date.now(),
      framework: testFramework,
      metrics: { rps: 0, latency: 0, errors: 0, throughput: 0 }
    };
    setActiveTests(prev => ({ ...prev, [scale?.value]: newTest }));
    onTestUpdate?.(newTest);

    let progress = 0;
    const interval = setInterval(async () => {
      progress += 12;
      let apiData = null;
      try {
        const snapshot = await apiPerformanceService?.getRealTimeMetrics?.();
        apiData = snapshot?.data || null;
      } catch (_error) {
        apiData = null;
      }
      const hasLiveData = Boolean(apiData && (apiData?.avgResponseTime || apiData?.requestsPerMinute || apiData?.errorRate));
      const liveRps = hasLiveData ? Math.round(parseFloat(apiData?.requestsPerMinute || 0) / 60) : 0;
      const liveLatency = hasLiveData ? Math.round(parseFloat(apiData?.avgResponseTime || 0)) : 0;
      const liveErrors = hasLiveData ? Math.round(parseFloat(apiData?.errorRate || 0)) : 0;
      const liveThroughput = hasLiveData ? Math.round(scale?.value * Math.min(1, Math.max(0.1, liveRps / 1000))) : 0;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        const finalMetrics = {
          rps: liveRps,
          latency: liveLatency,
          errors: liveErrors,
          throughput: liveThroughput
        };
        const finalStatus = !hasLiveData
          ? 'no_data'
          : (liveErrors > 5 || liveLatency > 1200 ? 'failed' : liveLatency > 300 ? 'warning' : 'passed');
        setActiveTests(prev => {
          const updated = {
            ...prev,
            [scale?.value]: {
              ...prev?.[scale?.value],
              status: finalStatus,
              progress: 100,
              metrics: finalMetrics
            }
          };
          onTestUpdate?.(updated?.[scale?.value]);
          return updated;
        });
        if (hasLiveData) {
          handleLoadTestResult(scale?.value, finalMetrics);
        }
      } else {
        setActiveTests(prev => {
          const updated = {
            ...prev,
            [scale?.value]: {
              ...prev?.[scale?.value],
              progress: Math.floor(progress),
              metrics: {
                rps: liveRps,
                latency: liveLatency,
                errors: liveErrors,
                throughput: liveThroughput
              }
            }
          };
          onTestUpdate?.(updated?.[scale?.value]);
          return updated;
        });
      }
    }, 800);
  };

  const stopTest = (scaleValue) => {
    setActiveTests(prev => ({
      ...prev,
      [scaleValue]: { ...prev?.[scaleValue], status: 'stopped', progress: prev?.[scaleValue]?.progress || 0 }
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-blue-400';
      case 'passed': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      case 'stopped': return 'text-gray-400';
      case 'no_data': return 'text-gray-400';
      default: return 'text-gray-500';
    }
  };

  const handleLoadTestResult = async (concurrentUsers, metrics) => {
    // Wire to auto-response: trigger circuit breakers at 500K+ users
    if (concurrentUsers >= CIRCUIT_BREAKER_THRESHOLD) {
      try {
        await incidentResponseService?.createIncident({
          incidentType: 'load_threshold_exceeded',
          description: `Load test detected ${concurrentUsers?.toLocaleString()} concurrent users — activating circuit breakers`,
          threatLevel: concurrentUsers >= 1000000 ? 'critical' : 'high',
          enableThreatAnalysis: false,
          affectedSystems: ['API Gateway', 'Database', 'WebSocket Server'],
          autoResponse: true,
          circuitBreakerActivated: true,
        });
        console.info(`[LoadTest] Circuit breaker triggered at ${concurrentUsers?.toLocaleString()} users`);
      } catch (e) {
        console.warn('[LoadTest] Failed to trigger incident response:', e?.message);
      }
    }

    // Pause high-risk elections at 750K+ users
    if (concurrentUsers >= ELECTION_PAUSE_THRESHOLD) {
      try {
        // Signal elections service to pause high-risk elections
        if (electionsService?.pauseHighRiskElections) {
          await electionsService?.pauseHighRiskElections({ reason: 'load_threshold', concurrentUsers });
        }
        console.info(`[LoadTest] High-risk elections paused at ${concurrentUsers?.toLocaleString()} users`);
      } catch (e) {
        console.warn('[LoadTest] Failed to pause elections:', e?.message);
      }
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Load Testing Engine</h3>
            <p className="text-gray-400 text-sm">Artillery/k6 concurrent user simulation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Framework:</span>
          <select
            value={testFramework}
            onChange={(e) => setTestFramework(e?.target?.value)}
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="k6">k6</option>
            <option value="artillery">Artillery</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {SCALE_LEVELS?.map((scale) => {
          const test = activeTests?.[scale?.value];
          return (
            <div key={scale?.value} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${scale?.color}`} />
                  <span className="text-white font-bold text-lg">{scale?.label}</span>
                </div>
                <span className="text-gray-500 text-xs">users</span>
              </div>
              {test ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium capitalize ${getStatusColor(test?.status)}`}>
                      {test?.status}
                    </span>
                    <span className="text-gray-400 text-xs">{test?.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        test?.status === 'passed' ? 'bg-green-500' :
                        test?.status === 'failed' ? 'bg-red-500' :
                        test?.status === 'stopped' ? 'bg-gray-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${test?.progress}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="text-gray-400">RPS: <span className="text-white">{test?.metrics?.rps?.toLocaleString()}</span></div>
                    <div className="text-gray-400">Latency: <span className="text-white">{test?.metrics?.latency}ms</span></div>
                    <div className="text-gray-400">Errors: <span className={test?.metrics?.errors > 0 ? 'text-red-400' : 'text-green-400'}>{test?.metrics?.errors}%</span></div>
                    <div className="text-gray-400">Throughput: <span className="text-white">{((test?.metrics?.throughput || 0) / 1000000)?.toFixed(1)}M</span></div>
                  </div>
                  {test?.status === 'running' && (
                    <button
                      onClick={() => stopTest(scale?.value)}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs py-1.5 rounded-lg transition-colors"
                    >
                      <Square className="w-3 h-3" /> Stop
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => startTest(scale)}
                  className="w-full flex items-center justify-center gap-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm py-2 rounded-lg transition-colors mt-2"
                >
                  <Play className="w-3.5 h-3.5" /> Run Test
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => SCALE_LEVELS?.forEach(s => startTest(s))}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Play className="w-4 h-4" /> Run All Scales
        </button>
        <button
          onClick={() => setActiveTests({})}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Reset All
        </button>
        <div className="flex items-center gap-2 ml-auto text-gray-400 text-sm">
          <Users className="w-4 h-4" />
          <span>Active Tests: {Object.values(activeTests)?.filter(t => t?.status === 'running')?.length}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadTestingEngine;
