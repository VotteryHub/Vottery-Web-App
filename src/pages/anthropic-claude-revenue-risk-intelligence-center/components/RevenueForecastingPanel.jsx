import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RevenueForecastingPanel = ({ forecasts, onGenerateForecast, refreshing }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30-90-day');
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

  const filteredForecasts = selectedZone === 'all'
    ? forecasts
    : forecasts?.filter(f => f?.zone === selectedZone);

  const getConfidenceBadgeColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">
              Revenue Trend Forecasting
            </h2>
            <p className="text-sm text-muted-foreground">
              30-60-90 day revenue predictions with confidence scoring and seasonal adjustments
            </p>
          </div>
          <Button
            variant="primary"
            iconName="TrendingUp"
            onClick={() => onGenerateForecast(selectedPeriod)}
            disabled={refreshing}
          >
            Generate Forecast
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Forecast Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e?.target?.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            >
              <option value="30-day">30 Days</option>
              <option value="60-day">60 Days</option>
              <option value="90-day">90 Days</option>
              <option value="30-90-day">30-60-90 Days (Complete)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Zone Filter
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e?.target?.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            >
              {zones?.map(zone => (
                <option key={zone?.id} value={zone?.id}>{zone?.name}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredForecasts?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="TrendingUp" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No revenue forecasts available</p>
            <Button
              variant="primary"
              iconName="Plus"
              onClick={() => onGenerateForecast(selectedPeriod)}
            >
              Generate First Forecast
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredForecasts?.map((forecast, index) => (
              <div key={index} className="border border-border rounded-lg p-4 hover:bg-card-hover transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="DollarSign" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {zones?.find(z => z?.id === forecast?.zone)?.name || forecast?.zone}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {forecast?.forecastPeriod} Forecast
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    getConfidenceBadgeColor(forecast?.confidenceScore)
                  }`}>
                    {forecast?.confidenceScore}% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Predicted Revenue</p>
                    <p className="text-lg font-bold text-foreground">
                      ${forecast?.predictedValue?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Growth Rate</p>
                    <p className={`text-lg font-bold ${
                      forecast?.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {forecast?.growthRate >= 0 ? '+' : ''}{forecast?.growthRate?.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Confidence Level</p>
                    <p className="text-lg font-bold text-foreground capitalize">
                      {forecast?.confidenceLevel}
                    </p>
                  </div>
                </div>

                {forecast?.optimizationRecommendations?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Optimization Recommendations:
                    </p>
                    <ul className="space-y-1">
                      {forecast?.optimizationRecommendations?.slice(0, 2)?.map((rec, idx) => (
                        <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                          <Icon name="ArrowRight" size={16} className="text-primary mt-0.5" />
                          <span>{rec?.action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueForecastingPanel;