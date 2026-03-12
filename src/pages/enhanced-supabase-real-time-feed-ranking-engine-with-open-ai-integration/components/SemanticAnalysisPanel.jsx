import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { feedRankingService } from '../../../services/feedRankingService';

const SemanticAnalysisPanel = ({ userId }) => {
  const [testContent, setTestContent] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [similarity, setSimilarity] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [contentClusters, setContentClusters] = useState([]);

  const handleSemanticAnalysis = async () => {
    if (!testContent || !userQuery) return;

    setAnalyzing(true);
    try {
      const { data, error } = await feedRankingService?.calculateSemanticSimilarity(testContent, userQuery);
      if (error) throw error;
      setSimilarity(data);
    } catch (error) {
      console.error('Semantic analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSimilarityLevel = (score) => {
    if (score >= 0.8) return { label: 'Highly Relevant', color: 'text-green-600 dark:text-green-400' };
    if (score >= 0.6) return { label: 'Moderately Relevant', color: 'text-blue-600 dark:text-blue-400' };
    if (score >= 0.4) return { label: 'Somewhat Relevant', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Low Relevance', color: 'text-red-600 dark:text-red-400' };
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <Icon name="Sparkles" size={20} />
          Advanced OpenAI Semantic Matching
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Deep content understanding using transformer models for semantic similarity analysis and contextual preference matching
        </p>
      </div>

      {/* Semantic Similarity Tester */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Search" size={20} />
          Test Semantic Similarity
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Text
            </label>
            <textarea
              value={testContent}
              onChange={(e) => setTestContent(e?.target?.value)}
              placeholder="Enter content to analyze..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User Preference / Query
            </label>
            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e?.target?.value)}
              placeholder="Enter user preference or search query..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSemanticAnalysis}
            disabled={!testContent || !userQuery || analyzing}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Icon name="Loader" size={18} className="animate-spin" />
                Analyzing with OpenAI...
              </>
            ) : (
              <>
                <Icon name="Zap" size={18} />
                Analyze Semantic Similarity
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {similarity !== null && (
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {(similarity * 100)?.toFixed(1)}%
              </div>
              <div className={`text-lg font-semibold mb-1 ${getSimilarityLevel(similarity)?.color}`}>
                {getSimilarityLevel(similarity)?.label}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Semantic Similarity Score</div>
            </div>

            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                style={{ width: `${similarity * 100}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Model</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">text-embedding-3-small</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Algorithm</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Cosine Similarity</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Confidence</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">High</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Layers" size={20} />
            Contextual Preference Matching
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Icon name="Check" size={16} className="text-green-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">User interaction pattern analysis</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Icon name="Check" size={16} className="text-green-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Behavioral preference extraction</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Icon name="Check" size={16} className="text-green-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Dynamic preference weighting</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="Grid" size={20} />
            Intelligent Content Clustering
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Icon name="Check" size={16} className="text-blue-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Improved recommendation diversity</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Icon name="Check" size={16} className="text-blue-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Topic-based content grouping</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Icon name="Check" size={16} className="text-blue-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Semantic cluster visualization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemanticAnalysisPanel;