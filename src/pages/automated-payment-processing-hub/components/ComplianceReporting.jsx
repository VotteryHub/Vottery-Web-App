import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const ComplianceReporting = ({ data }) => {
  const [generatingReport, setGeneratingReport] = useState(false);

  const complianceMetrics = [
    { label: 'Audit Trail Records', value: '12,458', icon: 'FileText', color: 'bg-primary/10 text-primary' },
    { label: 'Tax Forms Generated', value: '342', icon: 'Receipt', color: 'bg-secondary/10 text-secondary' },
    { label: 'Regulatory Submissions', value: '18', icon: 'Send', color: 'bg-success/10 text-success' },
    { label: 'Compliance Score', value: '98.5%', icon: 'Shield', color: 'bg-accent/10 text-accent' }
  ];

  const regulatoryReports = [
    { id: 1, type: 'AML Report', authority: 'FinCEN', frequency: 'Monthly', lastSubmitted: '2026-01-15', nextDue: '2026-02-15', status: 'submitted' },
    { id: 2, type: 'Tax Withholding', authority: 'IRS', frequency: 'Quarterly', lastSubmitted: '2026-01-10', nextDue: '2026-04-15', status: 'submitted' },
    { id: 3, type: 'Transaction Report', authority: 'SEC', frequency: 'Weekly', lastSubmitted: '2026-01-20', nextDue: '2026-01-27', status: 'pending' },
    { id: 4, type: 'Cross-Border Payments', authority: 'OFAC', frequency: 'Monthly', lastSubmitted: '2026-01-12', nextDue: '2026-02-12', status: 'submitted' }
  ];

  const taxForms = [
    { form: '1099-MISC', count: 186, status: 'generated', deadline: '2026-01-31' },
    { form: '1099-K', count: 94, status: 'generated', deadline: '2026-01-31' },
    { form: 'W-9', count: 342, status: 'collected', deadline: 'Ongoing' },
    { form: 'W-8BEN', count: 78, status: 'collected', deadline: 'Ongoing' }
  ];

  const handleGenerateReport = async (reportType) => {
    setGeneratingReport(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Generating ${reportType} report...`);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': case'generated': case'collected':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceMetrics?.map((metric, index) => (
          <div key={index} className="card p-6">
            <div className={`w-12 h-12 rounded-full ${metric?.color} flex items-center justify-center mb-4`}>
              <Icon name={metric?.icon} size={24} />
            </div>
            <p className="text-sm text-muted-foreground mb-1">{metric?.label}</p>
            <p className="text-3xl font-heading font-bold text-foreground font-data">
              {metric?.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Regulatory Documentation
          </h2>
          <Button
            variant="default"
            size="sm"
            iconName="Download"
            onClick={() => handleGenerateReport('regulatory')}
            disabled={generatingReport}
          >
            Generate All Reports
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Report Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Authority</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Frequency</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Last Submitted</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Next Due</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {regulatoryReports?.map((report) => (
                <tr key={report?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{report?.type}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{report?.authority}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{report?.frequency}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{report?.lastSubmitted}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{report?.nextDue}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report?.status)}`}>
                      {report?.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="ghost" size="sm" iconName="Download">
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Tax Forms
            </h2>
            <Icon name="Receipt" size={24} className="text-secondary" />
          </div>
          <div className="space-y-3">
            {taxForms?.map((form, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{form?.form}</p>
                  <p className="text-xs text-muted-foreground">Deadline: {form?.deadline}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground font-data mb-1">{form?.count}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(form?.status)}`}>
                    {form?.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Audit Trail
            </h2>
            <Icon name="FileSearch" size={24} className="text-primary" />
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-success/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="text-sm font-medium text-foreground">Complete Transaction History</span>
              </div>
              <p className="text-xs text-muted-foreground">All transactions logged with timestamps and user details</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Lock" size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Immutable Records</span>
              </div>
              <p className="text-xs text-muted-foreground">Blockchain-backed audit trail for compliance verification</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Search" size={20} className="text-secondary" />
                <span className="text-sm font-medium text-foreground">Advanced Search</span>
              </div>
              <p className="text-xs text-muted-foreground">Query by date, user, amount, or transaction type</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Automated Submission
          </h2>
          <Icon name="Send" size={24} className="text-success" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-lg bg-success/10">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Calendar" size={20} className="text-success" />
              <span className="text-sm font-medium text-foreground">Scheduled Reports</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground mb-1 font-data">18</p>
            <p className="text-xs text-muted-foreground">Automated submissions this month</p>
          </div>
          <div className="p-6 rounded-lg bg-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Clock" size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Pending Submissions</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground mb-1 font-data">3</p>
            <p className="text-xs text-muted-foreground">Due within next 7 days</p>
          </div>
          <div className="p-6 rounded-lg bg-accent/10">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="TrendingUp" size={20} className="text-accent" />
              <span className="text-sm font-medium text-foreground">Compliance Rate</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground mb-1 font-data">100%</p>
            <p className="text-xs text-muted-foreground">On-time submission rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceReporting;