import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const ServiceHealthMatrix = () => {
  const [services, setServices] = useState([
    {
      id: 'openai',
      name: 'OpenAI',
      status: 'healthy',
      responseTime: 245,
      apiLimit: 85,
      errorRate: 0.2,
      uptime: 99.98
    },
    {
      id: 'anthropic',
      name: 'Anthropic (Claude)',
      status: 'healthy',
      responseTime: 312,
      apiLimit: 72,
      errorRate: 0.1,
      uptime: 99.99
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      status: 'healthy',
      responseTime: 198,
      apiLimit: 91,
      errorRate: 0.3,
      uptime: 99.95
    },
    {
      id: 'gemini',
      name: 'Gemini (Backup)',
      status: 'standby',
      responseTime: 156,
      apiLimit: 15,
      errorRate: 0.0,
      uptime: 100.0
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates every 2 seconds
    const interval = setInterval(() => {
      setServices(prev => prev?.map(service => ({
        ...service,
        responseTime: service?.responseTime + Math.floor(Math.random() * 20 - 10),
        apiLimit: Math.min(100, Math.max(0, service?.apiLimit + Math.floor(Math.random() * 6 - 3))),
        errorRate: Math.max(0, service?.errorRate + (Math.random() * 0.2 - 0.1))
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'degraded': return 'text-yellow-600 bg-yellow-50';
      case 'down': return 'text-red-600 bg-red-50';
      case 'standby': return 'text-blue-600 bg-blue-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5" />;
      case 'degraded': return <AlertCircle className="w-5 h-5" />;
      case 'down': return <AlertCircle className="w-5 h-5" />;
      case 'standby': return <Activity className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">AI Service Health Matrix</h2>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Activity className="w-4 h-4 animate-pulse" />
          Live monitoring - Updates every 2 seconds
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services?.map((service) => (
          <div key={service?.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(service?.status)}`}>
                  {getStatusIcon(service?.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{service?.name}</h3>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(service?.status)}`}>
                    {service?.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Response Time
                  </span>
                  <span className="font-semibold text-slate-900">{service?.responseTime}ms</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      service?.responseTime < 200 ? 'bg-green-500' :
                      service?.responseTime < 400 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (service?.responseTime / 500) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">API Limit Usage</span>
                  <span className="font-semibold text-slate-900">{service?.apiLimit}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      service?.apiLimit < 70 ? 'bg-green-500' :
                      service?.apiLimit < 90 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${service?.apiLimit}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200">
                <span className="text-slate-600">Error Rate</span>
                <span className="font-semibold text-slate-900">{service?.errorRate?.toFixed(2)}%</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Uptime
                </span>
                <span className="font-semibold text-green-600">{service?.uptime?.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceHealthMatrix;