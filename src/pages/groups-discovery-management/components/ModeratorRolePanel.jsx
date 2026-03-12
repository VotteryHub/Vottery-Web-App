import React, { useState } from 'react';
import { Shield, Crown, User, UserCheck, Plus, Trash2 } from 'lucide-react';
import Icon from '../../../components/AppIcon';



const ROLES = [
  { id: 'admin', label: 'Admin', icon: Crown, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', permissions: ['approve_posts', 'remove_members', 'edit_group', 'assign_moderators', 'delete_posts'] },
  { id: 'moderator', label: 'Moderator', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', permissions: ['approve_posts', 'remove_members', 'delete_posts'] },
  { id: 'member', label: 'Member', icon: User, color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-700', permissions: ['post', 'comment', 'vote'] },
];

const ModeratorRolePanel = ({ groupId, isAdmin, members = [] }) => {
  const [moderators, setModerators] = useState([
    { id: '1', name: 'Alice Johnson', username: 'alicej', role: 'moderator', assignedAt: new Date(Date.now() - 7 * 86400000)?.toISOString() },
    { id: '2', name: 'Bob Smith', username: 'bobsmith', role: 'moderator', assignedAt: new Date(Date.now() - 14 * 86400000)?.toISOString() },
  ]);
  const [showAssign, setShowAssign] = useState(false);
  const [newModEmail, setNewModEmail] = useState('');

  const handleAssignModerator = async () => {
    if (!newModEmail) return;
    const newMod = {
      id: Date.now()?.toString(),
      name: newModEmail?.split('@')?.[0],
      username: newModEmail?.split('@')?.[0],
      role: 'moderator',
      assignedAt: new Date()?.toISOString()
    };
    setModerators(prev => [...prev, newMod]);
    setNewModEmail('');
    setShowAssign(false);
  };

  const handleRemoveModerator = async (modId) => {
    setModerators(prev => prev?.filter(m => m?.id !== modId));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900 dark:text-white">Moderator Roles</h3>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAssign(p => !p)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-3 h-3" /> Assign Moderator
          </button>
        )}
      </div>
      {/* Role Permissions Reference */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {ROLES?.map(role => {
          const Icon = role?.icon;
          return (
            <div key={role?.id} className={`${role?.bg} rounded-lg p-3`}>
              <div className="flex items-center gap-1 mb-2">
                <Icon className={`w-4 h-4 ${role?.color}`} />
                <span className={`text-xs font-bold ${role?.color}`}>{role?.label}</span>
              </div>
              <div className="space-y-0.5">
                {role?.permissions?.slice(0, 3)?.map(p => (
                  <p key={p} className="text-xs text-gray-500">• {p?.replace(/_/g, ' ')}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {showAssign && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Assign New Moderator</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="User email"
              value={newModEmail}
              onChange={e => setNewModEmail(e?.target?.value)}
              className="flex-1 p-2 border border-blue-200 rounded-lg text-sm bg-white dark:bg-gray-800"
            />
            <button onClick={handleAssignModerator} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Assign</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {moderators?.map(mod => (
          <div key={mod?.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{mod?.name}</p>
                <p className="text-xs text-gray-500">@{mod?.username} · Since {new Date(mod.assignedAt)?.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium capitalize">{mod?.role}</span>
              {isAdmin && (
                <button onClick={() => handleRemoveModerator(mod?.id)} className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModeratorRolePanel;
