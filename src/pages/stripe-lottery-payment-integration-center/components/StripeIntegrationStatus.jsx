import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StripeIntegrationStatus = ({ data, onRefresh }) => {
  const stripeStatus = data?.stripeStatus || {};

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Connection Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <div className="p-3 rounded-lg bg-green-100">
              <Icon name="CheckCircle" className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Stripe Connected</p>
              <p className="text-sm text-gray-600">API Version: {stripeStatus?.apiVersion || '2023-10-16'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="p-3 rounded-lg bg-blue-100">
              <Icon name="Activity" className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">API Health</p>
              <p className="text-sm text-gray-600">Operational • 99.99% uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Webhook Configuration</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Webhook" className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">payment_intent.succeeded</p>
                <p className="text-sm text-gray-600">Triggered when participation fee payment succeeds</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Webhook" className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">payment_intent.payment_failed</p>
                <p className="text-sm text-gray-600">Triggered when payment fails</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Webhook" className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">payout.paid</p>
                <p className="text-sm text-gray-600">Triggered when prize payout is completed</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* PCI DSS Compliance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">PCI DSS Compliance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">PCI DSS Level 1 Certified</p>
                <p className="text-sm text-gray-600">Highest level of payment security</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">End-to-End Encryption</p>
                <p className="text-sm text-gray-600">All payment data encrypted in transit</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Tokenization</p>
                <p className="text-sm text-gray-600">Card data never stored on servers</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">3D Secure Authentication</p>
                <p className="text-sm text-gray-600">Additional layer of card verification</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Fraud Detection</p>
                <p className="text-sm text-gray-600">Machine learning-based fraud prevention</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Regular Audits</p>
                <p className="text-sm text-gray-600">Quarterly security assessments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Keys Management</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900">Publishable Key</p>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded text-sm font-mono text-gray-700">
                pk_live_••••••••••••••••••••••••
              </code>
              <Button variant="outline" size="sm">
                <Icon name="Copy" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900">Secret Key</p>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                Restricted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded text-sm font-mono text-gray-700">
                sk_live_••••••••••••••••••••••••
              </code>
              <Button variant="outline" size="sm" disabled>
                <Icon name="EyeOff" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900">Webhook Signing Secret</p>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded text-sm font-mono text-gray-700">
                whsec_••••••••••••••••••••••••
              </code>
              <Button variant="outline" size="sm">
                <Icon name="RefreshCw" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Health Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Integration Health Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">99.99%</div>
            <p className="text-sm text-gray-600">API Uptime</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">142ms</div>
            <p className="text-sm text-gray-600">Avg Response Time</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
            <p className="text-sm text-gray-600">Webhook Delivery</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">0</div>
            <p className="text-sm text-gray-600">Failed Requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeIntegrationStatus;