import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { taxComplianceService } from '../../services/taxComplianceService';
import { multiCurrencyPayoutService } from '../../services/multiCurrencyPayoutService';
import { localizationService } from '../../services/localizationService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import i18n from '../../lib/i18n';
import toast from 'react-hot-toast';
import { Download, Globe, FileText, CheckCircle, MapPin, LayoutDashboard, HelpCircle, AlertTriangle, Bell, Award, Shield, FileCheck, Check, Search, Filter, Loader2, Languages, ChevronRight } from 'lucide-react';

const useTranslation = () => ({ t: i18n?.t?.bind(i18n), i18n });

const LocalizationTaxReportingIntelligenceCenter = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedLanguage, setSelectedLanguage] = useState(i18n?.language || 'en-US');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [taxYear, setTaxYear] = useState(new Date()?.getFullYear());

  const [dashboardData, setDashboardData] = useState({
    complianceStats: null,
    taxDocuments: [],
    expiringDocuments: [],
    renewalReminders: [],
    payoutStats: null,
    jurisdictionRequirements: []
  });

  useEffect(() => {
    loadDashboardData();
    analytics?.trackEvent('localization_tax_reporting_viewed', {
      language: selectedLanguage,
      country: selectedCountry
    });

    const interval = setInterval(() => {
      refreshData();
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedCountry, taxYear]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [complianceResult, documentsResult, expiringResult, remindersResult, payoutStatsResult, jurisdictionResult] = await Promise.all([
        taxComplianceService?.getComplianceStatistics(),
        taxComplianceService?.getCreatorTaxDocuments(null, { taxYear }),
        taxComplianceService?.getExpiringDocuments(30),
        taxComplianceService?.getRenewalReminders(),
        multiCurrencyPayoutService?.getPayoutStatistics({ startDate: `${taxYear}-01-01`, endDate: `${taxYear}-12-31` }),
        taxComplianceService?.getJurisdictionRequirements(selectedCountry)
      ]);

      setDashboardData({
        complianceStats: complianceResult?.data,
        taxDocuments: documentsResult?.data || [],
        expiringDocuments: expiringResult?.data || [],
        renewalReminders: remindersResult?.data || [],
        payoutStats: payoutStatsResult?.data,
        jurisdictionRequirements: jurisdictionResult?.data || []
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast?.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLanguageChange = async (languageCode) => {
    try {
      await localizationService?.changeLanguage(languageCode);
      setSelectedLanguage(languageCode);
      toast?.success(`Language changed to ${languageCode}`);
      analytics?.trackEvent('language_changed', { language: languageCode });
    } catch (error) {
      toast?.error('Failed to change language');
    }
  };

  const handleGenerateTaxDocument = async (formType) => {
    try {
      const result = await taxComplianceService?.generateTaxDocument(
        null,
        formType,
        selectedCountry,
        taxYear
      );

      if (result?.data) {
        toast?.success('Tax document generated successfully');
        await loadDashboardData();
      } else {
        toast?.error(result?.error?.message || 'Failed to generate tax document');
      }
    } catch (error) {
      toast?.error('Error generating tax document');
    }
  };

  const handleGenerateAnnualReport = async () => {
    try {
      const result = await taxComplianceService?.generateAnnualTaxReport(
        null,
        taxYear,
        selectedCountry
      );

      if (result?.data) {
        toast?.success('Annual tax report generated successfully');
      } else {
        toast?.error(result?.error?.message || 'Failed to generate annual report');
      }
    } catch (error) {
      toast?.error('Error generating annual report');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'multi-language', label: 'Language Compliance', icon: Globe },
    { id: 'tax-generation', label: 'Tax Reporting', icon: FileText },
    { id: 'filing-assistance', label: 'Filing Center', icon: HelpCircle },
    { id: 'regional-docs', label: 'Regional Docs', icon: MapPin },
    { id: 'compliance-tracking', label: 'Compliance', icon: CheckCircle }
  ];

  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr-FR', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' }
  ];

  const countries = [
    { code: 'US', name: 'United States', taxForms: ['1099-MISC', '1099-NEC', 'W9'] },
    { code: 'GB', name: 'United Kingdom', taxForms: ['VAT Return', 'Self Assessment'] },
    { code: 'IN', name: 'India', taxForms: ['GST Return', 'Income Tax'] },
    { code: 'DE', name: 'Germany', taxForms: ['Einkommensteuererklärung', 'VAT'] },
    { code: 'CA', name: 'Canada', taxForms: ['T4A', 'GST/HST'] },
    { code: 'AU', name: 'Australia', taxForms: ['Payment Summary', 'BAS'] },
    { code: 'NG', name: 'Nigeria', taxForms: ['Income Tax', 'VAT'] },
    { code: 'FR', name: 'France', taxForms: ['Déclaration de revenus', 'TVA'] }
  ];

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tax Documents', value: dashboardData?.complianceStats?.totalDocuments || 0, icon: FileText, detail: `${dashboardData?.complianceStats?.generatedDocuments || 0} this year`, color: 'primary' },
          { label: 'Compliance Rate', value: `${dashboardData?.complianceStats?.averageCompletionRate?.toFixed(1) || 0}%`, icon: CheckCircle, detail: `${dashboardData?.complianceStats?.completedChecklists || 0} completed`, color: 'success' },
          { label: 'Expiring Soon', value: dashboardData?.expiringDocuments?.length || 0, icon: AlertTriangle, detail: 'Next 30 days', color: 'warning' },
          { label: 'Languages', value: '61', icon: Globe, detail: 'Full localization', color: 'secondary' }
        ].map((metric, i) => (
          <div key={i} className="premium-glass bg-card/40 p-5 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-${metric.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon size={24} className={`text-${metric.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{metric.label}</p>
                <p className="text-2xl font-bold text-foreground font-data">{metric.value}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-border/30">
              <span className="text-xs text-muted-foreground">{metric.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 premium-glass bg-card/40 rounded-2xl border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/30 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground">Recent Tax Documents</h3>
              <p className="text-sm text-muted-foreground">Monitor automated document generation</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">
              <Search size={14} className="mr-2" />
              Search Docs
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Form Type</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Year/Country</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.taxDocuments?.slice(0, 5)?.map((doc) => (
                  <tr key={doc?.id} className="border-b border-border/20 hover:bg-primary/5 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText size={16} className="text-primary" />
                        </div>
                        <span className="font-semibold text-foreground">{doc?.formType?.replace(/_/g, '-')}</span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-6">
                      <p className="text-sm font-bold text-foreground">{doc?.taxYear}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{doc?.countryCode}</p>
                    </td>
                    <td className="text-right py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        doc?.documentStatus === 'generated' ? 'bg-success/10 text-success border border-success/20' :
                        doc?.documentStatus === 'submitted' ? 'bg-primary/10 text-primary border border-primary/20' :
                        doc?.documentStatus === 'expired' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-muted/30 text-muted-foreground'
                      }`}>
                        {doc?.documentStatus}
                      </span>
                    </td>
                    <td className="text-right py-4 px-6">
                      <button className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-glass bg-card/40 p-6 rounded-2xl border border-border/50">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" />
              Expiring Documents
            </h3>
            <div className="space-y-3">
              {dashboardData?.expiringDocuments?.length > 0 ? (
                dashboardData?.expiringDocuments?.slice(0, 3)?.map((doc) => (
                  <div key={doc?.id} className="p-4 bg-background/40 rounded-xl border border-border/30 group hover:border-warning/50 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-foreground">{doc?.documentName}</span>
                      <span className="text-[10px] text-destructive font-bold uppercase tracking-widest">
                        {new Date(doc?.expirationDate)?.toLocaleDateString()}
                      </span>
                    </div>
                    <Button size="sm" className="w-full bg-warning/10 text-warning border-warning/20 hover:bg-warning hover:text-white rounded-lg text-[10px] font-bold">
                      RENEW DOCUMENT
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-background/20 rounded-xl border border-dashed border-border/50">
                  <p className="text-sm text-muted-foreground italic">No immediate expirations</p>
                </div>
              )}
            </div>
          </div>

          <div className="premium-glass bg-primary/10 p-6 rounded-2xl border border-primary/20">
            <h3 className="text-lg font-bold text-primary mb-2">Multi-Lang Engine</h3>
            <p className="text-xs text-primary/70 mb-4 leading-relaxed">System is currently operating with 61 active locale compliance overlays.</p>
            <div className="flex -space-x-2">
              {supportedLanguages.slice(0, 6).map((lang, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-foreground">
                  {lang.code.split('-')[0].toUpperCase()}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                +55
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMultiLanguageCompliance = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="premium-glass bg-card/40 p-6 rounded-2xl border border-border/50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-foreground">Compliance Locale Selector</h3>
            <p className="text-sm text-muted-foreground">Select a region to preview localized compliance messaging</p>
          </div>
          <Languages className="text-primary opacity-50" size={24} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {supportedLanguages?.map((lang) => (
            <button
              key={lang?.code}
              onClick={() => handleLanguageChange(lang?.code)}
              className={`p-4 rounded-2xl border transition-all duration-300 group text-left ${
                selectedLanguage === lang?.code
                  ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'bg-background/40 border-border/50 hover:border-primary/50'
              }`}
            >
              <p className={`font-bold transition-colors ${selectedLanguage === lang?.code ? 'text-white' : 'text-foreground'}`}>{lang?.nativeName}</p>
              <p className={`text-xs transition-colors ${selectedLanguage === lang?.code ? 'text-white/70' : 'text-muted-foreground'}`}>{lang?.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="premium-glass bg-blue-500/5 p-8 rounded-3xl border border-blue-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Bell size={120} />
          </div>
          <h4 className="text-lg font-bold text-blue-500 mb-4 flex items-center gap-2">
            <Bell size={20} />
            Filing Deadline Alert
          </h4>
          <p className="text-sm text-blue-900/80 leading-relaxed font-medium">
            {t('tax_filing_deadline_message', 'Your tax filing deadline is approaching. Please ensure all documents are submitted on time.')}
          </p>
        </div>
        <div className="premium-glass bg-success/5 p-8 rounded-3xl border border-success/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <CheckCircle size={120} />
          </div>
          <h4 className="text-lg font-bold text-success mb-4 flex items-center gap-2">
            <CheckCircle size={20} />
            Compliance Status
          </h4>
          <p className="text-sm text-success-900/80 leading-relaxed font-medium">
            {t('compliance_status_message', 'You are currently compliant with all tax requirements in your jurisdiction.')}
          </p>
        </div>
      </div>
    </div>
  );

  const renderTaxGeneration = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="premium-glass bg-card/40 p-8 rounded-2xl border border-border/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-xl font-bold text-foreground">Generation Parameters</h3>
            <p className="text-sm text-muted-foreground">Define jurisdiction and period for tax reporting</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Region</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e?.target?.value)}
                className="bg-background/60 border border-border/50 rounded-xl px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 min-w-[180px]"
              >
                {countries?.map((country) => (
                  <option key={country?.code} value={country?.code}>{country?.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Fiscal Year</label>
              <select
                value={taxYear}
                onChange={(e) => setTaxYear(parseInt(e?.target?.value))}
                className="bg-background/60 border border-border/50 rounded-xl px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 min-w-[120px]"
              >
                {[2025, 2024, 2023, 2022]?.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries?.find(c => c?.code === selectedCountry)?.taxForms?.map((form) => (
            <div key={form} className="premium-glass bg-background/40 p-6 rounded-2xl border border-border/50 group hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <FileText size={20} />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">{form}</h4>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Official automated generation for {selectedCountry} fiscal protocols in {taxYear}.</p>
              </div>
              <Button
                onClick={() => handleGenerateTaxDocument(form?.replace(/[\s-]/g, '_')?.toUpperCase())}
                variant="primary"
                size="sm"
                className="w-full rounded-xl"
              >
                GENERATE NOW
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="premium-glass bg-gradient-to-br from-primary/10 to-secondary/10 p-10 rounded-3xl border border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-700" />
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full border border-primary/30 mb-6">
              <Award size={14} className="text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Enterprise Feature</span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Comprehensive Annual Tax Intelligence</h3>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              Generate a unified fiscal report for {taxYear} integrating system-wide earnings, cross-border withholding calculations, and multi-currency payout reconciliation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Withholding Math Verification',
                'Multi-Currency Payout Ledger',
                'Jurisdiction Protocol Mapping',
                'Digital Certification Tokens'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-sm font-medium text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-card border border-border flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <Download size={40} className="text-primary" />
            </div>
            <Button
              onClick={handleGenerateAnnualReport}
              variant="primary"
              size="lg"
              className="px-8 rounded-2xl shadow-xl shadow-primary/30"
            >
              GENUAL REPORT
            </Button>
            <p className="text-[10px] text-muted-foreground mt-4 font-bold tracking-widest">EST. TIME: 45 SECONDS</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFilingAssistance = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="premium-glass bg-card/40 p-8 rounded-3xl border border-border/50 group hover:shadow-lg transition-all">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <FileText size={28} />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-2">Populated Submission Forms</h4>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Direct access to pre-encrypted tax forms, mapped to {selectedCountry} regulatory schemas for the {taxYear} fiscal period.
          </p>
          <Button variant="outline" className="w-full rounded-2xl py-6 font-bold tracking-widest text-xs border-border/50 hover:bg-primary hover:text-white transition-all">
            ACCESS FORM LIBRARY
          </Button>
        </div>

        <div className="premium-glass bg-card/40 p-8 rounded-3xl border border-border/50 group hover:shadow-lg transition-all">
          <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center text-success mb-6 group-hover:scale-110 transition-transform">
            <HelpCircle size={28} />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-2">Protocol Filing Guide</h4>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Interactive, step-by-step intelligence for executing tax submissions within high-compliance jurisdictions.
          </p>
          <Button variant="outline" className="w-full rounded-2xl py-6 font-bold tracking-widest text-xs border-border/50 hover:bg-success hover:text-white transition-all">
            START PROTOCOL GUIDE
          </Button>
        </div>
      </div>

      <div className="premium-glass bg-card/40 rounded-2xl border border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border/30">
          <h3 className="text-xl font-bold text-foreground">Jurisdiction Filing Windows</h3>
          <p className="text-sm text-muted-foreground">Critical deadlines for current operating regions</p>
        </div>
        <div className="p-4 space-y-3">
          {dashboardData?.jurisdictionRequirements?.map((req) => (
            <div key={req?.id} className="flex items-center justify-between p-5 bg-background/40 rounded-2xl border border-border/30 hover:border-primary/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                  <MapPin size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{req?.requirementName}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                    {req?.countryCode} • {req?.filingFrequency} Protocol
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  req?.deliveryStatus === 'sent' ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'
                }`}>
                  {req?.deliveryStatus}
                </span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRegionalDocumentation = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="premium-glass bg-card/40 p-8 rounded-3xl border border-border/50 text-center max-w-3xl mx-auto mb-10">
        <h3 className="text-2xl font-bold text-foreground mb-4">Official Documentation Engine</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Generate sovereign-compliant tax certificates, verified earnings letters, and digital attestations with integrated secure hash signatures for global verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Tax Certificates', desc: 'Jurisdiction-compliant withholding certificates with official seal.', icon: Award, color: 'blue' },
          { title: 'Earnings Verification', desc: 'Bank-grade statements for financial verification and mortgages.', icon: FileCheck, color: 'green' },
          { title: 'Compliance Attestations', desc: 'Secure digital proof of tax standing and profile health.', icon: Shield, color: 'purple' }
        ].map((doc, i) => (
          <div key={i} className="premium-glass bg-card/40 p-8 rounded-3xl border border-border/50 hover:shadow-2xl hover:shadow-primary/5 transition-all group flex flex-col justify-between">
            <div>
              <div className={`w-14 h-14 rounded-2xl bg-${doc.color}-500/10 flex items-center justify-center text-${doc.color}-500 mb-6 group-hover:scale-110 transition-transform`}>
                <doc.icon size={28} />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">{doc.title}</h4>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{doc.desc}</p>
            </div>
            <Button variant="outline" className="w-full rounded-2xl font-bold tracking-widest text-[10px] border-border/50 group-hover:bg-foreground group-hover:text-background transition-all">
              INITIALIZE GENERATION
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderComplianceTracking = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="premium-glass bg-card/40 p-8 rounded-3xl border border-border/50 overflow-hidden">
        <h3 className="text-xl font-bold text-foreground mb-8">System Compliance Pulse</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'System Checklists', value: dashboardData?.complianceStats?.totalChecklists || 0, color: 'primary', icon: Filter },
            { label: 'Completed Flows', value: dashboardData?.complianceStats?.completedChecklists || 0, color: 'success', icon: CheckCircle },
            { label: 'Active Tasks', value: dashboardData?.complianceStats?.inProgressChecklists || 0, color: 'warning', icon: Activity }
          ].map((stat, i) => (
            <div key={i} className="relative group">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="flex items-end gap-3">
                <p className={`text-5xl font-black text-${stat.color} font-data`}>{stat.value}</p>
                <div className={`mb-2 p-1.5 rounded-lg bg-${stat.color}/10 text-${stat.color}`}>
                  <stat.icon size={16} />
                </div>
              </div>
              <div className={`mt-6 h-2 w-full bg-${stat.color}/10 rounded-full overflow-hidden`}>
                <div 
                  className={`h-full bg-${stat.color} rounded-full transition-all duration-1000 delay-300`} 
                  style={{ width: `${(stat.value / (dashboardData?.complianceStats?.totalChecklists || 1)) * 100}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="premium-glass bg-card/40 rounded-3xl border border-border/50 overflow-hidden">
        <div className="p-8 border-b border-border/30 flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">Compliance Notifications</h3>
          <Bell className="text-warning opacity-50" size={20} />
        </div>
        <div className="p-6 space-y-4">
          {dashboardData?.renewalReminders?.slice(0, 5)?.map((reminder) => (
            <div key={reminder?.id} className="flex items-center justify-between p-5 bg-background/40 rounded-2xl border border-border/30 hover:border-warning/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Bell size={20} className="text-warning" />
                </div>
                <div>
                  <p className="font-bold text-foreground uppercase tracking-tight">{reminder?.reminderType?.replace(/_/g, ' ')}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                    Scheduled: {new Date(reminder?.reminderDate)?.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                reminder?.deliveryStatus === 'sent' ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'
              }`}>
                {reminder?.deliveryStatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'multi-language': return renderMultiLanguageCompliance();
      case 'tax-generation': return renderTaxGeneration();
      case 'filing-assistance': return renderFilingAssistance();
      case 'regional-docs': return renderRegionalDocumentation();
      case 'compliance-tracking': return renderComplianceTracking();
      default: return renderDashboard();
    }
  };

  return (
    <GeneralPageLayout title="Tax Intelligence" showSidebar={true}>
      <Helmet>
        <title>Localization & Tax Reporting Intelligence Center | Vottery</title>
        <meta name="description" content="Comprehensive multi-language compliance messaging and automated tax reporting" />
      </Helmet>

      <div className="w-full py-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Localization & Tax Intelligence
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Multi-language compliance messaging and automated tax reporting across 61 regions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Last Update</p>
                <p className="text-xs font-bold text-foreground">{lastUpdated?.toLocaleTimeString()}</p>
              </div>
              <Button
                onClick={refreshData}
                variant="outline"
                className="rounded-xl border-border/50 bg-card/40 backdrop-blur-md"
                disabled={refreshing}
              >
                <Icon name={refreshing ? 'Loader' : 'RefreshCw'} className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Syncing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-10 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-2xl w-fit border border-border/50">
            {tabs?.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab?.id;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'bg-card text-foreground shadow-lg shadow-black/5 border border-border/50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <IconComp size={16} />
                  <span className="text-sm font-bold tracking-tight">{tab?.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-card/20 backdrop-blur-xl border border-border/50 rounded-3xl">
            <Loader2 size={48} className="animate-spin text-primary mb-6" />
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Aggregating Global Tax Data</p>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default LocalizationTaxReportingIntelligenceCenter;