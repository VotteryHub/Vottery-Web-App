import React from 'react';
import Icon from '../../../components/AppIcon';

function ResolutionTemplatesPanel({ templates }) {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'payment_dispute': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'policy_violation': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'compliance_conflict': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'payment_dispute': return 'Payment Dispute';
      case 'policy_violation': return 'Policy Violation';
      case 'compliance_conflict': return 'Compliance Conflict';
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="FileText" size={24} className="text-purple-600" />
          Resolution Templates
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Pre-configured resolution workflows with automated actions and approval thresholds
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates?.map(template => (
            <div
              key={template?.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(template?.category)}`}>
                      {getCategoryLabel(template?.category)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{template?.name}</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="font-semibold">Template ID:</span> {template?.id}
                  </div>
                </div>
              </div>

              {/* Auto-Approval Threshold */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Auto-Approval Threshold</span>
                  <span className="text-lg font-bold text-purple-600">{template?.autoApprovalThreshold}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600" 
                    style={{ width: `${template?.autoApprovalThreshold}%` }}
                  ></div>
                </div>
              </div>

              {/* Automated Actions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Automated Actions</h4>
                <div className="space-y-2">
                  {template?.actions?.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Icon name="CheckCircle" size={16} className="text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {action?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                  Apply Template
                </button>
                <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Create New Template */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Plus" size={20} className="text-purple-600" />
          Create Custom Template
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Design custom resolution workflows tailored to your specific dispute categories and business rules
        </p>
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2">
          <Icon name="Sparkles" size={18} />
          Create New Template
        </button>
      </div>
      {/* Template Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-purple-600" />
          Template Performance Metrics
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-1">87%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Auto-Resolution Rate</div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-1">3.2h</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Resolution Time</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-1">94%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResolutionTemplatesPanel;