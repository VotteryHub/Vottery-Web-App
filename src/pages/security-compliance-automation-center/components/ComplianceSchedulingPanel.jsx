import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceSchedulingPanel = ({ scheduledReports, onSchedule, loading }) => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [formData, setFormData] = useState({
    reportType: 'gdpr',
    frequency: 'monthly',
    recipients: '',
    format: 'pdf'
  });

  const mockScheduledReports = scheduledReports?.length > 0 ? scheduledReports : [
    {
      id: 1,
      reportType: 'GDPR Compliance Report',
      frequency: 'Monthly',
      nextRun: new Date(Date?.now() + 86400000 * 5)?.toISOString(),
      lastRun: new Date(Date?.now() - 86400000 * 25)?.toISOString(),
      recipients: ['legal@vottery.com', 'compliance@vottery.com'],
      format: 'PDF',
      status: 'Active',
      autoSubmit: true
    },
    {
      id: 2,
      reportType: 'PCI-DSS Audit Report',
      frequency: 'Quarterly',
      nextRun: new Date(Date?.now() + 86400000 * 45)?.toISOString(),
      lastRun: new Date(Date?.now() - 86400000 * 45)?.toISOString(),
      recipients: ['security@vottery.com', 'cto@vottery.com'],
      format: 'PDF + CSV',
      status: 'Active',
      autoSubmit: true
    },
    {
      id: 3,
      reportType: 'Data Breach Notification Summary',
      frequency: 'Weekly',
      nextRun: new Date(Date?.now() + 86400000 * 2)?.toISOString(),
      lastRun: new Date(Date?.now() - 86400000 * 5)?.toISOString(),
      recipients: ['dpo@vottery.com', 'security@vottery.com'],
      format: 'Email Summary',
      status: 'Active',
      autoSubmit: false
    },
    {
      id: 4,
      reportType: 'Regulatory Submission Log',
      frequency: 'Monthly',
      nextRun: new Date(Date?.now() + 86400000 * 10)?.toISOString(),
      lastRun: new Date(Date?.now() - 86400000 * 20)?.toISOString(),
      recipients: ['legal@vottery.com'],
      format: 'Excel',
      status: 'Active',
      autoSubmit: true
    }
  ];

  const handleScheduleReport = async () => {
    await onSchedule?.(formData);
    setShowScheduleForm(false);
    setFormData({ reportType: 'gdpr', frequency: 'monthly', recipients: '', format: 'pdf' });
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50';
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
              <Icon name="Calendar" size={24} className="text-purple-600" />
              Compliance Scheduling
            </h3>
            <p className="text-sm text-muted-foreground">
              Automated compliance report scheduling and submission workflows
            </p>
          </div>
          <Button onClick={() => setShowScheduleForm(!showScheduleForm)} className="flex items-center gap-2">
            <Icon name="Plus" size={16} />
            Schedule New Report
          </Button>
        </div>

        {showScheduleForm && (
          <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">Schedule Compliance Report</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Report Type</label>
                <select
                  value={formData?.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e?.target?.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="gdpr">GDPR Compliance Report</option>
                  <option value="pcidss">PCI-DSS Audit Report</option>
                  <option value="breach">Data Breach Summary</option>
                  <option value="submission">Regulatory Submission Log</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Frequency</label>
                <select
                  value={formData?.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e?.target?.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Recipients (comma-separated)</label>
                <input
                  type="text"
                  value={formData?.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e?.target?.value })}
                  placeholder="legal@vottery.com, compliance@vottery.com"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Format</label>
                <select
                  value={formData?.format}
                  onChange={(e) => setFormData({ ...formData, format: e?.target?.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                  <option value="email">Email Summary</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Button onClick={handleScheduleReport} className="flex items-center gap-2">
                <Icon name="Check" size={16} />
                Schedule Report
              </Button>
              <Button onClick={() => setShowScheduleForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">Active Schedules</span>
              <Icon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">{mockScheduledReports?.length}</div>
            <div className="text-xs text-green-600 mt-1">All running on time</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600 font-medium">Next Report</span>
              <Icon name="Clock" size={20} className="text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-900">2 days</div>
            <div className="text-xs text-blue-600 mt-1">Data Breach Summary</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-600 font-medium">Auto-Submissions</span>
              <Icon name="Send" size={20} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-900">3</div>
            <div className="text-xs text-purple-600 mt-1">Automated workflows</div>
          </div>
        </div>

        <div className="space-y-3">
          {mockScheduledReports?.map((report) => (
            <div key={report?.id} className="bg-muted/30 border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-base font-semibold text-foreground">{report?.reportType}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report?.status)}`}>
                      {report?.status}
                    </span>
                    {report?.autoSubmit && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50">
                        Auto-Submit
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="ml-2 font-medium text-foreground">{report?.frequency}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Format:</span>
                      <span className="ml-2 font-medium text-foreground">{report?.format}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Next Run:</span>
                      <span className="ml-2 font-medium text-foreground">
                        {new Date(report?.nextRun)?.toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Run:</span>
                      <span className="ml-2 font-medium text-foreground">
                        {new Date(report?.lastRun)?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">Recipients: </span>
                    <span className="text-xs text-foreground">{report?.recipients?.join(', ')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Icon name="Play" size={14} />
                    Run Now
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Icon name="Edit" size={14} />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceSchedulingPanel;