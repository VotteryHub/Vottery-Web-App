import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, TrendingUp, Users, Target, Zap, Loader, Award, AlertCircle } from 'lucide-react';
import { aiProxyService } from '../../../services/aiProxyService';

const parseJsonObject = (text) => {
  if (!text || typeof text !== 'string') return null;
  try {
    return JSON.parse(text);
  } catch {
    const m = text?.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
      return JSON.parse(m[0]);
    } catch {
      return null;
    }
  }
};

const numOr = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

const strOr = (v, d = '') => (v == null || v === undefined ? d : String(v));

const sanitizeViralScore = (parsed) => {
  if (!parsed || typeof parsed !== 'object') return null;

  const ep = parsed?.engagementPrediction || {};
  const at = parsed?.audienceTargeting || {};
  const ot = parsed?.optimalTiming || {};
  const ca = parsed?.competitorAnalysis || {};

  const interests = Array.isArray(at?.interests) ? at.interests.map((x) => strOr(x)).filter(Boolean) : [];

  const viralFactorsRaw = Array.isArray(parsed?.viralFactors) ? parsed.viralFactors : [];
  const viralFactors = viralFactorsRaw
    ?.map((f) => ({
      factor: strOr(f?.factor, 'Factor'),
      impact: Math.min(100, Math.max(0, numOr(f?.impact, 0))),
      description: strOr(f?.description, ''),
    }))
    ?.filter((f) => f?.factor);

  const improvementSuggestions = Array.isArray(parsed?.improvementSuggestions)
    ? parsed.improvementSuggestions.map((s) => strOr(s)).filter(Boolean)
    : [];

  return {
    overallScore: Math.min(100, Math.max(0, numOr(parsed?.overallScore, 0))),
    confidence: Math.min(100, Math.max(0, numOr(parsed?.confidence, 0))),
    engagementPrediction: {
      views: strOr(ep?.views, '—'),
      interactions: strOr(ep?.interactions, '—'),
      shares: strOr(ep?.shares, '—'),
      completionRate: Math.min(100, Math.max(0, numOr(ep?.completionRate, 0))),
    },
    audienceTargeting: {
      accuracy: Math.min(100, Math.max(0, numOr(at?.accuracy, 0))),
      primaryDemographic: strOr(at?.primaryDemographic, '—'),
      secondaryDemographic: strOr(at?.secondaryDemographic, '—'),
      interests,
    },
    optimalTiming: {
      bestDay: strOr(ot?.bestDay, '—'),
      bestTime: strOr(ot?.bestTime, '—'),
      timezone: strOr(ot?.timezone, 'Local'),
      reasoning: strOr(ot?.reasoning, ''),
    },
    viralFactors,
    improvementSuggestions,
    competitorAnalysis: {
      averageScore: numOr(ca?.averageScore, 0),
      yourAdvantage: numOr(ca?.yourAdvantage, 0),
      ranking: strOr(ca?.ranking, '—'),
    },
  };
};

const ClaudeViralScoringEngine = ({
  mediaFiles,
  filters,
  textStickers,
  interactiveElements,
  onViralScoreGenerated,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viralScore, setViralScore] = useState(null);
  const [error, setError] = useState(null);
  const onViralScoreGeneratedRef = useRef(onViralScoreGenerated);
  useEffect(() => {
    onViralScoreGeneratedRef.current = onViralScoreGenerated;
  }, [onViralScoreGenerated]);

  const analyzeViralPotential = useCallback(async () => {
    if (!mediaFiles?.length) {
      setViralScore(null);
      setError(null);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const prompt = `You are a viral content analyst for short-form social "Moments" (ephemeral stories).

Moment composition:
- Media count: ${mediaFiles?.length ?? 0}
- Applied filters: ${filters?.length ?? 0}
- Text stickers / overlays: ${textStickers?.length ?? 0}
- Interactive elements (polls, questions, etc.): ${interactiveElements?.length ?? 0}

Return ONLY valid JSON (no markdown) with exactly these keys:
{
  "overallScore": number 0-100,
  "confidence": number 0-100,
  "engagementPrediction": {
    "views": string,
    "interactions": string,
    "shares": string,
    "completionRate": number 0-100
  },
  "audienceTargeting": {
    "accuracy": number 0-100,
    "primaryDemographic": string,
    "secondaryDemographic": string,
    "interests": string[]
  },
  "optimalTiming": {
    "bestDay": string,
    "bestTime": string,
    "timezone": string,
    "reasoning": string
  },
  "viralFactors": [ { "factor": string, "impact": number 0-100, "description": string } ],
  "improvementSuggestions": string[],
  "competitorAnalysis": {
    "averageScore": number,
    "yourAdvantage": number,
    "ranking": string
  }
}`;

    try {
      const { data, error: apiError } = await aiProxyService?.callAnthropic?.(
        [{ role: 'user', content: prompt }],
        { model: 'claude-3-5-sonnet-20241022', maxTokens: 2000, temperature: 0.35 },
      );

      if (apiError?.message) {
        setViralScore(null);
        setError(apiError.message);
        return;
      }

      const text = data?.content?.[0]?.text || '';
      const parsed = parseJsonObject(text);
      const sanitized = sanitizeViralScore(parsed);

      if (!sanitized) {
        setViralScore(null);
        setError('Unable to parse viral score response.');
        return;
      }

      setViralScore(sanitized);
      onViralScoreGeneratedRef.current?.(sanitized);
    } catch (e) {
      console.error('Error analyzing viral potential:', e);
      setViralScore(null);
      setError(e?.message || 'Unable to analyze viral potential right now.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [mediaFiles, filters, textStickers, interactiveElements]);

  useEffect(() => {
    if (mediaFiles?.length > 0) {
      analyzeViralPotential();
    } else {
      setViralScore(null);
      setError(null);
    }
  }, [mediaFiles, filters, textStickers, interactiveElements, analyzeViralPotential]);

  if (isAnalyzing) {
    return (
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 p-6">
        <div className="text-center py-12">
          <Loader className="w-16 h-16 mx-auto mb-4 text-pink-400 animate-spin" />
          <p className="text-white font-medium mb-2">Analyzing Viral Potential...</p>
          <p className="text-sm text-gray-400">Claude AI is evaluating your content</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-red-500/40 p-6">
        <div className="flex items-start gap-3 text-red-200">
          <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-white mb-1">Viral scoring unavailable</p>
            <p className="text-sm text-red-100/90">{error}</p>
            {mediaFiles?.length > 0 && (
              <button
                type="button"
                onClick={analyzeViralPotential}
                className="mt-4 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-sm"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!viralScore) {
    return (
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 p-6">
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">Add media to see viral scoring analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-pink-400" />
          <h3 className="text-xl font-bold text-white">Claude AI Viral Scoring</h3>
        </div>
        <button
          type="button"
          onClick={analyzeViralPotential}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
        >
          Re-analyze
        </button>
      </div>
      {/* Overall Viral Score */}
      <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl p-6 border border-pink-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Viral Probability Score</p>
            <div className="flex items-center space-x-2">
              <p className="text-5xl font-bold text-white">{viralScore?.overallScore}</p>
              <div>
                <p className="text-lg text-gray-400">/100</p>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400">{viralScore?.confidence}% confidence</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">{viralScore?.competitorAnalysis?.ranking}</p>
            <p className="text-xs text-gray-400">vs competitors</p>
          </div>
        </div>

        <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-400 via-purple-500 to-yellow-400"
            style={{ width: `${viralScore?.overallScore}%` }}
          />
        </div>
      </div>
      {/* Engagement Predictions */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h4 className="font-bold text-white">Engagement Predictions</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Estimated Views</p>
            <p className="text-lg font-bold text-white">{viralScore?.engagementPrediction?.views}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Interactions</p>
            <p className="text-lg font-bold text-white">{viralScore?.engagementPrediction?.interactions}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Shares</p>
            <p className="text-lg font-bold text-white">{viralScore?.engagementPrediction?.shares}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Completion Rate</p>
            <p className="text-lg font-bold text-green-400">{viralScore?.engagementPrediction?.completionRate}%</p>
          </div>
        </div>
      </div>
      {/* Audience Targeting */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-5 h-5 text-blue-400" />
          <h4 className="font-bold text-white">Audience Targeting</h4>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Targeting Accuracy</span>
              <span className="text-white font-bold">{viralScore?.audienceTargeting?.accuracy}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                style={{ width: `${viralScore?.audienceTargeting?.accuracy}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Primary</p>
              <p className="text-white font-medium">{viralScore?.audienceTargeting?.primaryDemographic}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Secondary</p>
              <p className="text-white font-medium">{viralScore?.audienceTargeting?.secondaryDemographic}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Top Interests</p>
            <div className="flex flex-wrap gap-2">
              {viralScore?.audienceTargeting?.interests?.map((interest, index) => (
                <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Optimal Timing */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-5 h-5 text-purple-400" />
          <h4 className="font-bold text-white">Optimal Posting Time</h4>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-white">{viralScore?.optimalTiming?.bestDay}</p>
              <p className="text-lg text-purple-400">{viralScore?.optimalTiming?.bestTime}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Timezone</p>
              <p className="text-white font-medium">{viralScore?.optimalTiming?.timezone}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">{viralScore?.optimalTiming?.reasoning}</p>
        </div>
      </div>
      {/* Viral Factors */}
      <div className="bg-white/5 rounded-xl p-4">
        <h4 className="font-bold text-white mb-3">Key Viral Factors</h4>
        <div className="space-y-3">
          {viralScore?.viralFactors?.map((factor, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white">{factor?.factor}</span>
                <span className="text-sm font-bold text-white">{factor?.impact}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-yellow-400"
                  style={{ width: `${factor?.impact}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{factor?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Improvement Suggestions */}
      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
        <h4 className="font-bold text-white mb-3">Improvement Suggestions</h4>
        <ul className="space-y-2">
          {viralScore?.improvementSuggestions?.map((suggestion, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-gray-300">
              <span className="text-yellow-400 mt-0.5">•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClaudeViralScoringEngine;
