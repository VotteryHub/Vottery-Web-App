import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';

const WORKING_WEB_LINKS = [
  { path: '/claude-creator-success-agent', label: 'Claude Creator Success Agent' },
  { path: '/cross-domain-intelligence-analytics-hub', label: 'Cross-Domain Intelligence Hub' },
  { path: '/unified-ai-decision-orchestration-command-center', label: 'Unified AI Decision Orchestration' },
  { path: '/unified-incident-response-orchestration-center', label: 'Unified Incident Response' },
  { path: '/enhanced-resend-email-automation-hub', label: 'Resend Email Automation' },
  { path: '/claude-ai-dispute-moderation-center', label: 'Claude AI Dispute Moderation' },
  { path: '/claude-decision-reasoning-hub', label: 'Claude Decision Reasoning Hub' },
  { path: '/ai-powered-revenue-forecasting-intelligence-center', label: 'AI Revenue Forecasting' },
];

const PATH_TO_TITLE = {
  '/anthropic-content-intelligence-center': 'Anthropic Content Intelligence Center',
  '/anthropic-advanced-content-analysis-center': 'Anthropic Advanced Content Analysis Center',
  '/anthropic-claude-revenue-risk-intelligence-center': 'Anthropic Claude Revenue Risk Intelligence Center',
  '/claude-analytics-dashboard-for-campaign-intelligence': 'Claude Analytics Dashboard for Campaign Intelligence',
  '/claude-predictive-analytics-dashboard': 'Claude Predictive Analytics Dashboard',
  '/claude-ai-feed-intelligence-center': 'Claude AI Feed Intelligence Center',
  '/claude-ai-content-curation-intelligence-center': 'Claude AI Content Curation Intelligence Center',
  '/claude-model-comparison-center': 'Claude Model Comparison Center',
  '/claude-content-optimization-engine': 'Claude Content Optimization Engine',
  '/perplexity-market-research-intelligence-center': 'Perplexity Market Research Intelligence Center',
  '/advanced-perplexity-60-90-day-threat-forecasting-center': 'Advanced Perplexity 60–90 Day Threat Forecasting Center',
  '/perplexity-strategic-planning-center': 'Perplexity Strategic Planning Center',
  '/perplexity-carousel-intelligence-dashboard': 'Perplexity Carousel Intelligence Dashboard',
  '/automatic-ai-failover-engine-control-center': 'Automatic AI Failover Engine Control Center',
  '/ai-performance-orchestration-dashboard': 'AI Performance Orchestration Dashboard',
  '/ai-powered-performance-advisor-hub': 'AI-Powered Performance Advisor Hub',
  '/advanced-ai-fraud-prevention-command-center': 'Advanced AI Fraud Prevention Command Center',
  '/advanced-ml-threat-detection-center': 'Advanced ML Threat Detection Center',
  '/continuous-ml-feedback-outcome-learning-center': 'Continuous ML Feedback & Outcome Learning Center',
  '/open-ai-carousel-content-intelligence-center': 'OpenAI Carousel Content Intelligence Center',
  '/context-aware-claude-recommendations-overlay': 'Context-Aware Claude Recommendations Overlay',
  '/resend-email-automation-orchestration-center': 'Resend Email Automation Orchestration Center',
  '/autonomous-claude-agent-orchestration-hub': 'Autonomous Claude Agent Orchestration Hub',
  '/enhanced-real-time-behavioral-heatmaps-center': 'Enhanced Real-Time Behavioral Heatmaps Center',
  '/gemini-cost-efficiency-analyzer-case-report-generator': 'Gemini Cost Efficiency Analyzer & Case Report Generator',
};

function pathToTitle(path) {
  return PATH_TO_TITLE[path] || path?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'AI Center';
}

export default function AIPlaceholderCenter() {
  const { pathname } = useLocation();
  const title = pathToTitle(pathname);

  return (
    <>
      <HeaderNavigation />
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8 shadow-sm">
          <div className="mb-4 flex justify-center">
            <Icon name="Brain" className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-foreground text-center">{title}</h1>
          <p className="text-muted-foreground text-center">
            This center is in the roadmap. Some AI features are available on the mobile app or via the links below.
          </p>
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Path: <code className="rounded bg-muted px-1">{pathname}</code>
          </p>
          <div className="mt-6 pt-6 border-t border-border">
            <h2 className="text-sm font-medium text-foreground mb-2">Available on Web</h2>
            <ul className="space-y-1 text-sm">
              {WORKING_WEB_LINKS.map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className="text-primary hover:underline">{label}</Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Perplexity threat analysis, Claude revenue coaching, and additional AI screens are available in the mobile app.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
