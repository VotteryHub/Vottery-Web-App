import React from 'react';
import Icon from '../../../components/AppIcon';

const MarketOpportunitiesPanel = ({ data }) => {
  return (
    <div className="space-y-6">
      {data?.opportunities?.map((opp, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{opp?.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{opp?.description}</p>
            </div>
            <span className="ml-4 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full whitespace-nowrap">
              {Math.round((opp?.confidence || 0) * 100)}% Confidence
            </span>
          </div>

          {/* Market Size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Market Size</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {opp?.marketSize}
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">30-Day Revenue</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                ${opp?.revenueProjection?.day30?.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">90-Day Revenue</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                ${opp?.revenueProjection?.day90?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Revenue Projection Timeline */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Revenue Projection Timeline</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-purple-500 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
              <span>30d: ${opp?.revenueProjection?.day30?.toLocaleString()}</span>
              <span>60d: ${opp?.revenueProjection?.day60?.toLocaleString()}</span>
              <span>90d: ${opp?.revenueProjection?.day90?.toLocaleString()}</span>
            </div>
          </div>

          {/* Entry Barriers */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Icon name="Lock" size={16} />
              Entry Barriers
            </h4>
            <div className="flex flex-wrap gap-2">
              {opp?.barriers?.map((barrier, bIdx) => (
                <span key={bIdx} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">
                  {barrier}
                </span>
              ))}
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Icon name="Lightbulb" size={16} />
              Strategic Recommendations
            </h4>
            <div className="space-y-2">
              {opp?.recommendations?.map((rec, rIdx) => (
                <div key={rIdx} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Icon name="ArrowRight" size={16} className="text-primary mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketOpportunitiesPanel;