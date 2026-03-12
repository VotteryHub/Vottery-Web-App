import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ActivityFilters = ({ filters, admins, onFilterChange, onClearFilters }) => {
  const actionTypeOptions = [
    { value: 'all', label: 'All Actions' },
    { value: 'user_management', label: 'User Management' },
    { value: 'election_approval', label: 'Election Approval' },
    { value: 'election_rejection', label: 'Election Rejection' },
    { value: 'content_moderation', label: 'Content Moderation' },
    { value: 'system_configuration', label: 'System Configuration' },
    { value: 'security_event', label: 'Security Event' },
    { value: 'data_export', label: 'Data Export' },
    { value: 'policy_update', label: 'Policy Update' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
    { value: 'info', label: 'Info' }
  ];

  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: 'year', label: 'This Year' }
  ];

  const adminOptions = [
    { value: null, label: 'All Admins' },
    ...admins?.map(admin => ({
      value: admin?.id,
      label: admin?.name || admin?.email
    }))
  ];

  const hasActiveFilters = 
    filters?.actionType !== 'all' ||
    filters?.severity !== 'all' ||
    filters?.timeRange !== 'all' ||
    filters?.complianceRelevant !== undefined ||
    filters?.adminId !== null ||
    filters?.search !== '';

  return (
    <div className="card sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
          <Icon name="Filter" size={20} />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Search
          </label>
          <Input
            type="search"
            placeholder="Search logs..."
            value={filters?.search}
            onChange={(e) => onFilterChange({ search: e?.target?.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Action Type
          </label>
          <Select
            options={actionTypeOptions}
            value={filters?.actionType}
            onChange={(value) => onFilterChange({ actionType: value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Severity
          </label>
          <Select
            options={severityOptions}
            value={filters?.severity}
            onChange={(value) => onFilterChange({ severity: value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Time Range
          </label>
          <Select
            options={timeRangeOptions}
            value={filters?.timeRange}
            onChange={(value) => onFilterChange({ timeRange: value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Administrator
          </label>
          <Select
            options={adminOptions}
            value={filters?.adminId}
            onChange={(value) => onFilterChange({ adminId: value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters?.complianceRelevant === true}
              onChange={(e) => onFilterChange({ 
                complianceRelevant: e?.target?.checked ? true : undefined 
              })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-foreground">
              Compliance Relevant Only
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Info" size={14} />
          <span>Filters apply in real-time</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityFilters;