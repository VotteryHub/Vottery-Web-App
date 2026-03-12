import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, Users } from 'lucide-react';

import { useAuth } from '../../../contexts/AuthContext';

const EventSchedulingPanel = ({ groupId, isModerator }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([
    { id: '1', title: 'Weekly Group Discussion', date: new Date(Date.now() + 2 * 86400000)?.toISOString(), time: '7:00 PM EST', location: 'Virtual', attendees: 45 },
    { id: '2', title: 'Election Strategy Workshop', date: new Date(Date.now() + 7 * 86400000)?.toISOString(), time: '3:00 PM EST', location: 'Virtual', attendees: 23 },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: 'Virtual' });

  const handleCreateEvent = async () => {
    if (!newEvent?.title || !newEvent?.date) return;
    try {
      const event = {
        id: Date.now()?.toString(),
        ...newEvent,
        attendees: 1,
        date: new Date(newEvent.date)?.toISOString()
      };
      setEvents(prev => [event, ...prev]);
      setNewEvent({ title: '', date: '', time: '', location: 'Virtual' });
      setShowCreate(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-gray-900 dark:text-white">Group Events</h3>
        </div>
        {isModerator && (
          <button
            onClick={() => setShowCreate(p => !p)}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-3 h-3" /> Schedule Event
          </button>
        )}
      </div>
      {showCreate && (
        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700 space-y-3">
          <input
            type="text"
            placeholder="Event title"
            value={newEvent?.title}
            onChange={e => setNewEvent(p => ({ ...p, title: e?.target?.value }))}
            className="w-full p-2 border border-indigo-200 rounded-lg text-sm bg-white dark:bg-gray-800"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={newEvent?.date}
              onChange={e => setNewEvent(p => ({ ...p, date: e?.target?.value }))}
              className="p-2 border border-indigo-200 rounded-lg text-sm bg-white dark:bg-gray-800"
            />
            <input
              type="time"
              value={newEvent?.time}
              onChange={e => setNewEvent(p => ({ ...p, time: e?.target?.value }))}
              className="p-2 border border-indigo-200 rounded-lg text-sm bg-white dark:bg-gray-800"
            />
          </div>
          <input
            type="text"
            placeholder="Location (Virtual / Address)"
            value={newEvent?.location}
            onChange={e => setNewEvent(p => ({ ...p, location: e?.target?.value }))}
            className="w-full p-2 border border-indigo-200 rounded-lg text-sm bg-white dark:bg-gray-800"
          />
          <div className="flex gap-2">
            <button onClick={handleCreateEvent} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Create Event</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {events?.map(event => (
          <div key={event?.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{event?.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(event.date)?.toLocaleDateString()} {event?.time}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {event?.location}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-indigo-600">
                <Users className="w-3 h-3" />
                {event?.attendees}
              </div>
            </div>
            <button className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-200 transition-colors">
              RSVP
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSchedulingPanel;
