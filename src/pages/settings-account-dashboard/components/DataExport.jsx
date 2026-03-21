import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { settingsService } from '../../../services/settingsService';

const DataExport = () => {
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const downloadJson = (filenamePrefix, payload) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filenamePrefix}-${new Date()?.toISOString()}.json`;
    link?.click();
    URL.revokeObjectURL(url);
  };

  const runExport = async (label, exportFn, filenamePrefix) => {
    try {
      setExporting(true);
      setExportStatus(`Preparing ${label} export...`);

      const { data, error } = await exportFn();
      if (error) throw new Error(error.message);

      downloadJson(filenamePrefix, data);

      setExportStatus(`${label} exported successfully!`);
    } catch (err) {
      setExportStatus(`Export failed: ${err?.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportData = async () => runExport(
    'complete account data',
    () => settingsService?.exportAccountData(),
    'account-data'
  );

  const handleExportVotes = async () => runExport(
    'voting history',
    () => settingsService?.getVotingHistory(),
    'voting-history'
  );

  const handleExportTransactions = async () => runExport(
    'transaction history',
    () => settingsService?.getTransactionHistory(500),
    'transaction-history'
  );

  const handleExportActivity = async () => runExport(
    'activity feed',
    () => settingsService?.getActivityFeed(),
    'activity-feed'
  );

  const exportOptions = [
    {
      id: 'full',
      title: 'Complete Account Data',
      description: 'Download all your account information, settings, and activity',
      icon: 'Database',
      action: handleExportData
    },
    {
      id: 'votes',
      title: 'Voting History',
      description: 'Export your voting participation records (vote contents remain encrypted)',
      icon: 'Vote',
      action: handleExportVotes
    },
    {
      id: 'transactions',
      title: 'Transaction History',
      description: 'Download your complete wallet and payment transaction logs',
      icon: 'Receipt',
      action: handleExportTransactions
    },
    {
      id: 'activity',
      title: 'Activity Feed',
      description: 'Export your social activity and interaction history',
      icon: 'Activity',
      action: handleExportActivity
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Data Export & Privacy
        </h3>
        <p className="text-sm text-muted-foreground">
          Download your data and manage your privacy rights
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
              GDPR Compliance
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              You have the right to access, export, and delete your personal data at any time.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportOptions?.map((option) => (
          <div
            key={option?.id}
            className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name={option?.icon} size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{option?.title}</h4>
                <p className="text-sm text-muted-foreground">{option?.description}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              className="w-full"
              onClick={option?.action}
              disabled={exporting}
            >
              {exporting && option?.id === 'full' ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        ))}
      </div>

      {exportStatus && (
        <div
          className={`p-4 rounded-lg ${
            exportStatus?.includes('success')
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400' :'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
          }`}
        >
          <p className="text-sm">{exportStatus}</p>
        </div>
      )}

      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon name="FileText" size={18} />
          Data Portability
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          All exports are provided in JSON format for easy portability and integration with other
          services.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Export requests are processed immediately</span>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
              Account Deletion
            </h4>
            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="outline" size="sm" iconName="Trash2" className="border-red-300 text-red-600 hover:bg-red-50">
              Request Account Deletion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
