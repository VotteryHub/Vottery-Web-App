import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { platformMonitoringService } from '../../../services/platformMonitoringService';

const CustomEventTrackingPanel = () => {
  const [eventConfig, setEventConfig] = useState({
    eventName: '',
    eventType: 'behavioral',
    parameters: {},
    threshold: ''
  });
  const [tracking, setTracking] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const eventTypes = [
    { value: 'behavioral', label: 'Behavioral Trigger', icon: 'Activity' },
    { value: 'milestone', label: 'Engagement Milestone', icon: 'Award' },
    { value: 'business', label: 'Business Metric', icon: 'TrendingUp' },
    { value: 'performance', label: 'Performance Threshold', icon: 'Zap' }
  ];

  const predefinedEvents = [
    {
      name: 'high_value_transaction',
      type: 'business',
      description: 'Track transactions above $1000',
      parameters: { amount_threshold: 1000, currency: 'USD' },
      threshold: '1000'
    },
    {
      name: 'campaign_milestone',
      type: 'milestone',
      description: 'Track when campaign reaches 10,000 impressions',
      parameters: { impressions_threshold: 10000 },
      threshold: '10000'
    },
    {
      name: 'fraud_pattern_detected',
      type: 'behavioral',
      description: 'Alert when suspicious voting pattern identified',
      parameters: { confidence_threshold: 0.8 },
      threshold: '0.8'
    },
    {
      name: 'conversion_spike',
      type: 'performance',
      description: 'Track sudden increase in conversion rate',
      parameters: { rate_increase_threshold: 20 },
      threshold: '20'
    }
  ];

  const handleTrackEvent = async () => {
    if (!eventConfig?.eventName || !eventConfig?.threshold) {
      alert('Please fill in event name and threshold');
      return;
    }

    try {
      setTracking(true);
      const { data, error } = await platformMonitoringService?.trackCustomEvent(eventConfig);
      
      if (error) throw new Error(error?.message);
      
      setSuccessMessage(`Event "${eventConfig?.eventName}" tracked successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset form
      setEventConfig({
        eventName: '',
        eventType: 'behavioral',
        parameters: {},
        threshold: ''
      });
    } catch (error) {
      console.error('Failed to track event:', error);
      alert('Failed to track event: ' + error?.message);
    } finally {
      setTracking(false);
    }
  };

  const loadPredefinedEvent = (event) => {
    setEventConfig({
      eventName: event?.name,
      eventType: event?.type,
      parameters: event?.parameters,
      threshold: event?.threshold
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground mb-1">
            Custom Event Tracking Configuration
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure behavioral triggers, engagement milestones, and business-critical metrics with automated alerts
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
            <Icon name="CheckCircle" size={20} className="text-green-500" />
            <p className="text-sm text-green-500">{successMessage}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Event Name
            </label>
            <Input
              type="text"
              placeholder="e.g., high_value_transaction"
              value={eventConfig?.eventName}
              onChange={(e) => setEventConfig({ ...eventConfig, eventName: e?.target?.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Event Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {eventTypes?.map((type) => (
                <button
                  key={type?.value}
                  onClick={() => setEventConfig({ ...eventConfig, eventType: type?.value })}
                  className={`p-3 rounded-lg border transition-all duration-250 ${
                    eventConfig?.eventType === type?.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:border-primary/50'
                  }`}
                >
                  <Icon name={type?.icon} size={20} className="mx-auto mb-1" />
                  <p className="text-xs font-medium">{type?.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Alert Threshold
            </label>
            <Input
              type="text"
              placeholder="e.g., 1000 or 0.8"
              value={eventConfig?.threshold}
              onChange={(e) => setEventConfig({ ...eventConfig, threshold: e?.target?.value })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Set the threshold value that triggers the event tracking
            </p>
          </div>

          <Button
            onClick={handleTrackEvent}
            disabled={tracking}
            iconName={tracking ? 'Loader' : 'Play'}
            className="w-full"
          >
            {tracking ? 'Tracking Event...' : 'Track Custom Event'}
          </Button>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Predefined Event Templates
        </h3>
        <div className="space-y-3">
          {predefinedEvents?.map((event, index) => (
            <div key={index} className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      name={eventTypes?.find(t => t?.value === event?.type)?.icon || 'Activity'}
                      size={16}
                      className="text-primary"
                    />
                    <p className="text-sm font-semibold text-foreground">{event?.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {event?.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{event?.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Target" size={12} />
                    <span>Threshold: {event?.threshold}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadPredefinedEvent(event)}
                >
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Event Tracking Best Practices
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Icon name="Info" size={20} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-500 mb-1">Use Descriptive Names</p>
              <p className="text-xs text-muted-foreground">
                Choose clear, descriptive event names that indicate what action or milestone is being tracked.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Icon name="Target" size={20} className="text-purple-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-500 mb-1">Set Meaningful Thresholds</p>
              <p className="text-xs text-muted-foreground">
                Define thresholds based on business objectives and historical data to avoid alert fatigue.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <Icon name="Zap" size={20} className="text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-500 mb-1">Monitor Event Performance</p>
              <p className="text-xs text-muted-foreground">
                Regularly review tracked events to ensure they provide actionable insights and adjust as needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomEventTrackingPanel;