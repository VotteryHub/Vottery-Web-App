import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BehavioralAnalysisPanel = () => {
  const [loading, setLoading] = useState(false);
  const [behavioralData, setBehavioralData] = useState(null);

  useEffect(() => {
    loadBehavioralData();
  }, []);

  const loadBehavioralData = async () => {
    setLoading(true);
    try {
      const mockData = {
        interactionPatterns: [
          {
            pattern: 'Peak Voting Hours',
            description: '6 PM - 9 PM weekdays',
            frequency: 'High',
            confidence: 94.2
          },
          {
            pattern: 'Category Preference',
            description: 'Environment > Tech > Social',
            frequency: 'Consistent',
            confidence: 91.8
          },
          {
            pattern: 'Engagement Style',
            description: 'Deep reader, thorough voter',
            frequency: 'Very High',
            confidence: 89.5
          }
        ],
        votingFrequency: {
          daily: 2.3,
          weekly: 16.1,
          monthly: 68.4,
          trend: 'Increasing'
        },
        preferenceEvolution: {
          stable: 78,
          evolving: 15,
          exploring: 7,
          overallStability: 'High'
        },
        engagementDepth: {
          avgTimePerElection: '8m 45s',
          readCompletionRate: 87.3,
          detailViewRate: 92.1,
          commentEngagement: 45.6
        },
        predictiveModeling: {
          nextVoteCategory: 'Environment',
          nextVoteProbability: 87.4,
          churnRisk: 'Low',
          lifetimeValue: 'High'
        }
      };
      setBehavioralData(mockData);
    } catch (error) {
      console.error('Error loading behavioral data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Behavioral Pattern Analysis
        </h2>
        <Button onClick={loadBehavioralData}>
          <Icon name="RefreshCw" size={16} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader" size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Activity" size={20} className="text-primary" />
                Voting Frequency Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Daily Average</span>
                  <span className="text-lg font-bold text-foreground">{behavioralData?.votingFrequency?.daily} votes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Weekly Average</span>
                  <span className="text-lg font-bold text-foreground">{behavioralData?.votingFrequency?.weekly} votes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Average</span>
                  <span className="text-lg font-bold text-foreground">{behavioralData?.votingFrequency?.monthly} votes</span>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Trend</span>
                    <span className="px-3 py-1 text-sm font-medium bg-success/10 text-success rounded-md">
                      {behavioralData?.votingFrequency?.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="TrendingUp" size={20} className="text-primary" />
                Preference Evolution
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Stable Preferences</span>
                    <span className="text-sm font-bold text-foreground">{behavioralData?.preferenceEvolution?.stable}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: `${behavioralData?.preferenceEvolution?.stable}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Evolving Interests</span>
                    <span className="text-sm font-bold text-foreground">{behavioralData?.preferenceEvolution?.evolving}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{ width: `${behavioralData?.preferenceEvolution?.evolving}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Exploring New Topics</span>
                    <span className="text-sm font-bold text-foreground">{behavioralData?.preferenceEvolution?.exploring}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${behavioralData?.preferenceEvolution?.exploring}%` }} />
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Overall Stability</span>
                    <span className="px-3 py-1 text-sm font-medium bg-success/10 text-success rounded-md">
                      {behavioralData?.preferenceEvolution?.overallStability}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Target" size={20} className="text-primary" />
              Identified Interaction Patterns
            </h3>
            <div className="space-y-4">
              {behavioralData?.interactionPatterns?.map((pattern, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{pattern?.pattern}</h4>
                      <p className="text-sm text-muted-foreground">{pattern?.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{pattern?.confidence}%</p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
                      Frequency: {pattern?.frequency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Eye" size={20} className="text-primary" />
                Engagement Depth Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Avg Time Per Election</span>
                  <span className="text-sm font-bold text-foreground">{behavioralData?.engagementDepth?.avgTimePerElection}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Read Completion Rate</span>
                  <span className="text-sm font-bold text-foreground">{behavioralData?.engagementDepth?.readCompletionRate}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Detail View Rate</span>
                  <span className="text-sm font-bold text-foreground">{behavioralData?.engagementDepth?.detailViewRate}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Comment Engagement</span>
                  <span className="text-sm font-bold text-foreground">{behavioralData?.engagementDepth?.commentEngagement}%</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Brain" size={20} className="text-primary" />
                Predictive Modeling
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Next Vote Category</p>
                  <p className="text-lg font-bold text-foreground">{behavioralData?.predictiveModeling?.nextVoteCategory}</p>
                  <p className="text-xs text-muted-foreground mt-1">Probability: {behavioralData?.predictiveModeling?.nextVoteProbability}%</p>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Churn Risk</span>
                  <span className="px-3 py-1 text-sm font-medium bg-success/10 text-success rounded-md">
                    {behavioralData?.predictiveModeling?.churnRisk}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Lifetime Value</span>
                  <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-md">
                    {behavioralData?.predictiveModeling?.lifetimeValue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BehavioralAnalysisPanel;