import React from 'react';


const PerformanceMetricsPanel = () => {
  const coreWebVitals = [
    { metric: 'Largest Contentful Paint (LCP)', value: '1.8s', target: '< 2.5s', status: 'good' },
    { metric: 'First Input Delay (FID)', value: '45ms', target: '< 100ms', status: 'good' },
    { metric: 'Cumulative Layout Shift (CLS)', value: '0.08', target: '< 0.1', status: 'good' },
    { metric: 'Time to Interactive (TTI)', value: '2.3s', target: '< 3.8s', status: 'good' }
  ];

  const getStatusColor = (status) => {
    if (status === 'good') return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (status === 'needs-improvement') return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Performance Metrics & Core Web Vitals
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Real-time performance monitoring with Core Web Vitals tracking
      </p>

      {/* Core Web Vitals */}
      <div className="space-y-4">
        {coreWebVitals?.map((vital, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{vital?.metric}</h3>
              <span className={`text-sm font-semibold px-3 py-1 rounded ${getStatusColor(vital?.status)}`}>
                {vital?.status?.toUpperCase()?.replace('-', ' ')}
              </span>
            </div>
            <div className="flex items-end gap-4">
              <div className="text-3xl font-bold text-blue-600">{vital?.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Target: {vital?.target}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Score */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Overall Performance Score
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Based on Core Web Vitals and mobile optimization metrics
            </p>
          </div>
          <div className="text-6xl font-bold text-green-600">92</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsPanel;