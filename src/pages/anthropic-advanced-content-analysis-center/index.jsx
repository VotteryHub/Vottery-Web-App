import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ContextAwareDetectionPanel from './components/ContextAwareDetectionPanel';
import MisinformationAnalysisPanel from './components/MisinformationAnalysisPanel';
import PolicyViolationPanel from './components/PolicyViolationPanel';
import AutomatedActionPanel from './components/AutomatedActionPanel';
import AnalyticsDashboardPanel from './components/AnalyticsDashboardPanel';
import { anthropicContentAnalysisService } from '../../services/anthropicContentAnalysisService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AnthropicAdvancedContentAnalysisCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    screeningStats: {},
    modelPerformance: {},
    recentAnalyses: []
  });
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    loadDashboardData();
    analytics?.trackEvent('anthropic_content_analysis_viewed', {
      active_tab: activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const result = await anthropicContentAnalysisService?.getAnalyticsDashboard();
      
      if (result?.data) {
        setDashboardData(result?.data);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeHateSpeech = async (contentData) => {
    try {
      setAnalyzing(true);
      const result = await anthropicContentAnalysisService?.analyzeContextAwareHateSpeech(contentData);
      
      if (result?.data) {
        setAnalysisResult(result?.data);
        await loadDashboardData();
      }
      return result;
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeMisinformation = async (contentData) => {
    try {
      setAnalyzing(true);
      const result = await anthropicContentAnalysisService?.detectMisinformation(contentData);
      
      if (result?.data) {
        setAnalysisResult(result?.data);
        await loadDashboardData();
      }
      return result;
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzePolicyViolation = async (contentData) => {
    try {
      setAnalyzing(true);
      const result = await anthropicContentAnalysisService?.assessPolicyViolation(contentData);
      
      if (result?.data) {
        setAnalysisResult(result?.data);
        await loadDashboardData();
      }
      return result;
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    } finally {
      setAnalyzing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'hate-speech', label: 'Hate Speech Detection', icon: 'ShieldAlert' },
    { id: 'misinformation', label: 'Misinformation Analysis', icon: 'AlertTriangle' },
    { id: 'policy', label: 'Policy Violations', icon: 'FileText' },
    { id: 'automation', label: 'Automated Actions', icon: 'Zap' }
  ];

  return (
    <>
      <Helmet>
        <title>Anthropic Advanced Content Analysis Center - Vottery</title>
        <meta name="description" content="AI-powered content moderation with Claude's advanced reasoning for intelligent detection of policy violations, hate speech, and misinformation." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Anthropic Advanced Content Analysis Center
                </h1>
                <p className="text-muted-foreground">
                  Claude-powered intelligent moderation with context-aware reasoning and nuanced policy interpretation
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
                  <Icon name="Brain" size={18} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Claude Sonnet 4.5</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadDashboardData}
                  disabled={loading}
                >
                  <Icon name="RefreshCw" size={14} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="FileSearch" size={18} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Total Analyses</span>
                </div>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {dashboardData?.screeningStats?.total || 0}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {dashboardData?.screeningStats?.approvalRate || 0}% approval rate
                  </span>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CheckCircle" size={18} className="text-success" />
                  <span className="text-sm text-muted-foreground">Approved</span>
                </div>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {dashboardData?.screeningStats?.approved || 0}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="TrendingUp" size={14} className="text-success" />
                  <span className="text-xs text-success">Safe content</span>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Flag" size={18} className="text-warning" />
                  <span className="text-sm text-muted-foreground">Flagged</span>
                </div>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {dashboardData?.screeningStats?.flagged || 0}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {dashboardData?.screeningStats?.flagRate || 0}% flag rate
                  </span>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Target" size={18} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Avg Confidence</span>
                </div>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {dashboardData?.screeningStats?.avgConfidence || 0}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="Brain" size={14} className="text-primary" />
                  <span className="text-xs text-primary">AI accuracy</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                <AnalyticsDashboardPanel
                  screeningStats={dashboardData?.screeningStats}
                  modelPerformance={dashboardData?.modelPerformance}
                  recentAnalyses={dashboardData?.recentAnalyses}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ContextAwareDetectionPanel
                    onAnalyze={handleAnalyzeHateSpeech}
                    analyzing={analyzing}
                    result={analysisResult}
                  />
                  <MisinformationAnalysisPanel
                    onAnalyze={handleAnalyzeMisinformation}
                    analyzing={analyzing}
                    result={analysisResult}
                  />
                </div>
              </>
            )}

            {activeTab === 'hate-speech' && (
              <ContextAwareDetectionPanel
                onAnalyze={handleAnalyzeHateSpeech}
                analyzing={analyzing}
                result={analysisResult}
                expanded
              />
            )}

            {activeTab === 'misinformation' && (
              <MisinformationAnalysisPanel
                onAnalyze={handleAnalyzeMisinformation}
                analyzing={analyzing}
                result={analysisResult}
                expanded
              />
            )}

            {activeTab === 'policy' && (
              <PolicyViolationPanel
                onAnalyze={handleAnalyzePolicyViolation}
                analyzing={analyzing}
                result={analysisResult}
              />
            )}

            {activeTab === 'automation' && (
              <AutomatedActionPanel
                screeningStats={dashboardData?.screeningStats}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnthropicAdvancedContentAnalysisCenter;