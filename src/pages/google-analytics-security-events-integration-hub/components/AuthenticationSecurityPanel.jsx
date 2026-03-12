import React, { useState, useEffect } from 'react';
import { Shield, UserX, MapPin } from 'lucide-react';

const AuthenticationSecurityPanel = ({ trackEvent }) => {
  const [authEvents, setAuthEvents] = useState([
    {
      id: 1,
      type: 'credential_stuffing',
      severity: 'high',
      location: 'Unknown Location',
      ip: '192.168.1.100',
      timestamp: new Date()?.toISOString(),
      details: 'Multiple failed login attempts with different passwords'
    },
    {
      id: 2,
      type: 'suspicious_login',
      severity: 'medium',
      location: 'New York, US',
      ip: '203.0.113.45',
      timestamp: new Date(Date.now() - 3600000)?.toISOString(),
      details: 'Login from new device and location'
    }
  ]);

  useEffect(() => {
    // Track authentication security panel view
    trackEvent?.('security_panel_view', {
      panel_name: 'authentication_security',
      event_count: authEvents?.length
    });
  }, []);

  const handleInvestigate = (event) => {
    trackEvent?.('security_event_investigate', {
      event_type: event?.type,
      event_id: event?.id,
      severity: event?.severity
    });
    alert(`Investigating ${event?.type} event...`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">Authentication Security</h2>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          {authEvents?.length || 0} Anomalies
        </span>
      </div>
      <div className="space-y-4">
        {authEvents?.map((event) => (
          <div
            key={event?.id}
            className={`p-4 rounded-lg border ${
              event?.severity === 'high' ?'bg-red-50 border-red-200' :'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <UserX className={`w-5 h-5 ${
                  event?.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <div>
                  <p className="font-semibold text-gray-900">
                    {event?.type?.replace(/_/g, ' ')?.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{event?.details}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                event?.severity === 'high' ?'bg-red-200 text-red-800' :'bg-yellow-200 text-yellow-800'
              }`}>
                {event?.severity?.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{event?.location}</span>
              </div>
              <span>IP: {event?.ip}</span>
              <span>{new Date(event?.timestamp)?.toLocaleString()}</span>
            </div>

            <button
              onClick={() => handleInvestigate(event)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Investigate
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Tracking:</strong> Suspicious login attempts, credential stuffing attacks, MFA bypasses, 
          account takeover indicators with geographic correlation and device fingerprinting
        </p>
      </div>
    </div>
  );
};

export default AuthenticationSecurityPanel;