import React from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

const SecurityControlsPanel = () => {
  return (
    <div className="space-y-6">
      {/* CORS Configuration */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">CORS Configuration</h2>
            <p className="text-gray-600">Cross-Origin Resource Sharing settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Origins</label>
            <div className="space-y-2">
              {['https://vottery.com', 'https://app.vottery.com', 'http://localhost:3000']?.map((origin) => (
                <div key={origin} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <code className="text-sm text-gray-900">{origin}</code>
                  <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                </div>
              ))}
            </div>
            <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">+ Add Origin</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5" defaultChecked />
                <span className="text-sm font-medium text-gray-700">Allow Credentials</span>
              </label>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5" defaultChecked />
                <span className="text-sm font-medium text-gray-700">Preflight Caching</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Input Sanitization */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Input Sanitization Rules</h2>
            <p className="text-gray-600">Prevent injection attacks and malicious input</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { rule: 'SQL Injection Prevention', status: 'active', blocked: 12 },
            { rule: 'XSS Attack Prevention', status: 'active', blocked: 8 },
            { rule: 'Command Injection Prevention', status: 'active', blocked: 3 },
            { rule: 'Path Traversal Prevention', status: 'active', blocked: 5 }
          ]?.map((rule) => (
            <div key={rule?.rule} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">{rule?.rule}</p>
                  <p className="text-sm text-gray-600">Blocked {rule?.blocked} attempts today</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {rule?.status?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DDoS Protection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">DDoS Protection</h2>
            <p className="text-gray-600">Automated threat detection and mitigation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Threat Detection</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Suspicious IPs Blocked</span>
                <span className="text-lg font-bold text-gray-900">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rate Limit Violations</span>
                <span className="text-lg font-bold text-gray-900">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Automated Bots Detected</span>
                <span className="text-lg font-bold text-gray-900">15</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Protection Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">IP Blacklist</span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rate Limiting</span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bot Detection</span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityControlsPanel;