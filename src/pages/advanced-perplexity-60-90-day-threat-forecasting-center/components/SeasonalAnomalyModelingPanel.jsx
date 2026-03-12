import React from 'react';
import Icon from '../../../components/AppIcon';

const SeasonalAnomalyModelingPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-card rounded-lg p-6 text-center text-muted-foreground">
        <Icon name="AlertCircle" className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No seasonal anomaly data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Calendar" className="w-5 h-5 text-primary" />
          Historical Pattern Analysis
        </h3>
        <div className="space-y-4">
          {data?.historicalPatterns?.map((pattern, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Icon name="TrendingUp" className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{pattern?.period}</div>
                    <div className="text-sm text-muted-foreground">Average increase: {pattern?.avgIncrease}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                  <div className="text-lg font-bold text-green-500">{(pattern?.confidence * 100)?.toFixed(0)}%</div>
                </div>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${pattern?.avgIncrease}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Gift" className="w-5 h-5 text-primary" />
          Holiday-Period Vulnerability Predictions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.holidayVulnerabilities?.map((holiday, index) => {
            const riskColor = holiday?.riskLevel === 'critical' ? 'red' : holiday?.riskLevel === 'high' ? 'orange' : 'yellow';
            
            return (
              <div key={index} className={`p-6 bg-${riskColor}-500/10 border-2 border-${riskColor}-500/30 rounded-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon name="AlertTriangle" className={`w-6 h-6 text-${riskColor}-500`} />
                  <span className={`px-2 py-1 bg-${riskColor}-500/20 text-${riskColor}-500 text-xs rounded-full uppercase font-medium`}>
                    {holiday?.riskLevel}
                  </span>
                </div>
                <div className="font-medium text-foreground mb-2">{holiday?.holiday}</div>
                <div className="text-3xl font-bold text-foreground mb-2">+{holiday?.predictedIncrease}%</div>
                <div className="text-sm text-muted-foreground">Predicted fraud increase</div>
                <div className="w-full bg-background rounded-full h-2 mt-3">
                  <div 
                    className={`h-2 rounded-full bg-${riskColor}-500`}
                    style={{ width: `${holiday?.predictedIncrease}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Globe" className="w-5 h-5 text-primary" />
          Cultural Context Awareness & Temporal Risk Assessment
        </h3>
        <div className="space-y-4">
          {data?.culturalContext?.map((context, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Icon name="MapPin" className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{context?.region}</div>
                    <div className="text-sm text-muted-foreground">
                      {context?.factors?.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Risk Multiplier</div>
                  <div className="text-2xl font-bold text-orange-500">{context?.riskMultiplier}x</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="p-2 bg-background rounded text-center">
                  <div className="text-xs text-muted-foreground mb-1">Base Risk</div>
                  <div className="text-lg font-bold text-foreground">100%</div>
                </div>
                <div className="p-2 bg-background rounded text-center">
                  <div className="text-xs text-muted-foreground mb-1">Adjusted Risk</div>
                  <div className="text-lg font-bold text-orange-500">{(context?.riskMultiplier * 100)?.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" className="w-5 h-5 text-primary" />
          Event-Driven Threat Modeling
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon name="Calendar" className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-foreground">Upcoming Major Events</span>
              </div>
              <span className="text-sm text-muted-foreground">Next 90 days</span>
            </div>
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between p-2 bg-background rounded">
                <span className="text-sm text-foreground">Valentine's Day</span>
                <span className="text-sm font-medium text-orange-500">+28% risk</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-background rounded">
                <span className="text-sm text-foreground">Tax Season Peak</span>
                <span className="text-sm font-medium text-red-500">+42% risk</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-background rounded">
                <span className="text-sm text-foreground">Spring Break</span>
                <span className="text-sm font-medium text-yellow-500">+19% risk</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Info" className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-foreground">Seasonal Recommendation</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Increase monitoring intensity during holiday periods and major cultural events. Deploy additional fraud detection resources 2 weeks before peak periods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalAnomalyModelingPanel;