import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CampaignPerformancePanel = ({ analysis, onRefresh }) => {
  if (!analysis) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Icon name="BarChart" size={48} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-4">No campaign performance data available</p>
        <Button variant="default" iconName="Sparkles" onClick={onRefresh}>
          Generate Analysis
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="BarChart" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">Campaign Performance Analysis</h2>
            <p className="text-sm text-muted-foreground">AI-powered insights from Claude</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-heading font-bold text-foreground mb-3">Executive Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{analysis?.summary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {analysis?.kpis?.map((kpi, index) => (
            <div key={index} className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="TrendingUp" size={16} className="text-primary" />
                <h4 className="text-sm font-medium text-muted-foreground">{kpi?.name}</h4>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{kpi?.value}</p>
              <p className="text-xs text-muted-foreground">{kpi?.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-3">Identified Trends</h3>
            <div className="space-y-2">
              {analysis?.trends?.map((trend, index) => (
                <div key={index} className="bg-background border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Icon name="TrendingUp" size={20} className="text-blue-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-1">{trend}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-3">Improvement Opportunities</h3>
            <div className="space-y-2">
              {analysis?.improvements?.map((improvement, index) => (
                <div key={index} className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Icon name="Lightbulb" size={20} className="text-yellow-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-1">{improvement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPerformancePanel;