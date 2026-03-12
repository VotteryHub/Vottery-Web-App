import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const UserManagementTable = ({ users, onUserAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const filteredUsers = users?.filter(user =>
    user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedUsers(filteredUsers?.map(u => u?.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev?.includes(userId)
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { bg: 'bg-destructive/10', text: 'text-destructive', icon: 'Shield' },
      moderator: { bg: 'bg-warning/10', text: 'text-warning', icon: 'ShieldCheck' },
      user: { bg: 'bg-primary/10', text: 'text-primary', icon: 'User' },
      verified: { bg: 'bg-success/10', text: 'text-success', icon: 'CheckCircle' },
    };
    const badge = badges?.[role] || badges?.user;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge?.bg} ${badge?.text}`}>
        <Icon name={badge?.icon} size={12} />
        {role?.charAt(0)?.toUpperCase() + role?.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-success/10', text: 'text-success', label: 'Active' },
      suspended: { bg: 'bg-warning/10', text: 'text-warning', label: 'Suspended' },
      banned: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Banned' },
    };
    const badge = badges?.[status] || badges?.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge?.bg} ${badge?.text}`}>
        {badge?.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Input
          type="search"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="w-full sm:w-80"
        />
        {selectedUsers?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" iconName="Mail">
              Email Selected ({selectedUsers?.length})
            </Button>
            <Button variant="destructive" size="sm" iconName="Ban">
              Suspend Selected
            </Button>
          </div>
        )}
      </div>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-border"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-foreground">User</th>
                <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-foreground hidden md:table-cell">Role</th>
                <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-foreground hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-foreground hidden lg:table-cell">Joined</th>
                <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-foreground hidden xl:table-cell">Activity</th>
                <th className="px-4 py-3 text-right text-sm font-heading font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers?.map((user) => (
                <tr key={user?.id} className="hover:bg-muted/30 transition-colors duration-200">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers?.includes(user?.id)}
                      onChange={() => handleSelectUser(user?.id)}
                      className="w-4 h-4 rounded border-border"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={user?.avatar}
                          alt={user?.avatarAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{user?.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {getRoleBadge(user?.role)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {getStatusBadge(user?.status)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-sm text-foreground font-data">{user?.joinedDate}</p>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Votes: <span className="font-data font-medium text-foreground">{user?.votesCount}</span></p>
                      <p className="text-xs text-muted-foreground">Elections: <span className="font-data font-medium text-foreground">{user?.electionsCreated}</span></p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        iconName="Eye"
                        onClick={() => onUserAction('view', user?.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        iconName="MoreVertical"
                        onClick={() => onUserAction('menu', user?.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filteredUsers?.length === 0 && (
        <div className="card text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">No users found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;