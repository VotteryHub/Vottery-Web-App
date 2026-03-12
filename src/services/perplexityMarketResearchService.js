import perplexityClient from '../lib/perplexity';

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