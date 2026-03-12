import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceOptimizationPanel = ({ data }) => {
  const [filter, setFilter] = useState('all');

  const getEffortColor = (effort) => {
    switch (effort?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'recommended': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'in_review': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'approved': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'implemented': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const categories = ['all', 'Revenue Enhancement', 'Engagement Optimization', 'Content Strategy', 'Technical Performance'];
  const filteredData = filter === 'all' ? data : data?.filter(item => item?.category === filter);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories?.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                filter === category
                  ? 'bg-orange-600 text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Optimization Cards */}
      <div className="space-y-4">
        {filteredData?.map((optimization) => (
          <div
            key={optimization?.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-orange-300 dark:hover:border-orange-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(optimization?.status)}`}>
                    {optimization?.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                    {optimization?.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getEffortColor(optimization?.effort)}`}>
                    {optimization?.effort} Effort
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{optimization?.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{optimization?.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="TrendingUp" className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-900 dark:text-green-100">Estimated Impact</span>
                </div>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">{optimization?.estimatedImpact}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Clock" className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">Timeline</span>
                </div>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{optimization?.timeline}</p>
              </div>

              <div className={`rounded-lg p-4 ${getEffortColor(optimization?.effort)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Zap" className="w-4 h-4" />
                  <span className="text-xs font-semibold">Implementation Effort</span>
                </div>
                <p className="text-lg font-bold">{optimization?.effort}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button size="sm" className="flex items-center gap-2">
                <Icon name="Play" className="w-4 h-4" />
                Start Implementation
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Icon name="FileText" className="w-4 h-4" />
                View Details
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Icon name="Users" className="w-4 h-4" />
                Assign Team
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Icon name="X" className="w-4 h-4" />
                Dismiss
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredData?.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Icon name="Inbox" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No optimizations found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceOptimizationPanel;