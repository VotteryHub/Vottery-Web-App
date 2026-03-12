import React, { useState, useEffect } from 'react';
import { Activity, Shield, Send, AlertTriangle, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import TestMessageAutomation from './components/TestMessageAutomation';
import FailoverSimulation from './components/FailoverSimulation';
import ComplianceReportingEngine from './components/ComplianceReportingEngine';
import HealthCheckResults from './components/HealthCheckResults';
import Icon from '../../components/AppIcon';


const TABS = [
  { id: 'results', label: 'Health Check Results', icon: Activity },
  { id: 'tests', label: 'Test Message Automation', icon: Send },
  { id: 'failover', label: 'Failover Simulation', icon: AlertTriangle },
  { id: 'compliance', label: 'Compliance Reporting', icon: Shield }
];

const AutomatedSMSHealthCheckSuiteDashboard = () => {
  const [activeTab, setActiveTab] = useState('results');
  const [overallHealth, setOverallHealth] = useState({ telnyx: 'healthy', twilio: 'healthy' });
  const [recentStats, setRecentStats] = useState({ total: 0, passed: 0, failed: 0 });

  useEffect(() => {
    loadOverallHealth();
  }, []);

  const loadOverallHealth = async () => {
    try {
      const { data } = await supabase
        ?.from('sms_health_check_results')
        ?.select('provider, status')
        ?.order('created_at', { ascending: false })
        ?.limit(20);

      if (data && data?.length > 0) {
        const total = data?.length;
        const passed = data?.filter(r => r?.status === 'pass')?.length;
        const failed = data?.filter(r => r?.status === 'fail')?.length;
        setRecentStats({ total, passed, failed });

        const recentTelnyx = data?.filter(r => r?.provider === 'telnyx')?.slice(0, 3);
        const recentTwilio = data?.filter(r => r?.provider === 'twilio')?.slice(0, 3);
        const telnyxFails = recentTelnyx?.filter(r => r?.status === 'fail')?.length;
        const twilioFails = recentTwilio?.filter(r => r?.status === 'fail')?.length;

        setOverallHealth({
          telnyx: telnyxFails >= 2 ? 'failed' : telnyxFails === 1 ? 'degraded' : 'healthy',
          twilio: twilioFails >= 2 ? 'failed' : twilioFails === 1 ? 'degraded' : 'healthy'
        });
      }
    } catch (err) {
      console.error('Error loading health:', err);
    }
  };

  const getHealthBadge = (status) => {
    const styles = {
      healthy: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, dot: 'bg-green-500' },
      degraded: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertTriangle, dot: 'bg-yellow-500' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, dot: 'bg-red-500' }
    };
    return styles?.[status] || styles?.healthy;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-700 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Automated SMS Health Check Suite</h1>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-green-600">{TABS?.find(t => t?.id === activeTab)?.label}</span>
              </div>
            </div>
          </div>

          {/* Provider Health Status */}
          <div className="flex items-center gap-3">
            {['telnyx', 'twilio']?.map(provider => {
              const badge = getHealthBadge(overallHealth?.[provider]);
              const Icon = badge?.icon;
              return (
                <div key={provider} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${badge?.bg}`}>
                  <div className={`w-2 h-2 rounded-full ${badge?.dot} animate-pulse`} />
                  <span className={`text-sm font-medium capitalize ${badge?.text}`}>{provider}</span>
                  <Icon className={`w-4 h-4 ${badge?.text}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 mt-3 text-sm">
          <span className="text-gray-500">Recent 20 tests:</span>
          <span className="text-gray-700">Total: <strong>{recentStats?.total}</strong></span>
          <span className="text-green-600">Passed: <strong>{recentStats?.passed}</strong></span>
          <span className="text-red-600">Failed: <strong>{recentStats?.failed}</strong></span>
          <span className="text-gray-500">Hourly checks: <strong className="text-blue-600">Active</strong></span>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          {TABS?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab?.id
                  ? 'border-green-600 text-green-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        {activeTab === 'results' && <HealthCheckResults />}
        {activeTab === 'tests' && <TestMessageAutomation />}
        {activeTab === 'failover' && <FailoverSimulation />}
        {activeTab === 'compliance' && <ComplianceReportingEngine />}
      </div>
    </div>
  );
};

export default AutomatedSMSHealthCheckSuiteDashboard;
