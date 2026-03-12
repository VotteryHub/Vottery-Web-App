import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { mlThreatDetectionService } from '../../../services/mlThreatDetectionService';

const ThreatCorrelationReasoningPanel = ({ loading }) => {
  const [correlating, setCorrelating] = useState(false);
  const [correlationData, setCorrelationData] = useState(null);

  useEffect(() => {
    loadCorrelationData();
  }, []);

  const loadCorrelationData = async () => {
    setCorrelating(true);
    try {
      const mockThreats = [
        { id: 'THR-001', type: 'API Exploitation', severity: 'HIGH' },
        { id: 'THR-002', type: 'SQL Injection', severity: 'CRITICAL' },
        { id: 'THR-003', type: 'DDoS Attack', severity: 'MEDIUM' }
      ];
      const result = await mlThreatDetectionService?.correlateThreatsWithOpenAI(mockThreats);
      setCorrelationData(result);
    } catch (error) {
      console.error('Correlation failed:', error);
    } finally {
      setCorrelating(false);
    }
  };

  if (loading || correlating) {
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
              <Icon name="Network" size={24} className="text-indigo-600" />
              Automated Threat Correlation Reasoning
            </h3>
            <p className="text-sm text-muted-foreground">
              OpenAI-powered correlation analysis identifying patterns and relationships between threats
            </p>
          </div>
          <Button onClick={loadCorrelationData} className="flex items-center gap-2">
            <Icon name="RefreshCw" size={16} />
            Refresh Analysis
          </Button>
        </div>

        {correlationData && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Link" size={20} className="text-indigo-600" />
                Threat Correlations
              </h4>
              <div className="space-y-4">
                {correlationData?.correlations?.map((corr, idx) => (
                  <div key={idx} className="bg-white border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-foreground">{corr?.relationship}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-50">
                            {corr?.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{corr?.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {corr?.threatIds?.map((id) => (
                            <span key={id} className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              {id}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-indigo-100">
                      <span className="text-xs font-semibold text-indigo-900 mb-2 block">Shared Indicators:</span>
                      <div className="flex flex-wrap gap-2">
                        {corr?.sharedIndicators?.map((indicator, i) => (
                          <span key={i} className="px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700">
                            {indicator}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                <Icon name="AlertTriangle" size={20} className="text-red-600" />
                Identified Attack Campaigns
              </h4>
              <div className="space-y-3">
                {correlationData?.attackCampaigns?.map((campaign, idx) => (
                  <div key={idx} className="bg-white border border-red-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-red-900 mb-2">{campaign?.name}</h5>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-red-700 font-medium">Timeline:</span>
                            <p className="text-red-900">{campaign?.timeline}</p>
                          </div>
                          <div>
                            <span className="text-red-700 font-medium">Attribution:</span>
                            <p className="text-red-900">{campaign?.attribution}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-red-100">
                      <span className="text-xs font-semibold text-red-900 mb-2 block">Associated Threats:</span>
                      <div className="flex flex-wrap gap-2">
                        {campaign?.threats?.map((threat) => (
                          <span key={threat} className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            {threat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                <Icon name="Shield" size={20} className="text-yellow-600" />
                Risk Assessment
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white border border-yellow-200 rounded-lg">
                  <span className="text-sm font-semibold text-yellow-900">Overall Risk Level:</span>
                  <span className="px-3 py-1 rounded-full text-sm font-bold text-red-600 bg-red-50">
                    {correlationData?.riskAssessment?.overallRisk}
                  </span>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-yellow-900 mb-2">Critical Findings:</h5>
                  <div className="space-y-2">
                    {correlationData?.riskAssessment?.criticalFindings?.map((finding, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded">
                        <Icon name="AlertCircle" size={16} className="text-red-600 mt-0.5" />
                        <span className="text-sm text-yellow-900">{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-yellow-900 mb-2">Emerging Patterns:</h5>
                  <div className="space-y-2">
                    {correlationData?.riskAssessment?.emergingPatterns?.map((pattern, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded">
                        <Icon name="TrendingUp" size={16} className="text-yellow-600 mt-0.5" />
                        <span className="text-sm text-yellow-900">{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Sparkles" size={20} className="text-indigo-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-indigo-900 mb-1">AI-Powered Correlation Engine</h4>
            <p className="text-xs text-indigo-700">
              This analysis uses OpenAI GPT-5 to automatically identify relationships between security threats, 
              detect coordinated attack campaigns, and assess overall risk through advanced reasoning and pattern recognition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatCorrelationReasoningPanel;