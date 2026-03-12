import React from 'react';
import Icon from '../../../components/AppIcon';

const CrossPlatformCorrelationPanel = ({ correlationData, zones, onRefresh }) => {
  const correlationMatrix = correlationData?.correlationMatrix || [
    [1.0, 0.78, 0.65, 0.52, 0.41, 0.35, 0.28, 0.22],
    [0.78, 1.0, 0.72, 0.58, 0.45, 0.38, 0.31, 0.25],
    [0.65, 0.72, 1.0, 0.68, 0.54, 0.42, 0.35, 0.28],
    [0.52, 0.58, 0.68, 1.0, 0.75, 0.58, 0.45, 0.35],
    [0.41, 0.45, 0.54, 0.75, 1.0, 0.72, 0.58, 0.42],
    [0.35, 0.38, 0.42, 0.58, 0.72, 1.0, 0.68, 0.52],
    [0.28, 0.31, 0.35, 0.45, 0.58, 0.68, 1.0, 0.65],
    [0.22, 0.25, 0.28, 0.35, 0.42, 0.52, 0.65, 1.0]
  ];

  const coordinatedAttacks = correlationData?.coordinatedAttacks || [
    { 
      name: 'Multi-Zone Account Takeover Campaign', 
      zonesAffected: ['Zone 1', 'Zone 2', 'Zone 3'], 
      attackVector: 'Credential Stuffing',
      confidence: 0.92,
      severity: 'critical'
    },
    { 
      name: 'Cross-Platform Payment Fraud Ring', 
      zonesAffected: ['Zone 4', 'Zone 5', 'Zone 6'], 
      attackVector: 'Synthetic Identity',
      confidence: 0.85,
      severity: 'high'
    },
    { 
      name: 'Distributed Bot Network Activity', 
      zonesAffected: ['Zone 6', 'Zone 7', 'Zone 8'], 
      attackVector: 'Automated Voting',
      confidence: 0.78,
      severity: 'high'
    }
  ];

  const demographicPatterns = correlationData?.demographicPatterns || {
    highIncome: { riskLevel: 'medium', primaryThreat: 'Account Takeover', prevalence: 0.68 },
    middleIncome: { riskLevel: 'high', primaryThreat: 'Payment Fraud', prevalence: 0.82 },
    lowIncome: { riskLevel: 'medium', primaryThreat: 'Identity Theft', prevalence: 0.71 }
  };

  const getCorrelationColor = (value) => {
    if (value >= 0.7) return 'bg-red-500';
    if (value >= 0.5) return 'bg-orange-500';
    if (value >= 0.3) return 'bg-yellow-500';
    return 'bg-green-500';
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">Cross-Platform Threat Correlation Matrix</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Overall Threat Level:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getSeverityColor(correlationData?.overallThreatLevel || 'high')}`}>
              {(correlationData?.overallThreatLevel || 'high')?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-9 gap-1">
              <div className="p-2"></div>
              {zones?.slice(0, 8)?.map((zone, index) => (
                <div key={index} className="p-2 text-center">
                  <span className="text-xs font-semibold text-muted-foreground">Z{index + 1}</span>
                </div>
              ))}
              {correlationMatrix?.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <div className="p-2 flex items-center">
                    <span className="text-xs font-semibold text-muted-foreground">Zone {rowIndex + 1}</span>
                  </div>
                  {row?.map((value, colIndex) => (
                    <div key={colIndex} className="p-2">
                      <div 
                        className={`w-full h-12 rounded flex items-center justify-center ${getCorrelationColor(value)} bg-opacity-${Math.round(value * 100)}`}
                        title={`Correlation: ${(value * 100)?.toFixed(0)}%`}
                      >
                        <span className="text-xs font-bold text-white font-data">{(value * 100)?.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>High Correlation (70%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>Medium (50-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Low (30-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Minimal (&lt;30%)</span>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Coordinated Attack Campaigns</h3>
        <div className="space-y-4">
          {coordinatedAttacks?.map((attack, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-red-500">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="AlertTriangle" size={18} className="text-red-600" />
                    <h4 className="text-sm font-semibold text-foreground">{attack?.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getSeverityColor(attack?.severity)}`}>
                      {attack?.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Vector: <span className="font-semibold text-foreground">{attack?.attackVector}</span></span>
                    <span>Confidence: <span className="font-bold text-primary font-data">{(attack?.confidence * 100)?.toFixed(0)}%</span></span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {attack?.zonesAffected?.map((zone, zIndex) => (
                  <span key={zIndex} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded font-medium">
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(demographicPatterns)?.map(([category, data], index) => (
          <div key={index} className="card">
            <h4 className="text-sm font-semibold text-foreground mb-3 capitalize">{category?.replace(/([A-Z])/g, ' $1')?.trim()}</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Risk Level:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getSeverityColor(data?.riskLevel)}`}>
                  {data?.riskLevel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Primary Threat:</span>
                <span className="text-xs font-semibold text-foreground">{data?.primaryThreat}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Prevalence:</span>
                <span className="text-xs font-bold text-primary font-data">{(data?.prevalence * 100)?.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {correlationData?.reasoning && (
        <div className="card">
          <div className="flex items-start gap-3">
            <Icon name="Brain" size={20} className="text-primary mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Cross-Platform Analysis Reasoning</h3>
              <p className="text-sm text-muted-foreground">{correlationData?.reasoning}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrossPlatformCorrelationPanel;