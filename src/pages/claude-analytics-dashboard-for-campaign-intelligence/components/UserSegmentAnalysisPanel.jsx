import React from 'react';
import Icon from '../../../components/AppIcon';

const UserSegmentAnalysisPanel = ({ segments }) => {
  if (!segments || segments?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No user segment analysis available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Users" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">User Segment Analysis</h2>
            <p className="text-sm text-muted-foreground">AI-powered segmentation insights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {segments?.map((segment, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-lg p-6 hover:border-primary/40 transition-all duration-250"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="Users" size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-heading font-bold text-foreground mb-1">{segment?.segment}</h3>
                  <p className="text-sm text-muted-foreground">Size: {segment?.size?.toLocaleString()} users</p>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Recommended Allocation</span>
                  <span className="text-2xl font-bold text-primary">{segment?.recommendedAllocation}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${segment?.recommendedAllocation}%` }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Icon name="Lightbulb" size={16} className="text-primary mt-1" />
                  <p className="text-sm text-muted-foreground">{segment?.reasoning}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSegmentAnalysisPanel;