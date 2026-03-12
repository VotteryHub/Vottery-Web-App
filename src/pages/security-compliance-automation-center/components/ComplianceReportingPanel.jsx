import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceReportingPanel = ({ metrics, loading }) => {
  const mockMetrics = metrics || {
    totalReports: 48,
    onTimeSubmissions: 47,
    avgResponseTime: '3.2 hours',
    complianceScore: 98,
    recentReports: [
      {
        id: 1,
        title: 'GDPR Monthly Compliance Report',
        type: 'GDPR',
        generatedAt: new Date()?.toISOString(),
        submittedTo: 'EU Data Protection Board',
        status: 'Submitted',
        size: '2.4 MB'
      },
      {
        id: 2,
        title: 'PCI-DSS Q1 2026 Audit',
        type: 'PCI-DSS',
        generatedAt: new Date(Date?.now() - 86400000)?.toISOString(),
        submittedTo: 'Acquiring Bank',
        status: 'Approved',
        size: '5.1 MB'
      },
      {
        id: 3,
        title: 'Data Processing Activities Record',
        type: 'GDPR',
        generatedAt: new Date(Date?.now() - 86400000 * 2)?.toISOString(),
        submittedTo: 'Internal Audit',
        status: 'Completed',
        size: '1.8 MB'
      }
    ]
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
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Icon name="FileText" size={24} className="text-green-600" />
          Compliance Reporting
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600 font-medium">Total Reports</span>
              <Icon name="FileText" size={20} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900">{mockMetrics?.totalReports}</div>
            <div className="text-xs text-blue-600 mt-1">Last 12 months</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">On-Time Rate</span>
              <Icon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">
              {Math.round((mockMetrics?.onTimeSubmissions / mockMetrics?.totalReports) * 100)}%
            </div>
            <div className="text-xs text-green-600 mt-1">{mockMetrics?.onTimeSubmissions} of {mockMetrics?.totalReports}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-600 font-medium">Avg. Response</span>
              <Icon name="Clock" size={20} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-900">{mockMetrics?.avgResponseTime}</div>
            <div className="text-xs text-purple-600 mt-1">Processing time</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yellow-600 font-medium">Compliance Score</span>
              <Icon name="Award" size={20} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-900">{mockMetrics?.complianceScore}%</div>
            <div className="text-xs text-yellow-600 mt-1">Overall rating</div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4">Recent Reports</h4>
          <div className="space-y-3">
            {mockMetrics?.recentReports?.map((report) => (
              <div key={report?.id} className="bg-muted/30 border border-border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="FileText" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">{report?.title}</h5>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(report?.generatedAt)?.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{report?.submittedTo}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{report?.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-50">
                    {report?.status}
                  </span>
                  <Icon name="Download" size={16} className="text-muted-foreground cursor-pointer hover:text-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceReportingPanel;