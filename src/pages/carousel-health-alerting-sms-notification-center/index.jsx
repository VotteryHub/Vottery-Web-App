import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { carouselHealthAlertingService } from '../../services/carouselHealthAlertingService';
import { Bell, AlertTriangle, CheckCircle, Phone, MessageSquare, Activity, Users, RefreshCw, Plus, Trash2, Clock, ChevronRight, AlertCircle, BarChart2, X, Check } from 'lucide-react';

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-900', border: 'border-red-700', badge: 'bg-red-800 text-red-200' },
  high: { color: 'text-orange-400', bg: 'bg-orange-900', border: 'border-orange-700', badge: 'bg-orange-800 text-orange-200' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-900', border: 'border-yellow-700', badge: 'bg-yellow-800 text-yellow-200' },
  low: { color: 'text-blue-400', bg: 'bg-blue-900', border: 'border-blue-700', badge: 'bg-blue-800 text-blue-200' }
};

function IncidentCard({ incident, onResolve, onEscalate }) {
  const sev = SEVERITY_CONFIG?.[incident?.severity] || SEVERITY_CONFIG?.low;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border ${sev?.border} ${sev?.bg} bg-opacity-20 p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${sev?.color}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-medium text-sm">{incident?.title}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sev?.badge}`}>
                {incident?.severity?.toUpperCase()}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 capitalize">
                {incident?.carouselType}
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-1">{incident?.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(incident?.detectedAt)?.toLocaleString()}
              </span>
              <span className="capitalize">{incident?.incidentType?.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onEscalate(incident?.id)}
            className="text-xs px-2 py-1 rounded bg-orange-800 hover:bg-orange-700 text-orange-200"
          >
            Escalate
          </button>
          <button
            onClick={() => onResolve(incident?.id)}
            className="text-xs px-2 py-1 rounded bg-green-800 hover:bg-green-700 text-green-200"
          >
            Resolve
          </button>
        </div>
      </div>
    </div>
  );
}

function AlertRuleForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    ruleName: '',
    carouselType: 'all',
    ruleType: 'performance_degradation',
    thresholdValue: 30,
    thresholdOperator: '>',
    severity: 'high',
    notificationChannels: ['sms']
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4">
      <h3 className="text-white font-bold">Create Alert Rule</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Rule Name</label>
          <input
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            value={form?.ruleName}
            onChange={e => setForm(p => ({ ...p, ruleName: e?.target?.value }))}
            placeholder="e.g. Performance Degradation Alert"
            required
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Carousel Type</label>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            value={form?.carouselType}
            onChange={e => setForm(p => ({ ...p, carouselType: e?.target?.value }))}
          >
            <option value="all">All Types</option>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
            <option value="gradient">Gradient</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Rule Type</label>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            value={form?.ruleType}
            onChange={e => setForm(p => ({ ...p, ruleType: e?.target?.value }))}
          >
            <option value="performance_degradation">Performance Degradation (&gt;30%)</option>
            <option value="system_outage">System Outage</option>
            <option value="anomaly_detection">Anomaly Detection</option>
            <option value="error_rate">Error Rate Threshold</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Threshold Value</label>
          <div className="flex gap-2">
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-2 text-white text-sm w-16"
              value={form?.thresholdOperator}
              onChange={e => setForm(p => ({ ...p, thresholdOperator: e?.target?.value }))}
            >
              <option value=">">{'>'}</option>
              <option value="<">{'<'}</option>
              <option value=">=">{'>='}</option>
              <option value="<=">{'<='}</option>
            </select>
            <input
              type="number"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              value={form?.thresholdValue}
              onChange={e => setForm(p => ({ ...p, thresholdValue: parseFloat(e?.target?.value) }))}
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Severity</label>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            value={form?.severity}
            onChange={e => setForm(p => ({ ...p, severity: e?.target?.value }))}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          Save Rule
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

