import React from 'react';
import Icon from '../../../components/AppIcon';

const TicketStatisticsPanel = ({ statistics, tickets }) => {
  if (!statistics) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground text-center">No statistics data available</p>
      </div>
    );
  }

  const ticketsByType = tickets?.reduce((acc, ticket) => {
    acc[ticket?.type] = (acc?.[ticket?.type] || 0) + 1;
    return acc;
  }, {});

  const ticketsByStatus = tickets?.reduce((acc, ticket) => {
    acc[ticket?.status] = (acc?.[ticket?.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-6">
          Support Analytics & Performance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Icon name="Inbox" size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Tickets</p>
                <p className="text-2xl font-bold text-foreground">{statistics?.total || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Icon name="Clock" size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Avg Response</p>
                <p className="text-2xl font-bold text-foreground">{statistics?.avgResponseTime?.toFixed(0)}m</p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Icon name="CheckCircle" size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Resolution Time</p>
                <p className="text-2xl font-bold text-foreground">{statistics?.avgResolutionTime?.toFixed(0)}m</p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Icon name="Star" size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Satisfaction</p>
                <p className="text-2xl font-bold text-foreground">{statistics?.satisfactionScore?.toFixed(1)}/5</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-4">
              Tickets by Type
            </h3>
            <div className="space-y-3">
              {Object.entries(ticketsByType || {})?.map(([type, count]) => {
                const percentage = (count / (statistics?.total || 1)) * 100;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground capitalize">
                        {type?.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-bold text-foreground">{count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-4">
              Tickets by Status
            </h3>
            <div className="space-y-3">
              {Object.entries(ticketsByStatus || {})?.map(([status, count]) => {
                const percentage = (count / (statistics?.total || 1)) * 100;
                const statusColors = {
                  open: 'from-blue-500 to-blue-600',
                  in_progress: 'from-yellow-500 to-yellow-600',
                  escalated: 'from-red-500 to-red-600',
                  resolved: 'from-green-500 to-green-600'
                };
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground capitalize">
                        {status?.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-bold text-foreground">{count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${statusColors?.[status] || 'from-gray-500 to-gray-600'} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          SLA Compliance
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Overall SLA Compliance</span>
              <span className="text-sm font-bold text-foreground">{statistics?.slaCompliance?.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  statistics?.slaCompliance >= 90
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : statistics?.slaCompliance >= 70
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :'bg-gradient-to-r from-red-500 to-red-600'
                }`}
                style={{ width: `${statistics?.slaCompliance}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Performance Insights
        </h3>
        <div className="space-y-3">
          {statistics?.avgResponseTime < 30 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <Icon name="CheckCircle" size={20} className="text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-500 mb-1">Excellent Response Time</p>
                <p className="text-xs text-muted-foreground">
                  Your team maintains an average response time under 30 minutes, exceeding industry standards.
                </p>
              </div>
            </div>
          )}
          {statistics?.satisfactionScore >= 4.5 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Icon name="Star" size={20} className="text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-500 mb-1">High Customer Satisfaction</p>
                <p className="text-xs text-muted-foreground">
                  Customer satisfaction score of {statistics?.satisfactionScore?.toFixed(1)}/5 indicates excellent service quality.
                </p>
              </div>
            </div>
          )}
          {statistics?.slaCompliance < 90 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Icon name="AlertTriangle" size={20} className="text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-500 mb-1">SLA Compliance Needs Improvement</p>
                <p className="text-xs text-muted-foreground">
                  Current SLA compliance is {statistics?.slaCompliance?.toFixed(1)}%. Consider optimizing workflows to reach 90%+ target.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketStatisticsPanel;