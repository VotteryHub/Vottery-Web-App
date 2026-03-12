import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ClaudeAdvisoryPanel from './components/ClaudeAdvisoryPanel';
import PerplexityIntelligencePanel from './components/PerplexityIntelligencePanel';
import MultiAIConsensusPanel from './components/MultiAIConsensusPanel';
import PerformanceOptimizationPanel from './components/PerformanceOptimizationPanel';
import CustomAdvisoryPanel from './components/CustomAdvisoryPanel';
import InsightHistoryPanel from './components/InsightHistoryPanel';

const AIPoweredPerformanceAdvisorHub = () => {
  const [activeTab, setActiveTab] = useState('claude');
  const [loading, setLoading] = useState(false);
  const [advisoryData, setAdvisoryData] = useState({
    claude: null,
    perplexity: null,
    consensus: null,
    optimization: []
  });
  const [realtimeStatus, setRealtimeStatus] = useState('active');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadAdvisoryData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshAdvisoryData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadAdvisoryData = async () => {
    try {
      setLoading(true);
      // Simulated data - in production, this would call actual services
      setAdvisoryData({
        claude: {
          recommendations: [
            {
              id: 1,
              category: 'Content Strategy',
              title: 'Optimize Election Timing',
              description: 'Analysis shows 3-5 PM EST generates 42% higher engagement. Consider scheduling high-value elections during this window.',
              confidence: 0.89,
              impact: 'high',
              reasoning: 'Based on 90-day historical voting patterns, user timezone distribution, and engagement velocity metrics.',
              implementation: [
                'Adjust election scheduler to prioritize 3-5 PM EST',
                'A/B test timing variations for 2 weeks',
                'Monitor engagement lift and iterate'
              ]
            },
            {
              id: 2,
              category: 'Prize Pool Strategy',
              title: 'Dynamic Prize Pool Allocation',
              description: 'Implement tiered prize pools based on predicted participation. Current flat-rate approach leaves 23% value on table.',
              confidence: 0.92,
              impact: 'high',
              reasoning: 'Machine learning analysis of 500+ elections reveals strong correlation between prize pool size and participation rate.',
              implementation: [
                'Deploy ML-based prize pool optimizer',
                'Start with conservative 15% variance',
                'Scale based on ROI metrics'
              ]
            },
            {
              id: 3,
              category: 'User Engagement',
              title: 'Personalized Notification Strategy',
              description: 'Segment users by engagement patterns and customize notification frequency. One-size-fits-all approach causes 18% opt-out rate.',
              confidence: 0.85,
              impact: 'medium',
              reasoning: 'Behavioral clustering identifies 4 distinct user personas with different notification preferences.',
              implementation: [
                'Implement user segmentation model',
                'Create persona-specific notification templates',
                'Measure retention impact over 30 days'
              ]
            }
          ],
          systemHealth: {
            overallScore: 87,
            areas: [
              { name: 'Content Quality', score: 92, trend: 'up' },
              { name: 'User Retention', score: 85, trend: 'stable' },
              { name: 'Revenue Efficiency', score: 79, trend: 'up' },
              { name: 'Platform Performance', score: 94, trend: 'stable' }
            ]
          }
        },
        perplexity: {
          marketAnalysis: {
            competitivePosition: 'Strong - Top 3 in engagement-based voting platforms',
            threats: [
              'Emerging competitor "VoteNow" raised $15M Series A, targeting same demographic',
              'TikTok testing native polling features with 100M+ user base',
              'Regulatory scrutiny increasing in EU markets'
            ],
            opportunities: [
              'Growing demand for community-driven decision making in Web3 space',
              'Corporate training market ($370B) exploring gamified feedback tools',
              'Political campaigns seeking authentic engagement platforms'
            ]
          },
          trendForecasting: [
            {
              trend: 'Video-First Voting',
              probability: 0.78,
              timeframe: '30-60 days',
              impact: 'High',
              recommendation: 'Accelerate Jolts video integration roadmap. Market data shows 3x engagement on video vs. text-based elections.'
            },
            {
              trend: 'AI-Generated Election Content',
              probability: 0.65,
              timeframe: '60-90 days',
              impact: 'Medium',
              recommendation: 'Partner with AI content tools. Early adopters seeing 40% reduction in election creation time.'
            },
            {
              trend: 'Blockchain Verification Demand',
              probability: 0.82,
              timeframe: '90+ days',
              impact: 'High',
              recommendation: 'Expand cryptographic audit features. Enterprise clients prioritizing verifiable voting systems.'
            }
          ],
          competitiveIntelligence: [
            {
              competitor: 'VoteNow',
              strength: 'Mobile-first UX, faster onboarding',
              weakness: 'Limited monetization, no creator payouts',
              action: 'Emphasize creator earnings in marketing'
            },
            {
              competitor: 'PollHub',
              strength: 'Enterprise partnerships, B2B focus',
              weakness: 'Poor consumer engagement, dated UI',
              action: 'Target mid-market B2B segment'
            }
          ]
        },
        consensus: {
          agreements: [
            {
              topic: 'Video Content Priority',
              claudePosition: 'High engagement potential based on user behavior',
              perplexityPosition: 'Market trend shows 3x engagement lift',
              consensusAction: 'Accelerate Jolts video features - both AI systems agree on high ROI',
              priority: 'Critical',
              confidence: 0.91
            },
            {
              topic: 'Prize Pool Optimization',
              claudePosition: 'Dynamic allocation improves efficiency by 23%',
              perplexityPosition: 'Competitor analysis shows similar strategies succeeding',
              consensusAction: 'Implement ML-based prize pool optimizer within 2 weeks',
              priority: 'High',
              confidence: 0.88
            }
          ],
          disagreements: [
            {
              topic: 'Blockchain Verification Timing',
              claudePosition: 'Current implementation sufficient, focus on UX improvements',
              perplexityPosition: 'Market demand growing, expand features now',
              resolution: 'Phased approach: UX improvements first (30 days), then feature expansion (60 days)',
              confidence: 0.72
            }
          ],
          weightedRecommendations: [
            { action: 'Accelerate video features', weight: 0.95, timeframe: 'Immediate' },
            { action: 'Deploy prize pool optimizer', weight: 0.88, timeframe: '2 weeks' },
            { action: 'Enhance notification personalization', weight: 0.79, timeframe: '4 weeks' },
            { action: 'Expand blockchain features', weight: 0.68, timeframe: '8 weeks' }
          ]
        },
        optimization: [
          {
            id: 1,
            category: 'Revenue Enhancement',
            title: 'Introduce Premium Election Tiers',
            description: 'Create "Featured" and "Spotlight" election tiers with enhanced visibility and larger prize pools.',
            estimatedImpact: '+$45K monthly revenue',
            effort: 'Medium',
            timeline: '3-4 weeks',
            status: 'recommended'
          },
          {
            id: 2,
            category: 'Engagement Optimization',
            title: 'Implement Streak Rewards',
            description: 'Daily voting streaks with escalating rewards to drive habitual engagement.',
            estimatedImpact: '+28% daily active users',
            effort: 'Low',
            timeline: '1-2 weeks',
            status: 'recommended'
          },
          {
            id: 3,
            category: 'Content Strategy',
            title: 'AI-Assisted Election Creation',
            description: 'Help creators generate election ideas, questions, and media using Claude AI.',
            estimatedImpact: '+40% election creation rate',
            effort: 'High',
            timeline: '6-8 weeks',
            status: 'in_review'
          }
        ]
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading advisory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAdvisoryData = async () => {
    setRealtimeStatus('updating');
    await loadAdvisoryData();
    setRealtimeStatus('active');
  };

  const tabs = [
    { id: 'claude', label: 'Claude Advisory', icon: 'Brain', color: 'text-purple-600' },
    { id: 'perplexity', label: 'Perplexity Intelligence', icon: 'TrendingUp', color: 'text-blue-600' },
    { id: 'consensus', label: 'Multi-AI Consensus', icon: 'GitMerge', color: 'text-green-600' },
    { id: 'optimization', label: 'Performance Optimization', icon: 'Zap', color: 'text-orange-600' },
    { id: 'custom', label: 'Custom Queries', icon: 'MessageSquare', color: 'text-indigo-600' },
    { id: 'history', label: 'Insight History', icon: 'Clock', color: 'text-gray-600' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'updating': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <>
      <Helmet>
        <title>AI-Powered Performance Advisor Hub | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <LeftSidebar />

      <main className="lg:ml-64 xl:ml-72 pt-14 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Icon name="Sparkles" className="w-7 h-7 text-purple-600" />
                  AI-Powered Performance Advisor
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Claude contextual reasoning + Perplexity extended analysis for intelligent optimization
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${realtimeStatus === 'active' ? 'bg-green-500 animate-pulse' : realtimeStatus === 'updating' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                  <span className={`text-xs font-medium ${getStatusColor(realtimeStatus)}`}>
                    {realtimeStatus === 'active' ? 'Live' : realtimeStatus === 'updating' ? 'Updating' : 'Offline'}
                  </span>
                </div>
                <Button
                  onClick={refreshAdvisoryData}
                  disabled={loading || realtimeStatus === 'updating'}
                  className="flex items-center gap-2"
                >
                  <Icon name="RefreshCw" className={`w-4 h-4 ${loading || realtimeStatus === 'updating' ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Claude Insights</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">
                      {advisoryData?.claude?.recommendations?.length || 0}
                    </p>
                  </div>
                  <Icon name="Brain" className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Market Trends</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                      {advisoryData?.perplexity?.trendForecasting?.length || 0}
                    </p>
                  </div>
                  <Icon name="TrendingUp" className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">AI Consensus</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                      {advisoryData?.consensus?.agreements?.length || 0}
                    </p>
                  </div>
                  <Icon name="GitMerge" className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Optimizations</p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 mt-1">
                      {advisoryData?.optimization?.length || 0}
                    </p>
                  </div>
                  <Icon name="Zap" className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'bg-purple-600 text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon name={tab?.icon} className="w-4 h-4" />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader" className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === 'claude' && <ClaudeAdvisoryPanel data={advisoryData?.claude} />}
              {activeTab === 'perplexity' && <PerplexityIntelligencePanel data={advisoryData?.perplexity} />}
              {activeTab === 'consensus' && <MultiAIConsensusPanel data={advisoryData?.consensus} />}
              {activeTab === 'optimization' && <PerformanceOptimizationPanel data={advisoryData?.optimization} />}
              {activeTab === 'custom' && <CustomAdvisoryPanel />}
              {activeTab === 'history' && <InsightHistoryPanel />}
            </>
          )}
        </div>

        {/* Last Updated */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Last updated: {lastUpdated?.toLocaleString()}
          </p>
        </div>
      </main>
    </>
  );
};

export default AIPoweredPerformanceAdvisorHub;