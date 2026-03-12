import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RuleBuilderPanel from './components/RuleBuilderPanel';
import ActiveRulesPanel from './components/ActiveRulesPanel';
import CrossSystemTriggersPanel from './components/CrossSystemTriggersPanel';
import AutomatedResponsePanel from './components/AutomatedResponsePanel';
import RulePerformancePanel from './components/RulePerformancePanel';
import RuleTestingPanel from './components/RuleTestingPanel';
import { advancedAlertRulesService } from '../../services/advancedAlertRulesService';
import { alertService } from '../../services/alertService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AdvancedCustomAlertRulesEngine = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alertRules, setAlertRules] = useState([]);
  const [ruleTemplates, setRuleTemplates] = useState([]);

  useEffect(() => {
    loadRulesData();
    analytics?.trackEvent('advanced_alert_rules_engine_viewed', {
      timestamp: new Date()?.toISOString()
    });
  }, []);

  const loadRulesData = async () => {
    try {
      setLoading(true);
      const [rulesResult] = await Promise.all([
        alertService?.getAlertRules()
      ]);

      setAlertRules(rulesResult?.data || []);
      setRuleTemplates(advancedAlertRulesService?.getRuleTemplates());
    } catch (error) {
      console.error('Failed to load rules data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRulesData();
    setRefreshing(false);
  };

  const handleCreateRule = async (ruleConfig) => {
    const { data, error } = await advancedAlertRulesService?.createCrossSystemRule(ruleConfig);
    if (!error) {
      await loadRulesData();
      return { success: true, data };
    }
    return { success: false, error };
  };

  const tabs = [
    { id: 'builder', label: 'Rule Builder', icon: 'Settings' },
    { id: 'active', label: 'Active Rules', icon: 'CheckCircle' },
    { id: 'cross-system', label: 'Cross-System Triggers', icon: 'Share2' },
    { id: 'automated', label: 'Automated Response', icon: 'Zap' },
    { id: 'performance', label: 'Performance', icon: 'BarChart2' },
    { id: 'testing', label: 'Rule Testing', icon: 'TestTube' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Advanced Custom Alert Rules Engine | Alert Management</title>
      </Helmet>
      <HeaderNavigation />

      <main className="container mx-auto px-4 py-6 mt-14">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Advanced Custom Alert Rules Engine
              </h1>
              <p className="text-muted-foreground">
                Flexible multi-condition alert system with boolean logic, cross-system triggers, and automated response workflows for compliance and fraud prevention
              </p>
            </div>
            <Button
              variant="primary"
              iconName="RefreshCw"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-primary text-white' :'bg-card text-muted-foreground hover:bg-card-hover'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <Icon name="Loader" size={48} className="mx-auto text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading alert rules...</p>
          </div>
        ) : (
          <div>
            {activeTab === 'builder' && (
              <RuleBuilderPanel
                onCreateRule={handleCreateRule}
                templates={ruleTemplates}
                onRefresh={loadRulesData}
              />
            )}
            {activeTab === 'active' && (
              <ActiveRulesPanel rules={alertRules} onRefresh={loadRulesData} />
            )}
            {activeTab === 'cross-system' && (
              <CrossSystemTriggersPanel rules={alertRules} />
            )}
            {activeTab === 'automated' && (
              <AutomatedResponsePanel rules={alertRules} />
            )}
            {activeTab === 'performance' && (
              <RulePerformancePanel rules={alertRules} />
            )}
            {activeTab === 'testing' && (
              <RuleTestingPanel />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdvancedCustomAlertRulesEngine;