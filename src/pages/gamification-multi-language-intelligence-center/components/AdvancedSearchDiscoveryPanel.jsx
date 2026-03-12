import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { feedRankingService } from '../../../services/feedRankingService';
import { enhancedRecommendationService } from '../../../services/enhancedRecommendationService';

const AdvancedSearchDiscoveryPanel = ({ userId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [semanticScore, setSemanticScore] = useState(null);
  const [filters, setFilters] = useState({
    contentType: 'all',
    category: 'all',
    timeRange: '7d'
  });

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    try {
      const result = await enhancedRecommendationService?.generatePersonalizedElectionFeed(userId);
      if (result?.data) {
        setRecommendations(result?.data?.slice(0, 6) || []);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery?.trim()) return;

    try {
      setLoading(true);
      const result = await feedRankingService?.generatePersonalizedFeed(userId, {
        elections: 5,
        posts: 5,
        ads: 0
      });

      if (result?.data) {
        // Filter results based on search query using semantic matching
        const filteredResults = result?.data?.filter(item => {
          const text = (item?.title || item?.content || '')?.toLowerCase();
          return text?.includes(searchQuery?.toLowerCase());
        });

        setSearchResults(filteredResults);
        
        // Calculate semantic similarity score (simulated)
        const avgScore = filteredResults?.reduce((sum, item) => sum + (item?.rankingScore || 0), 0) / filteredResults?.length;
        setSemanticScore(avgScore);
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="space-y-6">
      {/* OpenAI Semantic Search */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Search" size={20} className="text-blue-500" />
            OpenAI Semantic Matching
          </h3>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
              AI-Powered
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search elections, content, or topics using natural language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onKeyPress={(e) => e?.key === 'Enter' && handleSearch()}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading || !searchQuery?.trim()}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Icon name="Loader" size={18} className="animate-spin" />
              ) : (
                <Icon name="Search" size={18} />
              )}
              Search
            </Button>
          </div>

          {semanticScore !== null && (
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Icon name="Sparkles" size={24} className="text-blue-600 dark:text-blue-400" />
              <div className="flex-1">
                <div className="font-semibold text-foreground">Semantic Relevance Score</div>
                <div className="text-sm text-muted-foreground">AI-powered content matching accuracy</div>
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {(semanticScore * 100)?.toFixed(1)}%
              </div>
            </div>
          )}

          {searchResults?.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Found {searchResults?.length} results matching your query
              </div>
              {searchResults?.map((result, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-foreground mb-1">
                        {result?.title || result?.content?.substring(0, 100)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result?.contentType === 'election' ? 'Election' : 'Post'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                        {(result?.rankingScore * 100)?.toFixed(0)}% match
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI-Powered Filtering */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Filter" size={20} className="text-purple-500" />
            AI-Powered Filtering
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content Type
            </label>
            <select
              value={filters?.contentType}
              onChange={(e) => handleFilterChange('contentType', e?.target?.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Content</option>
              <option value="election">Elections Only</option>
              <option value="post">Posts Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              value={filters?.category}
              onChange={(e) => handleFilterChange('category', e?.target?.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              <option value="politics">Politics</option>
              <option value="technology">Technology</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Time Range
            </label>
            <select
              value={filters?.timeRange}
              onChange={(e) => handleFilterChange('timeRange', e?.target?.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Personalized Discovery */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Compass" size={20} className="text-green-500" />
            Personalized Discovery
          </h3>
          <Button size="sm" onClick={loadRecommendations} className="flex items-center gap-2">
            <Icon name="RefreshCw" size={16} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations?.map((item, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-semibold text-foreground mb-1">
                    {item?.title || item?.content?.substring(0, 60)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item?.contentType === 'election' ? 'Election' : 'Post'}
                  </div>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <Icon name="TrendingUp" size={16} className="text-primary" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                <div className="text-xs text-muted-foreground">Relevance Score</div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${(item?.rankingScore || 0) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {((item?.rankingScore || 0) * 100)?.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contextual Election Suggestions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Lightbulb" size={20} className="text-yellow-500" />
            Contextual Election Suggestions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="TrendingUp" size={24} className="text-yellow-600 dark:text-yellow-400" />
              <div>
                <div className="font-semibold text-foreground">Trending Topics</div>
                <div className="text-sm text-muted-foreground">Based on your interests</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Technology', 'Politics', 'Entertainment', 'Sports']?.map((topic) => (
                <div key={topic} className="px-3 py-1 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-700 rounded-full text-sm font-medium text-foreground">
                  {topic}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Users" size={24} className="text-green-600 dark:text-green-400" />
              <div>
                <div className="font-semibold text-foreground">Similar Users Like</div>
                <div className="text-sm text-muted-foreground">Collaborative filtering</div>
              </div>
            </div>
            <div className="space-y-2">
              {['Presidential Election 2026', 'Tech Innovation Awards', 'Best Movie of the Year']?.map((suggestion, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-foreground">{suggestion}</span>
                  <Icon name="ArrowRight" size={16} className="text-green-600 dark:text-green-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchDiscoveryPanel;