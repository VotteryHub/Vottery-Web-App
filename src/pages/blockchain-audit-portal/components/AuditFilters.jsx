import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AuditFilters = ({ filters, onFilterChange, onApplyFilters, onResetFilters }) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'passed', label: 'Passed' },
    { value: 'failed', label: 'Failed' },
    { value: 'warning', label: 'Warning' }
  ];

  const electionTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'standard', label: 'Standard Election' },
    { value: 'lotterized', label: 'Lotterized Election' },
    { value: 'sponsored', label: 'Sponsored Election' }
  ];

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="Filter" size={20} color="var(--color-secondary)" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Filter Audits
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Refine your audit search
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date"
            value={filters?.startDate}
            onChange={(e) => onFilterChange('startDate', e?.target?.value)}
          />
          <Input
            type="date"
            label="End Date"
            value={filters?.endDate}
            onChange={(e) => onFilterChange('endDate', e?.target?.value)}
          />
        </div>

        <Select
          label="Audit Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <Select
          label="Election Type"
          options={electionTypeOptions}
          value={filters?.electionType}
          onChange={(value) => onFilterChange('electionType', value)}
        />

        <Input
          type="text"
          label="Transaction Hash"
          placeholder="Enter blockchain transaction hash"
          value={filters?.transactionHash}
          onChange={(e) => onFilterChange('transactionHash', e?.target?.value)}
        />

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button 
            variant="default" 
            fullWidth 
            iconName="Search" 
            iconPosition="left"
            onClick={onApplyFilters}
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            fullWidth 
            iconName="RotateCcw" 
            iconPosition="left"
            onClick={onResetFilters}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditFilters;