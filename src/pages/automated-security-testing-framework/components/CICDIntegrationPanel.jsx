import React, { useState } from 'react';
import { Icon } from 'lucide-react';

const CICDIntegrationPanel = () => {
  const [pipelineStatus, setPipelineStatus] = useState('active');

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} />
          CI/CD Pipeline Integration
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <Icon name="CheckCircle" size={24} className="text-green-600 mb-3" />
            <h4 className="font-semibold text-foreground mb-1">GitHub Actions</h4>
            <p className="text-xs text-muted-foreground mb-2">Automated security scans on push</p>
            <span className="text-xs font-medium text-green-600">Active</span>
          </div>
          <div className="border border-border rounded-lg p-4">
            <Icon name="CheckCircle" size={24} className="text-green-600 mb-3" />
            <h4 className="font-semibold text-foreground mb-1">Pre-commit Hooks</h4>
            <p className="text-xs text-muted-foreground mb-2">Security checks before commit</p>
            <span className="text-xs font-medium text-green-600">Enabled</span>
          </div>
          <div className="border border-border rounded-lg p-4">
            <Icon name="CheckCircle" size={24} className="text-green-600 mb-3" />
            <h4 className="font-semibold text-foreground mb-1">Deploy Gates</h4>
            <p className="text-xs text-muted-foreground mb-2">Block deployment on failures</p>
            <span className="text-xs font-medium text-green-600">Configured</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CICDIntegrationPanel;