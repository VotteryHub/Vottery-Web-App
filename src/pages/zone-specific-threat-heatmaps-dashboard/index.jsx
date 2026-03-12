import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Polygon, Marker, InfoWindow } from '@react-google-maps/api';
import { Shield, AlertTriangle, Activity, Globe, RefreshCw, TrendingUp, Lock, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const GOOGLE_MAPS_API_KEY = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = { width: '100%', height: '100%' };

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c1a2e' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#334155' }, { weight: 1 }] },
  ],
};

const THREAT_LEVELS = {
  low: { color: '#22c55e', label: 'Low', bg: 'bg-green-900/50', text: 'text-green-400', border: 'border-green-700' },
  medium: { color: '#eab308', label: 'Medium', bg: 'bg-yellow-900/50', text: 'text-yellow-400', border: 'border-yellow-700' },
  high: { color: '#f97316', label: 'High', bg: 'bg-orange-900/50', text: 'text-orange-400', border: 'border-orange-700' },
  critical: { color: '#ef4444', label: 'Critical', bg: 'bg-red-900/50', text: 'text-red-400', border: 'border-red-700' },
};

const PURCHASING_POWER_ZONES = [
  {
    id: 'us_canada',
    name: 'US & Canada',
    center: { lat: 45.0, lng: -100.0 },
    paths: [
      { lat: 70, lng: -140 }, { lat: 70, lng: -55 }, { lat: 45, lng: -55 },
      { lat: 25, lng: -80 }, { lat: 25, lng: -117 }, { lat: 32, lng: -117 },
      { lat: 49, lng: -125 }, { lat: 60, lng: -140 },
    ],
    threatScore: 18,
    threatLevel: 'low',
    revenue: '$2.4M',
    users: '142K',
    description: 'North American zone with highest purchasing power. Low fraud risk with strong identity verification.',
  },
  {
    id: 'western_europe',
    name: 'Western Europe',
    center: { lat: 50.0, lng: 5.0 },
    paths: [
      { lat: 60, lng: -10 }, { lat: 60, lng: 20 }, { lat: 45, lng: 20 },
      { lat: 36, lng: 10 }, { lat: 36, lng: -5 }, { lat: 44, lng: -10 },
    ],
    threatScore: 24,
    threatLevel: 'low',
    revenue: '$1.8M',
    users: '98K',
    description: 'Western European zone with strong GDPR compliance. Minimal fraud activity detected.',
  },
  {
    id: 'eastern_europe',
    name: 'Eastern Europe',
    center: { lat: 52.0, lng: 30.0 },
    paths: [
      { lat: 60, lng: 20 }, { lat: 60, lng: 45 }, { lat: 45, lng: 45 },
      { lat: 40, lng: 30 }, { lat: 45, lng: 20 },
    ],
    threatScore: 61,
    threatLevel: 'medium',
    revenue: '$420K',
    users: '34K',
    description: 'Moderate threat level. Coordinated voting pattern anomalies detected in 3 sub-regions.',
  },
  {
    id: 'africa',
    name: 'Africa',
    center: { lat: 5.0, lng: 20.0 },
    paths: [
      { lat: 37, lng: -5 }, { lat: 37, lng: 45 }, { lat: 12, lng: 52 },
      { lat: -35, lng: 35 }, { lat: -35, lng: 15 }, { lat: -5, lng: -5 },
      { lat: 15, lng: -18 },
    ],
    threatScore: 73,
    threatLevel: 'high',
    revenue: '$180K',
    users: '21K',
    description: 'Elevated threat level. Multiple bot account clusters and VPN usage spikes detected.',
  },
  {
    id: 'latin_america',
    name: 'Latin America',
    center: { lat: -15.0, lng: -60.0 },
    paths: [
      { lat: 25, lng: -117 }, { lat: 25, lng: -80 }, { lat: 10, lng: -75 },
      { lat: -5, lng: -35 }, { lat: -55, lng: -70 }, { lat: -55, lng: -80 },
      { lat: 10, lng: -85 }, { lat: 20, lng: -105 },
    ],
    threatScore: 55,
    threatLevel: 'medium',
    revenue: '$310K',
    users: '28K',
    description: 'Moderate risk zone. Suspicious referral patterns and unusual voting velocity in Brazil.',
  },
  {
    id: 'middle_east_asia',
    name: 'Middle East & Asia',
    center: { lat: 25.0, lng: 65.0 },
    paths: [
      { lat: 45, lng: 45 }, { lat: 45, lng: 90 }, { lat: 35, lng: 90 },
      { lat: 20, lng: 65 }, { lat: 12, lng: 52 }, { lat: 37, lng: 45 },
    ],
    threatScore: 82,
    threatLevel: 'critical',
    revenue: '$290K',
    users: '19K',
    description: 'CRITICAL: Active coordinated attack detected. 847 suspicious accounts flagged. Immediate review required.',
  },
  {
    id: 'australasia',
    name: 'Australasia',
    center: { lat: -25.0, lng: 135.0 },
    paths: [
      { lat: -10, lng: 110 }, { lat: -10, lng: 160 }, { lat: -45, lng: 170 },
      { lat: -45, lng: 110 },
    ],
    threatScore: 15,
    threatLevel: 'low',
    revenue: '$680K',
    users: '52K',
    description: 'Lowest threat zone globally. Strong regulatory environment and identity verification compliance.',
  },
  {
    id: 'china_hk',
    name: 'China & Hong Kong',
    center: { lat: 32.0, lng: 110.0 },
    paths: [
      { lat: 45, lng: 90 }, { lat: 45, lng: 135 }, { lat: 20, lng: 120 },
      { lat: 20, lng: 100 }, { lat: 35, lng: 90 },
    ],
    threatScore: 68,
    threatLevel: 'high',
    revenue: '$520K',
    users: '41K',
    description: 'High threat level. VPN circumvention attempts and unusual account creation patterns detected.',
  },
];

export default function ZoneSpecificThreatHeatmapsDashboard() {
  const [zones, setZones] = useState(PURCHASING_POWER_ZONES);
  const [selectedZone, setSelectedZone] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [overallThreat, setOverallThreat] = useState('medium');

  const fetchThreatData = useCallback(async () => {
    try {
      const { data } = await supabase?.from('zone_threat_levels')?.select('zone_id, threat_score, threat_level')?.order('updated_at', { ascending: false })?.limit(8);

      if (data && data?.length > 0) {
        setZones((prev) =>
          prev?.map((zone) => {
            const update = data?.find((d) => d?.zone_id === zone?.id);
            if (update) {
              return { ...zone, threatScore: update?.threat_score, threatLevel: update?.threat_level };
            }
            return zone;
          })
        );
      }
      setLastUpdated(new Date());
    } catch (err) {
      // Use mock data if table doesn't exist
      setLastUpdated(new Date());
    }
  }, []);

  useEffect(() => {
    fetchThreatData();
  }, [fetchThreatData]);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: fetchThreatData,
    enabled: true,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchThreatData();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getPolygonOptions = (zone) => {
    const level = THREAT_LEVELS?.[zone?.threatLevel] || THREAT_LEVELS?.low;
    return {
      fillColor: level?.color,
      fillOpacity: 0.25,
      strokeColor: level?.color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      clickable: true,
    };
  };

  const getZoneMarkerIcon = (zone) => {
    const level = THREAT_LEVELS?.[zone?.threatLevel] || THREAT_LEVELS?.low;
    return {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
      fillColor: level?.color,
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#ffffff',
      scale: 1.6,
      anchor: { x: 12, y: 22 },
    };
  };

  const criticalCount = zones?.filter((z) => z?.threatLevel === 'critical')?.length;
  const highCount = zones?.filter((z) => z?.threatLevel === 'high')?.length;
  const avgScore = Math.round(zones?.reduce((s, z) => s + z?.threatScore, 0) / zones?.length);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600/20 border border-red-600/50 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Zone-Specific Threat Heatmaps</h1>
              <p className="text-sm text-gray-400">8 Purchasing Power Zones — Real-time Threat Visualization</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Updated: {lastUpdated?.toLocaleTimeString()}</span>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Total Zones</span>
            </div>
            <p className="text-2xl font-bold text-white">8</p>
          </div>
          <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400">Critical Zones</span>
            </div>
            <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
          </div>
          <div className="bg-orange-900/30 border border-orange-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-gray-400">High Risk Zones</span>
            </div>
            <p className="text-2xl font-bold text-orange-400">{highCount}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">Avg Threat Score</span>
            </div>
            <p className="text-2xl font-bold text-white">{avgScore}<span className="text-sm text-gray-400">/100</span></p>
          </div>
        </div>
      </div>
      {/* Threat Level Legend */}
      <div className="bg-gray-900/80 border-b border-gray-800 px-6 py-2 flex items-center gap-6">
        <span className="text-xs text-gray-500 font-medium">THREAT LEVELS:</span>
        {Object.entries(THREAT_LEVELS)?.map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: val?.color }} />
            <span className="text-xs text-gray-300">{val?.label}</span>
          </div>
        ))}
      </div>
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} loadingElement={
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mx-auto mb-3" />
                <p className="text-gray-400">Loading threat map...</p>
              </div>
            </div>
          }>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: 20, lng: 10 }}
              zoom={2}
              options={mapOptions}
            >
              {zones?.map((zone) => (
                <React.Fragment key={zone?.id}>
                  <Polygon
                    paths={zone?.paths}
                    options={getPolygonOptions(zone)}
                    onClick={() => setSelectedZone(zone)}
                  />
                  <Marker
                    position={zone?.center}
                    icon={getZoneMarkerIcon(zone)}
                    title={`${zone?.name} — Threat: ${zone?.threatScore}/100`}
                    onClick={() => setSelectedZone(zone)}
                  />
                </React.Fragment>
              ))}

              {selectedZone && (
                <InfoWindow
                  position={selectedZone?.center}
                  onCloseClick={() => setSelectedZone(null)}
                >
                  <div className="bg-white p-3 max-w-xs">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm">{selectedZone?.name}</h3>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full text-white ml-2"
                        style={{ backgroundColor: THREAT_LEVELS?.[selectedZone?.threatLevel]?.color }}
                      >
                        {THREAT_LEVELS?.[selectedZone?.threatLevel]?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{selectedZone?.threatScore}</p>
                        <p className="text-xs text-gray-500">Threat Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-900">{selectedZone?.revenue}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-900">{selectedZone?.users}</p>
                        <p className="text-xs text-gray-500">Users</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{selectedZone?.description}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Zone List Sidebar */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">Zone Threat Status</h2>
            <p className="text-xs text-gray-400">Click a zone to view details</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {zones?.sort((a, b) => b?.threatScore - a?.threatScore)?.map((zone) => {
                const level = THREAT_LEVELS?.[zone?.threatLevel] || THREAT_LEVELS?.low;
                return (
                  <div
                    key={zone?.id}
                    className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${
                      selectedZone?.id === zone?.id ? 'bg-gray-800' : ''
                    }`}
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white">{zone?.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${level?.bg} ${level?.text} ${level?.border}`}>
                        {level?.label}
                      </span>
                    </div>
                    {/* Threat Score Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Threat Score</span>
                        <span className={level?.text}>{zone?.threatScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${zone?.threatScore}%`, backgroundColor: level?.color }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Revenue: <span className="text-gray-300">{zone?.revenue}</span></span>
                      <span>Users: <span className="text-gray-300">{zone?.users}</span></span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Admin Response Panel */}
          {selectedZone && selectedZone?.threatLevel !== 'low' && (
            <div className="p-4 border-t border-gray-800 bg-gray-900">
              <h3 className="text-xs font-semibold text-gray-400 mb-2">ADMIN RESPONSE</h3>
              <div className="flex flex-col gap-2">
                <button className="w-full bg-orange-600/20 border border-orange-600/50 text-orange-400 text-xs py-2 rounded-lg hover:bg-orange-600/30 transition-colors flex items-center justify-center gap-2">
                  <Lock className="w-3 h-3" /> Increase Verification
                </button>
                <button className="w-full bg-red-600/20 border border-red-600/50 text-red-400 text-xs py-2 rounded-lg hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> Flag for Review
                </button>
                <button className="w-full bg-blue-600/20 border border-blue-600/50 text-blue-400 text-xs py-2 rounded-lg hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2">
                  <TrendingUp className="w-3 h-3" /> View Trend Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
