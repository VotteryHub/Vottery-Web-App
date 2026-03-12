import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StakeholderManagementPanel = ({ stakeholderGroups, onUpdate, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const getGroupIcon = (type) => {
    const icons = {
      board: 'Briefcase',
      investors: 'TrendingUp',
      regulators: 'Shield',
      executives: 'Users',
      partners: 'Handshake'
    };
    return icons?.[type] || 'Users';
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">Stakeholder Groups</h2>
          <Button variant="default" size="sm" iconName="Plus">
            Add New Group
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stakeholderGroups?.map((group) => (
            <div key={group?.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name={getGroupIcon(group?.groupType)} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{group?.groupName}</h3>
                    <p className="text-xs text-muted-foreground">{group?.groupType?.toUpperCase()}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full ${
                  group?.isActive ? 'bg-green-500/10' : 'bg-gray-500/10'
                }`}>
                  <span className={`text-xs font-medium ${
                    group?.isActive ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {group?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Mail" size={14} className="text-muted-foreground" />
                  <span className="text-foreground">{group?.recipients?.length || 0} recipients</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Calendar" size={14} className="text-muted-foreground" />
                  <span className="text-foreground">Schedule: {group?.deliverySchedule || 'On-demand'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" iconName="Edit">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" iconName="Users">
                  Manage Recipients
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Communication Preferences</h3>
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Personalized Content Generation</span>
              <button className="w-10 h-6 bg-primary rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Customize report content based on recipient role</p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Automated Delivery Scheduling</span>
              <button className="w-10 h-6 bg-primary rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Schedule reports based on group preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderManagementPanel;