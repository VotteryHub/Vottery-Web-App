import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { FileText, Download, Mail, Calendar, BarChart2, CheckCircle, RefreshCw, Plus, Send } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';

const REPORT_TEMPLATES = [
  {
    id: 'rt1', name: 'Revenue Summary Report', type: 'revenue', formats: ['PDF', 'CSV'],
    metrics: ['Total Revenue', 'Zone Breakdown', 'Subscription Revenue', 'Ad Revenue', 'Creator Payouts'],
    description: 'Comprehensive revenue analytics with zone-by-zone breakdown and trend analysis',
  },
  {
    id: 'rt2', name: 'User Engagement Report', type: 'engagement', formats: ['PDF', 'CSV'],
    metrics: ['DAU/MAU', 'Session Duration', 'Voting Participation', 'Feature Adoption', 'Retention Rate'],
    description: 'User behavior analytics covering engagement funnels and retention metrics',
  },
  {
    id: 'rt3', name: 'Performance Metrics Report', type: 'performance', formats: ['PDF', 'CSV'],
    metrics: ['Avg Latency', 'Error Rate', 'Uptime', 'API Performance', 'Database Query Times'],
    description: 'System performance overview with SLA compliance and bottleneck identification',
  },
  {
    id: 'rt4', name: 'Executive Dashboard Report', type: 'executive', formats: ['PDF'],
    metrics: ['Revenue', 'User Growth', 'Platform Health', 'Fraud Stats', 'Compliance Status'],
    description: 'High-level executive summary combining all key platform metrics',
  },
];

const SCHEDULED_REPORTS = [
  { id: 'sr1', template: 'Revenue Summary Report', frequency: 'daily', time: '08:00 UTC', recipients: ['cfo@vottery.com', 'ceo@vottery.com'], format: 'PDF', lastSent: '2026-03-01 08:00', nextSend: '2026-03-02 08:00', status: 'active' },
  { id: 'sr2', template: 'User Engagement Report', frequency: 'weekly', time: 'Mon 09:00 UTC', recipients: ['product@vottery.com', 'growth@vottery.com'], format: 'CSV', lastSent: '2026-02-24 09:00', nextSend: '2026-03-03 09:00', status: 'active' },
  { id: 'sr3', template: 'Performance Metrics Report', frequency: 'weekly', time: 'Mon 07:00 UTC', recipients: ['engineering@vottery.com'], format: 'PDF', lastSent: '2026-02-24 07:00', nextSend: '2026-03-03 07:00', status: 'active' },
  { id: 'sr4', template: 'Executive Dashboard Report', frequency: 'monthly', time: '1st 06:00 UTC', recipients: ['board@vottery.com', 'ceo@vottery.com', 'cfo@vottery.com'], format: 'PDF', lastSent: '2026-02-01 06:00', nextSend: '2026-04-01 06:00', status: 'active' },
];

const DELIVERY_LOG = [
  { id: 'dl1', report: 'Revenue Summary Report', sent: '2026-03-01 08:00', recipients: 2, format: 'PDF', status: 'delivered', size: '2.4 MB' },
  { id: 'dl2', report: 'User Engagement Report', sent: '2026-02-24 09:00', recipients: 2, format: 'CSV', status: 'delivered', size: '1.1 MB' },
  { id: 'dl3', report: 'Performance Metrics Report', sent: '2026-02-24 07:00', recipients: 1, format: 'PDF', status: 'delivered', size: '3.2 MB' },
  { id: 'dl4', report: 'Executive Dashboard Report', sent: '2026-02-01 06:00', recipients: 3, format: 'PDF', status: 'delivered', size: '5.8 MB' },
];

const MOCK_REPORT_DATA = {
  revenue: { total: '$284,920', growth: '+18.4%', zones: [{ zone: 'Zone 1', rev: '$98,400' }, { zone: 'Zone 2', rev: '$72,100' }, { zone: 'Zone 3', rev: '$48,200' }] },
  engagement: { dau: '48,291', mau: '312,847', retention: '67.3%', votingParticipation: '84.2%' },
  performance: { avgLatency: '142ms', uptime: '99.94%', errorRate: '0.12%', apiP95: '380ms' },
};

export default function AnalyticsExportReportingHub() {
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [selectedFrequency, setSelectedFrequency] = useState('daily');
  const [dateRange, setDateRange] = useState('last_7_days');
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [scheduledReports, setScheduledReports] = useState(SCHEDULED_REPORTS);
  const [sendingReport, setSendingReport] = useState(null);
  const [newSchedule, setNewSchedule] = useState({ template: '', frequency: 'daily', recipients: '', format: 'PDF' });
  const [showNewSchedule, setShowNewSchedule] = useState(false);

  const generateReport = useCallback(async () => {
    if (!selectedTemplate) return;
    setGenerating(true);
    setGeneratedReport(null);
    await new Promise(r => setTimeout(r, 2000));
    const template = REPORT_TEMPLATES?.find(t => t?.id === selectedTemplate);
    setGeneratedReport({
      name: template?.name,
      format: selectedFormat,
      dateRange,
      generatedAt: new Date()?.toLocaleString(),
      size: `${(1.5 + Math.random() * 4)?.toFixed(1)} MB`,
      pages: Math.floor(8 + Math.random() * 20),
      data: MOCK_REPORT_DATA?.[template?.type] || MOCK_REPORT_DATA?.revenue,
      metrics: template?.metrics,
    });
    setGenerating(false);
  }, [selectedTemplate, selectedFormat, dateRange]);

  const sendReportNow = useCallback(async (scheduleId) => {
    setSendingReport(scheduleId);
    await new Promise(r => setTimeout(r, 1500));
    setScheduledReports(prev => prev?.map(s => s?.id === scheduleId ? { ...s, lastSent: new Date()?.toLocaleString() } : s));
    setSendingReport(null);
  }, []);

  const addSchedule = useCallback(() => {
    if (!newSchedule?.template || !newSchedule?.recipients) return;
    const schedule = {
      id: `sr${Date.now()}`,
      template: newSchedule?.template,
      frequency: newSchedule?.frequency,
      time: '09:00 UTC',
      recipients: newSchedule?.recipients?.split(',')?.map(r => r?.trim()),
      format: newSchedule?.format,
      lastSent: 'Never',
      nextSend: 'Scheduled',
      status: 'active',
    };
    setScheduledReports(prev => [...prev, schedule]);
    setNewSchedule({ template: '', frequency: 'daily', recipients: '', format: 'PDF' });
    setShowNewSchedule(false);
  }, [newSchedule]);

  const getFrequencyBadge = (freq) => {
    const colors = { daily: 'bg-blue-900/30 text-blue-300', weekly: 'bg-green-900/30 text-green-300', monthly: 'bg-purple-900/30 text-purple-300' };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors?.[freq] || 'bg-gray-700 text-gray-300'}`}>{freq?.toUpperCase()}</span>;
  };

  const tabs = [
    { id: 'generate', label: 'Generate Report', icon: FileText },
    { id: 'scheduled', label: 'Scheduled Delivery', icon: Calendar },
    { id: 'log', label: 'Delivery Log', icon: Mail },
  ];

  return (
    <>
      <Helmet>
        <title>Analytics Export & Reporting Hub - Vottery</title>
        <meta name="description" content="Automated PDF/CSV report generation (daily/weekly/monthly) for stakeholders covering revenue, user engagement, performance metrics with email delivery scheduling." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <BarChart2 className="w-7 h-7 text-teal-400" />
                  Analytics Export & Reporting Hub
                </h1>
                <p className="text-muted-foreground mt-1">PDF/CSV generation · Daily/Weekly/Monthly scheduling · Email delivery to stakeholders</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Report Templates', value: REPORT_TEMPLATES?.length, color: 'text-blue-400' },
              { label: 'Scheduled Reports', value: scheduledReports?.length, color: 'text-green-400' },
              { label: 'Delivered (30d)', value: DELIVERY_LOG?.length, color: 'text-teal-400' },
              { label: 'Total Recipients', value: [...new Set(scheduledReports.flatMap(s => s.recipients))]?.length, color: 'text-purple-400' },
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

          {activeTab === 'generate' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-4">Select Report Template</h3>
                  <div className="space-y-3">
                    {REPORT_TEMPLATES?.map(template => (
                      <div
                        key={template?.id}
                        onClick={() => setSelectedTemplate(template?.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTemplate === template?.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground text-sm">{template?.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{template?.description}</p>
                          </div>
                          <div className="flex gap-1">
                            {template?.formats?.map(f => (
                              <span key={f} className="px-1.5 py-0.5 bg-muted rounded text-xs text-muted-foreground">{f}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template?.metrics?.slice(0, 3)?.map(m => (
                            <span key={m} className="px-2 py-0.5 bg-muted/50 rounded text-xs text-muted-foreground">{m}</span>
                          ))}
                          {template?.metrics?.length > 3 && (
                            <span className="px-2 py-0.5 bg-muted/50 rounded text-xs text-muted-foreground">+{template?.metrics?.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-4">Export Options</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-2">Format</label>
                      <div className="flex gap-2">
                        {['PDF', 'CSV']?.map(f => (
                          <button
                            key={f}
                            onClick={() => setSelectedFormat(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedFormat === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-2">Date Range</label>
                      <select
                        value={dateRange}
                        onChange={e => setDateRange(e?.target?.value)}
                        className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="last_7_days">Last 7 Days</option>
                        <option value="last_30_days">Last 30 Days</option>
                        <option value="last_90_days">Last 90 Days</option>
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                        <option value="this_year">This Year</option>
                      </select>
                    </div>
                    <button
                      onClick={generateReport}
                      disabled={!selectedTemplate || generating}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-60"
                    >
                      <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                      {generating ? 'Generating Report...' : `Generate ${selectedFormat} Report`}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                {generatedReport ? (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h3 className="font-semibold text-foreground">Report Generated</h3>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg mb-4">
                      <p className="font-medium text-foreground">{generatedReport?.name}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                        <span>Format: <span className="text-foreground">{generatedReport?.format}</span></span>
                        <span>Size: <span className="text-foreground">{generatedReport?.size}</span></span>
                        <span>Pages: <span className="text-foreground">{generatedReport?.pages}</span></span>
                        <span>Generated: <span className="text-foreground">{generatedReport?.generatedAt}</span></span>
                      </div>
                    </div>

                    {/* Preview Data */}
                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-medium text-muted-foreground">REPORT PREVIEW</p>
                      {Object.entries(generatedReport?.data)?.map(([key, val]) => (
                        <div key={key} className="flex justify-between p-2 bg-muted/20 rounded text-sm">
                          <span className="text-muted-foreground capitalize">{key?.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-foreground font-medium">
                            {typeof val === 'object' ? JSON.stringify(val)?.substring(0, 30) + '...' : val}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                        <Download className="w-4 h-4" />
                        Download {generatedReport?.format}
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground">
                        <Mail className="w-4 h-4" />
                        Email Report
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-12 flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                      <p className="text-muted-foreground">Select a template and generate a report</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'scheduled' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowNewSchedule(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" />
                  Schedule Report
                </button>
              </div>
              {scheduledReports?.map(schedule => (
                <div key={schedule?.id} className="bg-card border border-border rounded-lg p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">{schedule?.template}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getFrequencyBadge(schedule?.frequency)}
                        <span className="text-xs text-muted-foreground">{schedule?.time}</span>
                        <span className="text-xs text-muted-foreground">· {schedule?.format}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => sendReportNow(schedule?.id)}
                      disabled={sendingReport === schedule?.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary/20 text-primary rounded text-xs font-medium hover:bg-primary/30 disabled:opacity-60"
                    >
                      <Send className={`w-3 h-3 ${sendingReport === schedule?.id ? 'animate-pulse' : ''}`} />
                      {sendingReport === schedule?.id ? 'Sending...' : 'Send Now'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(Array.isArray(schedule?.recipients) ? schedule?.recipients : [schedule?.recipients])?.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">{r}</span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Last sent: <span className="text-foreground">{schedule?.lastSent}</span></span>
                    <span>Next: <span className="text-foreground">{schedule?.nextSend}</span></span>
                  </div>
                </div>
              ))}

              {showNewSchedule && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
                    <h3 className="font-semibold text-foreground mb-4">Schedule New Report</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">Report Template</label>
                        <select
                          value={newSchedule?.template}
                          onChange={e => setNewSchedule(p => ({ ...p, template: e?.target?.value }))}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none"
                        >
                          <option value="">Select template...</option>
                          {REPORT_TEMPLATES?.map(t => <option key={t?.id} value={t?.name}>{t?.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">Frequency</label>
                        <select
                          value={newSchedule?.frequency}
                          onChange={e => setNewSchedule(p => ({ ...p, frequency: e?.target?.value }))}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">Recipients (comma-separated emails)</label>
                        <input
                          type="text"
                          value={newSchedule?.recipients}
                          onChange={e => setNewSchedule(p => ({ ...p, recipients: e?.target?.value }))}
                          placeholder="ceo@company.com, cfo@company.com"
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">Format</label>
                        <div className="flex gap-2">
                          {['PDF', 'CSV']?.map(f => (
                            <button key={f} onClick={() => setNewSchedule(p => ({ ...p, format: f }))}
                              className={`px-4 py-2 rounded text-sm font-medium ${
                                newSchedule?.format === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                              }`}>{f}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button onClick={() => setShowNewSchedule(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground">Cancel</button>
                      <button onClick={addSchedule} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Schedule</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'log' && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Email Delivery Log</h3>
              </div>
              <div className="divide-y divide-border">
                {DELIVERY_LOG?.map(log => (
                  <div key={log?.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{log?.report}</p>
                        <p className="text-xs text-muted-foreground">{log?.sent} · {log?.recipients} recipient{log?.recipients > 1 ? 's' : ''} · {log?.format} · {log?.size}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs bg-green-900/30 text-green-300">{log?.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
