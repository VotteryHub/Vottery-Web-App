import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

import { perplexityThreatService } from '../../../services/perplexityThreatService';

const ThreatIntelligencePanel = ({ incidents }) => {
  const [threatAnalysis, setThreatAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const analyzeThreat = async (incident) => {
    try {
      setLoading(true);
      setSelectedIncident(incident);
      
      const result = await perplexityThreatService?.analyzeThreatIntelligence({
        incidentType: incident?.incidentType,
        threatLevel: incident?.threatLevel,
        description: incident?.description,
        affectedEntities: incident?.affectedEntities
      });

      if (result?.data) {
        setThreatAnalysis(result?.data);
      }
    } catch (error) {
      console.error('Failed to analyze threat:', error);
    } finally {
      setLoading(false);
    }
  };

  const criticalIncidents = incidents?.filter(i => i?.threatLevel === 'critical' || i?.threatLevel === 'high');

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">Perplexity AI Threat Intelligence</h2>
        <p className="text-sm text-muted-foreground mb-6">
          AI-powered threat analysis with real-time intelligence gathering and pattern recognition
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {criticalIncidents?.slice(0, 4)?.map((incident) => (
            <div
              key={incident?.id}
              className="p-4 border border-border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => analyzeThreat(incident)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  incident?.threatLevel === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {incident?.threatLevel?.toUpperCase()}
                </span>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">{incident?.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{incident?.description}</p>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <Icon name="Loader" size={32} className="animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Analyzing threat with Perplexity AI...</p>
          </div>
        )}

        {!loading && threatAnalysis && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Shield" size={20} className="text-primary" />
                <h3 className="font-semibold text-foreground">Threat Analysis for: {selectedIncident?.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Threat Level</p>
                  <p className="text-lg font-bold text-foreground">{threatAnalysis?.threatLevel?.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Threat Score</p>
                  <p className="text-lg font-bold text-foreground">{threatAnalysis?.threatScore}/100</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                  <p className="text-lg font-bold text-foreground">{(threatAnalysis?.confidence * 100)?.toFixed(0)}%</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="AlertTriangle" size={18} />
                Threat Patterns Detected
              </h4>
              <div className="flex flex-wrap gap-2">
                {threatAnalysis?.threatPatterns?.map((pattern, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">
                    {pattern}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Target" size={18} />
                Attack Vectors
              </h4>
              <ul className="space-y-2">
                {threatAnalysis?.attackVectors?.map((vector, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <Icon name="ArrowRight" size={16} className="text-primary mt-0.5" />
                    <span>{vector}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Shield" size={18} />
                Recommended Countermeasures
              </h4>
              <ul className="space-y-2">
                {threatAnalysis?.countermeasures?.map((measure, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <Icon name="CheckCircle2" size={16} className="text-green-500 mt-0.5" />
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
            </div>

            {threatAnalysis?.reasoning && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Icon name="Info" size={18} className="text-blue-600" />
                  AI Reasoning
                </h4>
                <p className="text-sm text-foreground">{threatAnalysis?.reasoning}</p>
              </div>
            )}
          </div>
        )}

        {!loading && !threatAnalysis && (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Select an incident above to analyze with Perplexity AI</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatIntelligencePanel;