import React from 'react';
import Icon from '../../../components/AppIcon';
import { Radar, Doughnut } from 'react-chartjs-2';

const DynamicCarouselSelectionPanel = ({ data }) => {
  const userEngagementData = {
    labels: ['Horizontal', 'Vertical', 'Gradient', 'Elections', 'Jolts', 'Connections'],
    datasets: [{
      label: 'User Engagement Score',
      data: [85, 72, 68, 90, 78, 65],
      backgroundColor: 'rgba(255, 215, 0, 0.2)',
      borderColor: 'rgb(255, 215, 0)',
      borderWidth: 2
    }]
  };

  const selectionConfidenceData = {
    labels: ['High Confidence', 'Medium Confidence', 'Low Confidence'],
    datasets: [{
      data: [65, 25, 10],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ]
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-6">
          <Icon name="Sparkles" size={24} className="text-purple-500" />
          Dynamic Carousel Selection
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">User Engagement Patterns</h3>
            <div className="h-[300px]">
              <Radar data={userEngagementData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
            <p className="text-sm text-muted-foreground mt-4">ML-powered analysis of individual user engagement patterns across carousel types</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Selection Confidence</h3>
            <div className="h-[300px]">
              <Doughnut data={selectionConfidenceData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
            <p className="text-sm text-muted-foreground mt-4">Confidence scoring for carousel type selection with A/B testing validation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Behavioral Analytics</h3>
            <Icon name="Activity" size={20} className="text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Swipe Velocity</span>
              <span className="text-sm font-semibold text-foreground">2.3/min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Dwell Time</span>
              <span className="text-sm font-semibold text-foreground">4.8s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Click-through Rate</span>
              <span className="text-sm font-semibold text-foreground">12.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Scroll Depth</span>
              <span className="text-sm font-semibold text-foreground">78%</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Demographic Preferences</h3>
            <Icon name="Users" size={20} className="text-pink-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Age 18-24</span>
              <span className="text-sm font-semibold text-foreground">Horizontal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Age 25-34</span>
              <span className="text-sm font-semibold text-foreground">Vertical</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Age 35-44</span>
              <span className="text-sm font-semibold text-foreground">Gradient</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Age 45+</span>
              <span className="text-sm font-semibold text-foreground">Horizontal</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">A/B Testing</h3>
            <Icon name="TestTube" size={20} className="text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Tests</span>
              <span className="text-sm font-semibold text-foreground">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Winning Variant</span>
              <span className="text-sm font-semibold text-green-500">Horizontal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Confidence</span>
              <span className="text-sm font-semibold text-foreground">95%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sample Size</span>
              <span className="text-sm font-semibold text-foreground">15.2K</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Real-Time Selection Log</h3>
        <div className="space-y-2">
          {[
            { user: 'User #12345', selected: 'Horizontal Snap', confidence: 92, reason: 'High engagement with Jolts' },
            { user: 'User #12346', selected: 'Vertical Stack', confidence: 88, reason: 'Frequent connection requests' },
            { user: 'User #12347', selected: 'Gradient Flow', confidence: 85, reason: 'Winner content preference' },
            { user: 'User #12348', selected: 'Horizontal Snap', confidence: 94, reason: 'Election participation history' },
            { user: 'User #12349', selected: 'Vertical Stack', confidence: 79, reason: 'Group membership activity' }
          ]?.map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="User" size={18} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{log?.user}</p>
                  <p className="text-xs text-muted-foreground">{log?.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-yellow-500">{log?.selected}</span>
                <div className="flex items-center gap-1">
                  <Icon name="Zap" size={14} className="text-green-500" />
                  <span className="text-xs font-semibold text-green-500">{log?.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicCarouselSelectionPanel;