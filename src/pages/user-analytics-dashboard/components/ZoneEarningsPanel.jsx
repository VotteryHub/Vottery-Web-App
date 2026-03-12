import React from 'react';
import Icon from '../../../components/AppIcon';
import { stripeService } from '../../../services/stripeService';

const ZoneEarningsPanel = ({ earningsByZone, timeRange }) => {
  const zones = Object.entries(earningsByZone)
    ?.map(([zone, data]) => ({
      zone,
      totalEarnings: data?.totalEarnings || 0,
      count: data?.count || 0,
      avgPerElection: data?.count > 0 ? data?.totalEarnings / data?.count : 0
    }))
    ?.sort((a, b) => b?.totalEarnings - a?.totalEarnings);

  const maxEarnings = Math.max(...zones?.map(z => z?.totalEarnings), 1);
  const totalEarnings = zones?.reduce((sum, z) => sum + z?.totalEarnings, 0);

  const zoneColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500'
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Earnings Across Zones</h2>
        <Icon name="MapPin" size={20} className="text-success" />
      </div>

      <div className="space-y-6">
        {/* Total Earnings Summary */}
        <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Earnings ({timeRange?.replace('d', ' days')})</p>
          <p className="text-4xl font-bold text-foreground mb-2">
            {stripeService?.formatCurrency(totalEarnings)}
          </p>
          <p className="text-xs text-muted-foreground">
            Across {zones?.length} zone{zones?.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Zone Breakdown */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Zone Breakdown</h3>
          {zones?.length > 0 ? (
            <div className="space-y-4">
              {zones?.map((zone, index) => (
                <div key={zone?.zone}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${zoneColors?.[index % zoneColors?.length]}`} />
                      <span className="text-sm font-medium text-foreground">Zone {zone?.zone}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {stripeService?.formatCurrency(zone?.totalEarnings)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div
                      className={`${zoneColors?.[index % zoneColors?.length]} rounded-full h-2 transition-all duration-500`}
                      style={{ width: `${(zone?.totalEarnings / maxEarnings) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{zone?.count} election{zone?.count !== 1 ? 's' : ''}</span>
                    <span>Avg: {stripeService?.formatCurrency(zone?.avgPerElection)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="MapPin" size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No earnings data available</p>
            </div>
          )}
        </div>

        {/* Zone Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Lightbulb" size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Zone Insight</p>
              <p className="text-xs text-blue-700">
                {zones?.length > 0
                  ? `Zone ${zones?.[0]?.zone} is your highest earning zone with ${stripeService?.formatCurrency(zones?.[0]?.totalEarnings)}. Focus on similar elections for better returns.`
                  : 'Participate in elections across different zones to maximize your earnings potential.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneEarningsPanel;