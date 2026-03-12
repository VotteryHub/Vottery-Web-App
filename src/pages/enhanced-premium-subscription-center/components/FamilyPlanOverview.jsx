import React from 'react';
import { Crown, Users, Calendar, CheckCircle, Zap } from 'lucide-react';

const PLAN_FEATURES = [
  'Up to 6 family members', 'Shared VP wallet', 'Priority AI quest generation',
  'Advanced analytics dashboard', 'Family leaderboard', 'Parental controls',
  'Premium election creation', 'Ad-free experience',
];

const FamilyPlanOverview = ({ subscriptionData, onRefresh }) => {
  const renewalDate = subscriptionData?.renewalDate ? new Date(subscriptionData.renewalDate)?.toLocaleDateString() : 'N/A';
  const daysUntilRenewal = subscriptionData?.renewalDate
    ? Math.ceil((new Date(subscriptionData.renewalDate) - new Date()) / 86400000) : 30;

  return (
    <div className="space-y-6">
      {/* Plan Card */}
      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Crown size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{subscriptionData?.plan || 'Premium Family'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium capitalize">{subscriptionData?.status || 'active'}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-foreground">${subscriptionData?.monthlySpend || '29.99'}</p>
            <p className="text-sm text-muted-foreground">/month</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3 text-center">
            <Users size={20} className="text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{subscriptionData?.memberCount || 4}/{subscriptionData?.maxMembers || 6}</p>
            <p className="text-xs text-muted-foreground">Members</p>
          </div>
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3 text-center">
            <Calendar size={20} className="text-purple-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{daysUntilRenewal}d</p>
            <p className="text-xs text-muted-foreground">Until Renewal</p>
          </div>
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3 text-center">
            <Zap size={20} className="text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{subscriptionData?.usageScore || 78}%</p>
            <p className="text-xs text-muted-foreground">Usage Score</p>
          </div>
        </div>
      </div>
      {/* Plan Features */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Included Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PLAN_FEATURES?.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Cost Per Member */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Cost Analysis</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-xl">
            <p className="text-2xl font-bold text-foreground">${((subscriptionData?.monthlySpend || 29.99) / (subscriptionData?.memberCount || 4))?.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Cost per member</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-xl">
            <p className="text-2xl font-bold text-green-500">${((subscriptionData?.monthlySpend || 29.99) * 12)?.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Annual spend</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-xl">
            <p className="text-2xl font-bold text-purple-500">{subscriptionData?.maxMembers - subscriptionData?.memberCount || 2}</p>
            <p className="text-xs text-muted-foreground mt-1">Slots available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyPlanOverview;
