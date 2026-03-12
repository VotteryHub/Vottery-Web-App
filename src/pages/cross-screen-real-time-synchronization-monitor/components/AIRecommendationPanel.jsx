import React from 'react';
import { Brain, Zap, TrendingUp, Clock } from 'lucide-react';

const AIRecommendationPanel = ({ aiRecommendations }) => {
  if (!aiRecommendations) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">AI Recommendation Propagation</h2>
        <p className="text-gray-500">Loading AI recommendation data...</p>
      </div>
    );
  }

  const providers = Object.keys(aiRecommendations?.byProvider || {});

  const getProviderColor = (provider) => {
    const colors = {
      claude: 'bg-purple-100 text-purple-700 border-purple-200',
      perplexity: 'bg-blue-100 text-blue-700 border-blue-200',
      openai: 'bg-green-100 text-green-700 border-green-200',
      anthropic: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors?.[provider?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          AI Recommendation Propagation
        </h2>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          {aiRecommendations?.total} Total
        </span>
      </div>

      {/* Provider Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {providers?.map((provider, index) => {
          const providerData = aiRecommendations?.byProvider?.[provider];
          return (
            <div
              key={index}
              className={`rounded-lg p-4 border ${getProviderColor(provider)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold capitalize">{provider}</span>
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold mb-1">{providerData?.count}</p>
              <div className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3" />
                <span>{providerData?.averageLatency}ms avg</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Recommendations */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Recent Propagations
        </h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {aiRecommendations?.recent?.map((rec, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getProviderColor(rec?.aiProvider)}`}>
                  {rec?.aiProvider}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(rec?.propagatedAt)?.toLocaleTimeString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Latency:</span>
                  <span className="font-semibold text-gray-900 ml-1">
                    {rec?.propagationLatency?.toFixed(0)}ms
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Screens:</span>
                  <span className="font-semibold text-gray-900 ml-1">
                    {rec?.targetScreens}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600 ml-1 capitalize">
                    {rec?.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {aiRecommendations?.recent?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recent AI recommendations</p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationPanel;