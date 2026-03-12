import React, { useState, useEffect } from 'react';
import { Activity, Zap, AlertTriangle, CheckCircle, Clock, Wifi, RefreshCw } from 'lucide-react';
import Sub100msPerformancePanel from './components/Sub100msPerformancePanel';
import AdvancedConflictResolutionPanel from './components/AdvancedConflictResolutionPanel';
import AutomaticFailoverPanel from './components/AutomaticFailoverPanel';
import MultiAISynchronizationPanel from './components/MultiAISynchronizationPanel';
import PredictiveFailurePanel from './components/PredictiveFailurePanel';
import ConnectionMultiplexingPanel from './components/ConnectionMultiplexingPanel';

const EnhancedRealTimeWebSocketCoordinationHub = () => {
  const [dashboardStats, setDashboardStats] = useState({
    avgLatency: 47,
    connectionQuality: 99.8,
    activeConnections: 248,
    conflictsResolved: 156,
    failoverEvents: 3,
    uptime: 99.99
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [performanceStatus, setPerformanceStatus] = useState('optimal');

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate real-time latency updates
      setDashboardStats(prev => ({
        ...prev,
        avgLatency: Math.max(35, Math.min(95, prev?.avgLatency + Math.floor(Math.random() * 10 - 5))),
        conflictsResolved: prev?.conflictsResolved + Math.floor(Math.random() * 2)
      }));

      // Update performance status based on latency
      setPerformanceStatus(prev => {
        const latency = dashboardStats?.avgLatency;
        if (latency < 50) return 'optimal';
        if (latency < 80) return 'good';
        return 'degraded';
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dashboardStats?.avgLatency]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'green';
      case 'good': return 'blue';
      case 'degraded': return 'orange';
      default: return 'gray';
    }
  };

  const statusColor = getStatusColor(performanceStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Enhanced Real-Time WebSocket Coordination Hub
            </h1>
            <p className="text-gray-600">
              Sub-100ms Infrastructure with Advanced Conflict Resolution & Automatic Failover
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 bg-${statusColor}-50 px-4 py-2 rounded-lg border border-${statusColor}-200`}>
              <Wifi className={`w-5 h-5 text-${statusColor}-600 animate-pulse`} />
              <span className={`text-sm font-medium text-${statusColor}-700`}>
                {performanceStatus?.toUpperCase()} • {dashboardStats?.avgLatency}ms
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              <Activity className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Updated {lastUpdate?.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-blue-600" />
            <span className={`text-xs font-medium text-${statusColor}-600 bg-${statusColor}-50 px-2 py-1 rounded`}>
              {performanceStatus?.toUpperCase()}
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.avgLatency}ms</div>
          <div className="text-sm text-gray-600">Avg Latency</div>
          <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`bg-gradient-to-r from-${statusColor}-500 to-${statusColor}-600 h-full transition-all duration-500`}
              style={{ width: `${Math.max(0, 100 - dashboardStats?.avgLatency)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">EXCELLENT</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.connectionQuality}%</div>
          <div className="text-sm text-gray-600">Connection Quality</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Wifi className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">ACTIVE</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.activeConnections}</div>
          <div className="text-sm text-gray-600">Active Connections</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">RESOLVED</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.conflictsResolved}</div>
          <div className="text-sm text-gray-600">Conflicts Resolved</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <RefreshCw className="w-8 h-8 text-teal-600" />
            <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded">TODAY</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.failoverEvents}</div>
          <div className="text-sm text-gray-600">Failover Events</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">UPTIME</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.uptime}%</div>
          <div className="text-sm text-gray-600">System Uptime</div>
        </div>
      </div>

      {/* Main Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Sub100msPerformancePanel currentLatency={dashboardStats?.avgLatency} />
        <AdvancedConflictResolutionPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AutomaticFailoverPanel />
        <MultiAISynchronizationPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictiveFailurePanel />
        <ConnectionMultiplexingPanel />
      </div>
    </div>
  );
};

export default EnhancedRealTimeWebSocketCoordinationHub;