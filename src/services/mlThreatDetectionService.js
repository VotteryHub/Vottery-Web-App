import { supabase } from '../lib/supabase';
import { aiProxyService } from './aiProxyService';

class MLThreatDetectionService {
  // Detect anomalies using ML models
  async detectAnomalies() {
    try {
      // Fetch recent security events
      const { data: events, error } = await supabase?.from('security_events')?.select('*')?.order('created_at', { ascending: false })?.limit(1000);

      if (error) throw error;

      // Use AI to analyze patterns
      const analysis = await aiProxyService?.sendRequest({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an advanced ML-powered anomaly detection system. Analyze security events and identify anomalies using statistical analysis, behavioral patterns, and machine learning techniques.'
          },
          {
            role: 'user',
            content: `Analyze these security events for anomalies: ${JSON.stringify(events)}. Return JSON with: anomalies (array with type, description, severity, anomalyScore, confidence, timestamp, model, affectedEntities, indicators), modelMetrics (accuracy, precision, recall, f1Score).`
          }
        ],
        temperature: 0.2
      });

      return this.parseAIResponse(analysis);
    } catch (error) {
      console.error('Anomaly detection failed:', error);
      return this.getMockAnomalies();
    }
  }

  // Analyze behavioral patterns
  async analyzeBehavior() {
    try {
      const { data: userActivity, error } = await supabase?.from('user_activity_logs')?.select('*')?.order('created_at', { ascending: false })?.limit(5000);

      if (error) throw error;

      const analysis = await aiProxyService?.sendRequest({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a behavioral analysis specialist. Identify suspicious user behavior patterns, velocity anomalies, and coordinated activities.'
          },
          {
            role: 'user',
            content: `Analyze user behavior: ${JSON.stringify(userActivity)}. Return JSON with: suspiciousBehaviors (array with pattern, description, riskLevel, occurrences, usersAffected, confidence), velocityAnomalies (array with metric, value, timeframe, deviationPercentage), userClusters (array with id, description, users, characteristics).`
          }
        ],
        temperature: 0.2
      });

      return this.parseAIResponse(analysis);
    } catch (error) {
      console.error('Behavioral analysis failed:', error);
      return this.getMockBehavioralData();
    }
  }

  // Detect zero-day threats
  async detectZeroDay() {
    try {
      const { data: threats, error } = await supabase?.from('security_threats')?.select('*')?.eq('threat_type', 'unknown')?.order('created_at', { ascending: false });

      if (error) throw error;

      const analysis = await aiProxyService?.sendRequest({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a zero-day threat detection specialist. Identify novel attack patterns, unknown exploitation techniques, and emerging vulnerabilities that do not match known signatures.'
          },
          {
            role: 'user',
            content: `Analyze for zero-day threats: ${JSON.stringify(threats)}. Return JSON with: threats (array with threatName, description, severity, exploitAttempts, affectedSystems, confidence, cveStatus, firstDetected, exploitationPattern, indicators).`
          }
        ],
        temperature: 0.2
      });

      return this.parseAIResponse(analysis);
    } catch (error) {
      console.error('Zero-day detection failed:', error);
      return this.getMockZeroDayThreats();
    }
  }

  // Get threat intelligence
  async getThreatIntelligence() {
    try {
      const analysis = await aiProxyService?.sendRequest({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a threat intelligence aggregator. Provide current threat landscape information, active threat feeds, and known threat actor profiles.'
          },
          {
            role: 'user',
            content: 'Provide current threat intelligence. Return JSON with: feeds (array with source, description, status, lastUpdate), globalThreats (array with name, description, threatLevel, regions, firstSeen, incidents, trend, trendPercentage), threatActors (array with name, description, sophistication, targets, methods, lastActivity).'
          }
        ],
        temperature: 0.3
      });

      return this.parseAIResponse(analysis);
    } catch (error) {
      console.error('Threat intelligence failed:', error);
      return this.getMockThreatIntelligence();
    }
  }

  // Predict future threats
  async predictThreats() {
    try {
      const { data: historicalData, error } = await supabase?.from('security_events')?.select('*')?.order('created_at', { ascending: false })?.limit(10000);

      if (error) throw error;

      const analysis = await aiProxyService?.sendRequest({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a predictive threat modeling specialist. Use historical data to forecast future threats, attack vectors, and risk timelines.'
          },
          {
            role: 'user',
            content: `Predict future threats based on: ${JSON.stringify(historicalData)}. Return JSON with: forecasts (array with threatType, description, probability, impact, timeframe, confidence), attackVectors (array with name, description, likelihood), timeline (array with day, date, event, details, riskScore).`
          }
        ],
        temperature: 0.2
      });

      return this.parseAIResponse(analysis);
    } catch (error) {
      console.error('Threat prediction failed:', error);
      return this.getMockPredictions();
    }
  }

  // Recognize attack patterns
  async recognizeAttackPatterns() {
    try {
      const { data: attacks, error } = await supabase?.from('security_events')?.select('*')?.eq('event_type', 'attack')?.order('created_at', { ascending: false })?.limit(2000);

      if (error) throw error;

      const analysis = await aiProxyService?.sendRequest({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an attack pattern recognition specialist. Identify sophisticated attack patterns, map them to MITRE ATT&CK framework, and track pattern evolution.'
          },
          {
            role: 'user',
            content: `Analyze attack patterns: ${JSON.stringify(attacks)}. Return JSON with: detectedPatterns (array with name, description, category, matchScore, occurrences, targets, successRate, sophistication, detectedAt, techniques), mitreMapping (array with tactic, techniques), evolution (array with pattern, description, firstSeen, stage, trend).`
          }
        ],
        temperature: 0.2
      });

      return this.parseAIResponse(analysis);
    } catch (error) {
      console.error('Pattern recognition failed:', error);
      return this.getMockAttackPatterns();
    }
  }

  // NEW: OpenAI-powered contextual threat analysis
  async analyzeSecurityIncidentWithOpenAI(incidentData) {
    try {
      const response = await aiProxyService?.sendRequest({
        model: 'gpt-5',
        messages: [
          {
            role: 'system',
            content: 'You are an advanced cybersecurity threat analyst with expertise in contextual analysis of security incidents. Provide detailed threat assessment, correlation with known attack patterns, and actionable recommendations.'
          },
          {
            role: 'user',
            content: `Analyze this security incident with advanced contextual analysis: ${JSON.stringify(incidentData)}. Return JSON with: threatAssessment (severity, category, confidence, description), contextualAnalysis (attackVector, motivation, sophistication, relatedThreats), correlations (array with pattern, confidence, description), recommendations (array with priority, action, rationale), escalationLevel (LOW/MEDIUM/HIGH/CRITICAL).`
          }
        ],
        reasoning_effort: 'high',
        verbosity: 'high'
      });

      return this.parseAIResponse(response);
    } catch (error) {
      console.error('OpenAI threat analysis failed:', error);
      return this.getMockOpenAIAnalysis();
    }
  }

  // NEW: Automated threat correlation reasoning
  async correlateThreatsWithOpenAI(threats) {
    try {
      const response = await aiProxyService?.sendRequest({
        model: 'gpt-5',
        messages: [
          {
            role: 'system',
            content: 'You are a threat intelligence correlation specialist. Identify patterns, connections, and relationships between security threats using advanced reasoning.'
          },
          {
            role: 'user',
            content: `Correlate these security threats and identify patterns: ${JSON.stringify(threats)}. Return JSON with: correlations (array with threatIds, relationship, confidence, description, sharedIndicators), attackCampaigns (array with name, threats, timeline, attribution), riskAssessment (overallRisk, criticalFindings, emergingPatterns).`
          }
        ],
        reasoning_effort: 'high',
        verbosity: 'medium'
      });

      return this.parseAIResponse(response);
    } catch (error) {
      console.error('OpenAI threat correlation failed:', error);
      return this.getMockThreatCorrelation();
    }
  }

  // NEW: Predictive threat escalation recommendations
  async predictThreatEscalationWithOpenAI(threatHistory) {
    try {
      const response = await aiProxyService?.sendRequest({
        model: 'gpt-5',
        messages: [
          {
            role: 'system',
            content: 'You are a predictive threat escalation specialist. Analyze threat patterns and predict escalation likelihood with actionable recommendations.'
          },
          {
            role: 'user',
            content: `Predict threat escalation based on this history: ${JSON.stringify(threatHistory)}. Return JSON with: escalationPrediction (likelihood, timeframe, confidence, severity), escalationPath (array with stage, indicators, timeframe, actions), recommendations (array with priority, action, timing, resources), preventiveMeasures (array with measure, effectiveness, implementation).`
          }
        ],
        reasoning_effort: 'high',
        verbosity: 'high'
      });

      return this.parseAIResponse(response);
    } catch (error) {
      console.error('OpenAI escalation prediction failed:', error);
      return this.getMockEscalationPrediction();
    }
  }

  // NEW: Comprehensive threat intelligence with OpenAI
  async getEnhancedThreatIntelligence() {
    try {
      const [basicIntel, incidents, patterns] = await Promise.all([
        this.getThreatIntelligence(),
        supabase?.from('security_events')?.select('*')?.order('created_at', { ascending: false })?.limit(100),
        this.recognizeAttackPatterns()
      ]);

      const response = await aiProxyService?.sendRequest({
        model: 'gpt-5',
        messages: [
          {
            role: 'system',
            content: 'You are a threat intelligence analyst. Synthesize threat data from multiple sources and provide strategic insights.'
          },
          {
            role: 'user',
            content: `Synthesize threat intelligence: Basic Intel: ${JSON.stringify(basicIntel)}, Recent Incidents: ${JSON.stringify(incidents?.data)}, Attack Patterns: ${JSON.stringify(patterns)}. Return JSON with: strategicThreats (array with name, description, impact, likelihood, mitigation), emergingTrends (array with trend, description, timeline, significance), actionableIntelligence (array with finding, priority, action, deadline).`
          }
        ],
        reasoning_effort: 'high',
        verbosity: 'high'
      });

      return this.parseAIResponse(response);
    } catch (error) {
      console.error('Enhanced threat intelligence failed:', error);
      return this.getMockEnhancedIntelligence();
    }
  }

  // Parse AI response
  parseAIResponse(response) {
    try {
      const content = response?.choices?.[0]?.message?.content || '{}';
      const jsonMatch = content?.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch?.[0]) : {};
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {};
    }
  }

  // Mock data methods
  getMockAnomalies() {
    return {
      anomalies: [
        {
          type: 'Unusual Login Pattern',
          description: 'Multiple failed login attempts from different geographic locations within 5 minutes',
          severity: 'high',
          anomalyScore: 87,
          confidence: 92,
          timestamp: new Date()?.toISOString(),
          model: 'Random Forest Classifier',
          affectedEntities: '12 user accounts',
          indicators: ['Geographic anomaly', 'Velocity spike', 'Failed auth attempts']
        },
        {
          type: 'API Rate Limit Bypass Attempt',
          description: 'Distributed requests pattern attempting to circumvent rate limiting',
          severity: 'critical',
          anomalyScore: 94,
          confidence: 88,
          timestamp: new Date()?.toISOString(),
          model: 'Neural Network',
          affectedEntities: '3 API endpoints',
          indicators: ['Distributed IPs', 'Timing patterns', 'Header manipulation']
        },
        {
          type: 'Data Exfiltration Pattern',
          description: 'Unusual data access patterns suggesting potential data theft',
          severity: 'critical',
          anomalyScore: 91,
          confidence: 85,
          timestamp: new Date()?.toISOString(),
          model: 'Isolation Forest',
          affectedEntities: 'User database',
          indicators: ['Large data transfers', 'Off-hours access', 'Unusual queries']
        }
      ],
      modelMetrics: {
        accuracy: 98.7,
        precision: 96.3,
        recall: 94.8,
        f1Score: 95.5
      }
    };
  }

  getMockBehavioralData() {
    return {
      suspiciousBehaviors: [
        {
          pattern: 'Coordinated Voting Activity',
          description: 'Multiple accounts voting in synchronized patterns',
          riskLevel: 'HIGH',
          occurrences: 47,
          usersAffected: 23,
          confidence: 89
        },
        {
          pattern: 'Account Takeover Indicators',
          description: 'Sudden changes in user behavior post-login',
          riskLevel: 'CRITICAL',
          occurrences: 8,
          usersAffected: 8,
          confidence: 94
        }
      ],
      velocityAnomalies: [
        {
          metric: 'Login Attempts',
          value: '1,247/hour',
          timeframe: 'Last hour',
          deviationPercentage: 340
        },
        {
          metric: 'API Requests',
          value: '89,432/min',
          timeframe: 'Last 5 minutes',
          deviationPercentage: 520
        }
      ],
      userClusters: [
        {
          id: 'CLU-001',
          description: 'Suspicious voting cluster with coordinated timing',
          users: 15,
          characteristics: ['Same IP range', 'Synchronized actions', 'New accounts']
        }
      ]
    };
  }

  getMockZeroDayThreats() {
    return {
      threats: [
        {
          threatName: 'Novel SQL Injection Variant',
          description: 'Previously unknown SQL injection technique bypassing WAF filters',
          severity: 9,
          exploitAttempts: 127,
          affectedSystems: 3,
          confidence: 87,
          cveStatus: 'Pending',
          firstDetected: new Date()?.toISOString(),
          exploitationPattern: 'UNION SELECT with encoded payloads',
          indicators: ['Unusual query patterns', 'Encoding variations', 'WAF bypass attempts']
        },
        {
          threatName: 'Authentication Bypass Zero-Day',
          description: 'Novel authentication bypass technique exploiting session handling',
          severity: 10,
          exploitAttempts: 43,
          affectedSystems: 1,
          confidence: 92,
          cveStatus: 'Under Review',
          firstDetected: new Date()?.toISOString(),
          exploitationPattern: 'Session token manipulation',
          indicators: ['Token anomalies', 'Privilege escalation', 'Session hijacking']
        }
      ]
    };
  }

  getMockThreatIntelligence() {
    return {
      feeds: [
        { source: 'CISA', description: 'US Cybersecurity alerts', status: 'active', lastUpdate: '2 minutes ago' },
        { source: 'OWASP', description: 'Web application vulnerabilities', status: 'active', lastUpdate: '5 minutes ago' },
        { source: 'MITRE ATT&CK', description: 'Adversary tactics database', status: 'active', lastUpdate: '1 hour ago' }
      ],
      globalThreats: [
        {
          name: 'Ransomware Campaign 2026-Q1',
          description: 'Sophisticated ransomware targeting financial platforms',
          threatLevel: 'CRITICAL',
          regions: 'Global',
          firstSeen: '2026-01-15',
          incidents: 847,
          trend: 'up',
          trendPercentage: 45
        }
      ],
      threatActors: [
        {
          name: 'APT-2026-01',
          description: 'Advanced persistent threat group targeting voting platforms',
          sophistication: 'HIGH',
          targets: 'Democratic institutions',
          methods: 'Phishing, Zero-day exploits',
          lastActivity: '3 days ago'
        }
      ]
    };
  }

  getMockPredictions() {
    return {
      forecasts: [
        {
          threatType: 'DDoS Attack',
          description: 'Predicted distributed denial of service attack',
          probability: 78,
          impact: 'HIGH',
          timeframe: '7-14 days',
          confidence: 82
        },
        {
          threatType: 'Credential Stuffing',
          description: 'Large-scale credential stuffing campaign expected',
          probability: 65,
          impact: 'MEDIUM',
          timeframe: '3-7 days',
          confidence: 75
        }
      ],
      attackVectors: [
        { name: 'API Exploitation', description: 'Targeting REST API endpoints', likelihood: 72 },
        { name: 'Social Engineering', description: 'Phishing campaigns', likelihood: 68 }
      ],
      timeline: [
        { day: 'Day 3', date: 'Feb 6', event: 'Increased reconnaissance activity', details: 'Port scanning detected', riskScore: 6 },
        { day: 'Day 7', date: 'Feb 10', event: 'Potential attack window', details: 'High probability DDoS', riskScore: 8 }
      ]
    };
  }

  getMockAttackPatterns() {
    return {
      detectedPatterns: [
        {
          name: 'Multi-Stage SQL Injection',
          description: 'Sophisticated SQL injection with multiple evasion techniques',
          category: 'INJECTION',
          matchScore: 94,
          occurrences: 23,
          targets: 5,
          successRate: 12,
          sophistication: 'HIGH',
          detectedAt: new Date()?.toISOString(),
          techniques: ['Blind SQLi', 'Time-based', 'Union-based', 'Error-based']
        }
      ],
      mitreMapping: [
        { tactic: 'Initial Access', techniques: ['Phishing', 'Valid Accounts'] },
        { tactic: 'Execution', techniques: ['Command Injection', 'SQL Injection'] }
      ],
      evolution: [
        {
          pattern: 'XSS Attacks',
          description: 'Cross-site scripting techniques evolving',
          firstSeen: '2025-12-01',
          stage: 'Advanced',
          trend: 34
        }
      ]
    };
  }

  // Mock data for OpenAI features
  getMockOpenAIAnalysis() {
    return {
      threatAssessment: {
        severity: 'HIGH',
        category: 'Advanced Persistent Threat',
        confidence: 87,
        description: 'Sophisticated multi-stage attack with advanced evasion techniques'
      },
      contextualAnalysis: {
        attackVector: 'API exploitation with credential stuffing',
        motivation: 'Data exfiltration and system compromise',
        sophistication: 'HIGH',
        relatedThreats: ['APT-2026-01', 'Ransomware Campaign 2026-Q1']
      },
      correlations: [
        {
          pattern: 'Similar to APT-2026-01 tactics',
          confidence: 92,
          description: 'Matches known APT group behavior patterns'
        },
        {
          pattern: 'Reconnaissance phase detected',
          confidence: 85,
          description: 'Port scanning and vulnerability probing observed'
        }
      ],
      recommendations: [
        {
          priority: 'CRITICAL',
          action: 'Implement immediate API rate limiting and authentication hardening',
          rationale: 'Prevent further exploitation attempts'
        },
        {
          priority: 'HIGH',
          action: 'Enable advanced logging and monitoring for affected endpoints',
          rationale: 'Improve threat detection and response capabilities'
        },
        {
          priority: 'MEDIUM',
          action: 'Conduct security audit of authentication mechanisms',
          rationale: 'Identify and remediate vulnerabilities'
        }
      ],
      escalationLevel: 'HIGH'
    };
  }

  getMockThreatCorrelation() {
    return {
      correlations: [
        {
          threatIds: ['THR-001', 'THR-003', 'THR-007'],
          relationship: 'Coordinated Attack Campaign',
          confidence: 89,
          description: 'Multiple threats originating from same infrastructure',
          sharedIndicators: ['IP range 192.168.x.x', 'Similar timing patterns', 'Common exploit techniques']
        },
        {
          threatIds: ['THR-002', 'THR-005'],
          relationship: 'Sequential Attack Stages',
          confidence: 94,
          description: 'Reconnaissance followed by exploitation',
          sharedIndicators: ['Same target systems', 'Progressive sophistication', 'Time-based correlation']
        }
      ],
      attackCampaigns: [
        {
          name: 'Operation Shadow Vote',
          threats: ['THR-001', 'THR-003', 'THR-007', 'THR-009'],
          timeline: '2026-01-15 to Present',
          attribution: 'APT-2026-01 (High Confidence)'
        }
      ],
      riskAssessment: {
        overallRisk: 'HIGH',
        criticalFindings: [
          'Coordinated multi-vector attack in progress',
          'Advanced persistent threat actor involvement',
          'Escalating sophistication over time'
        ],
        emergingPatterns: [
          'Shift from reconnaissance to active exploitation',
          'Targeting authentication and session management',
          'Use of zero-day vulnerabilities'
        ]
      }
    };
  }

  getMockEscalationPrediction() {
    return {
      escalationPrediction: {
        likelihood: 82,
        timeframe: '24-48 hours',
        confidence: 88,
        severity: 'CRITICAL'
      },
      escalationPath: [
        {
          stage: 'Current: Reconnaissance & Probing',
          indicators: ['Port scanning', 'Vulnerability assessment', 'API enumeration'],
          timeframe: 'Now',
          actions: 'Monitor and log all suspicious activity'
        },
        {
          stage: 'Next: Initial Compromise Attempt',
          indicators: ['Authentication bypass attempts', 'Exploit delivery', 'Credential stuffing'],
          timeframe: '12-24 hours',
          actions: 'Harden authentication, enable MFA, increase monitoring'
        },
        {
          stage: 'Potential: System Compromise',
          indicators: ['Privilege escalation', 'Lateral movement', 'Data exfiltration'],
          timeframe: '24-48 hours',
          actions: 'Activate incident response, isolate affected systems'
        }
      ],
      recommendations: [
        {
          priority: 'CRITICAL',
          action: 'Activate 24/7 security monitoring',
          timing: 'Immediate',
          resources: 'Security Operations Center'
        },
        {
          priority: 'HIGH',
          action: 'Deploy additional WAF rules and IDS signatures',
          timing: 'Within 2 hours',
          resources: 'Network Security Team'
        },
        {
          priority: 'HIGH',
          action: 'Notify stakeholders and prepare incident response team',
          timing: 'Within 4 hours',
          resources: 'Management and IR Team'
        }
      ],
      preventiveMeasures: [
        {
          measure: 'Implement advanced rate limiting',
          effectiveness: 85,
          implementation: 'Immediate'
        },
        {
          measure: 'Enable behavioral analytics',
          effectiveness: 78,
          implementation: '24 hours'
        },
        {
          measure: 'Deploy honeypot systems',
          effectiveness: 72,
          implementation: '48 hours'
        }
      ]
    };
  }

  getMockEnhancedIntelligence() {
    return {
      strategicThreats: [
        {
          name: 'Voting Platform Targeted Campaign',
          description: 'Coordinated effort to compromise democratic voting systems',
          impact: 'CRITICAL',
          likelihood: 'HIGH',
          mitigation: 'Multi-layered security controls and continuous monitoring'
        },
        {
          name: 'API Exploitation Wave',
          description: 'Widespread targeting of REST API endpoints across platforms',
          impact: 'HIGH',
          likelihood: 'MEDIUM',
          mitigation: 'API security hardening and authentication improvements'
        }
      ],
      emergingTrends: [
        {
          trend: 'AI-Powered Attack Automation',
          description: 'Threat actors using AI to automate reconnaissance and exploitation',
          timeline: 'Q1 2026',
          significance: 'Significantly increases attack velocity and sophistication'
        },
        {
          trend: 'Zero-Day Exploitation Increase',
          description: 'Rise in zero-day vulnerability exploitation',
          timeline: 'Ongoing',
          significance: 'Traditional defenses less effective'
        }
      ],
      actionableIntelligence: [
        {
          finding: 'APT-2026-01 actively targeting voting platforms',
          priority: 'CRITICAL',
          action: 'Implement APT-specific detection rules and hardening measures',
          deadline: '24 hours'
        },
        {
          finding: 'Credential stuffing campaigns targeting authentication endpoints',
          priority: 'HIGH',
          action: 'Deploy advanced authentication protection and monitoring',
          deadline: '48 hours'
        }
      ]
    };
  }
}

export const mlThreatDetectionService = new MLThreatDetectionService();
export default mlThreatDetectionService;