import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChurnPredictionPanel = ({ predictions, onGeneratePrediction, refreshing }) => {
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

  const filteredPredictions = selectedZone === 'all'
    ? predictions
    : predictions?.filter(p => p?.zone === selectedZone);

  const getChurnRiskColor = (churnProbability) => {
    if (churnProbability >= 70) return 'text-red-600';
    if (churnProbability >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getChurnRiskBadge = (churnProbability) => {
    if (churnProbability >= 70) return { label: 'High Risk', color: 'bg-red-100 text-red-800' };
    if (churnProbability >= 40) return { label: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Low Risk', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">
              User Churn Prediction
            </h2>
            <p className="text-sm text-muted-foreground">
              Behavioral pattern analysis with retention probability scoring and intervention recommendations
            </p>
          </div>
          <Button
            variant="primary"
            iconName="Users"
            onClick={onGeneratePrediction}
            disabled={refreshing}
          >
            Generate Prediction
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

        {filteredPredictions?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No churn predictions available</p>
            <Button
              variant="primary"
              iconName="Plus"
              onClick={onGeneratePrediction}
            >
              Generate First Prediction
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPredictions?.map((prediction, index) => {
              const churnData = prediction?.scenarioData;
              const churnRisk = getChurnRiskBadge(prediction?.predictedValue);

              return (
                <div key={index} className="border border-border rounded-lg p-4 hover:bg-card-hover transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon name="UserX" size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {zones?.find(z => z?.id === prediction?.zone)?.name || prediction?.zone}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Churn Probability Analysis
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${churnRisk?.color}`}>
                      {churnRisk?.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Churn Probability</p>
                      <p className={`text-2xl font-bold ${getChurnRiskColor(prediction?.predictedValue)}`}>
                        {prediction?.predictedValue?.toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">High Risk Users</p>
                      <p className="text-2xl font-bold text-foreground">
                        {churnData?.highRiskUsers || 0}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">30-Day Forecast</p>
                      <p className="text-2xl font-bold text-foreground">
                        {churnData?.forecasts?.['30day'] || 0}%
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">90-Day Forecast</p>
                      <p className="text-2xl font-bold text-foreground">
                        {churnData?.forecasts?.['90day'] || 0}%
                      </p>
                    </div>
                  </div>

                  {prediction?.optimizationRecommendations?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <Icon name="Lightbulb" size={16} className="text-primary" />
                        Intervention Recommendations
                      </p>
                      <div className="space-y-2">
                        {prediction?.optimizationRecommendations?.slice(0, 3)?.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-2 bg-background rounded-lg p-3">
                            <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{rec?.action}</p>
                              {rec?.expectedRetention && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Expected Retention: +{rec?.expectedRetention}%
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {churnData?.behavioralPatterns?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Behavioral Patterns Detected:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {churnData?.behavioralPatterns?.slice(0, 4)?.map((pattern, idx) => (
                          <span key={idx} className="px-3 py-1 bg-background rounded-full text-xs text-foreground">
                            {pattern?.pattern}
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

export default ChurnPredictionPanel;