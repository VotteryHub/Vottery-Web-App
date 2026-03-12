import React, { useState, useEffect } from 'react';
import { Activity, Zap, Cpu, TrendingUp, AlertTriangle } from 'lucide-react';
import { carousel3DOptimizationService } from '../../services/carousel3DOptimizationService';
import HistoricalPerformanceService from '../../services/historicalPerformanceService';
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

const MetricCard = ({ icon, title, value, unit, status }) => {
  const statusColors = {
    optimal: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    critical: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${statusColors?.[status] || statusColors?.info}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="opacity-80">{icon}</div>
        <span className="text-xs font-medium uppercase">{status}</span>
      </div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold">{typeof value === 'number' ? value?.toFixed(1) : value}</span>
        <span className="text-sm opacity-70">{unit}</span>
      </div>
    </div>
  );
};

const AlertCard = ({ alert }) => {
  const severityColors = {
    low: 'border-blue-200 bg-blue-50',
    medium: 'border-yellow-200 bg-yellow-50',
    high: 'border-orange-200 bg-orange-50',
    critical: 'border-red-200 bg-red-50'
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${severityColors?.[alert?.severity] || severityColors?.low}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs font-medium rounded bg-white">
              {alert?.severity?.toUpperCase()}
            </span>
            <span className="text-sm text-gray-600">{alert?.metric_type}</span>
          </div>
          <p className="text-gray-900 font-medium">{alert?.message}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Threshold: {alert?.threshold_value}</span>
            <span>Current: {alert?.current_value}</span>
            <span>{new Date(alert?.created_at)?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductionObservabilityHub = () => {
  const [carouselMetrics, setCarouselMetrics] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('fps');
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    // Start monitoring 3D carousel performance
    carousel3DOptimizationService?.startFrameRateMonitoring((fps) => {
      setCarouselMetrics(carousel3DOptimizationService?.getPerformanceMetrics());
    });

    loadHistoricalData();
    loadAlerts();

    return () => {
      carousel3DOptimizationService?.stopFrameRateMonitoring();
    };
  }, [timeRange]);

  const loadHistoricalData = async () => {
    const data = await HistoricalPerformanceService?.getHistoricalData('3d_carousel_fps', timeRange);
    setHistoricalData(data);
  };

  const loadAlerts = async () => {
    const activeAlerts = await HistoricalPerformanceService?.getActiveAlerts();
    setAlerts(activeAlerts);
  };

  const chartData = {
    labels: historicalData?.map(d => new Date(d.date)?.toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Average FPS',
        data: historicalData?.map(d => d?.avg) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Min FPS',
        data: historicalData?.map(d => d?.min) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderDash: [5, 5],
        tension: 0.4
      },
      {
        label: 'Max FPS',
        data: historicalData?.map(d => d?.max) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: '3D Carousel Performance - FPS History'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 60
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="w-10 h-10 text-blue-600" />
              Production Observability Hub
            </h1>
            <p className="text-gray-600 mt-2">
              Real-time monitoring for 3D carousel and AI performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e?.target?.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>
      {/* Real-Time Metrics */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            icon={<Zap className="w-6 h-6" />}
            title="Current FPS"
            value={carouselMetrics?.currentFps || 0}
            unit="fps"
            status={carouselMetrics?.isOptimal ? 'optimal' : 'warning'}
          />
          <MetricCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Average FPS"
            value={carouselMetrics?.averageFps || 0}
            unit="fps"
            status="info"
          />
          <MetricCard
            icon={<Cpu className="w-6 h-6" />}
            title="Render Time"
            value={carouselMetrics?.averageRenderTime || 0}
            unit="ms"
            status="info"
          />
          <MetricCard
            icon={<Activity className="w-6 h-6" />}
            title="Memory Pool"
            value={carouselMetrics?.poolSize || 0}
            unit="objects"
            status="info"
          />
        </div>
      </div>
      {/* Historical Performance Chart */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Historical Performance Trending
          </h2>
          <div className="h-96">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      {/* Active Alerts */}
      {alerts?.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              Active Alerts
            </h2>
            <div className="space-y-3">
              {alerts?.map(alert => (
                <AlertCard key={alert?.id} alert={alert} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionObservabilityHub;