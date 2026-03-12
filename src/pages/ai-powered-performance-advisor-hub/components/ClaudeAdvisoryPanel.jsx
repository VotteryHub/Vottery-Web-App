import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClaudeAdvisoryPanel = ({ data }) => {
  const [expandedId, setExpandedId] = useState(null);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getConfidenceWidth = (confidence) => {
    return `${confidence * 100}%`;
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Icon name="Activity" className="w-5 h-5 text-purple-600" />
            System Health Score
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-purple-600">{data?.systemHealth?.overallScore}</span>
            <span className="text-sm text-gray-500">/100</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.systemHealth?.areas?.map((area, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{area?.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{area?.score}</span>
                  <Icon
                    name={area?.trend === 'up' ? 'TrendingUp' : area?.trend === 'down' ? 'TrendingDown' : 'Minus'}
                    className={`w-4 h-4 ${
                      area?.trend === 'up' ? 'text-green-600' : area?.trend === 'down' ? 'text-red-600' : 'text-gray-400'
                    }`}
                  />
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${area?.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <Icon name="Lightbulb" className="w-5 h-5 text-purple-600" />
          Strategic Recommendations
        </h2>
        <div className="space-y-4">
          {data?.recommendations?.map((rec) => (
            <div
              key={rec?.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(rec?.impact)}`}>
                        {rec?.impact?.toUpperCase()} IMPACT
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                        {rec?.category}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{rec?.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec?.description}</p>
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === rec?.id ? null : rec?.id)}
                    className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Icon
                      name={expandedId === rec?.id ? 'ChevronUp' : 'ChevronDown'}
                      className="w-5 h-5 text-gray-500"
                    />
                  </button>
                </div>

                {/* Confidence Score */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Confidence Score</span>
                    <span className="text-xs font-bold text-purple-600">{(rec?.confidence * 100)?.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: getConfidenceWidth(rec?.confidence) }}
                    />
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === rec?.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    {/* Reasoning */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <Icon name="Brain" className="w-4 h-4 text-purple-600" />
                        Claude's Reasoning
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/10 rounded-lg p-3">
                        {rec?.reasoning}
                      </p>
                    </div>

                    {/* Implementation Steps */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <Icon name="ListChecks" className="w-4 h-4 text-purple-600" />
                        Implementation Steps
                      </h4>
                      <ul className="space-y-2">
                        {rec?.implementation?.map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-xs font-bold mt-0.5">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" className="flex items-center gap-2">
                        <Icon name="Play" className="w-4 h-4" />
                        Implement
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Icon name="BookmarkPlus" className="w-4 h-4" />
                        Save for Later
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Icon name="Share2" className="w-4 h-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaudeAdvisoryPanel;