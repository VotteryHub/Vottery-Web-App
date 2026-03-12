import React from 'react';
import { Workflow, CheckCircle, Clock, XCircle, MessageSquare, Mail } from 'lucide-react';

const STATUS_ICONS = {
  triggered: <Clock className="w-4 h-4 text-yellow-400" />,
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  failed: <XCircle className="w-4 h-4 text-red-400" />
};

export default function RetentionWorkflowPanel({ campaignMetrics, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/2" />
          <div className="h-32 bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  const metrics = campaignMetrics || {};

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Workflow className="w-5 h-5 text-blue-400" />
          Automated Retention Workflows
        </h2>
        <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full">Auto-triggered at 70% risk</span>
      </div>
      {/* Workflow Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{metrics?.totalCampaigns || 0}</div>
          <div className="text-xs text-slate-400 mt-1">Total Campaigns</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400">{metrics?.successfulCampaigns || 0}</div>
          <div className="text-xs text-slate-400 mt-1">Successful</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{metrics?.successRate || 0}%</div>
          <div className="text-xs text-slate-400 mt-1">Success Rate</div>
        </div>
      </div>
      {/* Workflow Steps */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Workflow Trigger Logic</h3>
        <div className="space-y-2">
          {[
            { step: 1, label: 'Daily churn analysis runs via Edge Function cron', icon: <Clock className="w-4 h-4 text-slate-400" /> },
            { step: 2, label: 'Claude AI scores each creator (7-14 day prediction)', icon: <CheckCircle className="w-4 h-4 text-violet-400" /> },
            { step: 3, label: 'Risk score ≥ 70% triggers retention campaign', icon: <CheckCircle className="w-4 h-4 text-orange-400" /> },
            { step: 4, label: 'Personalized Telnyx SMS sent to creator', icon: <MessageSquare className="w-4 h-4 text-blue-400" /> },
            { step: 5, label: 'Resend email with growth tips dispatched', icon: <Mail className="w-4 h-4 text-emerald-400" /> }
          ]?.map(item => (
            <div key={item?.step} className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3">
              <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs text-slate-300 font-medium flex-shrink-0">
                {item?.step}
              </div>
              {item?.icon}
              <span className="text-sm text-slate-300">{item?.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Campaigns */}
      {metrics?.campaigns?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Campaigns</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {metrics?.campaigns?.map((campaign, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  {STATUS_ICONS?.[campaign?.status] || STATUS_ICONS?.triggered}
                  <span className="text-xs text-slate-300">Creator {campaign?.creatorId?.slice(0, 8)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-orange-400">{campaign?.churnRiskScore}% risk</span>
                  <span className="text-xs text-slate-500">{new Date(campaign?.triggeredAt)?.toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
