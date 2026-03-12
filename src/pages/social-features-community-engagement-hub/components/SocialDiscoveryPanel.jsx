import React from 'react';
import Icon from '../../../components/AppIcon';

const SocialDiscoveryPanel = ({ socialData }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="Compass" size={24} className="text-primary" />
        <h2 className="text-xl font-bold text-foreground">
          Social Discovery Tools
        </h2>
      </div>
      <div className="text-center py-12">
        <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Social discovery and relationship management tools coming soon</p>
      </div>
    </div>
  );
};

export default SocialDiscoveryPanel;