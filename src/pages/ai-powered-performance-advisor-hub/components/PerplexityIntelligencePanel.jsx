import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerplexityIntelligencePanel = ({ data }) => {
  const [selectedTrend, setSelectedTrend] = useState(null);

  const getProbabilityColor = (probability) => {
    if (probability >= 0.75) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (probability >= 0.5) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  const getImpactColor = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <Icon name="BarChart3" className="w-5 h-5 text-blue-600" />
          Market Analysis
        </h2>
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Competitive Position</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">{data?.marketAnalysis?.competitivePosition}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Threats */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                <Icon name="AlertTriangle" className="w-4 h-4" />
                Market Threats
              </h3>
              <ul className="space-y-2">
                {data?.marketAnalysis?.threats?.map((threat, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                    <Icon name="Minus" className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{threat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                <Icon name="TrendingUp" className="w-4 h-4" />
                Market Opportunities
              </h3>
              <ul className="space-y-2">
                {data?.marketAnalysis?.opportunities?.map((opportunity, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300">
                    <Icon name="Plus" className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Forecasting */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <Icon name="TrendingUp" className="w-5 h-5 text-blue-600" />
          30-90 Day Trend Forecasting
        </h2>
        <div className="space-y-4">
          {data?.trendForecasting?.map((trend, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
              onClick={() => setSelectedTrend(selectedTrend === index ? null : index)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{trend?.trend}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getProbabilityColor(trend?.probability)}`}>
                      {(trend?.probability * 100)?.toFixed(0)}% Probability
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" className="w-4 h-4" />
                      {trend?.timeframe}
                    </span>
                    <span className={`flex items-center gap-1 font-medium ${getImpactColor(trend?.impact)}`}>
                      <Icon name="Zap" className="w-4 h-4" />
                      {trend?.impact} Impact
                    </span>
                  </div>
                </div>
                <Icon
                  name={selectedTrend === index ? 'ChevronUp' : 'ChevronDown'}
                  className="w-5 h-5 text-gray-500 flex-shrink-0"
                />
              </div>

              {selectedTrend === index && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      <Icon name="Lightbulb" className="w-4 h-4" />
                      Perplexity Recommendation
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{trend?.recommendation}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" className="flex items-center gap-2">
                      <Icon name="CheckCircle" className="w-4 h-4" />
                      Act on This
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Icon name="Eye" className="w-4 h-4" />
                      Monitor
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Intelligence */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <Icon name="Users" className="w-5 h-5 text-blue-600" />
          Competitive Intelligence
        </h2>
        <div className="space-y-4">
          {data?.competitiveIntelligence?.map((comp, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">{comp?.competitor}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="ThumbsUp" className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-900 dark:text-green-100">Strength</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">{comp?.strength}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="ThumbsDown" className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-semibold text-red-900 dark:text-red-100">Weakness</span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">{comp?.weakness}</p>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Target" className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">Recommended Action</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">{comp?.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerplexityIntelligencePanel;