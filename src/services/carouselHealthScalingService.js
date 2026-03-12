import { supabase } from '../lib/supabase';

class CarouselHealthScalingService {
  constructor() {
    this.carouselTypes = ['horizontal', 'vertical', 'gradient'];
    this.healthThresholds = {
      responseTime: { warning: 200, critical: 500 }, // ms
      errorRate: { warning: 1, critical: 5 }, // percentage
      throughput: { warning: 100, critical: 50 }, // requests per second
      cpuUsage: { warning: 70, critical: 85 }, // percentage
      memoryUsage: { warning: 75, critical: 90 } // percentage
    };
  }

  /**
   * Get system capacity metrics for all carousel types
   */
  async getSystemCapacityMetrics() {
    try {
      const capacityData = {};

      for (const type of this.carouselTypes) {
        const { data: metrics } = await supabase
          ?.from('carousel_performance_metrics')
          ?.select('*')
          ?.eq('carousel_type', type)
          ?.order('timestamp', { ascending: false })
          ?.limit(100);

        const currentLoad = this.calculateCurrentLoad(metrics);
        const maxCapacity = this.estimateMaxCapacity(type);
        const utilizationRate = (currentLoad / maxCapacity) * 100;

        capacityData[type] = {
          currentLoad: currentLoad?.toFixed(0),
          maxCapacity: maxCapacity?.toFixed(0),
          utilizationRate: utilizationRate?.toFixed(1),
          availableCapacity: (maxCapacity - currentLoad)?.toFixed(0),
          status: this.getCapacityStatus(utilizationRate),
          recommendedAction: this.getCapacityRecommendation(utilizationRate)
        };
      }

      return { data: capacityData, error: null };
    } catch (error) {
      console.error('Error getting system capacity metrics:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Monitor auto-scaling triggers and thresholds
   */
  async monitorAutoScalingTriggers() {
    try {
      const triggers = [];

      for (const type of this.carouselTypes) {
        const { data: metrics } = await supabase
          ?.from('carousel_performance_metrics')
          ?.select('*')
          ?.eq('carousel_type', type)
          ?.order('timestamp', { ascending: false })
          ?.limit(50);

        const avgResponseTime = this.calculateAvgResponseTime(metrics);
        const errorRate = this.calculateErrorRate(metrics);
        const throughput = this.calculateThroughput(metrics);
        const cpuUsage = this.estimateCPUUsage(metrics);
        const memoryUsage = this.estimateMemoryUsage(metrics);

        const trigger = {
          carouselType: type,
          metrics: {
            responseTime: avgResponseTime?.toFixed(0),
            errorRate: errorRate?.toFixed(2),
            throughput: throughput?.toFixed(0),
            cpuUsage: cpuUsage?.toFixed(1),
            memoryUsage: memoryUsage?.toFixed(1)
          },
          thresholds: this.healthThresholds,
          status: this.evaluateHealthStatus({
            responseTime: avgResponseTime,
            errorRate,
            throughput,
            cpuUsage,
            memoryUsage
          }),
          scalingRecommendation: this.getScalingRecommendation({
            responseTime: avgResponseTime,
            errorRate,
            throughput,
            cpuUsage,
            memoryUsage
          }),
          autoScaleTriggered: this.shouldTriggerAutoScale({
            responseTime: avgResponseTime,
            errorRate,
            cpuUsage,
            memoryUsage
          })
        };

        triggers?.push(trigger);
      }

      return { data: triggers, error: null };
    } catch (error) {
      console.error('Error monitoring auto-scaling triggers:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Get infrastructure optimization recommendations
   */
  async getInfrastructureOptimization() {
    try {
      const optimizations = [];

      for (const type of this.carouselTypes) {
        const { data: metrics } = await supabase
          ?.from('carousel_performance_metrics')
          ?.select('*')
          ?.eq('carousel_type', type)
          ?.order('timestamp', { ascending: false })
          ?.limit(200);

        const analysis = this.analyzePerformancePatterns(metrics);
        
        const optimization = {
          carouselType: type,
          currentPerformance: {
            avgResponseTime: analysis?.avgResponseTime?.toFixed(0),
            p95ResponseTime: analysis?.p95ResponseTime?.toFixed(0),
            errorRate: analysis?.errorRate?.toFixed(2),
            throughput: analysis?.throughput?.toFixed(0)
          },
          bottlenecks: this.identifyBottlenecks(analysis),
          recommendations: this.generateOptimizationRecommendations(analysis),
          estimatedImpact: this.estimateOptimizationImpact(analysis),
          priority: this.calculateOptimizationPriority(analysis)
        };

        optimizations?.push(optimization);
      }

      return { data: optimizations, error: null };
    } catch (error) {
      console.error('Error getting infrastructure optimization:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Track load balancing across carousel types
   */
  async trackLoadBalancing() {
    try {
      const loadData = [];

      for (const type of this.carouselTypes) {
        const { data: metrics } = await supabase
          ?.from('carousel_performance_metrics')
          ?.select('*')
          ?.eq('carousel_type', type)
          ?.gte('timestamp', new Date(Date.now() - 3600000)?.toISOString()); // Last hour

        const requestCount = metrics?.length || 0;
        const avgResponseTime = this.calculateAvgResponseTime(metrics);
        const errorCount = metrics?.filter(m => m?.error_occurred)?.length || 0;

        loadData?.push({
          carouselType: type,
          requestCount,
          requestsPerMinute: (requestCount / 60)?.toFixed(1),
          avgResponseTime: avgResponseTime?.toFixed(0),
          errorCount,
          errorRate: requestCount > 0 ? ((errorCount / requestCount) * 100)?.toFixed(2) : 0,
          loadDistribution: this.calculateLoadDistribution(requestCount),
          balanceStatus: this.evaluateBalanceStatus(requestCount)
        });
      }

      const totalRequests = loadData?.reduce((sum, d) => sum + d?.requestCount, 0);
      const balanceScore = this.calculateBalanceScore(loadData, totalRequests);

      return {
        data: {
          carouselLoads: loadData,
          totalRequests,
          balanceScore: balanceScore?.toFixed(1),
          balanceStatus: balanceScore > 80 ? 'Excellent' : balanceScore > 60 ? 'Good' : balanceScore > 40 ? 'Fair' : 'Poor',
          recommendations: this.getLoadBalancingRecommendations(loadData, balanceScore)
        },
        error: null
      };
    } catch (error) {
      console.error('Error tracking load balancing:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Get performance metrics dashboard data
   */
  async getPerformanceMetrics(timeRange = '24h') {
    try {
      const startDate = this.getStartDate(timeRange);
      const metricsData = {};

      for (const type of this.carouselTypes) {
        const { data: metrics } = await supabase
          ?.from('carousel_performance_metrics')
          ?.select('*')
          ?.eq('carousel_type', type)
          ?.gte('timestamp', startDate?.toISOString())
          ?.order('timestamp', { ascending: true });

        metricsData[type] = {
          totalRequests: metrics?.length || 0,
          avgResponseTime: this.calculateAvgResponseTime(metrics),
          p95ResponseTime: this.calculatePercentile(metrics, 95, 'response_time'),
          p99ResponseTime: this.calculatePercentile(metrics, 99, 'response_time'),
          errorRate: this.calculateErrorRate(metrics),
          throughput: this.calculateThroughput(metrics),
          uptime: this.calculateUptime(metrics),
          timeSeriesData: this.generateTimeSeriesData(metrics)
        };
      }

      return { data: metricsData, error: null };
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  // Helper methods

  calculateCurrentLoad(metrics) {
    if (!metrics || metrics?.length === 0) return 0;
    return metrics?.length / 60; // requests per second (assuming 60-second window)
  }

  estimateMaxCapacity(type) {
    const capacityMap = {
      horizontal: 1000,
      vertical: 800,
      gradient: 600
    };
    return capacityMap?.[type] || 500;
  }

  getCapacityStatus(utilizationRate) {
    if (utilizationRate < 50) return 'Healthy';
    if (utilizationRate < 70) return 'Normal';
    if (utilizationRate < 85) return 'Warning';
    return 'Critical';
  }

  getCapacityRecommendation(utilizationRate) {
    if (utilizationRate < 50) return 'No action needed';
    if (utilizationRate < 70) return 'Monitor closely';
    if (utilizationRate < 85) return 'Consider scaling up';
    return 'Scale up immediately';
  }

  calculateAvgResponseTime(metrics) {
    if (!metrics || metrics?.length === 0) return 0;
    const total = metrics?.reduce((sum, m) => sum + (m?.response_time || 0), 0);
    return total / metrics?.length;
  }

  calculateErrorRate(metrics) {
    if (!metrics || metrics?.length === 0) return 0;
    const errors = metrics?.filter(m => m?.error_occurred)?.length;
    return (errors / metrics?.length) * 100;
  }

  calculateThroughput(metrics) {
    if (!metrics || metrics?.length === 0) return 0;
    return metrics?.length / 60; // requests per second
  }

  estimateCPUUsage(metrics) {
    const throughput = this.calculateThroughput(metrics);
    return Math.min(95, (throughput / 10) * 100); // Simplified estimation
  }

  estimateMemoryUsage(metrics) {
    const avgResponseTime = this.calculateAvgResponseTime(metrics);
    return Math.min(95, (avgResponseTime / 5) * 100); // Simplified estimation
  }

  evaluateHealthStatus(metrics) {
    const { responseTime, errorRate, cpuUsage, memoryUsage } = metrics;
    
    if (
      responseTime > this.healthThresholds?.responseTime?.critical ||
      errorRate > this.healthThresholds?.errorRate?.critical ||
      cpuUsage > this.healthThresholds?.cpuUsage?.critical ||
      memoryUsage > this.healthThresholds?.memoryUsage?.critical
    ) {
      return 'Critical';
    }
    
    if (
      responseTime > this.healthThresholds?.responseTime?.warning ||
      errorRate > this.healthThresholds?.errorRate?.warning ||
      cpuUsage > this.healthThresholds?.cpuUsage?.warning ||
      memoryUsage > this.healthThresholds?.memoryUsage?.warning
    ) {
      return 'Warning';
    }
    
    return 'Healthy';
  }

  getScalingRecommendation(metrics) {
    const status = this.evaluateHealthStatus(metrics);
    
    if (status === 'Critical') {
      return 'Scale up immediately - add 2-3 instances';
    }
    if (status === 'Warning') {
      return 'Prepare to scale - add 1 instance';
    }
    return 'No scaling needed';
  }

  shouldTriggerAutoScale(metrics) {
    const { responseTime, errorRate, cpuUsage, memoryUsage } = metrics;
    return (
      responseTime > this.healthThresholds?.responseTime?.critical ||
      errorRate > this.healthThresholds?.errorRate?.critical ||
      cpuUsage > this.healthThresholds?.cpuUsage?.critical ||
      memoryUsage > this.healthThresholds?.memoryUsage?.critical
    );
  }

  analyzePerformancePatterns(metrics) {
    return {
      avgResponseTime: this.calculateAvgResponseTime(metrics),
      p95ResponseTime: this.calculatePercentile(metrics, 95, 'response_time'),
      errorRate: this.calculateErrorRate(metrics),
      throughput: this.calculateThroughput(metrics)
    };
  }

  identifyBottlenecks(analysis) {
    const bottlenecks = [];
    
    if (analysis?.avgResponseTime > 300) {
      bottlenecks?.push('High response time - consider caching or query optimization');
    }
    if (analysis?.errorRate > 2) {
      bottlenecks?.push('Elevated error rate - investigate error logs');
    }
    if (analysis?.throughput < 50) {
      bottlenecks?.push('Low throughput - check resource allocation');
    }
    
    return bottlenecks?.length > 0 ? bottlenecks : ['No significant bottlenecks detected'];
  }

  generateOptimizationRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis?.avgResponseTime > 200) {
      recommendations?.push('Implement Redis caching for frequently accessed data');
      recommendations?.push('Optimize database queries with proper indexing');
    }
    if (analysis?.errorRate > 1) {
      recommendations?.push('Add circuit breakers for external dependencies');
      recommendations?.push('Implement retry logic with exponential backoff');
    }
    if (analysis?.throughput < 100) {
      recommendations?.push('Enable horizontal auto-scaling');
      recommendations?.push('Optimize resource allocation per instance');
    }
    
    return recommendations?.length > 0 ? recommendations : ['System performing optimally'];
  }

  estimateOptimizationImpact(analysis) {
    if (analysis?.avgResponseTime > 300 || analysis?.errorRate > 3) {
      return 'High - 40-60% performance improvement expected';
    }
    if (analysis?.avgResponseTime > 200 || analysis?.errorRate > 1) {
      return 'Medium - 20-40% performance improvement expected';
    }
    return 'Low - 5-15% performance improvement expected';
  }

  calculateOptimizationPriority(analysis) {
    if (analysis?.avgResponseTime > 400 || analysis?.errorRate > 5) {
      return 'Critical';
    }
    if (analysis?.avgResponseTime > 250 || analysis?.errorRate > 2) {
      return 'High';
    }
    if (analysis?.avgResponseTime > 150 || analysis?.errorRate > 1) {
      return 'Medium';
    }
    return 'Low';
  }

  calculateLoadDistribution(requestCount) {
    // Simplified - in production, calculate against total platform load
    return (requestCount / 10000 * 100)?.toFixed(1);
  }

  evaluateBalanceStatus(requestCount) {
    if (requestCount > 5000) return 'High Load';
    if (requestCount > 2000) return 'Normal Load';
    return 'Low Load';
  }

  calculateBalanceScore(loadData, totalRequests) {
    if (totalRequests === 0) return 100;
    
    const idealDistribution = totalRequests / loadData?.length;
    const deviations = loadData?.map(d => Math.abs(d?.requestCount - idealDistribution));
    const avgDeviation = deviations?.reduce((sum, d) => sum + d, 0) / deviations?.length;
    
    return Math.max(0, 100 - (avgDeviation / idealDistribution * 100));
  }

  getLoadBalancingRecommendations(loadData, balanceScore) {
    if (balanceScore > 80) {
      return ['Load is well-balanced across carousel types'];
    }
    
    const recommendations = [];
    const avgLoad = loadData?.reduce((sum, d) => sum + d?.requestCount, 0) / loadData?.length;
    
    loadData?.forEach(d => {
      if (d?.requestCount > avgLoad * 1.5) {
        recommendations?.push(`Reduce load on ${d?.carouselType} carousel - consider traffic shaping`);
      }
      if (d?.requestCount < avgLoad * 0.5) {
        recommendations?.push(`Increase utilization of ${d?.carouselType} carousel`);
      }
    });
    
    return recommendations?.length > 0 ? recommendations : ['Monitor load distribution'];
  }

  calculatePercentile(metrics, percentile, field) {
    if (!metrics || metrics?.length === 0) return 0;
    
    const values = metrics?.map(m => m?.[field] || 0)?.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * values?.length) - 1;
    return values?.[index] || 0;
  }

  calculateUptime(metrics) {
    if (!metrics || metrics?.length === 0) return 100;
    
    const successfulRequests = metrics?.filter(m => !m?.error_occurred)?.length;
    return (successfulRequests / metrics?.length) * 100;
  }

  generateTimeSeriesData(metrics) {
    // Group by hour and calculate averages
    const hourlyData = {};
    
    metrics?.forEach(m => {
      const hour = new Date(m?.timestamp)?.getHours();
      if (!hourlyData?.[hour]) {
        hourlyData[hour] = { responseTime: [], errorCount: 0, requestCount: 0 };
      }
      hourlyData?.[hour]?.responseTime?.push(m?.response_time || 0);
      hourlyData[hour].requestCount++;
      if (m?.error_occurred) hourlyData[hour].errorCount++;
    });
    
    return Object.entries(hourlyData)?.map(([hour, data]) => ({
      hour: parseInt(hour),
      avgResponseTime: data?.responseTime?.reduce((a, b) => a + b, 0) / data?.responseTime?.length,
      requestCount: data?.requestCount,
      errorRate: (data?.errorCount / data?.requestCount) * 100
    }));
  }

  getStartDate(timeRange) {
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '1h':
        startDate?.setHours(now?.getHours() - 1);
        break;
      case '6h':
        startDate?.setHours(now?.getHours() - 6);
        break;
      case '24h':
        startDate?.setDate(now?.getDate() - 1);
        break;
      case '7d':
        startDate?.setDate(now?.getDate() - 7);
        break;
      default:
        startDate?.setDate(now?.getDate() - 1);
    }

    return startDate;
  }
}

export const carouselHealthScalingService = new CarouselHealthScalingService();
export default carouselHealthScalingService;