import React, { useState, useEffect } from 'react';
import { Shield, Crown, Eye, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const ROLES = [
  { id: 'admin', label: 'Admin', icon: Crown, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20', permissions: ['manage_members', 'approve_posts', 'delete_posts', 'manage_events', 'manage_settings'] },
  { id: 'moderator', label: 'Moderator', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', permissions: ['approve_posts', 'delete_posts', 'manage_events'] },
  { id: 'member', label: 'Member', icon: Eye, color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-700', permissions: ['view_posts', 'create_posts'] },
];

const ModeratorRolePanel = ({ groupId, isAdmin }) => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [actionLog, setActionLog] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadMembers();
    loadActionLog();
  }, [groupId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        ?.from('group_members')
        ?.select('*, user_profiles(id, username, name, avatar, verified)')
        ?.eq('group_id', groupId)
        ?.order('role', { ascending: true });

      if (error) throw error;
      setMembers(data || getMockMembers());
    } catch (err) {
      setMembers(getMockMembers());
    } finally {
      setLoading(false);
    }
  };

  const getMockMembers = () => [
    { id: '1', user_id: 'u1', role: 'admin', joined_at: new Date(Date.now() - 30 * 86400000)?.toISOString(), user_profiles: { username: 'alice_j', name: 'Alice Johnson', verified: true } },
    { id: '2', user_id: 'u2', role: 'moderator', joined_at: new Date(Date.now() - 20 * 86400000)?.toISOString(), user_profiles: { username: 'bob_s', name: 'Bob Smith', verified: false } },
    { id: '3', user_id: 'u3', role: 'moderator', joined_at: new Date(Date.now() - 15 * 86400000)?.toISOString(), user_profiles: { username: 'carol_w', name: 'Carol White', verified: true } },
    { id: '4', user_id: 'u4', role: 'member', joined_at: new Date(Date.now() - 10 * 86400000)?.toISOString(), user_profiles: { username: 'david_l', name: 'David Lee', verified: false } },
    { id: '5', user_id: 'u5', role: 'member', joined_at: new Date(Date.now() - 5 * 86400000)?.toISOString(), user_profiles: { username: 'emma_r', name: 'Emma Rodriguez', verified: false } },
  ];

  const loadActionLog = async () => {
    try {
      const { data } = await supabase
        ?.from('group_admin_actions')
        ?.select('*')
        ?.eq('group_id', groupId)
        ?.order('created_at', { ascending: false })
        ?.limit(5);

      setActionLog(data || [
        { id: '1', action: 'role_changed', target_user: 'bob_s', old_role: 'member', new_role: 'moderator', performed_by: 'alice_j', created_at: new Date(Date.now() - 86400000)?.toISOString() },
        { id: '2', action: 'post_removed', target_user: 'david_l', reason: 'Spam content', performed_by: 'bob_s', created_at: new Date(Date.now() - 172800000)?.toISOString() },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (memberId, userId, newRole) => {
    if (!isAdmin) return;
    setUpdatingId(memberId);
    try {
      const { error } = await supabase
        ?.from('group_members')
        ?.update({ role: newRole, updated_at: new Date()?.toISOString() })
        ?.eq('id', memberId);

      if (!error) {
        setMembers(prev => prev?.map(m => m?.id === memberId ? { ...m, role: newRole } : m));
        // Log the action
        await supabase?.from('group_admin_actions')?.insert({
          group_id: groupId,
          action: 'role_changed',
          target_user_id: userId,
          new_role: newRole,
          performed_by: user?.id,
          created_at: new Date()?.toISOString()
        });
        loadActionLog();
      }
    } catch (err) {
      console.error('Role change error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredMembers = members?.filter(m => {
    const matchesSearch = !searchQuery || 
      m?.user_profiles?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      m?.user_profiles?.username?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesRole = filterRole === 'all' || m?.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleConfig = (role) => ROLES?.find(r => r?.id === role) || ROLES?.[2];

  return (
    <div className="space-y-5">
      {/* Role Summary */}
      <div className="grid grid-cols-3 gap-3">
        {ROLES?.map(role => {
          const count = members?.filter(m => m?.role === role?.id)?.length;
          return (
            <div key={role?.id} className={`${role?.bg} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <role.icon className={`w-4 h-4 ${role?.color}`} />
                <span className={`text-xs font-medium ${role?.color}`}>{role?.label}s</span>
              </div>
              <p className={`text-2xl font-bold ${role?.color}`}>{count}</p>
            </div>
          );
        })}
      </div>
      {/* Members Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Member Roles
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e?.target?.value)}
                placeholder="Search members..."
                className="pl-8 pr-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 w-40"
              />
            </div>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e?.target?.value)}
              className="px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="member">Member</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMembers?.map(member => {
              const roleConfig = getRoleConfig(member?.role);
              return (
                <div key={member?.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{member?.user_profiles?.name?.[0] || 'U'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{member?.user_profiles?.name}</span>
                      {member?.user_profiles?.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
                    </div>
                    <span className="text-xs text-gray-400">@{member?.user_profiles?.username}</span>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${roleConfig?.bg}`}>
                    <roleConfig.icon className={`w-3 h-3 ${roleConfig?.color}`} />
                    <span className={`text-xs font-medium ${roleConfig?.color}`}>{roleConfig?.label}</span>
                  </div>
                  {isAdmin && member?.role !== 'admin' && (
                    <select
                      value={member?.role}
                      onChange={e => handleRoleChange(member?.id, member?.user_id, e?.target?.value)}
                      disabled={updatingId === member?.id}
                      className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none disabled:opacity-50"
                    >
                      <option value="member">Member</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Action Log */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Administrative Action Log
        </h3>
        <div className="space-y-2">
          {actionLog?.map((log, i) => (
            <div key={log?.id || i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{log?.performed_by}</span>
                  {log?.action === 'role_changed' ? ` changed ${log?.target_user}'s role to ${log?.new_role}` : ` removed post by ${log?.target_user}: ${log?.reason}`}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(log.created_at)?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeratorRolePanel;
