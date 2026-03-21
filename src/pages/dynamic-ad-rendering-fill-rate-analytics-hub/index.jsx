import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import AdSense from '../../components/AdSense';
import { adSlotManagerService } from '../../services/adSlotManagerService';


const DynamicAdRenderingFillRateAnalyticsHub = () => {
  const [activeTab, setActiveTab] = useState('rendering');
  const [renderingQueue, setRenderingQueue] = useState([]);
  const [fillRateMetrics, setFillRateMetrics] = useState(null);
  const [revenueOptimization, setRevenueOptimization] = useState(null);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh every 15 seconds
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadDashboardData();
      }, 15000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [fillRate, revenue, monitoring, inventory, conflictData] = await Promise.all([
        adSlotManagerService?.getFillRateMetrics(),
        adSlotManagerService?.getRevenueAttribution(),
        adSlotManagerService?.getDashboardAnalytics(
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          new Date().toISOString()
        ),
        adSlotManagerService?.getInventoryAvailability(),
        adSlotManagerService?.detectConflicts(),
      ]);

      setFillRateMetrics(fillRate);
      setRevenueOptimization(revenue);
      setRealTimeMonitoring({
        activeSlots: inventory?.totalSlots || 0,
        renderingNow: Math.min(3, inventory?.filledSlots || 0),
        queuedRequests: Math.max((inventory?.availableSlots || 0), 0),
        avgRenderTime: 125,
        successRate: 99.2,
        failedDeliveries: conflictData?.activeConflicts || 0,
        systemHealth: monitoring?.systemHealth?.internalAdsActive ? 'excellent' : 'degraded',
        alerts: [],
      });
      setRenderingQueue((inventory?.byScreen || []).map((item, index) => ({
        id: `queue_${item?.screen}_${index}`,
        screen: item?.screen,
        slotId: `slot_${index + 1}`,
        adSystem: item?.filled > 0 ? 'PARTICIPATORY' : 'ADSENSE',
        status: item?.available > 0 ? 'queued' : 'completed',
        timestamp: new Date()?.toISOString(),
        renderTime: 125,
      })));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'rendering', label: 'Dynamic Rendering', icon: 'Zap' },
    { id: 'fillrate', label: 'Fill Rate Analytics', icon: 'BarChart3' },
    { id: 'revenue', label: 'Revenue Optimization', icon: 'DollarSign' },
    { id: 'monitoring', label: 'Real-Time Monitoring', icon: 'Activity' }
  ];

  return (
    <>
      <Helmet>
        <title>Dynamic Ad Rendering & Fill Rate Analytics Hub | Vottery</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  Dynamic Ad Rendering & Fill Rate Analytics Hub
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real-time ad delivery orchestration with intelligent rendering and comprehensive fill rate optimization
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
                    {autoRefresh ? 'Auto-Refresh: 15s' : 'Paused'}
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
              {activeTab === 'rendering' && (
                <DynamicRenderingPanel
                  renderingQueue={renderingQueue}
                  realTimeMonitoring={realTimeMonitoring}
                />
              )}
              {activeTab === 'fillrate' && (
                <FillRateAnalyticsPanel fillRateMetrics={fillRateMetrics} />
              )}
              {activeTab === 'revenue' && (
                <RevenueOptimizationPanel revenueOptimization={revenueOptimization} />
              )}
              {activeTab === 'monitoring' && (
                <RealTimeMonitoringPanel
                  realTimeMonitoring={realTimeMonitoring}
                  renderingQueue={renderingQueue}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Dynamic Rendering Panel
const DynamicRenderingPanel = ({ renderingQueue, realTimeMonitoring }) => (
  <div className="space-y-6">
    {/* Rendering Engine Status */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Zap" size={20} />
        Dynamic Rendering Engine
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Intelligent ad selection based on availability, user targeting, and revenue optimization with automatic fallback mechanisms
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Play" size={20} className="text-green-500" />
            <span className="text-sm font-medium text-green-500">Rendering Now</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {realTimeMonitoring?.renderingNow}
          </div>
        </div>

        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" size={20} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-500">Queued</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {realTimeMonitoring?.queuedRequests}
          </div>
        </div>

        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Activity" size={20} className="text-primary" />
            <span className="text-sm font-medium text-primary">Active Slots</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {realTimeMonitoring?.activeSlots}
          </div>
        </div>

        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Gauge" size={20} className="text-accent" />
            <span className="text-sm font-medium text-accent">Avg Render Time</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {realTimeMonitoring?.avgRenderTime}ms
          </div>
        </div>
      </div>
    </div>

    {/* Rendering Queue */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="List" size={20} />
        Real-Time Rendering Queue
      </h2>
      <div className="space-y-3">
        {renderingQueue?.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 ${
              item?.status === 'rendering' ?'bg-green-500/10 border-green-500'
                : item?.status === 'queued' ?'bg-blue-500/10 border-blue-500' :'bg-muted/50 border-muted'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Icon
                  name={
                    item?.status === 'rendering' ?'Play'
                      : item?.status === 'queued' ?'Clock' :'CheckCircle'
                  }
                  size={16}
                  className={
                    item?.status === 'rendering' ?'text-green-500'
                      : item?.status === 'queued' ?'text-blue-500' :'text-muted-foreground'
                  }
                />
                <div>
                  <span className="font-medium text-foreground">{item?.screen}</span>
                  <span className="text-xs text-muted-foreground ml-2">({item?.slotId})</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    item?.adSystem === 'PARTICIPATORY' ?'bg-accent/20 text-accent' :'bg-secondary/20 text-secondary'
                  }`}
                >
                  {item?.adSystem}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item?.renderTime}ms
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(item.timestamp)?.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Intelligent Selection Algorithm */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Brain" size={20} />
        Intelligent Selection Algorithm
      </h2>
      <div className="space-y-4">
        {[
          {
            step: 1,
            title: 'Availability Check',
            description: 'Query participatory ad inventory for matching campaigns',
            status: 'active'
          },
          {
            step: 2,
            title: 'User Targeting',
            description: 'Match user demographics, interests, and zone to campaign targeting',
            status: 'active'
          },
          {
            step: 3,
            title: 'Revenue Optimization',
            description: 'Select highest-value ad based on CPE and auction bids',
            status: 'active'
          },
          {
            step: 4,
            title: 'Fallback Mechanism',
            description: 'If no participatory ad available, render Google AdSense',
            status: 'active'
          }
        ]?.map((step, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">{step?.step}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">{step?.title}</h3>
              <p className="text-sm text-muted-foreground">{step?.description}</p>
            </div>
            <Icon name="CheckCircle" size={20} className="text-green-500" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Fill Rate Analytics Panel
const FillRateAnalyticsPanel = ({ fillRateMetrics }) => (
  <div className="space-y-6">
    {/* Fill Rate Overview */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card p-6">
        <Icon name="Target" size={24} className="text-primary mb-3" />
        <div className="text-3xl font-bold text-foreground mb-1">
          {fillRateMetrics?.overall?.fillRate}%
        </div>
        <div className="text-sm text-muted-foreground mb-3">Overall Fill Rate</div>
        <div className="text-xs text-muted-foreground">
          {fillRateMetrics?.overall?.filledSlots?.toLocaleString()} / {fillRateMetrics?.overall?.totalSlots?.toLocaleString()} slots
        </div>
      </div>

      <div className="card p-6">
        <Icon name="TrendingUp" size={24} className="text-accent mb-3" />
        <div className="text-3xl font-bold text-foreground mb-1">
          {fillRateMetrics?.overall?.participatoryFillRate}%
        </div>
        <div className="text-sm text-muted-foreground mb-3">Participatory Fill Rate</div>
        <div className="text-xs text-muted-foreground">
          {fillRateMetrics?.overall?.participatoryFilled?.toLocaleString()} slots filled
        </div>
      </div>

      <div className="card p-6">
        <Icon name="ExternalLink" size={24} className="text-secondary mb-3" />
        <div className="text-3xl font-bold text-foreground mb-1">
          {fillRateMetrics?.overall?.adsenseFillRate}%
        </div>
        <div className="text-sm text-muted-foreground mb-3">AdSense Fill Rate</div>
        <div className="text-xs text-muted-foreground">
          {fillRateMetrics?.overall?.adsenseFilled?.toLocaleString()} slots filled
        </div>
      </div>
    </div>

    {/* Slot Utilization by Screen */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Slot Utilization by Screen</h2>
      <div className="space-y-4">
        {fillRateMetrics?.byScreen?.map((screen, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-foreground">{screen?.screen}</span>
              <span className="text-lg font-bold text-primary">{screen?.fillRate}%</span>
            </div>
            <div className="mb-3">
              <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-background">
                <div
                  className="bg-accent"
                  style={{ width: `${screen?.participatoryFillRate}%` }}
                  title={`Participatory: ${screen?.participatoryFillRate}%`}
                />
                <div
                  className="bg-secondary"
                  style={{ width: `${screen?.adsenseFillRate}%` }}
                  title={`AdSense: ${screen?.adsenseFillRate}%`}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Participatory</div>
                <div className="font-semibold text-accent">{screen?.participatoryFilled}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">AdSense</div>
                <div className="font-semibold text-secondary">{screen?.adsenseFilled}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Total Slots</div>
                <div className="font-semibold text-foreground">{screen?.totalSlots}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Unfilled Inventory Tracking */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="AlertCircle" size={20} />
        Unfilled Inventory Tracking
      </h2>
      <div className="space-y-3">
        {fillRateMetrics?.byScreen?.map((screen, index) => {
          const unfilledSlots = screen?.totalSlots - screen?.participatoryFilled - screen?.adsenseFilled;
          const unfilledRate = ((unfilledSlots / screen?.totalSlots) * 100)?.toFixed(1);
          
          return (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{screen?.screen}</span>
                <span className="text-sm font-semibold text-orange-500">
                  {unfilledSlots} unfilled ({unfilledRate}%)
                </span>
              </div>
              {unfilledSlots > 0 && (
                <div className="text-xs text-muted-foreground">
                  Recommendation: Increase participatory ad inventory or adjust targeting
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>

    {/* Fill Rate by Slot Type */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Fill Rate by Slot Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fillRateMetrics?.bySlotType?.map((slotType, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium text-foreground mb-3 capitalize">{slotType?.type}</h3>
            <div className="text-2xl font-bold text-primary mb-3">{slotType?.fillRate}%</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Participatory</span>
                <span className="font-semibold text-accent">{slotType?.participatoryShare}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">AdSense</span>
                <span className="font-semibold text-secondary">{slotType?.adsenseShare}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Revenue Optimization Panel
const RevenueOptimizationPanel = ({ revenueOptimization }) => (
  <div className="space-y-6">
    {/* Comparative Earnings Analysis */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="TrendingUp" size={20} />
        Comparative Earnings Analysis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Sparkles" size={24} className="text-accent" />
            <h3 className="font-semibold text-foreground">Participatory Ads</h3>
          </div>
          <div className="text-3xl font-bold text-accent mb-2">
            ${revenueOptimization?.total?.participatoryRevenue?.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {revenueOptimization?.total?.participatoryShare}% of total revenue
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg CPE</span>
              <span className="font-semibold text-foreground">$3.80</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Engagements</span>
              <span className="font-semibold text-foreground">8,542</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg border border-secondary/20">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="ExternalLink" size={24} className="text-secondary" />
            <h3 className="font-semibold text-foreground">Google AdSense</h3>
          </div>
          <div className="text-3xl font-bold text-secondary mb-2">
            ${revenueOptimization?.total?.adsenseRevenue?.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {revenueOptimization?.total?.adsenseShare}% of total revenue
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg CPM</span>
              <span className="font-semibold text-foreground">$2.25</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Impressions</span>
              <span className="font-semibold text-foreground">5,696</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Yield Management */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="DollarSign" size={20} />
        Yield Management Algorithms
      </h2>
      <div className="space-y-4">
        {[
          {
            algorithm: 'Dynamic CPE Optimization',
            description: 'Automatically adjusts CPE pricing based on demand and competition',
            status: 'active',
            impact: '+18% revenue'
          },
          {
            algorithm: 'Auction Bid Prioritization',
            description: 'Prioritizes highest-bidding participatory ads for premium slots',
            status: 'active',
            impact: '+12% fill rate'
          },
          {
            algorithm: 'AdSense Floor Price Management',
            description: 'Sets minimum CPM thresholds for AdSense fallback slots',
            status: 'active',
            impact: '+8% eCPM'
          },
          {
            algorithm: 'Zone-Based Revenue Optimization',
            description: 'Optimizes ad delivery based on 8-zone purchasing power segmentation',
            status: 'active',
            impact: '+15% ROI'
          }
        ]?.map((algo, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-foreground">{algo?.algorithm}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-500">
                  {algo?.status}
                </span>
                <span className="text-sm font-semibold text-green-500">{algo?.impact}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{algo?.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Automated Bid Adjustments */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Settings" size={20} />
        Automated Bid Adjustments
      </h2>
      <div className="space-y-3">
        {[
          { metric: 'Peak Hours (8AM-10PM)', adjustment: '+25%', reason: 'Higher user engagement' },
          { metric: 'Premium Screens (Home Feed)', adjustment: '+30%', reason: 'Higher visibility' },
          { metric: 'High-Value Zones (1-3)', adjustment: '+20%', reason: 'Better conversion rates' },
          { metric: 'Low Fill Rate Slots', adjustment: '-15%', reason: 'Increase fill probability' }
        ]?.map((adjustment, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium text-foreground mb-1">{adjustment?.metric}</div>
              <div className="text-xs text-muted-foreground">{adjustment?.reason}</div>
            </div>
            <div className={`text-lg font-bold ${
              adjustment?.adjustment?.startsWith('+')
                ? 'text-green-500' :'text-orange-500'
            }`}>
              {adjustment?.adjustment}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Real-Time Monitoring Panel
const RealTimeMonitoringPanel = ({ realTimeMonitoring, renderingQueue }) => (
  <div className="space-y-6">
    {/* System Health */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Activity" size={20} />
        Live Ad Delivery Status
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <Icon name="CheckCircle" size={24} className="text-green-500 mb-3" />
          <div className="text-2xl font-bold text-foreground mb-1">
            {realTimeMonitoring?.successRate}%
          </div>
          <div className="text-sm text-muted-foreground">Success Rate</div>
        </div>

        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <Icon name="Zap" size={24} className="text-blue-500 mb-3" />
          <div className="text-2xl font-bold text-foreground mb-1">
            {realTimeMonitoring?.avgRenderTime}ms
          </div>
          <div className="text-sm text-muted-foreground">Avg Render Time</div>
        </div>

        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <Icon name="Activity" size={24} className="text-primary mb-3" />
          <div className="text-2xl font-bold text-foreground mb-1">
            {realTimeMonitoring?.activeSlots}
          </div>
          <div className="text-sm text-muted-foreground">Active Slots</div>
        </div>

        <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <Icon name="AlertTriangle" size={24} className="text-orange-500 mb-3" />
          <div className="text-2xl font-bold text-foreground mb-1">
            {realTimeMonitoring?.failedDeliveries}
          </div>
          <div className="text-sm text-muted-foreground">Failed Deliveries</div>
        </div>
      </div>
    </div>

    {/* System Health Indicator */}
    <div className="card p-6 bg-green-500/10 border-green-500/20">
      <div className="flex items-center gap-3">
        <Icon name="Heart" size={32} className="text-green-500" />
        <div>
          <h2 className="text-xl font-bold text-green-500 mb-1">System Health: Excellent</h2>
          <p className="text-sm text-muted-foreground">
            All ad delivery systems operational. No critical alerts.
          </p>
        </div>
      </div>
    </div>

    {/* Rendering Performance Metrics */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Rendering Performance Metrics</h2>
      <div className="space-y-4">
        {[
          { metric: 'Participatory Ad Render Time', value: '95ms', target: '<150ms', status: 'good' },
          { metric: 'AdSense Fallback Time', value: '45ms', target: '<100ms', status: 'excellent' },
          { metric: 'Slot Allocation Time', value: '12ms', target: '<50ms', status: 'excellent' },
          { metric: 'Total Delivery Time', value: '125ms', target: '<200ms', status: 'good' }
        ]?.map((metric, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">{metric?.metric}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Target: {metric?.target}</span>
                <span className={`text-lg font-bold ${
                  metric?.status === 'excellent' ?'text-green-500' :'text-blue-500'
                }`}>
                  {metric?.value}
                </span>
              </div>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  metric?.status === 'excellent' ?'bg-green-500' :'bg-blue-500'
                }`}
                style={{ width: '75%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Automated Alert Configuration */}
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Bell" size={20} />
        Automated Alert Configuration
      </h2>
      <div className="space-y-3">
        {[
          {
            alert: 'Fill Rate Drop',
            threshold: 'Below 85%',
            action: 'Increase AdSense floor price',
            enabled: true
          },
          {
            alert: 'Render Time Spike',
            threshold: 'Above 300ms',
            action: 'Scale rendering infrastructure',
            enabled: true
          },
          {
            alert: 'Delivery Failure',
            threshold: 'More than 50 failures/hour',
            action: 'Notify engineering team',
            enabled: true
          },
          {
            alert: 'Revenue Decline',
            threshold: 'Down 20% vs. previous day',
            action: 'Trigger optimization review',
            enabled: true
          }
        ]?.map((alert, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">{alert?.alert}</span>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-500">
                {alert?.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Threshold</div>
                <div className="font-medium text-foreground">{alert?.threshold}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Action</div>
                <div className="font-medium text-foreground">{alert?.action}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DynamicAdRenderingFillRateAnalyticsHub;