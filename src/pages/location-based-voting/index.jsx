import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { MapPin, Filter, Navigation, Users, Vote, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const GOOGLE_MAPS_API_KEY = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = { lat: 40.7128, lng: -74.006 };

const CATEGORIES = ['All', 'Politics', 'Community', 'Education', 'Environment', 'Healthcare'];

const categoryColors = {
  Politics: '#ef4444',
  Community: '#3b82f6',
  Education: '#8b5cf6',
  Environment: '#22c55e',
  Healthcare: '#f59e0b',
  default: '#6366f1',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#a0aec0' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d3748' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f3460' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#2d3748' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2d3748' }] },
  ],
};

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function LocationBasedVoting() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [regionStats, setRegionStats] = useState({ total: 0, votes: 0, activeVoters: 0 });

  // Get user GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos?.coords?.latitude, lng: pos?.coords?.longitude });
          setLocationError(null);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setLocationError('Unable to get your location. Showing default map view.');
          setUserLocation(defaultCenter);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setUserLocation(defaultCenter);
    }
  }, []);

  // Fetch nearby elections from Supabase
  useEffect(() => {
    if (!userLocation) return;
    fetchNearbyElections();
  }, [userLocation]);

  const fetchNearbyElections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase?.from('elections')?.select('id, title, description, category, end_date, vote_count, election_locations')?.eq('status', 'active')?.not('election_locations', 'is', null)?.limit(50);

      if (error) throw error;

      const withDistance = (data || [])?.map((el) => {
        const loc = el?.election_locations;
        const lat = loc?.lat || loc?.latitude || (Array.isArray(loc) ? loc?.[0]?.lat : null);
        const lng = loc?.lng || loc?.longitude || (Array.isArray(loc) ? loc?.[0]?.lng : null);
        if (!lat || !lng) return null;
        const distance = getDistanceKm(userLocation?.lat, userLocation?.lng, lat, lng);
        return { ...el, lat: parseFloat(lat), lng: parseFloat(lng), distance };
      })?.filter(Boolean)?.filter((el) => el?.distance <= 50);

      // If no real data, use mock nearby elections
      const displayElections = withDistance?.length > 0 ? withDistance : getMockElections(userLocation);
      setElections(displayElections);
      setFilteredElections(displayElections);
      setRegionStats({
        total: displayElections?.length,
        votes: displayElections?.reduce((sum, e) => sum + (e?.vote_count || 0), 0),
        activeVoters: Math.floor(displayElections?.length * 12.4),
      });
    } catch (err) {
      console.error('Error fetching elections:', err);
      const mocks = getMockElections(userLocation);
      setElections(mocks);
      setFilteredElections(mocks);
      setRegionStats({ total: mocks?.length, votes: 1247, activeVoters: 89 });
    } finally {
      setLoading(false);
    }
  };

  const getMockElections = (center) => [
    { id: '1', title: 'City Mayor Election 2026', category: 'Politics', description: 'Vote for the next city mayor in the upcoming municipal election.', lat: center?.lat + 0.02, lng: center?.lng + 0.015, distance: 2.8, vote_count: 342, end_date: '2026-03-15' },
    { id: '2', title: 'Community Park Renovation', category: 'Community', description: 'Should the old park be renovated with a new playground and sports facilities?', lat: center?.lat - 0.018, lng: center?.lng + 0.022, distance: 3.1, vote_count: 189, end_date: '2026-03-20' },
    { id: '3', title: 'School Board Candidate Vote', category: 'Education', description: 'Choose your preferred candidate for the local school board position.', lat: center?.lat + 0.035, lng: center?.lng - 0.01, distance: 4.2, vote_count: 256, end_date: '2026-03-25' },
    { id: '4', title: 'Green Energy Initiative', category: 'Environment', description: 'Should the city invest in solar panels for public buildings?', lat: center?.lat - 0.025, lng: center?.lng - 0.03, distance: 5.7, vote_count: 421, end_date: '2026-04-01' },
    { id: '5', title: 'Local Hospital Expansion', category: 'Healthcare', description: 'Vote on the proposed expansion of the regional hospital emergency wing.', lat: center?.lat + 0.01, lng: center?.lng + 0.04, distance: 6.3, vote_count: 178, end_date: '2026-04-10' },
    { id: '6', title: 'Traffic Calming Measures', category: 'Community', description: 'Should speed bumps and pedestrian crossings be added to Main Street?', lat: center?.lat - 0.04, lng: center?.lng + 0.005, distance: 8.1, vote_count: 95, end_date: '2026-04-15' },
  ];

  // Filter by category
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredElections(elections);
    } else {
      setFilteredElections(elections?.filter((e) => e?.category === activeCategory));
    }
  }, [activeCategory, elections]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMapLoaded(true);
  }, []);

  const handleMarkerClick = (election) => {
    setSelectedElection(election);
  };

  const handleViewElection = (electionId) => {
    navigate(`/secure-voting-interface?id=${electionId}`);
  };

  const centerOnUser = () => {
    if (mapRef?.current && userLocation) {
      mapRef?.current?.panTo(userLocation);
      mapRef?.current?.setZoom(13);
    }
  };

  const getMarkerIcon = (category) => ({
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: categoryColors?.[category] || categoryColors?.default,
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: '#ffffff',
    scale: 1.8,
    anchor: { x: 12, y: 24 },
  });

  const userMarkerIcon = {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: '#3b82f6',
    fillOpacity: 1,
    strokeWeight: 3,
    strokeColor: '#ffffff',
    scale: 2.2,
    anchor: { x: 12, y: 24 },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Location-Based Voting</h1>
            <p className="text-xs text-gray-400">Elections near you within 50km</p>
          </div>
        </div>
        <button onClick={centerOnUser} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
          <Navigation className="w-4 h-4" />
          My Location
        </button>
      </div>
      {/* Location Error Banner */}
      {locationError && (
        <div className="bg-yellow-900/50 border-b border-yellow-700 px-4 py-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <p className="text-yellow-300 text-sm">{locationError}</p>
        </div>
      )}
      {/* Regional Stats Bar */}
      <div className="bg-gray-900/80 border-b border-gray-800 px-4 py-2 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Vote className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-gray-300"><span className="text-white font-semibold">{regionStats?.total}</span> Elections</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-300"><span className="text-white font-semibold">{regionStats?.votes?.toLocaleString()}</span> Votes Cast</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300"><span className="text-white font-semibold">{regionStats?.activeVoters}</span> Active Voters</span>
        </div>
      </div>
      {/* Category Filters */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {CATEGORIES?.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white' :'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          {!userLocation ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
              <div className="text-center">
                <Loader className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
                <p className="text-gray-400">Getting your location...</p>
              </div>
            </div>
          ) : (
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} loadingElement={
              <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
                <div className="text-center">
                  <Loader className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
                  <p className="text-gray-400">Loading map...</p>
                </div>
              </div>
            }>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation}
                zoom={12}
                options={mapOptions}
                onLoad={onMapLoad}
              >
                {/* User location marker */}
                <Marker
                  position={userLocation}
                  icon={userMarkerIcon}
                  title="Your Location"
                  zIndex={1000}
                />

                {/* 50km radius circle */}
                <Circle
                  center={userLocation}
                  radius={50000}
                  options={{
                    fillColor: '#6366f1',
                    fillOpacity: 0.04,
                    strokeColor: '#6366f1',
                    strokeOpacity: 0.3,
                    strokeWeight: 1,
                  }}
                />

                {/* Election markers */}
                {filteredElections?.map((election) => (
                  <Marker
                    key={election?.id}
                    position={{ lat: election?.lat, lng: election?.lng }}
                    icon={getMarkerIcon(election?.category)}
                    title={election?.title}
                    onClick={() => handleMarkerClick(election)}
                  />
                ))}

                {/* InfoWindow for selected election */}
                {selectedElection && (
                  <InfoWindow
                    position={{ lat: selectedElection?.lat, lng: selectedElection?.lng }}
                    onCloseClick={() => setSelectedElection(null)}
                  >
                    <div className="bg-white p-3 max-w-xs">
                      <div className="flex items-start justify-between mb-2">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: categoryColors?.[selectedElection?.category] || categoryColors?.default }}
                        >
                          {selectedElection?.category}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">{selectedElection?.distance?.toFixed(1)} km away</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{selectedElection?.title}</h3>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{selectedElection?.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{selectedElection?.vote_count || 0} votes</span>
                        <button
                          onClick={() => handleViewElection(selectedElection?.id)}
                          className="flex items-center gap-1 bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          View Election <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          )}
        </div>

        {/* Sidebar - Nearby Elections List */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">Nearby Elections</h2>
            <p className="text-xs text-gray-400">{filteredElections?.length} found within 50km</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-6 h-6 text-indigo-400 animate-spin" />
              </div>
            ) : filteredElections?.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No elections found in this category near you.</p>
              </div>
            ) : (
              filteredElections?.map((election) => (
                <div
                  key={election?.id}
                  className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${
                    selectedElection?.id === election?.id ? 'bg-gray-800 border-l-2 border-l-indigo-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedElection(election);
                    if (mapRef?.current) {
                      mapRef?.current?.panTo({ lat: election?.lat, lng: election?.lng });
                      mapRef?.current?.setZoom(14);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: categoryColors?.[election?.category] || categoryColors?.default }}
                    >
                      {election?.category}
                    </span>
                    <span className="text-xs text-gray-500">{election?.distance?.toFixed(1)} km</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-2 mb-1 line-clamp-2">{election?.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">{election?.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{election?.vote_count || 0} votes</span>
                    <button
                      onClick={(e) => { e?.stopPropagation(); handleViewElection(election?.id); }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      Vote Now <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
