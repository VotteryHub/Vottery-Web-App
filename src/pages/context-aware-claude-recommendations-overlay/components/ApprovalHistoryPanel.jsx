import React from 'react';
import Icon from '../../../components/AppIcon';

const ApprovalHistoryPanel = ({ history }) => {
  const getStatusColor = (status) => {
    const colors = {
      approved: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
      completed: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
      failed: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
    };
    return colors?.[status] || colors?.pending;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Icon name="History" size={20} />
          Approval History
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Track all approved recommendations and their outcomes
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {history?.length > 0 ? (
          history?.map((item, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {item?.recommendationTitle}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      {new Date(item?.executedAt)?.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Target" size={14} />
                      {item?.confidenceScore}% confidence
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item?.status)}`}>
                  {item?.status?.toUpperCase()}
                </span>
              </div>

              {item?.successMetrics && (
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="TrendingUp" size={16} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Expected: <strong>+{item?.expectedImpact}%</strong>
                    </span>
                    {item?.actualImpact && (
                      <>
                        <span className="text-gray-500 dark:text-gray-400">|</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          Actual: <strong className="text-green-600 dark:text-green-400">+{item?.actualImpact}%</strong>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <Icon name="Inbox" size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No approval history yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalHistoryPanel;