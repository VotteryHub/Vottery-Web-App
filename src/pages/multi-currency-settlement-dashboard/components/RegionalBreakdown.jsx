import React from 'react';
import Icon from '../../../components/AppIcon';

const RegionalBreakdown = ({ data }) => {
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getProcessingTimeColor = (time) => {
    if (time < 2) return 'text-success';
    if (time < 3) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            Regional Breakdown
          </h3>
          <p className="text-sm text-muted-foreground">
            Payout distribution across 8 purchasing power zones
          </p>
        </div>
        <Icon name="Globe" size={24} className="text-primary" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Region</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Currency</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Amount</th>
              <th className="text-center py-3 px-2 text-xs font-medium text-muted-foreground">Settlements</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Avg Rate</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Processing Time</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((region, index) => (
              <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="MapPin" size={16} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{region?.region}</span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs font-medium text-foreground">
                    {region?.currency}
                  </span>
                </td>
                <td className="py-4 px-2 text-right">
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(region?.amount, region?.currency)}
                  </span>
                </td>
                <td className="py-4 px-2 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-success/10 rounded-full text-sm font-semibold text-success">
                    {region?.settlements}
                  </span>
                </td>
                <td className="py-4 px-2 text-right">
                  <span className="text-sm text-muted-foreground">
                    {region?.avgRate?.toFixed(2)}
                  </span>
                </td>
                <td className="py-4 px-2 text-right">
                  <span className={`text-sm font-medium ${getProcessingTimeColor(region?.processingTime)}`}>
                    {region?.processingTime}h
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Icon name="TrendingUp" size={20} className="text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Fastest Processing</p>
              <p className="text-sm font-semibold text-foreground">North America (1.8h)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Icon name="DollarSign" size={20} className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Highest Volume</p>
              <p className="text-sm font-semibold text-foreground">North America</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Icon name="Activity" size={20} className="text-warning" />
            <div>
              <p className="text-xs text-muted-foreground">Most Active</p>
              <p className="text-sm font-semibold text-foreground">India (18 settlements)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalBreakdown;