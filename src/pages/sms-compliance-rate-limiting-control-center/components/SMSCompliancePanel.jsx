import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import { smsComplianceService } from '../../../services/smsComplianceService';

const SMSCompliancePanel = () => {
  const [optOutList, setOptOutList] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('opt-out');

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      setLoading(true);
      const [optOutResult, auditResult] = await Promise.all([
        smsComplianceService?.getOptOutList({ limit: 50 }),
        smsComplianceService?.getComplianceAudit({ limit: 50 })
      ]);
      setOptOutList(optOutResult?.data || []);
      setAuditTrail(auditResult?.data || []);
    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={32} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">GDPR Compliant</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                Yes
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Icon name="FileCheck" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">TCPA Compliant</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                Yes
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <Icon name="UserX" size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Opt-Out List</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                {optOutList?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('opt-out')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'opt-out' ?'bg-primary text-primary-foreground' :'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            Opt-Out List
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'audit' ?'bg-primary text-primary-foreground' :'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('retention')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'retention' ?'bg-primary text-primary-foreground' :'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            Retention Policy
          </button>
        </div>
      </div>

      {/* Opt-Out List */}
      {activeTab === 'opt-out' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Opt-Out List</h4>
            <Button iconName="Plus" size="sm">Add Number</Button>
          </div>
          {optOutList?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="UserX" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No opt-out numbers</p>
            </div>
          ) : (
            <div className="space-y-2">
              {optOutList?.map((item) => (
                <div key={item?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground font-mono">{item?.phoneNumber}</p>
                    <p className="text-sm text-muted-foreground">{item?.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs font-medium capitalize">
                      {item?.provider}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item?.addedAt)?.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Audit Trail */}
      {activeTab === 'audit' && (
        <div className="card">
          <h4 className="font-semibold text-foreground mb-4">Compliance Audit Trail</h4>
          {auditTrail?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No audit events</p>
            </div>
          ) : (
            <div className="space-y-2">
              {auditTrail?.map((event) => (
                <div key={event?.id} className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{event?.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event?.createdAt)?.toLocaleString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                    {event?.complianceType}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Retention Policy */}
      {activeTab === 'retention' && (
        <div className="card">
          <h4 className="font-semibold text-foreground mb-4">Message Retention Policy</h4>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Check" size={20} className="text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-300">Policy Compliant</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                Messages are retained for 90 days in compliance with GDPR/TCPA requirements
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Retention Period</span>
                <span className="text-sm font-medium text-foreground">90 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Auto-Deletion</span>
                <span className="text-sm font-medium text-foreground">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Backup Policy</span>
                <span className="text-sm font-medium text-foreground">30-day archive</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Guidelines */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Compliance Requirements</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>GDPR: User consent tracking and opt-out management</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>TCPA: Automated compliance reporting with audit trails</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Data retention: 90-day policy with automatic deletion</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSCompliancePanel;
