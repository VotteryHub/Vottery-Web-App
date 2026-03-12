import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';
import { useChat } from '../../../hooks/useChat';
import toast from 'react-hot-toast';

const AIPerformanceTrendsPanel = ({ timeRange }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [trendData] = useState(generateTrendData());
  const [confidenceScore, setConfidenceScore] = useState(null);

  const { response, isLoading, error, sendMessage } = useChat('OPEN_AI', 'gpt-4.1', false);

  useEffect(() => {
    if (error) toast?.error(error?.message || 'AI analysis failed');
  }, [error]);

  useEffect(() => {
    if (response && !isLoading && isAnalyzing) {
      try {
        const jsonMatch = response?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch?.[0]);
          setAnalysis(parsed);
          setConfidenceScore(parsed?.confidence || 87);
        } else {
          setAnalysis({ summary: response, trends: [], predictions: [], recommendations: [], confidence: 85 });
          setConfidenceScore(85);
        }
      } catch {
        setAnalysis({ summary: response, trends: [], predictions: [], recommendations: [], confidence: 85 });
        setConfidenceScore(85);
      }
      setIsAnalyzing(false);
    }
  }, [response, isLoading]);

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    const smsMetrics = {
      timeRange,
      avgDeliveryRate: 96.2,
      avgLatency: 1320,
      failoverEvents: 12,
      carrierPerformance: { 'AT&T': 96.4, 'Verizon': 95.1, 'T-Mobile': 97.8, 'Sprint': 92.7 },
      providerComparison: { Telnyx: { deliveryRate: 97.1, avgCost: 0.0075 }, Twilio: { deliveryRate: 95.8, avgCost: 0.0085 } },
      trendData: trendData?.slice(-7)
    };

    sendMessage([
      {
        role: 'system',
        content: 'You are an SMS infrastructure performance analyst. Analyze SMS delivery metrics and provide actionable insights. Always respond with valid JSON.'
      },
      {
        role: 'user',
        content: `Analyze these SMS performance metrics and provide predictions: ${JSON.stringify(smsMetrics)}. Return JSON with: summary (string), trends (array of {metric, direction, change, significance}), predictions (array of {metric, predicted_value, timeframe, confidence}), recommendations (array of {action, priority, expectedImpact}), confidence (number 0-100), riskFactors (array of strings).`
      }
    ], { max_completion_tokens: 1500 });
  };

  function generateTrendData() {
    return Array.from({ length: 30 }, (_, i) => ({
      day: `Day ${i + 1}`,
      deliveryRate: 94 + Math.random() * 4,
      latency: 1100 + Math.random() * 500,
      failovers: Math.floor(Math.random() * 3),
      predicted: i >= 24 ? 95 + Math.random() * 3 : null
    }));
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Icon name="Brain" size={20} className="text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">AI Performance Analysis</h3>
              <p className="text-sm text-muted-foreground">GPT-4 powered SMS trend forecasting</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {confidenceScore && (
              <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1 rounded-full">
                <Icon name="Target" size={14} className="text-purple-500" />
                <span className="text-sm font-medium text-purple-500">{confidenceScore}% confidence</span>
              </div>
            )}
            <button
              onClick={runAIAnalysis}
              disabled={isLoading || isAnalyzing}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {(isLoading || isAnalyzing) ? (
                <><Icon name="Loader2" size={16} className="animate-spin" /> Analyzing...</>
              ) : (
                <><Icon name="Sparkles" size={16} /> Run AI Analysis</>
              )}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="bg-background/50 rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground leading-relaxed">{analysis?.summary}</p>
          </div>
        )}

        {!analysis && !isAnalyzing && (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Brain" size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Click "Run AI Analysis" to get GPT-4 powered insights on your SMS performance data</p>
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">30-Day Delivery Rate Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="deliveryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
            <YAxis domain={[90, 100]} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => [`${v?.toFixed(1)}%`, '']} />
            <Area type="monotone" dataKey="deliveryRate" stroke="#6366f1" fill="url(#deliveryGrad)" strokeWidth={2} name="Actual" />
            <Area type="monotone" dataKey="predicted" stroke="#a855f7" fill="url(#predictedGrad)" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {analysis?.trends && analysis?.trends?.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Identified Trends</h3>
            <div className="space-y-3">
              {analysis?.trends?.map((trend, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <Icon name={trend?.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} size={18} className={trend?.direction === 'up' ? 'text-green-500' : 'text-red-500'} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{trend?.metric}</p>
                    <p className="text-xs text-muted-foreground">{trend?.change} • {trend?.significance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recommendations</h3>
            <div className="space-y-3">
              {analysis?.recommendations?.map((rec, idx) => (
                <div key={idx} className="p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      rec?.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                      rec?.priority === 'medium'? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                    }`}>{rec?.priority}</span>
                  </div>
                  <p className="text-sm text-foreground">{rec?.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rec?.expectedImpact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPerformanceTrendsPanel;