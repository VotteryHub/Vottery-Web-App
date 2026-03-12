import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { supabase } from '../../lib/supabase';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';
import { useChat } from '../../hooks/useChat';
import toast, { Toaster } from 'react-hot-toast';

ChartJS?.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const CarouselFraudDetectionSystem = () => {
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [suspiciousPatterns, setSuspiciousPatterns] = useState([]);
  const [fraudScore, setFraudScore] = useState({ horizontal: 0, vertical: 0, gradient: 0 });
  const [botDetectionData, setBotDetectionData] = useState([]);
  const [threatAnalysis, setThreatAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [fraudStats, setFraudStats] = useState({
    totalAttempts: 0,
    blockedAccounts: 0,
    preventionRate: 0
  });
  
  const { response, isLoading, error, sendMessage } = useChat('PERPLEXITY', 'perplexity/sonar-reasoning-pro', false);

  const loadFraudData = async () => {
    try {
      // Load carousel interactions for fraud analysis
      const { data: interactions } = await supabase?.from('carousel_interactions')?.select('*')?.gte('created_at', new Date(Date.now() - 3600000)?.toISOString())?.order('created_at', { ascending: false });

      if (interactions) {
        analyzeFraudPatterns(interactions);
      }

      // Load fraud statistics
      const { data: fraudData } = await supabase?.from('carousel_fraud_alerts')?.select('*')?.gte('created_at', new Date(Date.now() - 86400000)?.toISOString());

      if (fraudData) {
        updateFraudStats(fraudData);
      }
    } catch (error) {
      console.error('Error loading fraud data:', error);
    }
  };

  useEffect(() => {
    if (error) toast?.error(error?.message);
  }, [error]);

  useEffect(() => {
    loadFraudData();
    subscribeToFraudAlerts();
  }, []);

  useRealtimeMonitoring({
    tables: ['carousel_fraud_alerts', 'carousel_interactions'],
    onRefresh: loadFraudData,
    enabled: true,
  });

  const analyzeFraudPatterns = (interactions) => {
    const userPatterns = {};
    const suspicious = [];

    interactions?.forEach(interaction => {
      const userId = interaction?.user_id;
      if (!userPatterns?.[userId]) {
        userPatterns[userId] = {
          swipes: [],
          velocities: [],
          timestamps: [],
          carouselTypes: []
        };
      }

      userPatterns?.[userId]?.swipes?.push(interaction);
      userPatterns?.[userId]?.velocities?.push(interaction?.swipe_velocity || 0);
      userPatterns?.[userId]?.timestamps?.push(new Date(interaction?.created_at)?.getTime());
      userPatterns?.[userId]?.carouselTypes?.push(interaction?.carousel_type);
    });

    // Detect bot behavior
    Object.entries(userPatterns)?.forEach(([userId, pattern]) => {
      const avgVelocity = pattern?.velocities?.reduce((a, b) => a + b, 0) / pattern?.velocities?.length;
      const velocityStdDev = calculateStdDev(pattern?.velocities);
      const swipeRate = pattern?.swipes?.length / ((pattern?.timestamps?.[pattern?.timestamps?.length - 1] - pattern?.timestamps?.[0]) / 1000);

      // Bot detection criteria
      if (avgVelocity > 2000 || velocityStdDev < 50 || swipeRate > 10) {
        suspicious?.push({
          userId,
          type: 'bot_swipe',
          avgVelocity: avgVelocity?.toFixed(0),
          swipeRate: swipeRate?.toFixed(2),
          confidence: calculateConfidence(avgVelocity, velocityStdDev, swipeRate),
          timestamp: new Date()?.toISOString()
        });
      }

      // Manipulation detection
      const uniqueCarousels = new Set(pattern.carouselTypes)?.size;
      if (pattern?.swipes?.length > 50 && uniqueCarousels === 1) {
        suspicious?.push({
          userId,
          type: 'manipulation',
          swipeCount: pattern?.swipes?.length,
          targetCarousel: pattern?.carouselTypes?.[0],
          confidence: 0.85,
          timestamp: new Date()?.toISOString()
        });
      }
    });

    setSuspiciousPatterns(suspicious?.slice(0, 20));
    setBotDetectionData(suspicious?.filter(s => s?.type === 'bot_swipe'));

    // Calculate fraud scores
    const scores = { horizontal: 0, vertical: 0, gradient: 0 };
    suspicious?.forEach(s => {
      if (s?.targetCarousel) {
        const type = s?.targetCarousel?.toLowerCase();
        scores[type] = (scores?.[type] || 0) + (s?.confidence * 10);
      }
    });
    setFraudScore(scores);

    // Trigger Perplexity threat analysis if high fraud detected
    if (suspicious?.length > 5) {
      runThreatAnalysis(suspicious);
    }
  };

  const calculateStdDev = (values) => {
    const avg = values?.reduce((a, b) => a + b, 0) / values?.length;
    const squareDiffs = values?.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs?.reduce((a, b) => a + b, 0) / squareDiffs?.length;
    return Math.sqrt(avgSquareDiff);
  };

  const calculateConfidence = (velocity, stdDev, rate) => {
    let confidence = 0;
    if (velocity > 2000) confidence += 0.4;
    if (stdDev < 50) confidence += 0.3;
    if (rate > 10) confidence += 0.3;
    return Math.min(confidence, 1);
  };

  const runThreatAnalysis = async (suspicious) => {
    if (analyzing || isLoading) return;

    setAnalyzing(true);
    try {
      const threatSummary = {
        totalSuspicious: suspicious?.length,
        botSwipes: suspicious?.filter(s => s?.type === 'bot_swipe')?.length,
        manipulationAttempts: suspicious?.filter(s => s?.type === 'manipulation')?.length,
        avgConfidence: suspicious?.reduce((sum, s) => sum + s?.confidence, 0) / suspicious?.length,
        patterns: suspicious?.slice(0, 10)
      };

      sendMessage([
        {
          role: 'system',
          content: 'You are an advanced fraud detection analyst with access to real-time threat intelligence. Analyze carousel interaction patterns for bot activity, manipulation attempts, and coordinated fraud. Provide threat correlation analysis and prevention recommendations. Return JSON only.'
        },
        {
          role: 'user',
          content: `Analyze these suspicious carousel interaction patterns and provide: 1) Threat correlation analysis, 2) Attack vector identification, 3) Prevention recommendations, 4) Risk severity assessment. Data: ${JSON.stringify(threatSummary)}`
        }
      ], {
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'threat_analysis',
            schema: {
              type: 'object',
              properties: {
                threatCorrelation: {
                  type: 'object',
                  properties: {
                    primaryThreat: { type: 'string' },
                    threatLevel: { type: 'string' },
                    correlatedPatterns: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['primaryThreat', 'threatLevel', 'correlatedPatterns']
                },
                attackVectors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      vector: { type: 'string' },
                      severity: { type: 'string' },
                      indicators: { type: 'array', items: { type: 'string' } }
                    },
                    required: ['vector', 'severity', 'indicators']
                  }
                },
                preventionRecommendations: {
                  type: 'array',
                  items: { type: 'string' }
                },
                riskScore: { type: 'number' }
              },
              required: ['threatCorrelation', 'attackVectors', 'preventionRecommendations', 'riskScore'],
              additionalProperties: false
            }
          }
        },
        web_search_options: {
          search_context_size: 'high'
        }
      });
    } catch (error) {
      console.error('Error running threat analysis:', error);
      toast?.error('Failed to run threat analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (response && !isLoading) {
      try {
        const analysis = JSON.parse(response);
        setThreatAnalysis(analysis);
        toast?.success('Threat analysis complete!');

        // Create high-priority alert if risk is severe
        if (analysis?.riskScore > 70) {
          setFraudAlerts(prev => [{
            type: 'critical',
            message: `High-risk threat detected: ${analysis?.threatCorrelation?.primaryThreat}`,
            timestamp: new Date()?.toISOString(),
            riskScore: analysis?.riskScore
          }, ...prev]);
        }
      } catch (error) {
        console.error('Error parsing threat analysis:', error);
      }
    }
  }, [response, isLoading]);

  const updateFraudStats = (fraudData) => {
    const stats = {
      totalAttempts: fraudData?.length,
      blockedAccounts: fraudData?.filter(f => f?.action_taken === 'blocked')?.length,
      preventionRate: 0
    };
    stats.preventionRate = stats?.totalAttempts > 0 ? ((stats?.blockedAccounts / stats?.totalAttempts) * 100)?.toFixed(1) : 0;
    setFraudStats(stats);
  };

  const subscribeToFraudAlerts = () => {
    const channel = supabase?.channel('carousel_fraud_alerts_updates')?.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'carousel_fraud_alerts'
      }, (payload) => {
        setFraudAlerts(prev => [{
          type: payload?.new?.severity || 'warning',
          message: payload?.new?.alert_message || 'New fraud alert',
          timestamp: payload?.new?.created_at,
          userId: payload?.new?.user_id
        }, ...prev?.slice(0, 19)]);
        toast?.error('New fraud alert detected!');
      })?.subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  };

  const fraudScoreChartData = {
    labels: ['Horizontal Snap', 'Vertical Stack', 'Gradient Flow'],
    datasets: [{
      label: 'Fraud Risk Score',
      data: [fraudScore?.horizontal, fraudScore?.vertical, fraudScore?.gradient],
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ]
    }]
  };

  return (
    <div className="flex h-screen bg-background">
      <Toaster position="top-right" />
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Carousel Fraud Detection System</h1>
              <p className="text-muted-foreground">Automated detection for suspicious carousel interactions with Perplexity threat intelligence integration</p>
            </div>

            {/* Fraud Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-card rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="AlertTriangle" size={24} className="text-red-500" />
                  <span className="text-sm text-gray-500">Last 24h</span>
                </div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{fraudStats?.totalAttempts}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Fraud Attempts</div>
              </div>
              <div className="bg-card rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Shield" size={24} className="text-green-500" />
                  <span className="text-sm text-gray-500">Blocked</span>
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{fraudStats?.blockedAccounts}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accounts Flagged</div>
              </div>
              <div className="bg-card rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="TrendingUp" size={24} className="text-blue-500" />
                  <span className="text-sm text-gray-500">Effectiveness</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{fraudStats?.preventionRate}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Prevention Rate</div>
              </div>
            </div>

            {/* Bot Swipe Detection */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                  <Icon name="Zap" size={24} className="text-yellow-500" />
                  Bot Swipe Detection (Velocity Analysis)
                </h2>
                <button
                  onClick={() => loadFraudData()}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2"
                >
                  <Icon name="RefreshCw" size={18} /> Refresh
                </button>
              </div>
              {botDetectionData?.length > 0 ? (
                <div className="space-y-3">
                  {botDetectionData?.slice(0, 10)?.map((bot, i) => (
                    <div key={i} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">User: {bot?.userId?.substring(0, 8)}...</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Avg Velocity: {bot?.avgVelocity}px/s | Swipe Rate: {bot?.swipeRate}/sec
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{(bot?.confidence * 100)?.toFixed(0)}%</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Confidence</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-green-500" />
                  <p>No bot activity detected</p>
                </div>
              )}
            </div>

            {/* Manipulation Pattern Recognition */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="Target" size={24} className="text-orange-500" />
                Manipulation Pattern Recognition
              </h2>
              {suspiciousPatterns?.filter(p => p?.type === 'manipulation')?.length > 0 ? (
                <div className="space-y-3">
                  {suspiciousPatterns?.filter(p => p?.type === 'manipulation')?.map((pattern, i) => (
                    <div key={i} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">User: {pattern?.userId?.substring(0, 8)}...</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {pattern?.swipeCount} swipes on {pattern?.targetCarousel} carousel
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100 rounded-full text-sm font-medium">
                          Suspicious
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-green-500" />
                  <p>No manipulation patterns detected</p>
                </div>
              )}
            </div>

            {/* Fraud Score by Carousel Type */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="PieChart" size={24} className="text-purple-500" />
                Fraud Risk Score by Carousel Type
              </h2>
              <div className="h-64">
                <Doughnut data={fraudScoreChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Perplexity Threat Intelligence */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                  <Icon name="Brain" size={24} className="text-blue-500" />
                  Perplexity Threat Intelligence
                </h2>
                <button
                  onClick={() => runThreatAnalysis(suspiciousPatterns)}
                  disabled={analyzing || isLoading || suspiciousPatterns?.length === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {analyzing || isLoading ? (
                    <><Icon name="Loader" size={18} className="animate-spin" /> Analyzing...</>
                  ) : (
                    <><Icon name="Search" size={18} /> Run Analysis</>
                  )}
                </button>
              </div>
              {threatAnalysis ? (
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{threatAnalysis?.threatCorrelation?.primaryThreat}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Primary Threat</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600 dark:text-red-400">{threatAnalysis?.riskScore}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Risk Score</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        threatAnalysis?.threatCorrelation?.threatLevel === 'critical' ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100' :
                        threatAnalysis?.threatCorrelation?.threatLevel === 'high' ? 'bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100' : 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100'
                      }`}>
                        {threatAnalysis?.threatCorrelation?.threatLevel?.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Correlated Patterns:</h4>
                      <div className="flex flex-wrap gap-2">
                        {threatAnalysis?.threatCorrelation?.correlatedPatterns?.map((pattern, i) => (
                          <span key={i} className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300">
                            {pattern}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Attack Vectors</h4>
                      <div className="space-y-2">
                        {threatAnalysis?.attackVectors?.map((vector, i) => (
                          <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900 dark:text-gray-100">{vector?.vector}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                vector?.severity === 'high' ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100' : 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100'
                              }`}>
                                {vector?.severity}
                              </span>
                            </div>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 ml-4 list-disc">
                              {vector?.indicators?.map((ind, j) => (
                                <li key={j}>{ind}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Prevention Recommendations</h4>
                      <div className="space-y-2">
                        {threatAnalysis?.preventionRecommendations?.map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="Brain" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Click "Run Analysis" to generate threat intelligence report</p>
                </div>
              )}
            </div>

            {/* Real-Time Fraud Alerts */}
            <div className="bg-card rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="Bell" size={24} className="text-red-500" />
                Real-Time Fraud Alerts
              </h2>
              {fraudAlerts?.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {fraudAlerts?.map((alert, i) => (
                    <div key={i} className={`p-4 rounded-lg border-l-4 ${
                      alert?.type === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert?.message}</p>
                          {alert?.userId && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">User: {alert?.userId?.substring(0, 8)}...</p>
                          )}
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {new Date(alert.timestamp)?.toLocaleString()}
                          </p>
                        </div>
                        {alert?.riskScore && (
                          <div className="text-center ml-4">
                            <div className="text-xl font-bold text-red-600 dark:text-red-400">{alert?.riskScore}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Risk</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-green-500" />
                  <p>No fraud alerts. System operating normally.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CarouselFraudDetectionSystem;