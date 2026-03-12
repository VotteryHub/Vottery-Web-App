import React from 'react';
import { TrendingUp, Award, XCircle, RefreshCw } from 'lucide-react';

const SubscriptionPerformancePanel = ({ analytics }) => {
  const subscriptions = analytics?.subscriptions || [];
  
  // Calculate upgrade/downgrade patterns
  const planChanges = subscriptions?.reduce((acc, sub) => {
    const planName = sub?.plan?.planName || 'Unknown';
    if (!acc?.[planName]) {
      acc[planName] = { count: 0, active: 0, canceled: 0 };
    }
    acc[planName].count++;
    if (sub?.isActive) acc[planName].active++;
    else acc[planName].canceled++;
    return acc;
  }, {});

  const planPerformance = Object.entries(planChanges)?.map(([name, data]) => ({
      name,
      ...data,
      retentionRate: data?.count > 0 ? ((data?.active / data?.count) * 100)?.toFixed(1) : 0
    }))?.sort((a, b) => b?.count - a?.count);

  // Calculate cancellation reasons (mock data for demonstration)
  const cancellationReasons = [
    { reason: 'Price too high', count: Math.floor(analytics?.canceledSubscriptions * 0.35) || 0 },
    { reason: 'Not using enough', count: Math.floor(analytics?.canceledSubscriptions * 0.25) || 0 },
    { reason: 'Found alternative', count: Math.floor(analytics?.canceledSubscriptions * 0.20) || 0 },
    { reason: 'Missing features', count: Math.floor(analytics?.canceledSubscriptions * 0.12) || 0 },
    { reason: 'Other', count: Math.floor(analytics?.canceledSubscriptions * 0.08) || 0 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        Subscription Performance
      </h2>
      {/* Plan Popularity */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4" />
          Plan Popularity & Retention
        </h3>
        <div className="space-y-3">
          {planPerformance?.map((plan, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{plan?.name}</span>
                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {plan?.count} subscribers
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Active: {plan?.active}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Canceled: {plan?.canceled}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="font-semibold">{plan?.retentionRate}% retention</span>
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${plan?.retentionRate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Cancellation Reasons */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          Top Cancellation Reasons
        </h3>
        <div className="space-y-2">
          {cancellationReasons?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{item?.reason}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${(item?.count / (analytics?.canceledSubscriptions || 1)) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8 text-right">{item?.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Reactivation Opportunity */}
      <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-semibold text-gray-700">Reactivation Opportunity</span>
        </div>
        <p className="text-xs text-gray-600 mb-2">
          {analytics?.canceledSubscriptions || 0} canceled subscriptions could be reactivated with targeted campaigns
        </p>
        <button className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors">
          Launch Win-Back Campaign →
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPerformancePanel;