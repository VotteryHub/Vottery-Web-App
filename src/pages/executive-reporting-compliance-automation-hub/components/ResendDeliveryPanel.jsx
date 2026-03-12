import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResendDeliveryPanel = ({ reports, stakeholderGroups, onSendReport, loading }) => {
  const [sending, setSending] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleSend = async () => {
    if (!selectedReport || !selectedGroup) return;
    
    try {
      setSending(true);
      const result = await onSendReport?.(selectedReport, selectedGroup);
      if (result?.success) {
        setSelectedReport(null);
        setSelectedGroup(null);
      }
    } catch (error) {
      console.error('Failed to send report:', error);
    } finally {
      setSending(false);
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

  const approvedReports = reports?.filter(r => r?.status === 'approved' || r?.status === 'sent');

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Resend Email Integration
            </h2>
            <p className="text-sm text-muted-foreground">
              Email delivery orchestration with confirmation tracking and automated retry
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-green-500/10">
            <span className="text-xs font-medium text-green-500">Connected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Select Report</label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {approvedReports?.map((report) => (
                <button
                  key={report?.id}
                  onClick={() => setSelectedReport(report?.id)}
                  className={`w-full p-3 border rounded-lg text-left transition-all duration-200 ${
                    selectedReport === report?.id
                      ? 'border-primary bg-primary/10' :'border-border hover:bg-muted'
                  }`}
                >
                  <p className="font-medium text-foreground text-sm">{report?.title}</p>
                  <p className="text-xs text-muted-foreground">{report?.reportType?.replace('_', ' ')?.toUpperCase()}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Select Stakeholder Group</label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stakeholderGroups?.map((group) => (
                <button
                  key={group?.id}
                  onClick={() => setSelectedGroup(group?.id)}
                  className={`w-full p-3 border rounded-lg text-left transition-all duration-200 ${
                    selectedGroup === group?.id
                      ? 'border-primary bg-primary/10' :'border-border hover:bg-muted'
                  }`}
                >
                  <p className="font-medium text-foreground text-sm">{group?.groupName}</p>
                  <p className="text-xs text-muted-foreground">
                    {group?.recipients?.length || 0} recipients - {group?.groupType?.toUpperCase()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button
            variant="default"
            iconName={sending ? "Loader" : "Send"}
            onClick={handleSend}
            disabled={!selectedReport || !selectedGroup || sending}
            className={sending ? 'animate-spin' : ''}
          >
            {sending ? 'Sending...' : 'Send Report via Resend'}
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Delivery Features</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
            <Icon name="CheckCircle" className="text-green-500" size={20} />
            <div>
              <p className="font-medium text-foreground text-sm">Email Delivery Confirmation</p>
              <p className="text-xs text-muted-foreground">Real-time tracking of email delivery status</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
            <Icon name="FileText" className="text-blue-500" size={20} />
            <div>
              <p className="font-medium text-foreground text-sm">Audit Trail Documentation</p>
              <p className="text-xs text-muted-foreground">Complete submission history with timestamps</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
            <Icon name="RefreshCw" className="text-purple-500" size={20} />
            <div>
              <p className="font-medium text-foreground text-sm">Automated Retry Mechanism</p>
              <p className="text-xs text-muted-foreground">Automatic retry for failed deliveries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendDeliveryPanel;