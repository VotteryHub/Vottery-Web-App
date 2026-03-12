import React, { useState, useEffect } from 'react';
import { MessageSquare, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useChat } from '../../../hooks/useChat';
import toast from 'react-hot-toast';

const SentimentAnalysisPanel = ({ freeTextResponses = [], loading = false }) => {
  const [sentimentData, setSentimentData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const { response, isLoading, error, sendMessage } = useChat('OPEN_AI', 'gpt-4o', false);

  useEffect(() => {
    if (error) toast?.error(error?.message || 'Sentiment analysis failed');
  }, [error]);

  useEffect(() => {
    if (response && !isLoading) {
      try {
        const jsonMatch = response?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          setSentimentData(JSON.parse(jsonMatch?.[0]));
        }
      } catch (e) {
        toast?.error('Failed to parse sentiment results');
      }
      setAnalyzing(false);
    }
  }, [response, isLoading]);

  const runAnalysis = () => {
    const texts = freeTextResponses?.slice(0, 50)?.map(r => r?.answerText || r?.answer_text || '')?.filter(Boolean);
    if (!texts?.length) {
      toast?.error('No free-text responses to analyze');
      return;
    }
    setAnalyzing(true);
    setSentimentData(null);
    sendMessage([
      { role: 'system', content: 'You are a sentiment analysis expert. Analyze voter free-text responses and return JSON only.' },
      { role: 'user', content: `Analyze sentiment of these voter responses:\n${texts?.map((t, i) => `${i + 1}. "${t}"`)?.join('\n')}\n\nReturn JSON only:\n{"overallSentiment": "positive/negative/neutral", "sentimentScore": 0.75, "positiveCount": 10, "negativeCount": 5, "neutralCount": 15, "themes": [{"theme": "...", "frequency": 5, "sentiment": "positive"}], "summary": "...", "keyInsights": ["...", "..."]}` }
    ], { max_completion_tokens: 1500 });
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'positive') return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (sentiment === 'negative') return <TrendingDown className="w-5 h-5 text-red-400" />;
    return <Minus className="w-5 h-5 text-yellow-400" />;
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'positive') return 'text-green-400';
    if (sentiment === 'negative') return 'text-red-400';
    return 'text-yellow-400';
  };

  const total = (sentimentData?.positiveCount || 0) + (sentimentData?.negativeCount || 0) + (sentimentData?.neutralCount || 0);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <MessageSquare className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Free-Text Sentiment Analysis</h3>
            <p className="text-gray-400 text-sm">AI-powered sentiment scoring via OpenAI GPT-4</p>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={analyzing || isLoading || loading || freeTextResponses?.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${(analyzing || isLoading) ? 'animate-spin' : ''}`} />
          {(analyzing || isLoading) ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
        <p className="text-gray-400 text-sm">{freeTextResponses?.length || 0} free-text responses available for analysis</p>
      </div>
      {!sentimentData && !analyzing && !isLoading && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">Click Analyze to run sentiment analysis</p>
        </div>
      )}
      {(analyzing || isLoading) && (
        <div className="flex flex-col items-center justify-center py-10">
          <RefreshCw className="w-10 h-10 text-green-400 animate-spin mb-3" />
          <p className="text-gray-400 text-sm">Analyzing sentiment with GPT-4...</p>
        </div>
      )}
      {sentimentData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl">
            <div className="flex items-center gap-3">
              {getSentimentIcon(sentimentData?.overallSentiment)}
              <div>
                <p className="text-gray-400 text-xs">Overall Sentiment</p>
                <p className={`text-lg font-bold capitalize ${getSentimentColor(sentimentData?.overallSentiment)}`}>
                  {sentimentData?.overallSentiment || 'neutral'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">Score</p>
              <p className="text-white text-2xl font-bold">{Math.round((sentimentData?.sentimentScore || 0) * 100)}%</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[['Positive', sentimentData?.positiveCount || 0, 'text-green-400', 'bg-green-500/10'],
              ['Negative', sentimentData?.negativeCount || 0, 'text-red-400', 'bg-red-500/10'],
              ['Neutral', sentimentData?.neutralCount || 0, 'text-yellow-400', 'bg-yellow-500/10']
            ]?.map(([label, count, color, bg]) => (
              <div key={label} className={`p-3 rounded-lg ${bg} text-center`}>
                <p className={`text-xl font-bold ${color}`}>{count}</p>
                <p className="text-gray-400 text-xs">{label}</p>
                <p className="text-gray-500 text-xs">{total > 0 ? Math.round((count / total) * 100) : 0}%</p>
              </div>
            ))}
          </div>

          {sentimentData?.themes?.length > 0 && (
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Key Themes</p>
              <div className="space-y-2">
                {sentimentData?.themes?.slice(0, 5)?.map((theme, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                    <span className="text-white text-sm">{theme?.theme}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs capitalize ${getSentimentColor(theme?.sentiment)}`}>{theme?.sentiment}</span>
                      <span className="text-gray-400 text-xs">{theme?.frequency}x</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sentimentData?.summary && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm">{sentimentData?.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysisPanel;
