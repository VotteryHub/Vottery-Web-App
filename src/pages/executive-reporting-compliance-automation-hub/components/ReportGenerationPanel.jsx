import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { executiveReportingService } from '../../../services/executiveReportingService';

const ReportGenerationPanel = ({ onReportCreated, loading }) => {
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState('performance_summary');

  const reportTypes = [
    { value: 'performance_summary', label: 'Performance Summary', icon: 'BarChart' },
    { value: 'financial_statement', label: 'Financial Statement', icon: 'DollarSign' },
    { value: 'compliance_documentation', label: 'Compliance Documentation', icon: 'Shield' },
    { value: 'stakeholder_update', label: 'Stakeholder Update', icon: 'Users' },
    { value: 'board_communication', label: 'Board Communication', icon: 'Briefcase' }
  ];

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      const reportData = {
        reportType: selectedType,
        title: `${reportTypes?.find(t => t?.value === selectedType)?.label} - ${new Date()?.toLocaleDateString()}`,
        summary: 'Auto-generated executive report',
        reportData: {
          generatedAt: new Date()?.toISOString(),
          metrics: {}
        },
        status: 'draft'
      };

      await executiveReportingService?.createExecutiveReport(reportData);
      onReportCreated?.();
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Generate Executive Report</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Report Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {reportTypes?.map((type) => (
                <button
                  key={type?.value}
                  onClick={() => setSelectedType(type?.value)}
                  className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                    selectedType === type?.value
                      ? 'border-primary bg-primary/10' :'border-border hover:bg-muted'
                  }`}
                >
                  <Icon name={type?.icon} size={20} className="mb-2" />
                  <p className="font-medium text-foreground">{type?.label}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Data Sources</label>
            <div className="flex flex-wrap gap-2">
              {['Financial Tracking', 'Zone Analytics', 'Compliance Data', 'Platform Metrics']?.map((source, index) => (
                <button
                  key={index}
                  className="px-3 py-1.5 text-sm border border-primary bg-primary/10 text-primary rounded-lg"
                >
                  <Icon name="CheckCircle" size={12} className="inline mr-1" />
                  {source}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Export Format</label>
            <div className="flex gap-2">
              {['PDF', 'Excel', 'PowerPoint']?.map((format, index) => (
                <button
                  key={index}
                  className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted"
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
          <Button
            variant="default"
            iconName={generating ? "Loader" : "FileText"}
            onClick={handleGenerateReport}
            disabled={generating}
            className={generating ? 'animate-spin' : ''}
          >
            {generating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Monthly Performance Report', lastUsed: '2 days ago' },
            { name: 'Quarterly Financial Summary', lastUsed: '1 week ago' },
            { name: 'Board Meeting Package', lastUsed: '3 weeks ago' },
            { name: 'Investor Update Template', lastUsed: '1 month ago' }
          ]?.map((template, index) => (
            <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{template?.name}</p>
                  <p className="text-xs text-muted-foreground">Last used: {template?.lastUsed}</p>
                </div>
                <Button variant="ghost" size="sm" iconName="Play">
                  Use
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerationPanel;