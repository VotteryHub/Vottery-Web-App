import { supabase } from '../lib/supabase';
import { aiProxyService } from './aiProxyService';

class HistoricalPerformanceService {
  // Get historical performance data
  static async getHistoricalData(metricType, days = 7) {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)?.toISOString();

      const { data, error } = await supabase?.from('performance_metrics')?.select('*')?.eq('metric_type', metricType)?.gte('created_at', startDate)?.order('created_at', { ascending: true });

      if (error) throw error;

      return this.processHistoricalData(data);
    } catch (error) {
      console.error('Get historical data error:', error);
      return null;
    }
  }

  static processHistoricalData(data) {
    const byDay = {};
    
    data?.forEach(metric => {
      const day = new Date(metric.created_at)?.toISOString()?.split('T')?.[0];
      if (!byDay?.[day]) {
        byDay[day] = {
          date: day,
          values: [],
          avg: 0,
          min: Infinity,
          max: -Infinity
        };
      }
      
      byDay?.[day]?.values?.push(metric?.value);
      byDay[day].min = Math.min(byDay?.[day]?.min, metric?.value);
      byDay[day].max = Math.max(byDay?.[day]?.max, metric?.value);
    });

    // Calculate averages
    Object.keys(byDay)?.forEach(day => {
      const values = byDay?.[day]?.values;
      byDay[day].avg = values?.reduce((a, b) => a + b, 0) / values?.length;
    });

    return Object.values(byDay);
  }

  // Predictive alerting
  static async analyzeTrends(metricType, historicalData) {
    try {
      const prompt = `
Analyze these performance metrics and predict potential issues:

Metric Type: ${metricType}
Historical Data: ${JSON.stringify(historicalData)}

Provide:
1. Trend analysis (improving/declining/stable)
2. Anomaly detection
3. Predicted issues in next 7 days
4. Recommended actions

Return JSON format:
{
  "trend": "improving|declining|stable",
  "anomalies": [{"date": "...", "severity": "low|medium|high", "description": "..."}],
  "predictions": [{"date": "...", "issue": "...", "probability": 0.0-1.0}],
  "recommendations": ["..."]
}
`;

      const response = await aiProxyService?.chatCompletion({
        provider: 'GEMINI',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      });

      return JSON.parse(response?.content);
    } catch (error) {
      console.error('Trend analysis error:', error);
      return null;
    }
  }

  // Get performance comparison
  static async getPerformanceComparison(metricType) {
    try {
      const [sevenDay, thirtyDay] = await Promise.all([
        this.getHistoricalData(metricType, 7),
        this.getHistoricalData(metricType, 30)
      ]);

      const sevenDayAvg = sevenDay?.reduce((acc, d) => acc + d?.avg, 0) / (sevenDay?.length || 1);
      const thirtyDayAvg = thirtyDay?.reduce((acc, d) => acc + d?.avg, 0) / (thirtyDay?.length || 1);

      const change = ((sevenDayAvg - thirtyDayAvg) / thirtyDayAvg) * 100;

      return {
        sevenDay: {
          data: sevenDay,
          average: sevenDayAvg
        },
        thirtyDay: {
          data: thirtyDay,
          average: thirtyDayAvg
        },
        change: change,
        trend: change > 5 ? 'improving' : change < -5 ? 'declining' : 'stable'
      };
    } catch (error) {
      console.error('Performance comparison error:', error);
      return null;
    }
  }

  // Create performance alert
  static async createAlert(alertData) {
    try {
      const { data, error } = await supabase?.from('performance_alerts')?.insert({
          metric_type: alertData?.metricType,
          severity: alertData?.severity,
          message: alertData?.message,
          threshold_value: alertData?.thresholdValue,
          current_value: alertData?.currentValue,
          created_at: new Date()?.toISOString()
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create alert error:', error);
      throw error;
    }
  }

  // Get active alerts
  static async getActiveAlerts() {
    try {
      const { data, error } = await supabase?.from('performance_alerts')?.select('*')?.eq('status', 'active')?.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get active alerts error:', error);
      return [];
    }
  }

  // Export performance report
  static async exportPerformanceReport(metricType, days) {
    try {
      const historicalData = await this.getHistoricalData(metricType, days);
      const comparison = await this.getPerformanceComparison(metricType);
      const trendAnalysis = await this.analyzeTrends(metricType, historicalData);

      const report = {
        metricType,
        period: `${days} days`,
        generatedAt: new Date()?.toISOString(),
        historicalData,
        comparison,
        trendAnalysis,
        summary: {
          averageValue: comparison?.sevenDay?.average || 0,
          trend: comparison?.trend || 'unknown',
          changePercentage: comparison?.change || 0,
          anomalyCount: trendAnalysis?.anomalies?.length || 0,
          predictedIssues: trendAnalysis?.predictions?.length || 0
        }
      };

      return report;
    } catch (error) {
      console.error('Export report error:', error);
      return null;
    }
  }
}

export default HistoricalPerformanceService;
export const historicalPerformanceService = {
  getHistoricalData: HistoricalPerformanceService.getHistoricalData.bind(HistoricalPerformanceService),
  analyzeTrends: HistoricalPerformanceService.analyzeTrends.bind(HistoricalPerformanceService),
  getPerformanceComparison: HistoricalPerformanceService.getPerformanceComparison.bind(HistoricalPerformanceService),
  createAlert: HistoricalPerformanceService.createAlert.bind(HistoricalPerformanceService),
  getActiveAlerts: HistoricalPerformanceService.getActiveAlerts.bind(HistoricalPerformanceService),
  exportPerformanceReport: HistoricalPerformanceService.exportPerformanceReport.bind(HistoricalPerformanceService),
};