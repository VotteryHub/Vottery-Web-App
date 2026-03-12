import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FraudRiskIntelligencePanel = ({ riskAnalyses, onGenerateAnalysis, refreshing }) => {
  const [selectedZone, setSelectedZone] = useState('all');

  const zones = [
    { id: 'all', name: 'All Zones' },
    { id: 'zone_1', name: 'Ultra High ($100k+)' },
    { id: 'zone_2', name: 'High ($75k-$100k)' },
    { id: 'zone_3', name: 'Upper Middle ($60k-$75k)' },
    { id: 'zone_4', name: 'Middle ($45k-$60k)' },
    { id: 'zone_5', name: 'Lower Middle ($35k-$45k)' },
    { id: 'zone_6', name: 'Working Class ($25k-$35k)' },
    { id: 'zone_7', name: 'Low Income ($15k-$25k)' },
    { id: 'zone_8', name: 'Very Low Income (<$15k)' }
  ];

  const filteredRisks = selectedZone === 'all'
    ? riskAnalyses
    : riskAnalyses?.filter(r => r?.zone === selectedZone);

  const getRiskColor = (riskScore) => {
    if (riskScore >= 70) return 'text-red-600';
    if (riskScore >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBadge = (riskScore) => {
    if (riskScore >= 70) return { label: 'Critical Risk', color: 'bg-red-100 text-red-800' };
    if (riskScore >= 40) return { label: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Low Risk', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">
              Fraud Risk Intelligence
            </h2>
            <p className="text-sm text-muted-foreground">
              Predictive threat modeling with pattern evolution forecasting and automated alert triggers
            </p>
          </div>
          <Button
            variant="primary"
            iconName="Shield"
            onClick={onGenerateAnalysis}
            disabled={refreshing}
          >
            Generate Analysis
          </Button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Zone Filter
          </label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e?.target?.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-border rounded-lg bg-card text-foreground"
          >
            {zones?.map(zone => (
              <option key={zone?.id} value={zone?.id}>{zone?.name}</option>
            ))}
          </select>
        </div>

        {filteredRisks?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Shield" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No fraud risk analyses available</p>
            <Button
              variant="primary"
              iconName="Plus"
              onClick={onGenerateAnalysis}
            >
              Generate First Analysis
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRisks?.map((risk, index) => {
              const riskData = risk?.scenarioData;
              const riskBadge = getRiskBadge(risk?.predictedValue);

              return (
                <div key={index} className="border border-border rounded-lg p-4 hover:bg-card-hover transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon name="AlertTriangle" size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {zones?.find(z => z?.id === risk?.zone)?.name || risk?.zone}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Fraud Risk Assessment
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${riskBadge?.color}`}>
                      {riskBadge?.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                      <p className={`text-2xl font-bold ${getRiskColor(risk?.predictedValue)}`}>
                        {risk?.predictedValue?.toFixed(0)}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">30-Day Risk</p>
                      <p className="text-lg font-bold text-foreground">
                        {riskData?.forecasts?.['30day']?.riskLevel || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">60-Day Risk</p>
                      <p className="text-lg font-bold text-foreground">
                        {riskData?.forecasts?.['60day']?.riskLevel || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">90-Day Risk</p>
                      <p className="text-lg font-bold text-foreground">
                        {riskData?.forecasts?.['90day']?.riskLevel || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {riskData?.vulnerabilities?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <Icon name="AlertCircle" size={16} className="text-red-600" />
                        Zone Vulnerabilities
                      </p>
                      <div className="space-y-2">
                        {riskData?.vulnerabilities?.slice(0, 3)?.map((vuln, idx) => (
                          <div key={idx} className="flex items-start gap-2 bg-red-50 rounded-lg p-3">
                            <Icon name="XCircle" size={16} className="text-red-600 mt-0.5" />
                            <p className="text-sm text-foreground">{vuln}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {risk?.optimizationRecommendations?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <Icon name="Shield" size={16} className="text-primary" />
                        Mitigation Strategies
                      </p>
                      <div className="space-y-2">
                        {risk?.optimizationRecommendations?.slice(0, 3)?.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-2 bg-background rounded-lg p-3">
                            <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{rec?.strategy}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Priority: {rec?.priority}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {riskData?.emergingThreats?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Emerging Threats:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {riskData?.emergingThreats?.slice(0, 4)?.map((threat, idx) => (
                          <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            {threat?.threat} ({threat?.probability}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudRiskIntelligencePanel;