import React, { useState } from 'react';
import { TrendingUp, Activity, BarChart3, Zap } from 'lucide-react';

const TrafficRoutingControl = () => {
  const [trafficDistribution] = useState([
    { service: 'OpenAI', percentage: 35, requests: 14250, color: 'bg-blue-500' },
    { service: 'Anthropic', percentage: 30, requests: 12200, color: 'bg-purple-500' },
    { service: 'Perplexity', percentage: 25, requests: 10150, color: 'bg-green-500' },
    { service: 'Gemini', percentage: 10, requests: 4060, color: 'bg-orange-500' }
  ]);

  const [routingMetrics] = useState({
    totalRequests: 40660,
    activeRoutes: 4,
    avgLatency: 245,
    successRate: 99.8
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Traffic Routing Control</h2>
        <p className="text-slate-600">Live traffic distribution with automatic load balancing and intelligent failover decisions</p>
      </div>
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 font-medium mb-1">Total Requests</div>
          <div className="text-2xl font-bold text-blue-900">{routingMetrics?.totalRequests?.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-purple-600 font-medium mb-1">Active Routes</div>
          <div className="text-2xl font-bold text-purple-900">{routingMetrics?.activeRoutes}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 font-medium mb-1">Avg Latency</div>
          <div className="text-2xl font-bold text-green-900">{routingMetrics?.avgLatency}ms</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
          <div className="text-sm text-emerald-600 font-medium mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-emerald-900">{routingMetrics?.successRate}%</div>
        </div>
      </div>
      {/* Traffic Distribution */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Live Traffic Distribution
        </h3>
        <div className="space-y-4">
          {trafficDistribution?.map((service) => (
            <div key={service?.service}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${service?.color}`} />
                  <span className="font-medium text-slate-900">{service?.service}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">{service?.requests?.toLocaleString()} requests</span>
                  <span className="font-semibold text-slate-900">{service?.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${service?.color} transition-all`}
                  style={{ width: `${service?.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Load Balancing Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Load Balancing Strategy
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Performance-Based Routing</div>
                <div className="text-sm text-slate-600">Routes based on response time and availability</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Capacity Monitoring</div>
                <div className="text-sm text-slate-600">Tracks API limits and adjusts distribution</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Cost Optimization</div>
                <div className="text-sm text-slate-600">Balances performance with cost efficiency</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Intelligent Failover Decisions
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Service Availability</div>
                <div className="text-sm text-slate-600">Real-time health checks every 2 seconds</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Performance Metrics</div>
                <div className="text-sm text-slate-600">Monitors latency, error rates, and throughput</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Automatic Recovery</div>
                <div className="text-sm text-slate-600">Restores primary service when healthy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Real-time Activity */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-600 animate-pulse" />
            Real-time Routing Activity
          </h3>
          <span className="text-sm text-slate-600">Last updated: {new Date()?.toLocaleTimeString()}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trafficDistribution?.map((service) => (
            <div key={service?.service} className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm text-slate-600 mb-1">{service?.service}</div>
              <div className="text-xl font-bold text-slate-900">{service?.requests?.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">requests/hour</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficRoutingControl;