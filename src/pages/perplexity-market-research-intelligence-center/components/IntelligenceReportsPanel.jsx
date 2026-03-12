import React from 'react';

import Button from '../../../components/ui/Button';

const IntelligenceReportsPanel = ({ allData, onRefresh }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">Automated Intelligence Reports</h2>
        <Button variant="primary" size="sm" iconName="Download">
          Export Report
        </Button>
      </div>
      <p className="text-muted-foreground">Automated report generation and export coming soon...</p>
    </div>
  );
};

export default IntelligenceReportsPanel;