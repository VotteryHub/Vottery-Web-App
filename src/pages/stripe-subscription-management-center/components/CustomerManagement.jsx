import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const CustomerManagement = ({ subscriptions, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredSubscriptions = subscriptions?.filter(sub => {
    const matchesSearch = sub?.userProfiles?.fullName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         sub?.userProfiles?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && sub?.isActive) ||
                         (filterStatus === 'inactive' && !sub?.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Users" className="w-5 h-5 text-primary" />
          Customer Management
        </h2>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Customer List */}
        <div className="space-y-4">
          {filteredSubscriptions?.map((subscription) => (
            <div key={subscription?.id} className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="User" className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {subscription?.userProfiles?.fullName || 'Unknown User'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {subscription?.userProfiles?.email}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Plan</p>
                      <p className="text-sm font-medium text-foreground">
                        {subscription?.subscriptionPlans?.planName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className={`text-sm font-medium ${
                        subscription?.isActive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {subscription?.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(subscription?.startDate)?.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">End Date</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(subscription?.endDate)?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Icon name="Eye" className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredSubscriptions?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No customers found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;