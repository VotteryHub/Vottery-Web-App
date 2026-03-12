import React from 'react';
import Icon from '../../../components/AppIcon';


const ParticipationFeeProcessing = ({ data }) => {
  const feeStats = [
    { label: 'Collected Today', value: '$89,320', icon: 'DollarSign', color: 'bg-success/10 text-success' },
    { label: 'Processing', value: '47', icon: 'Loader', color: 'bg-primary/10 text-primary' },
    { label: 'Refunds Issued', value: '12', icon: 'RotateCcw', color: 'bg-accent/10 text-accent' },
    { label: 'Success Rate', value: '99.4%', icon: 'CheckCircle', color: 'bg-success/10 text-success' }
  ];

  const recentTransactions = [
    { id: 1, user: 'John Smith', election: 'Summer Product Launch', amount: 50, zone: 'Zone 4', status: 'completed', time: '2 min ago' },
    { id: 2, user: 'Maria Garcia', election: 'Brand Awareness Q3', amount: 75, zone: 'Zone 5', status: 'completed', time: '5 min ago' },
    { id: 3, user: 'Yuki Tanaka', election: 'Holiday Special', amount: 100, zone: 'Zone 7', status: 'processing', time: '8 min ago' },
    { id: 4, user: 'Emma Wilson', election: 'New Market Entry', amount: 50, zone: 'Zone 1', status: 'completed', time: '12 min ago' },
    { id: 5, user: 'Carlos Silva', election: 'Summer Product Launch', amount: 60, zone: 'Zone 5', status: 'completed', time: '15 min ago' }
  ];

  const zonePricing = [
    { zone: 'Zone 1-2', basePrice: 50, currency: 'USD/EUR', volume: 342 },
    { zone: 'Zone 3-4', basePrice: 45, currency: 'GBP/INR', volume: 486 },
    { zone: 'Zone 5-6', basePrice: 40, currency: 'BRL/MXN', volume: 289 },
    { zone: 'Zone 7-8', basePrice: 55, currency: 'JPY/AUD', volume: 130 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {feeStats?.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className={`w-12 h-12 rounded-full ${stat?.color} flex items-center justify-center mb-4`}>
              <Icon name={stat?.icon} size={24} />
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat?.label}</p>
            <p className="text-3xl font-heading font-bold text-foreground font-data">
              {stat?.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Zone-Specific Pricing
          </h2>
          <Icon name="MapPin" size={24} className="text-primary" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zonePricing?.map((pricing, index) => (
            <div key={index} className="p-4 rounded-lg border border-border bg-muted/50">
              <h3 className="font-heading font-semibold text-foreground mb-3">{pricing?.zone}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="font-semibold text-foreground font-data">${pricing?.basePrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Currency</span>
                  <span className="font-semibold text-foreground">{pricing?.currency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Volume (24h)</span>
                  <span className="font-semibold text-foreground font-data">{pricing?.volume}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Real-Time Transaction Feed
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live</span>
          </div>
        </div>
        <div className="space-y-3">
          {recentTransactions?.map((transaction) => (
            <div key={transaction?.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="User" size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{transaction?.user}</p>
                  <p className="text-xs text-muted-foreground">{transaction?.election}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground font-data">${transaction?.amount}</p>
                  <p className="text-xs text-muted-foreground">{transaction?.zone}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction?.status)}`}>
                  {transaction?.status}
                </span>
                <span className="text-xs text-muted-foreground min-w-[80px] text-right">{transaction?.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Instant Confirmation
            </h2>
            <Icon name="Zap" size={24} className="text-accent" />
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-success/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="text-sm font-medium text-foreground">Real-Time Processing</span>
              </div>
              <p className="text-xs text-muted-foreground">Average confirmation time: 1.8 seconds</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Bell" size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Instant Notifications</span>
              </div>
              <p className="text-xs text-muted-foreground">Email & SMS confirmation sent immediately</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Refund Management
            </h2>
            <Icon name="RotateCcw" size={24} className="text-accent" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium text-foreground">Pending Refunds</span>
              <span className="text-lg font-bold text-foreground font-data">12</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium text-foreground">Processed Today</span>
              <span className="text-lg font-bold text-foreground font-data">8</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium text-foreground">Avg Processing Time</span>
              <span className="text-lg font-bold text-foreground font-data">2.4h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipationFeeProcessing;