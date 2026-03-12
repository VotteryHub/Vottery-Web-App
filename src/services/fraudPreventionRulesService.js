import { supabase } from '../lib/supabase';
import { getChatCompletion } from './aiIntegrations/chatCompletion';

const PROVIDER = 'ANTHROPIC';
const MODEL = 'claude-sonnet-4-5-20250929';

export const fraudPreventionRulesService = {
  async gatherAttackPatterns() {
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString();
      const [incidentsResult, mlDetectionsResult] = await Promise.all([
        supabase?.from('fraud_incidents')?.select('incident_type, severity, ip_address, user_id, metadata, created_at')?.gte('created_at', since)?.order('created_at', { ascending: false })?.limit(50),
        supabase?.from('ml_threat_detections')?.select('threat_type, confidence_score, features, created_at')?.gte('created_at', since)?.order('created_at', { ascending: false })?.limit(50),
      ]);
      return { incidents: incidentsResult?.data || [], mlDetections: mlDetectionsResult?.data || [] };
    } catch (e) {
      return { incidents: [], mlDetections: [] };
    }
  },

  async generateRulesWithClaude(attackPatterns) {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a cybersecurity expert specializing in fraud prevention rule generation. Analyze attack patterns and generate specific, actionable prevention rules. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: `Analyze these attack patterns from the last 24 hours and generate fraud prevention rules:\n\nFraud Incidents:\n${JSON.stringify(attackPatterns?.incidents?.slice(0, 20), null, 2)}\n\nML Threat Detections:\n${JSON.stringify(attackPatterns?.mlDetections?.slice(0, 20), null, 2)}\n\nGenerate 3-5 specific prevention rules. Respond with JSON array:\n[{\n  "rule_name": "...",\n  "rule_type": "rate_limiting|ip_blocking|auth_requirement|transaction_blocking",\n  "description": "...",\n  "condition": "...",\n  "action": "...",\n  "threshold_value": 10,\n  "threshold_unit": "requests_per_minute|attempts|transactions",\n  "severity": "critical|high|medium|low",\n  "estimated_effectiveness": 85,\n  "rationale": "..."\n}]`,
        },
      ];
      const response = await getChatCompletion(PROVIDER, MODEL, messages, { max_tokens: 3000, temperature: 0.3 });
      const content = response?.choices?.[0]?.message?.content || response;
      const jsonMatch = String(content)?.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) return { data: JSON.parse(jsonMatch?.[0]), error: null };
      return { data: JSON.parse(String(content)), error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  },

  async storePendingRules(rules) {
    try {
      const toInsert = rules?.map(rule => ({
        rule_name: rule?.rule_name,
        rule_type: rule?.rule_type,
        description: rule?.description,
        condition_expression: rule?.condition,
        action: rule?.action,
        threshold_value: rule?.threshold_value,
        threshold_unit: rule?.threshold_unit,
        severity: rule?.severity,
        estimated_effectiveness: rule?.estimated_effectiveness,
        rationale: rule?.rationale,
        status: 'pending_approval',
        created_at: new Date()?.toISOString(),
      }));
      const { data, error } = await supabase?.from('fraud_prevention_rules')?.insert(toInsert)?.select();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  },

  async getPendingRules() {
    try {
      const { data, error } = await supabase?.from('fraud_prevention_rules')?.select('*')?.eq('status', 'pending_approval')?.order('created_at', { ascending: false });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (e) {
      return { data: [], error: { message: e?.message } };
    }
  },

  async getAllRules() {
    try {
      const { data, error } = await supabase?.from('fraud_prevention_rules')?.select('*')?.order('created_at', { ascending: false })?.limit(100);
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (e) {
      return { data: [], error: { message: e?.message } };
    }
  },

  async approveRule(ruleId) {
    try {
      const { data, error } = await supabase?.from('fraud_prevention_rules')?.update({ status: 'approved', approved_at: new Date()?.toISOString() })?.eq('id', ruleId)?.select()?.single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  },

  async rejectRule(ruleId, reason) {
    try {
      const { data, error } = await supabase?.from('fraud_prevention_rules')?.update({ status: 'rejected', rejection_reason: reason, rejected_at: new Date()?.toISOString() })?.eq('id', ruleId)?.select()?.single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  },

  async generateAndStorePendingRules() {
    const patterns = await this.gatherAttackPatterns();
    const { data: rules, error } = await this.generateRulesWithClaude(patterns);
    if (error || !rules?.length) return { data: null, error: error || { message: 'No rules generated' } };
    return this.storePendingRules(rules);
  },
};

export default fraudPreventionRulesService;
