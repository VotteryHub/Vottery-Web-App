import React, { useState } from 'react';
import { MousePointer2, Flame, Eye, Navigation } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const HeatmapVisualizationPanel = ({ isLive, updateInterval }) => {
  const [heatmapType, setHeatmapType] = useState('click');
  const [screenFilter, setScreenFilter] = useState('all');

  const heatmapTypes = [
    { id: 'click', label: 'Click Density', icon: MousePointer2 },
    { id: 'hover', label: 'Hover Patterns', icon: Eye },
    { id: 'scroll', label: 'Scroll Behavior', icon: Navigation },
    { id: 'attention', label: 'Attention Zones', icon: Flame }
  ];

  const screens = [
    { id: 'all', label: 'All Screens' },
    { id: 'home', label: 'Home Feed' },
    { id: 'elections', label: 'Elections' },
    { id: 'voting', label: 'Voting Interface' },
    { id: 'profile', label: 'User Profile' }
  ];

  // Mock heatmap data zones
  const heatZones = [
    { x: 20, y: 15, intensity: 95, label: 'Vote Button' },
    { x: 60, y: 25, intensity: 87, label: 'Election Card' },
    { x: 40, y: 50, intensity: 72, label: 'Navigation' },
    { x: 75, y: 60, intensity: 65, label: 'Sidebar' },
    { x: 30, y: 80, intensity: 58, label: 'Footer Links' }
  ];

  const getIntensityColor = (intensity) => {
    if (intensity >= 80) return 'bg-red-500';
    if (intensity >= 60) return 'bg-orange-500';
    if (intensity >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Flame className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Live Interaction Heatmaps</h2>
            <p className="text-sm text-gray-600">
              Color-coded intensity mapping updating every {updateInterval}s
            </p>
          </div>
        </div>
        {isLive && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">Live Processing</span>
          </div>
        )}
      </div>
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {heatmapTypes?.map((type) => {
            const Icon = type?.icon;
            return (
              <button
                key={type?.id}
                onClick={() => setHeatmapType(type?.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  heatmapType === type?.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type?.label}
              </button>
            );
          })}
        </div>
        <select
          value={screenFilter}
          onChange={(e) => setScreenFilter(e?.target?.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          {screens?.map((screen) => (
            <option key={screen?.id} value={screen?.id}>
              {screen?.label}
            </option>
          ))}
        </select>
      </div>
      {/* Heatmap Visualization */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 mb-6" style={{ height: '500px' }}>
        {/* Mock screen representation */}
        <div className="absolute inset-8 bg-white rounded-lg shadow-inner border-2 border-gray-200">
          {/* Heatmap overlay zones */}
          {heatZones?.map((zone, idx) => (
            <div
              key={idx}
              className="absolute rounded-full opacity-60 blur-xl transition-all duration-500"
              style={{
                left: `${zone?.x}%`,
                top: `${zone?.y}%`,
                width: `${zone?.intensity}px`,
                height: `${zone?.intensity}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className={`w-full h-full rounded-full ${getIntensityColor(zone?.intensity)}`} />
            </div>
          ))}

          {/* Interaction markers */}
          {heatZones?.map((zone, idx) => (
            <div
              key={`marker-${idx}`}
              className="absolute group"
              style={{
                left: `${zone?.x}%`,
                top: `${zone?.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-3 h-3 bg-white border-2 border-purple-600 rounded-full shadow-lg" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {zone?.label}: {zone?.intensity}% intensity
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="text-xs font-semibold text-gray-700 mb-2">Intensity Scale</div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span className="text-xs text-gray-600">80-100%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded" />
                <span className="text-xs text-gray-600">60-79%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span className="text-xs text-gray-600">40-59%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-xs text-gray-600">&lt;40%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">2</div>
          <div className="text-xs text-gray-600">Hot Zones</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">3</div>
          <div className="text-xs text-gray-600">Warm Zones</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">12.4K</div>
          <div className="text-xs text-gray-600">Interactions</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">3,247</div>
          <div className="text-xs text-gray-600">Active Users</div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapVisualizationPanel;