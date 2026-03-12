import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { googleAnalyticsService } from '../../../services/googleAnalyticsService';

const CustomEventsPanel = ({ timeRange }) => {
  const [customEvents, setCustomEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    category: '',
    parameters: []
  });

  useEffect(() => {
    loadCustomEvents();
  }, [timeRange]);

  const loadCustomEvents = async () => {
    setLoading(true);
    try {
      const mockData = [
        {
          name: 'election_created',
          category: 'Election',
          totalEvents: 1234,
          uniqueUsers: 987,
          avgValue: 0,
          topParameters: [
            { param: 'election_type', value: 'plurality', count: 567 },
            { param: 'election_type', value: 'ranked_choice', count: 445 },
            { param: 'election_type', value: 'approval', count: 222 }
          ]
        },
        {
          name: 'vote_cast',
          category: 'Engagement',
          totalEvents: 25678,
          uniqueUsers: 15432,
          avgValue: 0,
          topParameters: [
            { param: 'voting_method', value: 'plurality', count: 12456 },
            { param: 'voting_method', value: 'ranked_choice', count: 8765 },
            { param: 'voting_method', value: 'approval', count: 4457 }
          ]
        },
        {
          name: 'payment_processed',
          category: 'Revenue',
          totalEvents: 3456,
          uniqueUsers: 2987,
          avgValue: 125.50,
          topParameters: [
            { param: 'payment_method', value: 'stripe', count: 2345 },
            { param: 'payment_method', value: 'wallet', count: 1111 }
          ]
        },
        {
          name: 'social_share',
          category: 'Virality',
          totalEvents: 8765,
          uniqueUsers: 5432,
          avgValue: 0,
          topParameters: [
            { param: 'platform', value: 'whatsapp', count: 3456 },
            { param: 'platform', value: 'facebook', count: 2345 },
            { param: 'platform', value: 'twitter', count: 1876 },
            { param: 'platform', value: 'linkedin', count: 1088 }
          ]
        }
      ];

      setCustomEvents(mockData);
    } catch (error) {
      console.error('Error loading custom events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    // Track custom event creation
    googleAnalyticsService?.trackUserFlow('analytics_center', 'custom_event_created', {
      event_name: newEvent?.name,
      event_category: newEvent?.category
    });

    setShowCreateModal(false);
    setNewEvent({ name: '', category: '', parameters: [] });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Custom Event Tracking
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure and monitor custom events across the platform
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Icon name="Plus" size={16} />
          Create Custom Event
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {customEvents?.map((event, index) => (
          <div key={index} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-foreground mb-1">{event?.name}</h4>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
                  {event?.category}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Icon name="Edit" size={16} className="text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                  <Icon name="Trash2" size={16} className="text-destructive" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Total Events</p>
                <p className="text-2xl font-bold text-foreground">
                  {event?.totalEvents?.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Unique Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {event?.uniqueUsers?.toLocaleString()}
                </p>
              </div>
              {event?.avgValue > 0 && (
                <div className="p-4 bg-background rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Avg Value</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{event?.avgValue?.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h5 className="text-sm font-medium text-foreground mb-3">Top Parameters</h5>
              <div className="space-y-2">
                {event?.topParameters?.map((param, paramIndex) => (
                  <div key={paramIndex} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{param?.param}:</span>
                      <span className="text-sm font-medium text-foreground">{param?.value}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {param?.count?.toLocaleString()} events
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Custom Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Create Custom Event
              </h3>
              <button onClick={() => setShowCreateModal(false)}>
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={newEvent?.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e?.target?.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., button_click, form_submit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={newEvent?.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e?.target?.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select category</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Election">Election</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Virality">Virality</option>
                  <option value="Navigation">Navigation</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowCreateModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEvent}
                  className="flex-1"
                  disabled={!newEvent?.name || !newEvent?.category}
                >
                  Create Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomEventsPanel;