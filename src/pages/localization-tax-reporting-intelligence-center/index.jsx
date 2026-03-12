import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import AdminToolbar from '../../components/ui/AdminToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { taxComplianceService } from '../../services/taxComplianceService';
import { multiCurrencyPayoutService } from '../../services/multiCurrencyPayoutService';
import { localizationService } from '../../services/localizationService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import i18n from '../../lib/i18n';
import toast from 'react-hot-toast';

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
        // Trigger download or display
        console.log('Annual Report:', result?.data);
      } else {
        toast?.error(result?.error?.message || 'Failed to generate annual report');
      }
    } catch (error) {
      toast?.error('Error generating annual report');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Tax Reporting Dashboard', icon: 'LayoutDashboard' },
    { id: 'multi-language', label: 'Multi-Language Compliance', icon: 'Globe' },
    { id: 'tax-generation', label: 'Automated Tax Reports', icon: 'FileText' },
    { id: 'filing-assistance', label: 'Tax Filing Assistance', icon: 'HelpCircle' },
    { id: 'regional-docs', label: 'Regional Documentation', icon: 'MapPin' },
    { id: 'compliance-tracking', label: 'Compliance Tracking', icon: 'CheckCircle' }
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
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tax Documents</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData?.complianceStats?.totalDocuments || 0}
              </p>
            </div>
            <Icon name="FileText" className="w-12 h-12 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {dashboardData?.complianceStats?.generatedDocuments || 0} generated this year
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance Rate</p>
              <p className="text-3xl font-bold text-green-600">
                {dashboardData?.complianceStats?.averageCompletionRate?.toFixed(1) || 0}%
              </p>
            </div>
            <Icon name="CheckCircle" className="w-12 h-12 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {dashboardData?.complianceStats?.completedChecklists || 0} checklists completed
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Documents</p>
              <p className="text-3xl font-bold text-orange-600">
                {dashboardData?.expiringDocuments?.length || 0}
              </p>
            </div>
            <Icon name="AlertTriangle" className="w-12 h-12 text-orange-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Next 30 days</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Languages Supported</p>
              <p className="text-3xl font-bold text-purple-600">61</p>
            </div>
            <Icon name="Globe" className="w-12 h-12 text-purple-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Multi-language compliance</p>
        </div>
      </div>

      {/* Recent Tax Documents */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tax Documents</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData?.taxDocuments?.slice(0, 5)?.map((doc) => (
                <tr key={doc?.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doc?.formType?.replace(/_/g, '-')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc?.taxYear}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc?.countryCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      doc?.documentStatus === 'generated' ? 'bg-green-100 text-green-800' :
                      doc?.documentStatus === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      doc?.documentStatus === 'expired'? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {doc?.documentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc?.generatedAt)?.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button size="sm" variant="outline">
                      <Icon name="Download" className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expiring Documents Alert */}
      {dashboardData?.expiringDocuments?.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start">
            <Icon name="AlertTriangle" className="w-6 h-6 text-orange-600 mr-3 mt-1" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-orange-900 mb-2">Documents Expiring Soon</h4>
              <div className="space-y-2">
                {dashboardData?.expiringDocuments?.slice(0, 3)?.map((doc) => (
                  <div key={doc?.id} className="flex items-center justify-between bg-white rounded p-3">
                    <div>
                      <p className="font-medium text-gray-900">{doc?.documentName}</p>
                      <p className="text-sm text-gray-600">
                        Expires: {new Date(doc?.expirationDate)?.toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="primary">
                      Renew Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMultiLanguageCompliance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {supportedLanguages?.map((lang) => (
            <button
              key={lang?.code}
              onClick={() => handleLanguageChange(lang?.code)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedLanguage === lang?.code
                  ? 'border-blue-500 bg-blue-50' :'border-gray-200 hover:border-blue-300'
              }`}
            >
              <p className="font-semibold text-gray-900">{lang?.nativeName}</p>
              <p className="text-sm text-gray-600">{lang?.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Localized Compliance Messages</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Tax Filing Deadline</h4>
            <p className="text-blue-800">
              {t('tax_filing_deadline_message', 'Your tax filing deadline is approaching. Please ensure all documents are submitted on time.')}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Compliance Status</h4>
            <p className="text-green-800">
              {t('compliance_status_message', 'You are currently compliant with all tax requirements in your jurisdiction.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTaxGeneration = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Tax Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e?.target?.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {countries?.map((country) => (
                <option key={country?.code} value={country?.code}>
                  {country?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Year</label>
            <select
              value={taxYear}
              onChange={(e) => setTaxYear(parseInt(e?.target?.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {[2025, 2024, 2023, 2022]?.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {countries?.find(c => c?.code === selectedCountry)?.taxForms?.map((form) => (
            <div key={form} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{form}</p>
                <p className="text-sm text-gray-600">Automated generation for {taxYear}</p>
              </div>
              <Button
                onClick={() => handleGenerateTaxDocument(form?.replace(/[\s-]/g, '_')?.toUpperCase())}
                variant="primary"
              >
                <Icon name="FileText" className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Tax Report</h3>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Comprehensive Annual Report</h4>
              <p className="text-gray-700 mb-4">
                Generate a complete tax report for {taxYear} including all earnings, payouts, and tax obligations.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Icon name="Check" className="w-4 h-4 text-green-500 mr-2" />
                  All earnings and transactions
                </li>
                <li className="flex items-center">
                  <Icon name="Check" className="w-4 h-4 text-green-500 mr-2" />
                  Multi-currency payout summary
                </li>
                <li className="flex items-center">
                  <Icon name="Check" className="w-4 h-4 text-green-500 mr-2" />
                  Tax withholding calculations
                </li>
                <li className="flex items-center">
                  <Icon name="Check" className="w-4 h-4 text-green-500 mr-2" />
                  Jurisdiction-specific formatting
                </li>
              </ul>
            </div>
            <Button
              onClick={handleGenerateAnnualReport}
              variant="primary"
              size="lg"
            >
              <Icon name="Download" className="w-5 h-5 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFilingAssistance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Filing Assistance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <Icon name="FileText" className="w-12 h-12 text-blue-600 mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Downloadable Forms</h4>
            <p className="text-gray-700 mb-4">
              Access pre-populated tax forms ready for submission to your local tax authority.
            </p>
            <Button variant="outline" className="w-full">
              View Forms
            </Button>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <Icon name="HelpCircle" className="w-12 h-12 text-green-600 mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Step-by-Step Guidance</h4>
            <p className="text-gray-700 mb-4">
              Follow jurisdiction-specific instructions for filing your tax returns.
            </p>
            <Button variant="outline" className="w-full">
              Start Guide
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filing Deadlines</h3>
        <div className="space-y-3">
          {dashboardData?.jurisdictionRequirements?.map((req) => (
            <div key={req?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{req?.requirementName}</p>
                <p className="text-sm text-gray-600">
                  {req?.countryCode} - {req?.filingFrequency}
                </p>
              </div>
              <span className={`px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full ${
                req?.deliveryStatus === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {req?.deliveryStatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRegionalDocumentation = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Documentation Engine</h3>
        <p className="text-gray-700 mb-6">
          Generate country-specific tax certificates, earnings verification letters, and compliance attestations with official formatting and digital signatures.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
            <Icon name="Award" className="w-10 h-10 text-blue-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Tax Certificates</h4>
            <p className="text-sm text-gray-700 mb-4">
              Official tax withholding certificates for your jurisdiction
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Generate
            </Button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
            <Icon name="FileCheck" className="w-10 h-10 text-green-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Earnings Verification</h4>
            <p className="text-sm text-gray-700 mb-4">
              Verified earnings statements for financial institutions
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Generate
            </Button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
            <Icon name="Shield" className="w-10 h-10 text-purple-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Compliance Attestations</h4>
            <p className="text-sm text-gray-700 mb-4">
              Digital attestations of tax compliance status
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Generate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComplianceTracking = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Tracking</h3>
        <div className="space-y-4">
          {dashboardData?.complianceStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Checklists</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData?.complianceStats?.totalChecklists || 0}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData?.complianceStats?.completedChecklists || 0}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">
                  {dashboardData?.complianceStats?.inProgressChecklists || 0}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Renewal Reminders</h3>
        <div className="space-y-3">
          {dashboardData?.renewalReminders?.slice(0, 5)?.map((reminder) => (
            <div key={reminder?.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <Icon name="Bell" className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{reminder?.reminderType?.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-gray-600">
                    Scheduled: {new Date(reminder?.reminderDate)?.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                reminder?.deliveryStatus === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
      case 'dashboard':
        return renderDashboard();
      case 'multi-language':
        return renderMultiLanguageCompliance();
      case 'tax-generation':
        return renderTaxGeneration();
      case 'filing-assistance':
        return renderFilingAssistance();
      case 'regional-docs':
        return renderRegionalDocumentation();
      case 'compliance-tracking':
        return renderComplianceTracking();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Localization & Tax Reporting Intelligence Center | Vottery</title>
        <meta
          name="description"
          content="Comprehensive multi-language compliance messaging and automated tax reporting with region-specific documentation generation"
        />
      </Helmet>

      <HeaderNavigation />
      <AdminToolbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Localization & Tax Reporting Intelligence Center
              </h1>
              <p className="text-gray-600 mt-2">
                Multi-language compliance messaging and automated tax reporting across 61 languages
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={refreshData}
                variant="outline"
                disabled={refreshing}
              >
                <Icon name={refreshing ? 'Loader' : 'RefreshCw'} className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdated?.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab?.id
                      ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon name={tab?.icon} className="w-5 h-5 mr-2" />
                    {tab?.label}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader" className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default LocalizationTaxReportingIntelligenceCenter;