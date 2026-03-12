import React, { useState } from 'react';
import { CheckCircle, Activity, Shield, Zap, TrendingUp } from 'lucide-react';

const GeminiBackupStatus = () => {
  const [backupStatus] = useState({
    status: 'ready',
    uptime: 100.0,
    capacity: 85,
    responseTime: 156,
    lastTest: new Date(Date.now() - 1800000),
    failoverCount: 47,
    avgTakeoverTime: 0.3
  });

  const [readinessChecks] = useState([
    { name: 'API Connection', status: 'passed', lastCheck: new Date() },
    { name: 'Authentication', status: 'passed', lastCheck: new Date() },
    { name: 'Rate Limits', status: 'passed', lastCheck: new Date() },
    { name: 'Response Time', status: 'passed', lastCheck: new Date() },
    { name: 'Error Handling', status: 'passed', lastCheck: new Date() },
    { name: 'Load Capacity', status: 'passed', lastCheck: new Date() }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Gemini Backup Status</h2>
        <p className="text-slate-600">Readiness indicators, capacity monitoring, and takeover preparation for service continuity</p>
      </div>

      {/* Status Overview */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600 rounded-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Backup System Ready</h3>
              <p className="text-slate-600">Gemini is fully operational and ready for instant takeover</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{backupStatus?.uptime}%</div>
            <div className="text-sm text-slate-600">Uptime</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-slate-600 mb-1">Capacity Available</div>
            <div className="text-2xl font-bold text-slate-900">{backupStatus?.capacity}%</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-slate-600 mb-1">Response Time</div>
            <div className="text-2xl font-bold text-slate-900">{backupStatus?.responseTime}ms</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-slate-600 mb-1">Failover Count</div>
            <div className="text-2xl font-bold text-slate-900">{backupStatus?.failoverCount}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-slate-600 mb-1">Avg Takeover</div>
            <div className="text-2xl font-bold text-slate-900">{backupStatus?.avgTakeoverTime}s</div>
          </div>
        </div>
      </div>

      {/* Readiness Checks */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Readiness Indicators
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {readinessChecks?.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-slate-900">{check?.name}</div>
                  <div className="text-xs text-slate-600">Last check: {check?.lastCheck?.toLocaleTimeString()}</div>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                {check?.status?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Service Continuity Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Takeover Preparation
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Pre-warmed Connections</div>
                <div className="text-sm text-slate-600">Maintains active connections for instant takeover</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Context Preservation</div>
                <div className="text-sm text-slate-600">Maintains conversation context during switch</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Zero Data Loss</div>
                <div className="text-sm text-slate-600">Ensures no request data is lost during failover</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Capacity Monitoring
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Load Capacity Tracking</div>
                <div className="text-sm text-slate-600">Real-time monitoring of available capacity</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Scalability Assessment</div>
                <div className="text-sm text-slate-600">Evaluates ability to handle increased load</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Performance Benchmarking</div>
                <div className="text-sm text-slate-600">Continuous performance validation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Test Results */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Last Failover Test
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-slate-600 mb-1">Test Time</div>
            <div className="font-semibold text-slate-900">{backupStatus?.lastTest?.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600 mb-1">Detection Time</div>
            <div className="font-semibold text-slate-900">1.8 seconds</div>
          </div>
          <div>
            <div className="text-sm text-slate-600 mb-1">Switch Time</div>
            <div className="font-semibold text-slate-900">{backupStatus?.avgTakeoverTime} seconds</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Test Passed - Zero downtime achieved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiBackupStatus;