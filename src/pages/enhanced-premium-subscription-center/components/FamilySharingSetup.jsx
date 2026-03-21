import React, { useEffect, useState } from 'react';
import { Plus, Shield, User, Baby, Trash2, Crown } from 'lucide-react';

const ROLES = [
  { id: 'primary', label: 'Primary', icon: Crown, description: 'Full account control', color: 'text-purple-500' },
  { id: 'secondary', label: 'Secondary', icon: Shield, description: 'Most features, no billing', color: 'text-blue-500' },
  { id: 'child', label: 'Child', icon: Baby, description: 'Limited with parental controls', color: 'text-green-500' },
];

const DEMO_MEMBERS = [
  { id: '1', name: 'Alex Johnson', email: 'alex@family.com', role: 'primary', usagePercent: 45, status: 'active' },
  { id: '2', name: 'Sam Johnson', email: 'sam@family.com', role: 'secondary', usagePercent: 30, status: 'active' },
  { id: '3', name: 'Jordan J.', email: 'jordan@family.com', role: 'child', usagePercent: 15, status: 'active' },
  { id: '4', name: 'Casey J.', email: 'casey@family.com', role: 'child', usagePercent: 10, status: 'pending' },
];

const STORAGE_KEY = 'vottery_family_members_v1';

const FamilySharingSetup = ({ subscriptionData, onRefresh }) => {
  const [members, setMembers] = useState(() => {
    try {
      const raw = window.localStorage?.getItem(STORAGE_KEY);
      if (!raw) return DEMO_MEMBERS;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed?.length ? parsed : DEMO_MEMBERS;
    } catch {
      return DEMO_MEMBERS;
    }
  });
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'secondary' });
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    try {
      window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch {
      // Non-blocking local persistence only.
    }
  }, [members]);

  const handleInvite = async () => {
    if (!inviteData?.email?.trim()) return;
    if (members?.some((m) => m?.email?.toLowerCase() === inviteData?.email?.trim()?.toLowerCase())) return;
    setInviting(true);
    await new Promise(r => setTimeout(r, 1000));
    setMembers(prev => [...prev, {
      id: `new_${Date.now()}`,
      name: inviteData?.email?.split('@')?.[0],
      email: inviteData?.email,
      role: inviteData?.role,
      usagePercent: 0,
      status: 'pending',
    }]);
    setInviteData({ email: '', role: 'secondary' });
    setShowInviteForm(false);
    setInviting(false);
    onRefresh?.();
  };

  const removeMember = (id) => {
    setMembers(prev => prev?.filter(m => m?.id !== id));
    onRefresh?.();
  };

  const getRoleInfo = (roleId) => ROLES?.find(r => r?.id === roleId) || ROLES?.[1];

  return (
    <div className="space-y-6">
      {/* Members List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Family Members ({members?.length}/{subscriptionData?.maxMembers || 6})</h3>
          {members?.length < (subscriptionData?.maxMembers || 6) && (
            <button
              onClick={() => setShowInviteForm(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={14} /> Invite Member
            </button>
          )}
        </div>

        {/* Invite Form */}
        {showInviteForm && (
          <div className="px-6 py-4 bg-muted/20 border-b border-border">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Email address"
                  value={inviteData?.email}
                  onChange={e => setInviteData(prev => ({ ...prev, email: e?.target?.value }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <select
                value={inviteData?.role}
                onChange={e => setInviteData(prev => ({ ...prev, role: e?.target?.value }))}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {ROLES?.filter(r => r?.id !== 'primary')?.map(r => (
                  <option key={r?.id} value={r?.id}>{r?.label}</option>
                ))}
              </select>
              <button
                onClick={handleInvite}
                disabled={inviting || !inviteData?.email?.trim()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {inviting ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-border">
          {members?.map((member) => {
            const role = getRoleInfo(member?.role);
            return (
              <div key={member?.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{member?.name}</p>
                    {member?.status === 'pending' && (
                      <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full">Pending</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{member?.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 bg-muted rounded-full h-1.5 max-w-24">
                      <div className="h-1.5 bg-primary rounded-full" style={{ width: `${member?.usagePercent}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{member?.usagePercent}% usage</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${role?.color}`}>
                    <role.icon size={14} />
                    {role?.label}
                  </div>
                  {member?.role !== 'primary' && (
                    <button
                      onClick={() => removeMember(member?.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Role Descriptions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ROLES?.map((role) => (
            <div key={role?.id} className="p-4 bg-muted/30 rounded-xl">
              <div className={`flex items-center gap-2 mb-2 ${role?.color}`}>
                <role.icon size={18} />
                <span className="font-semibold text-sm">{role?.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{role?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FamilySharingSetup;
