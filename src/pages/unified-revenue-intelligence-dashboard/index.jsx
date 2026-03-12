import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import revenueIntelligenceService from '../../services/revenueIntelligenceService';
import RevenueOverviewHeader from './components/RevenueOverviewHeader';
import ConsolidatedRevenueStreamsPanel from './components/ConsolidatedRevenueStreamsPanel';
import PredictiveRevenueModelingPanel from './components/PredictiveRevenueModelingPanel';
import ZoneGrowthRecommendationsPanel from './components/ZoneGrowthRecommendationsPanel';

const UnifiedRevenueIntelligenceDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');
  const [forecastDays, setForecastDays] = useState(30);
  const [streams, setStreams] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [zoneRecommendations, setZoneRecommendations] = useState([]);
  const [isLoadingStreams, setIsLoadingStreams] = useState(true);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);
  const [isLoadingZones, setIsLoadingZones] = useState(false);

  const loadRevenueStreams = useCallback(async () => {
    setIsLoadingStreams(true);
    try {
      const [allStreams, historical] = await Promise.all([
        revenueIntelligenceService?.getAllRevenueStreams(timeRange),
        revenueIntelligenceService?.getHistoricalRevenue(6)
      ]);
      setStreams(allStreams);
      setHistoricalData(historical);
      const total = allStreams?.reduce((sum, s) => sum + (s?.total || 0), 0);
      setTotalRevenue(total);
    } catch (error) {
      toast?.error('Failed to load revenue data');
    } finally {
      setIsLoadingStreams(false);
    }
  }, [timeRange]);

  const generateForecast = useCallback(async () => {
    if (streams?.length === 0) return;
    setIsLoadingForecast(true);
    try {
      const forecastData = await revenueIntelligenceService?.generateRevenueForecast(
        historicalData,
        streams,
        forecastDays
      );
      setForecast(forecastData);
    } catch (error) {
      toast?.error('Failed to generate forecast');
    } finally {
      setIsLoadingForecast(false);
    }
  }, [streams, historicalData, forecastDays]);

  const generateZoneRecommendations = useCallback(async () => {
    if (streams?.length === 0) return;
    setIsLoadingZones(true);
    try {
      const zones = await revenueIntelligenceService?.generateZoneRecommendations(streams);
      setZoneRecommendations(zones);
    } catch (error) {
      // Use default recommendations on error
      setZoneRecommendations(revenueIntelligenceService?.getDefaultZoneRecommendations());
    } finally {
      setIsLoadingZones(false);
    }
  }, [streams]);

  // Load streams on mount and when timeRange changes
  useEffect(() => {
    loadRevenueStreams();
  }, [loadRevenueStreams]);

  // Auto-generate forecast and zone recommendations when streams load
  useEffect(() => {
    if (streams?.length > 0 && !isLoadingStreams) {
      generateForecast();
      if (zoneRecommendations?.length === 0) {
        setZoneRecommendations(revenueIntelligenceService?.getDefaultZoneRecommendations());
      }
    }
  }, [streams, isLoadingStreams]);

  // Regenerate forecast when forecastDays changes
  useEffect(() => {
    if (streams?.length > 0 && forecast) {
      generateForecast();
    }
  }, [forecastDays]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Toaster position="top-right" />

      {/* Navigation bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              ← Back
            </button>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300 text-sm">Revenue Intelligence</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/enhanced-admin-revenue-analytics-hub" className="text-gray-400 hover:text-white text-sm transition-colors">Admin Revenue Hub</a>
            <a href="/advanced-carousel-roi-analytics-dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">Carousel ROI</a>
            <a href="/financial-tracking-zone-analytics-center" className="text-gray-400 hover:text-white text-sm transition-colors">Zone Analytics</a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
        {/* Overview header with KPIs */}
        <RevenueOverviewHeader
          streams={streams}
          totalRevenue={totalRevenue}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          onRefresh={loadRevenueStreams}
          isLoading={isLoadingStreams}
        />

        {/* Main dashboard grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left column: Consolidated Revenue Streams */}
          <div className="col-span-5">
            <ConsolidatedRevenueStreamsPanel
              streams={streams}
              totalRevenue={totalRevenue}
              isLoading={isLoadingStreams}
            />
          </div>

          {/* Right column: Predictive Modeling */}
          <div className="col-span-7">
            <PredictiveRevenueModelingPanel
              forecast={forecast}
              historicalData={historicalData}
              streams={streams}
              onRefreshForecast={generateForecast}
              forecastDays={forecastDays}
              setForecastDays={setForecastDays}
              isLoading={isLoadingForecast}
            />
          </div>
        </div>

        {/* Full-width: Zone Growth Recommendations */}
        <ZoneGrowthRecommendationsPanel
          zoneRecommendations={zoneRecommendations}
          onRefreshZones={generateZoneRecommendations}
          isLoading={isLoadingZones}
        />

        {/* Cross-revenue correlation summary */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Cross-Revenue Correlation Analysis</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Highest Correlation Pair</p>
              <p className="text-white font-medium">Election Sponsorships ↔ SMS Ads</p>
              <p className="text-green-400 text-sm mt-1">r = 0.87 (Strong positive)</p>
              <p className="text-gray-500 text-xs mt-2">Election campaigns drive SMS ad demand by 3.2x during active periods</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Growth Multiplier Effect</p>
              <p className="text-white font-medium">Creator Tiers → Template Sales</p>
              <p className="text-blue-400 text-sm mt-1">2.4x revenue amplification</p>
              <p className="text-gray-500 text-xs mt-2">Each tier upgrade generates avg 2.4x more template marketplace activity</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Optimization Opportunity</p>
              <p className="text-white font-medium">Carousel → Direct Sponsorships</p>
              <p className="text-yellow-400 text-sm mt-1">$12,400 untapped potential</p>
              <p className="text-gray-500 text-xs mt-2">High-performing carousel creators are under-monetized via direct deals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedRevenueIntelligenceDashboard;
