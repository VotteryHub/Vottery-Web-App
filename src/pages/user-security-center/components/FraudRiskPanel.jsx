import React from 'react';
import Icon from '../../../components/AppIcon';

const FraudRiskPanel = ({ fraudRisk, onRefresh }) => {
  const getThreatLevelColor = (level) => {
    const colors = {
      safe: 'text-green-600 bg-green-50 dark:bg-green-900/20',
      low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
      critical: 'text-red-600 bg-red-50 dark:bg-red-900/20'
    };
    return colors?.[level] || colors?.low;
  };

  const getThreatLevelIcon = (level) => {
    const icons = {
      safe: 'ShieldCheck',
      low: 'Shield',
      medium: 'AlertCircle',
      high: 'AlertTriangle',
      critical: 'AlertOctagon'
    };
    return icons?.[level] || 'Shield';
  };

  if (!fraudRisk) {
    return (
      <div className="card p-8 text-center">
        <Icon name="Shield" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No fraud risk data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">Fraud Risk Score</h3>
            <Icon name="TrendingDown" size={20} className="text-green-600" />
          </div>
          <div className="text-center">
            <div className="text-5xl font-heading font-bold text-foreground mb-2 font-data">
              {fraudRisk?.fraudRiskScore?.toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground mb-4">out of 100</div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                style={{ width: `${fraudRisk?.fraudRiskScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">Threat Level</h3>
            <Icon name={getThreatLevelIcon(fraudRisk?.threatLevel)} size={20} className="text-primary" />
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-lg uppercase ${getThreatLevelColor(fraudRisk?.threatLevel)}`}>
              <Icon name={getThreatLevelIcon(fraudRisk?.threatLevel)} size={24} />
              {fraudRisk?.threatLevel}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Your account security status
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">Security Score</h3>
            <Icon name="Award" size={20} className="text-primary" />
          </div>
          <div className="text-center">
            <div className="text-5xl font-heading font-bold text-primary mb-2 font-data">
              {fraudRisk?.securityScore?.toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground mb-4">out of 100</div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ width: `${fraudRisk?.securityScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Behavioral Patterns</h3>
          <div className="space-y-3">
            {fraudRisk?.behavioralPatterns?.map((pattern, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Icon name="Activity" size={18} className="text-primary mt-0.5" />
                <p className="text-sm text-foreground flex-1">{pattern}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Account Vulnerabilities</h3>
          <div className="space-y-3">
            {fraudRisk?.accountVulnerabilities?.map((vulnerability, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Icon name="AlertTriangle" size={18} className="text-orange-600 mt-0.5" />
                <p className="text-sm text-foreground flex-1">{vulnerability}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fraudRisk?.recommendedActions?.map((action, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Icon name="CheckCircle" size={18} className="text-blue-600 mt-0.5" />
              <p className="text-sm text-foreground flex-1">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {fraudRisk?.recentThreats?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Threats Detected</h3>
          <div className="space-y-3">
            {fraudRisk?.recentThreats?.map((threat, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <Icon name="AlertOctagon" size={18} className="text-red-600 mt-0.5" />
                <p className="text-sm text-foreground flex-1">{threat}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {fraudRisk?.reasoning && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">AI Analysis Reasoning</h3>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-foreground whitespace-pre-wrap">{fraudRisk?.reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudRiskPanel;