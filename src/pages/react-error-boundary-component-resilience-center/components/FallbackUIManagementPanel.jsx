import React from 'react';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';

const FallbackUIManagementPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Fallback UI Management
        </h3>
        <p className="text-neutral-600 mb-6">
          Graceful degradation interfaces with user-friendly error messages and recovery actions
        </p>
      </div>

      <div className="p-6 bg-white rounded-lg border border-neutral-200">
        <h4 className="font-semibold text-neutral-800 mb-4">Fallback Component Preview</h4>
        <div className="p-8 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300">
          <div className="text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">Something went wrong</h3>
            <p className="text-neutral-600 mb-6">
              We encountered an unexpected error while processing your request. Don't worry, your data is safe.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition-colors">
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-neutral-800 mb-4">User-Friendly Messages</h4>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Clear, non-technical error descriptions
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Reassurance that data is safe
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Context-aware messaging based on error type
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Helpful suggestions for next steps
            </li>
          </ul>
        </div>

        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-neutral-800 mb-4">Recovery Actions</h4>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              Retry failed operation
            </li>
            <li className="flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-600" />
              Navigate to home page
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              Contact support
            </li>
            <li className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              View error details (for admins)
            </li>
          </ul>
        </div>
      </div>

      <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200">
        <h4 className="font-semibold text-neutral-800 mb-4">Seamless User Experience Preservation</h4>
        <div className="space-y-3 text-sm text-neutral-700">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <p className="font-medium">Component Isolation</p>
              <p className="text-neutral-600">Failed components don't crash the entire application</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <p className="font-medium">Partial Functionality</p>
              <p className="text-neutral-600">Unaffected features remain fully functional</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <p className="font-medium">Automatic Recovery</p>
              <p className="text-neutral-600">Components attempt self-recovery when possible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackUIManagementPanel;