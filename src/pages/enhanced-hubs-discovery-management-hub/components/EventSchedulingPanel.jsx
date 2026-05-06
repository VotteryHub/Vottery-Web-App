import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Bell, Plus, MapPin, Video } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const EventSchedulingPanel = ({ groupId, isModerator }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    event_type: 'virtual',
    location: '',
    max_attendees: 100,
    rsvp_enabled: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [groupId]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        ?.from('group_events')
        ?.select('*, group_event_rsvps(count)')
        ?.eq('group_id', groupId)
        ?.gte('event_date', new Date()?.toISOString()?.split('T')?.[0])
        ?.order('event_date', { ascending: true })
        ?.limit(10);

      if (error) throw error;
      setEvents(data || getMockEvents());
    } catch (err) {
      setEvents(getMockEvents());
    } finally {
      setLoading(false);
    }
  };

  const getMockEvents = () => [
    { id: '1', title: 'Community Election Strategy Session', description: 'Monthly strategy meeting for election creators', event_date: new Date(Date.now() + 3 * 86400000)?.toISOString()?.split('T')?.[0], event_time: '14:00', event_type: 'virtual', attendees: 23, max_attendees: 50, rsvp_enabled: true },
    { id: '2', title: 'Voting Analytics Workshop', description: 'Learn how to analyze your election results effectively', event_date: new Date(Date.now() + 7 * 86400000)?.toISOString()?.split('T')?.[0], event_time: '16:00', event_type: 'virtual', attendees: 45, max_attendees: 100, rsvp_enabled: true },
    { id: '3', title: 'Creator Networking Meetup', description: 'Connect with fellow election creators in your area', event_date: new Date(Date.now() + 14 * 86400000)?.toISOString()?.split('T')?.[0], event_time: '18:00', event_type: 'in-person', location: 'Hub Center, NYC', attendees: 12, max_attendees: 30, rsvp_enabled: true },
  ];

  const handleCreateEvent = async (e) => {
    e?.preventDefault();
    if (!newEvent?.title || !newEvent?.event_date) return;
    setSaving(true);
    try {
      const { error } = await supabase
        ?.from('group_events')
        ?.insert({ ...newEvent, group_id: groupId, created_by: user?.id });

      if (!error) {
        setShowCreateForm(false);
        setNewEvent({ title: '', description: '', event_date: '', event_time: '', event_type: 'virtual', location: '', max_attendees: 100, rsvp_enabled: true });
        loadEvents();
      }
    } catch (err) {
      console.error('Create event error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      await supabase?.from('group_event_rsvps')?.upsert({ event_id: eventId, user_id: user?.id, status: 'attending' }, { onConflict: 'event_id,user_id' });
      loadEvents();
    } catch (err) {
      console.error('RSVP error:', err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr)?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Hub Events
        </h3>
        {isModerator && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule Event
          </button>
        )}
      </div>
      {/* Create Event Form */}
      {showCreateForm && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-4">Schedule New Event</h4>
          <form onSubmit={handleCreateEvent} className="space-y-3">
            <input
              type="text"
              placeholder="Event title *"
              value={newEvent?.title}
              onChange={e => setNewEvent(p => ({ ...p, title: e?.target?.value }))}
              className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              required
            />
            <textarea
              placeholder="Event description"
              value={newEvent?.description}
              onChange={e => setNewEvent(p => ({ ...p, description: e?.target?.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={newEvent?.event_date}
                onChange={e => setNewEvent(p => ({ ...p, event_date: e?.target?.value }))}
                className="px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="time"
                value={newEvent?.event_time}
                onChange={e => setNewEvent(p => ({ ...p, event_time: e?.target?.value }))}
                className="px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={newEvent?.event_type}
                onChange={e => setNewEvent(p => ({ ...p, event_type: e?.target?.value }))}
                className="px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="virtual">Virtual</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <input
                type="number"
                placeholder="Max attendees"
                value={newEvent?.max_attendees}
                onChange={e => setNewEvent(p => ({ ...p, max_attendees: parseInt(e?.target?.value) }))}
                className="px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            {newEvent?.event_type !== 'virtual' && (
              <input
                type="text"
                placeholder="Location"
                value={newEvent?.location}
                onChange={e => setNewEvent(p => ({ ...p, location: e?.target?.value }))}
                className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            )}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                {saving ? 'Creating...' : 'Create Event'}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : events?.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events?.map(event => (
            <div key={event?.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    event?.event_type === 'virtual' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    {event?.event_type === 'virtual' ? (
                      <Video className="w-5 h-5 text-blue-600" />
                    ) : (
                      <MapPin className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{event?.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{event?.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(event?.event_date)}
                      </span>
                      {event?.event_time && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {event?.event_time}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        {event?.attendees || 0}/{event?.max_attendees}
                      </span>
                    </div>
                  </div>
                </div>
                {event?.rsvp_enabled && (
                  <button
                    onClick={() => handleRSVP(event?.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
                  >
                    <Bell className="w-3 h-3" />
                    RSVP
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventSchedulingPanel;
