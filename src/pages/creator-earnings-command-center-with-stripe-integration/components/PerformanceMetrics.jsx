import React from 'react';
import { Award, TrendingUp, Users, Target } from 'lucide-react';
import Icon from '../../../components/AppIcon';

const PerformanceMetrics = ({ data }) => {
  const metrics = [
    {
      label: 'Election Success Rate',
      value: `${data?.electionSuccessRate || 0}%`,
      description: `${data?.completedElections || 0} of ${data?.totalElections || 0} elections completed`,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Audience Engagement',
      value: data?.audienceEngagement?.avgVotesPerElection || 0,
      description: `${data?.audienceEngagement?.totalVotes || 0} total votes`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Revenue Optimization Score',
      value: `${data?.revenueOptimization?.score || 0}%`,
      description: `Avg CPE: $${data?.revenueOptimization?.avgCPE || 0}`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics?.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${metric?.bgColor}`}>
                <Icon icon={metric?.icon} className={`w-6 h-6 ${metric?.color}`} />
              </div>
              <h3 className="text-sm font-medium text-gray-600">{metric?.label}</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{metric?.value}</p>
            <p className="text-sm text-gray-500">{metric?.description}</p>
          </div>
        ))}
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon icon={TrendingUp} className="w-5 h-5 text-purple-600" />
          Revenue Optimization Recommendations
        </h3>
        <div className="space-y-3">
          {data?.revenueOptimization?.recommendations?.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-purple-600">{index + 1}</span>
              </div>
              <p className="text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Total Elections Created</span>
            <span className="text-xl font-bold text-gray-900">{data?.totalElections || 0}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Completed Elections</span>
            <span className="text-xl font-bold text-green-600">{data?.completedElections || 0}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Average Votes Per Election</span>
            <span className="text-xl font-bold text-blue-600">{data?.audienceEngagement?.avgVotesPerElection || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
