import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import PhaseTrackingPanel from './components/PhaseTrackingPanel';
import FeatureAdoptionPanel from './components/FeatureAdoptionPanel';
import PerformanceMonitoringPanel from './components/PerformanceMonitoringPanel';
import HealthScorePanel from './components/HealthScorePanel';
import AlertsPanel from './components/AlertsPanel';
import RolloutStatusPanel from './components/RolloutStatusPanel';
import Icon from '../../components/AppIcon';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const UnifiedFeatureMonitoringDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshTimestamp = () => setLastUpdated(new Date());

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: refreshTimestamp,
    enabled: autoRefresh,
  });

  const overviewMetrics = [
    {
      title: 'Active Features',
      value: '47',
      change: '+5',
      trend: 'up',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Avg Adoption Rate',
      value: '73%',
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Health Score',
      value: '8.7/10',
      change: '+0.3',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Active Alerts',
      value: '3',
      change: '-2',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Unified Feature Monitoring Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Comprehensive Phase 2-3 health tracking with real-time metrics and rollout status
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                autoRefresh
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
            </button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['1h', '6h', '24h', '7d', '30d']?.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewMetrics?.map((metric, index) => {
          const Icon = metric?.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric?.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric?.color}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    metric?.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric?.change}
                  <TrendingUp
                    className={`w-4 h-4 ${
                      metric?.trend === 'down' ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{metric?.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{metric?.value}</p>
            </div>
          );
        })}
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Phase Tracking - Full Width */}
        <div className="lg:col-span-3">
          <PhaseTrackingPanel timeRange={timeRange} />
        </div>

        {/* Feature Adoption */}
        <div className="lg:col-span-2">
          <FeatureAdoptionPanel timeRange={timeRange} />
        </div>

        {/* Health Score */}
        <div className="lg:col-span-1">
          <HealthScorePanel />
        </div>

        {/* Performance Monitoring */}
        <div className="lg:col-span-2">
          <PerformanceMonitoringPanel timeRange={timeRange} />
        </div>

        {/* Alerts */}
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>

        {/* Rollout Status - Full Width */}
        <div className="lg:col-span-3">
          <RolloutStatusPanel />
        </div>
      </div>
    </div>
  );
};

export default UnifiedFeatureMonitoringDashboard;