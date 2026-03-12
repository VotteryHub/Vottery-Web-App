import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AgentWorkspacePanel = ({ agents, tickets, onRefresh }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'online': return 'Available';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">
              Agent Workspace
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time agent performance and ticket assignment management
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-500">
                {agents?.filter(a => a?.status === 'online')?.length || 0} Online
              </span>
            </div>
            <Button variant="outline" size="sm" iconName="UserPlus">
              Add Agent
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents?.map((agent) => (
            <div key={agent?.id} className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="User" size={24} className="text-primary" />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(agent?.status)} border-2 border-background`} />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">{agent?.name}</p>
                    <p className="text-xs text-muted-foreground">{getStatusLabel(agent?.status)}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" iconName="MessageSquare">
                  Chat
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{agent?.activeTickets}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">{agent?.resolvedToday}</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-500">{agent?.satisfactionRating?.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg Response Time</span>
                  <span className="font-medium text-foreground">{agent?.avgResponseTime}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg Resolution Time</span>
                  <span className="font-medium text-foreground">{agent?.avgResolutionTime}m</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="w-full" iconName="UserCheck">
                  Assign Ticket
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Team Performance Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Icon name="Users" size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Agents</p>
                <p className="text-2xl font-bold text-foreground">{agents?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Icon name="CheckCircle" size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Resolved Today</p>
                <p className="text-2xl font-bold text-foreground">
                  {agents?.reduce((sum, a) => sum + (a?.resolvedToday || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Icon name="Clock" size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Avg Response</p>
                <p className="text-2xl font-bold text-foreground">
                  {(agents?.reduce((sum, a) => sum + (a?.avgResponseTime || 0), 0) / (agents?.length || 1))?.toFixed(0)}m
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Icon name="Star" size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Team Rating</p>
                <p className="text-2xl font-bold text-foreground">
                  {(agents?.reduce((sum, a) => sum + (a?.satisfactionRating || 0), 0) / (agents?.length || 1))?.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Knowledge Base Quick Access
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="p-4 rounded-lg border border-border bg-background hover:bg-muted transition-all duration-250 text-left">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Book" size={20} className="text-blue-500" />
              <span className="text-sm font-medium text-foreground">Common Issues</span>
            </div>
            <p className="text-xs text-muted-foreground">Quick solutions for frequent problems</p>
          </button>
          <button className="p-4 rounded-lg border border-border bg-background hover:bg-muted transition-all duration-250 text-left">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="FileText" size={20} className="text-purple-500" />
              <span className="text-sm font-medium text-foreground">Templates</span>
            </div>
            <p className="text-xs text-muted-foreground">Pre-written response templates</p>
          </button>
          <button className="p-4 rounded-lg border border-border bg-background hover:bg-muted transition-all duration-250 text-left">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="HelpCircle" size={20} className="text-green-500" />
              <span className="text-sm font-medium text-foreground">Escalation Guide</span>
            </div>
            <p className="text-xs text-muted-foreground">When and how to escalate tickets</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentWorkspacePanel;