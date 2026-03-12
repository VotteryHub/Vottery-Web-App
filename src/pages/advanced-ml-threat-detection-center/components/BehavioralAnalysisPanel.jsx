import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import { mlThreatDetectionService } from '../../../services/mlThreatDetectionService';

const BehavioralAnalysisPanel = () => {
  const [behavioralData, setBehavioralData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBehavioralAnalysis();

    const handleRefresh = () => loadBehavioralAnalysis();
    window.addEventListener('ml-threat-refresh', handleRefresh);
    return () => window.removeEventListener('ml-threat-refresh', handleRefresh);
  }, []);

  const loadBehavioralAnalysis = async () => {
    try {
      setLoading(true);
      const data = await mlThreatDetectionService?.analyzeBehavior();
      setBehavioralData(data);
    } catch (error) {
      console.error('Failed to load behavioral analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Loader" size={32} className="animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Analyzing behavioral patterns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Suspicious Behaviors */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} />
          Suspicious Behavioral Patterns
        </h3>
        <div className="space-y-3">
          {behavioralData?.suspiciousBehaviors?.map((behavior, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{behavior?.pattern}</h4>
                  <p className="text-sm text-muted-foreground">{behavior?.description}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-600">
                  {behavior?.riskLevel}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs mt-3">
                <div>
                  <span className="text-muted-foreground">Occurrences:</span>
                  <span className="ml-2 font-medium text-foreground">{behavior?.occurrences}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Users Affected:</span>
                  <span className="ml-2 font-medium text-foreground">{behavior?.usersAffected}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="ml-2 font-medium text-foreground">{behavior?.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Velocity Analysis */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} />
          Velocity Anomalies
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {behavioralData?.velocityAnomalies?.map((anomaly, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">{anomaly?.metric}</span>
                <Icon name="TrendingUp" size={16} className="text-red-600" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{anomaly?.value}</div>
              <div className="text-xs text-muted-foreground mb-2">{anomaly?.timeframe}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${anomaly?.deviationPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-red-600">+{anomaly?.deviationPercentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Clustering */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} />
          Suspicious User Clusters
        </h3>
        <div className="space-y-3">
          {behavioralData?.userClusters?.map((cluster, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Cluster #{cluster?.id}</h4>
                  <p className="text-sm text-muted-foreground">{cluster?.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600 mb-1">{cluster?.users}</div>
                  <div className="text-xs text-muted-foreground">Users</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {cluster?.characteristics?.map((char, idx) => (
                  <span key={idx} className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    {char}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BehavioralAnalysisPanel;