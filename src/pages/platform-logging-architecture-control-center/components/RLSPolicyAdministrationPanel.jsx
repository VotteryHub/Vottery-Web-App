import React from 'react';
import { Shield, Lock, Eye, EyeOff, Users } from 'lucide-react';

const RLSPolicyAdministrationPanel = () => {
  const policies = [
    {
      name: 'admins_view_all_logs',
      table: 'platform_logs',
      operation: 'SELECT',
      role: 'authenticated',
      condition: 'is_platform_admin()',
      status: 'active',
      description: 'Admins can view all logs across the platform'
    },
    {
      name: 'users_view_own_logs',
      table: 'platform_logs',
      operation: 'SELECT',
      role: 'authenticated',
      condition: 'user_id = auth.uid() AND sensitive_data = FALSE',
      status: 'active',
      description: 'Users can view their own non-sensitive logs'
    },
    {
      name: 'users_insert_own_logs',
      table: 'platform_logs',
      operation: 'INSERT',
      role: 'authenticated',
      condition: 'user_id = auth.uid()',
      status: 'active',
      description: 'Users can insert their own activity logs'
    },
    {
      name: 'anonymous_insert_logs',
      table: 'platform_logs',
      operation: 'INSERT',
      role: 'anon',
      condition: 'user_id IS NULL AND log_source = client',
      status: 'active',
      description: 'Anonymous users can log client-side events'
    }
  ];

  const accessLevels = [
    { role: 'Admin', read: 'All Logs', write: 'All Logs', sensitive: 'Full Access' },
    { role: 'User', read: 'Own Logs (Non-Sensitive)', write: 'Own Logs', sensitive: 'No Access' },
    { role: 'Anonymous', read: 'No Access', write: 'Client Logs Only', sensitive: 'No Access' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">RLS Policy Administration</h2>
      </div>

      {/* Active Policies */}
      <div className="mb-8">
        <h3 className="font-semibold text-slate-900 mb-4">Active RLS Policies</h3>
        <div className="space-y-3">
          {policies?.map((policy, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-slate-900 font-mono text-sm">{policy?.name}</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{policy?.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Table: <span className="font-mono text-slate-700">{policy?.table}</span></span>
                    <span>Operation: <span className="font-semibold text-blue-600">{policy?.operation}</span></span>
                    <span>Role: <span className="font-semibold text-purple-600">{policy?.role}</span></span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {policy?.status?.toUpperCase()}
                </span>
              </div>
              <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200">
                <p className="text-xs text-slate-600 mb-1">Condition:</p>
                <code className="text-xs font-mono text-slate-900">{policy?.condition}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Access Level Matrix */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Access Level Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-3 text-sm font-semibold text-slate-900">Role</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-900">Read Access</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-900">Write Access</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-900">Sensitive Data</th>
              </tr>
            </thead>
            <tbody>
              {accessLevels?.map((level, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-slate-900">{level?.role}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-slate-700">{level?.read}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-700">{level?.write}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {level?.sensitive === 'Full Access' ? (
                        <Eye className="w-4 h-4 text-purple-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-sm text-slate-700">{level?.sensitive}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RLSPolicyAdministrationPanel;