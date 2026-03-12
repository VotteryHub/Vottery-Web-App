import React, { useState, useEffect } from 'react';
import { Activity, Database, Shield, Server, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import platformLoggingService from '../../services/platformLoggingService';
import DatabaseConfigurationPanel from './components/DatabaseConfigurationPanel';
import LoggingServiceManagementPanel from './components/LoggingServiceManagementPanel';
import RLSPolicyAdministrationPanel from './components/RLSPolicyAdministrationPanel';
import LogIngestionMetricsPanel from './components/LogIngestionMetricsPanel';
import LogCategorizationEnginePanel from './components/LogCategorizationEnginePanel';
import JWTAdminRoleClaimsPanel from './components/JWTAdminRoleClaimsPanel';



const PlatformLoggingArchitectureControlCenter = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  const loadStatistics = async () => {
    setLoading(true);
    const { data, error } = await platformLoggingService?.getLogStatistics();
    if (!error && data) {
      setStatistics(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStatistics();
    const interval = setInterval(loadStatistics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const tabs = [
    { id: 'overview', label: 'Platform Overview', icon: Activity },
    { id: 'database', label: 'Database Configuration', icon: Database },
    { id: 'services', label: 'Logging Services', icon: Server },
    { id: 'rls', label: 'RLS Policy Administration', icon: Shield },
    { id: 'ingestion', label: 'Log Ingestion Metrics', icon: TrendingUp },
    { id: 'categorization', label: 'Categorization Engine', icon: Zap },
    { id: 'jwt', label: 'JWT Admin Role Claims', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Platform Logging Architecture Control Center
            </h1>
            <p className="text-slate-600">
              Comprehensive logging infrastructure management with database configuration, RLS policies, and cross-platform analytics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg shadow-sm px-4 py-2 border border-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">Auto-refresh: {refreshInterval / 1000}s</span>
              </div>
            </div>
            <button
              onClick={loadStatistics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Now
            </button>
          </div>
        </div>

        {/* Real-time Status Indicators */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Logs (24h)</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {statistics?.totalLogs?.toLocaleString() || 0}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Error Rate</p>
                  <p className="text-2xl font-bold text-red-600">
                    {statistics?.errorRate || 0}%
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Avg Duration</p>
                  <p className="text-2xl font-bold text-green-600">
                    {statistics?.avgDurationMs || 0}ms
                  </p>
                </div>
                <Zap className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">System Health</p>
                  <p className="text-2xl font-bold text-green-600">
                    {statistics?.errorRate < 5 ? 'Healthy' : 'Degraded'}
                  </p>
                </div>
                {statistics?.errorRate < 5 ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6 border border-slate-200">
        <div className="flex overflow-x-auto">
          {tabs?.map((tab) => {
            const TabIcon = tab?.icon;
            return (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <TabIcon className="w-5 h-5" />
                <span className="font-medium">{tab?.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DatabaseConfigurationPanel />
            <LoggingServiceManagementPanel />
          </div>
        )}

        {activeTab === 'database' && <DatabaseConfigurationPanel />}
        {activeTab === 'services' && <LoggingServiceManagementPanel />}
        {activeTab === 'rls' && <RLSPolicyAdministrationPanel />}
        {activeTab === 'ingestion' && <LogIngestionMetricsPanel statistics={statistics} />}
        {activeTab === 'categorization' && <LogCategorizationEnginePanel />}
        {activeTab === 'jwt' && <JWTAdminRoleClaimsPanel />}
      </div>
    </div>
  );
};

export default PlatformLoggingArchitectureControlCenter;