import React from 'react';
import Icon from '../../../components/AppIcon';

const EmergingThreatsPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertTriangle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No emerging threats detected</p>
      </div>
    );
  }

  const { emergingThreats, zeroDay, aptIndicators, novelAttackVectors, earlyWarnings, probabilityMatrix, urgencyLevel } = data;

  const getUrgencyColor = (level) => {
    const colors = {
      critical: 'bg-red-100 text-red-600 dark:bg-red-900/20 border-red-200',
      high: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 border-yellow-200',
      low: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 border-blue-200'
    };
    return colors?.[level] || colors?.medium;
  };

  return (
    <div className="space-y-6">
      <div className={`card border-l-4 ${getUrgencyColor(urgencyLevel)}`}>
        <div className="flex items-center gap-3 mb-2">
          <Icon name="AlertTriangle" size={24} className="text-red-600" />
          <div>
            <p className="text-sm text-muted-foreground">Overall Urgency Level</p>
            <p className="text-2xl font-bold text-foreground">{urgencyLevel?.toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Emerging Threat Identification
        </h3>
        <div className="space-y-3">
          {emergingThreats?.map((threat, index) => (
            <div key={index} className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">{threat?.threatType}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    First Detected: {new Date(threat?.firstDetected)?.toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Evolution Stage:</span>
                    <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium text-foreground">
                      {threat?.evolutionStage}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Probability</p>
                  <p className="text-lg font-bold text-foreground">{(threat?.probability * 100)?.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Impact: {threat?.impactScore}/100</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: `${(threat?.probability || 0) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Zap" size={20} />
            Zero-Day Vulnerabilities
          </h3>
          <div className="space-y-2">
            {zeroDay?.map((vuln, index) => (
              <div key={index} className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">{vuln?.name || vuln?.type}</p>
                <p className="text-xs text-muted-foreground">{vuln?.description}</p>
              </div>
            ))}
            {(!zeroDay || zeroDay?.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">No zero-day vulnerabilities detected</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Target" size={20} />
            APT Indicators
          </h3>
          <div className="space-y-2">
            {aptIndicators?.map((indicator, index) => (
              <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">{indicator?.type}</p>
                <p className="text-xs text-muted-foreground">{indicator?.description}</p>
              </div>
            ))}
            {(!aptIndicators || aptIndicators?.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">No APT indicators detected</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Crosshair" size={20} />
          Novel Attack Vectors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {novelAttackVectors?.map((vector, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">{vector?.name || vector?.type}</p>
              <p className="text-xs text-muted-foreground mb-2">{vector?.description}</p>
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={12} className="text-primary" />
                <p className="text-xs text-primary">Mitigation: {vector?.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Bell" size={20} />
          Early Warning Signals
        </h3>
        <div className="space-y-2">
          {earlyWarnings?.map((warning, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <Icon name="AlertCircle" size={16} className="text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{warning?.signal || warning?.type}</p>
                <p className="text-xs text-muted-foreground">{warning?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Grid" size={20} />
          Threat Probability Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 text-muted-foreground">Threat Type</th>
                <th className="text-center p-2 text-muted-foreground">Probability</th>
                <th className="text-center p-2 text-muted-foreground">Impact</th>
                <th className="text-center p-2 text-muted-foreground">Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {probabilityMatrix?.map((item, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="p-2 text-foreground">{item?.threatType}</td>
                  <td className="text-center p-2">
                    <span className="text-foreground font-medium">{(item?.probability * 100)?.toFixed(0)}%</span>
                  </td>
                  <td className="text-center p-2">
                    <span className="text-foreground font-medium">{item?.impact}/100</span>
                  </td>
                  <td className="text-center p-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item?.riskScore >= 75
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/20'
                        : item?.riskScore >= 50
                        ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20' :'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'
                    }`}>
                      {item?.riskScore}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmergingThreatsPanel;