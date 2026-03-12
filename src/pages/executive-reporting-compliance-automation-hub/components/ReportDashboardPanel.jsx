import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportDashboardPanel = ({ reports, deliveryStats, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const statusCounts = {
    draft: reports?.filter(r => r?.status === 'draft')?.length || 0,
    pending: reports?.filter(r => r?.status === 'pending_approval')?.length || 0,
    approved: reports?.filter(r => r?.status === 'approved')?.length || 0,
    sent: reports?.filter(r => r?.status === 'sent')?.length || 0
  };

  const recentReports = reports?.slice(0, 5);

  const getStatusBadge = (status) => {
    const badges = {
      draft: { color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Draft' },
      pending_approval: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending Approval' },
      approved: { color: 'text-green-500', bg: 'bg-green-500/10', label: 'Approved' },
      sent: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Sent' }
    };
    return badges?.[status] || badges?.draft;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="FileText" size={20} className="text-gray-500" />
            <span className="text-sm text-muted-foreground">Draft Reports</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">{statusCounts?.draft}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Clock" size={20} className="text-yellow-500" />
            <span className="text-sm text-muted-foreground">Pending Approval</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">{statusCounts?.pending}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="CheckCircle" size={20} className="text-green-500" />
            <span className="text-sm text-muted-foreground">Approved</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">{statusCounts?.approved}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Send" size={20} className="text-blue-500" />
            <span className="text-sm text-muted-foreground">Sent</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">{statusCounts?.sent}</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">Recent Reports</h3>
          <Button variant="outline" size="sm" iconName="Plus">
            Create New Report
          </Button>
        </div>
        <div className="space-y-3">
          {recentReports?.map((report) => {
            const badge = getStatusBadge(report?.status);
            return (
              <div key={report?.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-heading font-semibold text-foreground mb-1">{report?.title}</h4>
                    <p className="text-sm text-muted-foreground">{report?.summary}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${badge?.bg} ml-4`}>
                    <span className={`text-xs font-medium ${badge?.color}`}>{badge?.label}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      <Icon name="FileText" size={12} className="inline mr-1" />
                      {report?.reportType?.replace('_', ' ')?.toUpperCase()}
                    </span>
                    <span>
                      <Icon name="Calendar" size={12} className="inline mr-1" />
                      {new Date(report?.createdAt)?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" iconName="Eye">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Send">
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Delivery Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">{deliveryStats?.totalDeliveries || 0}</div>
            <div className="text-sm text-muted-foreground">Total Deliveries</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-green-500 mb-1">{deliveryStats?.successfulDeliveries || 0}</div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">{deliveryStats?.deliveryRate || 0}%</div>
            <div className="text-sm text-muted-foreground">Delivery Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDashboardPanel;