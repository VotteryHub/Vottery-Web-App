import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const EngagementFunnelPanel = ({ timeRange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockData = {
        conversionFunnels: [
          {
            name: 'Election Participation Funnel',
            stages: [
              { stage: 'Landing Page', users: 50000, conversionRate: 100 },
              { stage: 'Browse Elections', users: 42000, conversionRate: 84 },
              { stage: 'View Election Details', users: 35000, conversionRate: 70 },
              { stage: 'Start Voting', users: 28000, conversionRate: 56 },
              { stage: 'Complete Vote', users: 25000, conversionRate: 50 }
            ]
          },
          {
            name: 'Creator Registration Funnel',
            stages: [
              { stage: 'Visit Creator Page', users: 10000, conversionRate: 100 },
              { stage: 'Start Registration', users: 7500, conversionRate: 75 },
              { stage: 'Complete Profile', users: 6000, conversionRate: 60 },
              { stage: 'Verify Identity', users: 5200, conversionRate: 52 },
              { stage: 'Create First Election', users: 4500, conversionRate: 45 }
            ]
          }
        ],
        behavioralFlow: [
          { from: 'Home', to: 'Elections', users: 15678, dropOff: 12.3 },
          { from: 'Elections', to: 'Vote', users: 12456, dropOff: 20.5 },
          { from: 'Vote', to: 'Results', users: 9876, dropOff: 20.7 },
          { from: 'Results', to: 'Share', users: 7654, dropOff: 22.5 }
        ],
        cohortAnalysis: [
          { cohort: 'Week 1', retention: [100, 85, 72, 65, 58] },
          { cohort: 'Week 2', retention: [100, 88, 76, 68, 62] },
          { cohort: 'Week 3', retention: [100, 90, 78, 72, 65] },
          { cohort: 'Week 4', retention: [100, 92, 82, 75, 68] }
        ]
      };

      setData(mockData);
    } catch (error) {
      console.error('Error loading engagement funnel data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conversion Funnels */}
      {data?.conversionFunnels?.map((funnel, funnelIndex) => (
        <div key={funnelIndex} className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
            {funnel?.name}
          </h3>
          <div className="space-y-4">
            {funnel?.stages?.map((stage, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{stage?.stage}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {stage?.users?.toLocaleString()} users
                    </span>
                    <span className="text-sm font-medium text-primary">
                      {stage?.conversionRate}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${stage?.conversionRate}%` }}
                  />
                </div>
                {index < funnel?.stages?.length - 1 && (
                  <div className="flex items-center justify-center my-2">
                    <Icon name="ChevronDown" size={20} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Behavioral Flow */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          User Behavioral Flow
        </h3>
        <div className="space-y-4">
          {data?.behavioralFlow?.map((flow, index) => (
            <div key={index} className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-md font-medium">
                    {flow?.from}
                  </span>
                  <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-md font-medium">
                    {flow?.to}
                  </span>
                </div>
                <span className="text-sm text-destructive">{flow?.dropOff}% drop-off</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Users" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {flow?.users?.toLocaleString()} users completed this transition
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Analysis */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Cohort Retention Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Cohort</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-foreground">Day 0</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-foreground">Day 1</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-foreground">Day 3</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-foreground">Day 7</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-foreground">Day 14</th>
              </tr>
            </thead>
            <tbody>
              {data?.cohortAnalysis?.map((cohort, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{cohort?.cohort}</td>
                  {cohort?.retention?.map((rate, rateIndex) => (
                    <td key={rateIndex} className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rate >= 80 ? 'bg-success/10 text-success' :
                        rate >= 60 ? 'bg-warning/10 text-warning': 'bg-destructive/10 text-destructive'
                      }`}>
                        {rate}%
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EngagementFunnelPanel;