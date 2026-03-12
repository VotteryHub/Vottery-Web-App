import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SystemHealthPanel from './components/SystemHealthPanel';
import ABTestingPanel from './components/ABTestingPanel';
import PerformanceMonitoringPanel from './components/PerformanceMonitoringPanel';
import AutomatedOptimizationPanel from './components/AutomatedOptimizationPanel';
import IntegrationTestingPanel from './components/IntegrationTestingPanel';
import OptimizationRecommendationsPanel from './components/OptimizationRecommendationsPanel';
import { analytics } from '../../hooks/useGoogleAnalytics';

const PlatformTestingOptimizationCommandCenter = () => {
  const [activeTab, setActiveTab] = useState('health');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [testingData, setTestingData] = useState({
    systemHealth: null,
    abTests: null,
    performance: null,
    optimization: null,
    integration: null,
    recommendations: null
  });

  useEffect(() => {
    loadTestingData();
    
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    analytics?.trackEvent('platform_testing_viewed', {
      active_tab: activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab]);

  const loadTestingData = async () => {
    try {
      setLoading(true);
      
      // Comprehensive platform audit data
      const systemHealth = {
        overallHealth: 94.5,
        uptime: 99.97,
        activeUsers: 3420,
        responseTime: 245,
        errorRate: 0.03,
        metrics: [
          { name: 'API Health', status: 'healthy', value: 98.2 },
          { name: 'Database Performance', status: 'healthy', value: 96.5 },
          { name: 'Authentication System', status: 'healthy', value: 99.1 },
          { name: 'Payment Processing', status: 'healthy', value: 97.8 },
          { name: 'Real-time Subscriptions', status: 'warning', value: 89.3 },
          { name: 'AI Services', status: 'healthy', value: 95.7 }
        ]
      };

      const abTests = {
        activeCampaigns: 12,
        completedTests: 45,
        tests: [
          { id: 1, name: 'Homepage Hero Layout', status: 'running', participants: 2340, conversionRate: 12.5, winner: null },
          { id: 2, name: 'Voting Button Color', status: 'completed', participants: 5670, conversionRate: 18.3, winner: 'Variant B' },
          { id: 3, name: 'Election Card Design', status: 'running', participants: 1890, conversionRate: 15.7, winner: null }
        ]
      };

      const performance = {
        loadTime: 1.2,
        firstContentfulPaint: 0.8,
        largestContentfulPaint: 1.5,
        timeToInteractive: 2.1,
        cumulativeLayoutShift: 0.05,
        databaseQueries: {
          avgResponseTime: 45,
          slowQueries: 3,
          optimizationOpportunities: 7
        },
        scalability: {
          currentLoad: 3420,
          maxCapacity: 50000,
          utilizationRate: 6.8
        }
      };

      const optimization = {
        recommendations: [
          { id: 1, type: 'UI Improvement', priority: 'high', impact: 'High', description: 'Optimize election card rendering for faster load times' },
          { id: 2, type: 'Algorithm Adjustment', priority: 'medium', impact: 'Medium', description: 'Improve feed ranking algorithm for better personalization' },
          { id: 3, type: 'UX Enhancement', priority: 'high', impact: 'High', description: 'Simplify navigation for average users with breadcrumb trails' }
        ],
        implemented: 23,
        pending: 8,
        effectiveness: 87.3
      };

      const integration = {
        apiTests: {
          passed: 234,
          failed: 3,
          successRate: 98.7
        },
        thirdPartyServices: [
          { name: 'Stripe', status: 'operational', latency: 120 },
          { name: 'Supabase', status: 'operational', latency: 45 },
          { name: 'Perplexity AI', status: 'operational', latency: 890 },
          { name: 'OpenAI', status: 'operational', latency: 650 },
          { name: 'Claude', status: 'operational', latency: 720 }
        ],
        regressionTests: {
          total: 156,
          passed: 154,
          failed: 2
        }
      };

      const recommendations = [
        {
          category: 'Navigation Optimization',
          priority: 'critical',
          recommendations: [
            'Add search functionality to main navigation for 100+ pages',
            'Implement hierarchical navigation with collapsible sections',
            'Create quick access shortcuts for frequently used features',
            'Add breadcrumb navigation for better orientation'
          ]
        },
        {
          category: 'Performance Optimization',
          priority: 'high',
          recommendations: [
            'Implement code splitting for 100+ lazy-loaded pages',
            'Optimize bundle size by removing unused dependencies',
            'Add service worker for offline functionality',
            'Implement image lazy loading and WebP format'
          ]
        },
        {
          category: 'User Experience',
          priority: 'high',
          recommendations: [
            'Add onboarding tutorial for new users',
            'Implement contextual help tooltips',
            'Create user role-based dashboard customization',
            'Add keyboard shortcuts for power users'
          ]
        },
        {
          category: 'Accessibility',
          priority: 'medium',
          recommendations: [
            'Ensure all interactive elements have proper ARIA labels',
            'Improve color contrast ratios for WCAG AAA compliance',
            'Add skip navigation links',
            'Implement focus management for modals'
          ]
        },
        {
          category: 'Security',
          priority: 'high',
          recommendations: [
            'Implement rate limiting on all API endpoints',
            'Add CSRF protection to all forms',
            'Enable Content Security Policy headers',
            'Implement security headers (HSTS, X-Frame-Options)'
          ]
        }
      ];

      setTestingData({
        systemHealth,
        abTests,
        performance,
        optimization,
        integration,
        recommendations
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load testing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadTestingData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'health', label: 'System Health', icon: 'Activity' },
    { id: 'abtesting', label: 'A/B Testing', icon: 'GitBranch' },
    { id: 'performance', label: 'Performance', icon: 'Zap' },
    { id: 'optimization', label: 'Optimization', icon: 'TrendingUp' },
    { id: 'integration', label: 'Integration Testing', icon: 'Link' },
    { id: 'recommendations', label: 'Recommendations', icon: 'Lightbulb' }
  ];

  return (
    <>
      <Helmet>
        <title>Platform Testing & Optimization Command Center - Vottery</title>
        <meta name="description" content="Comprehensive system performance monitoring, A/B testing management, and automated optimization workflows for continuous platform improvement." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Platform Testing & Optimization Command Center
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Comprehensive system monitoring, A/B testing, and automated optimization for continuous improvement
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} className="inline mr-1" />
                  Updated {lastUpdated?.toLocaleTimeString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={refreshing ? 'Loader' : 'RefreshCw'}
                  onClick={refreshData}
                  disabled={refreshing}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-card text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="card p-12 text-center">
              <Icon name="Loader" size={48} className="mx-auto text-primary mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading platform testing data...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'health' && (
                <SystemHealthPanel 
                  healthData={testingData?.systemHealth}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'abtesting' && (
                <ABTestingPanel 
                  abTestData={testingData?.abTests}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'performance' && (
                <PerformanceMonitoringPanel 
                  performanceData={testingData?.performance}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'optimization' && (
                <AutomatedOptimizationPanel 
                  optimizationData={testingData?.optimization}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'integration' && (
                <IntegrationTestingPanel 
                  integrationData={testingData?.integration}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'recommendations' && (
                <OptimizationRecommendationsPanel 
                  recommendations={testingData?.recommendations}
                  onRefresh={refreshData}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default PlatformTestingOptimizationCommandCenter;