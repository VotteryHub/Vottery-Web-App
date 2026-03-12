import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Globe } from 'lucide-react';

const VOTE_REGIONS = [
  { region: 'North America', votes: 2847293, lat: 40, lng: -100, intensity: 0.9 },
  { region: 'Europe', votes: 1923847, lat: 51, lng: 10, intensity: 0.75 },
  { region: 'Asia Pacific', votes: 3421093, lat: 25, lng: 105, intensity: 1.0 },
  { region: 'South America', votes: 892341, lat: -15, lng: -60, intensity: 0.45 },
  { region: 'Africa', votes: 634821, lat: 5, lng: 20, intensity: 0.35 },
  { region: 'Middle East', votes: 421093, lat: 25, lng: 45, intensity: 0.28 },
  { region: 'Oceania', votes: 187432, lat: -25, lng: 135, intensity: 0.18 },
];

const GeographicHeatmap = () => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [viewMode, setViewMode] = useState('region');

  useEffect(() => {
    const apiKey = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your-google-maps-api-key-here') {
      setMapLoaded(false);
      return;
    }

    if (window.google?.maps) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization`;
    script.async = true;
    script.onload = () => initMap();
    document.head?.appendChild(script);

    return () => {
      if (document.head?.contains(script)) {
        document.head?.removeChild(script);
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef?.current || !window.google?.maps) return;
    try {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 2,
        center: { lat: 20, lng: 0 },
        mapTypeId: 'roadmap',
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
        ]
      });

      const heatmapData = VOTE_REGIONS?.map(r => ({
        location: new window.google.maps.LatLng(r.lat, r.lng),
        weight: r?.intensity * 10
      }));

      new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map,
        radius: 60,
        gradient: ['rgba(0,0,0,0)', 'rgba(59,130,246,0.5)', 'rgba(139,92,246,0.7)', 'rgba(239,68,68,1)']
      });

      setMapLoaded(true);
    } catch (e) {
      setMapLoaded(false);
    }
  };

  const totalVotes = VOTE_REGIONS?.reduce((sum, r) => sum + r?.votes, 0);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Geographic Vote Distribution</h3>
            <p className="text-gray-400 text-sm">Real-time heatmap by region/country/state from voter IP addresses</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['region', 'country', 'state']?.map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                viewMode === mode ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden mb-4" style={{ height: '320px' }}>
        <div ref={mapRef} className="w-full h-full" />
        {!mapLoaded && (
          <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
            {/* Fallback visual heatmap */}
            <div className="w-full h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
              {VOTE_REGIONS?.map((region, idx) => (
                <div
                  key={idx}
                  className="absolute rounded-full blur-2xl opacity-60 cursor-pointer transition-all hover:opacity-80"
                  style={{
                    width: `${region?.intensity * 120 + 40}px`,
                    height: `${region?.intensity * 120 + 40}px`,
                    left: `${((region?.lng + 180) / 360) * 100}%`,
                    top: `${((90 - region?.lat) / 180) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, rgba(${Math.floor(region?.intensity * 200)}, ${Math.floor((1 - region?.intensity) * 100)}, 255, 0.8), transparent)`,
                  }}
                  onClick={() => setSelectedRegion(region)}
                />
              ))}
              <div className="absolute bottom-3 left-3 text-gray-400 text-xs">
                <MapPin className="w-3 h-3 inline mr-1" />
                Interactive map — Google Maps API key required for full functionality
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Region Stats */}
      <div className="grid grid-cols-4 gap-3">
        {VOTE_REGIONS?.slice(0, 4)?.map((region) => (
          <div
            key={region?.region}
            onClick={() => setSelectedRegion(region)}
            className={`bg-gray-800 rounded-lg p-3 cursor-pointer border transition-colors ${
              selectedRegion?.region === region?.region ? 'border-blue-500' : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="w-3 h-3 text-blue-400" />
              <span className="text-gray-300 text-xs font-medium truncate">{region?.region}</span>
            </div>
            <p className="text-white font-bold text-sm">{(region?.votes / 1000000)?.toFixed(1)}M</p>
            <div className="mt-1.5 w-full bg-gray-700 rounded-full h-1">
              <div
                className="h-1 rounded-full bg-blue-500"
                style={{ width: `${(region?.votes / totalVotes) * 100}%` }}
              />
            </div>
            <p className="text-gray-500 text-xs mt-1">{((region?.votes / totalVotes) * 100)?.toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeographicHeatmap;
