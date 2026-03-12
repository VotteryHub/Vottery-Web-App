import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import Icon from '../../../components/AppIcon';

const StripeWebhookStatus = () => {
  const [webhookEvents, setWebhookEvents] = useState([
    {
      id: 1,
      eventType: 'payment_intent.succeeded',
      status: 'processed',
      amount: 150.00,
      timestamp: new Date()?.toISOString(),
      processingTime: '245ms'
    },
    {
      id: 2,
      eventType: 'payout.paid',
      status: 'processed',
      amount: 1250.00,
      timestamp: new Date(Date.now() - 3600000)?.toISOString(),
      processingTime: '312ms'
    },
    {
      id: 3,
      eventType: 'transfer.created',
      status: 'processing',
      amount: 500.00,
      timestamp: new Date(Date.now() - 7200000)?.toISOString(),
      processingTime: '189ms'
    }
  ]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'processed':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', label: 'Processed' };
      case 'processing':
        return { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Processing' };
      case 'failed':
        return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', label: 'Failed' };
      default:
        return { icon: AlertCircle, color: 'text-gray-600', bgColor: 'bg-gray-50', label: 'Unknown' };
    }
  };

  const webhookStats = {
    total: webhookEvents?.length,
    processed: webhookEvents?.filter(e => e?.status === 'processed')?.length,
    processing: webhookEvents?.filter(e => e?.status === 'processing')?.length,
    failed: webhookEvents?.filter(e => e?.status === 'failed')?.length
  };

  return (
    <div className="space-y-6">
      {/* Webhook Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <Icon icon={Zap} className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{webhookStats?.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <Icon icon={CheckCircle} className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-gray-900">{webhookStats?.processed}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-3">
            <Icon icon={Clock} className="w-6 h-6 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">{webhookStats?.processing}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <Icon icon={XCircle} className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">{webhookStats?.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Events */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Webhook Events</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {webhookEvents?.map((event) => {
            const statusConfig = getStatusConfig(event?.status);
            return (
              <div key={event?.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${statusConfig?.bgColor}`}>
                      <Icon icon={statusConfig?.icon} className={`w-5 h-5 ${statusConfig?.color}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-gray-900">{event?.eventType}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig?.bgColor} ${statusConfig?.color}`}>
                          {statusConfig?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date(event?.timestamp)?.toLocaleString()}</span>
                        <span>•</span>
                        <span>Processing time: {event?.processingTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${event?.amount?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Configuration</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-gray-700">Webhook URL</span>
            <span className="text-sm font-mono text-gray-600">https://api.example.com/webhooks/stripe</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-gray-700">Events Subscribed</span>
            <span className="text-sm font-medium text-blue-600">8 events</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-gray-700">Status</span>
            <span className="flex items-center gap-2 text-sm font-medium text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeWebhookStatus;