function OnCallContactForm({ onSave, onCancel }) {
  const [form, setForm] = useState({ name: '', phoneNumber: '', email: '', priority: 1, escalationLevel: 1 });

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4">
      <h3 className="text-white font-bold">Add On-Call Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Name</label>
          <input
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            value={form?.name}
            onChange={e => setForm(p => ({ ...p, name: e?.target?.value }))}
            placeholder="Contact name"
            required
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Phone Number (Telnyx SMS)</label>
          <input
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            value={form?.phoneNumber}
            onChange={e => setForm(p => ({ ...p, phoneNumber: e?.target?.value }))}
            placeholder="+1234567890"
            required
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Email</label>
          <input
            type="email"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            value={form?.email}
            onChange={e => setForm(p => ({ ...p, email: e?.target?.value }))}
            placeholder="contact@example.com"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Priority (1 = highest)</label>
          <input
            type="number"
            min="1" max="10"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            value={form?.priority}
            onChange={e => setForm(p => ({ ...p, priority: parseInt(e?.target?.value) }))}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          Add Contact
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

function AnomalyScoringPanel({ onSimulate }) {
  const [metrics, setMetrics] = useState({ errorRate: 2, responseTime: 450, throughput: 85 });
  const [score, setScore] = useState(null);

  const calculateScore = () => {
    let s = 0;
    if (metrics?.errorRate > 5) s += 40;
    else if (metrics?.errorRate > 2) s += 20;
    if (metrics?.responseTime > 1000) s += 35;
    else if (metrics?.responseTime > 500) s += 15;
    if (metrics?.throughput < 10) s += 25;
    else if (metrics?.throughput < 50) s += 10;
    setScore(s);
    onSimulate(metrics);
  };

  const getScoreColor = (s) => {
    if (s >= 70) return 'text-red-400';
    if (s >= 40) return 'text-orange-400';
    if (s >= 20) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-purple-400" />
        Anomaly Scoring Engine
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Error Rate (%)</label>
          <input
            type="number" step="0.1"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            value={metrics?.errorRate}
            onChange={e => setMetrics(p => ({ ...p, errorRate: parseFloat(e?.target?.value) }))}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Response Time (ms)</label>
          <input
            type="number"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            value={metrics?.responseTime}
            onChange={e => setMetrics(p => ({ ...p, responseTime: parseInt(e?.target?.value) }))}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Throughput (req/s)</label>
          <input
            type="number"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            value={metrics?.throughput}
            onChange={e => setMetrics(p => ({ ...p, throughput: parseInt(e?.target?.value) }))}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={calculateScore}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-sm font-medium"
        >
          Calculate Anomaly Score
        </button>
        {score !== null && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Score:</span>
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}/100</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              score >= 70 ? 'bg-red-900 text-red-300' :
              score >= 40 ? 'bg-orange-900 text-orange-300' :
              score >= 20 ? 'bg-yellow-900 text-yellow-300': 'bg-green-900 text-green-300'
            }`}>
              {score >= 70 ? 'Critical' : score >= 40 ? 'High' : score >= 20 ? 'Medium' : 'Healthy'}
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-400">
          <span className="text-blue-400 font-medium">Telnyx SMS</span> alerts are triggered automatically when anomaly score &gt; 40 or performance degrades &gt;30%. 
          On-call contacts receive escalating notifications based on priority order.
        </p>
      </div>
    </div>
  );
}

export default function CarouselHealthAlertingSMSNotificationCenter() {
  const [incidents, setIncidents] = useState([]);
  const [alertRules, setAlertRules] = useState([]);
  const [onCallContacts, setOnCallContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incidents');
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [incidentsResult, rulesResult, contactsResult] = await Promise.all([
        carouselHealthAlertingService?.getActiveIncidents(),
        carouselHealthAlertingService?.getAlertRules(),
        carouselHealthAlertingService?.getOnCallContacts()
      ]);
      if (incidentsResult?.data) setIncidents(incidentsResult?.data);
      if (rulesResult?.data) setAlertRules(rulesResult?.data);
      if (contactsResult?.data) setOnCallContacts(contactsResult?.data);
    } catch (err) {
      setError('Failed to load alerting data');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (incidentId) => {
    const result = await carouselHealthAlertingService?.resolveIncident(incidentId, 'Resolved via dashboard');
    if (!result?.error) {
      setIncidents(prev => prev?.filter(i => i?.id !== incidentId));
      setSuccessMsg('Incident resolved');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleEscalate = async (incidentId) => {
    const result = await carouselHealthAlertingService?.escalateIncident(incidentId);
    if (!result?.error) {
      setIncidents(prev => prev?.map(i => i?.id === incidentId ? result?.data : i));
      setSuccessMsg('Incident escalated and Telnyx SMS sent to on-call contacts');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleSaveRule = async (ruleData) => {
    const result = await carouselHealthAlertingService?.createAlertRule(ruleData);
    if (!result?.error) {
      setAlertRules(prev => [result?.data, ...prev]);
      setShowRuleForm(false);
      setSuccessMsg('Alert rule created');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setError(result?.error?.message);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    const result = await carouselHealthAlertingService?.deleteAlertRule(ruleId);
    if (!result?.error) {
      setAlertRules(prev => prev?.filter(r => r?.id !== ruleId));
    }
  };

  const handleSaveContact = async (contactData) => {
    const result = await carouselHealthAlertingService?.addOnCallContact(contactData);
    if (!result?.error) {
      setOnCallContacts(prev => [...prev, result?.data]);
      setShowContactForm(false);
      setSuccessMsg('On-call contact added');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setError(result?.error?.message);
    }
  };

  const handleSimulateAnomaly = async (metrics) => {
    await carouselHealthAlertingService?.detectAnomalies('horizontal', metrics);
  };

  const tabs = [
    { id: 'incidents', label: 'Active Incidents', count: incidents?.length },
    { id: 'rules', label: 'Alert Rules', count: alertRules?.length },
    { id: 'oncall', label: 'On-Call Rotation', count: onCallContacts?.length },
    { id: 'anomaly', label: 'Anomaly Scoring' }
  ];

  const criticalCount = incidents?.filter(i => i?.severity === 'critical')?.length;
  const highCount = incidents?.filter(i => i?.severity === 'high')?.length;

  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>Carousel Health Alerting & SMS Notification Center</title>
      </Helmet>
      <HeaderNavigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-900 rounded-lg">
              <Bell className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Carousel Health Alerting & SMS Notification Center</h1>
              <p className="text-gray-400 text-sm">Telnyx SMS integration · Performance degradation alerts · On-call escalation workflows</p>
            </div>
          </div>
        </div>

        {/* Telnyx Status Banner */}
        <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <div>
              <span className="text-white text-sm font-medium">Telnyx SMS Provider Active</span>
              <span className="text-gray-400 text-xs ml-2">Primary · {import.meta.env?.VITE_TELNYX_PHONE_NUMBER}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-red-400">
              <AlertTriangle className="w-3 h-3" />
              <span>{criticalCount} Critical</span>
            </div>
            <div className="flex items-center gap-1 text-orange-400">
              <AlertCircle className="w-3 h-3" />
              <span>{highCount} High</span>
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-3 h-3" />
              <span>{onCallContacts?.length} On-Call</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg flex items-center gap-2 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg flex items-center gap-2 text-green-300 text-sm">
            <Check className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                activeTab === tab?.id
                  ? 'bg-gray-800 text-white border border-b-0 border-gray-700' :'text-gray-400 hover:text-white'
              }`}
            >
              {tab?.label}
              {tab?.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  tab?.count > 0 ? 'bg-red-800 text-red-200' : 'bg-gray-700 text-gray-400'
                }`}>{tab?.count}</span>
              )}
            </button>
          ))}
          <button
            onClick={loadData}
            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-white px-3 py-1"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'incidents' && (
              <div className="space-y-4">
                {incidents?.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                    <p className="text-lg font-medium text-gray-400">All Systems Healthy</p>
                    <p className="text-sm">No active incidents detected</p>
                  </div>
                ) : (
                  incidents?.map(incident => (
                    <IncidentCard
                      key={incident?.id}
                      incident={incident}
                      onResolve={handleResolve}
                      onEscalate={handleEscalate}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400 text-sm">{alertRules?.length} active rules configured</p>
                  <button
                    onClick={() => setShowRuleForm(!showRuleForm)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Rule
                  </button>
                </div>
                {showRuleForm && (
                  <AlertRuleForm onSave={handleSaveRule} onCancel={() => setShowRuleForm(false)} />
                )}
                <div className="space-y-3">
                  {alertRules?.map(rule => {
                    const sev = SEVERITY_CONFIG?.[rule?.severity] || SEVERITY_CONFIG?.low;
                    return (
                      <div key={rule?.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded ${sev?.badge}`}>
                            <Activity className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{rule?.ruleName}</div>
                            <div className="text-gray-400 text-xs">
                              {rule?.carouselType} · {rule?.ruleType?.replace(/_/g, ' ')} · 
                              threshold {rule?.thresholdOperator} {rule?.thresholdValue}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sev?.badge}`}>
                            {rule?.severity?.toUpperCase()}
                          </span>
                          <button
                            onClick={() => handleDeleteRule(rule?.id)}
                            className="text-gray-500 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'oncall' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400 text-sm">{onCallContacts?.length} contacts in rotation</p>
                  <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Contact
                  </button>
                </div>
                {showContactForm && (
                  <OnCallContactForm onSave={handleSaveContact} onCancel={() => setShowContactForm(false)} />
                )}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-4">
                  <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    Escalation Workflow (Telnyx SMS)
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                    <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded">Incident Detected</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="px-2 py-1 bg-purple-900 text-purple-300 rounded">Anomaly Score Calculated</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="px-2 py-1 bg-orange-900 text-orange-300 rounded">Telnyx SMS → Priority 1</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="px-2 py-1 bg-red-900 text-red-300 rounded">Escalate → Priority 2+</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="px-2 py-1 bg-green-900 text-green-300 rounded">Resolved</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {onCallContacts?.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      <Users className="w-10 h-10 mx-auto mb-2" />
                      <p>No on-call contacts configured</p>
                    </div>
                  ) : (
                    onCallContacts?.map((contact, i) => (
                      <div key={contact?.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-blue-300 font-bold text-sm">
                            {contact?.priority}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{contact?.name}</div>
                            <div className="text-gray-400 text-xs flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {contact?.phoneNumber}
                              {contact?.email && <span>· {contact?.email}</span>}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-900 text-green-300">Active</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'anomaly' && (
              <AnomalyScoringPanel onSimulate={handleSimulateAnomaly} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
