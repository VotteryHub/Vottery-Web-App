import React from 'react';
import { CheckCircle, Key, Shield, Users } from 'lucide-react';

const JWTAdminRoleClaimsPanel = () => {
  const adminRoles = [
    { role: 'super_admin', permissions: ['Full System Access', 'User Management', 'Security Controls', 'Financial Oversight'], count: 2 },
    { role: 'admin', permissions: ['Platform Management', 'Content Moderation', 'Analytics Access', 'Log Viewing'], count: 5 },
    { role: 'moderator', permissions: ['Content Review', 'User Support', 'Limited Analytics', 'Activity Logs'], count: 12 }
  ];

  const jwtStructure = {
    sub: 'user-uuid',
    role: 'authenticated',
    user_metadata: {
      role: 'admin | super_admin | moderator',
      admin_level: 'super_admin | admin | moderator',
      permissions: ['view_all_logs', 'manage_users', 'financial_oversight']
    },
    app_metadata: {
      provider: 'email',
      providers: ['email']
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">JWT Admin Role Claims</h2>
      </div>

      {/* Admin Roles */}
      <div className="mb-8">
        <h3 className="font-semibold text-slate-900 mb-4">Admin Role Hierarchy</h3>
        <div className="space-y-4">
          {adminRoles?.map((admin, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{admin?.role?.replace('_', ' ')?.toUpperCase()}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4" />
                      <span>{admin?.count} active users</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {admin?.permissions?.map((permission, pidx) => (
                  <span key={pidx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JWT Structure */}
      <div className="mb-8">
        <h3 className="font-semibold text-slate-900 mb-4">JWT Token Structure</h3>
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-green-400 font-mono">
            {JSON.stringify(jwtStructure, null, 2)}
          </pre>
        </div>
      </div>

      {/* Permission Matrix */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Permission Validation</h3>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-3 text-sm font-semibold text-slate-900">Function</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-900">Purpose</th>
                <th className="text-center p-3 text-sm font-semibold text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-3 font-mono text-sm text-slate-900">is_admin_from_auth()</td>
                <td className="p-3 text-sm text-slate-600">Check admin role from JWT metadata</td>
                <td className="p-3 text-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-3 font-mono text-sm text-slate-900">is_admin_from_profile()</td>
                <td className="p-3 text-sm text-slate-600">Check admin role from user_profiles table</td>
                <td className="p-3 text-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-3 font-mono text-sm text-slate-900">is_platform_admin()</td>
                <td className="p-3 text-sm text-slate-600">Combined admin check (auth OR profile)</td>
                <td className="p-3 text-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Monitoring */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold text-slate-900">Real-time Security Monitoring</h4>
        </div>
        <p className="text-sm text-slate-600">
          All admin actions are logged with JWT claims validation. Authentication tokens are verified on every request 
          with automatic refresh and security monitoring for suspicious activity.
        </p>
      </div>
    </div>
  );
};

export default JWTAdminRoleClaimsPanel;