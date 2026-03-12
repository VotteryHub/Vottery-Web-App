import React, { useState } from 'react';
import { Zap, ArrowRight, CheckCircle, Clock } from 'lucide-react';

const InstantFailoverEngine = () => {
  const [failoverEvents] = useState([
    {
      id: 1,
      timestamp: new Date(Date.now() - 3600000),
      fromService: 'OpenAI',
      toService: 'Gemini',
      reason: 'API Rate Limit Exceeded',
      detectionTime: 1.8,
      switchTime: 0.2,
      status: 'completed'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 7200000),
      fromService: 'Anthropic',
      toService: 'Gemini',
      reason: 'High Response Time (>2s)',
      detectionTime: 1.5,
      switchTime: 0.3,
      status: 'completed'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 10800000),
      fromService: 'Perplexity',
      toService: 'Gemini',
      reason: 'Service Disruption Detected',
      detectionTime: 1.2,
      switchTime: 0.4,
      status: 'completed'
    }
  ]);

  const [metrics] = useState({
    totalFailovers: 47,
    avgDetectionTime: 1.6,
    avgSwitchTime: 0.3,
    successRate: 99.8,
    zeroDowntimeEvents: 47
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Instant Failover Engine</h2>
        <p className="text-slate-600">Automated switching protocols detecting failures within 2 seconds with zero service interruption</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 font-medium mb-1">Total Failovers</div>
          <div className="text-2xl font-bold text-blue-900">{metrics?.totalFailovers}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 font-medium mb-1">Avg Detection</div>
          <div className="text-2xl font-bold text-green-900">{metrics?.avgDetectionTime}s</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-purple-600 font-medium mb-1">Avg Switch Time</div>
          <div className="text-2xl font-bold text-purple-900">{metrics?.avgSwitchTime}s</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
          <div className="text-sm text-emerald-600 font-medium mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-emerald-900">{metrics?.successRate}%</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <div className="text-sm text-indigo-600 font-medium mb-1">Zero Downtime</div>
          <div className="text-2xl font-bold text-indigo-900">{metrics?.zeroDowntimeEvents}</div>
        </div>
      </div>

      {/* Failover Events */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Recent Failover Events</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {failoverEvents?.map((event) => (
            <div key={event?.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Automatic Failover Completed</div>
                    <div className="text-sm text-slate-600">{event?.timestamp?.toLocaleString()}</div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  {event?.status?.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-4 ml-11">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-medium text-slate-700">
                    {event?.fromService}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="px-3 py-1 bg-blue-100 rounded-lg text-sm font-medium text-blue-700">
                    {event?.toService}
                  </div>
                </div>
              </div>

              <div className="ml-11 mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Reason: </span>
                  <span className="font-medium text-slate-900">{event?.reason}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Detection: </span>
                  <span className="font-medium text-slate-900">{event?.detectionTime}s</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Switch: </span>
                  <span className="font-medium text-slate-900">{event?.switchTime}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Failover Protocol */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Automated Failover Protocol
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <div className="font-medium text-slate-900">Continuous Monitoring (Every 2s)</div>
              <div className="text-sm text-slate-600">Real-time health checks on all AI services</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <div className="font-medium text-slate-900">Instant Detection (&lt;2s)</div>
              <div className="text-sm text-slate-600">Identify service degradation, API limits, or disruptions</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <div className="font-medium text-slate-900">Automatic Switch (&lt;0.5s)</div>
              <div className="text-sm text-slate-600">Seamlessly redirect traffic to Gemini backup with zero downtime</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <div className="font-medium text-slate-900">Service Restoration</div>
              <div className="text-sm text-slate-600">Monitor primary service recovery and auto-restore when healthy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantFailoverEngine;