import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { mlThreatDetectionService } from '../../../services/mlThreatDetectionService';

const PredictiveThreatEscalationPanel = ({ loading }) => {
  const [predicting, setPredicting] = useState(false);
  const [escalationData, setEscalationData] = useState(null);

  useEffect(() => {
    loadEscalationPrediction();
  }, []);

  const loadEscalationPrediction = async () => {
    setPredicting(true);
    try {
      const mockThreatHistory = [
        { timestamp: new Date()?.toISOString(), type: 'reconnaissance', severity: 'low' },
        { timestamp: new Date(Date?.now() - 3600000)?.toISOString(), type: 'probing', severity: 'medium' },
        { timestamp: new Date(Date?.now() - 7200000)?.toISOString(), type: 'exploitation_attempt', severity: 'high' }
      ];
      const result = await mlThreatDetectionService?.predictThreatEscalationWithOpenAI(mockThreatHistory);
      setEscalationData(result);
    } catch (error) {
      console.error('Escalation prediction failed:', error);
    } finally {
      setPredicting(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'text-red-600 bg-red-50';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'border-red-500 bg-red-50';
      case 'HIGH':
        return 'border-orange-500 bg-orange-50';
      case 'MEDIUM':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  if (loading || predicting) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
        <div className="h-96 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <Icon name="TrendingUp" size={24} className="text-red-600" />
              Predictive Threat Escalation Recommendations
            </h3>
            <p className="text-sm text-muted-foreground">
              AI-powered predictions for threat escalation with actionable recommendations
            </p>
          </div>
          <Button onClick={loadEscalationPrediction} className="flex items-center gap-2">
            <Icon name="RefreshCw" size={16} />
            Refresh Prediction
          </Button>
        </div>

        {escalationData && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                <Icon name="AlertTriangle" size={20} className="text-red-600" />
                Escalation Prediction
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-red-700 font-medium">Likelihood</span>
                    <Icon name="Activity" size={20} className="text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-900">{escalationData?.escalationPrediction?.likelihood}%</div>
                  <div className="text-xs text-red-600 mt-1">High probability</div>
                </div>
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-red-700 font-medium">Timeframe</span>
                    <Icon name="Clock" size={20} className="text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-900">{escalationData?.escalationPrediction?.timeframe}</div>
                  <div className="text-xs text-red-600 mt-1">Estimated window</div>
                </div>
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-red-700 font-medium">Confidence</span>
                    <Icon name="Target" size={20} className="text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-900">{escalationData?.escalationPrediction?.confidence}%</div>
                  <div className="text-xs text-red-600 mt-1">Model confidence</div>
                </div>
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-red-700 font-medium">Severity</span>
                    <Icon name="AlertCircle" size={20} className="text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-900">{escalationData?.escalationPrediction?.severity}</div>
                  <div className="text-xs text-red-600 mt-1">Impact level</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Icon name="GitBranch" size={20} className="text-blue-600" />
                Escalation Path
              </h4>
              <div className="space-y-3">
                {escalationData?.escalationPath?.map((stage, idx) => (
                  <div key={idx} className="bg-white border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-900 font-bold text-sm flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-semibold text-blue-900">{stage?.stage}</h5>
                          <span className="text-xs text-blue-600 font-medium">{stage?.timeframe}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-xs font-semibold text-blue-700 block mb-1">Indicators:</span>
                          <div className="flex flex-wrap gap-1">
                            {stage?.indicators?.map((indicator, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                                {indicator}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded p-2">
                          <span className="text-xs font-semibold text-blue-700 block mb-1">Recommended Actions:</span>
                          <p className="text-xs text-blue-900">{stage?.actions}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Icon name="CheckCircle" size={20} className="text-green-600" />
                Actionable Recommendations
              </h4>
              <div className="space-y-3">
                {escalationData?.recommendations?.map((rec, idx) => (
                  <div key={idx} className={`border-l-4 rounded-lg p-4 ${getPriorityColor(rec?.priority)}`}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(rec?.priority)}`}>
                            {rec?.priority}
                          </span>
                          <span className="text-xs text-muted-foreground">{rec?.timing}</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground mb-1">{rec?.action}</p>
                        <p className="text-xs text-muted-foreground">Resources: {rec?.resources}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <Icon name="Shield" size={20} className="text-purple-600" />
                Preventive Measures
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {escalationData?.preventiveMeasures?.map((measure, idx) => (
                  <div key={idx} className="bg-white border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-purple-700 font-medium">Effectiveness</span>
                      <span className="text-lg font-bold text-purple-900">{measure?.effectiveness}%</span>
                    </div>
                    <p className="text-sm font-semibold text-purple-900 mb-2">{measure?.measure}</p>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={14} className="text-purple-600" />
                      <span className="text-xs text-purple-700">{measure?.implementation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Sparkles" size={20} className="text-red-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-900 mb-1">Predictive AI Engine</h4>
            <p className="text-xs text-red-700">
              This panel uses OpenAI GPT-5 with high reasoning effort to predict threat escalation patterns, 
              identify escalation paths, and generate time-sensitive recommendations to prevent security incidents from escalating.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveThreatEscalationPanel;