import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

export default function AllocationOptimizerPanel({ campaign }) {
  const [allocations, setAllocations] = useState([
    { category: 'Zone 1 (High Income)', current: 25, recommended: 35, impact: '+22%' },
    { category: 'Zone 2-3 (Upper Middle)', current: 20, recommended: 22, impact: '+8%' },
    { category: 'Premium Subscribers', current: 15, recommended: 25, impact: '+18%' },
    { category: 'Content Creators', current: 20, recommended: 15, impact: '-5%' },
    { category: 'Daily Active Users', current: 20, recommended: 18, impact: '+3%' }
  ]);

  const applyRecommendations = () => {
    setAllocations(prev => prev?.map(a => ({ ...a, current: a?.recommended })));
  };

  return (
    <div className="space-y-6">
      {/* Optimizer Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Allocation Optimizer</h2>
            <p className="text-blue-100">AI-powered prize distribution optimization</p>
          </div>
          <button
            onClick={applyRecommendations}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            Apply All Recommendations
          </button>
        </div>
      </div>

      {/* Allocation Comparison */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Current vs Recommended Allocation</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {allocations?.map((allocation, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{allocation?.category}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">Current: {allocation?.current}%</span>
                    <span className="text-xs font-semibold text-blue-600">Recommended: {allocation?.recommended}%</span>
                    <span className={`text-xs font-semibold ${
                      allocation?.impact?.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {allocation?.impact} ROI
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gray-400 h-8 rounded-full transition-all duration-500"
                      style={{ width: `${allocation?.current}%` }}
                    />
                    <div
                      className="absolute top-0 left-0 bg-blue-600 h-8 rounded-full opacity-50 transition-all duration-500"
                      style={{ width: `${allocation?.recommended}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optimization Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={20} className="text-green-600" />
            <span className="text-sm text-muted-foreground">Expected ROI Increase</span>
          </div>
          <div className="text-2xl font-bold text-green-600">+28%</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" size={20} className="text-blue-600" />
            <span className="text-sm text-muted-foreground">Engagement Boost</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">+35%</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Target" size={20} className="text-purple-600" />
            <span className="text-sm text-muted-foreground">Conversion Rate</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">+18%</div>
        </div>
      </div>
    </div>
  );
}