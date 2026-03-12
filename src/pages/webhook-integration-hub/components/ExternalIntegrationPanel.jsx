import React from 'react';
import { Link, CheckCircle, XCircle } from 'lucide-react';

const ExternalIntegrationPanel = () => {
  const integrations = [
    {
      id: 1,
      name: 'Stripe Payment Processor',
      type: 'payment',
      status: 'connected',
      description: 'Automated prize payouts and participation fee processing',
      events: ['payment.received', 'payout.completed']
    },
    {
      id: 2,
      name: 'Twilio SMS Notifications',
      type: 'notification',
      status: 'connected',
      description: 'Send SMS alerts for lottery draws and winner announcements',
      events: ['draw.completed', 'winner.announced']
    },
    {
      id: 3,
      name: 'Google Analytics',
      type: 'analytics',
      status: 'connected',
      description: 'Track lottery participation and conversion metrics',
      events: ['vote.cast', 'election.created']
    },
    {
      id: 4,
      name: 'Slack Workspace',
      type: 'communication',
      status: 'disconnected',
      description: 'Real-time notifications to team channels',
      events: []
    },
    {
      id: 5,
      name: 'Zapier Automation',
      type: 'automation',
      status: 'disconnected',
      description: 'Connect to 5000+ apps with automated workflows',
      events: []
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link className="w-6 h-6 text-purple-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">External Integrations</h2>
          <p className="text-gray-600">Connected services with connection status monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations?.map((integration) => (
          <div key={integration?.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{integration?.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{integration?.description}</p>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {integration?.type}
                </span>
              </div>
              {integration?.status === 'connected' ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {integration?.events?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Subscribed Events:</p>
                <div className="flex flex-wrap gap-1">
                  {integration?.events?.map((event) => (
                    <span key={event} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              className={`mt-4 w-full px-4 py-2 rounded-lg transition-colors ${
                integration?.status === 'connected' ?'bg-red-100 text-red-700 hover:bg-red-200' :'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              {integration?.status === 'connected' ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExternalIntegrationPanel;