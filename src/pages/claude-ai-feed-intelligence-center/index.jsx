import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ContentRankingPanel from './components/ContentRankingPanel';
import PersonalizedRecommendationsPanel from './components/PersonalizedRecommendationsPanel';
import BehavioralAnalysisPanel from './components/BehavioralAnalysisPanel';
import FeedOptimizationPanel from './components/FeedOptimizationPanel';
import RecommendationTransparencyPanel from './components/RecommendationTransparencyPanel';
import AdvancedParametersPanel from './components/AdvancedParametersPanel';

const ClaudeAIFeedIntelligenceCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [intelligenceMetrics, setIntelligenceMetrics] = useState(null);

  useEffect(() => {
    loadIntelligenceMetrics();
  }, []);

  const loadIntelligenceMetrics = async () => {
    setLoading(true);
    try {
      const mockData = {
        contentRanking: {
          totalItemsRanked: 45892,
          avgRelevanceScore: 87.3,
          rankingAccuracy: 92.5,
          userSatisfactionRate: 89.7
        },
        recommendations: {
          totalRecommendations: 123456,
          acceptanceRate: 76.8,
          avgConfidenceScore: 84.2,
          personalizationDepth: 'High'
        },
        behavioralInsights: {
          patternsIdentified: 2847,
          votingFrequency: 'High',
          engagementTrend: 'Increasing',
          preferenceEvolution: 'Stable'
        },
        feedOptimization: {
          optimizationScore: 91.3,
          contentDiversity: 85.6,
          engagementLift: '+23.4%',
          retentionImprovement: '+18.7%'
        }
      };
      setIntelligenceMetrics(mockData);
    } catch (error) {
      console.error('Error loading intelligence metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'ranking', label: 'Content Ranking', icon: 'TrendingUp' },
    { id: 'recommendations', label: 'Recommendations', icon: 'Target' },
    { id: 'behavioral', label: 'Behavioral Analysis', icon: 'Brain' },
    { id: 'optimization', label: 'Feed Optimization', icon: 'Zap' },
    { id: 'transparency', label: 'Transparency', icon: 'Eye' },
    { id: 'parameters', label: 'Parameters', icon: 'Settings' }
  ];

  const MetricCard = ({ icon, label, value, trend, trendUp, description }) => (
    <div className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-250">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name={icon} size={24} className="text-primary" />
        </div>
        {trend && (
          <span className={`px-2 py-1 text-xs font-medium rounded-md ${
            trendUp ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      <p className="text-sm font-medium text-foreground mb-1">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Claude AI Feed Intelligence Center - Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <LeftSidebar />

      <main className="lg:ml-64 xl:ml-72 pt-14">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                Claude AI Feed Intelligence Center
              </h1>
              <p className="text-muted-foreground">
                Advanced contextual reasoning for intelligent content ranking and personalized election recommendations
              </p>
            </div>
            <Button>
              <Icon name="Download" size={16} />
              Export Insights
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 mb-6">
            <div className="flex gap-2 flex-wrap">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-250 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader" size={32} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <>
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                      Content Ranking Intelligence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetricCard
                        icon="TrendingUp"
                        label="Items Ranked"
                        value={intelligenceMetrics?.contentRanking?.totalItemsRanked?.toLocaleString()}
                        description="Total content items analyzed"
                        trend={undefined}
                        trendUp={undefined}
                      />
                      <MetricCard
                        icon="Target"
                        label="Relevance Score"
                        value={`${intelligenceMetrics?.contentRanking?.avgRelevanceScore}%`}
                        trend="+5.2%"
                        trendUp={true}
                        description="Average contextual relevance"
                      />
                      <MetricCard
                        icon="CheckCircle"
                        label="Ranking Accuracy"
                        value={`${intelligenceMetrics?.contentRanking?.rankingAccuracy}%`}
                        trend="+3.8%"
                        trendUp={true}
                        description="Prediction accuracy rate"
                      />
                      <MetricCard
                        icon="ThumbsUp"
                        label="User Satisfaction"
                        value={`${intelligenceMetrics?.contentRanking?.userSatisfactionRate}%`}
                        trend="+7.1%"
                        trendUp={true}
                        description="Positive feedback rate"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                      Personalized Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetricCard
                        icon="Sparkles"
                        label="Total Recommendations"
                        value={intelligenceMetrics?.recommendations?.totalRecommendations?.toLocaleString()}
                        description="Generated recommendations"
                        trend={undefined}
                        trendUp={undefined}
                      />
                      <MetricCard
                        icon="MousePointerClick"
                        label="Acceptance Rate"
                        value={`${intelligenceMetrics?.recommendations?.acceptanceRate}%`}
                        trend="+12.3%"
                        trendUp={true}
                        description="User engagement rate"
                      />
                      <MetricCard
                        icon="Gauge"
                        label="Confidence Score"
                        value={`${intelligenceMetrics?.recommendations?.avgConfidenceScore}%`}
                        description="AI confidence level"
                        trend={undefined}
                        trendUp={undefined}
                      />
                      <MetricCard
                        icon="Users"
                        label="Personalization"
                        value={intelligenceMetrics?.recommendations?.personalizationDepth}
                        description="Customization depth"
                        trend={undefined}
                        trendUp={undefined}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                      Behavioral Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetricCard
                        icon="Brain"
                        label="Patterns Identified"
                        value={intelligenceMetrics?.behavioralInsights?.patternsIdentified?.toLocaleString()}
                        description="Unique behavior patterns"
                        trend={undefined}
                        trendUp={undefined}
                      />
                      <MetricCard
                        icon="Activity"
                        label="Voting Frequency"
                        value={intelligenceMetrics?.behavioralInsights?.votingFrequency}
                        description="User participation level"
                        trend={undefined}
                        trendUp={undefined}
                      />
                      <MetricCard
                        icon="TrendingUp"
                        label="Engagement Trend"
                        value={intelligenceMetrics?.behavioralInsights?.engagementTrend}
                        trend="+15.6%"
                        trendUp={true}
                        description="Overall engagement direction"
                      />
                      <MetricCard
                        icon="GitBranch"
                        label="Preference Evolution"
                        value={intelligenceMetrics?.behavioralInsights?.preferenceEvolution}
                        description="Interest stability"
                        trend={undefined}
                        trendUp={undefined}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                      Feed Optimization
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetricCard
                        icon="Zap"
                        label="Optimization Score"
                        value={`${intelligenceMetrics?.feedOptimization?.optimizationScore}%`}
                        trend="+8.4%"
                        trendUp={true}
                        description="Overall feed quality"
                      />
                      <MetricCard
                        icon="Layers"
                        label="Content Diversity"
                        value={`${intelligenceMetrics?.feedOptimization?.contentDiversity}%`}
                        description="Variety score"
                        trend={undefined}
                        trendUp={undefined}
                      />
                      <MetricCard
                        icon="ArrowUp"
                        label="Engagement Lift"
                        value={intelligenceMetrics?.feedOptimization?.engagementLift}
                        trendUp={true}
                        description="Performance improvement"
                        trend={undefined}
                      />
                      <MetricCard
                        icon="UserCheck"
                        label="Retention Boost"
                        value={intelligenceMetrics?.feedOptimization?.retentionImprovement}
                        trendUp={true}
                        description="User retention gain"
                        trend={undefined}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'ranking' && <ContentRankingPanel />}
              {activeTab === 'recommendations' && <PersonalizedRecommendationsPanel />}
              {activeTab === 'behavioral' && <BehavioralAnalysisPanel />}
              {activeTab === 'optimization' && <FeedOptimizationPanel />}
              {activeTab === 'transparency' && <RecommendationTransparencyPanel />}
              {activeTab === 'parameters' && <AdvancedParametersPanel />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClaudeAIFeedIntelligenceCenter;