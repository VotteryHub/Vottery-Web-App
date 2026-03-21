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
    let tick = 0;
    const interval = setInterval(() => {
      tick += 1;
      setLastUpdate(new Date());
      // Deterministic heartbeat keeps UI stable and testable.
      setDashboardStats((prev) => {
        const shift = (tick % 5) - 2;
        const avgLatency = Math.max(35, Math.min(95, prev?.avgLatency + shift));
        if (avgLatency < 50) setPerformanceStatus('optimal');
        else if (avgLatency < 80) setPerformanceStatus('good');
        else setPerformanceStatus('degraded');
        return {
          ...prev,
          avgLatency,
          conflictsResolved: prev?.conflictsResolved + (tick % 2),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'green';
      case 'good': return 'blue';
      case 'degraded': return 'orange';
      default: return 'gray';
    }
  };

  const statusColor = getStatusColor(performanceStatus);
  const statusTheme = {
    optimal: {
      badge: 'bg-green-50 border-green-200 text-green-700',
      icon: 'text-green-600',
      chip: 'text-green-600 bg-green-50',
      bar: 'from-green-500 to-green-600',
    },
    good: {
      badge: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: 'text-blue-600',
      chip: 'text-blue-600 bg-blue-50',
      bar: 'from-blue-500 to-blue-600',
    },
    degraded: {
      badge: 'bg-orange-50 border-orange-200 text-orange-700',
      icon: 'text-orange-600',
      chip: 'text-orange-600 bg-orange-50',
      bar: 'from-orange-500 to-orange-600',
    },
    default: {
      badge: 'bg-gray-50 border-gray-200 text-gray-700',
      icon: 'text-gray-600',
      chip: 'text-gray-600 bg-gray-50',
      bar: 'from-gray-500 to-gray-600',
    },
  };
  const theme = statusTheme[statusColor] || statusTheme.default;

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
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.badge}`}>
              <Wifi className={`w-5 h-5 animate-pulse ${theme.icon}`} />
              <span className="text-sm font-medium">
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
            <span className={`text-xs font-medium px-2 py-1 rounded ${theme.chip}`}>
              {performanceStatus?.toUpperCase()}
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.avgLatency}ms</div>
          <div className="text-sm text-gray-600">Avg Latency</div>
          <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`bg-gradient-to-r h-full transition-all duration-500 ${theme.bar}`}
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