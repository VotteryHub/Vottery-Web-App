import React from 'react';
import { GitBranch, Link2, Clock, AlertTriangle } from 'lucide-react';

const CrossPlatformCorrelationPanel = () => {
  const correlations = [
    {
      id: 'corr-001',
      type: 'Fraud Detection Alert → Security Incident',
      events: [
        { service: 'Fraud Detection AI', event: 'Suspicious voting pattern detected', time: '2 min ago', severity: 'critical' },
        { service: 'Security System', event: 'User account flagged for review', time: '1 min ago', severity: 'high' },
        { service: 'Admin Notification', event: 'Alert sent to security team', time: '30 sec ago', severity: 'medium' }
      ],
      correlationId: 'corr-1234-5678',
      impactScore: 95
    },
    {
      id: 'corr-002',
      type: 'Payment Processing → VP Transaction',
      events: [
        { service: 'Stripe', event: 'Payment intent created', time: '5 min ago', severity: 'info' },
        { service: 'Payment Service', event: 'Payment processed successfully', time: '4 min ago', severity: 'info' },
        { service: 'VP System', event: 'VP credited to user account', time: '3 min ago', severity: 'info' }
      ],
      correlationId: 'corr-9876-5432',
      impactScore: 75
    },
    {
      id: 'corr-003',
      type: 'AI Content Moderation → User Activity',
      events: [
        { service: 'Claude AI', event: 'Content analyzed for violations', time: '10 min ago', severity: 'info' },
        { service: 'Moderation System', event: 'Content approved', time: '9 min ago', severity: 'info' },
        { service: 'User Activity', event: 'Post published to feed', time: '8 min ago', severity: 'info' }
      ],
      correlationId: 'corr-1111-2222',
      impactScore: 60
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <GitBranch className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-slate-900">Cross-Platform Correlation</h2>
      </div>

      <div className="space-y-6">
        {correlations?.map((correlation, idx) => (
          <div key={idx} className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{correlation?.type}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Link2 className="w-4 h-4" />
                  <span className="font-mono text-xs">{correlation?.correlationId}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600 mb-1">Impact Score</div>
                <div className="text-2xl font-bold text-purple-600">{correlation?.impactScore}</div>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-200" />
              <div className="space-y-4">
                {correlation?.events?.map((event, eidx) => (
                  <div key={eidx} className="relative">
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-white" />
                    <div className={`border rounded-lg p-3 ${getSeverityColor(event?.severity)}`}>
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-sm">{event?.service}</span>
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Clock className="w-3 h-3" />
                          <span>{event?.time}</span>
                        </div>
                      </div>
                      <p className="text-sm">{event?.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Automated Timeline Reconstruction */}
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-900">Automated Timeline Reconstruction</span>
              </div>
              <p className="text-xs text-purple-700 mt-1">
                Events correlated across {correlation?.events?.length} systems with {correlation?.impactScore}% confidence
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Impact Analysis */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
        <h4 className="font-semibold text-slate-900 mb-2">Impact Analysis</h4>
        <p className="text-sm text-slate-600">
          Automated correlation engine analyzes log relationships across fraud detection, security incidents, payment processing, 
          and user activities with timeline reconstruction and impact scoring.
        </p>
      </div>
    </div>
  );
};

export default CrossPlatformCorrelationPanel;