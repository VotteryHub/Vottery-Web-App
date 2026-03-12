import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MixingSchedulePanel = () => {
  const [schedules, setSchedules] = useState([
    { id: 1, time: '00:00', frequency: 'Every 15 minutes', status: 'active', nextRun: '2026-01-23T20:45:00Z' },
    { id: 2, time: '06:00', frequency: 'Every 30 minutes', status: 'active', nextRun: '2026-01-24T06:30:00Z' },
    { id: 3, time: '12:00', frequency: 'Every 10 minutes', status: 'active', nextRun: '2026-01-23T20:40:00Z' },
    { id: 4, time: '18:00', frequency: 'Every 20 minutes', status: 'paused', nextRun: null }
  ]);

  const handleToggleSchedule = (id) => {
    setSchedules(schedules?.map(schedule => 
      schedule?.id === id 
        ? { ...schedule, status: schedule?.status === 'active' ? 'paused' : 'active' }
        : schedule
    ));
  };

  return (
    <div className="space-y-6">
      {/* Automated Mixing Schedules */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Automated Mixing Schedules</h3>
            <p className="text-sm text-muted-foreground">Configure periodic anonymization operations</p>
          </div>
        </div>

        <div className="space-y-3">
          {schedules?.map((schedule) => (
            <div key={schedule?.id} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    schedule?.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">Schedule {schedule?.id}</p>
                    <p className="text-xs text-muted-foreground">{schedule?.frequency}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleSchedule(schedule?.id)}
                >
                  {schedule?.status === 'active' ? 'Pause' : 'Resume'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Start Time</p>
                  <p className="text-sm font-medium text-foreground">{schedule?.time}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Next Run</p>
                  <p className="text-sm font-medium text-foreground">
                    {schedule?.nextRun ? new Date(schedule?.nextRun)?.toLocaleTimeString() : 'Paused'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node Performance Optimization */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Node Performance Optimization</h3>
            <p className="text-sm text-muted-foreground">Automatic load balancing and failover</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Load Balancing Enabled</p>
              <p className="text-xs text-muted-foreground">Distributes votes across active nodes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Automatic Failover</p>
              <p className="text-xs text-muted-foreground">Switches to standby nodes on failure</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Health Monitoring</p>
              <p className="text-xs text-muted-foreground">Real-time node status tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Audit Capabilities */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Privacy Audit Capabilities</h3>
            <p className="text-sm text-muted-foreground">Comprehensive anonymity verification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="FileCheck" size={16} className="text-primary" />
              <p className="text-sm font-medium text-foreground">Mixing Logs</p>
            </div>
            <p className="text-xs text-muted-foreground">Complete audit trail of all mixing operations</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Shield" size={16} className="text-primary" />
              <p className="text-sm font-medium text-foreground">Shuffle Proofs</p>
            </div>
            <p className="text-xs text-muted-foreground">Zero-knowledge proofs for verifiable shuffles</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="BarChart" size={16} className="text-primary" />
              <p className="text-sm font-medium text-foreground">Privacy Metrics</p>
            </div>
            <p className="text-xs text-muted-foreground">Statistical privacy guarantee measurements</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Eye" size={16} className="text-primary" />
              <p className="text-sm font-medium text-foreground">Anonymity Verification</p>
            </div>
            <p className="text-xs text-muted-foreground">Independent verification of unlinkability</p>
          </div>
        </div>
      </div>

      {/* Adaptive Mixing Strategies */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} color="var(--color-success)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Adaptive Mixing Strategies</h3>
            <p className="text-sm text-muted-foreground">Dynamic optimization based on traffic patterns</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Peak Traffic Optimization</span>
              <span className="text-xs text-success">Enabled</span>
            </div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Batch Size Adjustment</span>
              <span className="text-xs text-success">Automatic</span>
            </div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Layer Count Scaling</span>
              <span className="text-xs text-success">Dynamic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixingSchedulePanel;