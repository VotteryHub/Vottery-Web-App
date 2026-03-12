import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RecipientManagementPanel = ({ schedules, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const recipientGroups = [
    {
      id: 'compliance-team',
      name: 'Compliance Team',
      icon: 'Shield',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      count: 12,
      recipients: [
        { email: 'compliance@example.com', name: 'Compliance Lead', status: 'active' },
        { email: 'audit@example.com', name: 'Audit Manager', status: 'active' },
        { email: 'legal@example.com', name: 'Legal Counsel', status: 'active' }
      ]
    },
    {
      id: 'finance-team',
      name: 'Finance Team',
      icon: 'DollarSign',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      count: 8,
      recipients: [
        { email: 'cfo@example.com', name: 'Chief Financial Officer', status: 'active' },
        { email: 'finance@example.com', name: 'Finance Manager', status: 'active' },
        { email: 'accounting@example.com', name: 'Accounting Lead', status: 'active' }
      ]
    },
    {
      id: 'marketing-team',
      name: 'Marketing Team',
      icon: 'TrendingUp',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      count: 15,
      recipients: [
        { email: 'marketing@example.com', name: 'Marketing Director', status: 'active' },
        { email: 'campaigns@example.com', name: 'Campaign Manager', status: 'active' },
        { email: 'analytics@example.com', name: 'Analytics Lead', status: 'active' }
      ]
    },
    {
      id: 'executive-team',
      name: 'Executive Team',
      icon: 'Users',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      count: 5,
      recipients: [
        { email: 'ceo@example.com', name: 'Chief Executive Officer', status: 'active' },
        { email: 'coo@example.com', name: 'Chief Operating Officer', status: 'active' },
        { email: 'cto@example.com', name: 'Chief Technology Officer', status: 'active' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search recipients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              icon="Search"
            />
          </div>
          <div className="flex gap-2">
            <Button iconName="UserPlus">Add Recipient</Button>
            <Button variant="outline" iconName="Users">New Group</Button>
          </div>
        </div>
      </div>

      {/* Recipient Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipientGroups?.map((group) => (
          <div key={group?.id} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${group?.bgColor}`}>
                <Icon name={group?.icon} size={20} className={group?.color} />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-foreground">{group?.name}</h3>
                <p className="text-xs text-muted-foreground">{group?.count} recipients</p>
              </div>
              <Button variant="ghost" size="sm" iconName="Settings" />
            </div>

            <div className="space-y-2 mb-4">
              {group?.recipients?.map((recipient, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="User" size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{recipient?.name}</p>
                      <p className="text-xs text-muted-foreground">{recipient?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${recipient?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" iconName="ChevronDown" className="w-full">
              View All {group?.count} Recipients
            </Button>
          </div>
        ))}
      </div>

      {/* Segmentation */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recipient Segmentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Target" size={18} className="text-blue-600" />
              <h4 className="font-semibold text-foreground">By Role</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Executives</span>
                <span className="text-sm font-bold text-foreground font-data">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Managers</span>
                <span className="text-sm font-bold text-foreground font-data">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Analysts</span>
                <span className="text-sm font-bold text-foreground font-data">17</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Building" size={18} className="text-green-600" />
              <h4 className="font-semibold text-foreground">By Department</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Finance</span>
                <span className="text-sm font-bold text-foreground font-data">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Marketing</span>
                <span className="text-sm font-bold text-foreground font-data">15</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Compliance</span>
                <span className="text-sm font-bold text-foreground font-data">12</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Activity" size={18} className="text-purple-600" />
              <h4 className="font-semibold text-foreground">By Engagement</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">High</span>
                <span className="text-sm font-bold text-foreground font-data">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Medium</span>
                <span className="text-sm font-bold text-foreground font-data">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Low</span>
                <span className="text-sm font-bold text-foreground font-data">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="card bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Bulk Actions</h4>
            <p className="text-sm text-muted-foreground">Manage multiple recipients at once</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" iconName="Upload">Import CSV</Button>
            <Button variant="outline" iconName="Download">Export List</Button>
          </div>
        </div>
      </div>

      {/* Unsubscribe Management */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Unsubscribe Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Unsubscribes</p>
            <p className="text-3xl font-heading font-bold text-foreground font-data">23</p>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Unsubscribe Rate</p>
            <p className="text-3xl font-heading font-bold text-foreground font-data">0.27%</p>
            <p className="text-xs text-green-600 mt-1">Below industry average</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Re-subscribed</p>
            <p className="text-3xl font-heading font-bold text-foreground font-data">7</p>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientManagementPanel;