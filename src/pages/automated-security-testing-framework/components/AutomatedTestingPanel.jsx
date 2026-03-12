import React from 'react';
import { Icon } from 'lucide-react';

const AutomatedTestingPanel = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} />
          Automated Security Test Suite
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">Authentication Tests</h4>
            <div className="text-2xl font-bold text-green-600 mb-1">127/127</div>
            <p className="text-xs text-muted-foreground">All tests passing</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">Authorization Tests</h4>
            <div className="text-2xl font-bold text-green-600 mb-1">94/94</div>
            <p className="text-xs text-muted-foreground">All tests passing</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">Input Validation</h4>
            <div className="text-2xl font-bold text-green-600 mb-1">203/203</div>
            <p className="text-xs text-muted-foreground">All tests passing</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">API Security</h4>
            <div className="text-2xl font-bold text-yellow-600 mb-1">87/92</div>
            <p className="text-xs text-muted-foreground">5 tests failing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedTestingPanel;