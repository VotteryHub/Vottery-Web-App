import React from 'react';
import Icon from '../../../components/AppIcon';

const ScenarioModelingPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-card rounded-lg p-6 text-center text-muted-foreground">
        <Icon name="AlertCircle" className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No scenario modeling data available</p>
      </div>
    );
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      default: return 'blue';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="GitBranch" className="w-5 h-5 text-primary" />
          Threat Scenario Planning
        </h3>
        <div className="space-y-4">
          {data?.scenarios?.map((scenario, index) => {
            const impactColor = getImpactColor(scenario?.impact);
            const probabilityPercent = (scenario?.probability * 100)?.toFixed(0);
            
            return (
              <div key={index} className={`p-6 bg-${impactColor}-500/10 border-2 border-${impactColor}-500/30 rounded-lg`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="AlertTriangle" className={`w-5 h-5 text-${impactColor}-500`} />
                      <span className="font-medium text-foreground text-lg">{scenario?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-3 py-1 bg-${impactColor}-500/20 text-${impactColor}-500 text-xs rounded-full uppercase font-medium`}>
                        {scenario?.impact} Impact
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Timeframe: {scenario?.timeframe}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">Probability</div>
                    <div className="text-3xl font-bold text-foreground">{probabilityPercent}%</div>
                  </div>
                </div>
                <div className="w-full bg-background rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full bg-${impactColor}-500`}
                    style={{ width: `${probabilityPercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Shield" className="w-5 h-5 text-primary" />
            Mitigation Strategies
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Icon name="CheckCircle" className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-sm font-medium text-foreground">Active Strategies</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{data?.mitigationStrategies}</span>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Preparedness Score</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-background rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                    style={{ width: `${data?.preparednessScore * 100}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-green-500">{(data?.preparednessScore * 100)?.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Target" className="w-5 h-5 text-primary" />
            Response Readiness
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="CheckCircle" className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-foreground">Detection Systems</span>
              </div>
              <div className="text-xs text-muted-foreground">Fully operational</div>
            </div>
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="CheckCircle" className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-foreground">Response Teams</span>
              </div>
              <div className="text-xs text-muted-foreground">24/7 availability</div>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="AlertCircle" className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-foreground">Backup Systems</span>
              </div>
              <div className="text-xs text-muted-foreground">Partial redundancy</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Layers" className="w-5 h-5 text-primary" />
          Scenario Impact Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="DollarSign" className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Financial Impact</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">$245K - $387K</div>
            <div className="text-xs text-muted-foreground">Projected range (60-90 days)</div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Users" className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">User Impact</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">12,400</div>
            <div className="text-xs text-muted-foreground">Potentially affected users</div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Activity" className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">Operational Impact</span>
            </div>
            <div className="text-2xl font-bold text-orange-500 mb-1">High</div>
            <div className="text-xs text-muted-foreground">System load & response time</div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="FileText" className="w-5 h-5 text-primary" />
          Recommended Actions
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <Icon name="AlertTriangle" className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <div className="font-medium text-foreground mb-1">Immediate: Enhance AI-Generated Identity Detection</div>
              <div className="text-sm text-muted-foreground">Deploy advanced biometric verification and implement stricter identity validation protocols</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <Icon name="Clock" className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <div className="font-medium text-foreground mb-1">Short-term: Strengthen Cross-Platform Monitoring</div>
              <div className="text-sm text-muted-foreground">Implement real-time correlation analysis across all 8 purchasing power zones</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <Icon name="TrendingUp" className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <div className="font-medium text-foreground mb-1">Long-term: Develop Predictive Defense Systems</div>
              <div className="text-sm text-muted-foreground">Build ML models that anticipate and prevent emerging attack vectors before they materialize</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioModelingPanel;