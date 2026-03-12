import React from 'react';
import { Icon } from 'lucide-react';

const SecurityReportsPanel = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="FileText" size={20} />
          Security Reports & Compliance
        </h3>
        <div className="space-y-3">
          <div className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Weekly Security Scan Report</h4>
                <p className="text-sm text-muted-foreground">Generated: {new Date()?.toLocaleDateString()}</p>
              </div>
              <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                <Icon name="Download" size={14} className="inline mr-1" />
                Download PDF
              </button>
            </div>
          </div>
          <div className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground mb-1">OWASP Compliance Report</h4>
                <p className="text-sm text-muted-foreground">Generated: {new Date()?.toLocaleDateString()}</p>
              </div>
              <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                <Icon name="Download" size={14} className="inline mr-1" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityReportsPanel;