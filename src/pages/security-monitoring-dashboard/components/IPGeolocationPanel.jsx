import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Shield } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const IPGeolocationPanel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGeolocationEvents = async () => {
    try {
      const { data, error } = await supabase?.from('security_events')?.select('*')?.in('event_type', ['blocked_country_attempt', 'high_risk_country_access'])?.order('created_at', { ascending: false })?.limit(10);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching geolocation events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeolocationEvents();
    const interval = setInterval(fetchGeolocationEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">IP Geolocation & Access Controls</h2>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {events?.length || 0} Events
        </span>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading events...</div>
      ) : events?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-3 text-green-500" />
          <p>No geolocation security events</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events?.map((event) => (
            <div
              key={event?.id}
              className={`flex items-start gap-4 p-4 rounded-lg border ${
                event?.event_type === 'blocked_country_attempt' ?'bg-red-50 border-red-200' :'bg-yellow-50 border-yellow-200'
              }`}
            >
              <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                event?.event_type === 'blocked_country_attempt' ? 'text-red-600' : 'text-yellow-600'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">
                    {event?.country} - {event?.region}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(event?.created_at)?.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  {event?.event_type === 'blocked_country_attempt' ? 'Access Blocked' : 'High-Risk Access'}
                </p>
                <p className="text-sm text-gray-600">IP: {event?.ip_address}</p>
                {event?.reason && (
                  <p className="text-xs text-gray-500 mt-2">{event?.reason}</p>
                )}
                {event?.blocked && (
                  <span className="inline-block mt-2 px-2 py-1 bg-red-200 text-red-800 text-xs rounded">
                    ✓ Blocked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IPGeolocationPanel;