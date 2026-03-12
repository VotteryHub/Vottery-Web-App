import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AutomatedReportingPanel = ({ forecasts, churnPredictions, fraudRisks }) => {
  const handleGenerateReport = () => {
    console.log('Generating comprehensive report...');
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-1">
            Automated Reporting
          </h2>
          <p className="text-sm text-muted-foreground">
            Generate comprehensive reports with natural language explanations powered by Claude AI
          </p>
        </div>
        <Button
          variant="primary"
          iconName="FileText"
          onClick={handleGenerateReport}
        >
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <p className="text-sm font-medium text-foreground">Revenue Forecasts</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{forecasts?.length || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Available reports</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Users" size={20} className="text-primary" />
            <p className="text-sm font-medium text-foreground">Churn Predictions</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{churnPredictions?.length || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Available reports</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Shield" size={20} className="text-primary" />
            <p className="text-sm font-medium text-foreground">Fraud Risk Analyses</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{fraudRisks?.length || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Available reports</p>
        </div>
      </div>

      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
        <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">Automated Report Generation</p>
        <p className="text-sm text-muted-foreground mb-4">
          Generate comprehensive reports with Claude AI natural language explanations
        </p>
        <Button variant="primary" iconName="Download" onClick={handleGenerateReport}>
          Generate Full Report
        </Button>
      </div>
    </div>
  );
};

export default AutomatedReportingPanel;