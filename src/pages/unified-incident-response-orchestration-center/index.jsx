import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import { unifiedIncidentResponseService } from '../../services/unifiedIncidentResponseService';
import ActiveIncidentsPanel from './components/ActiveIncidentsPanel';
import DualAIIntegrationPanel from './components/DualAIIntegrationPanel';
import ResponseCoordinationPanel from './components/ResponseCoordinationPanel';
import DecisionMatrixPanel from './components/DecisionMatrixPanel';
import EvidenceCollectionPanel from './components/EvidenceCollectionPanel';
import PerformanceAnalyticsPanel from './components/PerformanceAnalyticsPanel';

const UnifiedIncidentResponseOrchestrationCenter = () => {
  const [activeTab, setActiveTab] = useState('active-incidents');
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    threatLevel: 'all',
    incidentType: 'all',
  });

  useEffect(() => {
    loadIncidents();
  }, [filters]);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const { data, error } = await unifiedIncidentResponseService?.getActiveIncidents(filters);
      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'active-incidents', label: 'Active Incidents', icon: 'AlertTriangle' },
    { id: 'ai-integration', label: 'Dual AI Integration', icon: 'Brain' },
    { id: 'response-coordination', label: 'Response Coordination', icon: 'Zap' },
    { id: 'decision-matrix', label: 'Decision Matrix', icon: 'GitBranch' },
    { id: 'evidence', label: 'Evidence Collection', icon: 'FileSearch' },
    { id: 'analytics', label: 'Performance Analytics', icon: 'BarChart3' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Unified Incident Response Orchestration
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                AI-Powered Incident Management with Perplexity & Claude
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  AI Systems Active
                </span>
              </div>
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
                    ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
        {loading ? (
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
            {activeTab === 'ai-integration' && (
              <DualAIIntegrationPanel selectedIncident={selectedIncident} />
            )}
            {activeTab === 'response-coordination' && (
              <ResponseCoordinationPanel selectedIncident={selectedIncident} />
            )}
            {activeTab === 'decision-matrix' && (
              <DecisionMatrixPanel selectedIncident={selectedIncident} />
            )}
            {activeTab === 'evidence' && (
              <EvidenceCollectionPanel selectedIncident={selectedIncident} />
            )}
            {activeTab === 'analytics' && <PerformanceAnalyticsPanel incidents={incidents} />}
          </>
        )}
      </div>
    </div>
  );
};

export default UnifiedIncidentResponseOrchestrationCenter;