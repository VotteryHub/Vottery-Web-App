import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { useChat } from '../../../hooks/useChat';
import toast from 'react-hot-toast';

const ClaudeOptimizationPanel = ({ timeRange }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);

  const { response, isLoading, error, sendMessage } = useChat('OPEN_AI', 'gpt-4.1', false);

  useEffect(() => {
    if (error) toast?.error(error?.message || 'Analysis failed');
  }, [error]);

  useEffect(() => {
    if (response && !isLoading && isAnalyzing) {
      try {
        const jsonMatch = response?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          setRecommendations(JSON.parse(jsonMatch?.[0]));
        } else {
          setRecommendations({ recommendations: [{ title: 'AI Analysis', description: response, priority: 'medium', impact: 'Moderate', effort: 'Medium', expectedRevenue: '+5-10%' }], summary: response });
        }
      } catch {
        setRecommendations({ recommendations: [], summary: response });
      }
      setIsAnalyzing(false);
    }
  }, [response, isLoading]);

  const runOptimizationAnalysis = () => {
    setIsAnalyzing(true);
    const performanceData = {
      carouselTypes: {
        horizontal: { revenue: 28450, engagement: 0.68, ctr: 0.042 },
        vertical: { revenue: 24190, engagement: 0.72, ctr: 0.038 },
        gradient: { revenue: 15200, engagement: 0.55, ctr: 0.029 }
      },
      zones: {
        USA: { revenue: 45000, growth: 8.2 },
        'Western Europe': { revenue: 42750, growth: 5.1 },
        India: { revenue: 11250, growth: 22.4 },
        Africa: { revenue: 9000, growth: 31.5 }
      },
      joltsRevenue: 28450,
      timeRange
    };

    sendMessage([
      {
        role: 'system',
        content: 'You are a carousel monetization optimization expert. Analyze performance data and provide actionable revenue optimization recommendations. Respond with valid JSON only.'
      },
      {
        role: 'user',
        content: `Analyze this carousel ROI data and identify optimization opportunities: ${JSON.stringify(performanceData)}. Return JSON with: summary (string), recommendations (array of {title, description, priority (high/medium/low), impact, effort, expectedRevenue, implementation}), underperformingAreas (array of strings), quickWins (array of strings).`
      }
    ], { max_completion_tokens: 2000 });
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (priority === 'medium') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-green-500 bg-green-500/10 border-green-500/20';
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Icon name="Sparkles" size={20} className="text-indigo-500" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">AI Optimization Engine</h4>
              <p className="text-xs text-muted-foreground">GPT-4 powered carousel revenue optimization</p>
            </div>
          </div>
          <button
            onClick={runOptimizationAnalysis}
            disabled={isLoading || isAnalyzing}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {(isLoading || isAnalyzing) ? (
              <><Icon name="Loader2" size={16} className="animate-spin" /> Analyzing...</>
            ) : (
              <><Icon name="Wand2" size={16} /> Optimize Revenue</>
            )}
          </button>
        </div>

        {recommendations?.summary && (
          <div className="bg-background/50 rounded-lg p-4">
            <p className="text-sm text-foreground leading-relaxed">{recommendations?.summary}</p>
          </div>
        )}

        {!recommendations && !isAnalyzing && (
          <div className="text-center py-6 text-muted-foreground">
            <Icon name="Wand2" size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Click "Optimize Revenue" to get AI-powered recommendations for improving carousel monetization</p>
          </div>
        )}
      </div>

      {recommendations?.recommendations && recommendations?.recommendations?.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Optimization Recommendations</h4>
          {recommendations?.recommendations?.map((rec, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedRec(selectedRec === idx ? null : idx)}
              className="bg-card rounded-xl p-4 border border-border cursor-pointer hover:border-primary/40 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{rec?.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getPriorityColor(rec?.priority)}`}>
                    {rec?.priority}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-green-500 font-medium">{rec?.expectedRevenue}</span>
                  <Icon name={selectedRec === idx ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{rec?.description}</p>
              {selectedRec === idx && (
                <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">Impact</p>
                    <p className="text-sm font-medium text-foreground">{rec?.impact}</p>
                  </div>
                  <div className="bg-background rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">Effort</p>
                    <p className="text-sm font-medium text-foreground">{rec?.effort}</p>
                  </div>
                  <div className="bg-background rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">Expected Revenue</p>
                    <p className="text-sm font-medium text-green-500">{rec?.expectedRevenue}</p>
                  </div>
                  {rec?.implementation && (
                    <div className="col-span-3 bg-background rounded-lg p-2">
                      <p className="text-xs text-muted-foreground mb-1">Implementation</p>
                      <p className="text-xs text-foreground">{rec?.implementation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {recommendations?.quickWins && recommendations?.quickWins?.length > 0 && (
        <div className="bg-card rounded-xl p-4 border border-green-500/20">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Icon name="Zap" size={16} className="text-green-500" />
            Quick Wins
          </h4>
          <div className="space-y-2">
            {recommendations?.quickWins?.map((win, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Icon name="CheckCircle" size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">{win}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaudeOptimizationPanel;