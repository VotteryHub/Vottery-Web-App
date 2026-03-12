import React from 'react';
import Icon from '../../../components/AppIcon';

export default function SegmentAnalyticsPanel({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Analyzing user segments...</p>
      </div>
    );
  }

  const segments = [
    { name: 'Premium Subscribers', users: 12500, engagement: 92, conversion: 78, revenue: 125000, growth: 15 },
    { name: 'Content Creators', users: 8200, engagement: 88, conversion: 65, revenue: 98000, growth: 22 },
    { name: 'Daily Active Users', users: 45000, engagement: 75, conversion: 45, revenue: 180000, growth: 8 },
    { name: 'Zone 1 Users', users: 15000, engagement: 85, conversion: 68, revenue: 150000, growth: 12 },
    { name: 'Advertisers', users: 3500, engagement: 95, conversion: 82, revenue: 280000, growth: 18 }
  ];

  return (
    <div className="space-y-6">
      {/* Segment Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">User Segment Analytics</h2>
        <p className="text-blue-100">Performance analysis across user categories</p>
      </div>

      {/* Segments Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Conversion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {segments?.map((segment, index) => (
                <tr key={index} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{segment?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{segment?.users?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${segment?.engagement}%` }} />
                      </div>
                      <span className="text-sm text-foreground">{segment?.engagement}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${segment?.conversion}%` }} />
                      </div>
                      <span className="text-sm text-foreground">{segment?.conversion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">${segment?.revenue?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      +{segment?.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}