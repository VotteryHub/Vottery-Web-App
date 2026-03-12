import React, { useState } from 'react';
import { Zap, RefreshCw, Network, Brain, BarChart2, ChevronRight } from 'lucide-react';
import RetryLogicEngine from './components/RetryLogicEngine';
import CarrierRoutingOptimization from './components/CarrierRoutingOptimization';
import MLPredictionModel from './components/MLPredictionModel';
import DeliveryAnalyticsOverview from './components/DeliveryAnalyticsOverview';

const TABS = [
  { id: 'overview', label: 'Delivery Overview', icon: BarChart2 },
  { id: 'retry', label: 'Retry Logic Engine', icon: RefreshCw },
  { id: 'carrier', label: 'Carrier Routing', icon: Network },
  { id: 'ml', label: 'ML Prediction Model', icon: Brain }
];

const SMSDeliveryOptimizationEngineControlCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SMS Delivery Optimization Engine</h1>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>Control Center</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-blue-600">{TABS?.find(t => t?.id === activeTab)?.label}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-600">Optimization Engine Active</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-600">Exponential Backoff: 1s → 60s (2x)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-gray-600">ML Model: Active</span>
          </div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          {TABS?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab?.id
                  ? 'border-blue-600 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && <DeliveryAnalyticsOverview />}
        {activeTab === 'retry' && <RetryLogicEngine />}
        {activeTab === 'carrier' && <CarrierRoutingOptimization />}
        {activeTab === 'ml' && <MLPredictionModel />}
      </div>
    </div>
  );
};

export default SMSDeliveryOptimizationEngineControlCenter;
