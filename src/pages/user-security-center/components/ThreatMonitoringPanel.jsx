import React from 'react';
import Icon from '../../../components/AppIcon';

const ThreatMonitoringPanel = ({ threatMonitoring, onRefresh }) => {
  if (!threatMonitoring) {
    return (
      <div className="card p-8 text-center">
        <Icon name="Shield" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No threat monitoring data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <Icon name="AlertTriangle" size={32} className="mx-auto text-orange-600 mb-3" />
          <div className="text-3xl font-heading font-bold text-foreground mb-1 font-data">
            {threatMonitoring?.suspiciousActivities?.length || 0}
          </div>
          <div className="text-sm text-muted-foreground">Suspicious Activities</div>
        </div>

        <div className="card text-center">
          <Icon name="LogIn" size={32} className="mx-auto text-blue-600 mb-3" />
          <div className="text-3xl font-heading font-bold text-foreground mb-1 font-data">
            {threatMonitoring?.loginAnomalies?.length || 0}
          </div>
          <div className="text-sm text-muted-foreground">Login Anomalies</div>
        </div>

        <div className="card text-center">
          <Icon name="DollarSign" size={32} className="mx-auto text-red-600 mb-3" />
          <div className="text-3xl font-heading font-bold text-foreground mb-1 font-data">
            {threatMonitoring?.transactionWarnings?.length || 0}
          </div>
          <div className="text-sm text-muted-foreground">Transaction Warnings</div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">Threat Score</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Confidence:</span>
            <span className="text-sm font-bold text-primary font-data">
              {((threatMonitoring?.confidence || 0) * 100)?.toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                style={{ width: `${threatMonitoring?.threatScore || 0}%` }}
              />
            </div>
          </div>
          <div className="text-2xl font-heading font-bold text-foreground font-data">
            {threatMonitoring?.threatScore?.toFixed(0) || 0}
          </div>
        </div>
      </div>

      {threatMonitoring?.suspiciousActivities?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Suspicious Activities</h3>
          <div className="space-y-3">
            {threatMonitoring?.suspiciousActivities?.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <Icon name="AlertTriangle" size={20} className="text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">{activity}</p>
                </div>
                <button className="text-sm text-primary hover:underline">Investigate</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {threatMonitoring?.loginAnomalies?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Login Anomalies</h3>
          <div className="space-y-3">
            {threatMonitoring?.loginAnomalies?.map((anomaly, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Icon name="LogIn" size={20} className="text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">{anomaly}</p>
                </div>
                <button className="text-sm text-primary hover:underline">Review</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {threatMonitoring?.transactionWarnings?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Transaction Security Warnings</h3>
          <div className="space-y-3">
            {threatMonitoring?.transactionWarnings?.map((warning, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <Icon name="DollarSign" size={20} className="text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">{warning}</p>
                </div>
                <button className="text-sm text-primary hover:underline">Details</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {threatMonitoring?.investigationInsights && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Investigation Insights</h3>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-foreground">
              {JSON.stringify(threatMonitoring?.investigationInsights, null, 2)}
            </p>
          </div>
        </div>
      )}

      {threatMonitoring?.reasoning && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">AI Threat Analysis</h3>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-foreground whitespace-pre-wrap">{threatMonitoring?.reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreatMonitoringPanel;