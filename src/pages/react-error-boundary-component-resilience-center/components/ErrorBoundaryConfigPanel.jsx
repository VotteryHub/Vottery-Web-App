import React from 'react';
import { Settings, Shield, Code, AlertTriangle } from 'lucide-react';

const ErrorBoundaryConfigPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Error Boundary Configuration
        </h3>
        <p className="text-neutral-600 mb-6">
          Configure automated error boundary deployment across admin and creator screens
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-neutral-800">Admin Screens</h4>
          </div>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Admin Control Center
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Content Moderation Center
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              User Analytics Dashboard
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Compliance Dashboard
            </li>
          </ul>
        </div>

        <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-purple-600" />
            <h4 className="font-semibold text-neutral-800">Creator Screens</h4>
          </div>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Creator Earnings Center
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Election Creation Studio
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Campaign Management
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Analytics Dashboard
            </li>
          </ul>
        </div>
      </div>

      <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200">
        <h4 className="font-semibold text-neutral-800 mb-4">Boundary Placement Strategy</h4>
        <div className="space-y-3 text-sm text-neutral-700">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="font-medium">Granular Boundary Placement</p>
              <p className="text-neutral-600">Each critical component wrapped with dedicated error boundary</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Fallback Component Customization</p>
              <p className="text-neutral-600">Context-aware error messages with recovery actions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryConfigPanel;