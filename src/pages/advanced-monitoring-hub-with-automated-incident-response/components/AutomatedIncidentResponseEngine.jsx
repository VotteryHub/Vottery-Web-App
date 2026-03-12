import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { unifiedIncidentResponseService } from '../../../services/unifiedIncidentResponseService';

const AutomatedIncidentResponseEngine = ({ incidents, onRefresh }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [executing, setExecuting] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleExecuteAutomatedResponse = async (incidentId) => {
    setExecuting(true);
    try {
      const actions = [
        'Alert correlation initiated',
        'Severity classification completed',
        'Stakeholder notification sent',
        'Automated remediation triggered'
      ];
      
      await unifiedIncidentResponseService?.executeAutomatedResponse(incidentId, actions);
      onRefresh?.();
    } catch (error) {
      console.error('Error executing automated response:', error);
    } finally {
      setExecuting(false);
    }
  };

  const activeIncidents = incidents?.filter(i => i?.status === 'active') || [];
  const inProgressIncidents = incidents?.filter(i => i?.status === 'in_progress') || [];
  const resolvedIncidents = incidents?.filter(i => i?.status === 'resolved') || [];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Incidents</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{activeIncidents?.length}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <Icon name="AlertTriangle" size={24} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{inProgressIncidents?.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Icon name="Clock" size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resolved Today</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{resolvedIncidents?.length}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Icon name="CheckCircle" size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automated Responses</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {incidents?.filter(i => i?.automatedActionsTaken?.length > 0)?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Icon name="Zap" size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Incidents */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Active Incidents Requiring Response
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {activeIncidents?.length === 0 ? (
            <div className="p-8 text-center">
              <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No active incidents. All systems operating normally.</p>
            </div>
          ) : (
            activeIncidents?.map((incident) => (
              <div key={incident?.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident?.threatLevel)}`}>
                        {incident?.threatLevel?.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident?.status)}`}>
                        {incident?.status?.replace('_', ' ')?.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(incident?.detectedAt)?.toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {incident?.incidentType?.replace(/_/g, ' ')?.toUpperCase()}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {incident?.description}
                    </p>
                    {incident?.automatedActionsTaken?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Automated Actions Taken:
                        </p>
                        <ul className="space-y-1">
                          {incident?.automatedActionsTaken?.map((action, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Icon name="Check" size={14} className="text-green-500" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleExecuteAutomatedResponse(incident?.id)}
                      disabled={executing}
                      className="flex items-center gap-2"
                    >
                      <Icon name="Zap" size={16} />
                      Execute Response
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIncident(incident)}
                      className="flex items-center gap-2"
                    >
                      <Icon name="Eye" size={16} />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Automated Response Workflows */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Automated Response Workflows
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Icon name="GitBranch" size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Alert Correlation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Automatically groups related alerts to identify coordinated incidents
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Icon name="Target" size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Severity Classification</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    AI-powered severity assessment based on impact and urgency
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Icon name="Bell" size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Stakeholder Notification</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Cascading notifications to appropriate teams based on incident type
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Icon name="Wrench" size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Automated Remediation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Executes predefined remediation actions with comprehensive audit trails
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedIncidentResponseEngine;