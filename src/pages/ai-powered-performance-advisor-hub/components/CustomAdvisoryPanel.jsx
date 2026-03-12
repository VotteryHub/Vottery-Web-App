import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const CustomAdvisoryPanel = () => {
  const [query, setQuery] = useState('');
  const [selectedAI, setSelectedAI] = useState('both');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!query?.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResponse({
        query: query,
        timestamp: new Date(),
        claude: selectedAI === 'both' || selectedAI === 'claude' ? {
          analysis: `Based on your query about "${query}", I recommend focusing on three key areas: user engagement optimization, content quality enhancement, and strategic timing. The data suggests a 35% improvement opportunity in your current approach.`,
          confidence: 0.87,
          actionItems: [
            'Implement A/B testing for the proposed changes',
            'Monitor key metrics over 2-week period',
            'Iterate based on performance data'
          ]
        } : null,
        perplexity: selectedAI === 'both' || selectedAI === 'perplexity' ? {
          analysis: `Market research indicates that similar implementations have shown 40-60% success rates. Current industry trends support your approach, with 3 major competitors adopting similar strategies in Q1 2025.`,
          sources: [
            'Industry Report: Digital Engagement Trends 2025',
            'Competitor Analysis: VoteNow Strategy Shift',
            'Market Research: User Behavior Patterns'
          ],
          recommendations: [
            'Benchmark against top 3 competitors',
            'Consider phased rollout approach',
            'Monitor competitive response'
          ]
        } : null
      });
      setLoading(false);
    }, 2000);
  };

  const quickQueries = [
    'How can I improve election participation rates?',
    'What prize pool strategy maximizes ROI?',
    'Should I prioritize video content over text?',
    'How do I compete with TikTok polling features?',
    'What are the best notification timing strategies?'
  ];

  return (
    <div className="space-y-6">
      {/* Query Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <Icon name="MessageSquare" className="w-5 h-5 text-indigo-600" />
          Custom Advisory Query
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Question
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e?.target?.value)}
              placeholder="Ask anything about platform optimization, strategy, or performance..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select AI System
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="both"
                  checked={selectedAI === 'both'}
                  onChange={(e) => setSelectedAI(e?.target?.value)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Both (Recommended)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="claude"
                  checked={selectedAI === 'claude'}
                  onChange={(e) => setSelectedAI(e?.target?.value)}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Claude Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="perplexity"
                  checked={selectedAI === 'perplexity'}
                  onChange={(e) => setSelectedAI(e?.target?.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Perplexity Only</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!query?.trim() || loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Icon name="Loader" className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Icon name="Send" className="w-4 h-4" />
                Get AI Advisory
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Quick Queries */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Queries</h3>
        <div className="flex flex-wrap gap-2">
          {quickQueries?.map((q, index) => (
            <button
              key={index}
              onClick={() => setQuery(q)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Response */}
      {response && (
        <div className="space-y-4">
          {response?.claude && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-200 dark:border-purple-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Brain" className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Claude's Analysis</h3>
                <span className="ml-auto px-2 py-1 rounded text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                  {(response?.claude?.confidence * 100)?.toFixed(0)}% Confidence
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{response?.claude?.analysis}</p>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">Action Items</h4>
                <ul className="space-y-2">
                  {response?.claude?.actionItems?.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-purple-700 dark:text-purple-300">
                      <Icon name="CheckCircle" className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {response?.perplexity && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="TrendingUp" className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Perplexity's Intelligence</h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{response?.perplexity?.analysis}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Sources</h4>
                  <ul className="space-y-1">
                    {response?.perplexity?.sources?.map((source, index) => (
                      <li key={index} className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                        <Icon name="Link" className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {response?.perplexity?.recommendations?.map((rec, index) => (
                      <li key={index} className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                        <Icon name="ArrowRight" className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomAdvisoryPanel;