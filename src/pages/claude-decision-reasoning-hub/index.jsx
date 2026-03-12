import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Brain, Shield, FileText, AlertTriangle, CheckCircle, Loader, GitBranch, MessageSquare } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';


const MOCK_DISPUTES = [
  { id: 'D-2024-001', type: 'payment_dispute', user: 'user_4821', amount: '$49.99', status: 'pending', priority: 'high', created: '2h ago', description: 'User claims subscription was charged twice in the same billing cycle.' },
  { id: 'D-2024-002', type: 'fraud_investigation', user: 'user_9134', amount: '$199.00', status: 'investigating', priority: 'critical', created: '45m ago', description: 'Suspicious voting pattern detected — 847 votes cast in 3 minutes from single IP.' },
  { id: 'D-2024-003', type: 'policy_violation', user: 'user_2267', amount: null, status: 'pending', priority: 'medium', created: '5h ago', description: 'Election content flagged for potential misinformation in Zone 3 region.' },
  { id: 'D-2024-004', type: 'appeal', user: 'user_7753', amount: '$9.99', status: 'appeal', priority: 'medium', created: '1d ago', description: 'User appealing account suspension — claims automated fraud detection was incorrect.' },
];

const POLICY_DOCS = [
  { id: 'p1', title: 'Subscription Refund Policy', version: 'v2.3', lastUpdated: '2026-01-15' },
  { id: 'p2', title: 'Fraud Detection Thresholds', version: 'v1.8', lastUpdated: '2026-02-01' },
  { id: 'p3', title: 'Election Content Guidelines', version: 'v3.1', lastUpdated: '2026-01-28' },
  { id: 'p4', title: 'Account Suspension Appeals', version: 'v1.5', lastUpdated: '2026-02-10' },
];

const REASONING_STEPS = [
  'Analyzing dispute context and evidence...',
  'Cross-referencing transaction history...',
  'Applying policy interpretation framework...',
  'Evaluating fraud risk indicators...',
  'Calculating confidence score...',
  'Generating resolution recommendation...',
  'Preparing appeal workflow if needed...',
];

const getTypeIcon = (type) => {
  if (type === 'payment_dispute') return <DollarSign className="w-4 h-4" />;
  if (type === 'fraud_investigation') return <Shield className="w-4 h-4" />;
  if (type === 'policy_violation') return <FileText className="w-4 h-4" />;
  return <MessageSquare className="w-4 h-4" />;
};

function DollarSign({ className }) { return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }

export default function ClaudeDecisionReasoningHub() {
  const [activeTab, setActiveTab] = useState('disputes');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [reasoning, setReasoning] = useState({});
  const [loading, setLoading] = useState({});
  const [expandedSteps, setExpandedSteps] = useState({});
  const [policyQuery, setPolicyQuery] = useState('');
  const [policyResult, setPolicyResult] = useState(null);
  const [policyLoading, setPolicyLoading] = useState(false);
  const [appealData, setAppealData] = useState({});

  const runExtendedReasoning = useCallback(async (dispute) => {
    setLoading(prev => ({ ...prev, [dispute?.id]: true }));
    setSelectedDispute(dispute);

    const steps = [];
    for (let i = 0; i < REASONING_STEPS?.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      steps?.push(REASONING_STEPS?.[i]);
      setReasoning(prev => ({ ...prev, [dispute?.id]: { steps: [...steps], complete: false } }));
    }

    const confidenceScore = Math.floor(72 + Math.random() * 25);
    const resolution = dispute?.type === 'payment_dispute'
      ? { action: 'APPROVE_REFUND', confidence: confidenceScore, reasoning: `Duplicate charge confirmed via Stripe webhook logs. Transaction IDs match billing cycle overlap. Policy v2.3 §4.2 mandates full refund within 5 business days.`, appeal_eligible: false, next_steps: ['Issue Stripe refund', 'Send confirmation email', 'Update billing record'] }
      : dispute?.type === 'fraud_investigation'
      ? { action: 'ESCALATE_SUSPEND', confidence: confidenceScore, reasoning: `Voting velocity (847 votes/3min) exceeds fraud threshold (50 votes/min) by 1,694%. IP geolocation shows VPN usage. Pattern matches known bot behavior from fraud database.`, appeal_eligible: true, next_steps: ['Suspend account', 'Void fraudulent votes', 'Notify election creator', 'Flag for ML retraining'] }
      : dispute?.type === 'policy_violation'
      ? { action: 'CONTENT_REVIEW', confidence: confidenceScore, reasoning: `Content flagged by 3 independent moderators. Zone 3 regulatory guidelines (§7.1) require human review for political content. Automated confidence insufficient for auto-removal.`, appeal_eligible: true, next_steps: ['Queue for human review', 'Notify creator', 'Apply temporary visibility restriction'] }
      : { action: 'REVIEW_APPEAL', confidence: confidenceScore, reasoning: `Appeal submitted within 30-day window. Original suspension based on 94.2% fraud confidence score. User provides counter-evidence. Policy §12.3 requires human review for appeals with new evidence.`, appeal_eligible: false, next_steps: ['Assign to human reviewer', 'Request additional evidence', 'Set 72h review deadline'] };

    setReasoning(prev => ({ ...prev, [dispute?.id]: { steps, complete: true, resolution } }));
    setLoading(prev => ({ ...prev, [dispute?.id]: false }));
  }, []);

  const interpretPolicy = useCallback(async () => {
    if (!policyQuery?.trim()) return;
    setPolicyLoading(true);
    setPolicyResult(null);
    await new Promise(r => setTimeout(r, 1500));
    setPolicyResult({
      query: policyQuery,
      interpretation: `Based on extended reasoning analysis of all ${POLICY_DOCS?.length} policy documents:\n\n**Relevant Policies Found:** Subscription Refund Policy v2.3 §4.2, Fraud Detection Thresholds v1.8 §3.1\n\n**Interpretation:** The query relates to subscription billing disputes. Under current policy, users are entitled to refunds for duplicate charges within 30 days. Fraud detection thresholds apply when transaction velocity exceeds 50 events/minute per user session.\n\n**Confidence:** 91.4% — High confidence interpretation based on 3 matching policy clauses.`,
      confidence: 91.4,
      policies: ['Subscription Refund Policy v2.3', 'Fraud Detection Thresholds v1.8'],
    });
    setPolicyLoading(false);
  }, [policyQuery]);

  const submitAppeal = useCallback((disputeId) => {
    setAppealData(prev => ({ ...prev, [disputeId]: { submitted: true, status: 'queued', eta: '72 hours', assignedTo: 'Senior Review Team' } }));
  }, []);

  const tabs = [
    { id: 'disputes', label: 'Dispute Resolution', icon: Shield },
    { id: 'fraud', label: 'Fraud Investigation', icon: AlertTriangle },
    { id: 'policy', label: 'Policy Interpretation', icon: FileText },
    { id: 'appeals', label: 'Appeal Workflow', icon: GitBranch },
  ];

  const getPriorityBadge = (p) => {
    const colors = { critical: 'bg-red-900/50 text-red-300', high: 'bg-orange-900/50 text-orange-300', medium: 'bg-yellow-900/50 text-yellow-300' };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors?.[p] || 'bg-gray-700 text-gray-300'}`}>{p?.toUpperCase()}</span>;
  };

  return (
    <>
      <Helmet>
        <title>Claude Decision Reasoning Hub - Vottery</title>
        <meta name="description" content="Claude extended reasoning for automated dispute resolution, fraud investigation chains, policy interpretation with confidence scoring and appeal workflow automation." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-7 h-7 text-purple-400" />
              Claude Decision Reasoning Hub
            </h1>
            <p className="text-muted-foreground mt-1">Extended reasoning · Dispute resolution · Fraud investigation · Policy interpretation · Appeal automation</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Pending Disputes', value: MOCK_DISPUTES?.filter(d => d?.status === 'pending')?.length, color: 'text-yellow-400' },
              { label: 'Under Investigation', value: MOCK_DISPUTES?.filter(d => d?.status === 'investigating')?.length, color: 'text-red-400' },
              { label: 'Appeals Queued', value: MOCK_DISPUTES?.filter(d => d?.status === 'appeal')?.length, color: 'text-blue-400' },
              { label: 'Avg Confidence', value: '87.3%', color: 'text-green-400' },
            ]?.map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">{s?.label}</p>
                <p className={`text-2xl font-bold ${s?.color}`}>{s?.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-muted/30 p-1 rounded-lg overflow-x-auto">
            {tabs?.map(t => (
              <button
                key={t?.id}
                onClick={() => setActiveTab(t?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === t?.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t?.label}
              </button>
            ))}
          </div>

          {(activeTab === 'disputes' || activeTab === 'fraud') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">
                  {activeTab === 'disputes' ? 'Active Disputes' : 'Fraud Investigation Queue'}
                </h3>
                {MOCK_DISPUTES?.filter(d =>
                  activeTab === 'disputes'
                    ? ['payment_dispute', 'policy_violation']?.includes(d?.type)
                    : ['fraud_investigation', 'appeal']?.includes(d?.type)
                )?.map(dispute => (
                  <div
                    key={dispute?.id}
                    className={`bg-card border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedDispute?.id === dispute?.id ? 'border-primary' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedDispute(dispute)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{getTypeIcon(dispute?.type)}</span>
                        <span className="font-medium text-foreground text-sm">{dispute?.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(dispute?.priority)}
                        <span className="text-xs text-muted-foreground">{dispute?.created}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{dispute?.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{dispute?.user} {dispute?.amount ? `· ${dispute?.amount}` : ''}</span>
                      <button
                        onClick={e => { e?.stopPropagation(); runExtendedReasoning(dispute); }}
                        disabled={loading?.[dispute?.id]}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 disabled:opacity-60"
                      >
                        {loading?.[dispute?.id] ? <Loader className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                        {loading?.[dispute?.id] ? 'Reasoning...' : 'Run Extended Reasoning'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                {selectedDispute && reasoning?.[selectedDispute?.id] ? (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      Extended Reasoning Chain — {selectedDispute?.id}
                    </h3>
                    <div className="space-y-2 mb-4">
                      {reasoning?.[selectedDispute?.id]?.steps?.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                    {reasoning?.[selectedDispute?.id]?.complete && (
                      <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-foreground">Resolution Decision</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Confidence:</span>
                            <span className={`text-sm font-bold ${
                              reasoning?.[selectedDispute?.id]?.resolution?.confidence >= 85 ? 'text-green-400' : 'text-yellow-400'
                            }`}>{reasoning?.[selectedDispute?.id]?.resolution?.confidence}%</span>
                          </div>
                        </div>
                        <div className="p-3 bg-purple-900/20 rounded-lg mb-3">
                          <p className="text-sm font-bold text-purple-300 mb-1">{reasoning?.[selectedDispute?.id]?.resolution?.action}</p>
                          <p className="text-sm text-foreground">{reasoning?.[selectedDispute?.id]?.resolution?.reasoning}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-2">NEXT STEPS</p>
                          {reasoning?.[selectedDispute?.id]?.resolution?.next_steps?.map((step, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-foreground mb-1">
                              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                              {step}
                            </div>
                          ))}
                        </div>
                        {reasoning?.[selectedDispute?.id]?.resolution?.appeal_eligible && !appealData?.[selectedDispute?.id] && (
                          <button
                            onClick={() => submitAppeal(selectedDispute?.id)}
                            className="w-full py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                          >
                            Submit for Appeal Review
                          </button>
                        )}
                        {appealData?.[selectedDispute?.id] && (
                          <div className="p-3 bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-300">✓ Appeal queued — Assigned to {appealData?.[selectedDispute?.id]?.assignedTo} · ETA: {appealData?.[selectedDispute?.id]?.eta}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-center h-64">
                    <div className="text-center">
                      <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                      <p className="text-muted-foreground">Select a case and run Extended Reasoning to see Claude's decision chain</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Policy Interpretation Engine</h3>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={policyQuery}
                    onChange={e => setPolicyQuery(e?.target?.value)}
                    placeholder="Ask a policy question (e.g. 'When is a user eligible for a refund after fraud detection?')"
                    className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyDown={e => e?.key === 'Enter' && interpretPolicy()}
                  />
                  <button
                    onClick={interpretPolicy}
                    disabled={policyLoading || !policyQuery?.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-60"
                  >
                    {policyLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    Interpret
                  </button>
                </div>
                {policyResult && (
                  <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-purple-300">Claude's Policy Interpretation</span>
                      <span className="text-sm text-green-400 font-bold">{policyResult?.confidence}% confidence</span>
                    </div>
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">{policyResult?.interpretation}</pre>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {policyResult?.policies?.map((p, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-900/40 text-purple-300 rounded text-xs">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Policy Document Library</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {POLICY_DOCS?.map(doc => (
                    <div key={doc?.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground text-sm">{doc?.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{doc?.version} · Updated {doc?.lastUpdated}</p>
                        </div>
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appeals' && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Appeal Workflow Automation</h3>
                <div className="space-y-4">
                  {MOCK_DISPUTES?.filter(d => d?.status === 'appeal' || d?.type === 'fraud_investigation')?.map(dispute => (
                    <div key={dispute?.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-foreground">{dispute?.id}</p>
                          <p className="text-sm text-muted-foreground">{dispute?.description}</p>
                        </div>
                        {getPriorityBadge(dispute?.priority)}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { step: '1. Evidence Review', status: 'complete', color: 'text-green-400' },
                          { step: '2. Claude Analysis', status: reasoning?.[dispute?.id]?.complete ? 'complete' : 'pending', color: reasoning?.[dispute?.id]?.complete ? 'text-green-400' : 'text-yellow-400' },
                          { step: '3. Human Review', status: appealData?.[dispute?.id] ? 'queued' : 'waiting', color: appealData?.[dispute?.id] ? 'text-blue-400' : 'text-muted-foreground' },
                        ]?.map((s, i) => (
                          <div key={i} className="text-center p-2 bg-muted/20 rounded">
                            <p className="text-xs text-muted-foreground">{s?.step}</p>
                            <p className={`text-xs font-medium mt-1 ${s?.color}`}>{s?.status?.toUpperCase()}</p>
                          </div>
                        ))}
                      </div>
                      {!reasoning?.[dispute?.id] && (
                        <button
                          onClick={() => runExtendedReasoning(dispute)}
                          disabled={loading?.[dispute?.id]}
                          className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 disabled:opacity-60"
                        >
                          {loading?.[dispute?.id] ? <Loader className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                          Analyze with Extended Reasoning
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
