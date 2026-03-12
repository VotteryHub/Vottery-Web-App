import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { supabase } from '../../lib/supabase';


ChartJS?.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const CarouselABTestingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // A/B Testing Experiments
  const [experiments, setExperiments] = useState([]);
  const [activeExperiment, setActiveExperiment] = useState(null);

  // Traffic Splitting Configuration
  const [trafficSplit, setTrafficSplit] = useState({
    variantA: 50,
    variantB: 50,
    control: 0
  });

  // Engagement Metrics Comparison
  const [engagementMetrics, setEngagementMetrics] = useState({
    variantA: { swipes: 0, dwellTime: 0, ctr: 0, conversions: 0 },
    variantB: { swipes: 0, dwellTime: 0, ctr: 0, conversions: 0 },
    control: { swipes: 0, dwellTime: 0, ctr: 0, conversions: 0 }
  });

  // Statistical Significance
  const [statisticalSignificance, setStatisticalSignificance] = useState({
    pValue: 0,
    confidenceInterval: 95,
    sampleSize: 0,
    isSignificant: false,
    winner: null
  });

  // Variant Performance
  const [variantPerformance, setVariantPerformance] = useState([]);

  // Multivariate Testing
  const [multivariateTests, setMultivariateTests] = useState([]);

  useEffect(() => {
    loadABTestingData();
    setupRealtimeSubscriptions();
  }, []);

  const loadABTestingData = async () => {
    try {
      setLoading(true);

      // Load experiments
      const mockExperiments = [
        {
          id: 'exp-1',
          name: 'Horizontal Snap - Card Layout Test',
          carouselType: 'horizontal',
          status: 'active',
          startDate: new Date(Date.now() - 7 * 86400000)?.toISOString(),
          endDate: new Date(Date.now() + 7 * 86400000)?.toISOString(),
          variants: [
            { id: 'variant-a', name: 'Variant A - Large Cards', traffic: 50, conversions: 234, impressions: 5670 },
            { id: 'variant-b', name: 'Variant B - Compact Cards', traffic: 50, conversions: 289, impressions: 5890 }
          ],
          winner: null,
          confidenceLevel: 87.3
        },
        {
          id: 'exp-2',
          name: 'Vertical Stack - Swipe Animation Test',
          carouselType: 'vertical',
          status: 'active',
          startDate: new Date(Date.now() - 5 * 86400000)?.toISOString(),
          endDate: new Date(Date.now() + 9 * 86400000)?.toISOString(),
          variants: [
            { id: 'variant-a', name: 'Variant A - Fast Animation', traffic: 50, conversions: 456, impressions: 8900 },
            { id: 'variant-b', name: 'Variant B - Smooth Animation', traffic: 50, conversions: 512, impressions: 9120 }
          ],
          winner: 'variant-b',
          confidenceLevel: 95.8
        },
        {
          id: 'exp-3',
          name: 'Gradient Flow - Color Scheme Test',
          carouselType: 'gradient',
          status: 'completed',
          startDate: new Date(Date.now() - 14 * 86400000)?.toISOString(),
          endDate: new Date(Date.now() - 1 * 86400000)?.toISOString(),
          variants: [
            { id: 'variant-a', name: 'Variant A - Purple Gradient', traffic: 50, conversions: 678, impressions: 12340 },
            { id: 'variant-b', name: 'Variant B - Blue Gradient', traffic: 50, conversions: 734, impressions: 12560 }
          ],
          winner: 'variant-b',
          confidenceLevel: 98.2
        }
      ];

      setExperiments(mockExperiments);
      setActiveExperiment(mockExperiments?.[0]);

      // Load engagement metrics
      setEngagementMetrics({
        variantA: { swipes: 5670, dwellTime: 4.2, ctr: 4.13, conversions: 234 },
        variantB: { swipes: 5890, dwellTime: 4.8, ctr: 4.91, conversions: 289 },
        control: { swipes: 5500, dwellTime: 3.9, ctr: 3.82, conversions: 210 }
      });

      // Calculate statistical significance
      calculateStatisticalSignificance(234, 5670, 289, 5890);

      // Load variant performance over time
      setVariantPerformance([
        { day: 'Day 1', variantA: 32, variantB: 38 },
        { day: 'Day 2', variantA: 35, variantB: 42 },
        { day: 'Day 3', variantA: 33, variantB: 41 },
        { day: 'Day 4', variantA: 34, variantB: 43 },
        { day: 'Day 5', variantA: 36, variantB: 45 },
        { day: 'Day 6', variantA: 32, variantB: 40 },
        { day: 'Day 7', variantA: 34, variantB: 42 }
      ]);

      // Load multivariate tests
      setMultivariateTests([
        {
          id: 'mv-1',
          name: 'Horizontal Snap - Multi-Factor Test',
          factors: [
            { name: 'Card Size', levels: ['Small', 'Medium', 'Large'] },
            { name: 'Animation Speed', levels: ['Fast', 'Medium', 'Slow'] },
            { name: 'Haptic Intensity', levels: ['Light', 'Medium', 'Heavy'] }
          ],
          combinations: 27,
          status: 'active'
        }
      ]);

    } catch (error) {
      console.error('Failed to load A/B testing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatisticalSignificance = (conversionsA, impressionsA, conversionsB, impressionsB) => {
    // Simple z-test for proportions
    const p1 = conversionsA / impressionsA;
    const p2 = conversionsB / impressionsB;
    const pPooled = (conversionsA + conversionsB) / (impressionsA + impressionsB);
    const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / impressionsA + 1 / impressionsB));
    const zScore = (p2 - p1) / se;
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

    setStatisticalSignificance({
      pValue: pValue?.toFixed(4),
      confidenceInterval: 95,
      sampleSize: impressionsA + impressionsB,
      isSignificant: pValue < 0.05,
      winner: pValue < 0.05 ? (p2 > p1 ? 'Variant B' : 'Variant A') : null
    });
  };

  // Normal CDF approximation
  const normalCDF = (x) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  };

  const setupRealtimeSubscriptions = () => {
    const subscription = supabase?.channel('carousel_ab_tests_changes')?.on('postgres_changes', { event: '*', schema: 'public', table: 'carousel_ab_tests' }, (payload) => {
        loadABTestingData();
      })?.subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  };

  const handleTrafficSplitChange = (variant, value) => {
    const newSplit = { ...trafficSplit, [variant]: value };
    const total = Object.values(newSplit)?.reduce((sum, val) => sum + val, 0);
    if (total <= 100) {
      setTrafficSplit(newSplit);
    }
  };

  const handleCreateExperiment = async () => {
    try {
      // Create new A/B test experiment
      alert('New experiment created successfully');
      loadABTestingData();
    } catch (error) {
      console.error('Failed to create experiment:', error);
    }
  };

  const handleDeclareWinner = async (experimentId, winnerId) => {
    try {
      // Declare winner and end experiment
      alert(`Winner declared: ${winnerId}`);
      loadABTestingData();
    } catch (error) {
      console.error('Failed to declare winner:', error);
    }
  };

  const engagementComparisonData = {
    labels: ['Swipes', 'Dwell Time (s)', 'CTR (%)', 'Conversions'],
    datasets: [
      {
        label: 'Variant A',
        data: [
          engagementMetrics?.variantA?.swipes,
          engagementMetrics?.variantA?.dwellTime * 1000,
          engagementMetrics?.variantA?.ctr * 100,
          engagementMetrics?.variantA?.conversions
        ],
        backgroundColor: 'rgba(255, 215, 0, 0.8)'
      },
      {
        label: 'Variant B',
        data: [
          engagementMetrics?.variantB?.swipes,
          engagementMetrics?.variantB?.dwellTime * 1000,
          engagementMetrics?.variantB?.ctr * 100,
          engagementMetrics?.variantB?.conversions
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.8)'
      }
    ]
  };

  const variantPerformanceData = {
    labels: variantPerformance?.map(d => d?.day),
    datasets: [
      {
        label: 'Variant A',
        data: variantPerformance?.map(d => d?.variantA),
        borderColor: 'rgb(255, 215, 0)',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.4
      },
      {
        label: 'Variant B',
        data: variantPerformance?.map(d => d?.variantB),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'traffic-split', label: 'Traffic Splitting', icon: 'GitBranch' },
    { id: 'engagement', label: 'Engagement Metrics', icon: 'TrendingUp' },
    { id: 'statistical', label: 'Statistical Analysis', icon: 'Calculator' },
    { id: 'performance', label: 'Variant Performance', icon: 'BarChart' },
    { id: 'multivariate', label: 'Multivariate Testing', icon: 'Grid' }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Helmet>
        <title>Carousel A/B Testing Dashboard | Vottery</title>
      </Helmet>
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Carousel A/B Testing Dashboard</h1>
              <p className="text-muted-foreground">Traffic splitting configuration, engagement metrics comparison, automated winner selection with statistical significance, and multivariate testing support</p>
            </div>

            {/* Dashboard Overview */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Activity" size={32} />
                  <span className="text-3xl font-bold">{experiments?.filter(e => e?.status === 'active')?.length}</span>
                </div>
                <p className="text-sm opacity-90">Active Experiments</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="CheckCircle" size={32} />
                  <span className="text-3xl font-bold">{experiments?.filter(e => e?.winner)?.length}</span>
                </div>
                <p className="text-sm opacity-90">Winners Declared</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="TrendingUp" size={32} />
                  <span className="text-3xl font-bold">{statisticalSignificance?.confidenceInterval}%</span>
                </div>
                <p className="text-sm opacity-90">Confidence Level</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Users" size={32} />
                  <span className="text-3xl font-bold">{(statisticalSignificance?.sampleSize / 1000)?.toFixed(1)}K</span>
                </div>
                <p className="text-sm opacity-90">Sample Size</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab?.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={20} />
                  {tab?.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">Active Experiments</h2>
                  <button
                    onClick={handleCreateExperiment}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Icon name="Plus" size={20} />
                    Create Experiment
                  </button>
                </div>
                {experiments?.map((exp) => (
                  <div key={exp?.id} className="bg-card rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-card-foreground">{exp?.name}</h3>
                        <p className="text-sm text-muted-foreground">Carousel: {exp?.carouselType} • Status: {exp?.status}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        exp?.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                      }`}>
                        {exp?.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {exp?.variants?.map((variant) => (
                        <div key={variant?.id} className="bg-muted/50 rounded-lg p-4">
                          <p className="font-semibold text-foreground mb-2">{variant?.name}</p>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Traffic: {variant?.traffic}%</p>
                            <p className="text-sm text-muted-foreground">Conversions: {variant?.conversions}</p>
                            <p className="text-sm text-muted-foreground">Impressions: {variant?.impressions?.toLocaleString()}</p>
                            <p className="text-sm font-bold text-green-500">CVR: {((variant?.conversions / variant?.impressions) * 100)?.toFixed(2)}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence Level</p>
                        <p className="text-lg font-bold text-foreground">{exp?.confidenceLevel}%</p>
                      </div>
                      {exp?.winner && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg">
                          <Icon name="Trophy" size={20} />
                          <span className="font-semibold">Winner: {exp?.winner}</span>
                        </div>
                      )}
                      {!exp?.winner && exp?.confidenceLevel >= 95 && (
                        <button
                          onClick={() => handleDeclareWinner(exp?.id, 'variant-b')}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Declare Winner
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'traffic-split' && (
              <div className="bg-card rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                  <Icon name="GitBranch" size={24} className="text-blue-500" />
                  Traffic Splitting Configuration
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Variant A Traffic (%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={trafficSplit?.variantA}
                      onChange={(e) => handleTrafficSplitChange('variantA', parseInt(e?.target?.value))}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground mt-1">{trafficSplit?.variantA}%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Variant B Traffic (%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={trafficSplit?.variantB}
                      onChange={(e) => handleTrafficSplitChange('variantB', parseInt(e?.target?.value))}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground mt-1">{trafficSplit?.variantB}%</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Total Traffic Allocation</p>
                    <p className="text-2xl font-bold text-foreground">{Object.values(trafficSplit)?.reduce((sum, val) => sum + val, 0)}%</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'engagement' && (
              <div className="bg-card rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} className="text-green-500" />
                  Engagement Metrics Comparison
                </h2>
                <div className="h-[400px]">
                  <Bar data={engagementComparisonData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            )}

            {activeTab === 'statistical' && (
              <div className="bg-card rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                  <Icon name="Calculator" size={24} className="text-purple-500" />
                  Statistical Significance Analysis
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">P-Value</p>
                    <p className="text-2xl font-bold text-foreground">{statisticalSignificance?.pValue}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Confidence Interval</p>
                    <p className="text-2xl font-bold text-foreground">{statisticalSignificance?.confidenceInterval}%</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Sample Size</p>
                    <p className="text-2xl font-bold text-foreground">{statisticalSignificance?.sampleSize?.toLocaleString()}</p>
                  </div>
                  <div className={`rounded-lg p-4 ${
                    statisticalSignificance?.isSignificant ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}>
                    <p className="text-sm text-muted-foreground mb-2">Result</p>
                    <p className={`text-2xl font-bold ${
                      statisticalSignificance?.isSignificant ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {statisticalSignificance?.isSignificant ? 'Significant' : 'Not Significant'}
                    </p>
                  </div>
                </div>
                {statisticalSignificance?.winner && (
                  <div className="mt-6 p-4 bg-green-500/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Automated Winner Selection</p>
                    <p className="text-xl font-bold text-green-500">{statisticalSignificance?.winner}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="bg-card rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                  <Icon name="BarChart" size={24} className="text-blue-500" />
                  Variant Performance Over Time
                </h2>
                <div className="h-[400px]">
                  <Line data={variantPerformanceData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            )}

            {activeTab === 'multivariate' && (
              <div className="space-y-6">
                {multivariateTests?.map((test) => (
                  <div key={test?.id} className="bg-card rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-card-foreground">{test?.name}</h3>
                        <p className="text-sm text-muted-foreground">Status: {test?.status}</p>
                      </div>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                        {test?.combinations} combinations
                      </span>
                    </div>
                    <div className="space-y-3">
                      {test?.factors?.map((factor, index) => (
                        <div key={index} className="bg-muted/50 rounded-lg p-4">
                          <p className="font-semibold text-foreground mb-2">{factor?.name}</p>
                          <div className="flex gap-2">
                            {factor?.levels?.map((level, levelIndex) => (
                              <span key={levelIndex} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                {level}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CarouselABTestingDashboard;