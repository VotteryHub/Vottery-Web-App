import React, { useState, useEffect } from 'react';
import { Lock, FileText } from 'lucide-react';

const PolicyViolationPanel = ({ trackEvent }) => {
  const [violations, setViolations] = useState([
    {
      id: 1,
      type: 'content_moderation',
      category: 'spam',
      severity: 'medium',
      contentId: 'post-789',
      timestamp: new Date()?.toISOString(),
      autoModerated: true
    },
    {
      id: 2,
      type: 'community_guidelines',
      category: 'harassment',
      severity: 'high',
      contentId: 'comment-456',
      timestamp: new Date(Date.now() - 1800000)?.toISOString(),
      autoModerated: false
    }
  ]);

  useEffect(() => {
    trackEvent?.('security_panel_view', {
      panel_name: 'policy_violation_analytics',
      event_count: violations?.length
    });
  }, []);

  const handleReview = (violation) => {
    trackEvent?.('policy_violation_review', {
      violation_type: violation?.type,
      category: violation?.category,
      severity: violation?.severity,
      auto_moderated: violation?.autoModerated
    });
    alert(`Reviewing ${violation?.category} violation...`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lock className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Policy Violation Analytics</h2>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          {violations?.length || 0} Violations
        </span>
      </div>
      <div className="space-y-4">
        {violations?.map((violation) => (
          <div
            key={violation?.id}
            className={`p-4 rounded-lg border ${
              violation?.severity === 'high' ?'bg-red-50 border-red-200' :'bg-purple-50 border-purple-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <FileText className={`w-5 h-5 ${
                  violation?.severity === 'high' ? 'text-red-600' : 'text-purple-600'
                }`} />
                <div>
                  <p className="font-semibold text-gray-900">
                    {violation?.category?.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {violation?.type?.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                violation?.severity === 'high' ?'bg-red-200 text-red-800' :'bg-purple-200 text-purple-800'
              }`}>
                {violation?.severity?.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>ID: {violation?.contentId}</span>
                {violation?.autoModerated && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    Auto-Moderated
                  </span>
                )}
                <span>{new Date(violation?.timestamp)?.toLocaleString()}</span>
              </div>
              <button
                onClick={() => handleReview(violation)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Tracking:</strong> Content moderation events, spam detection patterns, community guideline 
          breaches with automated escalation workflows and trend analysis
        </p>
      </div>
    </div>
  );
};

export default PolicyViolationPanel;