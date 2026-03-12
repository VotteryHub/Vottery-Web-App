import React from 'react';
import Icon from '../../../components/AppIcon';

const ThreatIntelligencePanel = ({ threatData, onRefresh }) => {
  if (!threatData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No threat intelligence data available</p>
      </div>
    );
  }

  const { correlationMatrix, coordinatedAttacks, demographicPatterns, propagationPaths, zoneSpecificThreats, culturalFactors, overallThreatLevel, confidence, reasoning } = threatData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Overall Threat Level</h3>
            <Icon name="Shield" size={20} className="text-red-500" />
          </div>
          <div className={`text-3xl font-bold mb-2 ${
            overallThreatLevel === 'critical' ? 'text-red-500' :
            overallThreatLevel === 'high'? 'text-yellow-500' : 'text-green-500'
          }`}>
            {overallThreatLevel?.toUpperCase()}
          </div>
          <p className="text-sm text-muted-foreground">Cross-platform analysis</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Analysis Confidence</h3>
            <Icon name="CheckCircle" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500 mb-2">
            {(confidence * 100)?.toFixed(0)}%
          </div>
          <p className="text-sm text-muted-foreground">Perplexity AI powered</p>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} className="text-red-500" />
          Coordinated Attack Indicators
        </h3>
        <div className="space-y-3">
          {coordinatedAttacks?.map((attack, index) => (
            <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-red-700">{attack?.attackType}</p>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  {attack?.severity}
                </span>
              </div>
              <p className="text-sm text-red-600 mb-2">{attack?.description}</p>
              <p className="text-xs text-red-500">Affected Zones: {attack?.affectedZones?.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-primary" />
          Threat Intelligence Reasoning
        </h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-foreground leading-relaxed">{reasoning}</p>
        </div>
      </div>
    </div>
  );
};

export default ThreatIntelligencePanel;