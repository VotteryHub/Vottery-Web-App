import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import { advancedPerplexityFraudService } from '../../../services/advancedPerplexityFraudService';

const ZoneAnalyticsPanel = ({ zones, onRefresh }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneAnalysis, setZoneAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleZoneSelect = async (zone) => {
    setSelectedZone(zone);
    setLoading(true);
    
    const mockIncidents = {
      recentCount: Math.floor(Math.random() * 50) + 10,
      fraudRate: (Math.random() * 5 + 1)?.toFixed(2),
      averageLoss: Math.floor(Math.random() * 1000) + 200
    };

    const result = await advancedPerplexityFraudService?.zoneSpecificThreatAnalysis(zone?.id, mockIncidents);
    setZoneAnalysis(result?.data);
    setLoading(false);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 bg-red-50 dark:bg-red-900/20',
      high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
      medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    };
    return colors?.[severity] || colors?.medium;
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Zone-Specific Threat Analytics</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Select a purchasing power zone to view detailed fraud risk assessment and localized prevention strategies
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {zones?.map((zone, index) => (
            <button
              key={zone?.id}
              onClick={() => handleZoneSelect(zone)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedZone?.id === zone?.id
                  ? 'border-primary bg-primary/5' :'border-muted hover:border-primary/50 bg-card'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon name="MapPin" size={16} className="text-primary" />
                <span className="text-xs font-bold text-muted-foreground">Zone {index + 1}</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{zone?.name}</h3>
              <p className="text-xs text-muted-foreground">{zone?.range}</p>
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="card p-12 text-center">
          <Icon name="Loader" size={48} className="mx-auto text-primary mb-4 animate-spin" />
          <p className="text-muted-foreground">Analyzing zone-specific threats...</p>
        </div>
      )}

      {!loading && zoneAnalysis && selectedZone && (
        <>
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
                  {selectedZone?.name} Risk Assessment
                </h3>
                <p className="text-sm text-muted-foreground">Income Range: {selectedZone?.range}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-foreground mb-1 font-data">
                  {zoneAnalysis?.riskScore || 0}/100
                </div>
                <span className="text-xs text-muted-foreground">Risk Score</span>
              </div>
            </div>

            <div className="h-3 bg-muted rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                style={{ width: `${zoneAnalysis?.riskScore || 0}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Threat Patterns</h4>
                <div className="space-y-2">
                  {(zoneAnalysis?.threatPatterns || ['Velocity anomalies', 'Geographic clustering', 'Temporal irregularities'])?.map((pattern, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Icon name="AlertCircle" size={16} className="text-orange-600 mt-0.5" />
                      <span className="text-sm text-foreground">{pattern}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Demographic Factors</h4>
                <div className="space-y-2">
                  {(zoneAnalysis?.demographicFactors || ['Age distribution', 'Digital literacy', 'Payment preferences'])?.map((factor, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Icon name="Users" size={16} className="text-blue-600 mt-0.5" />
                      <span className="text-sm text-foreground">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 className="text-lg font-heading font-semibold text-foreground mb-4">Localized Prevention Strategies</h4>
            <div className="space-y-3">
              {(zoneAnalysis?.preventionStrategies || [
                'Implement enhanced identity verification for high-value transactions',
                'Deploy zone-specific fraud detection models',
                'Increase monitoring during peak activity hours'
              ])?.map((strategy, index) => (
                <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <Icon name="CheckCircle" size={18} className="text-green-600 mt-0.5" />
                    <span className="text-sm text-foreground">{strategy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {zoneAnalysis?.culturalContext && (
            <div className="card">
              <h4 className="text-lg font-heading font-semibold text-foreground mb-4">Cultural Context Awareness</h4>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="Globe" size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground">
                      {typeof zoneAnalysis?.culturalContext === 'string' 
                        ? zoneAnalysis?.culturalContext
                        : 'Cultural and socioeconomic factors influence fraud patterns in this zone. Prevention strategies should account for local payment preferences, digital literacy levels, and community trust dynamics.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h4 className="text-lg font-heading font-semibold text-foreground mb-4">Actionable Recommendations</h4>
            <div className="space-y-2">
              {(zoneAnalysis?.recommendations || [
                'Increase fraud detection sensitivity by 15%',
                'Deploy additional monitoring resources',
                'Conduct targeted user education campaigns'
              ])?.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-sm text-foreground">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!loading && !zoneAnalysis && (
        <div className="card p-12 text-center">
          <Icon name="Map" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Select a zone to view detailed threat analytics</p>
        </div>
      )}
    </div>
  );
};

export default ZoneAnalyticsPanel;