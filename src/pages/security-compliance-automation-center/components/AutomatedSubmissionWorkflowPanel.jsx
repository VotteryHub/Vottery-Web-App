import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AutomatedSubmissionWorkflowPanel = ({ workflows, onSubmit, loading }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  const mockWorkflows = workflows?.length > 0 ? workflows : [
    {
      id: 1,
      name: 'GDPR Data Protection Authority Submission',
      description: 'Automated submission of GDPR compliance reports to EU Data Protection Authorities',
      status: 'Active',
      lastExecution: new Date(Date?.now() - 86400000 * 7)?.toISOString(),
      nextExecution: new Date(Date?.now() + 86400000 * 23)?.toISOString(),
      successRate: 100,
      totalExecutions: 12,
      steps: [
        { id: 1, name: 'Generate GDPR Audit Report', status: 'Completed', duration: '2 min' },
        { id: 2, name: 'Legal Team Review', status: 'Completed', duration: '4 hours' },
        { id: 3, name: 'Submit to DPA Portal', status: 'Completed', duration: '1 min' },
        { id: 4, name: 'Send Confirmation Email', status: 'Completed', duration: '10 sec' }
      ],
      recipients: ['EU Data Protection Board', 'National DPA'],
      automationLevel: 'Full'
    },
    {
      id: 2,
      name: 'PCI-DSS Quarterly Compliance Filing',
      description: 'Quarterly submission of PCI-DSS compliance attestation to acquiring bank',
      status: 'Active',
      lastExecution: new Date(Date?.now() - 86400000 * 45)?.toISOString(),
      nextExecution: new Date(Date?.now() + 86400000 * 45)?.toISOString(),
      successRate: 100,
      totalExecutions: 4,
      steps: [
        { id: 1, name: 'Generate PCI-DSS Report', status: 'Pending', duration: '-' },
        { id: 2, name: 'Security Team Validation', status: 'Pending', duration: '-' },
        { id: 3, name: 'Submit to Acquiring Bank', status: 'Pending', duration: '-' },
        { id: 4, name: 'Archive Submission', status: 'Pending', duration: '-' }
      ],
      recipients: ['Acquiring Bank', 'Payment Processor'],
      automationLevel: 'Semi-Automated'
    },
    {
      id: 3,
      name: 'Data Breach Notification Workflow',
      description: 'Automated 72-hour breach notification to supervisory authorities and affected users',
      status: 'Standby',
      lastExecution: null,
      nextExecution: 'Triggered on breach detection',
      successRate: null,
      totalExecutions: 0,
      steps: [
        { id: 1, name: 'Breach Detection & Assessment', status: 'Standby', duration: '-' },
        { id: 2, name: 'Generate Breach Report', status: 'Standby', duration: '-' },
        { id: 3, name: 'Notify Supervisory Authority (72h)', status: 'Standby', duration: '-' },
        { id: 4, name: 'Notify Affected Data Subjects', status: 'Standby', duration: '-' },
        { id: 5, name: 'Document Incident Response', status: 'Standby', duration: '-' }
      ],
      recipients: ['Supervisory Authority', 'Affected Users', 'Legal Team'],
      automationLevel: 'Full'
    },
    {
      id: 4,
      name: 'Annual Regulatory Compliance Package',
      description: 'Comprehensive annual compliance submission to multiple regulatory bodies',
      status: 'Active',
      lastExecution: new Date(Date?.now() - 86400000 * 180)?.toISOString(),
      nextExecution: new Date(Date?.now() + 86400000 * 185)?.toISOString(),
      successRate: 100,
      totalExecutions: 2,
      steps: [
        { id: 1, name: 'Compile Annual Reports', status: 'Pending', duration: '-' },
        { id: 2, name: 'Executive Review', status: 'Pending', duration: '-' },
        { id: 3, name: 'Legal Counsel Approval', status: 'Pending', duration: '-' },
        { id: 4, name: 'Submit to Regulators', status: 'Pending', duration: '-' },
        { id: 5, name: 'Archive & Audit Trail', status: 'Pending', duration: '-' }
      ],
      recipients: ['Financial Regulator', 'Data Protection Authority', 'Gaming Commission'],
      automationLevel: 'Semi-Automated'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-50';
      case 'Standby':
        return 'text-blue-600 bg-blue-50';
      case 'Completed':
        return 'text-green-600 bg-green-50';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleExecuteWorkflow = async (workflowId) => {
    await onSubmit?.(workflowId);
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
        <div className="h-96 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <Icon name="Workflow" size={24} className="text-indigo-600" />
              Automated Submission Workflows
            </h3>
            <p className="text-sm text-muted-foreground">
              Automated regulatory submission workflows for legal and compliance teams
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">Active Workflows</span>
              <Icon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">3</div>
            <div className="text-xs text-green-600 mt-1">Running smoothly</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600 font-medium">Success Rate</span>
              <Icon name="TrendingUp" size={20} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900">100%</div>
            <div className="text-xs text-blue-600 mt-1">18 successful submissions</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-600 font-medium">Next Submission</span>
              <Icon name="Calendar" size={20} className="text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-900">23 days</div>
            <div className="text-xs text-purple-600 mt-1">GDPR DPA Filing</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yellow-600 font-medium">Avg. Processing</span>
              <Icon name="Clock" size={20} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-900">4.2h</div>
            <div className="text-xs text-yellow-600 mt-1">Per workflow</div>
          </div>
        </div>

        <div className="space-y-4">
          {mockWorkflows?.map((workflow) => (
            <div key={workflow?.id} className="bg-muted/30 border border-border rounded-lg p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-foreground">{workflow?.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow?.status)}`}>
                      {workflow?.status}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-indigo-600 bg-indigo-50">
                      {workflow?.automationLevel}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{workflow?.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Last Execution:</span>
                      <span className="ml-2 font-medium text-foreground">
                        {workflow?.lastExecution ? new Date(workflow?.lastExecution)?.toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Next Execution:</span>
                      <span className="ml-2 font-medium text-foreground">
                        {typeof workflow?.nextExecution === 'string' ? workflow?.nextExecution : new Date(workflow?.nextExecution)?.toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="ml-2 font-medium text-green-600">
                        {workflow?.successRate !== null ? `${workflow?.successRate}%` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setSelectedWorkflow(selectedWorkflow === workflow?.id ? null : workflow?.id)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Icon name={selectedWorkflow === workflow?.id ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    {selectedWorkflow === workflow?.id ? 'Hide' : 'View'} Steps
                  </Button>
                  {workflow?.status === 'Active' && (
                    <Button
                      size="sm"
                      onClick={() => handleExecuteWorkflow(workflow?.id)}
                      className="flex items-center gap-2"
                    >
                      <Icon name="Play" size={14} />
                      Execute Now
                    </Button>
                  )}
                </div>
              </div>

              {selectedWorkflow === workflow?.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h5 className="text-sm font-semibold text-foreground mb-3">Workflow Steps</h5>
                  <div className="space-y-2">
                    {workflow?.steps?.map((step, index) => (
                      <div key={step?.id} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">{step?.name}</div>
                          <div className="text-xs text-muted-foreground">Duration: {step?.duration}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step?.status)}`}>
                          {step?.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs font-semibold text-blue-900 mb-1">Recipients</div>
                    <div className="text-xs text-blue-700">{workflow?.recipients?.join(' • ')}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="CheckCircle" size={20} className="text-green-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-900 mb-1">Automated Submission Benefits</h4>
            <p className="text-xs text-green-700">
              Automated workflows ensure timely regulatory submissions, reduce manual errors, maintain comprehensive audit trails, 
              and free up legal/compliance teams to focus on strategic initiatives. All submissions are tracked, archived, and available for audit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedSubmissionWorkflowPanel;