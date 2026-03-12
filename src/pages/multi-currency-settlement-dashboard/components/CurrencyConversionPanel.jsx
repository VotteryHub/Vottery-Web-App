import React from 'react';
import Icon from '../../../components/AppIcon';

const CurrencyConversionPanel = ({ rates }) => {
  const getTrendIcon = (trend) => {
    if (trend === 'up') return { icon: 'TrendingUp', color: 'text-success' };
    if (trend === 'down') return { icon: 'TrendingDown', color: 'text-destructive' };
    return { icon: 'Minus', color: 'text-muted-foreground' };
  };

  const formatChange = (change) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change?.toFixed(2)}%`;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            Currency Conversion Rates
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time exchange rates vs USD
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs font-medium text-primary">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(rates || {})?.map(([currency, data]) => {
          const trendConfig = getTrendIcon(data?.trend);
          return (
            <div key={currency} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{currency}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {data?.rate?.toFixed(4)}
                  </p>
                  <p className="text-xs text-muted-foreground">per 1 USD</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Icon name={trendConfig?.icon} size={18} className={trendConfig?.color} />
                <span className={`text-sm font-medium ${trendConfig?.color}`}>
                  {formatChange(data?.change)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-start gap-3 p-4 bg-warning/5 rounded-lg border border-warning/20">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning mb-1">Rate Alert</p>
            <p className="text-xs text-muted-foreground">
              BRL has fluctuated +2.1% in the last 24 hours. Consider hedging options for large transactions.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors">
          <Icon name="BarChart2" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">View History</span>
        </button>
        <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-sm font-medium text-foreground">Hedging Options</span>
        </button>
      </div>
    </div>
  );
};

export default CurrencyConversionPanel;