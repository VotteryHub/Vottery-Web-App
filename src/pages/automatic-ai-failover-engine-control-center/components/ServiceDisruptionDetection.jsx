import React, { useState } from 'react';
import { AlertTriangle, Activity, Clock, TrendingDown } from 'lucide-react';

const ServiceDisruptionDetection = () => {
  const [detectionMetrics] = useState([
    {
      id: 'response_time',
      name: 'Response Time Monitoring',
      threshold: '500ms',
      current: '245ms',
      status: 'normal',
      violations: 0
    },
    {
      id: 'error_rate',
      name: 'Error Rate Tracking',
      threshold: '5%',
      current: '0.2%',
      status: 'normal',
      violations: 0
    },
    {
      id: 'rate_limit',
      name: 'Rate Limit Breaches',
      threshold: '95%',
      current: '85%',
      status: 'warning',
      violations: 2
    },
    {
      id: 'performance',
      name: 'Performance Threshold',
      threshold: '2s',
      current: '312ms',
      status: 'normal',
      violations: 0
    }
  ]);

  const [alerts] = useState([
    {
      id: 1,
      service: 'OpenAI',
      type: 'Rate Limit Warning',
      severity: 'medium',
      timestamp: new Date(Date.now() - 300000),
      message: 'API usage at 85% - approaching rate limit threshold'
    },
    {
      id: 2,
      service: 'Perplexity',
      type: 'Response Time Spike',
      severity: 'low',
      timestamp: new Date(Date.now() - 600000),
      message: 'Response time increased to 450ms (threshold: 500ms)'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Service Disruption Detection</h2>
        <p className="text-slate-600">Real-time monitoring with automated alert triggers detecting issues within 2 seconds</p>
      </div>

      {/* Detection Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {detectionMetrics?.map((metric) => (
          <div key={metric?.id} className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900">{metric?.name}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(metric?.status)}`}>
                {metric?.status?.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Threshold</span>
                <span className="font-semibold text-slate-900">{metric?.threshold}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Current Value</span>
                <span className="font-semibold text-slate-900">{metric?.current}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-sm text-slate-600">Violations (24h)</span>
                <span className={`font-semibold ${
                  metric?.violations === 0 ? 'text-green-600' :
                  metric?.violations < 5 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {metric?.violations}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Alerts */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Active Alerts
          </h3>
        </div>
        <div className="divide-y divide-slate-200">
          {alerts?.length > 0 ? (
            alerts?.map((alert) => (
              <div key={alert?.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-900">{alert?.type}</div>
                      <div className="text-sm text-slate-600 mt-1">{alert?.message}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert?.severity)}`}>
                    {alert?.severity?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 ml-8 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    {alert?.service}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {alert?.timestamp?.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-600">
              <Activity className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p>No active alerts - All services operating normally</p>
            </div>
          )}
        </div>
      </div>

      {/* Detection Algorithm */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Detection Algorithm Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-medium text-slate-900">2-Second Detection Window</div>
              <div className="text-sm text-slate-600">Identifies service issues within 2 seconds of occurrence</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <div className="font-medium text-slate-900">Performance Threshold Monitoring</div>
              <div className="text-sm text-slate-600">Tracks response times, error rates, and API limits</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-medium text-slate-900">Automated Alert Triggers</div>
              <div className="text-sm text-slate-600">Instant notifications when thresholds are breached</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="font-medium text-slate-900">Predictive Failure Detection</div>
              <div className="text-sm text-slate-600">ML algorithms predict potential service disruptions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDisruptionDetection;