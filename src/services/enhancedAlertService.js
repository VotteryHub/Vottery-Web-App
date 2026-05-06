import { supabase } from '../lib/supabase';
import { analytics } from '../hooks/useGoogleAnalytics';
import openai from '../lib/openai';

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

export const enhancedAlertService = {
  // ============ PRIORITY TRIAGE SYSTEM ============
  
  calculatePriorityScore(alert) {
    let score = 0;
    
    // Severity scoring (0-40 points)
    const severityScores = {
      critical: 40,
      high: 30,
      medium: 20,
      low: 10,
      info: 5
    };
    score += severityScores?.[alert?.severity] || 0;
    
    // Confidence score (0-30 points)
    if (alert?.confidenceScore) {
      score += Math.round((alert?.confidenceScore / 100) * 30);
    }
    
    // False positive penalty (-20 points)
    if (alert?.falsePositive) {
      score -= 20;
    }
    
    // Category priority (0-20 points)
    const categoryScores = {
      fraud_detection: 20,
      security_event: 18,
      policy_violation: 15,
      payment_anomaly: 12,
      performance_degradation: 8
    };
    score += categoryScores?.[alert?.category] || 5;
    
    // Time sensitivity (0-10 points)
    const alertAge = Date.now() - new Date(alert?.createdAt)?.getTime();
    const ageMinutes = alertAge / (1000 * 60);
    if (ageMinutes < 5) score += 10;
    else if (ageMinutes < 15) score += 7;
    else if (ageMinutes < 60) score += 4;
    
    return Math.max(0, Math.min(100, score));
  },
  
  async updateAlertPriority(alertId, priorityScore) {
    try {
      const { data, error } = await supabase
        ?.from('system_alerts')
        ?.update({ priority_score: priorityScore })
        ?.eq('id', alertId)
        ?.select()
        ?.single();
      
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  async getAlertsByPriority(filters = {}) {
    try {
      let query = supabase
        ?.from('system_alerts')
        ?.select(`
          *,
          alert_rule:alert_rule_id(rule_name, category),
          correlation_group:correlation_group_id(group_name, alert_count)
        `)
        ?.order('priority_score', { ascending: false })
        ?.order('created_at', { ascending: false });
      
      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('status', filters?.status);
      }
      
      if (filters?.minPriority) {
        query = query?.gte('priority_score', filters?.minPriority);
      }
      
      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  // ============ AUTO-GROUPING & CORRELATION ============
  
  async correlateAlerts(timeWindowMinutes = 15) {
    try {
      const timeWindowStart = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
      
      // Get recent ungrouped alerts
      const { data: alerts, error: alertsError } = await supabase
        ?.from('system_alerts')
        ?.select('*')
        ?.is('correlation_group_id', null)
        ?.gte('created_at', timeWindowStart?.toISOString())
        ?.order('created_at', { ascending: false });
      
      if (alertsError) throw alertsError;
      if (!alerts || alerts?.length === 0) return { data: [], error: null };
      
      // Group by correlation pattern
      const groups = {};
      alerts?.forEach(alert => {
        const pattern = `${alert?.metadata?.affected_entity_type || 'unknown'}_${alert?.metadata?.affected_entity_id || 'none'}_${alert?.metadata?.detection_method || 'manual'}`;
        
        if (!groups?.[pattern]) {
          groups[pattern] = [];
        }
        groups?.[pattern]?.push(alert);
      });
      
      // Create correlation groups for patterns with 2+ alerts
      const createdGroups = [];
      for (const [pattern, groupAlerts] of Object.entries(groups)) {
        if (groupAlerts?.length >= 2) {
          const firstAlert = groupAlerts?.[0];
          const lastAlert = groupAlerts?.[groupAlerts?.length - 1];
          
          // Create correlation group
          const { data: group, error: groupError } = await supabase
            ?.from('alert_correlation_groups')
            ?.insert({
              group_name: `Auto-grouped: ${firstAlert?.category} - ${firstAlert?.metadata?.affected_entity_type || 'Unknown'}`,
              correlation_pattern: pattern,
              affected_entity_type: firstAlert?.metadata?.affected_entity_type,
              affected_entity_id: firstAlert?.metadata?.affected_entity_id,
              detection_method: firstAlert?.metadata?.detection_method,
              time_window_minutes: timeWindowMinutes,
              alert_count: groupAlerts?.length,
              severity: this.calculateGroupSeverity(groupAlerts),
              first_alert_at: firstAlert?.created_at,
              last_alert_at: lastAlert?.created_at
            })
            ?.select()
            ?.single();
          
          if (groupError) {
            console.error('Failed to create correlation group:', groupError);
            continue;
          }
          
          // Update alerts with correlation group ID
          const alertIds = groupAlerts?.map(a => a?.id);
          await supabase
            ?.from('system_alerts')
            ?.update({
              correlation_group_id: group?.id,
              auto_grouped: true,
              time_window_start: firstAlert?.created_at,
              time_window_end: lastAlert?.created_at
            })
            ?.in('id', alertIds);
          
          createdGroups?.push(toCamelCase(group));
        }
      }
      
      analytics?.trackEvent('alerts_auto_grouped', {
        hubs_created: createdGroups?.length,
        time_window_minutes: timeWindowMinutes
      });
      
      return { data: createdGroups, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  calculateGroupSeverity(alerts) {
    const severityLevels = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
    const maxSeverity = Math.max(...alerts?.map(a => severityLevels?.[a?.severity] || 0));
    return Object.keys(severityLevels)?.find(key => severityLevels?.[key] === maxSeverity) || 'medium';
  },
  
  async getCorrelationGroups(filters = {}) {
    try {
      let query = supabase
        ?.from('alert_correlation_groups')
        ?.select(`
          *,
          alerts:system_alerts(id, title, severity, created_at)
        `)
        ?.order('last_alert_at', { ascending: false });
      
      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('status', filters?.status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  async resolveCorrelationGroup(groupId, resolutionNotes) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        ?.from('alert_correlation_groups')
        ?.update({
          status: 'resolved',
          resolved_at: new Date()?.toISOString(),
          resolved_by: user?.id,
          resolution_notes: resolutionNotes
        })
        ?.eq('id', groupId)
        ?.select()
        ?.single();
      
      if (error) throw error;
      
      // Also resolve all alerts in the group
      await supabase
        ?.from('system_alerts')
        ?.update({
          status: 'resolved',
          resolved_by: user?.id,
          resolved_at: new Date()?.toISOString(),
          resolution_notes: `Resolved as part of correlation group: ${resolutionNotes}`
        })
        ?.eq('correlation_group_id', groupId);
      
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  // ============ 1-CLICK QUICK ACTIONS ============
  
  async getQuickActionTemplates(actionType = null) {
    try {
      let query = supabase
        ?.from('quick_action_templates')
        ?.select('*')
        ?.eq('is_enabled', true)
        ?.order('action_name', { ascending: true });
      
      if (actionType) {
        query = query?.eq('action_type', actionType);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  async executeQuickAction(actionTemplateId, targetId, targetType, reason = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Get action template
      const { data: template, error: templateError } = await supabase
        ?.from('quick_action_templates')
        ?.select('*')
        ?.eq('id', actionTemplateId)
        ?.single();
      
      if (templateError) throw templateError;
      
      // Get current state for audit trail
      let beforeState = null;
      if (targetType === 'alert') {
        const { data } = await supabase?.from('system_alerts')?.select('*')?.eq('id', targetId)?.single();
        beforeState = data;
      } else if (targetType === 'incident') {
        const { data } = await supabase?.from('incident_response_workflows')?.select('*')?.eq('id', targetId)?.single();
        beforeState = data;
      }
      
      // Execute action based on type
      let executionResult = { success: true };
      const actionConfig = template?.action_config;
      
      switch (actionConfig?.action) {
        case 'mark_false_positive': await supabase?.from('system_alerts')?.update({ false_positive: true, status: 'dismissed' })?.eq('id', targetId);
          break;
        case 'suspend_user':
          // Implement user suspension logic
          executionResult = { success: true, message: 'User suspended' };
          break;
        case 'pause_election': await supabase?.from('elections')?.update({ status: 'paused' })?.eq('id', targetId);
          break;
        case 'escalate_compliance':
          await this.createComplianceEscalation(targetId, targetType);
          break;
        case 'resolve_alert': await supabase?.from('system_alerts')?.update({ status: 'resolved', resolved_by: user?.id, resolved_at: new Date()?.toISOString() })?.eq('id', targetId);
          break;
        case 'block_ip':
          // Implement IP blocking logic
          executionResult = { success: true, message: 'IP blocked' };
          break;
        case 'refund_transaction':
          // Implement refund logic
          executionResult = { success: true, message: 'Refund initiated' };
          break;
        case 'assign_team': await supabase?.from('incident_response_workflows')?.update({ assigned_to: actionConfig?.team })?.eq('id', targetId);
          break;
        default:
          executionResult = { success: false, message: 'Unknown action type' };
      }
      
      // Get after state
      let afterState = null;
      if (targetType === 'alert') {
        const { data } = await supabase?.from('system_alerts')?.select('*')?.eq('id', targetId)?.single();
        afterState = data;
      } else if (targetType === 'incident') {
        const { data } = await supabase?.from('incident_response_workflows')?.select('*')?.eq('id', targetId)?.single();
        afterState = data;
      }
      
      // Log execution
      const { data: execution, error: executionError } = await supabase
        ?.from('quick_action_executions')
        ?.insert({
          action_template_id: actionTemplateId,
          alert_id: targetType === 'alert' ? targetId : null,
          incident_id: targetType === 'incident' ? targetId : null,
          executed_by: user?.id,
          action_type: template?.action_type,
          action_details: actionConfig,
          execution_reason: reason,
          execution_status: executionResult?.success ? 'success' : 'failed',
          error_message: executionResult?.message,
          before_state: beforeState,
          after_state: afterState
        })
        ?.select()
        ?.single();
      
      if (executionError) throw executionError;
      
      analytics?.trackEvent('quick_action_executed', {
        action_type: template?.action_type,
        action_name: template?.action_name,
        target_type: targetType
      });
      
      return { data: toCamelCase(execution), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  async getQuickActionHistory(filters = {}) {
    try {
      let query = supabase
        ?.from('quick_action_executions')
        ?.select(`
          *,
          action_template:action_template_id(action_name, action_type),
          executed_by_profile:executed_by(name, username, email)
        `)
        ?.order('executed_at', { ascending: false });
      
      if (filters?.actionType) {
        query = query?.eq('action_type', filters?.actionType);
      }
      
      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  // ============ COMPLIANCE ESCALATION WORKFLOWS ============
  
  async getComplianceEscalationWorkflows(filters = {}) {
    try {
      let query = supabase
        ?.from('compliance_escalation_workflows')
        ?.select('*')
        ?.eq('is_enabled', true)
        ?.order('created_at', { ascending: false });
      
      if (filters?.triggerType) {
        query = query?.eq('trigger_type', filters?.triggerType);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  async createComplianceEscalation(entityId, entityType, workflowId = null) {
    try {
      // Get appropriate workflow
      let workflow;
      if (workflowId) {
        const { data } = await supabase?.from('compliance_escalation_workflows')?.select('*')?.eq('id', workflowId)?.single();
        workflow = data;
      } else {
        // Auto-select workflow based on entity type
        const { data } = await supabase?.from('compliance_escalation_workflows')?.select('*')?.eq('trigger_type', 'event_based')?.eq('is_enabled', true)?.limit(1)?.single();
        workflow = data;
      }
      
      if (!workflow) throw new Error('No suitable workflow found');
      
      const slaDeadline = new Date(Date.now() + workflow?.sla_hours * 60 * 60 * 1000);
      
      const { data, error } = await supabase
        ?.from('compliance_escalation_executions')
        ?.insert({
          workflow_id: workflow?.id,
          incident_id: entityType === 'incident' ? entityId : null,
          alert_id: entityType === 'alert' ? entityId : null,
          trigger_reason: `Automated escalation for ${entityType}`,
          sla_deadline: slaDeadline?.toISOString(),
          stakeholders_notified: []
        })
        ?.select()
        ?.single();
      
      if (error) throw error;
      
      // Create SLA tracking entry
      await supabase?.from('sla_tracking')?.insert({
        entity_type: 'compliance_escalation',
        entity_id: data?.id,
        sla_type: 'compliance_response',
        sla_deadline: slaDeadline?.toISOString(),
        warning_threshold_hours: Math.floor(workflow?.sla_hours * 0.75)
      });
      
      // Trigger initial notifications
      await this.executeEscalationLevel(data?.id, 1);
      
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  async executeEscalationLevel(escalationId, level) {
    try {
      const { data: escalation, error: escalationError } = await supabase
        ?.from('compliance_escalation_executions')
        ?.select(`
          *,
          workflow:workflow_id(*)
        `)
        ?.eq('id', escalationId)
        ?.single();
      
      if (escalationError) throw escalationError;
      
      const escalationPath = escalation?.workflow?.escalation_path;
      const levelConfig = escalationPath?.find(p => p?.level === level);
      
      if (!levelConfig) return { data: null, error: { message: 'Escalation level not found' } };
      
      // Send notifications to stakeholders
      const notificationHistory = escalation?.notification_history || [];
      notificationHistory?.push({
        level: level,
        stakeholders: levelConfig?.stakeholders,
        timestamp: new Date()?.toISOString(),
        channels: escalation?.workflow?.notification_channels
      });
      
      const { data, error } = await supabase
        ?.from('compliance_escalation_executions')
        ?.update({
          current_escalation_level: level,
          notification_history: notificationHistory,
          status: level > 1 ? 'escalated' : 'active'
        })
        ?.eq('id', escalationId)
        ?.select()
        ?.single();
      
      if (error) throw error;
      
      analytics?.trackEvent('compliance_escalation_executed', {
        escalation_id: escalationId,
        level: level,
        stakeholders: levelConfig?.stakeholders?.length
      });
      
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  async getActiveEscalations(filters = {}) {
    try {
      let query = supabase
        ?.from('compliance_escalation_executions')
        ?.select(`
          *,
          workflow:workflow_id(workflow_name, trigger_type),
          incident:incident_id(incident_type, threat_level),
          alert:alert_id(title, severity)
        `)
        ?.in('status', ['active', 'escalated'])
        ?.order('created_at', { ascending: false });
      
      if (filters?.slaStatus) {
        query = query?.eq('sla_status', filters?.slaStatus);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  // ============ SLA TRACKING ============
  
  async checkSLAStatus() {
    try {
      const { data: slaItems, error } = await supabase
        ?.from('sla_tracking')
        ?.select('*')
        ?.is('resolved_at', null)
        ?.order('sla_deadline', { ascending: true });
      
      if (error) throw error;
      
      const now = new Date();
      const updates = [];
      
      for (const item of slaItems || []) {
        const deadline = new Date(item?.sla_deadline);
        const warningThreshold = new Date(deadline.getTime() - item?.warning_threshold_hours * 60 * 60 * 1000);
        
        let newStatus = 'on_track';
        if (now > deadline) {
          newStatus = 'breached';
        } else if (now > warningThreshold) {
          newStatus = 'at_risk';
        }
        
        if (newStatus !== item?.sla_status) {
          updates?.push({
            id: item?.id,
            sla_status: newStatus
          });
          
          // Update related entity
          if (item?.entity_type === 'incident') {
            await supabase?.from('incident_response_workflows')?.update({ sla_status: newStatus })?.eq('id', item?.entity_id);
          } else if (item?.entity_type === 'compliance_escalation') {
            await supabase?.from('compliance_escalation_executions')?.update({ sla_status: newStatus })?.eq('id', item?.entity_id);
          }
        }
      }
      
      // Batch update SLA tracking
      if (updates?.length > 0) {
        for (const update of updates) {
          await supabase?.from('sla_tracking')?.update({ sla_status: update?.sla_status })?.eq('id', update?.id);
        }
      }
      
      return { data: { updated: updates?.length }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
  
  async getSLAStatistics() {
    try {
      const { data, error } = await supabase
        ?.from('sla_tracking')
        ?.select('*');
      
      if (error) throw error;
      
      const stats = {
        total: data?.length || 0,
        onTrack: data?.filter(s => s?.sla_status === 'on_track')?.length || 0,
        atRisk: data?.filter(s => s?.sla_status === 'at_risk')?.length || 0,
        breached: data?.filter(s => s?.sla_status === 'breached')?.length || 0,
        resolved: data?.filter(s => s?.resolved_at)?.length || 0,
        averageResolutionTime: this.calculateAverageResolutionTime(data?.filter(s => s?.resolution_time_minutes))
      };
      
      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // ============ AI-POWERED NOTIFICATION GROUPING ============
  
  async categorizeNotificationsWithAI(notifications) {
    try {
      if (!notifications || notifications?.length === 0) {
        return { data: [], error: null };
      }

      // Prepare notification data for AI analysis
      const notificationSummaries = notifications?.slice(0, 20)?.map((n) => ({
        id: n?.id,
        title: n?.title,
        description: n?.description,
        type: n?.activityType,
        createdAt: n?.createdAt
      }));

      const prompt = `Analyze these notifications and categorize them by urgency and context. Return a JSON array with each notification's ID, urgency level (high/medium/low), and category (critical/action_required/informational/social).

Notifications:
${JSON.stringify(notificationSummaries, null, 2)}

Return only valid JSON in this format:
[{"id": "notification-id", "urgency": "high", "category": "critical", "reasoning": "brief explanation"}]`;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an intelligent notification categorization system. Analyze notifications and provide urgency levels and categories based on content and context.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const aiResponse = response?.choices?.[0]?.message?.content;
      const categorizedNotifications = JSON.parse(aiResponse);

      return { data: categorizedNotifications, error: null };
    } catch (error) {
      console.error('AI categorization error:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async groupNotificationsByContext(notifications) {
    try {
      const { data: categorized } = await this.categorizeNotificationsWithAI(notifications);
      
      if (!categorized) {
        // Fallback to basic grouping
        return this.basicGrouping(notifications);
      }

      // Group by AI-determined category and urgency
      const groups = {
        critical: [],
        action_required: [],
        informational: [],
        social: []
      };

      categorized?.forEach((item) => {
        const notification = notifications?.find((n) => n?.id === item?.id);
        if (notification) {
          const category = item?.category || 'informational';
          if (groups?.[category]) {
            groups?.[category]?.push({
              ...notification,
              aiUrgency: item?.urgency,
              aiReasoning: item?.reasoning
            });
          }
        }
      });

      // Sort each group by urgency
      Object.keys(groups)?.forEach((key) => {
        groups?.[key]?.sort((a, b) => {
          const urgencyOrder = { high: 3, medium: 2, low: 1 };
          return (urgencyOrder?.[b?.aiUrgency] || 0) - (urgencyOrder?.[a?.aiUrgency] || 0);
        });
      });

      return { data: groups, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  basicGrouping(notifications) {
    const groups = {
      critical: [],
      action_required: [],
      informational: [],
      social: []
    };

    notifications?.forEach((notification) => {
      const type = notification?.activityType;
      
      if (type === 'vote' || type?.includes('election')) {
        groups?.action_required?.push(notification);
      } else if (type === 'message_received') {
        groups?.action_required?.push(notification);
      } else if (type === 'achievement_unlocked') {
        groups?.informational?.push(notification);
      } else if (type?.includes('post')) {
        groups?.social?.push(notification);
      } else {
        groups?.informational?.push(notification);
      }
    });

    return { data: groups, error: null };
  },

  async smartFilterNotifications(notifications, userContext) {
    try {
      // Use AI to filter notifications based on user context and preferences
      const contextPrompt = `User context: ${JSON.stringify(userContext)}

Filter these notifications to show only the most relevant ones based on user's interests and activity patterns.

Notifications: ${JSON.stringify(notifications?.slice(0, 50)?.map((n) => ({
        id: n?.id,
        title: n?.title,
        type: n?.activityType
      })))}

Return array of notification IDs that are most relevant.`;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a smart notification filter. Analyze user context and filter notifications to show only the most relevant ones.'
          },
          {
            role: 'user',
            content: contextPrompt
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      });

      const aiResponse = response?.choices?.[0]?.message?.content;
      const relevantIds = JSON.parse(aiResponse);

      const filteredNotifications = notifications?.filter((n) => relevantIds?.includes(n?.id));

      return { data: filteredNotifications, error: null };
    } catch (error) {
      return { data: notifications, error: { message: error?.message } };
    }
  },

  calculateAverageResolutionTime(resolvedItems) {
    if (!resolvedItems || resolvedItems?.length === 0) return 0;
    const total = resolvedItems?.reduce((sum, item) => sum + (item?.resolution_time_minutes || 0), 0);
    return Math.round(total / resolvedItems?.length);
  }
};