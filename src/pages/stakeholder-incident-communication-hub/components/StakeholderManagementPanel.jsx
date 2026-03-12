import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StakeholderManagementPanel = ({ stakeholderGroups, onRefresh }) => {
  const getGroupTypeIcon = (type) => {
    switch (type) {
      case 'board': return 'Briefcase';
      case 'investors': return 'TrendingUp';
      case 'regulators': return 'Shield';
      case 'executives': return 'Users';
      case 'partners': return 'Handshake';
      default: return 'Users';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Stakeholder Group Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Configure recipient groups, escalation hierarchies, and communication preferences with role-based notification routing
          </p>
        </div>
        <Button onClick={onRefresh} className="flex items-center gap-2">
          <Icon name="Plus" size={16} />
          Create Group
        </Button>
      </div>

      <div className="grid gap-4">
        {stakeholderGroups?.map(group => (
          <div key={group?.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Icon name={getGroupTypeIcon(group?.groupType)} size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{group?.groupName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Type: {group?.groupType?.toUpperCase()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                group?.isActive ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
              }`}>
                {group?.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Recipients ({group?.recipients?.length || 0}):</div>
              <div className="space-y-1">
                {group?.recipients?.slice(0, 3)?.map((recipient, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    {recipient?.name || recipient?.email} ({recipient?.email})
                  </div>
                ))}
                {group?.recipients?.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{group?.recipients?.length - 3} more recipients
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Delivery Schedule</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {group?.deliverySchedule || 'Immediate'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Created</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(group?.createdAt)?.toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" className="flex items-center gap-1">
                <Icon name="Edit" size={14} />
                Edit
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Icon name="Settings" size={14} />
                Preferences
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Icon name="Send" size={14} />
                Test Notification
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StakeholderManagementPanel;
