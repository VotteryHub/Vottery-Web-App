import React, { useState, useEffect } from 'react';
import { Zap, Eye, TrendingUp, Target, Brain, Activity } from 'lucide-react';
import HeatmapVisualizationPanel from './components/HeatmapVisualizationPanel';
import ClickPredictionPanel from './components/ClickPredictionPanel';
import MicroInteractionPanel from './components/MicroInteractionPanel';
import PredictiveAnalyticsPanel from './components/PredictiveAnalyticsPanel';
import OptimizationPanel from './components/OptimizationPanel';
import PerformanceMetricsPanel from './components/PerformanceMetricsPanel';
import Icon from '../../components/AppIcon';


const EnhancedRealTimeBehavioralHeatmapsCenter = () => {
  const [updateInterval, setUpdateInterval] = useState(5); // seconds
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, updateInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [isLive, updateInterval]);

  const realtimeMetrics = [
    {
      title: 'Active Sessions',
      value: '3,247',
      change: '+156',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Click Accuracy',
      value: '94.2%',
      change: '+2.1%',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Prediction Confidence',
      value: '89%',
      change: '+5%',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Interactions/Min',
      value: '12.4K',
      change: '+1.2K',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Enhanced Real-time Behavioral Heatmaps Center
            </h1>
            <p className="text-gray-600 text-lg">
              Advanced user interaction visualization with click prediction ML and micro-interaction tracking
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Update Interval:</span>
              <select
                value={updateInterval}
                onChange={(e) => setUpdateInterval(Number(e?.target?.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
              </select>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                isLive
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isLive ? 'bg-green-600 animate-pulse' : 'bg-gray-400'
                }`}
              />
              {isLive ? 'Live' : 'Paused'}
            </button>
          </div>
        </div>

        {/* Last Update Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Eye className="w-4 h-4" />
          <span>Last updated: {lastUpdate?.toLocaleTimeString()}</span>
          <span className="mx-2">•</span>
          <span>Processing {updateInterval}s intervals</span>
        </div>
      </div>
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {realtimeMetrics?.map((metric, index) => {
          const Icon = metric?.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric?.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric?.color}`} />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                  {metric?.change}
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{metric?.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{metric?.value}</p>
            </div>
          );
        })}
      </div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Heatmap Visualization - Full Width */}
        <div className="lg:col-span-3">
          <HeatmapVisualizationPanel isLive={isLive} updateInterval={updateInterval} />
        </div>

        {/* Click Prediction Engine */}
        <div className="lg:col-span-2">
          <ClickPredictionPanel />
        </div>

        {/* Performance Metrics */}
        <div className="lg:col-span-1">
          <PerformanceMetricsPanel />
        </div>

        {/* Micro-Interaction Tracking */}
        <div className="lg:col-span-2">
          <MicroInteractionPanel />
        </div>

        {/* Predictive Analytics */}
        <div className="lg:col-span-1">
          <PredictiveAnalyticsPanel />
        </div>

        {/* Optimization Panel - Full Width */}
        <div className="lg:col-span-3">
          <OptimizationPanel />
        </div>
      </div>
    </div>
  );
};

export default EnhancedRealTimeBehavioralHeatmapsCenter;