import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';

import { useAuth } from '../../contexts/AuthContext';
import { subscriptionService } from '../../services/subscriptionService';
import CurrentPlanOverview from './components/CurrentPlanOverview';
import PlanSelection from './components/PlanSelection';
import BillingHistory from './components/BillingHistory';
import PaymentMethods from './components/PaymentMethods';
import SubscriptionControls from './components/SubscriptionControls';

const UserSubscriptionDashboard = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadSubscriptionData();
    }
  }, [user?.id]);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [subscriptionResult, plansResult, historyResult] = await Promise.all([
        subscriptionService?.getUserSubscription(user?.id),
        subscriptionService?.getSubscriptionPlans(),
        subscriptionService?.getUserSubscriptionHistory(user?.id)
      ]);

      if (subscriptionResult?.data) setCurrentSubscription(subscriptionResult?.data);
      if (plansResult?.data) setAvailablePlans(plansResult?.data);
      if (historyResult?.data) setSubscriptionHistory(historyResult?.data);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionChange = () => {
    loadSubscriptionData();
  };

  const tabs = [
    { id: 'overview', label: 'Current Plan', icon: 'LayoutDashboard' },
    { id: 'plans', label: 'Change Plan', icon: 'Package' },
    { id: 'billing', label: 'Billing History', icon: 'Receipt' },
    { id: 'payment', label: 'Payment Methods', icon: 'CreditCard' },
    { id: 'controls', label: 'Subscription Controls', icon: 'Settings' }
  ];

  return (
    <GeneralPageLayout title="My Subscription" showSidebar={true}>
      <Helmet>
        <title>My Subscription - Vottery</title>
        <meta name="description" content="Manage your subscription, view billing history, and update payment methods." />
      </Helmet>

      <div className="w-full py-0">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  My Subscription
                </h1>
                <p className="text-muted-foreground">
                  Manage your subscription and billing preferences
                </p>
              </div>
              {currentSubscription && (
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                  <Icon name="Crown" className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">
                    {currentSubscription?.subscriptionPlans?.planName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-card border border-border rounded-lg mb-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <CurrentPlanOverview
                    subscription={currentSubscription}
                    onRefresh={handleSubscriptionChange}
                  />
                )}
                {activeTab === 'plans' && (
                  <PlanSelection
                    currentSubscription={currentSubscription}
                    availablePlans={availablePlans}
                    onPlanSelected={handleSubscriptionChange}
                  />
                )}
                {activeTab === 'billing' && (
                  <BillingHistory
                    subscriptionHistory={subscriptionHistory}
                  />
                )}
                {activeTab === 'payment' && (
                  <PaymentMethods
                    userId={user?.id}
                    onUpdate={handleSubscriptionChange}
                  />
                )}
                {activeTab === 'controls' && (
                  <SubscriptionControls
                    subscription={currentSubscription}
                    onUpdate={handleSubscriptionChange}
                  />
                )}
              </>
            )}
          </div>
      </div>
    </GeneralPageLayout>
  );
};

export default UserSubscriptionDashboard;