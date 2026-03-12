import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CollaborativeGoalsPanel = ({ goals, onRefresh }) => {
  const getStatusColor = (status) => {
    const colors = {
      'on-track': 'text-green-600 bg-green-50 dark:bg-green-900/20',
      'at-risk': 'text-red-600 bg-red-50 dark:bg-red-900/20',
      'completed': 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    };
    return colors?.[status] || colors?.['on-track'];
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 7) return `${diffDays} days left`;
    return date?.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Collaborative Goals</h2>
            <p className="text-sm text-muted-foreground">Track team objectives and progress with shared accountability</p>
          </div>
          <Button iconName="Plus" size="sm">
            New Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Target" size={20} className="text-green-600" />
              <span className="text-sm font-semibold text-green-900 dark:text-green-100">On Track</span>
            </div>
            <div className="text-2xl font-heading font-bold text-green-600 font-data">
              {goals?.filter(g => g?.status === 'on-track')?.length || 0}
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="AlertTriangle" size={20} className="text-red-600" />
              <span className="text-sm font-semibold text-red-900 dark:text-red-100">At Risk</span>
            </div>
            <div className="text-2xl font-heading font-bold text-red-600 font-data">
              {goals?.filter(g => g?.status === 'at-risk')?.length || 0}
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={20} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Completed</span>
            </div>
            <div className="text-2xl font-heading font-bold text-blue-600 font-data">
              {goals?.filter(g => g?.status === 'completed')?.length || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {goals?.map((goal) => (
          <div key={goal?.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-heading font-semibold text-foreground">{goal?.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusColor(goal?.status)}`}>
                    {goal?.status?.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon name="User" size={14} />
                    <span>Owner: {goal?.owner}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" size={14} />
                    <span>{formatDeadline(goal?.deadline)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Progress</span>
                <span className="text-sm font-bold text-primary font-data">{goal?.progress?.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getProgressColor(goal?.progress)} transition-all duration-500`}
                  style={{ width: `${goal?.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Value</span>
                  <span className="text-lg font-heading font-bold text-foreground font-data">{goal?.currentValue}</span>
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Target Value</span>
                  <span className="text-lg font-heading font-bold text-foreground font-data">{goal?.targetValue}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Users" size={16} className="text-muted-foreground" />
                <div className="flex -space-x-2">
                  {goal?.contributors?.map((contributor, index) => (
                    <div
                      key={index}
                      className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold border-2 border-background"
                      title={contributor}
                    >
                      {contributor?.charAt(0)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{goal?.contributors?.length} contributors</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" iconName="MessageSquare">
                  Discuss
                </Button>
                <Button variant="outline" size="sm" iconName="Edit">
                  Update
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Goal Setting Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Target" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">SMART Goals</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Set Specific, Measurable, Achievable, Relevant, and Time-bound objectives
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Users" size={20} className="text-green-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">Shared Accountability</h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Assign clear ownership and involve team members for collaborative success
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="TrendingUp" size={20} className="text-purple-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">Regular Updates</h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Track progress frequently and adjust strategies based on performance data
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="MessageSquare" size={20} className="text-orange-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">Open Communication</h4>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Discuss challenges and celebrate wins together as a team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeGoalsPanel;