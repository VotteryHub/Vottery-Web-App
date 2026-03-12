import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import carouselFraudDetectionService from '../../services/carouselFraudDetectionService';
import { analytics } from '../../hooks/useGoogleAnalytics';

ChartJS?.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const AdvancedCarouselFraudDetectionPreventionCenter = () => {
  const [activeTab, setActiveTab] = useState('detection');
  const [loading, setLoading] = useState(true);
  const [fraudAnalytics, setFraudAnalytics] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [threatIntelligence, setThreatIntelligence] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadFraudData();

    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadFraudData();
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  useEffect(() => {
    analytics?.trackEvent('carousel_fraud_detection_viewed', {
      active_tab: activeTab,
      auto_refresh: autoRefresh,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab]);

  const loadFraudData = async () => {
    try {
      setLoading(true);
      const result = await carouselFraudDetectionService?.getFraudAnalytics('24h');
      if (result?.data) {
        setFraudAnalytics(result?.data);
      }
    } catch (error) {
      console.error('Error loading fraud data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvestigateUser = async (userId) => {
    const fraudScore = carouselFraudDetectionService?.getFraudScore(userId);
    setSelectedUser({ userId, fraudScore });
  };

  const fraudByCarouselChart = {
    labels: ['Horizontal Snap', 'Vertical Stack', 'Gradient Flow'],
    datasets: [{
      label: 'Fraud Attempts',
      data: fraudAnalytics ? [
        fraudAnalytics?.fraudByCarouselType?.horizontal,
        fraudAnalytics?.fraudByCarouselType?.vertical,
        fraudAnalytics?.fraudByCarouselType?.gradient
      ] : [0, 0, 0],
      backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 205, 86, 0.6)'],
      borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)'],
      borderWidth: 2
    }]
  };

  const threatLandscapeChart = {
    labels: ['Bot Activity', 'Manipulation', 'Fake Engagement'],
    datasets: [{
      data: fraudAnalytics ? [
        fraudAnalytics?.threatLandscape?.botActivity,
        fraudAnalytics?.threatLandscape?.manipulation,
        fraudAnalytics?.threatLandscape?.fakeEngagement
      ] : [0, 0, 0],
      backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(255, 159, 64, 0.8)', 'rgba(255, 205, 86, 0.8)'],
      borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)'],
      borderWidth: 2
    }]
  };

  const temporalPatternsChart = {
    labels: fraudAnalytics?.temporalPatterns?.map(t => `${t?.hour}:00`) || [],
    datasets: [{
      label: 'Fraud Attempts',
      data: fraudAnalytics?.temporalPatterns?.map(t => t?.fraudAttempts) || [],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  return (
    <div className="flex h-screen bg-background">
      <Helmet>
        <title>Advanced Carousel Fraud Detection & Prevention Center - Vottery</title>
      </Helmet>
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Advanced Carousel Fraud Detection & Prevention Center</h1>
                <p className="text-muted-foreground">Intelligent automated fraud prevention with ML algorithms and Perplexity threat intelligence</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-foreground">Active Monitoring</span>
                </div>
                <Button
                  variant={autoRefresh ? 'primary' : 'outline'}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className="flex items-center gap-2"
                >
                  <Icon name={autoRefresh ? 'Pause' : 'Play'} size={16} />
                  {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
              {['detection', 'analytics', 'intelligence', 'flagged']?.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab?.charAt(0)?.toUpperCase() + tab?.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              {/* Detection Tab */}
              {activeTab === 'detection' && (
                <div className="space-y-6">
                  {/* Detection Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card rounded-xl p-6 shadow-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                          <Icon name="Bot" size={24} className="text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">Bot Swipe Detection</h3>
                          <p className="text-xs text-muted-foreground">Velocity Analysis</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Detected</span>
                          <span className="text-2xl font-bold text-red-600 dark:text-red-400">{fraudAnalytics?.threatLandscape?.botActivity || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Blocked</span>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">{fraudAnalytics?.preventionEffectiveness?.blocked || 0}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 shadow-lg border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                          <Icon name="AlertTriangle" size={24} className="text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">Manipulation Detection</h3>
                          <p className="text-xs text-muted-foreground">Pattern Recognition</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Detected</span>
                          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{fraudAnalytics?.threatLandscape?.manipulation || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Flagged</span>
                          <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{fraudAnalytics?.preventionEffectiveness?.flagged || 0}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '32%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 shadow-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                          <Icon name="UserX" size={24} className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">Fake Engagement</h3>
                          <p className="text-xs text-muted-foreground">Anomaly Analysis</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Detected</span>
                          <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{fraudAnalytics?.threatLandscape?.fakeEngagement || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Under Review</span>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{fraudAnalytics?.preventionEffectiveness?.underReview || 0}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '23%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real-Time Fraud Scoring Engine */}
                  <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <Icon name="Gauge" size={24} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Real-Time Fraud Scoring Engine</h3>
                        <p className="text-sm text-muted-foreground">Individual user fraud risk scores with automated flagging</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {['critical', 'high', 'medium', 'low']?.map((level, index) => {
                        const counts = { critical: 12, high: 28, medium: 45, low: 156 };
                        const colors = {
                          critical: 'red',
                          high: 'orange',
                          medium: 'yellow',
                          low: 'green'
                        };
                        const color = colors?.[level];

                        return (
                          <div key={level} className={`p-4 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border border-${color}-200 dark:border-${color}-800`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-foreground capitalize">{level} Risk</span>
                              <Icon name="AlertCircle" size={16} className={`text-${color}-600 dark:text-${color}-400`} />
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">{counts?.[level]}</div>
                            <p className="text-xs text-muted-foreground">Active accounts</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Automated Mitigation Workflows */}
                  <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Icon name="Zap" size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Automated Mitigation Workflows</h3>
                        <p className="text-sm text-muted-foreground">Fraud pattern learning and automated response</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { action: 'Account Flagged', count: 45, status: 'active', color: 'yellow' },
                        { action: 'Temporary Suspension', count: 23, status: 'active', color: 'orange' },
                        { action: 'Permanent Ban', count: 12, status: 'completed', color: 'red' },
                        { action: 'Manual Review Triggered', count: 67, status: 'pending', color: 'blue' }
                      ]?.map((workflow, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-${workflow?.color}-100 dark:bg-${workflow?.color}-900/20 rounded-lg flex items-center justify-center`}>
                              <Icon name="CheckCircle" size={20} className={`text-${workflow?.color}-600 dark:text-${workflow?.color}-400`} />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{workflow?.action}</p>
                              <p className="text-xs text-muted-foreground capitalize">{workflow?.status}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">{workflow?.count}</p>
                            <p className="text-xs text-muted-foreground">Last 24h</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Fraud Analytics Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                      <h3 className="text-xl font-bold text-foreground mb-4">Fraud Attempts by Carousel Type</h3>
                      <Bar data={fraudByCarouselChart} options={{ responsive: true, maintainAspectRatio: true }} />
                    </div>

                    <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                      <h3 className="text-xl font-bold text-foreground mb-4">Threat Landscape Analysis</h3>
                      <Doughnut data={threatLandscapeChart} options={{ responsive: true, maintainAspectRatio: true }} />
                    </div>
                  </div>

                  {/* Temporal Pattern Identification */}
                  <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                    <h3 className="text-xl font-bold text-foreground mb-4">Temporal Fraud Patterns (24-Hour Analysis)</h3>
                    <Line data={temporalPatternsChart} options={{ responsive: true, maintainAspectRatio: true }} />
                  </div>

                  {/* Prevention Effectiveness Metrics */}
                  <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                    <h3 className="text-xl font-bold text-foreground mb-6">Prevention Effectiveness Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                          {fraudAnalytics?.preventionEffectiveness?.blocked || 0}
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">Blocked Attempts</p>
                        <p className="text-xs text-muted-foreground">Successfully prevented</p>
                      </div>
                      <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                        <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                          {fraudAnalytics?.preventionEffectiveness?.flagged || 0}
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">Flagged Accounts</p>
                        <p className="text-xs text-muted-foreground">Awaiting action</p>
                      </div>
                      <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {fraudAnalytics?.preventionEffectiveness?.underReview || 0}
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">Under Review</p>
                        <p className="text-xs text-muted-foreground">Manual investigation</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Intelligence Tab */}
              {activeTab === 'intelligence' && (
                <div className="space-y-6">
                  {/* Perplexity Threat Intelligence Integration */}
                  <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <Icon name="Brain" size={24} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Perplexity Threat Intelligence Integration</h3>
                        <p className="text-sm text-muted-foreground">Extended AI reasoning for threat correlation and behavioral pattern evolution</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                        <h4 className="font-bold text-foreground mb-4">Threat Correlation Analysis</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Correlated Threats</span>
                            <span className="text-lg font-bold text-foreground">34</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Confidence Score</span>
                            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">0.87</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Threat Level</span>
                            <span className="text-lg font-bold text-red-600 dark:text-red-400">High</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <h4 className="font-bold text-foreground mb-4">Behavioral Pattern Evolution</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Evolving Patterns</span>
                            <span className="text-lg font-bold text-foreground">12</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Prediction Accuracy</span>
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">91%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Response Triggers</span>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Geographic Correlation */}
                  <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                    <h3 className="text-xl font-bold text-foreground mb-6">Geographic Threat Correlation</h3>
                    <div className="space-y-3">
                      {fraudAnalytics?.geographicCorrelation?.map((geo, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <Icon name="MapPin" size={20} className="text-red-600 dark:text-red-400" />
                            <span className="font-semibold text-foreground">{geo?.region}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Fraud Attempts</p>
                              <p className="text-lg font-bold text-red-600 dark:text-red-400">{geo?.fraudAttempts}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Prevention Rate</p>
                              <p className="text-lg font-bold text-green-600 dark:text-green-400">{geo?.preventionRate}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Flagged Accounts Tab */}
              {activeTab === 'flagged' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                    <h3 className="text-xl font-bold text-foreground mb-6">Flagged Accounts & Fraud Investigation</h3>
                    <div className="space-y-3">
                      {[
                        { userId: 'user_12345', score: 87, riskLevel: 'critical', indicators: ['Bot-like velocity', 'Uniform timing'] },
                        { userId: 'user_67890', score: 72, riskLevel: 'high', indicators: ['Fake engagement', 'Sequential pattern'] },
                        { userId: 'user_54321', score: 65, riskLevel: 'high', indicators: ['Manipulation detected', 'Coordinated behavior'] },
                        { userId: 'user_98765', score: 58, riskLevel: 'medium', indicators: ['Suspicious velocity', 'Low diversity'] }
                      ]?.map((account, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${
                          account?.riskLevel === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                          account?.riskLevel === 'high'? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Icon name="User" size={20} className="text-foreground" />
                              <div>
                                <p className="font-semibold text-foreground">{account?.userId}</p>
                                <p className="text-xs text-muted-foreground capitalize">{account?.riskLevel} Risk</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Fraud Score</p>
                                <p className="text-2xl font-bold text-foreground">{account?.score}</p>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => handleInvestigateUser(account?.userId)}>
                                Investigate
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {account?.indicators?.map((indicator, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-background rounded border border-border text-foreground">
                                {indicator}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdvancedCarouselFraudDetectionPreventionCenter;
