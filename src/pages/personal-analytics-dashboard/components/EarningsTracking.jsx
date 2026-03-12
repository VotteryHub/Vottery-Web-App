import React from 'react';
import Icon from '../../../components/AppIcon';
import { stripeService } from '../../../services/stripeService';
import { format } from 'date-fns';

const EarningsTracking = ({ data, timeRange }) => {
  const recentTransactions = data?.transactions?.slice(0, 5) || [];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Earnings Tracking</h2>
        <Icon name="DollarSign" size={20} className="text-success" />
      </div>

      <div className="space-y-6">
        {/* Earnings Summary */}
        <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Earnings ({timeRange?.replace('d', ' days')})</p>
          <p className="text-4xl font-bold text-foreground mb-4">
            {stripeService?.formatCurrency(data?.periodEarnings || 0)}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Lifetime Total</p>
              <p className="text-lg font-semibold text-foreground">
                {stripeService?.formatCurrency(data?.totalEarnings || 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Avg. Per Election</p>
              <p className="text-lg font-semibold text-foreground">
                {stripeService?.formatCurrency(data?.averagePerElection || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Winnings */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Recent Winnings</h3>
          {recentTransactions?.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions?.map((transaction) => (
                <div
                  key={transaction?.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {transaction?.elections?.title || 'Election Winning'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction?.createdAt ? format(new Date(transaction?.createdAt), 'MMM dd, yyyy') : 'Recent'}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-success">
                    +{stripeService?.formatCurrency(transaction?.amount || 0)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Inbox" size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No winnings in this period</p>
            </div>
          )}
        </div>

        {/* Earnings Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Lightbulb" size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Earnings Insight</p>
              <p className="text-xs text-blue-700">
                {data?.periodEarnings > 0 
                  ? `You're earning ${stripeService?.formatCurrency(data?.averagePerElection || 0)} per election on average. Keep participating to increase your earnings!`
                  : 'Participate in more elections to start earning rewards and prizes!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsTracking;