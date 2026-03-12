import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScheduledAudits = ({ scheduledAudits, onEditSchedule, onDeleteSchedule }) => {
  if (!scheduledAudits || scheduledAudits?.length === 0) {
    return (
      <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
              Scheduled Audits
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              No scheduled audits configured
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <Icon name="CalendarOff" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            Set up automated audit schedules for continuous monitoring
          </p>
          <Button variant="outline" iconName="Plus" iconPosition="left">
            Create Schedule
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
              Scheduled Audits
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {scheduledAudits?.length} active schedule{scheduledAudits?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" iconName="Plus">
          New
        </Button>
      </div>
      <div className="space-y-3">
        {scheduledAudits?.map((schedule) => (
          <div 
            key={schedule?.id}
            className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-all duration-250"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm md:text-base font-heading font-semibold text-foreground">
                    {schedule?.name}
                  </h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    schedule?.status === 'active' ?'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                  }`}>
                    {schedule?.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Clock" size={14} />
                    <span>Frequency: {schedule?.frequency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Calendar" size={14} />
                    <span>Next run: {schedule?.nextRun}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="FileSearch" size={14} />
                    <span>Audit type: {schedule?.auditType}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  iconName="Edit"
                  onClick={() => onEditSchedule(schedule?.id)}
                >
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  iconName="Trash2"
                  onClick={() => onDeleteSchedule(schedule?.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledAudits;