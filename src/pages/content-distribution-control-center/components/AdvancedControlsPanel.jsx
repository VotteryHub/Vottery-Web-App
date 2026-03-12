import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdvancedControlsPanel = ({ settings, onRefresh }) => {
  const [selectedZone, setSelectedZone] = useState('zone_1');

  const zones = [
    { id: 'zone_1', name: 'Zone 1 - Premium', region: 'High Purchasing Power' },
    { id: 'zone_2', name: 'Zone 2 - Urban', region: 'Urban Centers' },
    { id: 'zone_3', name: 'Zone 3 - Suburban', region: 'Suburban Areas' },
    { id: 'zone_4', name: 'Zone 4 - Rural', region: 'Rural Regions' },
    { id: 'zone_5', name: 'Zone 5 - Emerging', region: 'Emerging Markets' },
    { id: 'zone_6', name: 'Zone 6 - Metro', region: 'Metropolitan' },
    { id: 'zone_7', name: 'Zone 7 - Coastal', region: 'Coastal Regions' },
    { id: 'zone_8', name: 'Zone 8 - Inland', region: 'Inland Areas' }
  ];

  const zoneSettings = settings?.zoneSpecificSettings || {};
  const selectedZoneData = zoneSettings?.[selectedZone] || { election: 50, social: 50 };

  return (
    <div className="space-y-6">
      {/* Zone-Specific Distribution */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Zone-Specific Distribution
            </h2>
            <p className="text-sm text-muted-foreground">
              Customize content distribution for each purchasing power zone
            </p>
          </div>
          <Icon name="Map" size={24} className="text-primary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zone Selector */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-medium text-foreground mb-3">Select Zone</h3>
            <div className="space-y-2">
              {zones?.map((zone) => {
                const zoneData = zoneSettings?.[zone?.id] || { election: 50, social: 50 };
                return (
                  <button
                    key={zone?.id}
                    onClick={() => setSelectedZone(zone?.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                      selectedZone === zone?.id
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground mb-1">{zone?.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{zone?.region}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-primary font-semibold">{zoneData?.election}%</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-secondary font-semibold">{zoneData?.social}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zone Details */}
          <div className="lg:col-span-2">
            <div className="p-4 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-foreground mb-4">
                {zones?.find(z => z?.id === selectedZone)?.name} Settings
              </h3>

              {/* Distribution Visualization */}
              <div className="mb-6">
                <div className="flex h-16 rounded-lg overflow-hidden border border-border mb-3">
                  <div
                    className="bg-primary flex items-center justify-center text-white font-semibold"
                    style={{ width: `${selectedZoneData?.election}%` }}
                  >
                    {selectedZoneData?.election > 15 && `${selectedZoneData?.election}%`}
                  </div>
                  <div
                    className="bg-secondary flex items-center justify-center text-white font-semibold"
                    style={{ width: `${selectedZoneData?.social}%` }}
                  >
                    {selectedZoneData?.social > 15 && `${selectedZoneData?.social}%`}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary" />
                    <span className="text-xs text-muted-foreground">Election: {selectedZoneData?.election}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-secondary" />
                    <span className="text-xs text-muted-foreground">Social: {selectedZoneData?.social}%</span>
                  </div>
                </div>
              </div>

              {/* Zone Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Active Users</p>
                  <p className="text-lg font-bold text-foreground font-data">
                    {(Math.random() * 5000 + 1000)?.toFixed(0)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                  <p className="text-lg font-bold text-success font-data">
                    {(Math.random() * 30 + 60)?.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Avg Session</p>
                  <p className="text-lg font-bold text-primary font-data">
                    {(Math.random() * 10 + 5)?.toFixed(0)}m
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demographic-Based Weighting */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Demographic-Based Content Weighting
            </h3>
            <p className="text-sm text-muted-foreground">
              Adjust content distribution based on user demographics
            </p>
          </div>
          <Icon name="Users" size={24} className="text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { age: '18-24', weight: 1.2, color: 'primary' },
            { age: '25-34', weight: 1.0, color: 'success' },
            { age: '35-44', weight: 0.9, color: 'secondary' },
            { age: '45+', weight: 0.8, color: 'accent' }
          ]?.map((demo, index) => (
            <div key={index} className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Age {demo?.age}</span>
                <Icon name="TrendingUp" size={16} className={`text-${demo?.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground font-data mb-1">{demo?.weight}x</p>
              <p className="text-xs text-muted-foreground">Content Weight</p>
            </div>
          ))}
        </div>
      </div>

      {/* Time-Based Scheduling */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Time-Based Distribution Scheduling
            </h3>
            <p className="text-sm text-muted-foreground">
              Optimize content distribution for different time windows
            </p>
          </div>
          <Icon name="Clock" size={24} className="text-primary" />
        </div>

        <div className="space-y-3">
          {[
            { time: 'Morning (6AM - 12PM)', election: 55, social: 45, peak: true },
            { time: 'Afternoon (12PM - 6PM)', election: 50, social: 50, peak: false },
            { time: 'Evening (6PM - 10PM)', election: 60, social: 40, peak: true },
            { time: 'Night (10PM - 6AM)', election: 40, social: 60, peak: false }
          ]?.map((schedule, index) => (
            <div key={index} className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{schedule?.time}</span>
                  {schedule?.peak && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                      Peak Hours
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-primary font-semibold">{schedule?.election}%</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-secondary font-semibold">{schedule?.social}%</span>
                </div>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden">
                <div className="bg-primary" style={{ width: `${schedule?.election}%` }} />
                <div className="bg-secondary" style={{ width: `${schedule?.social}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rollback & Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="RotateCcw" size={20} className="text-warning" />
            <h4 className="text-sm font-heading font-semibold text-foreground">
              Rollback Capability
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Instantly revert to previous distribution settings if needed
          </p>
          <Button variant="outline" size="sm" iconName="History" fullWidth>
            View Previous Versions
          </Button>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Eye" size={20} className="text-primary" />
            <h4 className="text-sm font-heading font-semibold text-foreground">
              Immediate Effect Preview
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            See how changes will affect user feeds before applying
          </p>
          <Button variant="outline" size="sm" iconName="Play" fullWidth>
            Preview Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedControlsPanel;