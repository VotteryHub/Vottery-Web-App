import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import { adSlotManagerService } from '../../services/adSlotManagerService';

const AdSlotManagerInventoryControlCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [fillRateMetrics, setFillRateMetrics] = useState(null);
  const [revenueAttribution, setRevenueAttribution] = useState(null);
  const [conflicts, setConflicts] = useState(null);
  const [waterfallPerformance, setWaterfallPerformance] = useState(null);
  const [inventoryAvailability, setInventoryAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh every 30 seconds
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadDashboardData();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [fillRate, revenue, conflictData, waterfall, inventory] = await Promise.all([
        adSlotManagerService?.getFillRateMetrics(),
        adSlotManagerService?.getRevenueAttribution(),
        adSlotManagerService?.detectConflicts(),
        adSlotManagerService?.getWaterfallPerformance(),
        adSlotManagerService?.getInventoryAvailability()
      ]);

      setFillRateMetrics(fillRate);
      setRevenueAttribution(revenue);
      setConflicts(conflictData);
      setWaterfallPerformance(waterfall);
      setInventoryAvailability(inventory);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'waterfall', label: 'Waterfall Logic', icon: 'GitBranch' },
    { id: 'inventory', label: 'Inventory', icon: 'Package' },
    { id: 'conflicts', label: 'Conflict Prevention', icon: 'Shield' },
    { id: 'revenue', label: 'Revenue Attribution', icon: 'DollarSign' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  return (
    <>
      <Helmet>
        <title>Ad Slot Manager & Inventory Control Center | Vottery</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  Ad Slot Manager & Inventory Control Center
                </h1>
                <p className="text-sm text-muted-foreground">
                  Intelligent slot allocation with waterfall logic prioritizing internal participatory ads and Google AdSense fallback
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    autoRefresh
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Icon name={autoRefresh ? 'RefreshCw' : 'Pause'} size={16} />
                  <span className="text-sm font-medium">
                    {autoRefresh ? 'Auto-Refresh: 30s' : 'Paused'}
                  </span>
                </button>
                <button
                  onClick={loadDashboardData}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
                >
                  <Icon name="RefreshCcw" size={16} />
                  <span className="text-sm font-medium">Refresh Now</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span className="text-sm font-medium">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader2" size={32} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardPanel
                  fillRateMetrics={fillRateMetrics}
                  revenueAttribution={revenueAttribution}
                  conflicts={conflicts}
                  inventoryAvailability={inventoryAvailability}
                />
              )}
              {activeTab === 'waterfall' && (
                <WaterfallLogicPanel waterfallPerformance={waterfallPerformance} />
              )}
              {activeTab === 'inventory' && (
                <InventoryManagementPanel
                  inventoryAvailability={inventoryAvailability}
                  fillRateMetrics={fillRateMetrics}
                />
              )}
              {activeTab === 'conflicts' && (
                <ConflictPreventionPanel conflicts={conflicts} />
              )}
              {activeTab === 'revenue' && (
                <RevenueAttributionPanel revenueAttribution={revenueAttribution} />
              )}
              {activeTab === 'analytics' && (
                <AnalyticsPanel
                  fillRateMetrics={fillRateMetrics}
                  revenueAttribution={revenueAttribution}
                  waterfallPerformance={waterfallPerformance}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Dashboard Panel
const DashboardPanel = ({ fillRateMetrics, revenueAttribution, conflicts, inventoryAvailability }) => (
  <div className="space-y-6">
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon name="Target" size={24} className="text-primary" />
          <span className="text-2xl font-bold text-primary">
            {fillRateMetrics?.overall?.fillRate}%
          </span>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Overall Fill Rate</h3>
        <p className="text-xs text-muted-foreground">
          {fillRateMetrics?.overall?.filledSlots?.toLocaleString()} / {fillRateMetrics?.overall?.totalSlots?.toLocaleString()} slots filled
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon name="TrendingUp" size={24} className="text-accent" />
          <span className="text-2xl font-bold text-accent">
            {fillRateMetrics?.overall?.participatoryFillRate}%
          </span>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Participatory Ads</h3>
        <p className="text-xs text-muted-foreground">
          {fillRateMetrics?.overall?.participatoryFilled?.toLocaleString()} slots (Primary Revenue)
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon name="ExternalLink" size={24} className="text-secondary" />
          <span className="text-2xl font-bold text-secondary">
            {fillRateMetrics?.overall?.adsenseFillRate}%
          </span>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">AdSense Fallback</h3>
        <p className="text-xs text-muted-foreground">
          {fillRateMetrics?.overall?.adsenseFilled?.toLocaleString()} slots (Secondary Revenue)
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon name="DollarSign" size={24} className="text-green-500" />
          <span className="text-2xl font-bold text-green-500">
            ${revenueAttribution?.total?.revenue?.toLocaleString()}
          </span>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Revenue (24h)</h3>
        <p className="text-xs text-muted-foreground">
          {revenueAttribution?.total?.participatoryShare}% Internal / {revenueAttribution?.total?.adsenseShare}% External
        </p>
      </div>
    </div>

    {/* System Status */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Activity" size={20} />
        Dual-System Orchestration Status
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={20} className="text-green-500" />
            <span className="font-medium text-green-500">Waterfall Active</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Internal ads prioritized, AdSense fallback operational
          </p>
        </div>

        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Shield" size={20} className="text-green-500" />
            <span className="font-medium text-green-500">No Conflicts</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {conflicts?.totalConflicts || 0} conflicts detected, {conflicts?.resolvedConflicts || 0} resolved
          </p>
        </div>

        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Package" size={20} className="text-blue-500" />
            <span className="font-medium text-blue-500">Inventory Healthy</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {inventoryAvailability?.utilizationRate}% utilization, {inventoryAvailability?.availableSlots} slots available
          </p>
        </div>
      </div>
    </div>

    {/* Screen Performance */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Monitor" size={20} />
        Performance by Screen
      </h2>
      <div className="space-y-3">
        {fillRateMetrics?.byScreen?.map((screen, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">{screen?.screen}</span>
              <span className="text-sm font-semibold text-primary">{screen?.fillRate}%</span>
            </div>
            <div className="flex gap-2 mb-2">
              <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${screen?.participatoryFillRate}%` }}
                />
              </div>
              <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary"
                  style={{ width: `${screen?.adsenseFillRate}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Participatory: {screen?.participatoryFilled}</span>
              <span>AdSense: {screen?.adsenseFilled}</span>
              <span>Total: {screen?.totalSlots}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Waterfall Logic Panel
const WaterfallLogicPanel = ({ waterfallPerformance }) => (
  <div className="space-y-6">
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="GitBranch" size={20} />
        Waterfall Logic Engine
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Intelligent prioritization placing internal participatory ads first with automatic AdSense fallback for unfilled inventory slots
      </p>

      <div className="space-y-4">
        {waterfallPerformance?.stages?.map((stage, index) => (
          <div key={index} className="p-6 bg-muted/50 rounded-lg border-l-4 border-primary">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{stage?.stage}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{stage?.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    stage?.priority === 'PRIMARY' ?'bg-accent/20 text-accent' :'bg-secondary/20 text-secondary'
                  }`}>
                    {stage?.priority}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{stage?.fillRate}%</div>
                <div className="text-xs text-muted-foreground">Fill Rate</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Attempts</div>
                <div className="text-lg font-semibold text-foreground">
                  {stage?.attempts?.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Filled</div>
                <div className="text-lg font-semibold text-foreground">
                  {stage?.filled?.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Avg Revenue</div>
                <div className="text-lg font-semibold text-green-500">
                  ${stage?.avgRevenue}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Efficiency Metrics */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Waterfall Efficiency</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-primary mb-1">
            {waterfallPerformance?.efficiency?.overallFillRate}%
          </div>
          <div className="text-sm text-muted-foreground">Overall Fill Rate</div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-accent mb-1">
            {waterfallPerformance?.efficiency?.avgFallbackTime}ms
          </div>
          <div className="text-sm text-muted-foreground">Avg Fallback Time</div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-green-500 mb-1">
            {waterfallPerformance?.efficiency?.successRate}%
          </div>
          <div className="text-sm text-muted-foreground">Success Rate</div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-foreground mb-1">
            {waterfallPerformance?.efficiency?.totalFilled?.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Filled</div>
        </div>
      </div>
    </div>

    {/* Optimization Recommendations */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Lightbulb" size={20} />
        Optimization Recommendations
      </h2>
      <div className="space-y-3">
        {waterfallPerformance?.optimization?.recommendedActions?.map((action, index) => (
          <div key={index} className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Icon name="ArrowRight" size={16} className="text-blue-500 mt-1" />
            <span className="text-sm text-foreground">{action}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Inventory Management Panel
const InventoryManagementPanel = ({ inventoryAvailability, fillRateMetrics }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card p-6">
        <Icon name="Package" size={24} className="text-primary mb-3" />
        <div className="text-2xl font-bold text-foreground mb-1">
          {inventoryAvailability?.totalSlots}
        </div>
        <div className="text-sm text-muted-foreground">Total Slots</div>
      </div>
      <div className="card p-6">
        <Icon name="CheckCircle" size={24} className="text-green-500 mb-3" />
        <div className="text-2xl font-bold text-foreground mb-1">
          {inventoryAvailability?.filledSlots}
        </div>
        <div className="text-sm text-muted-foreground">Filled Slots</div>
      </div>
      <div className="card p-6">
        <Icon name="Circle" size={24} className="text-muted-foreground mb-3" />
        <div className="text-2xl font-bold text-foreground mb-1">
          {inventoryAvailability?.availableSlots}
        </div>
        <div className="text-sm text-muted-foreground">Available Slots</div>
      </div>
      <div className="card p-6">
        <Icon name="TrendingUp" size={24} className="text-accent mb-3" />
        <div className="text-2xl font-bold text-foreground mb-1">
          {inventoryAvailability?.utilizationRate}%
        </div>
        <div className="text-sm text-muted-foreground">Utilization Rate</div>
      </div>
    </div>

    {/* Inventory by Screen */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Inventory by Screen</h2>
      <div className="space-y-3">
        {inventoryAvailability?.byScreen?.map((screen, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-foreground">{screen?.screen}</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-green-500">{screen?.filled} filled</span>
                <span className="text-muted-foreground">{screen?.available} available</span>
                <span className="text-foreground font-semibold">{screen?.total} total</span>
              </div>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${(screen?.filled / screen?.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Forecast */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="TrendingUp" size={20} />
        Inventory Forecast
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { period: 'Next 1 Hour', data: inventoryAvailability?.forecast?.next1h },
          { period: 'Next 6 Hours', data: inventoryAvailability?.forecast?.next6h },
          { period: 'Next 24 Hours', data: inventoryAvailability?.forecast?.next24h }
        ]?.map((forecast, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium text-foreground mb-3">{forecast?.period}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Available Slots</span>
                <span className="font-semibold text-foreground">{forecast?.data?.availableSlots}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Demand Score</span>
                <span className="font-semibold text-primary">{forecast?.data?.demandScore}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Conflict Prevention Panel
const ConflictPreventionPanel = ({ conflicts }) => (
  <div className="space-y-6">
    <div className="card p-6 bg-green-500/10 border-green-500/20">
      <div className="flex items-center gap-3 mb-4">
        <Icon name="ShieldCheck" size={32} className="text-green-500" />
        <div>
          <h2 className="text-xl font-bold text-green-500">System Coordination Active</h2>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring preventing conflicts between participatory ads and AdSense
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-background rounded-lg">
          <div className="text-3xl font-bold text-green-500 mb-1">
            {conflicts?.preventionRate}%
          </div>
          <div className="text-sm text-muted-foreground">Prevention Rate</div>
        </div>
        <div className="p-4 bg-background rounded-lg">
          <div className="text-3xl font-bold text-foreground mb-1">
            {conflicts?.resolvedConflicts}
          </div>
          <div className="text-sm text-muted-foreground">Resolved Conflicts</div>
        </div>
        <div className="p-4 bg-background rounded-lg">
          <div className="text-3xl font-bold text-foreground mb-1">
            {conflicts?.activeConflicts}
          </div>
          <div className="text-sm text-muted-foreground">Active Conflicts</div>
        </div>
      </div>
    </div>

    {/* Conflict Types */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Conflict Detection by Type</h2>
      <div className="space-y-3">
        {conflicts?.conflictTypes?.map((type, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">{type?.type}</span>
              <span className={`text-xs px-3 py-1 rounded-full ${
                type?.status === 'resolved' ?'bg-green-500/20 text-green-500' :'bg-yellow-500/20 text-yellow-500'
              }`}>
                {type?.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Detected</span>
              <span className="font-semibold text-foreground">{type?.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Automated Resolution Protocols */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Zap" size={20} />
        Automated Resolution Protocols
      </h2>
      <div className="space-y-3">
        {[
          {
            protocol: 'Duplicate Placement Detection',
            description: 'Prevents same ad from appearing in multiple slots simultaneously',
            status: 'active'
          },
          {
            protocol: 'Priority Enforcement',
            description: 'Ensures internal participatory ads always take precedence over AdSense',
            status: 'active'
          },
          {
            protocol: 'Slot Overlap Prevention',
            description: 'Detects and resolves visual overlap between ad placements',
            status: 'active'
          },
          {
            protocol: 'Revenue Attribution Tracking',
            description: 'Accurately attributes revenue to correct advertising system',
            status: 'active'
          }
        ]?.map((protocol, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">{protocol?.protocol}</span>
              <Icon name="CheckCircle" size={16} className="text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">{protocol?.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Revenue Attribution Panel
const RevenueAttributionPanel = ({ revenueAttribution }) => (
  <div className="space-y-6">
    {/* Total Revenue */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Revenue Attribution (24h)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
          <div className="text-3xl font-bold text-green-500 mb-2">
            ${revenueAttribution?.total?.revenue?.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Revenue</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20">
          <div className="text-3xl font-bold text-accent mb-2">
            ${revenueAttribution?.total?.participatoryRevenue?.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Participatory Ads ({revenueAttribution?.total?.participatoryShare}%)</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg border border-secondary/20">
          <div className="text-3xl font-bold text-secondary mb-2">
            ${revenueAttribution?.total?.adsenseRevenue?.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">AdSense ({revenueAttribution?.total?.adsenseShare}%)</div>
        </div>
      </div>
    </div>

    {/* Revenue by Screen */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Revenue by Screen</h2>
      <div className="space-y-4">
        {revenueAttribution?.byScreen?.map((screen, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-foreground">{screen?.screen}</span>
              <span className="text-lg font-bold text-green-500">
                ${screen?.totalRevenue?.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Participatory</div>
                <div className="text-base font-semibold text-accent">
                  ${screen?.participatoryRevenue?.toLocaleString()} ({screen?.participatoryShare}%)
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">AdSense</div>
                <div className="text-base font-semibold text-secondary">
                  ${screen?.adsenseRevenue?.toLocaleString()} ({screen?.adsenseShare}%)
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div
                className="h-2 bg-accent rounded-full"
                style={{ width: `${screen?.participatoryShare}%` }}
              />
              <div
                className="h-2 bg-secondary rounded-full"
                style={{ width: `${screen?.adsenseShare}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Revenue Trend */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Revenue Trend (24h)</h2>
      <div className="space-y-3">
        {revenueAttribution?.trend?.map((point, index) => (
          <div key={index} className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-16">{point?.hour}</span>
            <div className="flex-1 flex gap-2">
              <div
                className="h-8 bg-accent rounded flex items-center justify-end px-2"
                style={{ width: `${(point?.participatory / 2500) * 100}%` }}
              >
                <span className="text-xs text-white font-medium">${point?.participatory}</span>
              </div>
              <div
                className="h-8 bg-secondary rounded flex items-center justify-end px-2"
                style={{ width: `${(point?.adsense / 2500) * 100}%` }}
              >
                <span className="text-xs text-white font-medium">${point?.adsense}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Analytics Panel
const AnalyticsPanel = ({ fillRateMetrics, revenueAttribution, waterfallPerformance }) => (
  <div className="space-y-6">
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-primary mb-1">
            {fillRateMetrics?.overall?.fillRate}%
          </div>
          <div className="text-sm text-muted-foreground">Overall Fill Rate</div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-accent mb-1">
            {waterfallPerformance?.efficiency?.avgFallbackTime}ms
          </div>
          <div className="text-sm text-muted-foreground">Avg Fallback Time</div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-green-500 mb-1">
            ${revenueAttribution?.total?.revenue?.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Revenue</div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-secondary mb-1">
            {revenueAttribution?.total?.participatoryShare}%
          </div>
          <div className="text-sm text-muted-foreground">Internal Revenue Share</div>
        </div>
      </div>
    </div>

    {/* Slot Type Performance */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Performance by Slot Type</h2>
      <div className="space-y-3">
        {fillRateMetrics?.bySlotType?.map((slotType, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-foreground capitalize">{slotType?.type}</span>
              <span className="text-lg font-bold text-primary">{slotType?.fillRate}%</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Participatory Share</div>
                <div className="text-base font-semibold text-accent">{slotType?.participatoryShare}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">AdSense Share</div>
                <div className="text-base font-semibold text-secondary">{slotType?.adsenseShare}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdSlotManagerInventoryControlCenter;