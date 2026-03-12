import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendationCard = ({ recommendation, onApprove }) => {
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleApprove = async () => {
    setApproving(true);
    try {
      await onApprove(recommendation);
      setApproved(true);
    } catch (error) {
      console.error('Approval error:', error);
    } finally {
      setApproving(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
      medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      low: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    };
    return colors?.[priority] || colors?.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      campaign: 'Target',
      moderation: 'Shield',
      engagement: 'Users',
      revenue: 'DollarSign',
      performance: 'Zap'
    };
    return icons?.[category] || 'Lightbulb';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 border-2 transition-all ${
      approved
        ? 'border-green-500 bg-green-50 dark:bg-green-900/10' :'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name={getCategoryIcon(recommendation?.category)} size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {recommendation?.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(recommendation?.priority)}`}>
                {recommendation?.priority?.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {recommendation?.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Icon name="TrendingUp" size={16} className="text-green-600 dark:text-green-400" />
                <span className="font-semibold text-green-600 dark:text-green-400">
                  +{recommendation?.expectedImpact}% Impact
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Target" size={16} className="text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {recommendation?.confidenceScore}% Confidence
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Tag" size={16} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {recommendation?.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Steps */}
      {recommendation?.implementationSteps?.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            <Icon name="List" size={16} />
            Implementation Steps
          </h4>
          <ol className="space-y-1">
            {recommendation?.implementationSteps?.map((step, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-semibold">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-center gap-3">
        {approved ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Icon name="CheckCircle" size={20} />
            <span className="font-semibold">Approved & Executing</span>
          </div>
        ) : (
          <>
            <Button
              onClick={handleApprove}
              disabled={approving}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {approving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Approving...
                </>
              ) : (
                <>
                  <Icon name="Zap" size={16} />
                  1-Click Approve & Execute
                </>
              )}
            </Button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Icon name="Info" size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;