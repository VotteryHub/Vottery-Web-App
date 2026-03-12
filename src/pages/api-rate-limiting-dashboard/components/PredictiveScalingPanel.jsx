import React from 'react';
import Icon from '../../../components/AppIcon';


const PredictiveScalingPanel = ({ rateLimits, quotaMonitoring }) => {
  const highUtilizationEndpoints = rateLimits
    ?.map(r => ({
      endpoint: r?.endpoint,
      method: r?.method,
      utilization: ((r?.currentMinuteCount / r?.quotaPerMinute) * 100)?.toFixed(1),
      currentQuota: r?.quotaPerMinute,
      recommendedQuota: Math.ceil(r?.quotaPerMinute * 1.5),
      trend: 'increasing'
    }))
    ?.filter(e => parseFloat(e?.utilization) > 60)
    ?.sort((a, b) => parseFloat(b?.utilization) - parseFloat(a?.utilization));

  const scalingRecommendations = highUtilizationEndpoints?.map(endpoint => ({
    endpoint: endpoint?.endpoint,
    method: endpoint?.method,
    currentUtilization: endpoint?.utilization,
    action: parseFloat(endpoint?.utilization) > 80 ? 'Immediate scaling required' : 'Monitor and prepare to scale',
    priority: parseFloat(endpoint?.utilization) > 80 ? 'high' : 'medium',
    recommendedIncrease: `${endpoint?.currentQuota} → ${endpoint?.recommendedQuota} (+50%)`,
    estimatedImpact: 'Prevents throttling during traffic spikes'
  }));

  return (
    <div className="space-y-6">
      {/* Scaling Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">High Utilization</span>
            <Icon name="TrendingUp" size={20} className="text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-orange-500">{highUtilizationEndpoints?.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Endpoints &gt;60% utilization</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Critical</span>
            <Icon name="AlertTriangle" size={20} className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-500">
            {highUtilizationEndpoints?.filter(e => parseFloat(e?.utilization) > 80)?.length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Immediate action needed</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Recommendations</span>
            <Icon name="Lightbulb" size={20} className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-500">{scalingRecommendations?.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Scaling actions available</div>
        </div>
      </div>

      {/* Scaling Recommendations */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          Predictive Scaling Recommendations
        </h3>
        <div className="space-y-3">
          {scalingRecommendations?.map((rec, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${
              rec?.priority === 'high' ? 'border-red-500/30 bg-red-500/5' : 'border-yellow-500/30 bg-yellow-500/5'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon name="TrendingUp" size={18} className={rec?.priority === 'high' ? 'text-red-500' : 'text-yellow-500'} />
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-500">
                    {rec?.method}
                  </span>
                  <span className="font-mono text-sm font-medium text-foreground">{rec?.endpoint}</span>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                  rec?.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {rec?.priority} Priority
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Current Utilization</div>
                  <div className={`text-lg font-bold ${
                    parseFloat(rec?.currentUtilization) > 80 ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {rec?.currentUtilization}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Recommended Increase</div>
                  <div className="text-sm font-semibold text-foreground">{rec?.recommendedIncrease}</div>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                <div className="text-xs font-semibold text-muted-foreground mb-1">Action Required:</div>
                <div className="text-sm font-medium text-foreground">{rec?.action}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  <Icon name="Info" size={12} className="inline mr-1" />
                  {rec?.estimatedImpact}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive Insights */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Lightbulb" size={20} className="text-primary" />
          Predictive Insights
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-blue-500/5 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Info" size={18} className="text-blue-500" />
              <span className="font-semibold text-foreground">Traffic Pattern Analysis</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on current trends, {highUtilizationEndpoints?.filter(e => parseFloat(e?.utilization) > 80)?.length} endpoint(s) will reach capacity within the next hour during peak traffic.
            </p>
          </div>

          <div className="p-4 bg-green-500/5 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={18} className="text-green-500" />
              <span className="font-semibold text-foreground">Automated Scaling Available</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Enable automated scaling to dynamically adjust quotas based on real-time utilization patterns.
            </p>
          </div>

          <div className="p-4 bg-purple-500/5 border border-purple-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" size={18} className="text-purple-500" />
              <span className="font-semibold text-foreground">Viral Campaign Protection</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Predictive scaling helps protect your backend during viral campaign spikes by preemptively increasing capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveScalingPanel;