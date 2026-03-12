import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { incidentResponseService } from '../../../services/incidentResponseService';

const RemediationTrackingPanel = ({ incidents, onRefresh }) => {
  const incidentsWithRemediation = incidents?.filter(i => i?.remediationSteps && i?.remediationSteps?.length > 0);

  const handleAddRemediationStep = async (incidentId) => {
    const step = {
      action: 'Manual remediation step added',
      status: 'pending',
      assignedTo: 'Security Team'
    };

    await incidentResponseService?.addRemediationStep(incidentId, step);
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">Remediation Tracking</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Track remediation progress and recovery procedures for all active incidents
        </p>

        {incidentsWithRemediation?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="CheckCircle2" size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">No active remediation</h3>
            <p className="text-sm text-muted-foreground">All incidents have been resolved</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidentsWithRemediation?.map((incident) => (
              <div key={incident?.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{incident?.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        incident?.threatLevel === 'critical' ? 'bg-red-100 text-red-700' :
                        incident?.threatLevel === 'high'? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {incident?.threatLevel?.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {incident?.remediationSteps?.length} remediation steps
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Plus"
                    onClick={() => handleAddRemediationStep(incident?.id)}
                  >
                    Add Step
                  </Button>
                </div>

                <div className="space-y-3">
                  {incident?.remediationSteps?.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step?.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                        step?.status === 'in_progress'? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-900/30'
                      }`}>
                        {step?.status === 'completed' ? (
                          <Icon name="CheckCircle2" size={16} className="text-green-600" />
                        ) : step?.status === 'in_progress' ? (
                          <Icon name="Loader" size={16} className="text-blue-600 animate-spin" />
                        ) : (
                          <Icon name="Circle" size={16} className="text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground mb-1">{step?.action}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {step?.assignedTo && (
                            <span className="flex items-center gap-1">
                              <Icon name="User" size={12} />
                              {step?.assignedTo}
                            </span>
                          )}
                          {step?.timestamp && (
                            <span className="flex items-center gap-1">
                              <Icon name="Clock" size={12} />
                              {new Date(step?.timestamp)?.toLocaleString()}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            step?.status === 'completed' ? 'bg-green-100 text-green-700' :
                            step?.status === 'in_progress'? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {step?.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {incident?.remediationStatus && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Remediation Status:</span> {incident?.remediationStatus}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemediationTrackingPanel;