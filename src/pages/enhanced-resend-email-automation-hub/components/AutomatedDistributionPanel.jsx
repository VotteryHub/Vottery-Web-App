import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { scheduledReportsService } from '../../../services/scheduledReportsService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const AutomatedDistributionPanel = ({ schedules, reports, onRefresh }) => {
  const [selectedType, setSelectedType] = useState('all');
  const [processing, setProcessing] = useState(null);

  const typeOptions = [
    { value: 'all', label: 'All Report Types' },
    { value: 'compliance_audit', label: 'Compliance Reports' },
    { value: 'roi_breakdown', label: 'Settlement Confirmations' },
    { value: 'campaign_performance', label: 'Campaign Analytics' },
    { value: 'fraud_detection_summary', label: 'Billing Summaries' }
  ];

  const reportTypes = [
    {
      id: 'compliance_audit',
      label: 'Compliance Reports',
      icon: 'FileCheck',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'Automated compliance audit reports with regulatory tracking',
      count: schedules?.filter(s => s?.reportType === 'compliance_audit')?.length || 0
    },
    {
      id: 'roi_breakdown',
      label: 'Settlement Confirmations',
      icon: 'DollarSign',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'International payout settlement confirmations with currency details',
      count: schedules?.filter(s => s?.reportType === 'roi_breakdown')?.length || 0
    },
    {
      id: 'campaign_performance',
      label: 'Campaign Analytics',
      icon: 'TrendingUp',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Campaign performance analytics with engagement metrics',
      count: schedules?.filter(s => s?.reportType === 'campaign_performance')?.length || 0
    },
    {
      id: 'fraud_detection_summary',
      label: 'Billing Summaries',
      icon: 'Receipt',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: 'Advertiser billing summaries with transaction details',
      count: schedules?.filter(s => s?.reportType === 'fraud_detection_summary')?.length || 0
    }
  ];

  const filteredSchedules = selectedType === 'all'
    ? schedules
    : schedules?.filter(s => s?.reportType === selectedType);

  const handleSendNow = async (scheduleId) => {
    try {
      setProcessing(scheduleId);
      const { error } = await scheduledReportsService?.generateAndSendReport(scheduleId);
      if (error) throw new Error(error?.message);

      analytics?.trackEvent('report_sent_manually', {
        schedule_id: scheduleId
      });

      await onRefresh();
    } catch (error) {
      console.error('Failed to send report:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleToggleSchedule = async (scheduleId, currentStatus) => {
    try {
      setProcessing(scheduleId);
      const { error } = await scheduledReportsService?.updateReportSchedule(scheduleId, {
        isEnabled: !currentStatus
      });
      if (error) throw new Error(error?.message);
      await onRefresh();
    } catch (error) {
      console.error('Failed to toggle schedule:', error);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes?.map((type) => (
          <div key={type?.id} className="card hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${type?.bgColor}`}>
              <Icon name={type?.icon} size={24} className={type?.color} />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-1">{type?.label}</h3>
            <p className="text-xs text-muted-foreground mb-3">{type?.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-heading font-bold text-foreground font-data">{type?.count}</span>
              <span className="text-xs text-muted-foreground">Schedules</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-semibold text-foreground">Scheduled Reports</h3>
          <div className="flex items-center gap-3">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e?.target?.value)}
              options={typeOptions}
            />
            <Button iconName="Plus">New Schedule</Button>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {filteredSchedules?.map((schedule) => (
          <div key={schedule?.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-heading font-semibold text-foreground">{schedule?.scheduleName}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${schedule?.isEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-xs text-muted-foreground">
                      {schedule?.isEnabled ? 'Active' : 'Paused'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Report Type</p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {schedule?.reportType?.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Frequency</p>
                    <p className="text-sm font-medium text-foreground capitalize">{schedule?.frequency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Next Run</p>
                    <p className="text-sm font-medium text-foreground">
                      {schedule?.nextRunAt ? new Date(schedule?.nextRunAt)?.toLocaleString() : 'Not scheduled'}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Recipients ({schedule?.recipients?.length || 0}):</p>
                  <div className="flex flex-wrap gap-2">
                    {schedule?.recipients?.slice(0, 3)?.map((recipient, index) => (
                      <span key={index} className="px-2 py-1 bg-muted rounded text-xs font-medium text-foreground">
                        {recipient?.email}
                      </span>
                    ))}
                    {schedule?.recipients?.length > 3 && (
                      <span className="px-2 py-1 bg-muted rounded text-xs font-medium text-muted-foreground">
                        +{schedule?.recipients?.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {schedule?.lastRunAt && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Last sent: {new Date(schedule?.lastRunAt)?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  iconName="Send"
                  onClick={() => handleSendNow(schedule?.id)}
                  disabled={processing === schedule?.id}
                >
                  Send Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  iconName={schedule?.isEnabled ? 'Pause' : 'Play'}
                  onClick={() => handleToggleSchedule(schedule?.id, schedule?.isEnabled)}
                  disabled={processing === schedule?.id}
                >
                  {schedule?.isEnabled ? 'Pause' : 'Resume'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  iconName="Settings"
                >
                  Configure
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Schedule Info */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Automated Delivery Schedule</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Daily reports sent at 6:00 AM UTC</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Weekly reports sent every Monday at 8:00 AM UTC</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Monthly reports sent on the 1st of each month at 9:00 AM UTC</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Quarterly reports sent on the first business day of the quarter</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedDistributionPanel;