import React from 'react';
import { Activity, Mouse, Keyboard, Navigation2, Clock } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const MicroInteractionPanel = () => {
  const interactions = [
    {
      type: 'Mouse Movement',
      count: '45.2K',
      avgDuration: '2.3s',
      pattern: 'Smooth',
      icon: Mouse,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'Keystroke Patterns',
      count: '12.8K',
      avgDuration: '0.8s',
      pattern: 'Rapid',
      icon: Keyboard,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      type: 'Form Interactions',
      count: '8.5K',
      avgDuration: '15.2s',
      pattern: 'Sequential',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      type: 'Navigation Flows',
      count: '23.1K',
      avgDuration: '4.7s',
      pattern: 'Linear',
      icon: Navigation2,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const detailedMetrics = [
    { metric: 'Avg Mouse Speed', value: '1,245 px/s', precision: '±15ms' },
    { metric: 'Click Latency', value: '142ms', precision: '±8ms' },
    { metric: 'Scroll Velocity', value: '890 px/s', precision: '±12ms' },
    { metric: 'Hover Duration', value: '1.8s', precision: '±0.2s' },
    { metric: 'Form Fill Time', value: '12.4s', precision: '±1.5s' },
    { metric: 'Navigation Speed', value: '3.2 pages/min', precision: '±0.3' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Activity className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Micro-Interaction Tracking</h2>
          <p className="text-sm text-gray-600">Millisecond precision behavioral analysis</p>
        </div>
      </div>
      {/* Interaction Types */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {interactions?.map((interaction, idx) => {
          const Icon = interaction?.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-lg border border-gray-200 ${interaction?.bgColor} hover:shadow-md transition-all`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-5 h-5 ${interaction?.color}`} />
                <span className="font-semibold text-gray-900">{interaction?.type}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-gray-600 text-xs">Count</div>
                  <div className="font-bold text-gray-900">{interaction?.count}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Avg Duration</div>
                  <div className="font-bold text-gray-900">{interaction?.avgDuration}</div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-300">
                <span className="text-xs text-gray-600">Pattern: </span>
                <span className={`text-xs font-medium ${interaction?.color}`}>
                  {interaction?.pattern}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Detailed Metrics with Precision */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Millisecond Precision Timing
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {detailedMetrics?.map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item?.metric}</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{item?.value}</div>
                  <div className="text-xs text-gray-500">{item?.precision}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Behavioral Cohort Analysis */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <h4 className="font-semibold text-indigo-900 mb-3 text-sm">
          Behavioral Cohort Analysis
        </h4>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-indigo-700 font-medium">Power Users</div>
            <div className="text-indigo-900 font-bold">1,245</div>
            <div className="text-xs text-indigo-600">Fast interactions</div>
          </div>
          <div>
            <div className="text-indigo-700 font-medium">Casual Users</div>
            <div className="text-indigo-900 font-bold">1,892</div>
            <div className="text-xs text-indigo-600">Moderate pace</div>
          </div>
          <div>
            <div className="text-indigo-700 font-medium">New Users</div>
            <div className="text-indigo-900 font-bold">110</div>
            <div className="text-xs text-indigo-600">Exploratory</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroInteractionPanel;