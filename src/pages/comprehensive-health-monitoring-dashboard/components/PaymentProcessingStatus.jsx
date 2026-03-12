import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentProcessingStatus = ({ paymentProcessing }) => {
  const metrics = [
    { label: 'Success Rate', value: `${paymentProcessing?.successRate}%`, icon: 'CheckCircle', status: 'healthy' },
    { label: 'Gateway Health', value: paymentProcessing?.gatewayHealth, icon: 'CreditCard', status: 'healthy' },
    { label: 'Settlement Status', value: paymentProcessing?.settlementProcessing, icon: 'Clock', status: 'healthy' },
    { label: 'Compliance Status', value: paymentProcessing?.complianceStatus, icon: 'ShieldCheck', status: 'healthy' },
    { label: 'Transaction Volume', value: paymentProcessing?.transactionVolume?.toLocaleString(), icon: 'TrendingUp', status: 'healthy' },
    { label: 'Avg Processing Time', value: `${paymentProcessing?.avgProcessingTime}s`, icon: 'Zap', status: 'healthy' }
  ];

  const transactionFlow = [
    { stage: 'Initiated', count: 9234, percentage: 100, status: 'healthy' },
    { stage: 'Authorized', count: 9156, percentage: 99.2, status: 'healthy' },
    { stage: 'Captured', count: 9087, percentage: 98.4, status: 'healthy' },
    { stage: 'Settled', count: 8934, percentage: 96.8, status: 'healthy' },
    { stage: 'Failed', count: 300, percentage: 3.2, status: 'warning' }
  ];

  const gatewayStatus = [
    { name: 'Stripe', status: 'operational', transactions: 7234, successRate: 99.1 },
    { name: 'PayPal', status: 'operational', transactions: 1456, successRate: 98.5 },
    { name: 'Crypto Gateway', status: 'operational', transactions: 244, successRate: 97.8 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': case'operational': return 'text-green-500 bg-green-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'critical': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(metric?.status)}`}>
                <Icon name={metric?.icon} size={20} className={getStatusColor(metric?.status)?.split(' ')?.[0]} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(metric?.status)}`}>
                {metric?.status}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1 capitalize">{metric?.value}</div>
            <div className="text-sm text-muted-foreground">{metric?.label}</div>
          </div>
        ))}
      </div>

      {/* Transaction Flow */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} className="text-primary" />
          Transaction Flow (Last 24 Hours)
        </h3>
        <div className="space-y-4">
          {transactionFlow?.map((stage, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{stage?.stage}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(stage?.status)}`}>
                    {stage?.status}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">{stage?.count?.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{stage?.percentage}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    stage?.status === 'healthy' ? 'bg-green-500' :
                    stage?.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${stage?.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gateway Status */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Payment Gateway Status</h3>
        <div className="space-y-3">
          {gatewayStatus?.map((gateway, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-medium text-foreground">{gateway?.name}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(gateway?.status)}`}>
                  {gateway?.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Transactions</span>
                  <div className="text-sm font-semibold text-foreground">{gateway?.transactions?.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Success Rate</span>
                  <div className="text-sm font-semibold text-green-500">{gateway?.successRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Monitoring */}
      <div className="card p-6 border-2 border-green-500/30 bg-green-500/5">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="ShieldCheck" size={20} className="text-green-500" />
          <h3 className="text-lg font-semibold text-foreground">Compliance Monitoring</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={18} className="text-green-500" />
              <span className="font-medium text-foreground">PCI DSS</span>
            </div>
            <p className="text-sm text-muted-foreground">Compliant - Last audit: 15 days ago</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={18} className="text-green-500" />
              <span className="font-medium text-foreground">AML/KYC</span>
            </div>
            <p className="text-sm text-muted-foreground">Compliant - All checks passing</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={18} className="text-green-500" />
              <span className="font-medium text-foreground">GDPR</span>
            </div>
            <p className="text-sm text-muted-foreground">Compliant - Data protection active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingStatus;