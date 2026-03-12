import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { smsProviderService } from '../../../services/smsProviderService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS?.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SMSDeliveryAnalyticsPanel = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await smsProviderService?.calculatePerformanceMetrics(timeRange);
      setMetrics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const chartData = {
    labels: ['Telnyx', 'Twilio'],
    datasets: [
      {
        label: 'Delivery Rate (%)',
        data: [metrics?.telnyx?.deliveryRate || 0, metrics?.twilio?.deliveryRate || 0],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={32} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-semibold text-foreground">Delivery Analytics</h3>
          <div className="w-48">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              options={timeRangeOptions}
            />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telnyx Delivery Rate</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                {metrics?.telnyx?.deliveryRate?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sent</span>
              <span className="font-medium text-foreground font-data">{metrics?.telnyx?.totalSent || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Failed</span>
              <span className="font-medium text-foreground font-data">{metrics?.telnyx?.totalFailed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Response</span>
              <span className="font-medium text-foreground font-data">{metrics?.telnyx?.avgResponseTime || 0}ms</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Twilio Delivery Rate</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                {metrics?.twilio?.deliveryRate?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sent</span>
              <span className="font-medium text-foreground font-data">{metrics?.twilio?.totalSent || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Failed</span>
              <span className="font-medium text-foreground font-data">{metrics?.twilio?.totalFailed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Response</span>
              <span className="font-medium text-foreground font-data">{metrics?.twilio?.avgResponseTime || 0}ms</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Icon name="Repeat" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Failover Events</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                {metrics?.failoverCount || 0}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Automatic provider switches in selected period
          </p>
        </div>
      </div>

      {/* Delivery Rate Chart */}
      <div className="card">
        <h4 className="font-semibold text-foreground mb-4">Provider Performance Comparison</h4>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Export Analytics</h4>
            <p className="text-sm text-muted-foreground">Download delivery analytics for reporting</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Icon name="Download" size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSDeliveryAnalyticsPanel;
