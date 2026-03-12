import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GlobalTogglePanel = ({ settings, onToggleSystem, onEmergencyFreeze }) => {
  const isSystemEnabled = settings?.isEnabled;
  const isEmergencyFrozen = settings?.emergencyFreeze;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Global Toggle Controls
          </h2>
          <p className="text-sm text-muted-foreground">
            Master switches for content distribution system
          </p>
        </div>
        <Icon name="Power" size={24} className="text-primary" />
      </div>

      <div className="space-y-4">
        {/* System Master Toggle */}
        <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  name={isSystemEnabled ? 'ToggleRight' : 'ToggleLeft'}
                  size={24}
                  className={isSystemEnabled ? 'text-success' : 'text-muted-foreground'}
                />
                <h3 className="text-base font-heading font-semibold text-foreground">
                  Distribution System
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {isSystemEnabled
                  ? 'System is actively controlling content distribution based on your settings' :'System is paused - content distribution follows natural algorithm'}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className={`w-2 h-2 rounded-full ${
                  isSystemEnabled ? 'bg-success animate-pulse' : 'bg-muted'
                }`} />
                <span className="text-xs font-medium text-foreground">
                  Status: {isSystemEnabled ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>
            <Button
              variant={isSystemEnabled ? 'destructive' : 'default'}
              size="md"
              iconName={isSystemEnabled ? 'Pause' : 'Play'}
              onClick={() => onToggleSystem?.(!isSystemEnabled)}
            >
              {isSystemEnabled ? 'Pause System' : 'Activate System'}
            </Button>
          </div>
        </div>

        {/* Emergency Content Freeze */}
        <div className="p-4 rounded-lg border-2 border-destructive/20 bg-destructive/5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  name="AlertTriangle"
                  size={24}
                  className={isEmergencyFrozen ? 'text-destructive' : 'text-warning'}
                />
                <h3 className="text-base font-heading font-semibold text-foreground">
                  Emergency Content Freeze
                </h3>
                {isEmergencyFrozen && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-destructive text-white animate-pulse">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {isEmergencyFrozen
                  ? 'Emergency freeze is active - all content distribution is locked at current ratios' :'Instantly freeze content distribution at current percentages during critical events'}
              </p>
              {isEmergencyFrozen && (
                <div className="mt-3 p-2 rounded bg-destructive/10 border border-destructive/20">
                  <p className="text-xs font-medium text-destructive">
                    ⚠️ Content ratios are locked. No automatic adjustments will be made until freeze is lifted.
                  </p>
                </div>
              )}
            </div>
            <Button
              variant={isEmergencyFrozen ? 'default' : 'destructive'}
              size="md"
              iconName={isEmergencyFrozen ? 'Unlock' : 'Lock'}
              onClick={() => onEmergencyFreeze?.(!isEmergencyFrozen)}
            >
              {isEmergencyFrozen ? 'Lift Freeze' : 'Activate Freeze'}
            </Button>
          </div>
        </div>

        {/* System-wide Content Filtering */}
        <div className="p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Filter" size={20} className="text-primary" />
                <h3 className="text-base font-heading font-semibold text-foreground">
                  Content Filtering
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced filtering rules are active across all content types
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-success">Active</span>
              <div className="w-2 h-2 rounded-full bg-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">System Status Summary</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Icon
                  name={isSystemEnabled ? 'CheckCircle' : 'Circle'}
                  size={14}
                  className={isSystemEnabled ? 'text-success' : 'text-muted-foreground'}
                />
                <span className="text-xs text-muted-foreground">
                  Distribution Control: <span className="font-medium text-foreground">
                    {isSystemEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  name={isEmergencyFrozen ? 'AlertCircle' : 'Circle'}
                  size={14}
                  className={isEmergencyFrozen ? 'text-destructive' : 'text-muted-foreground'}
                />
                <span className="text-xs text-muted-foreground">
                  Emergency Freeze: <span className="font-medium text-foreground">
                    {isEmergencyFrozen ? 'Active' : 'Inactive'}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle" size={14} className="text-success" />
                <span className="text-xs text-muted-foreground">
                  Content Filtering: <span className="font-medium text-foreground">Active</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTogglePanel;