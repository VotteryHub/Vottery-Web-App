import React from 'react';
import Icon from '../../../components/AppIcon';

const LegalTeamDashboardPanel = ({ metrics, loading }) => {
  const mockMetrics = metrics || {
    teamMembers: 5,
    activeRequests: 8,
    completedThisMonth: 42,
    avgResolutionTime: '4.2 hours',
    teamActivity: [
      {
        id: 1,
        member: 'Jane Smith',
        role: 'Data Protection Officer',
        activeRequests: 3,
        completedToday: 2,
        status: 'Online'
      },
      {
        id: 2,
        member: 'John Doe',
        role: 'Compliance Manager',
        activeRequests: 2,
        completedToday: 4,
        status: 'Online'
      },
      {
        id: 3,
        member: 'Sarah Johnson',
        role: 'Legal Counsel',
        activeRequests: 3,
        completedToday: 1,
        status: 'Away'
      }
    ],
    pendingTasks: [
      {
        id: 1,
        task: 'Review GDPR data access request',
        priority: 'High',
        assignedTo: 'Jane Smith',
        dueDate: new Date(Date?.now() + 86400000)?.toISOString()
      },
      {
        id: 2,
        task: 'Approve PCI-DSS quarterly report',
        priority: 'Medium',
        assignedTo: 'John Doe',
        dueDate: new Date(Date?.now() + 86400000 * 3)?.toISOString()
      },
      {
        id: 3,
        task: 'Update data processing agreement',
        priority: 'Low',
        assignedTo: 'Sarah Johnson',
        dueDate: new Date(Date?.now() + 86400000 * 7)?.toISOString()
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online':
        return 'text-green-600 bg-green-50';
      case 'Away':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
        <div className="h-96 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Icon name="Users" size={24} className="text-indigo-600" />
          Legal Team Dashboard
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-indigo-600 font-medium">Team Members</span>
              <Icon name="Users" size={20} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-indigo-900">{mockMetrics?.teamMembers}</div>
            <div className="text-xs text-indigo-600 mt-1">Active today</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yellow-600 font-medium">Active Requests</span>
              <Icon name="AlertCircle" size={20} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-900">{mockMetrics?.activeRequests}</div>
            <div className="text-xs text-yellow-600 mt-1">Pending review</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">Completed</span>
              <Icon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">{mockMetrics?.completedThisMonth}</div>
            <div className="text-xs text-green-600 mt-1">This month</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-600 font-medium">Avg. Resolution</span>
              <Icon name="Clock" size={20} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-900">{mockMetrics?.avgResolutionTime}</div>
            <div className="text-xs text-purple-600 mt-1">Response time</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Team Activity</h4>
            <div className="space-y-3">
              {mockMetrics?.teamActivity?.map((member) => (
                <div key={member?.id} className="bg-muted/30 border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="User" size={20} className="text-primary" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-foreground">{member?.member}</h5>
                        <p className="text-xs text-muted-foreground">{member?.role}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member?.status)}`}>
                      {member?.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Active:</span>
                      <span className="ml-2 font-medium text-foreground">{member?.activeRequests}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Completed Today:</span>
                      <span className="ml-2 font-medium text-green-600">{member?.completedToday}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Pending Tasks</h4>
            <div className="space-y-3">
              {mockMetrics?.pendingTasks?.map((task) => (
                <div key={task?.id} className="bg-muted/30 border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h5 className="text-sm font-semibold text-foreground flex-1">{task?.task}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task?.priority)}`}>
                      {task?.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Assigned to: <span className="font-medium text-foreground">{task?.assignedTo}</span></span>
                    <span>Due: <span className="font-medium text-foreground">{new Date(task?.dueDate)?.toLocaleDateString()}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalTeamDashboardPanel;