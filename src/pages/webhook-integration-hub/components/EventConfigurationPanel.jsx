import React, { useState } from 'react';
import { Activity, CheckCircle } from 'lucide-react';
import { webhookService } from '../../../services/webhookService';

const EventConfigurationPanel = () => {
  const [supportedEvents] = useState(webhookService?.getSupportedEvents());
  const [selectedEvents, setSelectedEvents] = useState([]);

  const toggleEvent = (eventId) => {
    setSelectedEvents(prev => 
      prev?.includes(eventId) 
        ? prev?.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-purple-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Configuration</h2>
          <p className="text-gray-600">Manage triggerable events with customizable payload templates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supportedEvents?.map((event) => (
          <div
            key={event?.id}
            onClick={() => toggleEvent(event?.id)}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedEvents?.includes(event?.id)
                ? 'border-purple-500 bg-purple-50' :'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{event?.name}</h3>
                <p className="text-sm text-gray-600">{event?.description}</p>
              </div>
              {selectedEvents?.includes(event?.id) && (
                <CheckCircle className="w-6 h-6 text-purple-500" />
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Event ID: <code className="text-purple-600">{event?.id}</code></p>
            </div>
          </div>
        ))}
      </div>

      {selectedEvents?.length > 0 && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            Selected Events ({selectedEvents?.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedEvents?.map((eventId) => {
              const event = supportedEvents?.find(e => e?.id === eventId);
              return (
                <span key={eventId} className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs">
                  {event?.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventConfigurationPanel;