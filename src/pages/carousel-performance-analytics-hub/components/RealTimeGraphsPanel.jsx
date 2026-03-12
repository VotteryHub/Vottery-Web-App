import React from 'react';
import Icon from '../../../components/AppIcon';

const RealTimeGraphsPanel = ({ frameRateHistory, memoryUsage }) => {
  const maxFps = 60;
  const maxMemory = memoryUsage?.length > 0 ? Math.max(...memoryUsage?.map(m => m?.memory)) : 100;

  return (
    <div className="space-y-6">
      {/* Frame Rate Stability Graph */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="LineChart" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Frame Rate Stability</h2>
            <p className="text-sm text-muted-foreground">Real-time FPS monitoring (last 60 samples)</p>
          </div>
        </div>

        <div className="relative h-64 bg-background rounded-lg border border-border p-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-2">
            <span>60fps</span>
            <span>45fps</span>
            <span>30fps</span>
            <span>15fps</span>
            <span>0fps</span>
          </div>

          {/* Graph area */}
          <div className="ml-12 h-full relative">
            {/* Target line (60fps) */}
            <div className="absolute top-0 left-0 right-0 border-t-2 border-dashed border-green-500" />
            <span className="absolute top-0 right-0 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">Target: 60fps</span>

            {/* Warning line (55fps) */}
            <div className="absolute top-[16.67%] left-0 right-0 border-t border-dashed border-yellow-500" />

            {/* Critical line (45fps) */}
            <div className="absolute top-[25%] left-0 right-0 border-t border-dashed border-red-500" />

            {/* Frame rate line */}
            <svg className="w-full h-full">
              <polyline
                points={frameRateHistory?.map((item, index) => {
                  const x = (index / (frameRateHistory?.length - 1)) * 100;
                  const y = 100 - (item?.fps / maxFps) * 100;
                  return `${x}%,${y}%`;
                })?.join(' ')}
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                className="drop-shadow-lg"
              />
            </svg>
          </div>

          {/* X-axis label */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">Time (seconds)</div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-muted-foreground">Target (60fps)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-muted-foreground">Warning (55fps)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-muted-foreground">Critical (45fps)</span>
          </div>
        </div>
      </div>
      {/* Memory Usage Graph */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="HardDrive" size={24} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Memory Usage Optimization</h2>
            <p className="text-sm text-muted-foreground">Real-time memory consumption (last 60 samples)</p>
          </div>
        </div>

        <div className="relative h-64 bg-background rounded-lg border border-border p-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-2">
            <span>{maxMemory?.toFixed(0)}MB</span>
            <span>{(maxMemory * 0.75)?.toFixed(0)}MB</span>
            <span>{(maxMemory * 0.5)?.toFixed(0)}MB</span>
            <span>{(maxMemory * 0.25)?.toFixed(0)}MB</span>
            <span>0MB</span>
          </div>

          {/* Graph area */}
          <div className="ml-16 h-full relative">
            {/* Memory usage area */}
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="memoryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <polygon
                points={`0%,100% ${memoryUsage?.map((item, index) => {
                  const x = (index / (memoryUsage?.length - 1)) * 100;
                  const y = 100 - (item?.memory / maxMemory) * 100;
                  return `${x}%,${y}%`;
                })?.join(' ')} 100%,100%`}
                fill="url(#memoryGradient)"
              />
              <polyline
                points={memoryUsage?.map((item, index) => {
                  const x = (index / (memoryUsage?.length - 1)) * 100;
                  const y = 100 - (item?.memory / maxMemory) * 100;
                  return `${x}%,${y}%`;
                })?.join(' ')}
                fill="none"
                stroke="rgb(168, 85, 247)"
                strokeWidth="2"
                className="drop-shadow-lg"
              />
            </svg>
          </div>

          {/* X-axis label */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">Time (seconds)</div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {memoryUsage?.length > 0 ? memoryUsage?.[memoryUsage?.length - 1]?.memory?.toFixed(1) : 0}MB
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">Current Usage</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {memoryUsage?.length > 0 ? (memoryUsage?.reduce((sum, m) => sum + m?.memory, 0) / memoryUsage?.length)?.toFixed(1) : 0}MB
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">Average Usage</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">Optimized</div>
            <p className="text-xs text-green-700 dark:text-green-300">Memory Status</p>
          </div>
        </div>
      </div>
      {/* Scroll Physics Performance */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Gauge" size={24} className="text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Scroll Physics Performance</h2>
            <p className="text-sm text-muted-foreground">Viscous scroll and snap physics metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="ArrowLeftRight" size={24} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-blue-900 dark:text-blue-100">Horizontal Snap</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 dark:text-blue-300">Snap Latency</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">12ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 dark:text-blue-300">Spring Stiffness</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">400</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 dark:text-blue-300">Damping</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">35</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Layers" size={24} className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-purple-900 dark:text-purple-100">Vertical Stack</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 dark:text-purple-300">Swipe Latency</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">8ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 dark:text-purple-300">Exit Animation</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">300ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 dark:text-purple-300">Stack Offset</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">15px</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Waves" size={24} className="text-green-600 dark:text-green-400" />
              <h3 className="font-bold text-green-900 dark:text-green-100">Gradient Flow</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-300">Scroll Latency</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">10ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-300">Viscous Mass</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">2.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-300">Damping</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">40</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Exportable Reports */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Download" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Exportable Performance Reports</h3>
            <p className="text-sm text-muted-foreground">Download comprehensive analytics data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:bg-muted transition-colors duration-200">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={20} className="text-primary" />
              <div className="text-left">
                <p className="font-semibold text-foreground">CSV Export</p>
                <p className="text-xs text-muted-foreground">Raw performance data</p>
              </div>
            </div>
            <Icon name="Download" size={16} className="text-muted-foreground" />
          </button>

          <button className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:bg-muted transition-colors duration-200">
            <div className="flex items-center gap-3">
              <Icon name="FileJson" size={20} className="text-secondary" />
              <div className="text-left">
                <p className="font-semibold text-foreground">JSON Export</p>
                <p className="text-xs text-muted-foreground">Structured analytics</p>
              </div>
            </div>
            <Icon name="Download" size={16} className="text-muted-foreground" />
          </button>

          <button className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:bg-muted transition-colors duration-200">
            <div className="flex items-center gap-3">
              <Icon name="FileSpreadsheet" size={20} className="text-accent" />
              <div className="text-left">
                <p className="font-semibold text-foreground">PDF Report</p>
                <p className="text-xs text-muted-foreground">Executive summary</p>
              </div>
            </div>
            <Icon name="Download" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeGraphsPanel;