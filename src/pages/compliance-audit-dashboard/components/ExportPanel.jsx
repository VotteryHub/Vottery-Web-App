import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportPanel = ({ complianceData, onExport }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedDataType, setSelectedDataType] = useState('all');

  const formats = [
    { value: 'pdf', label: 'PDF Document', icon: 'FileText' },
    { value: 'csv', label: 'CSV Spreadsheet', icon: 'Table' },
    { value: 'json', label: 'JSON Data', icon: 'Code' },
    { value: 'xlsx', label: 'Excel Workbook', icon: 'FileSpreadsheet' }
  ];

  const dataTypes = [
    { value: 'all', label: 'Complete Compliance Report' },
    { value: 'filings', label: 'Regulatory Filings Only' },
    { value: 'violations', label: 'Policy Violations Only' },
    { value: 'audit_trail', label: 'Audit Trail Only' },
    { value: 'jurisdictions', label: 'Jurisdiction Status Only' }
  ];

  const handleExport = () => {
    onExport(selectedFormat, selectedDataType);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Download" size={24} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Export Compliance Data</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Export Format
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {formats?.map((format) => (
              <button
                key={format?.value}
                onClick={() => setSelectedFormat(format?.value)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedFormat === format?.value
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <Icon name={format?.icon} size={24} className="text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{format?.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Data to Export
          </label>
          <div className="space-y-2">
            {dataTypes?.map((dataType) => (
              <button
                key={dataType?.value}
                onClick={() => setSelectedDataType(dataType?.value)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  selectedDataType === dataType?.value
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <p className="text-sm font-medium text-foreground">{dataType?.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">Export Summary</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Format: {formats?.find(f => f?.value === selectedFormat)?.label}</p>
            <p>Data: {dataTypes?.find(d => d?.value === selectedDataType)?.label}</p>
            <p>Total Records: {complianceData?.filings?.length + complianceData?.violations?.length + complianceData?.auditTrail?.length}</p>
          </div>
        </div>

        <Button
          iconName="Download"
          onClick={handleExport}
          className="w-full"
        >
          Export Compliance Data
        </Button>
      </div>
    </div>
  );
};

export default ExportPanel;