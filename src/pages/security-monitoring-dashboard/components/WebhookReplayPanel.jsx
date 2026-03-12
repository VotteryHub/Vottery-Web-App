import React, { useState } from 'react';
import { Lock, CheckCircle } from 'lucide-react';

const WebhookReplayPanel = () => {
  const [replayAttempts] = useState([
    // Mock data - in production, this would come from webhook_idempotency table
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lock className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-900">Webhook Replay Attack Indicators</h2>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Protected
        </span>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-gray-900">Webhook Replay Protection Active</p>
              <p className="text-sm text-gray-600 mt-1">
                All webhooks validated with timestamp checking (5-minute tolerance) and idempotency keys
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Timestamp Validation</p>
            <p className="text-2xl font-bold text-gray-900">✓ Enabled</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Idempotency Check</p>
            <p className="text-2xl font-bold text-gray-900">✓ Active</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Replay Attempts Blocked</p>
            <p className="text-2xl font-bold text-gray-900">{replayAttempts?.length || 0}</p>
          </div>
        </div>

        {replayAttempts?.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p>No webhook replay attempts detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhookReplayPanel;