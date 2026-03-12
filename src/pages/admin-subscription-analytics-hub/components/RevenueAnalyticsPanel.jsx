import React from 'react';
import { PieChart, DollarSign, Globe, CreditCard } from 'lucide-react';

const RevenueAnalyticsPanel = ({ analytics }) => {
  const planTypeData = analytics?.byPlanType || {};
  const durationData = analytics?.byDuration || {};
  const countryData = analytics?.byCountry || {};

  const topCountries = Object.entries(countryData)?.sort((a, b) => b?.[1]?.revenue - a?.[1]?.revenue)?.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-green-600" />
        Revenue Analytics
      </h2>
      {/* Revenue by Plan Type */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <PieChart className="w-4 h-4" />
          Revenue by Plan Type
        </h3>
        <div className="space-y-3">
          {Object.entries(planTypeData)?.map(([type, data]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                  <span className="text-sm font-bold text-gray-900">${data?.revenue?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      type === 'individual' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                    style={{
                      width: `${(data?.revenue / parseFloat(analytics?.totalRevenue || 1)) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{data?.count || 0} subscriptions</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Revenue by Duration */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Revenue by Duration
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(durationData)?.map(([duration, data]) => (
            <div key={duration} className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1 capitalize">
                {duration?.replace('_', ' ')}
              </div>
              <div className="text-lg font-bold text-gray-900">${data?.revenue?.toFixed(2) || '0.00'}</div>
              <div className="text-xs text-gray-500">{data?.count || 0} subs</div>
            </div>
          ))}
        </div>
      </div>
      {/* Top Countries by Revenue */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Top Countries by Revenue
        </h3>
        <div className="space-y-2">
          {topCountries?.map(([country, data], index) => (
            <div key={country} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 w-6">#{index + 1}</span>
                <span className="text-sm font-medium text-gray-700">{country}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">${data?.revenue?.toFixed(2) || '0.00'}</div>
                <div className="text-xs text-gray-500">{data?.count || 0} subs</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalyticsPanel;