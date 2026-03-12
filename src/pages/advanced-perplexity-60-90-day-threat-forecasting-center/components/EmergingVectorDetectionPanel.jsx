import React from 'react';
import Icon from '../../../components/AppIcon';

const EmergingVectorDetectionPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-card rounded-lg p-6 text-center text-muted-foreground">
        <Icon name="AlertCircle" className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No emerging vector data available</p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      default: return 'blue';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return 'TrendingUp';
      case 'decreasing': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" className="w-5 h-5 text-primary" />
          Predictive Analysis for New Fraud Methodologies
        </h3>
        <div className="space-y-4">
          {data?.newMethodologies?.map((method, index) => {
            const severityColor = getSeverityColor(method?.severity);
            
            return (
              <div key={index} className="p-4 bg-muted rounded-lg border-l-4 border-${severityColor}-500">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Shield" className={`w-5 h-5 text-${severityColor}-500`} />
                      <span className="font-medium text-foreground">{method?.name}</span>
                      <span className={`px-2 py-0.5 bg-${severityColor}-500/20 text-${severityColor}-500 text-xs rounded-full uppercase`}>
                        {method?.severity}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      First detected: {new Date(method?.firstDetected)?.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                    <div className="text-lg font-bold text-foreground">{(method?.confidence * 100)?.toFixed(0)}%</div>
                  </div>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-${severityColor}-500`}
                    style={{ width: `${method?.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="GitBranch" className="w-5 h-5 text-primary" />
          Attack Pattern Evolution
        </h3>
        <div className="space-y-4">
          {data?.attackEvolution?.map((attack, index) => {
            const trendIcon = getTrendIcon(attack?.trend);
            const trendColor = attack?.trend === 'increasing' ? 'red' : attack?.trend === 'decreasing' ? 'green' : 'gray';
            
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-${trendColor}-500/20 flex items-center justify-center`}>
                    <Icon name={trendIcon} className={`w-5 h-5 text-${trendColor}-500`} />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{attack?.pattern}</div>
                    <div className="text-sm text-muted-foreground capitalize">{attack?.trend} trend</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold text-${trendColor}-500`}>
                    {attack?.changeRate > 0 ? '+' : ''}{attack?.changeRate}%
                  </div>
                  <div className="text-xs text-muted-foreground">Change rate</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Map" className="w-5 h-5 text-primary" />
          Threat Landscape Changes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">{data?.threatLandscape?.emergingThreats}</div>
            <div className="text-sm text-muted-foreground">Emerging Threats</div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">{data?.threatLandscape?.evolvedThreats}</div>
            <div className="text-sm text-muted-foreground">Evolved Threats</div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">{data?.threatLandscape?.mitigatedThreats}</div>
            <div className="text-sm text-muted-foreground">Mitigated Threats</div>
          </div>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Overall Risk Level</span>
            <span className={`px-3 py-1 bg-${data?.threatLandscape?.overallRisk === 'critical' ? 'red' : data?.threatLandscape?.overallRisk === 'high' ? 'orange' : 'yellow'}-500/20 text-${data?.threatLandscape?.overallRisk === 'critical' ? 'red' : data?.threatLandscape?.overallRisk === 'high' ? 'orange' : 'yellow'}-500 text-sm font-medium rounded-full uppercase`}>
              {data?.threatLandscape?.overallRisk}
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-3">
            <div 
              className={`h-3 rounded-full bg-gradient-to-r ${data?.threatLandscape?.overallRisk === 'critical' ? 'from-red-500 to-red-600' : data?.threatLandscape?.overallRisk === 'high' ? 'from-orange-500 to-orange-600' : 'from-yellow-500 to-yellow-600'}`}
              style={{ width: data?.threatLandscape?.overallRisk === 'critical' ? '90%' : data?.threatLandscape?.overallRisk === 'high' ? '70%' : '50%' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Bell" className="w-5 h-5 text-primary" />
          Automated Alert Triggers for Novel Risks
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Critical: AI-Generated Identity Fraud Detected</div>
              <div className="text-xs text-muted-foreground">Automated response initiated - Account verification required</div>
            </div>
            <div className="text-xs text-muted-foreground">2 min ago</div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">High: Cross-Platform Coordination Pattern</div>
              <div className="text-xs text-muted-foreground">Monitoring escalated - Security team notified</div>
            </div>
            <div className="text-xs text-muted-foreground">8 min ago</div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Medium: Behavioral Mimicry Attempt</div>
              <div className="text-xs text-muted-foreground">Enhanced monitoring active - Pattern analysis in progress</div>
            </div>
            <div className="text-xs text-muted-foreground">15 min ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergingVectorDetectionPanel;