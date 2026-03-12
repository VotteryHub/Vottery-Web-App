import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { subscriptionService } from '../../../services/subscriptionService';

const BillingHistory = ({ subscriptionHistory }) => {
  const handleDownloadInvoice = (subscriptionId) => {
    // Placeholder for invoice download
    alert(`Downloading invoice for subscription ${subscriptionId}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Receipt" className="w-5 h-5 text-primary" />
          Billing History
        </h2>

        {/* Billing Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="DollarSign" className="w-5 h-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Total Spent</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {subscriptionService?.formatCurrency(
                subscriptionHistory?.reduce((sum, sub) => {
                  return sum + parseFloat(sub?.subscriptionPlans?.price || 0);
                }, 0)
              )}
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Calendar" className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Total Billing Cycles</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {subscriptionHistory?.length || 0}
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Member Since</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {subscriptionHistory?.length > 0
                ? new Date(subscriptionHistory[subscriptionHistory?.length - 1]?.startDate)?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Payment History</h3>
          <div className="space-y-3">
            {subscriptionHistory?.map((subscription) => (
              <div key={subscription?.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        subscription?.isActive ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Icon
                          name={subscription?.isActive ? 'CheckCircle' : 'Clock'}
                          className={`w-5 h-5 ${
                            subscription?.isActive ? 'text-green-600' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {subscription?.subscriptionPlans?.planName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(subscription?.startDate)?.toLocaleDateString()} - {new Date(subscription?.endDate)?.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-sm font-medium text-foreground">
                          {subscriptionService?.formatCurrency(subscription?.subscriptionPlans?.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className={`text-sm font-medium ${
                          subscription?.isActive ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {subscription?.isActive ? 'Active' : 'Completed'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium text-foreground capitalize">
                          {subscription?.subscriptionPlans?.duration?.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Auto-Renew</p>
                        <p className="text-sm font-medium text-foreground">
                          {subscription?.autoRenew ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      onClick={() => handleDownloadInvoice(subscription?.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Icon name="Download" className="w-4 h-4" />
                      Invoice
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {subscriptionHistory?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No billing history available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingHistory;