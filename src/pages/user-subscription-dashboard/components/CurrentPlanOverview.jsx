import React from 'react';
import Icon from '../../../components/AppIcon';
import { subscriptionService } from '../../../services/subscriptionService';

const CurrentPlanOverview = ({ subscription, onRefresh }) => {
  if (!subscription) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <Icon name="Package" className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">No Active Subscription</h2>
        <p className="text-muted-foreground mb-6">
          You don't have an active subscription. Choose a plan to get started.
        </p>
      </div>
    );
  }

  const status = subscriptionService?.getSubscriptionStatus(subscription);
  const daysUntilRenewal = Math.ceil(
    (new Date(subscription?.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Crown" className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                {subscription?.subscriptionPlans?.planName}
              </h2>
            </div>
            <p className="text-muted-foreground capitalize">
              {subscription?.subscriptionPlans?.planType} Plan
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">
              {subscriptionService?.formatCurrency(subscription?.subscriptionPlans?.price)}
            </p>
            <p className="text-sm text-muted-foreground">
              per {subscription?.subscriptionPlans?.duration?.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' :
            status === 'expiring_soon'? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
          }`}>
            {status === 'active' ? 'Active' :
             status === 'expiring_soon'? 'Expiring Soon' : 'Expired'}
          </span>
          {subscription?.autoRenew && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
              <Icon name="RefreshCw" className="w-3 h-3" />
              Auto-Renew Enabled
            </span>
          )}
        </div>

        {/* Plan Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {subscription?.subscriptionPlans?.features?.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-foreground">
              <Icon name="Check" className="w-5 h-5 text-green-600" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Subscription Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Calendar" className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Start Date</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {new Date(subscription?.startDate)?.toLocaleDateString()}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Calendar" className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Next Billing Date</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {new Date(subscription?.endDate)?.toLocaleDateString()}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Days Until Renewal</span>
          </div>
          <p className={`text-lg font-semibold ${
            daysUntilRenewal <= 7 ? 'text-orange-600' : 'text-foreground'
          }`}>
            {daysUntilRenewal > 0 ? `${daysUntilRenewal} days` : 'Expired'}
          </p>
        </div>
      </div>
      {/* Usage Metrics (Placeholder) */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart3" className="w-5 h-5 text-primary" />
          Usage This Billing Cycle
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Elections Created</p>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground mt-1">Unlimited available</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Votes Received</p>
            <p className="text-2xl font-bold text-foreground">1,847</p>
            <p className="text-xs text-muted-foreground mt-1">No limits</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">API Calls</p>
            <p className="text-2xl font-bold text-foreground">3,421</p>
            <p className="text-xs text-muted-foreground mt-1">of 10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlanOverview;