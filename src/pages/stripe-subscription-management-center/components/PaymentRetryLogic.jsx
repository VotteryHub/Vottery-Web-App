import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { subscriptionService } from '../../../services/subscriptionService';

const PaymentRetryLogic = ({ retryQueue, onRefresh }) => {
  const [retrying, setRetrying] = useState({});

  const getDaysSinceExpiry = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = now - end;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleRetryPayment = async (subscriptionId) => {
    setRetrying(prev => ({ ...prev, [subscriptionId]: true }));
    // Simulate retry logic
    setTimeout(() => {
      setRetrying(prev => ({ ...prev, [subscriptionId]: false }));
      onRefresh();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="RefreshCw" className="w-5 h-5 text-primary" />
            Payment Retry Logic
          </h2>
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Icon name="RefreshCw" className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Retry Queue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="AlertCircle" className="w-5 h-5 text-red-600" />
              <span className="text-sm text-muted-foreground">Failed Payments</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{retryQueue?.length || 0}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="DollarSign" className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-muted-foreground">At-Risk Revenue</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {subscriptionService?.formatCurrency(
                retryQueue?.reduce((sum, sub) => sum + parseFloat(sub?.subscriptionPlans?.price || 0), 0)
              )}
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Avg Days Overdue</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {retryQueue?.length > 0
                ? Math.round(
                    retryQueue?.reduce((sum, sub) => sum + getDaysSinceExpiry(sub?.endDate), 0) / retryQueue?.length
                  )
                : 0}
            </p>
          </div>
        </div>

        {/* Retry Queue */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Payment Retry Queue</h3>
          <div className="space-y-3">
            {retryQueue?.map((subscription) => {
              const daysOverdue = getDaysSinceExpiry(subscription?.endDate);
              const isRetrying = retrying?.[subscription?.id];
              return (
                <div key={subscription?.id} className="p-4 bg-muted/30 rounded-lg border border-red-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <Icon name="AlertCircle" className="w-5 h-5 text-red-600" />
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
                          <p className="text-xs text-muted-foreground">Amount Due</p>
                          <p className="text-sm font-medium text-red-600">
                            {subscriptionService?.formatCurrency(subscription?.subscriptionPlans?.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Expired On</p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(subscription?.endDate)?.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Days Overdue</p>
                          <p className="text-sm font-medium text-red-600">
                            {daysOverdue} days
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleRetryPayment(subscription?.id)}
                        disabled={isRetrying}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {isRetrying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Retrying...
                          </>
                        ) : (
                          <>
                            <Icon name="RefreshCw" className="w-4 h-4" />
                            Retry Payment
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Icon name="Mail" className="w-4 h-4" />
                        Send Reminder
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {retryQueue?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No failed payments to retry
              </div>
            )}
          </div>
        </div>

        {/* Dunning Management Info */}
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="Info" className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="font-medium text-orange-900 mb-1">Dunning Management</p>
              <p className="text-sm text-orange-800">
                Automated retry attempts: Day 3, Day 7, Day 14, Day 21 after payment failure.
                Customer notifications sent before each retry attempt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRetryLogic;