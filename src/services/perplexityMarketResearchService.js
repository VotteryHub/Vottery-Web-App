import perplexityClient from '../lib/perplexity';
import { supabase } from '../lib/supabase';

function getErrorMessage(error) {
  if (!error?.response && error?.message?.includes('API key')) {
    return { isInternal: true, message: 'There\'s an issue with your Perplexity API key.' };
  }

  if (!error?.response?.status) {
    return { isInternal: false, message: error?.message || 'An unexpected error occurred' };
  }

  const status = error?.response?.status;

  if (status === 401) {
    return { isInternal: true, message: 'There\'s an issue with your Perplexity API key.' };
  } else if (status === 403) {
    return { isInternal: true, message: 'Your API key does not have permission to use the specified resource.' };
  } else if (status === 404) {
    return { isInternal: true, message: 'The requested resource was not found.' };
  } else if (status === 429) {
    return { isInternal: true, message: 'Your account has hit a rate limit.' };
  } else if (status >= 500) {
    return { isInternal: true, message: 'An unexpected error has occurred.' };
  } else {
    return { isInternal: false, message: error?.response?.data?.error?.message || `HTTP error! status: ${status}` };
  }
}

export const perplexityMarketResearchService = {
  /**
   * Internal platform metrics for market-intelligence UIs when Perplexity is unavailable
   * or to merge with Sonar output (Web + Mobile parity on table names).
   */
  async getInternalMarketResearchContext({ days = 30 } = {}) {
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const [fraudRes, votesRes, modRes, anomalyRes, flagsRes] = await Promise.all([
        supabase?.from('fraud_alerts')?.select('id, severity, status, created_at')?.gte('created_at', since),
        supabase?.from('votes')?.select('id, created_at')?.gte('created_at', since)?.limit(5000),
        supabase?.from('content_moderation_results')?.select('id, auto_removed, created_at')?.gte('created_at', since)?.limit(2000),
        supabase?.from('revenue_anomalies')?.select('id, severity, created_at')?.gte('created_at', since)?.limit(500),
        supabase?.from('content_flags')?.select('id, severity, status, created_at')?.gte('created_at', since)?.limit(500),
      ]);

      const fraud = fraudRes?.data || [];
      const votes = votesRes?.data || [];
      const fraudHigh = fraud?.filter((r) => ['high', 'critical'].includes(String(r?.severity || '').toLowerCase()))?.length || 0;

      return {
        success: true,
        windowDays: days,
        since,
        fraudAlerts: fraud?.length || 0,
        fraudHighOrCritical: fraudHigh,
        votes: votes?.length || 0,
        moderationResults: modRes?.data?.length || 0,
        revenueAnomalies: anomalyRes?.data?.length || 0,
        contentFlags: flagsRes?.data?.length || 0,
      };
    } catch (e) {
      console.error('getInternalMarketResearchContext:', e);
      return { success: false, error: e?.message };
    }
  },

  /**
   * Build Perplexity prompt payloads from Supabase (no hardcoded demo brands/votes).
   * Web + Mobile should use the same tables and field names.
   */
  async buildMarketResearchPromptInputsFromSupabase({ timeRange = '30d' } = {}) {
    const dayNum = timeRange === '7d' ? 7 : timeRange === '90d' ? 90 : 30;
    const since = new Date(Date.now() - dayNum * 24 * 60 * 60 * 1000).toISOString();

    try {
      const [internal, electionsRes, votesRes, sponsoredRes] = await Promise.all([
        this.getInternalMarketResearchContext({ days: dayNum }),
        supabase?.from('elections')?.select('id, title, category, created_at')?.gte('created_at', since)?.limit(800),
        supabase?.from('votes')?.select('id, created_at, election_id')?.gte('created_at', since)?.limit(8000),
        supabase?.from('sponsored_elections')?.select('id, budget_total, status, brand_id, created_at, election_id')?.gte('created_at', since)?.limit(80)
      ]);

      const elections = electionsRes?.data || [];
      const votes = votesRes?.data || [];
      const sponsored = sponsoredRes?.data || [];

      const categories = {};
      elections.forEach((e) => {
        const c = e?.category || 'uncategorized';
        categories[c] = (categories[c] || 0) + 1;
      });
      const topCategories = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([k, v]) => `${k} (${v})`);

      const electionData = {
        totalVotes: votes.length,
        elections: elections.length,
        avgEngagement: elections.length
          ? Number((votes.length / elections.length).toFixed(2))
          : 0,
        topCategories: topCategories.length ? topCategories : ['No categories in window'],
        source: 'supabase_elections_votes',
        windowDays: dayNum
      };

      const brandIds = [...new Set(sponsored.map((s) => s?.brand_id).filter(Boolean))];
      let profileMap = {};
      if (brandIds.length) {
        const { data: profs } = await supabase
          ?.from('user_profiles')
          ?.select('id, username, display_name')
          ?.in('id', brandIds.slice(0, 50));
        (profs || []).forEach((p) => {
          profileMap[p.id] = p.display_name || p.username || String(p.id);
        });
      }

      const first = sponsored[0];
      const firstLabel = first ? profileMap[first.brand_id] || `brand:${first.brand_id}` : 'No sponsors in window';
      const activeSponsored = sponsored.filter((s) => String(s?.status || '').toLowerCase() === 'active').length;

      const brandData = {
        brandName: firstLabel,
        marketShare: sponsored.length
          ? Math.min(
              99,
              Math.round(
                (100 * sponsored.filter((s) => s?.brand_id === first?.brand_id).length) /
                  Math.max(1, sponsored.length)
              )
            )
          : 0,
        recentCampaigns: activeSponsored,
        avgROI: 0,
        sponsoredRowsInWindow: sponsored.length,
        source: 'supabase_sponsored_elections'
      };

      const competitors = sponsored.slice(1, 8).map((s) => ({
        name: profileMap[s.brand_id] || `brand:${s.brand_id}`,
        budgetTotal: parseFloat(s.budget_total) || 0,
        status: s.status
      }));

      const fraudN = internal?.fraudHighOrCritical || 0;
      const voteN = internal?.votes || 0;
      const riskRatio = voteN > 0 ? Math.min(1, fraudN / Math.max(50, voteN)) : 0;
      const sentimentScore = Number((1 - riskRatio * 1.2).toFixed(3));

      const historicalData = {
        pastMonths: Math.max(1, Math.ceil(dayNum / 30)),
        growthRate: voteN ? Number(((voteN / Math.max(1, dayNum)) * 2).toFixed(2)) : 0,
        seasonalTrends: [
          `fraud_alerts:${internal?.fraudAlerts ?? 0}`,
          `content_flags:${internal?.contentFlags ?? 0}`,
          `moderation_results:${internal?.moderationResults ?? 0}`
        ],
        source: 'supabase_internal_metrics',
        internalMarketResearchContext: internal
      };

      const multiPlatformData = {
        platforms: ['Vottery', 'On-platform telemetry'],
        totalMentions: (internal?.contentFlags || 0) + (internal?.moderationResults || 0),
        sentimentScore: Number.isFinite(sentimentScore) ? Math.max(0, Math.min(1, sentimentScore)) : 0.5,
        fraudHighOrCritical: internal?.fraudHighOrCritical ?? 0,
        voteSampleCap: voteN,
        source: 'supabase_internal_correlation'
      };

      const realTimeData = {
        activeUsers: votes.length,
        liveElections: elections.length,
        trendingTopics: topCategories.slice(0, 5),
        source: 'supabase',
        asOf: new Date().toISOString()
      };

      return {
        electionData,
        brandData,
        competitors:
          competitors.length > 0
            ? competitors
            : [{ name: 'No additional sponsor rows in window', budgetTotal: 0, status: 'n/a' }],
        historicalData,
        multiPlatformData,
        realTimeData,
        internalMarketResearchContext: internal,
        errors: {
          elections: electionsRes?.error?.message,
          votes: votesRes?.error?.message,
          sponsored_elections: sponsoredRes?.error?.message
        }
      };
    } catch (e) {
      console.error('buildMarketResearchPromptInputsFromSupabase:', e);
      return {
        electionData: { source: 'error', error: e?.message },
        brandData: { brandName: 'n/a', source: 'error' },
        competitors: [],
        historicalData: { source: 'error' },
        multiPlatformData: { source: 'error' },
        realTimeData: { source: 'error' },
        internalMarketResearchContext: { success: false },
        errors: { exception: e?.message }
      };
    }
  },

  async analyzeVotingSentiment(electionData, timeRange = '30d') {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an expert market research analyst specializing in voting sentiment analysis and brand perception. Use extended reasoning to provide deep contextual understanding of voter preferences, emotional responses, and brand perception shifts with demographic segmentation and geographic correlation.'
          },
          {
            role: 'user',
            content: `Analyze voting sentiment patterns for the past ${timeRange}. Election data: ${JSON.stringify(electionData)}. Provide comprehensive sentiment analysis with: sentimentBreakdown (positive/neutral/negative percentages), brandMentions (array with brand, mentions, sentiment), demographicSegmentation (age, gender, location breakdowns), emotionalResponses (array of emotions with intensity), perceptionShifts (trends over time), geographicCorrelation (regional sentiment patterns), confidenceScore (0-1), reasoning (detailed chain-of-thought analysis). Return as JSON.`
          }
        ],
        temperature: 0.3,
        searchRecencyFilter: 'month',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let sentimentAnalysis;

      try {
        sentimentAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          sentimentAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse sentiment analysis response');
        }
      }

      return {
        data: {
          ...sentimentAnalysis,
          searchResults: response?.search_results || [],
          relatedQuestions: response?.related_questions || []
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error analyzing voting sentiment:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async generateCompetitiveIntelligence(brandData, competitors) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a competitive intelligence analyst with expertise in market positioning, competitor monitoring, and strategic insights. Provide automated competitor analysis with predictive modeling for market movements.'
          },
          {
            role: 'user',
            content: `Generate competitive intelligence report for brand: ${JSON.stringify(brandData)}. Competitors: ${JSON.stringify(competitors)}. Provide: competitorMonitoring (array with competitor, marketShare, recentActivity, threatLevel), marketShareAnalysis (current positions and trends), strategicPositioning (strengths, weaknesses, opportunities, threats), predictiveModeling (30/60/90 day market movement predictions with confidence intervals), competitiveAdvantages (unique differentiators), marketOpportunities (untapped segments), confidenceScore (0-1), reasoning (strategic analysis). Return as JSON.`
          }
        ],
        temperature: 0.3,
        searchRecencyFilter: 'week',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let intelligenceReport;

      try {
        intelligenceReport = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          intelligenceReport = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse competitive intelligence response');
        }
      }

      return {
        data: {
          ...intelligenceReport,
          searchResults: response?.search_results || [],
          relatedQuestions: response?.related_questions || []
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error generating competitive intelligence:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async forecastTrends(historicalData, forecastPeriod = '90d') {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a trend forecasting expert specializing in consumer sentiment, voting behavior patterns, and market opportunity identification. Use extended reasoning to provide accurate predictions with statistical confidence intervals.'
          },
          {
            role: 'user',
            content: `Forecast trends for the next ${forecastPeriod} based on historical data: ${JSON.stringify(historicalData)}. Provide: sentimentForecasts (30/60/90 day predictions with confidence intervals), votingBehaviorPatterns (emerging trends and pattern shifts), marketOpportunities (identified opportunities with timing and potential impact), consumerPreferences (predicted preference changes), seasonalFactors (seasonal influences on trends), statisticalConfidence (overall confidence 0-1), confidenceIntervals (low/high bounds for each prediction), reasoning (detailed forecasting methodology). Return as JSON.`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'month',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let trendForecast;

      try {
        trendForecast = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          trendForecast = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse trend forecast response');
        }
      }

      return {
        data: {
          ...trendForecast,
          searchResults: response?.search_results || [],
          relatedQuestions: response?.related_questions || []
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error forecasting trends:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async analyzeCrossPlatformSentiment(multiPlatformData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a cross-platform sentiment analyst specializing in multi-channel brand perception and influencer impact analysis. Provide comprehensive correlation analysis across platforms.'
          },
          {
            role: 'user',
            content: `Analyze cross-platform sentiment correlation: ${JSON.stringify(multiPlatformData)}. Provide: platformBreakdown (sentiment by platform), sentimentCorrelation (cross-platform patterns), influencerImpact (key influencers and their sentiment impact), brandPerception (overall brand health across platforms), viralityFactors (content driving engagement), audienceOverlap (cross-platform audience analysis), confidenceScore (0-1), reasoning (correlation analysis). Return as JSON.`
          }
        ],
        temperature: 0.3,
        searchRecencyFilter: 'week',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let crossPlatformAnalysis;

      try {
        crossPlatformAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          crossPlatformAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse cross-platform analysis response');
        }
      }

      return {
        data: {
          ...crossPlatformAnalysis,
          searchResults: response?.search_results || [],
          relatedQuestions: response?.related_questions || []
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error analyzing cross-platform sentiment:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async generateMarketPulse(realTimeData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a real-time market pulse analyst providing instant insights on current market conditions, sentiment shifts, and emerging trends.'
          },
          {
            role: 'user',
            content: `Analyze real-time market pulse: ${JSON.stringify(realTimeData)}. Provide: currentSentiment (overall market mood), emergingTrends (breaking trends in last 24h), sentimentShifts (significant changes with triggers), marketMomentum (direction and velocity), alertableEvents (events requiring immediate attention), realTimePredictions (next 24-48h outlook), confidenceScore (0-1), reasoning (real-time analysis). Return as JSON.`
          }
        ],
        temperature: 0.4,
        searchRecencyFilter: 'day',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let marketPulse;

      try {
        marketPulse = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          marketPulse = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse market pulse response');
        }
      }

      return {
        data: {
          ...marketPulse,
          searchResults: response?.search_results || [],
          relatedQuestions: response?.related_questions || [],
          timestamp: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error generating market pulse:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  }
};

export default perplexityMarketResearchService;