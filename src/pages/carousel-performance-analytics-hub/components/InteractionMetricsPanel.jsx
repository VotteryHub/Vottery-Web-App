import React from 'react';
import Icon from '../../../components/AppIcon';

const InteractionMetricsPanel = ({ interactionMetrics }) => {
  return (
    <div className="space-y-6">
      {/* Horizontal Snap Metrics */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="ArrowLeftRight" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Horizontal Snap Carousel</h2>
            <p className="text-sm text-muted-foreground">Swipe counts, snap events, and dwell time analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <Icon name="MousePointer" size={24} className="text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{interactionMetrics?.horizontal?.swipes?.toLocaleString()}</div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Swipes</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Last 24 hours</p>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <Icon name="Target" size={24} className="text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{interactionMetrics?.horizontal?.snaps?.toLocaleString()}</div>
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Snap Events</p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Card-to-center snaps</p>
          </div>

          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <Icon name="Clock" size={24} className="text-green-600 dark:text-green-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{interactionMetrics?.horizontal?.dwellTime}s</div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">Avg Dwell Time</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">Per content item</p>
          </div>

          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <Icon name="MousePointerClick" size={24} className="text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{interactionMetrics?.horizontal?.clickThrough}%</div>
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Click-Through Rate</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">Card engagement</p>
          </div>
        </div>
      </div>
      {/* Vertical Stack Metrics */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Layers" size={24} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Vertical Stack Carousel</h2>
            <p className="text-sm text-muted-foreground">Swipe direction analysis and conversion tracking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="ArrowLeft" size={32} className="text-red-600 dark:text-red-400" />
              <div>
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">{interactionMetrics?.vertical?.leftSwipes?.toLocaleString()}</h3>
                <p className="text-sm font-medium text-red-900 dark:text-red-100">Left Swipes (Skip)</p>
              </div>
            </div>
            <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-red-500"
                style={{ width: `${(interactionMetrics?.vertical?.leftSwipes / interactionMetrics?.vertical?.swipes * 100)?.toFixed(0)}%` }}
              />
            </div>
            <p className="text-xs text-red-700 dark:text-red-300 mt-2">
              {(interactionMetrics?.vertical?.leftSwipes / interactionMetrics?.vertical?.swipes * 100)?.toFixed(1)}% of total swipes
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="ArrowRight" size={32} className="text-green-600 dark:text-green-400" />
              <div>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">{interactionMetrics?.vertical?.rightSwipes?.toLocaleString()}</h3>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">Right Swipes (Accept)</p>
              </div>
            </div>
            <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${(interactionMetrics?.vertical?.rightSwipes / interactionMetrics?.vertical?.swipes * 100)?.toFixed(0)}%` }}
              />
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
              {(interactionMetrics?.vertical?.rightSwipes / interactionMetrics?.vertical?.swipes * 100)?.toFixed(1)}% of total swipes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{interactionMetrics?.vertical?.swipes?.toLocaleString()}</div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Swipes</p>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{interactionMetrics?.vertical?.dwellTime}s</div>
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Avg Dwell Time</p>
          </div>

          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{interactionMetrics?.vertical?.conversionRate}%</div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">Conversion Rate</p>
          </div>
        </div>
      </div>
      {/* Gradient Flow Metrics */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Waves" size={24} className="text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gradient Flow Carousel</h2>
            <p className="text-sm text-muted-foreground">Scroll behavior and blob interaction metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <Icon name="Move" size={24} className="text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{interactionMetrics?.gradient?.scrolls?.toLocaleString()}</div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Scroll Events</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Viscous scroll interactions</p>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <Icon name="MousePointerClick" size={24} className="text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{interactionMetrics?.gradient?.blobClicks?.toLocaleString()}</div>
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Blob Clicks</p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Direct blob interactions</p>
          </div>

          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <Icon name="Clock" size={24} className="text-green-600 dark:text-green-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{interactionMetrics?.gradient?.dwellTime}s</div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">Avg Dwell Time</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">Per blob focus</p>
          </div>

          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <Icon name="TrendingUp" size={24} className="text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{interactionMetrics?.gradient?.engagement}%</div>
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Engagement Rate</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">Overall interaction</p>
          </div>
        </div>
      </div>
      {/* User Engagement Patterns */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">User Engagement Patterns</h3>
            <p className="text-sm text-muted-foreground">Demographic segmentation and behavior analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">By Time of Day</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Morning (6AM-12PM)</span>
                <span className="text-sm font-bold text-primary">28%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Afternoon (12PM-6PM)</span>
                <span className="text-sm font-bold text-primary">35%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Evening (6PM-12AM)</span>
                <span className="text-sm font-bold text-primary">37%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">By User Type</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Power Users</span>
                <span className="text-sm font-bold text-primary">45%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Regular Users</span>
                <span className="text-sm font-bold text-primary">38%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">New Users</span>
                <span className="text-sm font-bold text-primary">17%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">By Device</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Mobile</span>
                <span className="text-sm font-bold text-primary">72%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Tablet</span>
                <span className="text-sm font-bold text-primary">18%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                <span className="text-sm text-foreground">Desktop</span>
                <span className="text-sm font-bold text-primary">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionMetricsPanel;