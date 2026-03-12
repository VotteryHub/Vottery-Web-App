import React from 'react';
import Icon from '../../../components/AppIcon';
import { subscriptionService } from '../../../services/subscriptionService';

const DashboardOverview = ({ subscriptions, plans, metrics, onRefresh }) => {
  const activeSubscriptions = subscriptions?.filter(sub => sub?.isActive) || [];
  const recentSubscriptions = subscriptions?.slice(0, 10) || [];

  const getStatusBadge = (subscription) => {
    const status = subscriptionService?.getSubscriptionStatus(subscription);
    const statusConfig = {
      active: { label: 'Active', color: 'bg-green-100 text-green-800' },
      expiring_soon: { label: 'Expiring Soon', color: 'bg-orange-100 text-orange-800' },
      expired: { label: 'Expired', color: 'bg-red-100 text-red-800' },
      canceled: { label: 'Canceled', color: 'bg-gray-100 text-gray-800' },
      none: { label: 'None', color: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig?.[status] || statusConfig?.none;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Subscription Analytics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" className="w-5 h-5 text-primary" />
          Subscription Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Subscriptions</p>
            <p className="text-2xl font-bold text-foreground">{subscriptions?.length || 0}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-2xl font-bold text-green-600">{activeSubscriptions?.length || 0}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Plans Available</p>
            <p className="text-2xl font-bold text-foreground">{plans?.length || 0}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold text-primary">
              {subscriptions?.length > 0 ? ((activeSubscriptions?.length / subscriptions?.length) * 100)?.toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>
      {/* Recent Subscriptions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Clock" className="w-5 h-5 text-primary" />
          Recent Subscriptions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Start Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">End Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Auto-Renew</th>
              </tr>
            </thead>
            <tbody>
              {recentSubscriptions?.map((subscription) => (
                <tr key={subscription?.id} className="border-b border-border hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {subscription?.userProfiles?.fullName || 'Unknown User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {subscription?.userProfiles?.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{subscription?.subscriptionPlans?.planName}</p>
                    <p className="text-xs text-muted-foreground">
                      {subscriptionService?.formatCurrency(subscription?.subscriptionPlans?.price)}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(subscription)}
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {new Date(subscription?.startDate)?.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {new Date(subscription?.endDate)?.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {subscription?.autoRenew ? (
                      <Icon name="Check" className="w-5 h-5 text-green-600" />
                    ) : (
                      <Icon name="X" className="w-5 h-5 text-red-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentSubscriptions?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No subscriptions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;