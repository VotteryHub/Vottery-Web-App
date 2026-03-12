import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw, Activity, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import platformLoggingService from '../../services/platformLoggingService';
import AdvancedSearchEnginePanel from './components/AdvancedSearchEnginePanel';
import CrossPlatformCorrelationPanel from './components/CrossPlatformCorrelationPanel';
import AIIntegrationMonitoringPanel from './components/AIIntegrationMonitoringPanel';
import LogAnalyticsPanel from './components/LogAnalyticsPanel';
import UnifiedLogStreamPanel from './components/UnifiedLogStreamPanel';
import Icon from '../../components/AppIcon';


const AdminLogAnalyticsCrossPlatformMonitoringDashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    logLevel: '',
    logCategory: '',
    logSource: '',
    search: '',
    startDate: '',
    endDate: '',
    limit: 50
  });
  const [activeTab, setActiveTab] = useState('stream');

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadLogs = async () => {
    setLoading(true);
    const { data, error } = await platformLoggingService?.getLogs(filters);
    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = async () => {
    const { data, error } = await platformLoggingService?.getLogs({ ...filters, limit: null });
    if (!error && data) {
      const csv = convertToCSV(data);
      downloadCSV(csv, 'platform_logs_export.csv');
    }
  };

  const convertToCSV = (data) => {
    const headers = ['Timestamp', 'Level', 'Category', 'Source', 'Event Type', 'Message', 'User'];
    const rows = data?.map(log => [
      new Date(log?.createdAt)?.toISOString(),
      log?.logLevel,
      log?.logCategory,
      log?.logSource,
      log?.eventType,
      log?.message,
      log?.user?.name || log?.user?.email || 'Anonymous'
    ]);
    return [headers, ...rows]?.map(row => row?.join(','))?.join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'stream', label: 'Unified Log Stream', icon: Activity },
    { id: 'search', label: 'Advanced Search', icon: Search },
    { id: 'correlation', label: 'Cross-Platform Correlation', icon: Filter },
    { id: 'ai', label: 'AI Integration Monitoring', icon: AlertTriangle },
    { id: 'analytics', label: 'Log Analytics', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Admin Log Analytics & Cross-Platform Monitoring
            </h1>
            <p className="text-slate-600">
              Comprehensive log viewing, analysis, and correlation across all Vottery platform systems
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadLogs}
              disabled={loading}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Logs
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Log Level</label>
              <select
                value={filters?.logLevel}
                onChange={(e) => handleFilterChange('logLevel', e?.target?.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={filters?.logCategory}
                onChange={(e) => handleFilterChange('logCategory', e?.target?.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="security">Security</option>
                <option value="payment">Payment</option>
                <option value="voting">Voting</option>
                <option value="ai_analysis">AI Analysis</option>
                <option value="user_activity">User Activity</option>
                <option value="performance">Performance</option>
                <option value="fraud_detection">Fraud Detection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
              <select
                value={filters?.logSource}
                onChange={(e) => handleFilterChange('logSource', e?.target?.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sources</option>
                <option value="client">Client</option>
                <option value="server">Server</option>
                <option value="ai_service">AI Service</option>
                <option value="third_party">Third Party</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
              <input
                type="text"
                value={filters?.search}
                onChange={(e) => handleFilterChange('search', e?.target?.value)}
                placeholder="Search logs..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6 border border-slate-200">
        <div className="flex overflow-x-auto">
          {tabs?.map((tab) => {
            const Icon = tab?.icon;
            return (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-purple-600 text-purple-600 bg-purple-50' :'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab?.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'stream' && <UnifiedLogStreamPanel logs={logs} loading={loading} />}
        {activeTab === 'search' && <AdvancedSearchEnginePanel />}
        {activeTab === 'correlation' && <CrossPlatformCorrelationPanel />}
        {activeTab === 'ai' && <AIIntegrationMonitoringPanel />}
        {activeTab === 'analytics' && <LogAnalyticsPanel />}
      </div>
    </div>
  );
};

export default AdminLogAnalyticsCrossPlatformMonitoringDashboard;