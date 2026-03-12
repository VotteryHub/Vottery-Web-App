import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SystemActivityLog = ({ activities }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'election', label: 'Election Actions' },
    { value: 'user', label: 'User Management' },
    { value: 'security', label: 'Security Events' },
    { value: 'system', label: 'System Changes' },
  ];

  const filteredActivities = activities?.filter(activity => {
    const matchesSearch = activity?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         activity?.admin?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesType = filterType === 'all' || activity?.type === filterType;
    return matchesSearch && matchesType;
  });

  const getActivityIcon = (type) => {
    const icons = {
      election: 'Vote',
      user: 'Users',
      security: 'Shield',
      system: 'Settings',
      content: 'FileText',
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (severity) => {
    const colors = {
      high: 'text-destructive',
      medium: 'text-warning',
      low: 'text-primary',
      info: 'text-muted-foreground',
    };
    return colors?.[severity] || 'text-foreground';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="search"
          placeholder="Search activity logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="flex-1"
        />
        <Select
          options={activityTypes}
          value={filterType}
          onChange={setFilterType}
          className="w-full sm:w-48"
        />
        <Button variant="outline" iconName="Download">
          Export
        </Button>
      </div>
      <div className="card overflow-hidden p-0">
        <div className="max-h-[600px] overflow-y-auto">
          <div className="divide-y divide-border">
            {filteredActivities?.map((activity) => (
              <div
                key={activity?.id}
                className="p-4 hover:bg-muted/30 transition-colors duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity?.severity === 'high' ? 'bg-destructive/10' :
                    activity?.severity === 'medium'? 'bg-warning/10' : 'bg-primary/10'
                  }`}>
                    <Icon
                      name={getActivityIcon(activity?.type)}
                      size={20}
                      className={getActivityColor(activity?.severity)}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <p className="font-medium text-foreground">{activity?.description}</p>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                        activity?.severity === 'high' ? 'bg-destructive/10 text-destructive' :
                        activity?.severity === 'medium'? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                      }`}>
                        {activity?.severity?.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="User" size={14} />
                        {activity?.admin}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        {activity?.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="MapPin" size={14} />
                        {activity?.ipAddress}
                      </span>
                    </div>

                    {activity?.details && (
                      <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">{activity?.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {filteredActivities?.length === 0 && (
        <div className="card text-center py-12">
          <Icon name="FileSearch" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">No activities found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default SystemActivityLog;