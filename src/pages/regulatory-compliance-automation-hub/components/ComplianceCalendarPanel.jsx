import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceCalendarPanel = ({ filings, loading }) => {
  if (loading) {
    return <div className="bg-card border border-border rounded-lg p-6 animate-pulse"><div className="h-64 bg-muted rounded"></div></div>;
  }

  const upcomingDeadlines = filings?.filter(f => f?.dueDate && new Date(f?.dueDate) > new Date())?.sort((a, b) => new Date(a?.dueDate) - new Date(b?.dueDate));

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Calendar" size={20} />
        Upcoming Compliance Deadlines
      </h3>
      <div className="space-y-3">
        {upcomingDeadlines?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="CheckCircle" size={48} className="mx-auto mb-4" />
            <p>No upcoming deadlines</p>
          </div>
        ) : (
          upcomingDeadlines?.map((filing) => {
            const daysUntilDue = Math.ceil((new Date(filing?.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
            const isUrgent = daysUntilDue <= 7;

            return (
              <div key={filing?.id} className={`flex items-start gap-3 p-4 border rounded-lg ${
                isUrgent ? 'border-red-500/50 bg-red-500/5' : 'border-border'
              }`}>
                <Icon name={isUrgent ? 'AlertCircle' : 'Clock'} className={isUrgent ? 'text-red-500' : 'text-yellow-500'} size={20} />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{filing?.filingType?.replace('_', ' ')?.toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">{filing?.jurisdiction} - {filing?.regulatoryAuthority}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {new Date(filing?.dueDate)?.toLocaleDateString()} ({daysUntilDue} days)
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ComplianceCalendarPanel;