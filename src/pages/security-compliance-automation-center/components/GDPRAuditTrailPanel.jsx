import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GDPRAuditTrailPanel = ({ auditTrail, onGenerate, loading }) => {
  const [generating, setGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [filterType, setFilterType] = useState('all');

  const handleGenerateAudit = async () => {
    setGenerating(true);
    await onGenerate?.({ period: selectedPeriod, type: filterType });
    setGenerating(false);
  };

  const mockAuditTrail = auditTrail?.length > 0 ? auditTrail : [
    {
      id: 1,
      timestamp: new Date()?.toISOString(),
      eventType: 'Data Access Request',
      userId: 'user_12345',
      action: 'User requested personal data export',
      dataCategory: 'Personal Information',
      legalBasis: 'Article 15 - Right of Access',
      status: 'Completed',
      processingTime: '2 hours',
      officer: 'Jane Smith',
      complianceScore: 100
    },
    {
      id: 2,
      timestamp: new Date(Date?.now() - 3600000)?.toISOString(),
      eventType: 'Data Deletion Request',
      userId: 'user_67890',
      action: 'User requested account and data deletion',
      dataCategory: 'All Personal Data',
      legalBasis: 'Article 17 - Right to Erasure',
      status: 'In Progress',
      processingTime: '24 hours remaining',
      officer: 'John Doe',
      complianceScore: 95
    },
    {
      id: 3,
      timestamp: new Date(Date?.now() - 7200000)?.toISOString(),
      eventType: 'Consent Management',
      userId: 'user_11111',
      action: 'User updated marketing consent preferences',
      dataCategory: 'Marketing Data',
      legalBasis: 'Article 7 - Consent',
      status: 'Completed',
      processingTime: 'Instant',
      officer: 'System Automated',
      complianceScore: 100
    },
    {
      id: 4,
      timestamp: new Date(Date?.now() - 10800000)?.toISOString(),
      eventType: 'Data Breach Notification',
      userId: 'system',
      action: 'Potential data breach detected and reported to DPA',
      dataCategory: 'Security Logs',
      legalBasis: 'Article 33 - Breach Notification',
      status: 'Reported',
      processingTime: '72 hours',
      officer: 'Security Team',
      complianceScore: 100
    },
    {
      id: 5,
      timestamp: new Date(Date?.now() - 14400000)?.toISOString(),
      eventType: 'Data Portability Request',
      userId: 'user_22222',
      action: 'User requested data in machine-readable format',
      dataCategory: 'User Activity Data',
      legalBasis: 'Article 20 - Data Portability',
      status: 'Completed',
      processingTime: '4 hours',
      officer: 'Jane Smith',
      complianceScore: 100
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50';
      case 'In Progress':
        return 'text-yellow-600 bg-yellow-50';
      case 'Reported':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getComplianceScoreColor = (score) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
        <div className="h-96 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <Icon name="Shield" size={24} className="text-blue-600" />
              GDPR Audit Trail Generation
            </h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive audit trail for GDPR compliance tracking and reporting
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="all">All Events</option>
              <option value="access">Data Access</option>
              <option value="deletion">Data Deletion</option>
              <option value="consent">Consent Management</option>
              <option value="breach">Breach Notifications</option>
            </select>
            <Button
              onClick={handleGenerateAudit}
              disabled={generating}
              className="flex items-center gap-2"
            >
              <Icon name={generating ? 'Loader2' : 'Download'} size={16} className={generating ? 'animate-spin' : ''} />
              {generating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600 font-medium">Total Events</span>
              <Icon name="Activity" size={20} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900">{mockAuditTrail?.length}</div>
            <div className="text-xs text-blue-600 mt-1">Last 30 days</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">Compliance Rate</span>
              <Icon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">98.5%</div>
            <div className="text-xs text-green-600 mt-1">+2.3% from last month</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yellow-600 font-medium">Pending Requests</span>
              <Icon name="Clock" size={20} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-900">3</div>
            <div className="text-xs text-yellow-600 mt-1">Avg. response: 4 hours</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-600 font-medium">Data Subjects</span>
              <Icon name="Users" size={20} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-900">1,247</div>
            <div className="text-xs text-purple-600 mt-1">Active users tracked</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Timestamp</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Event Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Action</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Legal Basis</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Officer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Compliance</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditTrail?.map((event) => (
                <tr key={event?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-foreground">
                    {new Date(event?.timestamp)?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-foreground">{event?.eventType}</span>
                    <div className="text-xs text-muted-foreground">{event?.dataCategory}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground max-w-xs truncate">
                    {event?.action}
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">
                    {event?.legalBasis}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event?.status)}`}>
                      {event?.status}
                    </span>
                    <div className="text-xs text-muted-foreground mt-1">{event?.processingTime}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {event?.officer}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-bold ${getComplianceScoreColor(event?.complianceScore)}`}>
                      {event?.complianceScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">GDPR Compliance Information</h4>
            <p className="text-xs text-blue-700">
              This audit trail tracks all data subject requests and processing activities in compliance with GDPR Articles 15-22. 
              All events are logged with timestamps, legal basis, and responsible officers for complete transparency and accountability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPRAuditTrailPanel;