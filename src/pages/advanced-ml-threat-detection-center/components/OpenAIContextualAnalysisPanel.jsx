import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { mlThreatDetectionService } from '../../../services/mlThreatDetectionService';

const OpenAIContextualAnalysisPanel = ({ loading }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const mockIncidents = [
    {
      id: 'INC-001',
      type: 'API Exploitation',
      severity: 'HIGH',
      timestamp: new Date()?.toISOString(),
      description: 'Multiple failed authentication attempts from distributed IPs'
    },
    {
      id: 'INC-002',
      type: 'SQL Injection Attempt',
      severity: 'CRITICAL',
      timestamp: new Date(Date?.now() - 3600000)?.toISOString(),
      description: 'Advanced SQL injection with WAF bypass techniques'
    },
    {
      id: 'INC-003',
      type: 'DDoS Attack',
      severity: 'MEDIUM',
      timestamp: new Date(Date?.now() - 7200000)?.toISOString(),
      description: 'Distributed denial of service targeting API endpoints'
    }
  ];

  const handleAnalyzeIncident = async (incident) => {
    setAnalyzing(true);
    setSelectedIncident(incident);
    try {
      const result = await mlThreatDetectionService?.analyzeSecurityIncidentWithOpenAI(incident);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
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
        return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (loading) {
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
              <Icon name="Brain" size={24} className="text-purple-600" />
              OpenAI Contextual Threat Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              Advanced contextual analysis of security incidents using OpenAI GPT-5
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Recent Security Incidents</h4>
            <div className="space-y-3">
              {mockIncidents?.map((incident) => (
                <div
                  key={incident?.id}
                  className={`bg-muted/30 border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedIncident?.id === incident?.id ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleAnalyzeIncident(incident)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-foreground">{incident?.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(incident?.severity)}`}>
                          {incident?.severity}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">{incident?.type}</p>
                      <p className="text-xs text-muted-foreground">{incident?.description}</p>
                    </div>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Icon name="Search" size={14} />
                      Analyze
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(incident?.timestamp)?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {analyzing ? (
              <div className="bg-muted/30 border border-border rounded-lg p-6 flex flex-col items-center justify-center h-full">
                <Icon name="Loader2" size={48} className="text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Analyzing incident with OpenAI GPT-5...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Icon name="Shield" size={20} className="text-purple-600" />
                    Threat Assessment
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Severity:</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(analysis?.threatAssessment?.severity)}`}>
                        {analysis?.threatAssessment?.severity}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="ml-2 font-semibold text-foreground">{analysis?.threatAssessment?.confidence}%</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="ml-2 font-medium text-foreground">{analysis?.threatAssessment?.category}</span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mt-2">{analysis?.threatAssessment?.description}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Icon name="Target" size={16} className="text-blue-600" />
                    Contextual Analysis
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-blue-700 font-medium">Attack Vector:</span>
                      <p className="text-blue-900 mt-1">{analysis?.contextualAnalysis?.attackVector}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Motivation:</span>
                      <p className="text-blue-900 mt-1">{analysis?.contextualAnalysis?.motivation}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Sophistication:</span>
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium text-orange-600 bg-orange-50">
                        {analysis?.contextualAnalysis?.sophistication}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Related Threats:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysis?.contextualAnalysis?.relatedThreats?.map((threat, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                            {threat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                    <Icon name="Link" size={16} className="text-yellow-600" />
                    Threat Correlations
                  </h4>
                  <div className="space-y-2">
                    {analysis?.correlations?.map((corr, idx) => (
                      <div key={idx} className="bg-white/50 rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-yellow-900">{corr?.pattern}</span>
                          <span className="text-xs text-yellow-700">{corr?.confidence}% confidence</span>
                        </div>
                        <p className="text-xs text-yellow-800">{corr?.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    Recommendations
                  </h4>
                  <div className="space-y-2">
                    {analysis?.recommendations?.map((rec, idx) => (
                      <div key={idx} className={`border rounded p-3 ${getPriorityColor(rec?.priority)}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold">{rec?.priority}</span>
                        </div>
                        <p className="text-xs font-medium mb-1">{rec?.action}</p>
                        <p className="text-xs opacity-80">{rec?.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`border-2 rounded-lg p-4 ${getSeverityColor(analysis?.escalationLevel)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Escalation Level:</span>
                    <span className="text-lg font-bold">{analysis?.escalationLevel}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 border border-border rounded-lg p-6 flex flex-col items-center justify-center h-full">
                <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground text-center">
                  Select a security incident to analyze with OpenAI GPT-5
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Sparkles" size={20} className="text-purple-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-purple-900 mb-1">OpenAI GPT-5 Powered Analysis</h4>
            <p className="text-xs text-purple-700">
              This panel uses OpenAI GPT-5 with high reasoning effort to provide advanced contextual analysis of security incidents, 
              identifying attack patterns, correlating threats, and generating actionable recommendations based on threat intelligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAIContextualAnalysisPanel;