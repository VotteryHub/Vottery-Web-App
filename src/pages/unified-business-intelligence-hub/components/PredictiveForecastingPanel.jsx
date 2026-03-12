import React from 'react';
import Icon from '../../../components/AppIcon';

const PredictiveForecastingPanel = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* User Growth Forecast */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} className="text-blue-500" />
          User Growth Forecast
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">30 Days</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {data?.userGrowth?.day30?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Projected Users</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">60 Days</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {data?.userGrowth?.day60?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Projected Users</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">90 Days</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {data?.userGrowth?.day90?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Projected Users</p>
          </div>
        </div>
      </div>

      {/* Revenue Forecast */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={20} className="text-green-500" />
          Revenue Forecast
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">30 Days</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              ${data?.revenue?.day30?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Projected Revenue</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">60 Days</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              ${data?.revenue?.day60?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Projected Revenue</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">90 Days</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              ${data?.revenue?.day90?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Projected Revenue</p>
          </div>
        </div>
      </div>

      {/* Threat Predictions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="ShieldAlert" size={20} className="text-red-500" />
          Security Threat Predictions
        </h3>
        <div className="space-y-3">
          {data?.threats?.map((threat, idx) => (
            <div key={idx} className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="AlertTriangle" size={18} className="text-red-600 dark:text-red-400 mt-1" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{threat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Risk Forecasting */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="FileCheck" size={20} className="text-orange-500" />
          Compliance Risk Forecasting
        </h3>
        <div className="space-y-3">
          {data?.complianceRisks?.map((risk, idx) => (
            <div key={idx} className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="AlertCircle" size={18} className="text-orange-600 dark:text-orange-400 mt-1" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{risk}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capacity Planning */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Server" size={20} className="text-purple-500" />
          Platform Capacity Requirements
        </h3>
        <div className="space-y-3">
          {data?.capacityNeeds?.map((need, idx) => (
            <div key={idx} className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="Database" size={18} className="text-purple-600 dark:text-purple-400 mt-1" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{need}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictiveForecastingPanel;