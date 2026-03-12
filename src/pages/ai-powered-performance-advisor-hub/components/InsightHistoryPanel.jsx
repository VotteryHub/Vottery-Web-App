import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InsightHistoryPanel = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const historyData = [
    {
      id: 1,
      date: new Date('2025-01-25'),
      type: 'claude',
      category: 'Content Strategy',
      title: 'Optimize Election Timing',
      status: 'implemented',
      impact: '+42% engagement',
      confidence: 0.89
    },
    {
      id: 2,
      date: new Date('2025-01-22'),
      type: 'perplexity',
      category: 'Market Intelligence',
      title: 'Competitor Analysis: VoteNow',
      status: 'in_progress',
      impact: 'TBD',
      confidence: 0.82
    },
    {
      id: 3,
      date: new Date('2025-01-20'),
      type: 'consensus',
      category: 'Revenue Enhancement',
      title: 'Dynamic Prize Pool Allocation',
      status: 'approved',
      impact: '+$12K monthly',
      confidence: 0.92
    },
    {
      id: 4,
      date: new Date('2025-01-18'),
      type: 'claude',
      category: 'User Engagement',
      title: 'Personalized Notifications',
      status: 'dismissed',
      impact: 'N/A',
      confidence: 0.75
    },
    {
      id: 5,
      date: new Date('2025-01-15'),
      type: 'perplexity',
      category: 'Trend Forecasting',
      title: 'Video-First Voting Trend',
      status: 'implemented',
      impact: '+3x engagement',
      confidence: 0.78
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'claude': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'perplexity': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'consensus': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'implemented': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'approved': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'dismissed': return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'implemented': return 'CheckCircle2';
      case 'in_progress': return 'Clock';
      case 'approved': return 'ThumbsUp';
      case 'dismissed': return 'X';
      default: return 'Circle';
    }
  };

  const filteredData = filter === 'all' ? historyData : historyData?.filter(item => item?.status === filter);

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e?.target?.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All</option>
              <option value="implemented">Implemented</option>
              <option value="in_progress">In Progress</option>
              <option value="approved">Approved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="date">Date</option>
              <option value="confidence">Confidence</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-6">
          <Icon name="Clock" className="w-5 h-5 text-gray-600" />
          Insight History
        </h2>
        <div className="space-y-4">
          {filteredData?.map((item, index) => (
            <div key={item?.id} className="relative">
              {/* Timeline Line */}
              {index < filteredData?.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
              )}

              <div className="flex items-start gap-4">
                {/* Timeline Dot */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(item?.type)}`}>
                  <Icon
                    name={item?.type === 'claude' ? 'Brain' : item?.type === 'perplexity' ? 'TrendingUp' : 'GitMerge'}
                    className="w-5 h-5"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item?.status)}`}>
                          <Icon name={getStatusIcon(item?.status)} className="w-3 h-3 inline mr-1" />
                          {item?.status?.replace('_', ' ')?.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                          {item?.category}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{item?.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item?.date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{(item?.confidence * 100)?.toFixed(0)}%</p>
                    </div>
                  </div>

                  {item?.status === 'implemented' && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <Icon name="TrendingUp" className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">Impact: {item?.impact}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Icon name="Eye" className="w-4 h-4" />
                      View Details
                    </Button>
                    {item?.status === 'implemented' && (
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Icon name="BarChart3" className="w-4 h-4" />
                        View Metrics
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredData?.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Icon name="Inbox" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No insights found for this filter.</p>
        </div>
      )}
    </div>
  );
};

export default InsightHistoryPanel;