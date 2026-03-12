import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import StripeConnectOnboarding from './components/StripeConnectOnboarding';
import BankAccountSetup from './components/BankAccountSetup';
import TaxDocumentUpload from './components/TaxDocumentUpload';
import AccountVerificationStatus from './components/AccountVerificationStatus';

const StripeConnectAccountLinkingInterface = () => {
  const [activeSection, setActiveSection] = useState('onboarding');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [bankSaved, setBankSaved] = useState(false);
  const [taxUploaded, setTaxUploaded] = useState(false);

  const sections = [
    { id: 'onboarding', label: 'Account Setup', icon: 'CreditCard', description: 'Stripe Connect Express onboarding' },
    { id: 'bank', label: 'Bank Account', icon: 'Building2', description: 'Routing & account numbers' },
    { id: 'tax', label: 'Tax Documents', icon: 'FileText', description: 'W-9 / W-8BEN upload' },
    { id: 'verification', label: 'Verification Status', icon: 'ShieldCheck', description: 'Real-time progress tracking' }
  ];

  const completedSections = [
    onboardingComplete && 'onboarding',
    bankSaved && 'bank',
    taxUploaded && 'tax'
  ]?.filter(Boolean);

  return (
    <>
      <Helmet>
        <title>Stripe Connect Account Linking | Vottery Creator Payments</title>
        <meta name="description" content="Link your bank account and set up Stripe Connect for creator payouts with international banking support and tax compliance." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderNavigation />
        <div className="flex">
          <LeftSidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Icon name="CreditCard" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Stripe Connect Account Linking</h1>
                  <p className="text-gray-600 dark:text-gray-400">Complete your creator payment setup for international payouts</p>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sections?.map(section => (
                  <div
                    key={section?.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      activeSection === section?.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : completedSections?.includes(section?.id)
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/20' :'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveSection(section?.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon
                        name={completedSections?.includes(section?.id) ? 'CheckCircle' : section?.icon}
                        size={16}
                        className={completedSections?.includes(section?.id) ? 'text-green-500' : activeSection === section?.id ? 'text-indigo-600' : 'text-gray-400'}
                      />
                      <span className={`text-xs font-semibold ${
                        activeSection === section?.id ? 'text-indigo-700 dark:text-indigo-400' :
                        completedSections?.includes(section?.id) ? 'text-green-700 dark:text-green-400': 'text-gray-700 dark:text-gray-300'
                      }`}>{section?.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{section?.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {activeSection === 'onboarding' && (
                  <StripeConnectOnboarding onComplete={(data) => { setOnboardingComplete(true); setActiveSection('bank'); }} />
                )}
                {activeSection === 'bank' && (
                  <BankAccountSetup onSave={(data) => { setBankSaved(true); setActiveSection('tax'); }} />
                )}
                {activeSection === 'tax' && (
                  <TaxDocumentUpload onUpload={(docType, file) => { setTaxUploaded(true); }} />
                )}
                {activeSection === 'verification' && (
                  <AccountVerificationStatus accountId={null} />
                )}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-4">
                {/* Completion Status */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Icon name="CheckSquare" size={16} className="text-indigo-600" />
                    Setup Checklist
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Stripe Connect Account', done: onboardingComplete },
                      { label: 'Bank Account Linked', done: bankSaved },
                      { label: 'Tax Documents Uploaded', done: taxUploaded },
                      { label: 'Identity Verified', done: false }
                    ]?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Icon name={item?.done ? 'CheckCircle' : 'Circle'} size={16} className={item?.done ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'} />
                        <span className={`text-sm ${item?.done ? 'text-gray-900 dark:text-gray-100 line-through' : 'text-gray-600 dark:text-gray-400'}`}>{item?.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payout Info */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 p-4">
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                    <Icon name="DollarSign" size={16} />
                    Payout Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-indigo-700 dark:text-indigo-400">Creator Share</span>
                      <span className="font-bold text-indigo-900 dark:text-indigo-200">70%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700 dark:text-indigo-400">Payout Schedule</span>
                      <span className="font-bold text-indigo-900 dark:text-indigo-200">Weekly</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700 dark:text-indigo-400">Min. Threshold</span>
                      <span className="font-bold text-indigo-900 dark:text-indigo-200">$100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700 dark:text-indigo-400">Currencies</span>
                      <span className="font-bold text-indigo-900 dark:text-indigo-200">135+</span>
                    </div>
                  </div>
                </div>

                {/* Support */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Icon name="HelpCircle" size={16} className="text-blue-500" />
                    Need Help?
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Our creator support team is available 24/7 to assist with payment setup.</p>
                  <a href="mailto:support@vottery.com" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    <Icon name="Mail" size={12} />
                    support@vottery.com
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default StripeConnectAccountLinkingInterface;
