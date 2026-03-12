import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { unifiedIncidentResponseService } from '../../services/unifiedIncidentResponseService';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';
import IncidentCorrelationPanel from './components/IncidentCorrelationPanel';
import OneClickResolutionPanel from './components/OneClickResolutionPanel';
import StakeholderNotificationsPanel from './components/StakeholderNotificationsPanel';
import RealTimeMonitoringPanel from './components/RealTimeMonitoringPanel';
import ActiveIncidentsPanel from './components/ActiveIncidentsPanel';
import ResolutionEffectivenessPanel from './components/ResolutionEffectivenessPanel';

const UnifiedIncidentResponseCommandCenter = () => {
  const [activeTab, setActiveTab] = useState('active-incidents');
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    type: 'all'
  });

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const { data, error } = await unifiedIncidentResponseService?.getActiveIncidents(filters);
      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, [filters]);

  useRealtimeMonitoring({
    tables: 'incident_response_workflows',
    onRefresh: loadIncidents,
    enabled: autoRefresh,
  });

  const tabs = [
    { id: 'active-incidents', label: 'Active Incidents', icon: 'AlertTriangle' },
    { id: 'correlation', label: 'Incident Correlation', icon: 'GitMerge' },
    { id: 'resolution', label: 'One-Click Resolution', icon: 'Zap' },
    { id: 'notifications', label: 'Stakeholder Notifications', icon: 'Bell' },
    { id: 'monitoring', label: 'Real-Time Monitoring', icon: 'Activity' },
    { id: 'effectiveness', label: 'Resolution Effectiveness', icon: 'TrendingUp' }
  ];

  const criticalIncidents = incidents?.filter(i => i?.severity === 'critical')?.length || 0;
  const activeIncidents = incidents?.filter(i => i?.status === 'active' || i?.status === 'in_progress')?.length || 0;

  return (
    <>
      <Helmet>
        <title>Unified Incident Response Command Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Unified Incident Response Command Center
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Intelligent Correlation &amp; Automated Resolution for Fraud, System Failures &amp; Revenue Anomalies
                </p>
              </div>
              <div className="flex items-center gap-3">
                {criticalIncidents > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                      {criticalIncidents} Critical
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Icon name="Activity" size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    {activeIncidents} Active
                  </span>
                </div>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    autoRefresh
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon name={autoRefresh ? 'RefreshCw' : 'Pause'} size={16} className={autoRefresh ? 'animate-spin' : ''} />
                  {autoRefresh ? 'Auto-Refresh' : 'Paused'}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading && !incidents?.length ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'active-incidents' && (
                <ActiveIncidentsPanel
                  incidents={incidents}
                  filters={filters}
                  setFilters={setFilters}
                  onSelectIncident={setSelectedIncident}
                  onRefresh={loadIncidents}
                />
              )}
              {activeTab === 'correlation' && (
                <IncidentCorrelationPanel incidents={incidents} />
              )}
              {activeTab === 'resolution' && (
                <OneClickResolutionPanel
                  selectedIncident={selectedIncident}
                  onRefresh={loadIncidents}
                />
              )}
              {activeTab === 'notifications' && (
                <StakeholderNotificationsPanel selectedIncident={selectedIncident} />
              )}
              {activeTab === 'monitoring' && (
                <RealTimeMonitoringPanel incidents={incidents} />
              )}
              {activeTab === 'effectiveness' && (
                <ResolutionEffectivenessPanel incidents={incidents} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UnifiedIncidentResponseCommandCenter;