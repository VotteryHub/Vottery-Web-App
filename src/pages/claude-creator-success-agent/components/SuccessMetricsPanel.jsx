import React from 'react';
import { Users, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import Icon from '../../../components/AppIcon';

const SuccessMetricsPanel = ({ metrics }) => {
  return (
    <div className="max-w-[1600px] mx-auto px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Total Creators</span>
            <Icon name={Users} size={20} className="text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-900">{metrics?.totalCreators || 0}</div>
          <p className="text-xs text-blue-600 mt-2">Monitored creators</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-700">At-Risk Creators</span>
            <Icon name={AlertTriangle} size={20} className="text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-900">{metrics?.atRiskCreators || 0}</div>
          <p className="text-xs text-red-600 mt-2">Requiring intervention</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Successful Interventions</span>
            <Icon name={CheckCircle} size={20} className="text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-900">{metrics?.successfulInterventions || 0}</div>
          <p className="text-xs text-green-600 mt-2">Retention achieved</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700">Avg Health Score</span>
            <Icon name={TrendingUp} size={20} className="text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-900">{metrics?.averageHealthScore || 0}</div>
          <p className="text-xs text-purple-600 mt-2">
            {metrics?.interventionSuccessRate?.toFixed(1) || 0}% success rate
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessMetricsPanel;