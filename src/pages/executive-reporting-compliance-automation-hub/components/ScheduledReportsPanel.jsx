import React from 'react';
import Icon from '../../../components/AppIcon';

const ScheduledReportsPanel = ({ reports, loading }) => {
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

  const scheduledReports = reports?.filter(r => r?.scheduledSendAt);

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Scheduled Reports</h2>
        <div className="space-y-3">
          {scheduledReports?.length > 0 ? (
            scheduledReports?.map((report) => (
              <div key={report?.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-foreground mb-1">{report?.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{report?.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        <Icon name="Calendar" size={12} className="inline mr-1" />
                        Scheduled: {new Date(report?.scheduledSendAt)?.toLocaleString()}
                      </span>
                      <span>
                        <Icon name="Users" size={12} className="inline mr-1" />
                        {report?.recipients?.length || 0} recipients
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No scheduled reports</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduledReportsPanel;