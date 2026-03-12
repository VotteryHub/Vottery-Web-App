import React from 'react';
import Icon from '../../../components/AppIcon';

const ThreatImpactCalculationPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-card rounded-lg p-6 text-center text-muted-foreground">
        <Icon name="AlertCircle" className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No threat impact data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="DollarSign" className="w-5 h-5 text-primary" />
          Financial Impact Projections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Calendar" className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">60-Day Projection</span>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">
              ${(data?.financialImpact?.projected60Day / 1000)?.toFixed(0)}K
            </div>
            <div className="text-sm text-muted-foreground">Projected financial loss</div>
          </div>

          <div className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/10 border-2 border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Calendar" className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">90-Day Projection</span>
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">
              ${(data?.financialImpact?.projected90Day / 1000)?.toFixed(0)}K
            </div>
            <div className="text-sm text-muted-foreground">Projected financial loss</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Confidence Interval (90 days)</span>
            <span className="text-sm font-medium text-foreground">
              ${(data?.financialImpact?.confidenceInterval?.[0] / 1000)?.toFixed(0)}K - ${(data?.financialImpact?.confidenceInterval?.[1] / 1000)?.toFixed(0)}K
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-3">
            <div className="relative h-3">
              <div 
                className="absolute bg-red-500/30 h-3 rounded-full"
                style={{ 
                  left: '0%',
                  width: '100%'
                }}
              ></div>
              <div 
                className="absolute bg-red-500 h-3 rounded-full"
                style={{ 
                  left: `${((data?.financialImpact?.projected90Day - data?.financialImpact?.confidenceInterval?.[0]) / (data?.financialImpact?.confidenceInterval?.[1] - data?.financialImpact?.confidenceInterval?.[0])) * 100}%`,
                  width: '4px'
                }}
              ></div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Lower bound</span>
            <span>Upper bound</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" className="w-5 h-5 text-primary" />
          Operational Impact Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="ShoppingCart" className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Affected Transactions</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{data?.operationalImpact?.affectedTransactions?.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Potentially compromised</div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Server" className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">System Load</span>
            </div>
            <div className="text-3xl font-bold text-orange-500 mb-1 capitalize">{data?.operationalImpact?.systemLoad}</div>
            <div className="text-xs text-muted-foreground">Resource utilization</div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Clock" className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">Response Time</span>
            </div>
            <div className="text-3xl font-bold text-red-500 mb-1 capitalize">{data?.operationalImpact?.responseTime}</div>
            <div className="text-xs text-muted-foreground">Performance status</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="AlertTriangle" className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-foreground">Operational Warning</span>
          </div>
          <p className="text-sm text-muted-foreground">
            High system load and degraded response times may impact user experience. Consider scaling infrastructure and implementing load balancing strategies.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Award" className="w-5 h-5 text-primary" />
          Reputational Impact Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Users" className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">User Trust Score</span>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-4xl font-bold text-foreground">{(data?.reputationalImpact?.userTrustScore * 100)?.toFixed(0)}%</div>
              <div className="flex-1">
                <div className="w-full bg-background rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      data?.reputationalImpact?.userTrustScore >= 0.8 ? 'bg-green-500' :
                      data?.reputationalImpact?.userTrustScore >= 0.6 ? 'bg-yellow-500': 'bg-red-500'
                    }`}
                    style={{ width: `${data?.reputationalImpact?.userTrustScore * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Current user confidence level
            </div>
          </div>

          <div className="p-6 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Shield" className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">Brand Risk Level</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`text-4xl font-bold capitalize ${
                data?.reputationalImpact?.brandRiskLevel === 'high' ? 'text-red-500' :
                data?.reputationalImpact?.brandRiskLevel === 'medium'? 'text-orange-500' : 'text-green-500'
              }`}>
                {data?.reputationalImpact?.brandRiskLevel}
              </div>
              <span className={`px-3 py-1 bg-${data?.reputationalImpact?.brandRiskLevel === 'high' ? 'red' : data?.reputationalImpact?.brandRiskLevel === 'medium' ? 'orange' : 'green'}-500/20 text-${data?.reputationalImpact?.brandRiskLevel === 'high' ? 'red' : data?.reputationalImpact?.brandRiskLevel === 'medium' ? 'orange' : 'green'}-500 text-sm font-medium rounded-full uppercase`}>
                {data?.reputationalImpact?.brandRiskLevel}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Brand reputation exposure
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Media Coverage Risk</span>
              <span className="text-sm text-orange-500">Moderate</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Regulatory Scrutiny Risk</span>
              <span className="text-sm text-yellow-500">Low-Moderate</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Customer Churn Risk</span>
              <span className="text-sm text-red-500">Moderate-High</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" className="w-5 h-5 text-primary" />
          Integration with External Intelligence Feeds
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" className="w-5 h-5 text-green-500" />
              <span className="font-medium text-foreground">Threat Intelligence Feeds</span>
            </div>
            <div className="text-sm text-muted-foreground mb-3">Connected to 12 external sources</div>
            <div className="flex items-center gap-2 text-xs text-green-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Live updates active</span>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Globe" className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-foreground">Industry Reports</span>
            </div>
            <div className="text-sm text-muted-foreground mb-3">8 industry sources integrated</div>
            <div className="flex items-center gap-2 text-xs text-blue-500">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span>Daily synchronization</span>
            </div>
          </div>

          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Database" className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-foreground">Regulatory Databases</span>
            </div>
            <div className="text-sm text-muted-foreground mb-3">5 compliance sources monitored</div>
            <div className="flex items-center gap-2 text-xs text-purple-500">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              <span>Real-time monitoring</span>
            </div>
          </div>

          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Share2" className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-foreground">Peer Networks</span>
            </div>
            <div className="text-sm text-muted-foreground mb-3">Connected to 23 organizations</div>
            <div className="flex items-center gap-2 text-xs text-orange-500">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span>Collaborative intelligence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatImpactCalculationPanel;