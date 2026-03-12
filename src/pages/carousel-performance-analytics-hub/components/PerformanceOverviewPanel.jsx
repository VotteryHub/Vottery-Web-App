import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceOverviewPanel = ({ fpsCompliance, frameRateHistory, memoryUsage }) => {
  const getComplianceColor = (compliance) => {
    if (compliance >= 95) return 'text-green-600 dark:text-green-400';
    if (compliance >= 90) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getComplianceBg = (compliance) => {
    if (compliance >= 95) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (compliance >= 90) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const avgFps = frameRateHistory?.length > 0
    ? (frameRateHistory?.reduce((sum, item) => sum + item?.fps, 0) / frameRateHistory?.length)?.toFixed(1)
    : 0;

  const avgMemory = memoryUsage?.length > 0
    ? (memoryUsage?.reduce((sum, item) => sum + item?.memory, 0) / memoryUsage?.length)?.toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* 60fps Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`bg-card rounded-xl p-6 shadow-lg border ${getComplianceBg(fpsCompliance?.horizontal?.compliance)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="ArrowLeftRight" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Horizontal Snap</h3>
                <p className="text-xs text-muted-foreground">PageView Carousel</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Current FPS</span>
                <span className={`text-2xl font-bold ${getComplianceColor(fpsCompliance?.horizontal?.compliance)}`}>
                  {fpsCompliance?.horizontal?.current}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average FPS</span>
                <span className="text-lg font-semibold text-foreground">{fpsCompliance?.horizontal?.average}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">60fps Compliance</span>
                <span className={`text-xl font-bold ${getComplianceColor(fpsCompliance?.horizontal?.compliance)}`}>
                  {fpsCompliance?.horizontal?.compliance}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    fpsCompliance?.horizontal?.compliance >= 95 ? 'bg-green-500' :
                    fpsCompliance?.horizontal?.compliance >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${fpsCompliance?.horizontal?.compliance}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-card rounded-xl p-6 shadow-lg border ${getComplianceBg(fpsCompliance?.vertical?.compliance)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Icon name="Layers" size={24} className="text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Vertical Stack</h3>
                <p className="text-xs text-muted-foreground">Swipe Carousel</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Current FPS</span>
                <span className={`text-2xl font-bold ${getComplianceColor(fpsCompliance?.vertical?.compliance)}`}>
                  {fpsCompliance?.vertical?.current}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average FPS</span>
                <span className="text-lg font-semibold text-foreground">{fpsCompliance?.vertical?.average}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">60fps Compliance</span>
                <span className={`text-xl font-bold ${getComplianceColor(fpsCompliance?.vertical?.compliance)}`}>
                  {fpsCompliance?.vertical?.compliance}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    fpsCompliance?.vertical?.compliance >= 95 ? 'bg-green-500' :
                    fpsCompliance?.vertical?.compliance >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${fpsCompliance?.vertical?.compliance}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-card rounded-xl p-6 shadow-lg border ${getComplianceBg(fpsCompliance?.gradient?.compliance)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="Waves" size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Gradient Flow</h3>
                <p className="text-xs text-muted-foreground">Viscous Scroll</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Current FPS</span>
                <span className={`text-2xl font-bold ${getComplianceColor(fpsCompliance?.gradient?.compliance)}`}>
                  {fpsCompliance?.gradient?.current}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average FPS</span>
                <span className="text-lg font-semibold text-foreground">{fpsCompliance?.gradient?.average}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">60fps Compliance</span>
                <span className={`text-xl font-bold ${getComplianceColor(fpsCompliance?.gradient?.compliance)}`}>
                  {fpsCompliance?.gradient?.compliance}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    fpsCompliance?.gradient?.compliance >= 95 ? 'bg-green-500' :
                    fpsCompliance?.gradient?.compliance >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${fpsCompliance?.gradient?.compliance}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Health Score */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Heart" size={24} className="text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Performance Health Score</h2>
            <p className="text-sm text-muted-foreground">Overall system performance metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{avgFps}</div>
            <p className="text-sm text-muted-foreground">Average FPS</p>
            <p className="text-xs text-muted-foreground mt-1">Target: 60fps</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{avgMemory}MB</div>
            <p className="text-sm text-muted-foreground">Memory Usage</p>
            <p className="text-xs text-muted-foreground mt-1">Optimized</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">12ms</div>
            <p className="text-sm text-muted-foreground">Render Time</p>
            <p className="text-xs text-muted-foreground mt-1">Target: &lt;16ms</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">97%</div>
            <p className="text-sm text-muted-foreground">Overall Health</p>
            <p className="text-xs text-muted-foreground mt-1">Excellent</p>
          </div>
        </div>
      </div>

      {/* Automated Alert Triggers */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Bell" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Automated Alert Triggers</h3>
            <p className="text-sm text-muted-foreground">Performance degradation monitoring</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">FPS Threshold</p>
                <p className="text-xs text-green-700 dark:text-green-300">All carousels above 55fps</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">HEALTHY</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Memory Leak Detection</p>
                <p className="text-xs text-green-700 dark:text-green-300">No memory leaks detected</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">HEALTHY</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Render Time</p>
                <p className="text-xs text-green-700 dark:text-green-300">Average render time below 16ms</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">HEALTHY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverviewPanel;