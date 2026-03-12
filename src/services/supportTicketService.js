

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toSnakeCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const snakeKey = key?.replace(/[A-Z]/g, letter => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

export const supportTicketService = {
  // Ticket Management
  async getTickets(filters = {}) {
    try {
      // Mock data for support tickets
      const mockTickets = [
        {
          id: 1,
          ticketNumber: 'TKT-2024-001',
          type: 'advertiser_inquiry',
          subject: 'Campaign Performance Question',
          description: 'Need clarification on ROI calculation methodology',
          priority: 'medium',
          status: 'open',
          assignedTo: 'Sarah Johnson',
          assignedToId: 'agent-001',
          createdBy: 'John Advertiser',
          createdById: 'user-123',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)?.toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)?.toISOString(),
          responseTime: 45,
          slaStatus: 'on_track',
          tags: ['campaign', 'analytics', 'roi']
        },
        {
          id: 2,
          ticketNumber: 'TKT-2024-002',
          type: 'billing_dispute',
          subject: 'Incorrect Charge on Invoice #4521',
          description: 'Charged for 10,000 impressions but campaign only delivered 8,500',
          priority: 'high',
          status: 'in_progress',
          assignedTo: 'Michael Chen',
          assignedToId: 'agent-002',
          createdBy: 'Tech Corp Ltd',
          createdById: 'user-456',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)?.toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60 * 1000)?.toISOString(),
          responseTime: 120,
          slaStatus: 'at_risk',
          tags: ['billing', 'dispute', 'refund'],
          disputeAmount: 1500,
          evidenceAttached: true
        },
        {
          id: 3,
          ticketNumber: 'TKT-2024-003',
          type: 'technical_issue',
          subject: 'Unable to Upload Campaign Creative',
          description: 'Getting error "File format not supported" when uploading PNG files',
          priority: 'high',
          status: 'open',
          assignedTo: null,
          assignedToId: null,
          createdBy: 'Marketing Agency Pro',
          createdById: 'user-789',
          createdAt: new Date(Date.now() - 15 * 60 * 1000)?.toISOString(),
          updatedAt: new Date(Date.now() - 15 * 60 * 1000)?.toISOString(),
          responseTime: 0,
          slaStatus: 'breached',
          tags: ['technical', 'upload', 'urgent']
        },
        {
          id: 4,
          ticketNumber: 'TKT-2024-004',
          type: 'account_problem',
          subject: 'Cannot Access Payment Settings',
          description: 'Payment settings page shows 403 Forbidden error',
          priority: 'medium',
          status: 'resolved',
          assignedTo: 'Sarah Johnson',
          assignedToId: 'agent-001',
          createdBy: 'Retail Brand Inc',
          createdById: 'user-321',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString(),
          updatedAt: new Date(Date.now() - 22 * 60 * 60 * 1000)?.toISOString(),
          resolvedAt: new Date(Date.now() - 22 * 60 * 60 * 1000)?.toISOString(),
          responseTime: 30,
          resolutionTime: 120,
          slaStatus: 'met',
          tags: ['account', 'permissions', 'resolved'],
          satisfactionRating: 5
        },
        {
          id: 5,
          ticketNumber: 'TKT-2024-005',
          type: 'policy_violation',
          subject: 'Campaign Rejected - Policy Review Request',
          description: 'Campaign flagged for policy violation. Requesting manual review.',
          priority: 'high',
          status: 'escalated',
          assignedTo: 'Emily Rodriguez',
          assignedToId: 'agent-003',
          createdBy: 'Fashion Outlet',
          createdById: 'user-654',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)?.toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)?.toISOString(),
          responseTime: 60,
          slaStatus: 'on_track',
          tags: ['policy', 'compliance', 'escalated'],
          escalatedTo: 'Senior Compliance Team'
        }
      ];

      // Apply filters
      let filteredTickets = [...mockTickets];

      if (filters?.type && filters?.type !== 'all') {
        filteredTickets = filteredTickets?.filter(t => t?.type === filters?.type);
      }

      if (filters?.status && filters?.status !== 'all') {
        filteredTickets = filteredTickets?.filter(t => t?.status === filters?.status);
      }

      if (filters?.priority && filters?.priority !== 'all') {
        filteredTickets = filteredTickets?.filter(t => t?.priority === filters?.priority);
      }

      if (filters?.assignedTo) {
        filteredTickets = filteredTickets?.filter(t => t?.assignedToId === filters?.assignedTo);
      }

      return { data: filteredTickets, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getTicketById(ticketId) {
    try {
      const { data: tickets } = await this.getTickets();
      const ticket = tickets?.find(t => t?.id === ticketId);
      
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      return { data: ticket, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createTicket(ticketData) {
    try {
      const newTicket = {
        id: Date.now(),
        ticketNumber: `TKT-2024-${String(Date.now())?.slice(-3)}`,
        ...ticketData,
        status: 'open',
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString(),
        responseTime: 0,
        slaStatus: 'on_track'
      };

      return { data: newTicket, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateTicket(ticketId, updates) {
    try {
      const updatedTicket = {
        id: ticketId,
        ...updates,
        updatedAt: new Date()?.toISOString()
      };

      return { data: updatedTicket, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async assignTicket(ticketId, agentId, agentName) {
    try {
      const assignment = {
        ticketId,
        assignedTo: agentName,
        assignedToId: agentId,
        assignedAt: new Date()?.toISOString()
      };

      return { data: assignment, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async resolveTicket(ticketId, resolution) {
    try {
      const resolvedTicket = {
        id: ticketId,
        status: 'resolved',
        resolution: resolution,
        resolvedAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };

      return { data: resolvedTicket, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Ticket Statistics
  async getTicketStatistics() {
    try {
      const { data: tickets } = await this.getTickets();

      const stats = {
        total: tickets?.length || 0,
        open: tickets?.filter(t => t?.status === 'open')?.length || 0,
        inProgress: tickets?.filter(t => t?.status === 'in_progress')?.length || 0,
        resolved: tickets?.filter(t => t?.status === 'resolved')?.length || 0,
        escalated: tickets?.filter(t => t?.status === 'escalated')?.length || 0,
        avgResponseTime: tickets?.reduce((sum, t) => sum + (t?.responseTime || 0), 0) / (tickets?.length || 1),
        avgResolutionTime: tickets?.filter(t => t?.resolutionTime)
          ?.reduce((sum, t) => sum + t?.resolutionTime, 0) / (tickets?.filter(t => t?.resolutionTime)?.length || 1),
        slaCompliance: (tickets?.filter(t => t?.slaStatus === 'met')?.length / (tickets?.length || 1)) * 100,
        satisfactionScore: tickets?.filter(t => t?.satisfactionRating)
          ?.reduce((sum, t) => sum + t?.satisfactionRating, 0) / (tickets?.filter(t => t?.satisfactionRating)?.length || 1)
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Agent Performance
  async getAgentPerformance() {
    try {
      const agents = [
        {
          id: 'agent-001',
          name: 'Sarah Johnson',
          activeTickets: 8,
          resolvedToday: 12,
          avgResponseTime: 35,
          avgResolutionTime: 180,
          satisfactionRating: 4.8,
          status: 'online'
        },
        {
          id: 'agent-002',
          name: 'Michael Chen',
          activeTickets: 6,
          resolvedToday: 15,
          avgResponseTime: 28,
          avgResolutionTime: 150,
          satisfactionRating: 4.9,
          status: 'online'
        },
        {
          id: 'agent-003',
          name: 'Emily Rodriguez',
          activeTickets: 10,
          resolvedToday: 9,
          avgResponseTime: 42,
          avgResolutionTime: 210,
          satisfactionRating: 4.6,
          status: 'busy'
        },
        {
          id: 'agent-004',
          name: 'David Kim',
          activeTickets: 5,
          resolvedToday: 11,
          avgResponseTime: 30,
          avgResolutionTime: 165,
          satisfactionRating: 4.7,
          status: 'online'
        }
      ];

      return { data: agents, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Ticket Messages/Conversation
  async getTicketMessages(ticketId) {
    try {
      const mockMessages = [
        {
          id: 1,
          ticketId,
          sender: 'John Advertiser',
          senderType: 'customer',
          message: 'I need help understanding the ROI calculation for my recent campaign.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)?.toISOString(),
          attachments: []
        },
        {
          id: 2,
          ticketId,
          sender: 'Sarah Johnson',
          senderType: 'agent',
          message: 'Hello! I\'d be happy to help explain our ROI calculation. Can you provide your campaign ID?',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000)?.toISOString(),
          attachments: []
        },
        {
          id: 3,
          ticketId,
          sender: 'John Advertiser',
          senderType: 'customer',
          message: 'Sure, it\'s campaign #12345. The dashboard shows 15% ROI but I calculated 18%.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)?.toISOString(),
          attachments: ['calculation_spreadsheet.xlsx']
        }
      ];

      return { data: mockMessages, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async addTicketMessage(ticketId, messageData) {
    try {
      const newMessage = {
        id: Date.now(),
        ticketId,
        ...messageData,
        timestamp: new Date()?.toISOString()
      };

      return { data: newMessage, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Automated Routing
  async autoRouteTicket(ticketData) {
    try {
      // Simple routing logic based on ticket type and priority
      const routingRules = {
        billing_dispute: { team: 'Billing Team', priority: 'high' },
        technical_issue: { team: 'Technical Support', priority: 'high' },
        advertiser_inquiry: { team: 'Customer Success', priority: 'medium' },
        account_problem: { team: 'Account Management', priority: 'medium' },
        policy_violation: { team: 'Compliance Team', priority: 'high' }
      };

      const routing = routingRules?.[ticketData?.type] || { team: 'General Support', priority: 'low' };

      return {
        data: {
          ticketId: ticketData?.id,
          routedTo: routing?.team,
          suggestedPriority: routing?.priority,
          routedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Knowledge Base Integration
  async searchKnowledgeBase(query) {
    try {
      const mockArticles = [
        {
          id: 1,
          title: 'Understanding ROI Calculations',
          summary: 'Learn how we calculate return on investment for your campaigns',
          category: 'Analytics',
          relevanceScore: 95
        },
        {
          id: 2,
          title: 'Billing Dispute Resolution Process',
          summary: 'Step-by-step guide to resolving billing discrepancies',
          category: 'Billing',
          relevanceScore: 88
        },
        {
          id: 3,
          title: 'Supported File Formats for Campaign Creatives',
          summary: 'Complete list of accepted image and video formats',
          category: 'Technical',
          relevanceScore: 82
        }
      ];

      return { data: mockArticles, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};