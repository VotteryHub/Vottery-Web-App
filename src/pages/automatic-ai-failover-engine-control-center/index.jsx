import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Zap, Activity, Clock, TrendingUp, Settings } from 'lucide-react';
import ServiceHealthMatrix from './components/ServiceHealthMatrix';
import InstantFailoverEngine from './components/InstantFailoverEngine';
import ServiceDisruptionDetection from './components/ServiceDisruptionDetection';
import TrafficRoutingControl from './components/TrafficRoutingControl';
import GeminiBackupStatus from './components/GeminiBackupStatus';
import AdvancedFailoverSettings from './components/AdvancedFailoverSettings';
import Icon from '../../components/AppIcon';
import FailoverStatusPanel from './components/FailoverStatusPanel';


const AutomaticAIFailoverEngineControlCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStatus, setSystemStatus] = useState('operational');
  const [lastCheck, setLastCheck] = useState(new Date());

  useEffect(() => {
    // Update last check every 2 seconds
    const interval = setInterval(() => {
      setLastCheck(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Service Health', icon: Activity },
    { id: 'status', label: 'Failover Status', icon: Zap },
    { id: 'failover', label: 'Failover Engine', icon: Zap },
    { id: 'detection', label: 'Disruption Detection', icon: AlertTriangle },
    { id: 'routing', label: 'Traffic Routing', icon: TrendingUp },
    { id: 'backup', label: 'Gemini Backup', icon: CheckCircle },
    { id: 'settings', label: 'Advanced Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Zap className="w-8 h-8 text-blue-600" />
                Automatic AI Failover Engine Control Center
              </h1>
              <p className="text-slate-600 mt-2">
                Intelligent service disruption detection with instant Gemini fallback - Zero downtime AI operations
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                Last Check: {lastCheck?.toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-3 h-3 rounded-full ${
                  systemStatus === 'operational' ? 'bg-green-500' :
                  systemStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                } animate-pulse`} />
                <span className="text-sm font-semibold text-slate-700 capitalize">{systemStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {tabs?.map((tab) => {
              const Icon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' :'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab?.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && <ServiceHealthMatrix />}
            {activeTab === 'status' && <FailoverStatusPanel />}
            {activeTab === 'failover' && <InstantFailoverEngine />}
            {activeTab === 'detection' && <ServiceDisruptionDetection />}
            {activeTab === 'routing' && <TrafficRoutingControl />}
            {activeTab === 'backup' && <GeminiBackupStatus />}
            {activeTab === 'settings' && <AdvancedFailoverSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomaticAIFailoverEngineControlCenter;