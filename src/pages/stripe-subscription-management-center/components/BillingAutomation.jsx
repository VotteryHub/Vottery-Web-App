import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { subscriptionService } from '../../../services/subscriptionService';

const BillingAutomation = ({ billingQueue, plans, onRefresh }) => {
  const getDaysUntilRenewal = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Calendar" className="w-5 h-5 text-primary" />
            Billing Cycle Automation
          </h2>
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Icon name="RefreshCw" className="w-4 h-4" />
            Refresh Queue
          </Button>
        </div>

        {/* Billing Queue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-muted-foreground">Upcoming Renewals</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{billingQueue?.length || 0}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="DollarSign" className="w-5 h-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Expected Revenue</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {subscriptionService?.formatCurrency(
                billingQueue?.reduce((sum, sub) => sum + parseFloat(sub?.subscriptionPlans?.price || 0), 0)
              )}
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Auto-Renew Rate</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {billingQueue?.length > 0 
                ? ((billingQueue?.filter(s => s?.autoRenew)?.length / billingQueue?.length) * 100)?.toFixed(0)
                : 0}%
            </p>
          </div>
        </div>

        {/* Billing Queue */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Renewal Queue (Next 7 Days)</h3>
          <div className="space-y-3">
            {billingQueue?.map((subscription) => {
              const daysUntil = getDaysUntilRenewal(subscription?.endDate);
              return (
                <div key={subscription?.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon name="User" className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {subscription?.userProfiles?.fullName || 'Unknown User'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {subscription?.userProfiles?.email}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Plan</p>
                          <p className="text-sm font-medium text-foreground">
                            {subscription?.subscriptionPlans?.planName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="text-sm font-medium text-foreground">
                            {subscriptionService?.formatCurrency(subscription?.subscriptionPlans?.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Renewal Date</p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(subscription?.endDate)?.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Days Until</p>
                          <p className={`text-sm font-medium ${
                            daysUntil <= 2 ? 'text-red-600' : daysUntil <= 5 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {daysUntil} days
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {subscription?.autoRenew ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                          <Icon name="Check" className="w-3 h-3" />
                          Auto-Renew
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium flex items-center gap-1">
                          <Icon name="AlertTriangle" className="w-3 h-3" />
                          Manual
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {billingQueue?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming renewals in the next 7 days
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingAutomation;