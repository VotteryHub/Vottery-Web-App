import React from 'react';
import Icon from '../../../components/AppIcon';

const LivePreviewPanel = ({ title, description, children }) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="Eye" size={20} className="text-success" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="relative">
        {children}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2">
          <Icon name="Info" size={16} className="text-blue-600 dark:text-blue-400" />
          <p className="text-xs text-blue-700 dark:text-blue-300">Live preview updates automatically when configuration changes. Try dragging, swiping, or clicking cards to test interactions.</p>
        </div>
      </div>
    </div>
  );
};

export default LivePreviewPanel;