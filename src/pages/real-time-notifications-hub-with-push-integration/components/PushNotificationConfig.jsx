import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PushNotificationConfig = ({ pushEnabled, onTogglePush }) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            pushEnabled ? 'bg-green-500/10' : 'bg-muted'
          }`}>
            <Icon name="Bell" size={24} className={pushEnabled ? 'text-green-500' : 'text-muted-foreground'} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Push Notifications</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {pushEnabled
                ? 'Receive instant browser notifications for votes, messages, and achievements'
                : 'Enable push notifications to stay updated in real-time'}
            </p>
            {pushEnabled && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <Icon name="CheckCircle" size={16} />
                  <span>Browser Alerts</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <Icon name="CheckCircle" size={16} />
                  <span>Desktop Notifications</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <Icon name="CheckCircle" size={16} />
                  <span>Mobile Alerts</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <Button
          variant={pushEnabled ? 'outline' : 'primary'}
          onClick={onTogglePush}
          iconName={pushEnabled ? 'BellOff' : 'Bell'}
        >
          {pushEnabled ? 'Enabled' : 'Enable Push'}
        </Button>
      </div>
    </div>
  );
};

export default PushNotificationConfig;