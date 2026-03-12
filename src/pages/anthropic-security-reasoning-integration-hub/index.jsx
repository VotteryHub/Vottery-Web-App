import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { anthropicSecurityReasoningService } from '../../services/anthropicSecurityReasoningService';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';
import ActiveIncidentsPanel from './components/ActiveIncidentsPanel';
import ContextualAnalysisPanel from './components/ContextualAnalysisPanel';
import RootCauseAnalysisPanel from './components/RootCauseAnalysisPanel';
import RemediationStrategyPanel from './components/RemediationStrategyPanel';
import AutomatedResponsePanel from './components/AutomatedResponsePanel';

const AnthropicSecurityReasoningIntegrationHub = () => {
  const [activeTab, setActiveTab] = useState('incidents');
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadIncidents = async () => {
    try {
      const { data, error } = await anthropicSecurityReasoningService?.getActiveIncidents();
      if (error) throw error;
      setIncidents(data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadIncidents,
    enabled: autoRefresh,
  });

  const tabs = [
    { id: 'incidents', label: 'Active Incidents', icon: 'AlertTriangle', badge: incidents?.length },
    { id: 'analysis', label: 'Contextual Analysis', icon: 'Brain' },
    { id: 'rootcause', label: 'Root Cause Analysis', icon: 'Search' },
    { id: 'remediation', label: 'Remediation Strategy', icon: 'Shield' },
    { id: 'automated', label: 'Automated Response', icon: 'Zap' },
  ];

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'high':
        return 'text-orange-600 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <>
      <Helmet>
        <title>Anthropic Security Reasoning Integration Hub | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Anthropic Security Reasoning Integration Hub
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Claude-powered sophisticated reasoning for complex security events with automated incident response
                </p>
              </div>
              <div className="flex items-center gap-3">
                {incidents?.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Incidents:
                    </span>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      {incidents?.length}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {autoRefresh ? `Live • ${lastUpdated?.toLocaleTimeString()}` : 'Paused'}
                  </span>
                </div>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    autoRefresh
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 relative ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                  {tab?.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {tab?.badge > 9 ? '9+' : tab?.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading && incidents?.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'incidents' && (
                <ActiveIncidentsPanel 
                  incidents={incidents} 
                  selectedIncident={selectedIncident}
                  onSelectIncident={setSelectedIncident}
                />
              )}
              {activeTab === 'analysis' && (
                <ContextualAnalysisPanel 
                  incident={selectedIncident}
                  onSelectIncident={setSelectedIncident}
                  incidents={incidents}
                />
              )}
              {activeTab === 'rootcause' && (
                <RootCauseAnalysisPanel 
                  incident={selectedIncident}
                  onSelectIncident={setSelectedIncident}
                  incidents={incidents}
                />
              )}
              {activeTab === 'remediation' && (
                <RemediationStrategyPanel 
                  incident={selectedIncident}
                  onSelectIncident={setSelectedIncident}
                  incidents={incidents}
                />
              )}
              {activeTab === 'automated' && (
                <AutomatedResponsePanel 
                  incident={selectedIncident}
                  incidents={incidents}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AnthropicSecurityReasoningIntegrationHub;