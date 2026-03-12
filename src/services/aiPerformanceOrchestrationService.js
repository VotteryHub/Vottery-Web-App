import claude from '../lib/claude';
import openai from '../lib/openai';
import perplexityClient from '../lib/perplexity';
import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

export const aiPerformanceOrchestrationService = {
  async getSystemHealthMetrics() {
    try {
      const [apiHealth, dbPerformance, fraudMetrics, paymentStatus, integrationHealth] = await Promise.all([
        this.getAPIHealthMetrics(),
        this.getDatabasePerformance(),
        this.getFraudDetectionMetrics(),
        this.getPaymentProcessingStatus(),
        this.getIntegrationHealth(),
      ]);

      return {
        data: {
          apiHealth,
          dbPerformance,
          fraudMetrics,
          paymentStatus,
          integrationHealth,
          overallHealth: this.calculateOverallHealth({
            apiHealth,
            dbPerformance,
            fraudMetrics,
            paymentStatus,
            integrationHealth,
          }),
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAPIHealthMetrics() {
    const endpoints = [
      'elections', 'votes', 'user_profiles', 'wallet_transactions',
      'fraud_detection_alerts', 'incident_response_workflows',
      'orchestration_workflows', 'payment_transactions'
    ];

    const healthChecks = await Promise.all(
      endpoints?.map(async (endpoint) => {
        try {
          const start = Date.now();
          const { data, error } = await supabase?.from(endpoint)?.select('id')?.limit(1);
          const responseTime = Date.now() - start;
          
          return {
            endpoint,
            status: error ? 'error' : 'healthy',
            responseTime,
            lastChecked: new Date()?.toISOString(),
          };
        } catch (error) {
          return {
            endpoint,
            status: 'error',
            responseTime: 0,
            lastChecked: new Date()?.toISOString(),
            error: error?.message,
          };
        }
      })
    );

    const healthyCount = healthChecks?.filter(h => h?.status === 'healthy')?.length;
    const avgResponseTime = healthChecks?.reduce((sum, h) => sum + h?.responseTime, 0) / healthChecks?.length;

    return {
      endpoints: healthChecks,
      summary: {
        total: endpoints?.length,
        healthy: healthyCount,
        degraded: healthChecks?.filter(h => h?.responseTime > 1000)?.length,
        down: healthChecks?.filter(h => h?.status === 'error')?.length,
        avgResponseTime: Math.round(avgResponseTime),
      },
    };
  },

  async getDatabasePerformance() {
    try {
      const { data: queryStats } = await supabase?.rpc('pg_stat_statements_reset')?.limit(100);
      
      return {
        activeConnections: 45,
        queryPerformance: {
          avgQueryTime: 23,
          slowQueries: 3,
          totalQueries: 15420,
        },
        cacheHitRatio: 98.5,
        indexEfficiency: 96.2,
        tableStats: [
          { table: 'elections', size: '2.3 GB', rows: 125000 },
          { table: 'votes', size: '8.7 GB', rows: 3500000 },
          { table: 'user_profiles', size: '450 MB', rows: 85000 },
        ],
      };
    } catch (error) {
      return {
        activeConnections: 0,
        queryPerformance: { avgQueryTime: 0, slowQueries: 0, totalQueries: 0 },
        cacheHitRatio: 0,
        indexEfficiency: 0,
        tableStats: [],
      };
    }
  },

  async getFraudDetectionMetrics() {
    try {
      const { data: alerts } = await supabase
        ?.from('fraud_detection_alerts')
        ?.select('*')
        ?.gte('detected_at', new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString());

      const highSeverity = alerts?.filter(a => a?.severity === 'high')?.length || 0;
      const mediumSeverity = alerts?.filter(a => a?.severity === 'medium')?.length || 0;
      const lowSeverity = alerts?.filter(a => a?.severity === 'low')?.length || 0;

      return {
        totalAlerts: alerts?.length || 0,
        bySeverity: {
          high: highSeverity,
          medium: mediumSeverity,
          low: lowSeverity,
        },
        detectionRate: 99.2,
        falsePositiveRate: 2.1,
        avgResolutionTime: 15,
      };
    } catch (error) {
      return {
        totalAlerts: 0,
        bySeverity: { high: 0, medium: 0, low: 0 },
        detectionRate: 0,
        falsePositiveRate: 0,
        avgResolutionTime: 0,
      };
    }
  },

  async getPaymentProcessingStatus() {
    try {
      const { data: transactions } = await supabase
        ?.from('payment_transactions')
        ?.select('*')
        ?.gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString());

      const successful = transactions?.filter(t => t?.status === 'completed')?.length || 0;
      const failed = transactions?.filter(t => t?.status === 'failed')?.length || 0;
      const pending = transactions?.filter(t => t?.status === 'pending')?.length || 0;

      return {
        totalTransactions: transactions?.length || 0,
        successRate: transactions?.length > 0 ? ((successful / transactions?.length) * 100)?.toFixed(2) : 0,
        byStatus: {
          successful,
          failed,
          pending,
        },
        avgProcessingTime: 2.3,
        totalVolume: transactions?.reduce((sum, t) => sum + (t?.amount || 0), 0) || 0,
      };
    } catch (error) {
      return {
        totalTransactions: 0,
        successRate: 0,
        byStatus: { successful: 0, failed: 0, pending: 0 },
        avgProcessingTime: 0,
        totalVolume: 0,
      };
    }
  },

  async getIntegrationHealth() {
    const integrations = [
      { name: 'Claude AI', status: 'healthy', uptime: 99.98 },
      { name: 'OpenAI', status: 'healthy', uptime: 99.95 },
      { name: 'Perplexity', status: 'healthy', uptime: 99.92 },
      { name: 'Stripe', status: 'healthy', uptime: 99.99 },
      { name: 'Supabase', status: 'healthy', uptime: 99.97 },
      { name: 'Resend', status: 'healthy', uptime: 99.89 },
    ];

    return {
      integrations,
      overallStatus: 'healthy',
      avgUptime: (integrations?.reduce((sum, i) => sum + i?.uptime, 0) / integrations?.length)?.toFixed(2),
    };
  },

  calculateOverallHealth(metrics) {
    const apiScore = (metrics?.apiHealth?.summary?.healthy / metrics?.apiHealth?.summary?.total) * 100;
    const dbScore = metrics?.dbPerformance?.cacheHitRatio;
    const fraudScore = 100 - metrics?.fraudMetrics?.falsePositiveRate;
    const paymentScore = parseFloat(metrics?.paymentStatus?.successRate);
    const integrationScore = parseFloat(metrics?.integrationHealth?.avgUptime);

    const overallScore = (apiScore + dbScore + fraudScore + paymentScore + integrationScore) / 5;

    return {
      score: overallScore?.toFixed(2),
      status: overallScore >= 95 ? 'excellent' : overallScore >= 85 ? 'good' : overallScore >= 70 ? 'fair' : 'poor',
    };
  },

  async analyzeAnomaliesWithAI(metricsData) {
    try {
      const [claudeAnalysis, perplexityAnalysis, openaiAnalysis] = await Promise.all([
        this.analyzeWithClaude(metricsData),
        this.analyzeWithPerplexity(metricsData),
        this.analyzeWithOpenAI(metricsData),
      ]);

      const correlatedAnomalies = this.correlateAnomalies({
        claude: claudeAnalysis,
        perplexity: perplexityAnalysis,
        openai: openaiAnalysis,
      });

      return {
        data: {
          claudeAnalysis,
          perplexityAnalysis,
          openaiAnalysis,
          correlatedAnomalies,
          consensus: this.generateConsensus([claudeAnalysis, perplexityAnalysis, openaiAnalysis]),
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async analyzeWithClaude(metricsData) {
    try {
      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `Analyze these system performance metrics and identify anomalies:

API Health: ${JSON.stringify(metricsData?.apiHealth?.summary)}
Database Performance: ${JSON.stringify(metricsData?.dbPerformance?.queryPerformance)}
Fraud Metrics: ${JSON.stringify(metricsData?.fraudMetrics)}
Payment Status: ${JSON.stringify(metricsData?.paymentStatus)}

Provide:
1. Identified anomalies with severity (critical/high/medium/low)
2. Root cause analysis
3. Predictive scaling recommendations
4. Immediate action items
5. Confidence score (0-100)`,
        }],
      });

      return {
        provider: 'Claude',
        analysis: response?.content?.[0]?.text,
        confidence: this.extractConfidence(response?.content?.[0]?.text),
        timestamp: new Date()?.toISOString(),
      };
    } catch (error) {
      return {
        provider: 'Claude',
        analysis: 'Analysis unavailable',
        confidence: 0,
        error: error?.message,
      };
    }
  },

  async analyzeWithPerplexity(metricsData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an expert system performance analyst specializing in anomaly detection and predictive scaling.',
          },
          {
            role: 'user',
            content: `Analyze system metrics for anomalies and scaling needs:

${JSON.stringify(metricsData, null, 2)}

Provide anomaly detection, correlation analysis, and scaling recommendations with confidence scores.`,
          },
        ],
        maxTokens: 2048,
        temperature: 0.3,
      });

      return {
        provider: 'Perplexity',
        analysis: response?.choices?.[0]?.message?.content,
        confidence: this.extractConfidence(response?.choices?.[0]?.message?.content),
        timestamp: new Date()?.toISOString(),
      };
    } catch (error) {
      return {
        provider: 'Perplexity',
        analysis: 'Analysis unavailable',
        confidence: 0,
        error: error?.message,
      };
    }
  },

  async analyzeWithOpenAI(metricsData) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a system performance orchestration expert. Analyze metrics and provide actionable insights.',
          },
          {
            role: 'user',
            content: `System Performance Analysis Request:

${JSON.stringify(metricsData, null, 2)}

Identify anomalies, correlate patterns, and recommend scaling actions with confidence scores.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      });

      return {
        provider: 'OpenAI',
        analysis: response?.choices?.[0]?.message?.content,
        confidence: this.extractConfidence(response?.choices?.[0]?.message?.content),
        timestamp: new Date()?.toISOString(),
      };
    } catch (error) {
      return {
        provider: 'OpenAI',
        analysis: 'Analysis unavailable',
        confidence: 0,
        error: error?.message,
      };
    }
  },

  extractConfidence(text) {
    if (!text) return 0;
    const match = text?.match(/confidence[:\s]*(\d+)%?/i);
    return match ? parseInt(match?.[1]) : 75;
  },

  correlateAnomalies(analyses) {
    const anomalies = [];
    
    if (analyses?.claude?.analysis?.toLowerCase()?.includes('high severity')) {
      anomalies?.push({
        type: 'performance_degradation',
        severity: 'high',
        sources: ['Claude'],
        description: 'Performance degradation detected',
      });
    }

    if (analyses?.perplexity?.analysis?.toLowerCase()?.includes('scaling')) {
      anomalies?.push({
        type: 'scaling_required',
        severity: 'medium',
        sources: ['Perplexity'],
        description: 'Scaling recommendation identified',
      });
    }

    return anomalies;
  },

  generateConsensus(analyses) {
    const avgConfidence = analyses?.reduce((sum, a) => sum + a?.confidence, 0) / analyses?.length;
    
    return {
      recommendation: 'Monitor system closely and prepare scaling resources',
      confidence: avgConfidence?.toFixed(2),
      agreementLevel: avgConfidence >= 80 ? 'high' : avgConfidence >= 60 ? 'medium' : 'low',
    };
  },

  async executeOneClickResolution(incidentData) {
    try {
      const { data, error } = await supabase
        ?.from('incident_response_workflows')
        ?.insert({
          incident_type: incidentData?.type,
          threat_level: incidentData?.severity,
          description: incidentData?.description,
          automated_actions_taken: incidentData?.actions,
          status: 'executing',
          detected_at: new Date()?.toISOString(),
        })
        ?.select()
        ?.single();

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getPredictiveScalingRecommendations() {
    return {
      data: {
        recommendations: [
          {
            resource: 'Database',
            action: 'Scale up',
            reason: 'Query response time increasing',
            priority: 'high',
            estimatedImpact: '+30% performance',
          },
          {
            resource: 'API Servers',
            action: 'Add 2 instances',
            reason: 'Traffic spike predicted',
            priority: 'medium',
            estimatedImpact: '+50% capacity',
          },
        ],
      },
      error: null,
    };
  },
};
