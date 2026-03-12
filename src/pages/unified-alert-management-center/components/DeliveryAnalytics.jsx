import React from 'react';
import Icon from '../../../components/AppIcon';

const DeliveryAnalytics = ({ channels, alerts, statistics }) => {
  const deliveryMetrics = [
    {
      channel: 'SMS',
      icon: 'MessageSquare',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      sent: 3247,
      delivered: 3219,
      failed: 28,
      deliveryRate: 99.1,
      avgLatency: '1.2s',
      cost: '$48.71'
    },
    {
      channel: 'Email',
      icon: 'Mail',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      sent: 8542,
      delivered: 8431,
      failed: 111,
      deliveryRate: 98.7,
      avgLatency: '2.5s',
      cost: '$12.34'
    },
    {
      channel: 'In-App',
      icon: 'Bell',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      sent: 12847,
      delivered: 12847,
      failed: 0,
      deliveryRate: 100,
      avgLatency: '0.3s',
      cost: '$0.00'
    },
    {
      channel: 'Push',
      icon: 'Smartphone',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      sent: 5621,
      delivered: 5482,
      failed: 139,
      deliveryRate: 97.5,
      avgLatency: '1.8s',
      cost: '$8.43'
    }
  ];

  const performanceTrends = [
    { time: '00:00', sms: 95, email: 120, inApp: 340, push: 78 },
    { time: '04:00', sms: 42, email: 68, inApp: 156, push: 34 },
    { time: '08:00', sms: 187, email: 423, inApp: 892, push: 245 },
    { time: '12:00', sms: 312, email: 687, inApp: 1245, push: 456 },
    { time: '16:00', sms: 289, email: 598, inApp: 1134, push: 398 },
    { time: '20:00', sms: 156, email: 342, inApp: 678, push: 187 }
  ];

  const alertsByCategory = [
    { category: 'Fraud Detection', count: 247, percentage: 28 },
    { category: 'Payment Confirmations', count: 412, percentage: 47 },
    { category: 'Milestone Triggers', count: 156, percentage: 18 },
    { category: 'Compliance Notifications', count: 63, percentage: 7 }
  ];

  return (
    <div className="space-y-6">
      {/* Channel Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deliveryMetrics?.map((metric) => (
          <div key={metric?.channel} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric?.bgColor}`}>
                <Icon name={metric?.icon} size={20} className={metric?.color} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">{metric?.channel}</h3>
                <p className="text-xs text-muted-foreground">24-hour performance</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivery Rate</span>
                <span className="text-sm font-bold text-foreground font-data">{metric?.deliveryRate}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${metric?.deliveryRate >= 98 ? 'bg-green-500' : metric?.deliveryRate >= 95 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${metric?.deliveryRate}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sent</p>
                  <p className="text-lg font-bold text-foreground font-data">{metric?.sent?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Delivered</p>
                  <p className="text-lg font-bold text-green-600 font-data">{metric?.delivered?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Failed</p>
                  <p className="text-lg font-bold text-red-600 font-data">{metric?.failed}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Avg Latency</p>
                  <p className="text-sm font-bold text-foreground font-data">{metric?.avgLatency}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Cost</p>
                  <p className="text-sm font-bold text-foreground font-data">{metric?.cost}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Distribution */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Alert Distribution by Category</h3>
        <div className="space-y-3">
          {alertsByCategory?.map((item) => (
            <div key={item?.category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{item?.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground font-data">{item?.count}</span>
                  <span className="text-xs text-muted-foreground">({item?.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${item?.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Trends */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">24-Hour Activity Trends</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Time</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">SMS</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Email</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">In-App</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Push</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {performanceTrends?.map((trend, index) => {
                const total = trend?.sms + trend?.email + trend?.inApp + trend?.push;
                return (
                  <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{trend?.time}</td>
                    <td className="py-3 px-4 text-sm text-foreground text-right font-data">{trend?.sms}</td>
                    <td className="py-3 px-4 text-sm text-foreground text-right font-data">{trend?.email}</td>
                    <td className="py-3 px-4 text-sm text-foreground text-right font-data">{trend?.inApp}</td>
                    <td className="py-3 px-4 text-sm text-foreground text-right font-data">{trend?.push}</td>
                    <td className="py-3 px-4 text-sm font-bold text-foreground text-right font-data">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-sm text-muted-foreground mb-2">Total Notifications</p>
          <p className="text-3xl font-heading font-bold text-foreground font-data">30,257</p>
          <p className="text-xs text-green-600 mt-1">+12.5% from yesterday</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-muted-foreground mb-2">Overall Delivery Rate</p>
          <p className="text-3xl font-heading font-bold text-foreground font-data">98.9%</p>
          <p className="text-xs text-green-600 mt-1">+0.3% improvement</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-muted-foreground mb-2">Avg Response Time</p>
          <p className="text-3xl font-heading font-bold text-foreground font-data">1.8s</p>
          <p className="text-xs text-green-600 mt-1">-0.2s faster</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-muted-foreground mb-2">Total Cost</p>
          <p className="text-3xl font-heading font-bold text-foreground font-data">$69.48</p>
          <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="card bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Export Analytics Report</h4>
            <p className="text-sm text-muted-foreground">Download comprehensive delivery analytics and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
              <Icon name="FileText" size={16} className="inline mr-2" />
              CSV
            </button>
            <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
              <Icon name="FileJson" size={16} className="inline mr-2" />
              JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAnalytics;