import React from 'react';
import Icon from '../../../components/AppIcon';

const ABTestingPanel = ({ abTestData, onRefresh }) => {
  if (!abTestData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No A/B testing data available</p>
      </div>
    );
  }

  const { activeCampaigns, completedTests, tests } = abTestData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Active Campaigns</h3>
            <Icon name="GitBranch" size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">
            {activeCampaigns}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Completed Tests</h3>
            <Icon name="CheckCircle" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">
            {completedTests}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} className="text-primary" />
          A/B Test Campaigns
        </h3>
        <div className="space-y-4">
          {tests?.map((test) => (
            <div key={test?.id} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{test?.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  test?.status === 'running' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {test?.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Participants</p>
                  <p className="font-medium text-foreground">{test?.participants?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Conversion Rate</p>
                  <p className="font-medium text-foreground">{test?.conversionRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Winner</p>
                  <p className="font-medium text-foreground">{test?.winner || 'TBD'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ABTestingPanel;