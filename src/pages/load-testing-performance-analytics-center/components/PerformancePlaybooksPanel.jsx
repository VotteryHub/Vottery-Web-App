import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const OPTIMIZATION_PLAYBOOKS = {
  high_load_time: {
    label: 'High load time',
    icon: 'Clock',
    items: [
      { title: 'Use Lazy Loading', description: 'Split code with React.lazy() and Suspense for route-level code splitting. Reduces initial bundle by 40-60%.' },
      { title: 'Reduce Bundle Size', description: 'Analyze bundle with vite-bundle-visualizer, remove unused dependencies, and tree-shake imports.' },
      { title: 'Cache API Responses', description: 'Implement React Query or SWR for automatic caching and deduplication. Eliminates redundant network calls.' },
      { title: 'Preload Critical Resources', description: 'Add <link rel="preload"> for fonts and critical CSS. Use prefetch for next-route assets.' },
    ],
  },
  high_memory: {
    label: 'High memory',
    icon: 'Cpu',
    items: [
      { title: 'Fix Memory Leaks', description: 'Clean up useEffect subscriptions, event listeners, and timers on unmount. Use AbortController for fetch calls.' },
      { title: 'Virtualize Long Lists', description: 'Use react-window or react-virtual for lists with 100+ items. Reduces DOM nodes by 90%.' },
      { title: 'Optimize Images', description: 'Use WebP format, lazy loading, and appropriate srcset for responsive images. Reduces memory by 30-50%.' },
      { title: 'Memoize Expensive Computations', description: 'Use useMemo and useCallback to prevent unnecessary re-renders and recalculations.' },
    ],
  },
  high_network: {
    label: 'High network requests',
    icon: 'Globe',
    items: [
      { title: 'Batch API Requests', description: 'Combine multiple Supabase queries into single Promise.all() calls. Reduces round trips by 60-80%.' },
      { title: 'Implement Pagination', description: 'Load data in pages instead of fetching all records at once. Use cursor-based pagination for large datasets.' },
      { title: 'Use Supabase Realtime Selectively', description: 'Only subscribe to realtime updates for critical data. Unsubscribe when component unmounts.' },
      { title: 'Enable HTTP/2 Multiplexing', description: 'Ensure CDN and API server support HTTP/2 to parallelize requests over single connection.' },
    ],
  },
};

const PerformancePlaybooksPanel = () => {
  const [expandedCategory, setExpandedCategory] = useState('high_load_time');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Per-screen performance playbooks</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Optimization steps by bottleneck type. Use these when Per-Screen Metrics flag high load time, memory, or network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Object.entries(OPTIMIZATION_PLAYBOOKS).map(([key, { label, icon, items }]) => (
          <div
            key={key}
            className={`rounded-xl border-2 transition-all ${
              expandedCategory === key
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <button
              type="button"
              onClick={() => setExpandedCategory((prev) => (prev === key ? null : key))}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <Icon name={icon} size={20} className="text-primary flex-shrink-0" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">{label}</span>
              <Icon name={expandedCategory === key ? 'ChevronUp' : 'ChevronDown'} size={16} className="ml-auto text-gray-500" />
            </button>
            {expandedCategory === key && (
              <div className="px-4 pb-4 space-y-3">
                {items.map((play, i) => (
                  <div key={i} className="pl-7 pr-2 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{play.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{play.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformancePlaybooksPanel;
