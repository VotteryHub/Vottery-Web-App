import React from 'react';
import { Users, Mail, MessageSquare } from 'lucide-react';

const RISK_BADGES = {
  critical: 'bg-red-900/30 text-red-400 border-red-700',
  high: 'bg-orange-900/30 text-orange-400 border-orange-700',
  medium: 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
  low: 'bg-emerald-900/30 text-emerald-400 border-emerald-700'
};

export default function AtRiskCreatorsPanel({ creators, loading, onTriggerRetention }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-slate-700 rounded w-1/2" />
          {[1, 2, 3]?.map(i => <div key={i} className="h-16 bg-slate-700 rounded" />)}
        </div>
      </div>
    );
  }

  const creatorList = creators || [];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-red-400" />
          At-Risk Creators
        </h2>
        <span className="text-xs text-slate-400">{creatorList?.length} creators monitored</span>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {creatorList?.map((creator, idx) => (
          <div key={idx} className="bg-slate-700/40 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-medium">
                  {creator?.userProfiles?.fullName?.[0] || creator?.creatorId?.[0]?.toUpperCase() || 'C'}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {creator?.userProfiles?.fullName || `Creator ${creator?.creatorId?.slice(0, 8)}`}
                  </div>
                  <div className="text-xs text-slate-400">{creator?.userProfiles?.email || 'No email'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded border ${RISK_BADGES?.[creator?.riskLevel] || RISK_BADGES?.medium}`}>
                  {creator?.churnRiskScore}%
                </span>
                <span className={`text-xs px-2 py-0.5 rounded border ${RISK_BADGES?.[creator?.riskLevel] || RISK_BADGES?.medium}`}>
                  {creator?.riskLevel}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onTriggerRetention?.(creator?.creatorId)}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                Send SMS
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded-lg transition-colors">
                <Mail className="w-3 h-3" />
                Send Email
              </button>
            </div>
          </div>
        ))}

        {creatorList?.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No at-risk creators detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
