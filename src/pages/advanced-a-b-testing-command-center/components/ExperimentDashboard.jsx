import React from 'react';
import { Pause, CheckCircle, AlertCircle, Users, Target, Clock } from 'lucide-react';

const ExperimentDashboard = ({ experiments = [], onRefresh }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getSignificanceColor = (significance) => {
    if (significance >= 95) return 'text-green-600 dark:text-green-400';
    if (significance >= 90) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Active Experiments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Active Experiments
            </h2>
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Refresh Data
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {experiments?.filter(exp => exp?.status === 'active')?.map((experiment) => (
              <div
                key={experiment?.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {experiment?.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(experiment?.status)}`}>
                        {experiment?.status?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Started {experiment?.startDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {experiment?.sampleSize?.toLocaleString()} samples
                      </span>
                    </div>
                  </div>
                  {experiment?.winner && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        Winner: {experiment?.winner}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Variants</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{experiment?.variants}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Traffic Allocation</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{experiment?.traffic}%</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conversions</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{experiment?.conversions}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Significance</div>
                    <div className={`text-2xl font-bold ${getSignificanceColor(experiment?.significance)}`}>
                      {experiment?.significance}%
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                    Pause Test
                  </button>
                  {experiment?.significance >= 95 && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Declare Winner
                    </button>
                  )}
                </div>
              </div>
            ))}

            {experiments?.filter(exp => exp?.status === 'active')?.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No active experiments</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Completed Experiments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Completed Experiments
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {experiments?.filter(exp => exp?.status === 'completed')?.map((experiment) => (
              <div
                key={experiment?.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{experiment?.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Winner: {experiment?.winner} • {experiment?.conversions} conversions • {experiment?.significance}% confidence
                    </p>
                  </div>
                  <button className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm font-medium">
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentDashboard;