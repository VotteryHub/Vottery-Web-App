import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import { creatorComplianceService } from '../../services/creatorComplianceService';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const EnhancedCreatorComplianceDocumentationHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const [taxForms, setTaxForms] = useState([]);
  const [complianceChecklists, setComplianceChecklists] = useState([]);
  const [complianceDocuments, setComplianceDocuments] = useState([]);
  const [renewalReminders, setRenewalReminders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedTaxYear, setSelectedTaxYear] = useState(new Date()?.getFullYear());

  useEffect(() => {
    loadComplianceData();
    setupRealtimeSubscriptions();

    const interval = setInterval(() => {
      loadComplianceData();
    }, 60000); // Refresh every 60 seconds

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadComplianceData = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return;

      const [taxFormsResult, checklistsResult, documentsResult, remindersResult, analyticsResult] = await Promise.all([
        creatorComplianceService?.getCreatorTaxForms(user?.id),
        creatorComplianceService?.getAllComplianceChecklists(),
        creatorComplianceService?.getCreatorComplianceDocuments(user?.id),
        creatorComplianceService?.getDocumentRenewalReminders(user?.id),
        creatorComplianceService?.getComplianceAnalytics(user?.id)
      ]);

      if (taxFormsResult?.data) setTaxForms(taxFormsResult?.data);
      if (checklistsResult?.data) setComplianceChecklists(checklistsResult?.data);
      if (documentsResult?.data) setComplianceDocuments(documentsResult?.data);
      if (remindersResult?.data) setRenewalReminders(remindersResult?.data);
      if (analyticsResult?.data) setAnalytics(analyticsResult?.data);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading compliance data:', error);
      toast?.error('Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const subscription = supabase
      ?.channel('compliance-updates')
      ?.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'creator_tax_forms'
      }, () => {
        loadComplianceData();
      })
      ?.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'creator_compliance_documents'
      }, () => {
        loadComplianceData();
      })
      ?.subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  };

  const handleGenerateTaxForm = async () => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return;

      const formTypeMap = {
        'US': '1099-MISC',
        'GB': 'VAT',
        'IN': 'GST',
        'EU': 'VAT'
      };

      const formType = formTypeMap?.[selectedCountry] || '1099-MISC';

      const result = await creatorComplianceService?.generateTaxForm(
        user?.id,
        selectedCountry,
        selectedTaxYear,
        formType
      );

      if (result?.data) {
        toast?.success(`Tax form ${formType} generated successfully for ${selectedTaxYear}`);
        loadComplianceData();
      } else {
        toast?.error(result?.error?.message || 'Failed to generate tax form');
      }
    } catch (error) {
      console.error('Error generating tax form:', error);
      toast?.error('Failed to generate tax form');
    }
  };

  const handleUploadDocument = async (file, documentType) => {
    try {
      const documentData = {
        countryCode: selectedCountry,
        documentType,
        documentName: file?.name,
        issueDate: new Date()?.toISOString()?.split('T')?.[0],
        expirationDate: null // Will be set based on document type
      };

      const result = await creatorComplianceService?.uploadComplianceDocument(documentData, file);

      if (result?.data) {
        toast?.success('Document uploaded successfully');
        loadComplianceData();
      } else {
        toast?.error(result?.error?.message || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast?.error('Failed to upload document');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'tax-forms', label: 'Tax Form Generation', icon: 'FileText' },
    { id: 'checklists', label: 'Compliance Checklists', icon: 'CheckSquare' },
    { id: 'documents', label: 'Document Storage', icon: 'FolderOpen' },
    { id: 'expiration', label: 'Expiration Tracking', icon: 'Calendar' },
    { id: 'reminders', label: 'Renewal Reminders', icon: 'Bell' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl hover:bg-white/10 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Tax Forms</span>
            <Icon name="FileText" className="text-blue-500" size={20} />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{analytics?.taxForms?.total || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">All years</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl hover:bg-white/10 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compliance Documents</span>
            <Icon name="FolderOpen" className="text-green-500" size={20} />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{analytics?.documents?.total || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Uploaded & verified</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl hover:bg-white/10 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expiring Soon</span>
            <Icon name="AlertTriangle" className="text-orange-500" size={20} />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {analytics?.documents?.expiringIn30Days || 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl hover:bg-white/10 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Earnings</span>
            <Icon name="DollarSign" className="text-purple-500" size={20} />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            ${(analytics?.taxForms?.totalEarnings || 0)?.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Reported earnings</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl hover:bg-white/10 transition-all group">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tax Forms Status</h3>
          <div className="space-y-3">
            {Object.entries(analytics?.taxForms?.byStatus || {})?.map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground capitalize">{status?.replace('_', ' ')}</span>
                <span className="text-sm font-medium text-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl hover:bg-white/10 transition-all group">
          <h3 className="text-lg font-semibold text-foreground mb-4">Documents Status</h3>
          <div className="space-y-3">
            {Object.entries(analytics?.documents?.byStatus || {})?.map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground capitalize">{status}</span>
                <span className="text-sm font-medium text-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Reminders */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl hover:bg-white/10 transition-all group">
        <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Renewal Reminders</h3>
        {renewalReminders?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No upcoming reminders</p>
        ) : (
          <div className="space-y-3">
            {renewalReminders?.slice(0, 5)?.map((reminder) => (
              <div key={reminder?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="Bell" className="text-orange-500" size={20} />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {reminder?.document?.documentName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {reminder?.reminderType?.replace('_', ' ')} reminder
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {new Date(reminder?.scheduledFor)?.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderTaxForms = () => (
    <div className="space-y-6">
      {/* Tax Form Generator */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl hover:bg-white/10 transition-all group">
        <h3 className="text-lg font-semibold text-foreground mb-4">Automated Tax Form Generation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e?.target?.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
            >
              <option value="US">United States (1099-MISC)</option>
              <option value="GB">United Kingdom (VAT)</option>
              <option value="IN">India (GST)</option>
              <option value="EU">European Union (VAT)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tax Year</label>
            <select
              value={selectedTaxYear}
              onChange={(e) => setSelectedTaxYear(parseInt(e?.target?.value))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
            >
              {[2024, 2023, 2022, 2021]?.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleGenerateTaxForm} className="w-full">
              <Icon name="FileText" size={16} />
              Generate Tax Form
            </Button>
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Automatically generates tax forms using your earnings data with intelligent form population
        </p>
      </div>

      {/* Generated Tax Forms */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-black text-white uppercase tracking-tight">Generated Tax Forms</h3>
        </div>
        <div className="divide-y divide-white/5">
          {taxForms?.length === 0 ? (
            <div className="p-12 text-center">
              <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tax forms generated yet</p>
            </div>
          ) : (
            taxForms?.map((form) => (
              <div key={form?.id} className="p-8 hover:bg-white/5 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-black text-white uppercase tracking-widest text-[10px]">{form?.formType}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {form?.countryCode}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        form?.status === 'filed' ? 'bg-green-100 text-green-700' :
                        form?.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        form?.status === 'expired'? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {form?.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tax Year:</span>
                        <div className="font-black text-white uppercase tracking-widest text-xs">{form?.taxYear}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Earnings:</span>
                        <div className="font-black text-white uppercase tracking-widest text-xs">
                          ${parseFloat(form?.totalEarnings || 0)?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tax Withheld:</span>
                        <div className="font-black text-white uppercase tracking-widest text-xs">
                          ${parseFloat(form?.taxWithheld || 0)?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Generated:</span>
                        <div className="font-black text-white uppercase tracking-widest text-xs">
                          {new Date(form?.generationDate)?.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Icon name="Download" size={16} />
                    Download
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderComplianceChecklists = () => (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-black text-white uppercase tracking-tight">Jurisdiction-Specific Compliance Checklists</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Country-specific requirements with progress tracking
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complianceChecklists?.map((checklist) => (
            <div key={checklist?.id} className="bg-muted/30 rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-black text-white uppercase tracking-widest text-[10px]">{checklist?.countryName}</h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {checklist?.countryCode}
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Tax Registration', required: checklist?.taxRegistrationRequired },
                  { label: 'Business License', required: checklist?.businessLicenseRequired },
                  { label: 'Banking Documentation', required: checklist?.bankingDocsRequired },
                  { label: 'Identity Verification', required: checklist?.identityVerificationRequired }
                ]?.map((item) => (
                  <div key={item?.label} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{item?.label}</span>
                    {item?.required ? (
                      <Icon name="CheckCircle" className="text-green-500" size={18} />
                    ) : (
                      <Icon name="Circle" className="text-muted-foreground" size={18} />
                    )}
                  </div>
                ))}
              </div>
              {checklist?.complianceNotes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">{checklist?.complianceNotes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Document Storage</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Secure encrypted storage with version control and audit trails
            </p>
          </div>
          <Button>
            <Icon name="Upload" size={16} />
            Upload Document
          </Button>
        </div>
      </div>
      <div className="divide-y divide-white/5">
        {complianceDocuments?.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="FolderOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents uploaded yet</p>
          </div>
        ) : (
          complianceDocuments?.map((doc) => (
            <div key={doc?.id} className="p-8 hover:bg-white/5 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Icon name="FileText" className="text-blue-500 mt-1" size={20} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-white uppercase tracking-widest text-xs">{doc?.documentName}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doc?.status === 'approved' ? 'bg-green-100 text-green-700' :
                        doc?.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        doc?.status === 'expired'? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {doc?.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{doc?.documentType?.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{doc?.countryCode}</span>
                      {doc?.expirationDate && (
                        <>
                          <span>•</span>
                          <span>Expires: {new Date(doc?.expirationDate)?.toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Icon name="Eye" size={16} />
                  View
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderExpirationTracking = () => (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-black text-white uppercase tracking-tight">Document Expiration Tracking</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Automated monitoring with jurisdiction-specific deadlines
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {complianceDocuments
            ?.filter(doc => doc?.expirationDate)
            ?.sort((a, b) => new Date(a?.expirationDate) - new Date(b?.expirationDate))
            ?.map((doc) => {
              const daysUntilExpiry = Math.ceil(
                (new Date(doc?.expirationDate) - new Date()) / (1000 * 60 * 60 * 24)
              );
              const isExpired = daysUntilExpiry < 0;
              const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;

              return (
                <div
                  key={doc?.id}
                  className={`p-4 rounded-lg border ${
                    isExpired ? 'bg-red-50 border-red-200' : isExpiringSoon ?'bg-orange-50 border-orange-200': 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon
                        name={isExpired ? 'AlertCircle' : isExpiringSoon ? 'AlertTriangle' : 'CheckCircle'}
                        className={isExpired ? 'text-red-500' : isExpiringSoon ? 'text-orange-500' : 'text-green-500'}
                        size={20}
                      />
                      <div>
                        <h4 className="font-black text-white uppercase tracking-widest text-xs">{doc?.documentName}</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {isExpired ? 'Expired' : `Expires in ${daysUntilExpiry} days`} •{' '}
                          {new Date(doc?.expirationDate)?.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Icon name="RefreshCw" size={16} />
                      Renew
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  const renderRenewalReminders = () => (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-black text-white uppercase tracking-tight">Automated Renewal Reminders</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Proactive notifications with renewal workflow orchestration
        </p>
      </div>
      <div className="divide-y divide-white/5">
        {renewalReminders?.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No renewal reminders scheduled</p>
          </div>
        ) : (
          renewalReminders?.map((reminder) => (
            <div key={reminder?.id} className="p-8 hover:bg-white/5 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Icon name="Bell" className="text-orange-500 mt-1" size={20} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-white uppercase tracking-widest text-xs">
                        {reminder?.document?.documentName}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reminder?.status === 'sent' ? 'bg-green-100 text-green-700' :
                        reminder?.status === 'failed'? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {reminder?.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{reminder?.reminderType?.replace('_', ' ')} reminder</span>
                      <span>•</span>
                      <span>Scheduled: {new Date(reminder?.scheduledFor)?.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{reminder?.deliveryMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'tax-forms':
        return renderTaxForms();
      case 'checklists':
        return renderComplianceChecklists();
      case 'documents':
        return renderDocuments();
      case 'expiration':
        return renderExpirationTracking();
      case 'reminders':
        return renderRenewalReminders();
      default:
        return renderOverview();
    }
  };

  return (
    <GeneralPageLayout 
      title="Compliance Documentation Hub"
      showSidebar={true}
      maxWidth="max-w-[1400px]"
    >
      <div className="w-full py-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <p className="text-slate-400 font-medium text-sm">
              Automated tax orchestration and document lifecycle tracking
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Core Status Sync: {lastUpdated?.toLocaleTimeString()}
            </div>
            <button
              onClick={loadComplianceData}
              disabled={loading}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300"
            >
              <Icon name={loading ? 'Loader' : 'RefreshCw'} className={loading ? 'animate-spin' : ''} size={14} />
              Sync Data
            </button>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex flex-wrap gap-2 border-b border-white/5">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab?.id
                    ? 'text-primary border-b-2 border-primary' :'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon name={tab?.icon} size={14} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Syncing Compliance Records...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {renderTabContent()}
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default EnhancedCreatorComplianceDocumentationHub;