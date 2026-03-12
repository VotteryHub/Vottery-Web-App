import React, { useState, useEffect } from 'react';
import { Activity, Users, Shield } from 'lucide-react';

const VoteManipulationPanel = ({ trackEvent }) => {
  const [manipulationEvents, setManipulationEvents] = useState([
    {
      id: 1,
      type: 'coordinated_voting',
      electionId: 'election-123',
      electionTitle: 'Best Product Design 2026',
      suspiciousVotes: 45,
      confidence: 92,
      timestamp: new Date()?.toISOString()
    },
    {
      id: 2,
      type: 'bot_detection',
      electionId: 'election-456',
      electionTitle: 'Community Choice Awards',
      suspiciousVotes: 23,
      confidence: 78,
      timestamp: new Date(Date.now() - 5400000)?.toISOString()
    }
  ]);

  useEffect(() => {
    trackEvent?.('security_panel_view', {
      panel_name: 'vote_manipulation_monitoring',
      event_count: manipulationEvents?.length
    });
  }, []);

  const handleInvestigate = (event) => {
    trackEvent?.('vote_manipulation_investigate', {
      event_type: event?.type,
      election_id: event?.electionId,
      suspicious_votes: event?.suspiciousVotes,
      confidence: event?.confidence
    });
    alert(`Investigating ${event?.type} in election: ${event?.electionTitle}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-900">Vote Manipulation Monitoring</h2>
        </div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
          {manipulationEvents?.length || 0} Detected
        </span>
      </div>
      <div className="space-y-4">
        {manipulationEvents?.map((event) => (
          <div
            key={event?.id}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {event?.type?.replace(/_/g, ' ')?.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{event?.electionTitle}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-yellow-600" />
                  <span className="text-lg font-bold text-yellow-600">{event?.confidence}%</span>
                </div>
                <span className="text-xs text-gray-600">Confidence</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{event?.suspiciousVotes} suspicious votes</span>
                <span>{new Date(event?.timestamp)?.toLocaleString()}</span>
              </div>
              <button
                onClick={() => handleInvestigate(event)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Investigate
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Tracking:</strong> Coordinated voting patterns, bot detection algorithms, electoral integrity 
          violations with blockchain verification and cryptographic validation
        </p>
      </div>
    </div>
  );
};

export default VoteManipulationPanel;