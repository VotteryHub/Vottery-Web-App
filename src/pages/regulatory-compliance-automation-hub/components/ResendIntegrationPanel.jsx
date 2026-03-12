import React from 'react';
import Icon from '../../../components/AppIcon';

const ResendIntegrationPanel = ({ submissionStats, loading }) => {
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
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Mail" size={20} />
          Resend Email Service Integration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">{submissionStats?.totalSubmissions || 0}</div>
            <div className="text-sm text-muted-foreground">Total Submissions</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-green-500 mb-1">{submissionStats?.successfulDeliveries || 0}</div>
            <div className="text-sm text-muted-foreground">Successful Deliveries</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">{submissionStats?.deliveryRate || 0}%</div>
            <div className="text-sm text-muted-foreground">Delivery Rate</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" className="text-green-500" size={20} />
              <div>
                <p className="font-medium text-foreground">Email Delivery Confirmation</p>
                <p className="text-sm text-muted-foreground">Real-time tracking of email delivery status</p>
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-green-500/10 text-green-500 rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="FileText" className="text-blue-500" size={20} />
              <div>
                <p className="font-medium text-foreground">Audit Trail Documentation</p>
                <p className="text-sm text-muted-foreground">Complete submission history with timestamps</p>
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-500 rounded-full">
              Enabled
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="RefreshCw" className="text-purple-500" size={20} />
              <div>
                <p className="font-medium text-foreground">Automated Retry Mechanism</p>
                <p className="text-sm text-muted-foreground">Automatic retry for failed deliveries</p>
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-purple-500/10 text-purple-500 rounded-full">
              Configured
            </span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Settings" size={20} />
          Configuration
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sender Email</span>
            <span className="text-sm font-medium text-foreground">onboarding@resend.dev</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Max Retry Attempts</span>
            <span className="text-sm font-medium text-foreground">3</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Retry Delay</span>
            <span className="text-sm font-medium text-foreground">5 minutes</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" className="text-yellow-500 mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-foreground mb-2">External Setup Required</h4>
            <p className="text-sm text-muted-foreground mb-3">
              To update your sender email for outgoing regulatory submissions:
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Log in to your Supabase Project</li>
              <li>Navigate to Edge Functions and open the send-regulatory-filing function</li>
              <li>Replace from: "onboarding@resend.dev" with your verified email address</li>
              <li>Ensure the email belongs to a paid Resend account with a verified domain</li>
              <li>Save and redeploy the Edge Function to apply changes</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendIntegrationPanel;