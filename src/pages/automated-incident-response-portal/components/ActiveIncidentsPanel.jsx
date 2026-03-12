import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { incidentResponseService } from '../../../services/incidentResponseService';

const ActiveIncidentsPanel = ({ incidents, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterThreatLevel, setFilterThreatLevel] = useState('all');
  const [processing, setProcessing] = useState(null);

  const filteredIncidents = incidents?.filter(incident => {
    if (filterStatus !== 'all' && incident?.status !== filterStatus) return false;
    if (filterThreatLevel !== 'all' && incident?.threatLevel !== filterThreatLevel) return false;
    return true;
  });

  const handleEscalate = async (incidentId) => {
    try {
      setProcessing(incidentId);
      await incidentResponseService?.updateIncidentStatus(incidentId, { status: 'escalated' });
      await onRefresh();
    } catch (error) {
      console.error('Failed to escalate incident:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleResolve = async (incidentId) => {
    try {
      setProcessing(incidentId);
      await incidentResponseService?.updateIncidentStatus(incidentId, { 
        status: 'resolved',
        notes: 'Incident resolved by administrator'
      });
      await onRefresh();
    } catch (error) {
      console.error('Failed to resolve incident:', error);
    } finally {
      setProcessing(null);
    }
  };

  const getThreatLevelColor = (level) => {
    const colors = {
      critical: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200',
      high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200',
      medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200',
      low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200'
    };
    return colors?.[level] || colors?.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      detected: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      escalated: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      dismissed: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return colors?.[status] || colors?.detected;
  };

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
          >
            <option value="all">All Statuses</option>
            <option value="detected">Detected</option>
            <option value="escalated">Escalated</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </Select>
          <Select
            value={filterThreatLevel}
            onChange={(e) => setFilterThreatLevel(e?.target?.value)}
          >
            <option value="all">All Threat Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredIncidents?.map((incident) => (
          <div key={incident?.id} className={`card border-l-4 ${
            incident?.threatLevel === 'critical' ? 'border-l-red-500' :
            incident?.threatLevel === 'high' ? 'border-l-orange-500' :
            incident?.threatLevel === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getThreatLevelColor(incident?.threatLevel)}`}>
                    {incident?.threatLevel?.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(incident?.status)}`}>
                    {incident?.status?.replace(/_/g, ' ')?.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(incident?.detectedAt)?.toLocaleString()}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{incident?.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{incident?.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="Tag" size={12} />
                    {incident?.incidentType?.replace(/_/g, ' ')}
                  </span>
                  {incident?.automatedActionsTaken?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Icon name="Zap" size={12} />
                      {incident?.automatedActionsTaken?.length} automated actions
                    </span>
                  )}
                  {incident?.stakeholdersNotified?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Icon name="Users" size={12} />
                      {incident?.stakeholdersNotified?.length} stakeholders notified
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {incident?.status === 'detected' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ArrowUp"
                    onClick={() => handleEscalate(incident?.id)}
                    disabled={processing === incident?.id}
                  >
                    Escalate
                  </Button>
                )}
                {(incident?.status === 'detected' || incident?.status === 'escalated' || incident?.status === 'in_progress') && (
                  <Button
                    variant="primary"
                    size="sm"
                    iconName="CheckCircle2"
                    onClick={() => handleResolve(incident?.id)}
                    disabled={processing === incident?.id}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIncidents?.length === 0 && (
        <div className="card text-center py-12">
          <Icon name="CheckCircle2" size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">No active incidents</h3>
          <p className="text-sm text-muted-foreground">All systems operating normally</p>
        </div>
      )}
    </div>
  );
};

export default ActiveIncidentsPanel;