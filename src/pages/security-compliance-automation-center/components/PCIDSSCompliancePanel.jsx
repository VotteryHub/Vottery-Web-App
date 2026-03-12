import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PCIDSSCompliancePanel = ({ status, loading }) => {
  const mockStatus = status || {
    overallCompliance: 96,
    lastAudit: new Date(Date?.now() - 86400000 * 15)?.toISOString(),
    nextAudit: new Date(Date?.now() + 86400000 * 75)?.toISOString(),
    requirements: [
      {
        id: 1,
        requirement: 'Install and maintain firewall configuration',
        category: 'Network Security',
        status: 'Compliant',
        lastChecked: new Date()?.toISOString(),
        evidence: 'Firewall rules reviewed and documented',
        score: 100
      },
      {
        id: 2,
        requirement: 'Do not use vendor-supplied defaults',
        category: 'Configuration Management',
        status: 'Compliant',
        lastChecked: new Date()?.toISOString(),
        evidence: 'All default passwords changed',
        score: 100
      },
      {
        id: 3,
        requirement: 'Protect stored cardholder data',
        category: 'Data Protection',
        status: 'Compliant',
        lastChecked: new Date()?.toISOString(),
        evidence: 'No card data stored (Stripe handles all)',
        score: 100
      },
      {
        id: 4,
        requirement: 'Encrypt transmission of cardholder data',
        category: 'Encryption',
        status: 'Compliant',
        lastChecked: new Date()?.toISOString(),
        evidence: 'TLS 1.3 enforced on all endpoints',
        score: 100
      },
      {
        id: 5,
        requirement: 'Protect systems against malware',
        category: 'Security Systems',
        status: 'Compliant',
        lastChecked: new Date()?.toISOString(),
        evidence: 'Anti-malware systems active and updated',
        score: 100
      },
      {
        id: 6,
        requirement: 'Develop secure systems and applications',
        category: 'Development',
        status: 'Partial',
        lastChecked: new Date()?.toISOString(),
        evidence: 'Security code review pending for 2 modules',
        score: 85
      },
      {
        id: 7,
        requirement: 'Restrict access by business need-to-know',
        category: 'Access Control',
        status: 'Compliant',
        lastChecked: new Date()?.toISOString(),
        evidence: 'Role-based access control implemented',
        score: 100
      },
      {
        id: 8,
        requirement: 'Identify and authenticate access',
        category: 'Authentication',
        status: 'Compliant',
        lastChecked: new Date()?.toISOString(),
        evidence: 'MFA enabled for all admin accounts',
        score: 100
      },
      {
        id: 9,
        requirement: 'Restrict physical access to cardholder data',
        category: 'Physical Security',
        status: 'N/A',
        lastChecked: new Date()?.toISOString(),
        evidence: 'Cloud-only infrastructure (AWS/Supabase)',
        score: 100
      },
      {
        id: 10,
        requirement: 'Track and monitor network access',
        category: 'Monitoring',
        status: 'Compliant',
        lastChecked: new Date()?.toISOString(),
        evidence: 'Comprehensive logging and monitoring active',
        score: 100
      },
      {
        id: 11,
        requirement: 'Test security systems regularly',
        category: 'Testing',
        status: 'Compliant',
        lastChecked: new Date()?.toISOString(),
        evidence: 'Quarterly vulnerability scans completed',
        score: 100
      },
      {
        id: 12,
        requirement: 'Maintain information security policy',
        category: 'Policy',
        status: 'Compliant',
        lastChecked: new Date()?.toISOString(),
        evidence: 'Security policy reviewed and approved',
        score: 100
      }
    ],
    vulnerabilities: [
      {
        id: 1,
        severity: 'Medium',
        description: 'Security code review pending for payment module',
        requirement: 'Requirement 6',
        remediation: 'Schedule security code review within 30 days',
        dueDate: new Date(Date?.now() + 86400000 * 30)?.toISOString()
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Compliant':
        return 'text-green-600 bg-green-50';
      case 'Partial':
        return 'text-yellow-600 bg-yellow-50';
      case 'N/A':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-red-600 bg-red-50';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-600 bg-red-50';
      case 'High':
        return 'text-orange-600 bg-orange-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <Icon name="CreditCard" size={24} className="text-blue-600" />
              PCI-DSS Compliance Status
            </h3>
            <p className="text-sm text-muted-foreground">
              Payment Card Industry Data Security Standard compliance tracking
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Icon name="Download" size={16} />
            Export Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">Overall Compliance</span>
              <Icon name="ShieldCheck" size={20} className="text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-900">{mockStatus?.overallCompliance}%</div>
            <div className="text-xs text-green-600 mt-1">12 of 12 requirements</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600 font-medium">Last Audit</span>
              <Icon name="Calendar" size={20} className="text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-900">
              {new Date(mockStatus?.lastAudit)?.toLocaleDateString()}
            </div>
            <div className="text-xs text-blue-600 mt-1">15 days ago</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-600 font-medium">Next Audit</span>
              <Icon name="Clock" size={20} className="text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-900">
              {new Date(mockStatus?.nextAudit)?.toLocaleDateString()}
            </div>
            <div className="text-xs text-purple-600 mt-1">75 days remaining</div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">12 PCI-DSS Requirements</h4>
          <div className="space-y-3">
            {mockStatus?.requirements?.map((req) => (
              <div key={req?.id} className="bg-muted/30 border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-foreground">Requirement {req?.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req?.status)}`}>
                        {req?.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{req?.category}</span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{req?.requirement}</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Evidence:</strong> {req?.evidence}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{req?.score}%</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(req?.lastChecked)?.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {mockStatus?.vulnerabilities?.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="AlertTriangle" size={20} className="text-yellow-600" />
              Outstanding Items
            </h4>
            <div className="space-y-3">
              {mockStatus?.vulnerabilities?.map((vuln) => (
                <div key={vuln?.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln?.severity)}`}>
                          {vuln?.severity}
                        </span>
                        <span className="text-xs text-muted-foreground">{vuln?.requirement}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-2">{vuln?.description}</p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Remediation:</strong> {vuln?.remediation}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Due Date</div>
                      <div className="text-sm font-semibold text-foreground">
                        {new Date(vuln?.dueDate)?.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">PCI-DSS Compliance Note</h4>
            <p className="text-xs text-blue-700">
              Vottery uses Stripe for all payment processing. No cardholder data is stored on our servers, significantly reducing PCI-DSS scope. 
              We maintain compliance with applicable requirements for service providers and maintain secure integration with Stripe's PCI-DSS Level 1 certified infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCIDSSCompliancePanel;