import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PredictiveFailureAlerts = ({ alerts }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/5';
      case 'high': return 'border-orange-500 bg-orange-500/5';
      case 'warning': return 'border-yellow-500 bg-yellow-500/5';
      case 'info': return 'border-blue-500 bg-blue-500/5';
      default: return 'border-gray-500 bg-gray-500/5';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'AlertOctagon';
      case 'high': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const mlPredictions = [
    { metric: 'Database Storage', currentValue: '67%', predictedValue: '80%', timeframe: '14 days', confidence: 87 },
    { metric: 'API Response Time', currentValue: '187ms', predictedValue: '250ms', timeframe: '7 days', confidence: 72 },
    { metric: 'Memory Usage', currentValue: '62%', predictedValue: '75%', timeframe: '21 days', confidence: 81 },
    { metric: 'Connection Pool', currentValue: '85%', predictedValue: '95%', timeframe: '5 days', confidence: 89 }
  ];

  const escalationWorkflows = [
    { trigger: 'Critical System Failure', action: 'Immediate page to on-call engineer', status: 'active' },
    { trigger: 'High Severity Alert', action: 'Slack notification + Email to team', status: 'active' },
    { trigger: 'Capacity Warning', action: 'Create ticket + Notify infrastructure team', status: 'active' },
    { trigger: 'Performance Degradation', action: 'Auto-scale resources + Log incident', status: 'active' }
  ];

  return (
    <div className="space-y-6">
      {/* Active Predictive Alerts */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          Active Predictive Alerts
        </h3>
        <div className="space-y-4">
          {alerts?.map((alert, index) => (
            <div key={index} className={`card p-6 border-2 ${getSeverityColor(alert?.severity)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    alert?.severity === 'critical' ? 'bg-red-500/20' :
                    alert?.severity === 'high' ? 'bg-orange-500/20' :
                    alert?.severity === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                  }`}>
                    <Icon
                      name={getSeverityIcon(alert?.severity)}
                      size={20}
                      className={`${
                        alert?.severity === 'critical' ? 'text-red-500' :
                        alert?.severity === 'high' ? 'text-orange-500' :
                        alert?.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${
                        alert?.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                        alert?.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                        alert?.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {alert?.severity}
                      </span>
                      <span className="text-xs text-muted-foreground">{alert?.type}</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{alert?.prediction}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Target" size={14} />
                        Confidence: {alert?.confidence}%
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Zap" size={14} />
                        Action: {alert?.action}
                      </span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Take Action
                </Button>
              </div>

              {/* Confidence Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Prediction Confidence</span>
                  <span className="text-xs font-semibold text-foreground">{alert?.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      alert?.confidence >= 80 ? 'bg-green-500' :
                      alert?.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${alert?.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ML Predictions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-primary" />
          Machine Learning Predictions
        </h3>
        <div className="space-y-3">
          {mlPredictions?.map((prediction, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-foreground">{prediction?.metric}</span>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                  {prediction?.confidence}% confidence
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Current</span>
                  <div className="text-sm font-semibold text-foreground">{prediction?.currentValue}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Predicted</span>
                  <div className="text-sm font-semibold text-orange-500">{prediction?.predictedValue}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Timeframe</span>
                  <div className="text-sm font-semibold text-foreground">{prediction?.timeframe}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Escalation Workflows */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} className="text-primary" />
          Automated Escalation Workflows
        </h3>
        <div className="space-y-3">
          {escalationWorkflows?.map((workflow, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Icon name="Zap" size={18} className="text-primary" />
                  <span className="font-medium text-foreground">{workflow?.trigger}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-500 capitalize">
                  {workflow?.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground ml-9">
                <Icon name="ArrowRight" size={14} />
                <span>{workflow?.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proactive Mitigation */}
      <div className="card p-6 border-2 border-primary bg-primary/5">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Proactive Mitigation Recommendations</h3>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="CheckCircle" size={18} className="text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Scale Database Storage</h4>
                <p className="text-sm text-muted-foreground">Increase storage capacity by 25% to prevent reaching 80% threshold in 14 days</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="CheckCircle" size={18} className="text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Implement Caching Layer</h4>
                <p className="text-sm text-muted-foreground">Add Redis caching to reduce API response times during peak hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveFailureAlerts;