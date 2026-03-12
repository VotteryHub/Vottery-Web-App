import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { adminLogService } from '../../../services/adminLogService';

const ComplianceExport = ({ filters, totalLogs }) => {
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('json');

  const formatOptions = [
    { value: 'json', label: 'JSON Format' },
    { value: 'csv', label: 'CSV Format' }
  ];

  const handleExport = async () => {
    try {
      setExporting(true);
      setExportStatus('Preparing export...');

      const { data, error, format } = await adminLogService?.exportActivityLogs(filters, selectedFormat);
      if (error) throw new Error(error.message);

      const timestamp = new Date()?.toISOString()?.replace(/[:.]/g, '-');
      const filename = `admin-activity-log-${timestamp}.${format}`;

      let blob;
      if (format === 'csv') {
        blob = new Blob([data], { type: 'text/csv' });
      } else {
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link?.click();
      URL.revokeObjectURL(url);

      setExportStatus(`Successfully exported ${data?.length || 0} activity logs`);
    } catch (err) {
      setExportStatus(`Export failed: ${err?.message}`);
    } finally {
      setExporting(false);
    }
  };

  const exportPresets = [
    {
      id: 'compliance',
      title: 'Compliance Audit Report',
      description: 'Export all compliance-relevant activities for regulatory review',
      icon: 'Shield',
      filters: { complianceRelevant: true },
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 'security',
      title: 'Security Events Log',
      description: 'Export all security-related administrative actions',
      icon: 'Lock',
      filters: { actionType: 'security_event' },
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      id: 'moderation',
      title: 'Content Moderation Report',
      description: 'Export all content moderation decisions and actions',
      icon: 'Shield',
      filters: { actionType: 'content_moderation' },
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      id: 'user_management',
      title: 'User Management Log',
      description: 'Export all user account modifications and suspensions',
      icon: 'Users',
      filters: { actionType: 'user_management' },
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Export Current View</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Export {totalLogs} activity logs matching your current filters
        </p>
        <div className="flex items-center gap-3">
          <Select
            options={formatOptions}
            value={selectedFormat}
            onChange={setSelectedFormat}
            className="w-48"
          />
          <Button
            variant="primary"
            iconName="Download"
            onClick={handleExport}
            disabled={exporting || totalLogs === 0}
          >
            {exporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
        {exportStatus && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              exportStatus?.includes('Success')
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : exportStatus?.includes('failed')
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
            }`}
          >
            {exportStatus}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Export Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportPresets?.map((preset) => (
            <div
              key={preset?.id}
              className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${preset?.bgColor}`}>
                  <Icon name={preset?.icon} size={20} className={preset?.color} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{preset?.title}</h4>
                  <p className="text-xs text-muted-foreground">{preset?.description}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                className="w-full"
                onClick={() => {
                  // Apply preset filters and export
                  console.log('Export with preset:', preset?.filters);
                }}
              >
                Export
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Data Export Compliance</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• All exports include complete audit trail metadata</li>
              <li>• Timestamps are in ISO 8601 format for international compliance</li>
              <li>• Before/after states preserved for change tracking</li>
              <li>• Administrator attribution included for accountability</li>
              <li>• Exports are suitable for regulatory submissions</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Scheduled Exports</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure automated compliance report generation and delivery
        </p>
        <Button variant="outline" iconName="Calendar">
          Configure Schedule
        </Button>
      </div>
    </div>
  );
};

export default ComplianceExport;