import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TicketQueuePanel = ({ tickets, filters, setFilters, onRefresh }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);

  const ticketTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'advertiser_inquiry', label: 'Advertiser Inquiry' },
    { value: 'billing_dispute', label: 'Billing Dispute' },
    { value: 'technical_issue', label: 'Technical Issue' },
    { value: 'account_problem', label: 'Account Problem' },
    { value: 'policy_violation', label: 'Policy Violation' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'escalated', label: 'Escalated' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-blue-500 bg-blue-500/10';
      case 'in_progress': return 'text-yellow-500 bg-yellow-500/10';
      case 'escalated': return 'text-red-500 bg-red-500/10';
      case 'resolved': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getSLAColor = (slaStatus) => {
    switch (slaStatus) {
      case 'met': return 'text-green-500';
      case 'on_track': return 'text-blue-500';
      case 'at_risk': return 'text-yellow-500';
      case 'breached': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Ticket Queue Management
          </h2>
          <Button iconName="Plus" size="sm">
            Create Ticket
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filters?.type}
            onChange={(e) => setFilters({ ...filters, type: e?.target?.value })}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {ticketTypes?.map((type) => (
              <option key={type?.value} value={type?.value}>{type?.label}</option>
            ))}
          </select>
          <select
            value={filters?.status}
            onChange={(e) => setFilters({ ...filters, status: e?.target?.value })}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions?.map((status) => (
              <option key={status?.value} value={status?.value}>{status?.label}</option>
            ))}
          </select>
          <select
            value={filters?.priority}
            onChange={(e) => setFilters({ ...filters, priority: e?.target?.value })}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {priorityOptions?.map((priority) => (
              <option key={priority?.value} value={priority?.value}>{priority?.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {tickets?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tickets found matching your filters</p>
            </div>
          ) : (
            tickets?.map((ticket) => (
              <div
                key={ticket?.id}
                className="bg-background rounded-lg border border-border p-4 hover:shadow-md transition-all duration-250 cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-muted-foreground">{ticket?.ticketNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(ticket?.status)}`}>
                        {ticket?.status?.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${getPriorityColor(ticket?.priority)}`}>
                        {ticket?.priority}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1">{ticket?.subject}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ticket?.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className={`text-xs font-medium ${getSLAColor(ticket?.slaStatus)} mb-1`}>
                      SLA: {ticket?.slaStatus?.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ticket?.createdAt)?.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="User" size={12} />
                      <span>{ticket?.createdBy}</span>
                    </div>
                    {ticket?.assignedTo && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Icon name="UserCheck" size={12} />
                        <span>Assigned to {ticket?.assignedTo}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="Clock" size={12} />
                      <span>{ticket?.responseTime}m response</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ticket?.tags?.map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketQueuePanel;