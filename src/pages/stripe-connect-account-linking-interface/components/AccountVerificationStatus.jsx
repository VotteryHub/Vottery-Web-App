import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AccountVerificationStatus = ({ accountId }) => {
  const [verificationSteps, setVerificationSteps] = useState([
    { id: 'identity', label: 'Identity Verification', status: 'completed', completedAt: '2 hours ago', description: 'Government ID verified' },
    { id: 'bank', label: 'Bank Account Verification', status: 'in_progress', completedAt: null, description: 'Micro-deposit verification pending (1-2 business days)' },
    { id: 'tax', label: 'Tax Document Review', status: 'pending', completedAt: null, description: 'W-9 form under compliance review' },
    { id: 'business', label: 'Business Information', status: 'pending', completedAt: null, description: 'Business details verification' },
    { id: 'approval', label: 'Final Approval', status: 'pending', completedAt: null, description: 'Stripe Connect account activation' }
  ]);
  const [overallStatus, setOverallStatus] = useState('in_progress');

  const completedCount = verificationSteps?.filter(s => s?.status === 'completed')?.length;
  const progressPct = Math.round((completedCount / verificationSteps?.length) * 100);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return { icon: 'CheckCircle', color: 'text-green-500' };
      case 'in_progress': return { icon: 'Clock', color: 'text-blue-500' };
      case 'failed': return { icon: 'XCircle', color: 'text-red-500' };
      default: return { icon: 'Circle', color: 'text-gray-300 dark:text-gray-600' };
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'in_progress': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'failed': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
          <Icon name="ShieldCheck" size={20} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Account Verification Status</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Real-time onboarding progress</p>
        </div>
        <div className="ml-auto">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            overallStatus === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            overallStatus === 'in_progress'? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}>
            {overallStatus === 'approved' ? 'Active' : overallStatus === 'in_progress' ? 'In Progress' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{progressPct}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{completedCount} of {verificationSteps?.length} steps completed</p>
      </div>

      {/* Verification Steps */}
      <div className="space-y-3">
        {verificationSteps?.map((step, idx) => {
          const { icon, color } = getStatusIcon(step?.status);
          return (
            <div key={step?.id} className={`flex items-start gap-3 p-3 rounded-lg border ${getStatusBg(step?.status)}`}>
              <Icon name={icon} size={20} className={`${color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{step?.label}</p>
                  {step?.completedAt && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">{step?.completedAt}</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{step?.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Steps */}
      <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start gap-2">
          <Icon name="Lightbulb" size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Next Steps</p>
            <ul className="text-xs text-indigo-700 dark:text-indigo-400 mt-1 space-y-1">
              <li>• Check your bank for 2 micro-deposits (usually within 1-2 business days)</li>
              <li>• Verify the amounts in the verification section below</li>
              <li>• Upload your W-9/W-8BEN tax form to proceed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountVerificationStatus;
