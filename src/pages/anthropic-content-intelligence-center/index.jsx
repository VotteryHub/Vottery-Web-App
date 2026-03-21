import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MisinformationDetectionPanel from './components/MisinformationDetectionPanel';
import PolicyViolationPanel from './components/PolicyViolationPanel';
import ContentQualityPanel from './components/ContentQualityPanel';
import AutomatedActionPanel from './components/AutomatedActionPanel';
import BiasDetectionPanel from './components/BiasDetectionPanel';
import AnalyticsDashboardPanel from './components/AnalyticsDashboardPanel';
import { moderationService } from '../../services/moderationService';
import { contentSafetyService } from '../../services/contentSafetyService';

const AnthropicContentIntelligenceCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [intelligenceMetrics, setIntelligenceMetrics] = useState(null);

  useEffect(() => {
    loadIntelligenceMetrics();
  }, []);

  const loadIntelligenceMetrics = async () => {
    setLoading(true);
    try {
      const [moderationAnalytics, modelPerformance, screeningStatistics] = await Promise.all([
        moderationService?.getContentAnalytics(),
        moderationService?.getModelPerformance(),
        contentSafetyService?.getScreeningStatistics('30d')
      ]);

      const analytics = moderationAnalytics?.data || {};
      const performance = modelPerformance?.data || {};
      const screening = screeningStatistics?.data || {};

      const liveData = {
        contentAnalysis: {
          totalAnalyzed: screening?.totalScreened || analytics?.totalScanned || 0,
          avgConfidenceScore: performance?.accuracy || 0,
          policyViolations: analytics?.policyViolations || 0,
          misinformationDetected: analytics?.misinformationFlags || 0
        },
        misinformationDetection: {
          detectionRate: performance?.recall || 0,
          falsePositiveRate: performance?.falsePositiveRate || 0,
          avgVerificationTime: 'live',
          sourceCredibilityScore: performance?.precision || 0
        },
        policyAssessment: {
          totalAssessments: screening?.totalScreened || 0,
          violationRate: screening?.totalScreened > 0
            ? Number((((analytics?.policyViolations || 0) / screening?.totalScreened) * 100).toFixed(1))
            : 0,
          humanReviewRequired: screening?.underReview || 0,
          automationAccuracy: performance?.accuracy || 0
        },
        contentQuality: {
          avgQualityScore: Math.max(0, 100 - (screening?.averageRiskScore || 0)),
          engagementPrediction: performance?.f1Score || 0,
          democraticDiscourseScore: performance?.precision || 0,
          optimizationSuggestions: screening?.highRiskCount || 0
        }
      };
      setIntelligenceMetrics(liveData);
    } catch (error) {
      console.error('Error loading intelligence metrics:', error);
      setIntelligenceMetrics({
        contentAnalysis: { totalAnalyzed: 0, avgConfidenceScore: 0, policyViolations: 0, misinformationDetected: 0 },
        misinformationDetection: { detectionRate: 0, falsePositiveRate: 0, avgVerificationTime: 'n/a', sourceCredibilityScore: 0 },
        policyAssessment: { totalAssessments: 0, violationRate: 0, humanReviewRequired: 0, automationAccuracy: 0 },
        contentQuality: { avgQualityScore: 0, engagementPrediction: 0, democraticDiscourseScore: 0, optimizationSuggestions: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'misinformation', label: 'Misinformation Detection', icon: 'AlertTriangle' },
    { id: 'policy', label: 'Policy Violation', icon: 'Shield' },
    { id: 'quality', label: 'Content Quality', icon: 'Award' },
    { id: 'automation', label: 'Automated Actions', icon: 'Zap' },
    { id: 'bias', label: 'Bias Detection', icon: 'Eye' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' }
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
        <title>Anthropic Content Intelligence Center - Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <LeftSidebar />

      <main className="lg:ml-64 xl:ml-72 pt-14">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                Anthropic Content Intelligence Center
              </h1>
              <p className="text-muted-foreground">
                Advanced Claude reasoning for content analysis, misinformation detection, and policy violation assessment
              </p>
            </div>
            <Button>
              <Icon name="Download" size={16} />
              Export Report
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
                      Content Analysis Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetricCard
                        icon="FileText"
                        label="Total Analyzed"
                        value={intelligenceMetrics?.contentAnalysis?.totalAnalyzed?.toLocaleString()}
                        description="Content items processed"
                        trend={null}
                        trendUp={false}
                      />
                      <MetricCard
                        icon="Gauge"
                        label="Confidence Score"
                        value={`${intelligenceMetrics?.contentAnalysis?.avgConfidenceScore}%`}
                        trend="+4.2%"
                        trendUp={true}
                        description="Average AI confidence"
                      />
                      <MetricCard
                        icon="Shield"
                        label="Policy Violations"
                        value={intelligenceMetrics?.contentAnalysis?.policyViolations?.toLocaleString()}
                        trend="-8.3%"
                        trendUp={true}
                        description="Detected violations"
                      />
                      <MetricCard
                        icon="AlertTriangle"
                        label="Misinformation"
                        value={intelligenceMetrics?.contentAnalysis?.misinformationDetected?.toLocaleString()}
                        trend="-12.1%"
                        trendUp={true}
                        description="False claims detected"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                      Misinformation Detection Engine
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetricCard
                        icon="Target"
                        label="Detection Rate"
                        value={`${intelligenceMetrics?.misinformationDetection?.detectionRate}%`}
                        trend="+6.7%"
                        trendUp={true}
                        description="Accuracy rate"
                      />
                      <MetricCard
                        icon="XCircle"
                        label="False Positive Rate"
                        value={`${intelligenceMetrics?.misinformationDetection?.falsePositiveRate}%`}
                        trend="-1.2%"
                        trendUp={true}
                        description="Error rate"
                      />
                      <MetricCard
                        icon="Clock"
                        label="Verification Time"
                        value={intelligenceMetrics?.misinformationDetection?.avgVerificationTime}
                        description="Average processing time"
                        trend={null}
                        trendUp={false}
                      />
                      <MetricCard
                        icon="CheckCircle"
                        label="Source Credibility"
                        value={`${intelligenceMetrics?.misinformationDetection?.sourceCredibilityScore}%`}
                        description="Average source score"
                        trend={null}
                        trendUp={false}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                      Policy Violation Assessment
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetricCard
                        icon="FileCheck"
                        label="Total Assessments"
                        value={intelligenceMetrics?.policyAssessment?.totalAssessments?.toLocaleString()}
                        description="Content reviewed"
                        trend={null}
                        trendUp={false}
                      />
                      <MetricCard
                        icon="AlertCircle"
                        label="Violation Rate"
                        value={`${intelligenceMetrics?.policyAssessment?.violationRate}%`}
                        trend="-3.4%"
                        trendUp={true}
                        description="Percentage flagged"
                      />
                      <MetricCard
                        icon="Users"
                        label="Human Review"
                        value={`${intelligenceMetrics?.policyAssessment?.humanReviewRequired}%`}
                        description="Requires manual review"
                        trend={null}
                        trendUp={false}
                      />
                      <MetricCard
                        icon="Zap"
                        label="Automation Accuracy"
                        value={`${intelligenceMetrics?.policyAssessment?.automationAccuracy}%`}
                        trend="+2.8%"
                        trendUp={true}
                        description="AI decision accuracy"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                      Content Quality Intelligence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <MetricCard
                        icon="Award"
                        label="Quality Score"
                        value={`${intelligenceMetrics?.contentQuality?.avgQualityScore}%`}
                        trend="+5.3%"
                        trendUp={true}
                        description="Average content quality"
                      />
                      <MetricCard
                        icon="TrendingUp"
                        label="Engagement Prediction"
                        value={`${intelligenceMetrics?.contentQuality?.engagementPrediction}%`}
                        description="Predicted engagement"
                        trend={null}
                        trendUp={false}
                      />
                      <MetricCard
                        icon="MessageSquare"
                        label="Discourse Quality"
                        value={`${intelligenceMetrics?.contentQuality?.democraticDiscourseScore}%`}
                        description="Democratic discourse score"
                        trend={null}
                        trendUp={false}
                      />
                      <MetricCard
                        icon="Lightbulb"
                        label="Suggestions"
                        value={intelligenceMetrics?.contentQuality?.optimizationSuggestions?.toLocaleString()}
                        description="Optimization recommendations"
                        trend={null}
                        trendUp={false}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'misinformation' && <MisinformationDetectionPanel />}
              {activeTab === 'policy' && <PolicyViolationPanel />}
              {activeTab === 'quality' && <ContentQualityPanel />}
              {activeTab === 'automation' && <AutomatedActionPanel />}
              {activeTab === 'bias' && <BiasDetectionPanel />}
              {activeTab === 'analytics' && <AnalyticsDashboardPanel />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnthropicContentIntelligenceCenter;