import { supabase } from '../lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

class GeminiMonitoringService {
  /**
   * Monitor AI service performance and efficiency
   */
  static async monitorAIServices() {
    try {
      const services = ['openai', 'anthropic', 'perplexity'];
      const monitoringResults = [];

      for (const service of services) {
        const metrics = await this.getServiceMetrics(service);
        const analysis = await this.analyzeServicePerformance(service, metrics);
        
        monitoringResults?.push({
          service,
          metrics,
          analysis,
          timestamp: new Date()?.toISOString()
        });

        // Store monitoring data
        await supabase?.from('ai_service_monitoring')?.insert({
          service_name: service,
          response_time: metrics?.avgResponseTime,
          error_rate: metrics?.errorRate,
          cost_per_query: metrics?.costPerQuery,
          efficiency_score: analysis?.efficiencyScore,
          performance_status: analysis?.status,
          monitored_at: new Date()?.toISOString()
        });
      }

      return monitoringResults;
    } catch (error) {
      console.error('Error monitoring AI services:', error);
      throw error;
    }
  }

  /**
   * Get service metrics from database
   */
  static async getServiceMetrics(serviceName) {
    try {
      const { data, error } = await supabase?.from('ai_service_monitoring')?.select('*')?.eq('service_name', serviceName)?.gte('monitored_at', new Date(Date.now() - 3600000)?.toISOString())?.order('monitored_at', { ascending: false });

      if (error) throw error;

      if (!data || data?.length === 0) {
        return {
          avgResponseTime: 0,
          errorRate: 0,
          costPerQuery: 0,
          availabilityPercentage: 100,
          totalRequests: 0
        };
      }

      const avgResponseTime = data?.reduce((sum, d) => sum + (d?.response_time || 0), 0) / data?.length;
      const errorRate = data?.reduce((sum, d) => sum + (d?.error_rate || 0), 0) / data?.length;
      const costPerQuery = data?.reduce((sum, d) => sum + (d?.cost_per_query || 0), 0) / data?.length;
      const availabilityPercentage = (data?.filter(d => d?.performance_status === 'healthy')?.length / data?.length) * 100;

      return {
        avgResponseTime: Math.round(avgResponseTime),
        errorRate: parseFloat(errorRate?.toFixed(2)),
        costPerQuery: parseFloat(costPerQuery?.toFixed(4)),
        availabilityPercentage: parseFloat(availabilityPercentage?.toFixed(2)),
        totalRequests: data?.length
      };
    } catch (error) {
      console.error(`Error getting metrics for ${serviceName}:`, error);
      return {
        avgResponseTime: 0,
        errorRate: 0,
        costPerQuery: 0,
        availabilityPercentage: 0,
        totalRequests: 0
      };
    }
  }

  /**
   * Analyze service performance using Gemini AI
   */
  static async analyzeServicePerformance(serviceName, metrics) {
    try {
      const model = genAI?.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Analyze the performance of ${serviceName} AI service with the following metrics:
- Average Response Time: ${metrics?.avgResponseTime}ms
- Error Rate: ${metrics?.errorRate}%
- Cost Per Query: $${metrics?.costPerQuery}
- Availability: ${metrics?.availabilityPercentage}%
- Total Requests: ${metrics?.totalRequests}

Provide:
1. Efficiency score (0-100)
2. Performance status (healthy/degraded/critical)
3. Cost efficiency rating (excellent/good/fair/poor)
4. Issues identified
5. Whether Gemini can serve as a better alternative

Respond in JSON format.`;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      const text = response?.text();

      // Parse JSON response
      const jsonMatch = text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch?.[0]);
      }

      // Fallback analysis
      return {
        efficiencyScore: metrics?.errorRate < 5 && metrics?.avgResponseTime < 2000 ? 85 : 60,
        status: metrics?.errorRate > 10 || metrics?.avgResponseTime > 5000 ? 'critical' : 'healthy',
        costEfficiency: metrics?.costPerQuery < 0.01 ? 'excellent' : 'fair',
        issues: [],
        canTakeover: false
      };
    } catch (error) {
      console.error('Error analyzing service performance:', error);
      return {
        efficiencyScore: 50,
        status: 'unknown',
        costEfficiency: 'unknown',
        issues: ['Analysis failed'],
        canTakeover: false
      };
    }
  }

  /**
   * Generate case report for underperforming AI service
   */
  static async generateCaseReport(serviceName, metrics, analysis) {
    try {
      const model = genAI?.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Generate a detailed case report for ${serviceName} AI service underperformance:

Current Metrics:
- Response Time: ${metrics?.avgResponseTime}ms
- Error Rate: ${metrics?.errorRate}%
- Cost Per Query: $${metrics?.costPerQuery}
- Availability: ${metrics?.availabilityPercentage}%

Analysis:
- Efficiency Score: ${analysis?.efficiencyScore}/100
- Status: ${analysis?.status}
- Cost Efficiency: ${analysis?.costEfficiency}

Provide:
1. Executive Summary
2. Performance Issues Identified
3. Cost Impact Analysis
4. Gemini Takeover Proposal (if applicable)
5. Expected Improvements with Gemini
6. Cost Comparison
7. Recommendation

Format as a professional case report.`;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      const caseReport = response?.text();

      // Store case report
      const { data, error } = await supabase?.from('ai_service_case_reports')?.insert({
          service_name: serviceName,
          report_content: caseReport,
          metrics: metrics,
          analysis: analysis,
          status: 'pending_review',
          created_at: new Date()?.toISOString()
        })?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error generating case report:', error);
      throw error;
    }
  }

  /**
   * Get all case reports
   */
  static async getCaseReports(filters = {}) {
    try {
      let query = supabase?.from('ai_service_case_reports')?.select('*')?.order('created_at', { ascending: false });

      if (filters?.serviceName) {
        query = query?.eq('service_name', filters?.serviceName);
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching case reports:', error);
      return [];
    }
  }

  /**
   * Approve or reject takeover request
   */
  static async updateTakeoverRequest(reportId, decision, adminNotes = '') {
    try {
      const { data, error } = await supabase?.from('ai_service_case_reports')?.update({
          status: decision === 'approved' ? 'approved' : 'rejected',
          admin_decision: decision,
          admin_notes: adminNotes,
          reviewed_at: new Date()?.toISOString()
        })?.eq('id', reportId)?.select()?.single();

      if (error) throw error;

      // If approved, update service routing
      if (decision === 'approved') {
        await this.updateServiceRouting(data?.service_name, 'gemini');
      }

      return data;
    } catch (error) {
      console.error('Error updating takeover request:', error);
      throw error;
    }
  }

  /**
   * Update service routing configuration
   */
  static async updateServiceRouting(serviceName, newProvider) {
    try {
      const { data, error } = await supabase?.from('ai_service_routing')?.upsert({
          service_name: serviceName,
          active_provider: newProvider,
          fallback_provider: serviceName,
          updated_at: new Date()?.toISOString()
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating service routing:', error);
      throw error;
    }
  }

  /**
   * Get service health status
   */
  static async getServiceHealthStatus() {
    try {
      const services = ['openai', 'anthropic', 'perplexity'];
      const healthStatus = [];

      for (const service of services) {
        const { data, error } = await supabase?.from('ai_service_monitoring')?.select('*')?.eq('service_name', service)?.order('monitored_at', { ascending: false })?.limit(1)?.single();

        if (error && error?.code !== 'PGRST116') {
          throw error;
        }

        healthStatus?.push({
          service,
          status: data?.performance_status || 'unknown',
          lastCheck: data?.monitored_at || null,
          responseTime: data?.response_time || 0,
          errorRate: data?.error_rate || 0
        });
      }

      return healthStatus;
    } catch (error) {
      console.error('Error getting service health status:', error);
      return [];
    }
  }

  /**
   * Get cost-benefit analysis
   */
  static async getCostBenefitAnalysis(serviceName) {
    try {
      const currentMetrics = await this.getServiceMetrics(serviceName);
      const geminiMetrics = await this.getServiceMetrics('gemini');

      const model = genAI?.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Provide a cost-benefit analysis for switching from ${serviceName} to Gemini:

Current Service (${serviceName}):
- Cost Per Query: $${currentMetrics?.costPerQuery}
- Response Time: ${currentMetrics?.avgResponseTime}ms
- Error Rate: ${currentMetrics?.errorRate}%

Gemini:
- Cost Per Query: $${geminiMetrics?.costPerQuery}
- Response Time: ${geminiMetrics?.avgResponseTime}ms
- Error Rate: ${geminiMetrics?.errorRate}%

Provide:
1. Monthly cost savings estimate
2. Performance improvement percentage
3. ROI timeline
4. Risk assessment
5. Recommendation

Respond in JSON format.`;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      const text = response?.text();

      const jsonMatch = text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch?.[0]);
      }

      return {
        monthlySavings: 0,
        performanceImprovement: 0,
        roiTimeline: 'Unknown',
        riskLevel: 'Medium',
        recommendation: 'Further analysis required'
      };
    } catch (error) {
      console.error('Error generating cost-benefit analysis:', error);
      throw error;
    }
  }
}

export default GeminiMonitoringService;