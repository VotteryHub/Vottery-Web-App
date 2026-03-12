import React from 'react';
import { Zap, Tag, Shield, AlertTriangle } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const LogCategorizationEnginePanel = () => {
  const categories = [
    { name: 'Public', level: 'public', count: 12450, color: 'green', retention: '2 years' },
    { name: 'Internal', level: 'internal', count: 34200, color: 'blue', retention: '1 year' },
    { name: 'Confidential', level: 'confidential', count: 8900, color: 'yellow', retention: '180 days' },
    { name: 'Restricted', level: 'restricted', count: 2340, color: 'red', retention: '90 days' }
  ];

  const rules = [
    {
      trigger: 'Payment & Fraud Detection',
      action: 'Auto-classify as RESTRICTED',
      sensitivity: 'High',
      icon: Shield
    },
    {
      trigger: 'Security & AI Analysis',
      action: 'Auto-classify as CONFIDENTIAL',
      sensitivity: 'High',
      icon: AlertTriangle
    },
    {
      trigger: 'Voting & User Activity',
      action: 'Auto-classify as INTERNAL',
      sensitivity: 'Medium',
      icon: Tag
    },
    {
      trigger: 'Sensitive Keywords Detected',
      action: 'Escalate to RESTRICTED',
      sensitivity: 'Critical',
      icon: Shield
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-700 border-green-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      red: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors?.[color] || colors?.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">Log Categorization Engine</h2>
      </div>

      {/* Sensitivity Distribution */}
      <div className="mb-8">
        <h3 className="font-semibold text-slate-900 mb-4">Automated Sensitivity Classification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories?.map((category, idx) => (
            <div key={idx} className={`border rounded-lg p-4 ${getColorClasses(category?.color)}`}>
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5" />
                <span className="text-xs font-medium">{category?.retention}</span>
              </div>
              <h4 className="font-semibold mb-1">{category?.name}</h4>
              <p className="text-2xl font-bold">{category?.count?.toLocaleString()}</p>
              <p className="text-xs mt-1">logs classified</p>
            </div>
          ))}
        </div>
      </div>

      {/* Classification Rules */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Active Classification Rules</h3>
        <div className="space-y-3">
          {rules?.map((rule, idx) => {
            const Icon = rule?.icon;
            return (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-slate-900">{rule?.trigger}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rule?.sensitivity === 'Critical' ? 'bg-red-100 text-red-700' :
                        rule?.sensitivity === 'High'? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {rule?.sensitivity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{rule?.action}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ML-Powered Analysis */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-slate-900">Machine Learning Analysis</h4>
        </div>
        <p className="text-sm text-slate-600">
          Content analysis powered by AI detects sensitive keywords (password, credit_card, ssn, api_key, secret, token) 
          and automatically escalates classification level for enhanced security.
        </p>
      </div>
    </div>
  );
};

export default LogCategorizationEnginePanel;