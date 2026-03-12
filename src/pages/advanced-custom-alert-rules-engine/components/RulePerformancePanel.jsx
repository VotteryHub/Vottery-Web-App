import React from 'react';
import Icon from '../../../components/AppIcon';

const RulePerformancePanel = ({ rules }) => {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-heading font-bold text-foreground mb-4">
        Rule Performance Analytics
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Monitor rule effectiveness, response times, and false positive rates
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-background rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Total Alerts</p>
          <p className="text-3xl font-bold text-foreground">247</p>
          <p className="text-xs text-green-600 mt-1">+12% from last week</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Avg Response Time</p>
          <p className="text-3xl font-bold text-foreground">2.3s</p>
          <p className="text-xs text-green-600 mt-1">-0.5s improvement</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Success Rate</p>
          <p className="text-3xl font-bold text-foreground">94%</p>
          <p className="text-xs text-green-600 mt-1">+3% from last week</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">False Positives</p>
          <p className="text-3xl font-bold text-foreground">6%</p>
          <p className="text-xs text-green-600 mt-1">-2% improvement</p>
        </div>
      </div>

      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
        <Icon name="BarChart2" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">Detailed Performance Analytics</p>
        <p className="text-sm text-muted-foreground">
          View comprehensive rule performance metrics and optimization recommendations
        </p>
      </div>
    </div>
  );
};

export default RulePerformancePanel;