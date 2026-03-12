import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

import { useAuth } from '../../contexts/AuthContext';

ChartJS?.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const ABTestingForCarouselsDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [experiments, setExperiments] = useState([]);

  // Traffic Splitting Configuration
  const [trafficConfig, setTrafficConfig] = useState({
    horizontal: { variantA: 50, variantB: 50 },
    vertical: { variantA: 50, variantB: 50 },
    gradient: { variantA: 50, variantB: 50 }
  });

  // Engagement Metrics
  const [engagementMetrics, setEngagementMetrics] = useState({
    horizontal: {
      variantA: { swipeRate: 0.68, dwellTime: 4.2, ctr: 0.27, conversions: 234 },
      variantB: { swipeRate: 0.72, dwellTime: 4.8, ctr: 0.31, conversions: 267 }
    },
    vertical: {
      variantA: { swipeRate: 0.82, dwellTime: 6.5, ctr: 0.23, conversions: 456 },
      variantB: { swipeRate: 0.79, dwellTime: 6.2, ctr: 0.25, conversions: 489 }
    },
    gradient: {
      variantA: { swipeRate: 0.54, dwellTime: 3.2, ctr: 0.19, conversions: 178 },
      variantB: { swipeRate: 0.61, dwellTime: 3.8, ctr: 0.24, conversions: 203 }
    }
  });

  // Statistical Significance
  const [statisticalData, setStatisticalData] = useState({
    horizontal: { pValue: 0.032, confidenceInterval: 95.8, winner: 'Variant B', significant: true },
    vertical: { pValue: 0.048, confidenceInterval: 94.2, winner: 'Variant B', significant: false },
    gradient: { pValue: 0.019, confidenceInterval: 97.3, winner: 'Variant B', significant: true }
  });

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    try {
      setLoading(true);
      // Mock experiments data
      const mockExperiments = [
        {
          id: 1,
          name: 'Horizontal Snap - Card Size Test',
          carouselType: 'horizontal',
          status: 'active',
          variants: 2,
          trafficSplit: '50/50',
          startDate: '2026-02-15',
          duration: 14,
          sampleSize: 12340,
          winner: 'Variant B',
          significance: 95.8
        },
        {
          id: 2,
          name: 'Vertical Stack - Swipe Threshold',
          carouselType: 'vertical',
          status: 'active',
          variants: 2,
          trafficSplit: '50/50',
          startDate: '2026-02-18',
          duration: 14,
          sampleSize: 8900,
          winner: null,
          significance: 94.2
        },
        {
          id: 3,
          name: 'Gradient Flow - Blob Animation',
          carouselType: 'gradient',
          status: 'completed',
          variants: 2,
          trafficSplit: '50/50',
          startDate: '2026-02-01',
          duration: 14,
          sampleSize: 15670,
          winner: 'Variant B',
          significance: 97.3
        }
      ];
      setExperiments(mockExperiments);
    } catch (error) {
      console.error('Error loading experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrafficSplit = (carouselType, variant, value) => {
    const otherVariant = variant === 'variantA' ? 'variantB' : 'variantA';
    setTrafficConfig(prev => ({
      ...prev,
      [carouselType]: {
        [variant]: value,
        [otherVariant]: 100 - value
      }
    }));
  };

  const declareWinner = (carouselType) => {
    const stats = statisticalData?.[carouselType];
    if (stats?.significant && stats?.winner) {
      alert(`Winner declared: ${stats?.winner} for ${carouselType} carousel with ${stats?.confidenceInterval}% confidence`);
    } else {
      alert('Statistical significance not reached yet. Continue testing.');
    }
  };

  const engagementChartData = (carouselType) => ({
    labels: ['Swipe Rate', 'Dwell Time (s)', 'CTR (%)', 'Conversions'],
    datasets: [
      {
        label: 'Variant A',
        data: [
          engagementMetrics?.[carouselType]?.variantA?.swipeRate * 100,
          engagementMetrics?.[carouselType]?.variantA?.dwellTime,
          engagementMetrics?.[carouselType]?.variantA?.ctr * 100,
          engagementMetrics?.[carouselType]?.variantA?.conversions
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      },
      {
        label: 'Variant B',
        data: [
          engagementMetrics?.[carouselType]?.variantB?.swipeRate * 100,
          engagementMetrics?.[carouselType]?.variantB?.dwellTime,
          engagementMetrics?.[carouselType]?.variantB?.ctr * 100,
          engagementMetrics?.[carouselType]?.variantB?.conversions
        ],
        backgroundColor: 'rgba(255, 215, 0, 0.8)'
      }
    ]
  });

  return (
    <div className="flex h-screen bg-background">
      <Helmet>
        <title>A/B Testing for Carousels Dashboard | Vottery</title>
      </Helmet>
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">A/B Testing for Carousels Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive multivariate testing with traffic splitting, engagement metrics comparison, and automated winner selection</p>
            </div>

            {/* Active Experiments Overview */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-card rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Active Tests</h3>
                  <Icon name="Activity" size={20} className="text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-foreground">{experiments?.filter(e => e?.status === 'active')?.length}</p>
              </div>
              <div className="bg-card rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Significant Results</h3>
                  <Icon name="TrendingUp" size={20} className="text-green-500" />
                </div>
                <p className="text-3xl font-bold text-foreground">{Object.values(statisticalData)?.filter(s => s?.significant)?.length}</p>
              </div>
              <div className="bg-card rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Sample Size</h3>
                  <Icon name="Users" size={20} className="text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-foreground">{experiments?.reduce((sum, e) => sum + e?.sampleSize, 0)?.toLocaleString()}</p>
              </div>
            </div>

            {/* Carousel Type Tabs */}
            <div className="bg-card rounded-xl shadow-lg mb-6">
              <div className="flex border-b border-border">
                {['horizontal', 'vertical', 'gradient']?.map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === type
                        ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type?.charAt(0)?.toUpperCase() + type?.slice(1)} Snap
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Traffic Splitting Configuration */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Sliders" size={24} className="text-yellow-500" />
                    Traffic Splitting Configuration
                  </h2>
                  <div className="bg-muted/30 rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Variant A Traffic (%)</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={trafficConfig?.[activeTab]?.variantA}
                          onChange={(e) => handleTrafficSplit(activeTab, 'variantA', parseInt(e?.target?.value))}
                          className="w-full"
                        />
                        <p className="text-2xl font-bold text-blue-500 mt-2">{trafficConfig?.[activeTab]?.variantA}%</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Variant B Traffic (%)</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={trafficConfig?.[activeTab]?.variantB}
                          onChange={(e) => handleTrafficSplit(activeTab, 'variantB', parseInt(e?.target?.value))}
                          className="w-full"
                        />
                        <p className="text-2xl font-bold text-yellow-500 mt-2">{trafficConfig?.[activeTab]?.variantB}%</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Info" size={16} />
                      <span>Real-time traffic allocation with automated load balancing</span>
                    </div>
                  </div>
                </div>

                {/* Engagement Metrics Comparison */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="BarChart3" size={24} className="text-green-500" />
                    Engagement Metrics Comparison
                  </h2>
                  <div className="h-[400px]">
                    <Bar data={engagementChartData(activeTab)} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="bg-blue-500/10 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Variant A Performance</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground">Swipe Rate:</span>
                          <span className="text-sm font-bold text-blue-500">{(engagementMetrics?.[activeTab]?.variantA?.swipeRate * 100)?.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground">Dwell Time:</span>
                          <span className="text-sm font-bold text-blue-500">{engagementMetrics?.[activeTab]?.variantA?.dwellTime}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground">CTR:</span>
                          <span className="text-sm font-bold text-blue-500">{(engagementMetrics?.[activeTab]?.variantA?.ctr * 100)?.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground">Conversions:</span>
                          <span className="text-sm font-bold text-blue-500">{engagementMetrics?.[activeTab]?.variantA?.conversions}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Variant B Performance</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground">Swipe Rate:</span>
                          <span className="text-sm font-bold text-yellow-500">{(engagementMetrics?.[activeTab]?.variantB?.swipeRate * 100)?.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground">Dwell Time:</span>
                          <span className="text-sm font-bold text-yellow-500">{engagementMetrics?.[activeTab]?.variantB?.dwellTime}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground">CTR:</span>
                          <span className="text-sm font-bold text-yellow-500">{(engagementMetrics?.[activeTab]?.variantB?.ctr * 100)?.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground">Conversions:</span>
                          <span className="text-sm font-bold text-yellow-500">{engagementMetrics?.[activeTab]?.variantB?.conversions}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Automated Winner Selection */}
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Trophy" size={24} className="text-purple-500" />
                    Automated Winner Selection
                  </h2>
                  <div className={`rounded-lg p-6 ${
                    statisticalData?.[activeTab]?.significant
                      ? 'bg-green-500/10 border-2 border-green-500' :'bg-yellow-500/10 border-2 border-yellow-500'
                  }`}>
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">P-Value</p>
                        <p className="text-2xl font-bold text-foreground">{statisticalData?.[activeTab]?.pValue?.toFixed(3)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Confidence Interval</p>
                        <p className="text-2xl font-bold text-foreground">{statisticalData?.[activeTab]?.confidenceInterval}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Statistical Significance</p>
                        <p className={`text-2xl font-bold ${
                          statisticalData?.[activeTab]?.significant ? 'text-green-500' : 'text-yellow-500'
                        }`}>
                          {statisticalData?.[activeTab]?.significant ? 'REACHED' : 'PENDING'}
                        </p>
                      </div>
                    </div>
                    {statisticalData?.[activeTab]?.significant && (
                      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Icon name="Award" size={32} className="text-yellow-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Winner Detected</p>
                            <p className="text-xl font-bold text-foreground">{statisticalData?.[activeTab]?.winner}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => declareWinner(activeTab)}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Declare Winner
                        </button>
                      </div>
                    )}
                    {!statisticalData?.[activeTab]?.significant && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="Clock" size={16} />
                        <span>Continue testing to reach statistical significance (95% confidence threshold)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Multivariate Testing Support */}
            <div className="bg-card rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="GitBranch" size={24} className="text-pink-500" />
                Multivariate Testing Support
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Content Types</h3>
                  <p className="text-lg font-bold text-foreground">12 Variants</p>
                  <p className="text-xs text-muted-foreground mt-1">Testing across all carousel content</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Interaction Patterns</h3>
                  <p className="text-lg font-bold text-foreground">3 Patterns</p>
                  <p className="text-xs text-muted-foreground mt-1">Swipe, snap, and drag behaviors</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Visual Designs</h3>
                  <p className="text-lg font-bold text-foreground">4 Themes</p>
                  <p className="text-xs text-muted-foreground mt-1">Casino aesthetic variations</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ABTestingForCarouselsDashboard;