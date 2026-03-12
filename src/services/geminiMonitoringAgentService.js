import { supabase } from '../lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

class GeminiMonitoringAgentService {
  constructor() {
    this.monitoringInterval = null;
    this.performanceThresholds = {
      responseTime: 5000, // 5 seconds
      errorRate: 0.05, // 5%
      costEfficiency: 0.8, // 80% efficiency
      accuracy: 0.90 // 90% accuracy
    };
    
    // Automatic fallback thresholds (no permission needed)
    this.automaticFallbackThresholds = {
      serviceDisruption: 0.50, // 50% error rate
      apiLimitation: 0.30, // 30% rate limit errors
      criticalFailure: 0.80 // 80% failure rate
    };
  }

  // Start continuous monitoring
  async startMonitoring() {
    console.log('🤖 Gemini Monitoring Agent: Starting continuous supervision...');
    
    // Monitor every 5 minutes
    this.monitoringInterval = setInterval(async () => {
      await this.performSupervisionCycle();
    }, 5 * 60 * 1000);

    // Perform initial check
    await this.performSupervisionCycle();
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('🤖 Gemini Monitoring Agent: Supervision stopped');
    }
  }

  // Perform a complete supervision cycle
  async performSupervisionCycle() {
    try {
      const services = ['openai', 'anthropic', 'perplexity'];
      const results = [];

      for (const service of services) {
        const analysis = await this.analyzeServicePerformance(service);
        results?.push(analysis);

        // Determine fallback type
        const fallbackType = this.determineFallbackType(analysis);
        
        if (fallbackType === 'automatic') {
          // Automatic fallback - no permission needed
          await this.executeAutomaticFallback(service, analysis);
        } else if (fallbackType === 'manual') {
          // Manual approval required
          await this.generateCaseReport(service, analysis);
        }
      }

      // Store monitoring results
      await this.storeMonitoringResults(results);

      return results;
    } catch (error) {
      console.error('Gemini Monitoring Agent Error:', error);
      throw error;
    }
  }

  // Determine if fallback should be automatic or require manual approval
  determineFallbackType(analysis) {
    if (!analysis?.issues || analysis?.issues?.length === 0) {
      return null;
    }

    // Check for automatic fallback conditions
    const hasServiceDisruption = analysis?.issues?.some(issue => 
      issue?.type === 'high_error_rate' && 
      issue?.current >= this.automaticFallbackThresholds?.serviceDisruption
    );

    const hasAPILimitation = analysis?.issues?.some(issue => 
      issue?.type === 'api_rate_limit' && 
      issue?.current >= this.automaticFallbackThresholds?.apiLimitation
    );

    const hasCriticalFailure = analysis?.status === 'error' || 
      analysis?.issues?.some(issue => issue?.severity === 'critical');

    // Automatic fallback for service disruption or API limitations
    if (hasServiceDisruption || hasAPILimitation || hasCriticalFailure) {
      return 'automatic';
    }

    // Manual approval for cost/efficiency issues
    const hasCostIssue = analysis?.issues?.some(issue => 
      issue?.type === 'cost_inefficiency' || 
      issue?.type === 'performance_degradation' ||
      issue?.type === 'accuracy_decline'
    );

    if (hasCostIssue) {
      return 'manual';
    }

    return null;
  }

  // Execute automatic fallback without permission
  async executeAutomaticFallback(serviceName, analysis) {
    try {
      console.log(`🚨 AUTOMATIC FALLBACK: ${serviceName} → Gemini`);

      // Update fallback configuration
      const { error: configError } = await supabase?.from('ai_service_fallback_config')?.upsert({
          service_name: serviceName,
          fallback_provider: 'gemini',
          is_active: true,
          activation_reason: 'automatic_service_disruption',
          activated_at: new Date()?.toISOString(),
          performance_metrics: analysis?.metrics || {}
        }, { onConflict: 'service_name' });

      if (configError) throw configError;

      // Create admin alert
      await supabase?.from('admin_alerts')?.insert({
        alert_type: 'automatic_fallback_activated',
        severity: 'critical',
        title: `Automatic Fallback: ${serviceName} → Gemini`,
        message: `Gemini has automatically taken over ${serviceName} tasks due to service disruption. Error rate: ${(analysis?.metrics?.errorRate * 100)?.toFixed(2)}%`,
        metadata: {
          service_name: serviceName,
          fallback_type: 'automatic',
          analysis: analysis
        }
      });

      // Log to monitoring
      await this.logFallbackActivation(serviceName, 'automatic', analysis);

      console.log(`✅ Automatic fallback activated for ${serviceName}`);
    } catch (error) {
      console.error(`Error executing automatic fallback for ${serviceName}:`, error);
      throw error;
    }
  }

  // Analyze individual service performance
  async analyzeServicePerformance(serviceName) {
    try {
      // Fetch recent performance metrics
      const { data: metrics, error } = await supabase
        ?.from('ai_service_performance_metrics')
        ?.select('*')
        ?.eq('service_name', serviceName)
        ?.gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString())
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      if (!metrics || metrics?.length === 0) {
        return {
          serviceName,
          status: 'no_data',
          needsIntervention: false
        };
      }

      // Calculate performance indicators
      const avgResponseTime = metrics?.reduce((sum, m) => sum + (m?.response_time || 0), 0) / metrics?.length;
      const errorRate = metrics?.filter(m => m?.status === 'error')?.length / metrics?.length;
      const avgCost = metrics?.reduce((sum, m) => sum + (m?.cost || 0), 0) / metrics?.length;
      const avgAccuracy = metrics?.reduce((sum, m) => sum + (m?.accuracy || 0), 0) / metrics?.length;

      // Check against thresholds
      const issues = [];
      if (avgResponseTime > this.performanceThresholds?.responseTime) {
        issues?.push({
          type: 'performance_degradation',
          severity: 'high',
          metric: 'response_time',
          current: avgResponseTime,
          threshold: this.performanceThresholds?.responseTime
        });
      }

      if (errorRate > this.performanceThresholds?.errorRate) {
        const severity = errorRate >= this.automaticFallbackThresholds?.serviceDisruption 
          ? 'critical' :'high';
        issues?.push({
          type: 'high_error_rate',
          severity: severity,
          metric: 'error_rate',
          current: errorRate,
          threshold: this.performanceThresholds?.errorRate,
          automaticFallback: errorRate >= this.automaticFallbackThresholds?.serviceDisruption
        });
      }

      if (avgAccuracy < this.performanceThresholds?.accuracy) {
        issues?.push({
          type: 'accuracy_decline',
          severity: 'medium',
          metric: 'accuracy',
          current: avgAccuracy,
          threshold: this.performanceThresholds?.accuracy
        });
      }

      // Cost efficiency check
      const costEfficiency = this.calculateCostEfficiency(avgCost, avgAccuracy, avgResponseTime);
      if (costEfficiency < this.performanceThresholds?.costEfficiency) {
        issues?.push({
          type: 'cost_inefficiency',
          severity: 'medium',
          metric: 'cost_efficiency',
          current: costEfficiency,
          threshold: this.performanceThresholds?.costEfficiency
        });
      }

      return {
        serviceName,
        status: issues?.length > 0 ? 'degraded' : 'healthy',
        metrics: {
          avgResponseTime,
          errorRate,
          avgCost,
          avgAccuracy,
          costEfficiency
        },
        issues,
        needsIntervention: issues?.some(i => i?.severity === 'critical' || i?.severity === 'high'),
        timestamp: new Date()?.toISOString()
      };
    } catch (error) {
      console.error(`Error analyzing ${serviceName}:`, error);
      return {
        serviceName,
        status: 'error',
        error: error?.message,
        needsIntervention: true
      };
    }
  }

  // Calculate cost efficiency score
  calculateCostEfficiency(cost, accuracy, responseTime) {
    // Normalize metrics (lower cost, higher accuracy, lower response time = better)
    const costScore = Math.max(0, 1 - (cost / 0.1)); // Assuming $0.10 as baseline
    const accuracyScore = accuracy;
    const speedScore = Math.max(0, 1 - (responseTime / 10000)); // 10 seconds as baseline

    // Weighted average
    return (costScore * 0.4 + accuracyScore * 0.4 + speedScore * 0.2);
  }

  // Generate case report for manual approval (cost/efficiency issues)
  async generateCaseReport(serviceName, analysis) {
    try {
      console.log(`📋 Generating case report for ${serviceName} (Manual Approval Required)`);

      // Use Gemini to analyze and generate comprehensive report
      const model = genAI?.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `
You are Gemini, an intelligent AI monitoring agent for the Vottery platform. Analyze the following performance data for ${serviceName} and generate a comprehensive case report FOR ADMIN APPROVAL.

**IMPORTANT CONTEXT:**
This is a NON-AUTOMATIC fallback scenario requiring admin permission. The service is still operational but showing cost/efficiency issues.

**Service Performance Data:**
${JSON.stringify(analysis, null, 2)}

**Your Tasks:**
1. Identify the root causes of cost/efficiency issues
2. Assess the business impact (financial, operational, user experience)
3. Provide detailed cost-benefit analysis:
   - Current ${serviceName} costs per 1000 requests
   - Gemini's projected costs for same tasks
   - Potential monthly/annual savings
   - Performance comparison (response time, accuracy, reliability)
4. Show HOW you (Gemini) will perform these tasks more efficiently:
   - Specific optimization strategies
   - Expected performance improvements
   - Cost reduction mechanisms
5. Justify why you should take over:
   - Quantifiable benefits
   - Risk mitigation strategies
   - Rollback plan if needed
6. Request permission to take over with clear reasoning

**Output Format (JSON):**
{
  "executive_summary": "Brief overview emphasizing this requires admin approval",
  "fallback_type": "manual_approval_required",
  "root_causes": ["cause1", "cause2"],
  "severity": "medium|high",
  "business_impact": {
    "financial_impact": "Current monthly cost: $X, Projected savings: $Y (Z%)",
    "operational_impact": "Service still functional but inefficient",
    "user_experience_impact": "Minimal disruption expected during transition"
  },
  "detailed_cost_analysis": {
    "current_service": {
      "cost_per_1000_requests": "$X.XX",
      "monthly_volume": "Y requests",
      "monthly_cost": "$Z.ZZ",
      "annual_projection": "$A.AA"
    },
    "gemini_projection": {
      "cost_per_1000_requests": "$X.XX",
      "monthly_cost": "$Z.ZZ",
      "annual_projection": "$A.AA"
    },
    "savings": {
      "monthly_savings": "$X.XX",
      "annual_savings": "$Y.YY",
      "percentage_reduction": "Z%"
    }
  },
  "performance_comparison": {
    "response_time": {
      "current": "Xms",
      "gemini": "Yms",
      "improvement": "Z% faster/slower"
    },
    "accuracy": {
      "current": "X%",
      "gemini": "Y%",
      "improvement": "Z% better/worse"
    },
    "reliability": {
      "current": "X% uptime",
      "gemini": "Y% uptime",
      "improvement": "Z% better/worse"
    }
  },
  "gemini_optimization_strategy": {
    "how_i_will_do_it_better": ["strategy1", "strategy2", "strategy3"],
    "expected_improvements": ["improvement1", "improvement2"],
    "cost_reduction_mechanisms": ["mechanism1", "mechanism2"]
  },
  "takeover_justification": {
    "quantifiable_benefits": ["benefit1 with numbers", "benefit2 with numbers"],
    "risk_mitigation": ["how to minimize risks"],
    "transition_plan": ["step1", "step2", "step3"],
    "rollback_plan": "How to revert if performance degrades"
  },
  "permission_request": {
    "requesting_takeover": true,
    "confidence_level": "0-100%",
    "justification": "Clear, compelling reason why admin should approve",
    "expected_roi": "Return on investment timeline"
  },
  "recommendation": {
    "action": "approve_takeover|reject_with_optimization|hybrid_approach",
    "reasoning": "Detailed explanation",
    "estimated_transition_time": "X hours/days"
  }
}
`;

      const result = await model?.generateContent(prompt);
      const responseText = result?.response?.text();

      // Parse JSON response
      let caseReport;
      try {
        const jsonMatch = responseText?.match(/```json\n([\s\S]*?)\n```/) || responseText?.match(/```\n([\s\S]*?)\n```/);
        const jsonText = jsonMatch ? jsonMatch?.[1] : responseText;
        caseReport = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON:', parseError);
        caseReport = {
          executive_summary: responseText?.substring(0, 500),
          raw_response: responseText,
          parse_error: true,
          fallback_type: 'manual_approval_required'
        };
      }

      // Store case report in database
      const { data: reportData, error: reportError } = await supabase?.from('ai_service_case_reports')?.insert({
          service_name: serviceName,
          report_type: 'cost_efficiency_analysis',
          severity: caseReport?.severity || 'medium',
          analysis_data: analysis,
          case_report: caseReport,
          gemini_recommendation: caseReport?.recommendation?.action,
          requesting_takeover: caseReport?.permission_request?.requesting_takeover || false,
          status: 'pending_review'
        })?.select()?.single();

      if (reportError) throw reportError;

      // Create admin alert for manual review
      await supabase?.from('admin_alerts')?.insert({
        alert_type: 'manual_approval_required',
        severity: caseReport?.severity || 'medium',
        title: `Manual Approval Required: ${serviceName} Takeover Request`,
        message: `Gemini requests permission to take over ${serviceName} tasks due to cost/efficiency issues. Potential savings: ${caseReport?.detailed_cost_analysis?.savings?.monthly_savings || 'TBD'}/month`,
        metadata: {
          service_name: serviceName,
          fallback_type: 'manual',
          case_report_id: reportData?.id,
          potential_savings: caseReport?.detailed_cost_analysis?.savings
        }
      });

      // Add to Multi-AI Consensus queue for review
      await supabase?.from('multi_ai_consensus_queue')?.insert({
        request_type: 'service_takeover_approval',
        service_name: serviceName,
        case_report_id: reportData?.id,
        priority: caseReport?.severity === 'high' ? 'high' : 'medium',
        metadata: {
          fallback_type: 'manual',
          requires_admin_approval: true
        }
      });

      console.log(`✅ Case report generated for ${serviceName} - Awaiting admin approval`);
      return reportData;
    } catch (error) {
      console.error(`Error generating case report for ${serviceName}:`, error);
      throw error;
    }
  }

  // Log fallback activation
  async logFallbackActivation(serviceName, fallbackType, analysis) {
    try {
      await supabase?.from('gemini_monitoring_logs')?.insert({
        monitoring_cycle_id: `fallback_${Date.now()}`,
        results: {
          action: 'fallback_activated',
          service: serviceName,
          fallback_type: fallbackType,
          analysis: analysis
        },
        services_monitored: [serviceName],
        issues_detected: analysis?.issues?.length || 0
      });
    } catch (error) {
      console.error('Error logging fallback activation:', error);
    }
  }

  // Store monitoring results
  async storeMonitoringResults(results) {
    try {
      const cycleId = `cycle_${Date.now()}`;
      await supabase?.from('gemini_monitoring_logs')?.insert({
        monitoring_cycle_id: cycleId,
        results: results,
        services_monitored: results?.map(r => r?.serviceName),
        issues_detected: results?.reduce((sum, r) => sum + (r?.issues?.length || 0), 0)
      });
    } catch (error) {
      console.error('Error storing monitoring results:', error);
    }
  }
}

export default new GeminiMonitoringAgentService();