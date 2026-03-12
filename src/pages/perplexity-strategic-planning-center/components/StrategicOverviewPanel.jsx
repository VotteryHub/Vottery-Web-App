import React from 'react';
import Icon from '../../../components/AppIcon';

const StrategicOverviewPanel = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Strategic Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} className="text-purple-600 dark:text-purple-400" />
          Perplexity Extended Reasoning Analysis
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Comprehensive strategic planning powered by Perplexity's sonar-reasoning-pro model, analyzing market opportunities, competitive threats, and platform growth strategies with 60-90 day forecasting.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Target" size={24} className="text-green-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Opportunities</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {data?.marketOpportunities?.opportunities?.length || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Market Opportunities</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="ShieldAlert" size={24} className="text-red-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Threats</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {data?.competitiveThreats?.threats?.length || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Competitive Threats</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="TrendingUp" size={24} className="text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Strategies</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {data?.growthStrategies?.strategies?.length || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Growth Strategies</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Sparkles" size={24} className="text-purple-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Actions</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {data?.automatedRecommendations?.recommendations?.length || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Recommendations</p>
        </div>
      </div>

      {/* Top Opportunities Preview */}
      {data?.marketOpportunities?.opportunities?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Target" size={20} className="text-green-500" />
            Top Market Opportunities
          </h3>
          <div className="space-y-3">
            {data?.marketOpportunities?.opportunities?.slice(0, 3)?.map((opp, idx) => (
              <div key={idx} className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{opp?.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{opp?.description}</p>
                  </div>
                  <span className="ml-3 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full whitespace-nowrap">
                    {Math.round((opp?.confidence || 0) * 100)}% Confidence
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Threats Preview */}
      {data?.competitiveThreats?.threats?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="ShieldAlert" size={20} className="text-red-500" />
            Critical Competitive Threats
          </h3>
          <div className="space-y-3">
            {data?.competitiveThreats?.threats?.filter(t => t?.severity === 'high')?.slice(0, 2)?.map((threat, idx) => (
              <div key={idx} className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{threat?.description}</h4>
                  <span className="ml-3 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-semibold rounded-full whitespace-nowrap">
                    {threat?.severity?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Timeframe: {threat?.timeframe}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Recommendations */}
      {data?.automatedRecommendations?.recommendations?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Sparkles" size={20} className="text-purple-500" />
            Priority Strategic Recommendations
          </h3>
          <div className="space-y-3">
            {data?.automatedRecommendations?.recommendations?.filter(r => r?.priority === 'critical' || r?.priority === 'high')?.slice(0, 3)?.map((rec, idx) => (
              <div key={idx} className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        rec?.priority === 'critical' ?'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                      }`}>
                        {rec?.priority?.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{rec?.category}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{rec?.action}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Timeline: {rec?.timeline}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategicOverviewPanel;