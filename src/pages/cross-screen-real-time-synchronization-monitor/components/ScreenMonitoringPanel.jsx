import React, { useState } from 'react';
import { Monitor, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';

const ScreenMonitoringPanel = ({ screenData, onManualSync }) => {
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredScreens = screenData?.filter(screen => {
    if (filter === 'all') return true;
    if (filter === 'healthy') return screen?.status === 'active' && screen?.conflictCount === 0;
    if (filter === 'conflicts') return screen?.conflictCount > 0;
    return true;
  });

  const getStatusColor = (screen) => {
    if (screen?.conflictCount > 5) return 'text-red-600 bg-red-50 border-red-200';
    if (screen?.conflictCount > 0) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusIcon = (screen) => {
    if (screen?.conflictCount > 5) return <AlertTriangle className="w-4 h-4" />;
    if (screen?.conflictCount > 0) return <AlertTriangle className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Monitor className="w-6 h-6 text-blue-600" />
          Screen-by-Screen Monitoring
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              filter === 'all' ?'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('healthy')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              filter === 'healthy' ?'bg-green-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Healthy
          </button>
          <button
            onClick={() => setFilter('conflicts')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              filter === 'conflicts' ?'bg-orange-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Conflicts
          </button>
        </div>
      </div>
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {filteredScreens?.map((screen, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${
              selectedScreen === screen?.screenName ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedScreen(screen?.screenName)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${getStatusColor(screen)}`}>
                  {getStatusIcon(screen)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{screen?.screenName}</h3>
                  <p className="text-xs text-gray-500">
                    Last update: {new Date(screen?.lastUpdate)?.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  onManualSync?.(screen?.screenName);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                title="Manual Sync"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-600 mb-1">Updates</p>
                <p className="text-sm font-bold text-gray-900">{screen?.updateCount}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-600 mb-1">Conflicts</p>
                <p className="text-sm font-bold text-gray-900">{screen?.conflictCount}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-600 mb-1">Latency</p>
                <p className="text-sm font-bold text-gray-900">{screen?.averageLatency?.toFixed(0)}ms</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Consistency Score</span>
                <span className="text-xs font-bold text-gray-900">{screen?.consistencyScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    screen?.consistencyScore >= 95
                      ? 'bg-green-500'
                      : screen?.consistencyScore >= 80
                      ? 'bg-orange-500' :'bg-red-500'
                  }`}
                  style={{ width: `${screen?.consistencyScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredScreens?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Monitor className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No screens match the selected filter</p>
        </div>
      )}
    </div>
  );
};

export default ScreenMonitoringPanel;