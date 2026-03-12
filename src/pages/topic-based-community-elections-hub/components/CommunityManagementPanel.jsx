import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { googleAnalyticsService } from '../../../services/googleAnalyticsService';

const CommunityManagementPanel = ({ communityId }) => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [communityId]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        ?.from('community_members')
        ?.select(`
          *,
          user_profiles(id, name, username, avatar, email)
        `)
        ?.eq('community_id', communityId)
        ?.order('joined_at', { ascending: false });

      if (!error) setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      const { error } = await supabase
        ?.from('community_members')
        ?.update({ role: newRole })
        ?.eq('id', memberId);

      if (!error) {
        // Track role change
        googleAnalyticsService?.trackSocialInteraction('community_role_changed', communityId, {
          member_id: memberId,
          new_role: newRole
        });

        loadMembers();
        setShowRoleModal(false);
      }
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const { error } = await supabase
        ?.from('community_members')
        ?.delete()
        ?.eq('id', memberId);

      if (!error) {
        // Track member removal
        googleAnalyticsService?.trackSocialInteraction('community_member_removed', communityId, {
          member_id: memberId
        });

        loadMembers();
      }
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const roleColors = {
    admin: 'bg-primary/10 text-primary',
    moderator: 'bg-secondary/10 text-secondary',
    member: 'bg-muted text-muted-foreground'
  };

  const rolePermissions = {
    admin: ['Full management', 'Assign roles', 'Remove members', 'Moderate content', 'Create elections', 'Delete community'],
    moderator: ['Moderate content', 'Remove posts', 'Warn members', 'Review flags', 'Create elections'],
    member: ['Participate in elections', 'Create posts', 'Comment', 'Vote']
  };

  return (
    <div className="bg-background rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Community Management
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage member roles and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Users" size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            {members?.length} members
          </span>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader" size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {members?.map(member => (
            <div key={member?.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {member?.user_profiles?.avatar ? (
                    <img src={member?.user_profiles?.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <Icon name="User" size={20} className="text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {member?.user_profiles?.name || member?.user_profiles?.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member?.user_profiles?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs rounded-md font-medium ${roleColors?.[member?.role]}`}>
                  {member?.role}
                </span>
                {member?.user_id !== user?.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setShowRoleModal(true);
                      }}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Change role"
                    >
                      <Icon name="Shield" size={16} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleRemoveMember(member?.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Remove member"
                    >
                      <Icon name="Trash2" size={16} className="text-destructive" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Role Change Modal */}
      {showRoleModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Change Member Role
              </h3>
              <button onClick={() => setShowRoleModal(false)}>
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Member</p>
                <p className="font-medium text-foreground">
                  {selectedMember?.user_profiles?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Current role: <span className="font-medium">{selectedMember?.role}</span>
                </p>
              </div>

              <div className="space-y-3">
                {['admin', 'moderator', 'member']?.map(role => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(selectedMember?.id, role)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedMember?.role === role
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground capitalize">{role}</span>
                      <span className={`px-2 py-1 text-xs rounded-md font-medium ${roleColors?.[role]}`}>
                        {role}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {rolePermissions?.[role]?.map(permission => (
                        <li key={permission} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Icon name="Check" size={14} className="text-success" />
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setShowRoleModal(false)}
                variant="secondary"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityManagementPanel;