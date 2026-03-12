import claude from '../lib/claude';
import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

const PURCHASING_POWER_ZONES = [
  { id: 'zone_1', name: 'Ultra High ($100k+)', range: '100000+' },
  { id: 'zone_2', name: 'High ($75k-$100k)', range: '75000-100000' },
  { id: 'zone_3', name: 'Upper Middle ($60k-$75k)', range: '60000-75000' },
  { id: 'zone_4', name: 'Middle ($45k-$60k)', range: '45000-60000' },
  { id: 'zone_5', name: 'Lower Middle ($35k-$45k)', range: '35000-45000' },
  { id: 'zone_6', name: 'Working Class ($25k-$35k)', range: '25000-35000' },
  { id: 'zone_7', name: 'Low Income ($15k-$25k)', range: '15000-25000' },
  { id: 'zone_8', name: 'Very Low Income (<$15k)', range: '0-15000' }
];

export const crossDomainThreatService = {
  async analyzeThreatsAcrossZones(domains = ['financial', 'voting', 'user_behavior', 'compliance']) {
    try {
      // Gather data from all 8 zones
      const zoneData = await this.gatherZoneData();

      // Analyze with Claude AI
      let analysis = await this.performClaudeAnalysis(zoneData, domains);

      // Store analysis results
      await this.storeAnalysisResults(analysis);

      return { data: analysis, error: null };
    } catch (error) {
      console.error('Error analyzing cross-domain threats:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async gatherZoneData() {
    try {
      const zoneData = {};

      for (const zone of PURCHASING_POWER_ZONES) {
        // Financial fraud data
        const { data: financialIncidents } = await supabase
          ?.from('incident_response_workflows')
          ?.select('*')
          ?.eq('zone_identifier', zone?.id)
          ?.eq('incident_category', 'financial_fraud')
          ?.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)?.toISOString());

        // Voting anomalies
        const { data: votingAnomalies } = await supabase
          ?.from('votes')
          ?.select('*, user_profiles!inner(zone_identifier)')
          ?.eq('user_profiles.zone_identifier', zone?.id)
          ?.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)?.toISOString());

        // Policy violations
        const { data: policyViolations } = await supabase
          ?.from('policy_violations')
          ?.select('*')
          ?.eq('zone_identifier', zone?.id)
          ?.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)?.toISOString());

        // Financial tracking
        const { data: financialMetrics } = await supabase
          ?.from('financial_tracking')
          ?.select('*')
          ?.eq('zone_identifier', zone?.id)
          ?.order('created_at', { ascending: false })
          ?.limit(1);

        zoneData[zone?.id] = {
          zone: zone,
          financialIncidents: financialIncidents?.length || 0,
          votingAnomalies: votingAnomalies?.length || 0,
          policyViolations: policyViolations?.length || 0,
          financialMetrics: financialMetrics?.[0] || null,
          riskScore: this.calculateZoneRiskScore({
            financialIncidents: financialIncidents?.length || 0,
            votingAnomalies: votingAnomalies?.length || 0,
            policyViolations: policyViolations?.length || 0
          })
        };
      }

      return zoneData;
    } catch (error) {
      console.error('Error gathering zone data:', error);
      throw error;
    }
  },

  calculateZoneRiskScore(metrics) {
    const weights = {
      financialIncidents: 0.4,
      votingAnomalies: 0.35,
      policyViolations: 0.25
    };

    const normalizedScore = (
      (metrics?.financialIncidents * weights?.financialIncidents) +
      (metrics?.votingAnomalies * weights?.votingAnomalies) +
      (metrics?.policyViolations * weights?.policyViolations)
    );

    return Math.min(100, normalizedScore * 5);
  },

  async performClaudeAnalysis(zoneData, domains) {
    try {
      const systemPrompt = `You are an advanced threat intelligence analyst specializing in cross-domain threat correlation across 8 purchasing power zones. Analyze patterns across:
- Financial fraud and payment anomalies
- Voting manipulation and election integrity threats
- User behavior anomalies and account security
- Compliance violations and regulatory risks

Provide comprehensive threat correlation analysis with predictive insights, emerging threat patterns, and zone-specific recommendations.`;

      const userPrompt = `Analyze cross-domain threats across 8 purchasing power zones:

${JSON.stringify(zoneData, null, 2)}

Domains to analyze: ${domains?.join(', ')}

Provide:
1. Cross-zone threat correlations (identify patterns affecting multiple zones)
2. Emerging threat patterns (predict future threats based on current data)
3. Zone-specific vulnerabilities (identify which zones are most at risk)
4. Compliance alert recommendations (suggest automated compliance actions)
5. Predictive threat forecasting (30-day, 60-day, 90-day predictions)
6. Mitigation strategies (actionable recommendations for each zone)

Return analysis in JSON format with:
{
  "overallThreatLevel": "critical|high|medium|low",
  "crossZoneCorrelations": [{"zones": [], "threatType": "", "severity": "", "description": ""}],
  "emergingThreats": [{"threatType": "", "affectedZones": [], "probability": 0-100, "timeframe": ""}],
  "zoneVulnerabilities": {"zone_1": {"score": 0-100, "vulnerabilities": []}, ...},
  "complianceAlerts": [{"zone": "", "alertType": "", "severity": "", "action": ""}],
  "predictiveForecasting": {"30day": {}, "60day": {}, "90day": {}},
  "mitigationStrategies": [{"zone": "", "strategy": "", "priority": ""}],
  "confidence": 0-1,
  "reasoning": "detailed explanation"
}`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      });

      const analysisText = response?.content?.[0]?.text;
      let analysis;

      try {
        analysis = JSON.parse(analysisText);
      } catch (parseError) {
        const jsonMatch = analysisText?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse Claude analysis response');
        }
      }

      // Auto-create compliance alerts if critical threats detected
      if (analysis?.overallThreatLevel === 'critical' || analysis?.overallThreatLevel === 'high') {
        await this.createComplianceAlerts(analysis?.complianceAlerts);
      }

      return {
        ...analysis,
        analyzedAt: new Date()?.toISOString(),
        domains,
        zoneCount: Object.keys(zoneData)?.length
      };
    } catch (error) {
      console.error('Error performing Claude analysis:', error);
      throw error;
    }
  },

  async createComplianceAlerts(alerts) {
    try {
      if (!alerts || alerts?.length === 0) return;

      const alertRecords = alerts?.map(alert => ({
        category: 'compliance',
        severity: alert?.severity || 'high',
        title: `Cross-Domain Threat: ${alert?.alertType}`,
        message: alert?.action,
        metadata: {
          zone: alert?.zone,
          alertType: alert?.alertType,
          autoGenerated: true,
          source: 'claude_ai_threat_correlation'
        },
        auto_response_enabled: true
      }));

      const { error } = await supabase
        ?.from('system_alerts')
        ?.insert(alertRecords);

      if (error) throw error;
      return { success: true, alertsCreated: alertRecords?.length };
    } catch (error) {
      console.error('Error creating compliance alerts:', error);
      return { success: false, error: error?.message };
    }
  },

  async storeAnalysisResults(analysis) {
    try {
      const { error } = await supabase
        ?.from('cross_domain_threat_analyses')
        ?.insert({
          overall_threat_level: analysis?.overallThreatLevel,
          cross_zone_correlations: analysis?.crossZoneCorrelations,
          emerging_threats: analysis?.emergingThreats,
          zone_vulnerabilities: analysis?.zoneVulnerabilities,
          compliance_alerts: analysis?.complianceAlerts,
          predictive_forecasting: analysis?.predictiveForecasting,
          mitigation_strategies: analysis?.mitigationStrategies,
          confidence: analysis?.confidence,
          reasoning: analysis?.reasoning,
          analyzed_at: analysis?.analyzedAt
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error storing analysis results:', error);
      return { success: false, error: error?.message };
    }
  },

  async getLatestAnalysis() {
    try {
      const { data, error } = await supabase
        ?.from('cross_domain_threat_analyses')
        ?.select('*')
        ?.order('analyzed_at', { ascending: false })
        ?.limit(1)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAnalysisHistory(limit = 10) {
    try {
      const { data, error } = await supabase
        ?.from('cross_domain_threat_analyses')
        ?.select('*')
        ?.order('analyzed_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getZoneSpecificThreats(zoneId) {
    try {
      const { data: latestAnalysis } = await this.getLatestAnalysis();

      if (!latestAnalysis) {
        return { data: null, error: { message: 'No analysis data available' } };
      }

      const zoneVulnerability = latestAnalysis?.zoneVulnerabilities?.[zoneId];
      const zoneCorrelations = latestAnalysis?.crossZoneCorrelations?.filter(
        c => c?.zones?.includes(zoneId)
      );
      const zoneMitigations = latestAnalysis?.mitigationStrategies?.filter(
        m => m?.zone === zoneId
      );

      return {
        data: {
          zone: PURCHASING_POWER_ZONES?.find(z => z?.id === zoneId),
          vulnerability: zoneVulnerability,
          correlations: zoneCorrelations,
          mitigations: zoneMitigations,
          analyzedAt: latestAnalysis?.analyzedAt
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};
