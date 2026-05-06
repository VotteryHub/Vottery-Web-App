import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { Globe, DollarSign, BarChart3, UserPlus, Brain } from 'lucide-react';
import {
  ADMIN_CONTROL_CENTER_ROUTE,
  ADMIN_SUBSCRIPTION_ANALYTICS_HUB_ROUTE,
  CLAUDE_CONTENT_OPTIMIZATION_ENGINE_ROUTE,
  CLAUDE_CREATOR_SUCCESS_AGENT_ROUTE,
  COUNTRY_REVENUE_SHARE_MANAGEMENT_CENTER_ROUTE,
  ENHANCED_DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE,
  REVENUE_SPLIT_ANALYTICS_IMPACT_DASHBOARD_ROUTE,
  ADMIN_AI_CONTENT_MODERATION_ROUTE,
  ADMIN_FRAUD_DETECTION_CENTER_ROUTE,
  ADMIN_REVENUE_INTELLIGENCE_ROUTE,
  ADMIN_SOCIAL_ACTIVITY_ANALYTICS_ROUTE,
  ADMIN_SLACK_INCIDENTS_ROUTE,
} from '../../constants/navigationHubRoutes';

const AdminToolbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (path) => location?.pathname === path;

  const adminTools = [
    {
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: ADMIN_CONTROL_CENTER_ROUTE,
      description: 'Overview & Analytics',
    },
    {
      label: 'User Management',
      icon: 'Users',
      path: `${ADMIN_CONTROL_CENTER_ROUTE}?tab=users`,
      description: 'Manage platform users',
    },
    {
      label: 'Election Oversight',
      icon: 'Eye',
      path: `${ADMIN_CONTROL_CENTER_ROUTE}?tab=elections`,
      description: 'Monitor all elections',
    },
    {
      label: 'Blockchain Monitor',
      icon: 'Activity',
      path: `${ADMIN_CONTROL_CENTER_ROUTE}?tab=blockchain`,
      description: 'Network status & health',
    },
    {
      label: 'Reports',
      icon: 'FileText',
      path: `${ADMIN_CONTROL_CENTER_ROUTE}?tab=reports`,
      description: 'Generate reports',
    },
    {
      label: 'Settings',
      icon: 'Settings',
      path: `${ADMIN_CONTROL_CENTER_ROUTE}?tab=settings`,
      description: 'Platform configuration',
    },
    {
      label: 'AI Monitoring',
      icon: 'Shield',
      path: '/ai-service-performance-analytics-alert-center',
      description: 'AI service supervision',
    },
    {
      label: 'Creator Success',
      icon: 'Brain',
      path: CLAUDE_CREATOR_SUCCESS_AGENT_ROUTE,
      description: 'AI-powered creator monitoring',
    },
    {
      label: 'AI Moderation',
      icon: 'ShieldCheck',
      path: ADMIN_AI_CONTENT_MODERATION_ROUTE,
      description: 'Review flagged content',
    },
    {
      label: 'Fraud Center',
      icon: 'ShieldAlert',
      path: ADMIN_FRAUD_DETECTION_CENTER_ROUTE,
      description: 'Fraud & risk signals',
    },
    {
      label: 'Revenue Intel',
      icon: 'DollarSign',
      path: ADMIN_REVENUE_INTELLIGENCE_ROUTE,
      description: 'Revenue breakdown',
    },
    {
      label: 'Activity',
      icon: 'Activity',
      path: ADMIN_SOCIAL_ACTIVITY_ANALYTICS_ROUTE,
      description: 'Social platform stats',
    },
    {
      label: 'Incidents',
      icon: 'Bell',
      path: ADMIN_SLACK_INCIDENTS_ROUTE,
      description: 'Platform health alerts',
    },
  ];

  const platformStats = [
    { label: 'Active Users', value: '12,847', icon: 'Users', trend: '+12%' },
    { label: 'Live Elections', value: '34', icon: 'Vote', trend: '+5' },
    { label: 'Total Votes', value: '89,234', icon: 'TrendingUp', trend: '+23%' },
    { label: 'Blockchain TPS', value: '1,247', icon: 'Activity', trend: 'Stable' },
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={18} color="var(--color-destructive)" />
              </div>
              <div>
                <h2 className="text-sm font-heading font-semibold text-foreground">
                  Admin Control Center
                </h2>
                <p className="text-xs text-muted-foreground">
                  Platform Management Dashboard
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-all duration-250"
            >
              <Icon name={isExpanded ? 'X' : 'Menu'} size={18} />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {platformStats?.map((stat) => (
              <div key={stat?.label} className="flex items-center gap-2">
                <Icon name={stat?.icon} size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{stat?.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-data font-medium text-sm text-foreground">
                      {stat?.value}
                    </span>
                    <span className="text-xs text-success">{stat?.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <div className="crypto-indicator">
              <Icon name="Shield" size={14} />
              <span className="text-xs font-medium">Admin Access</span>
            </div>
          </div>
        </div>

        <nav className={`mt-3 ${isExpanded ? 'block' : 'hidden'} lg:block`}>
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-1">
            {adminTools?.map((tool) => (
              <Link
                key={tool?.path}
                to={tool?.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
                  isActive(tool?.path) || location?.search?.includes(tool?.path?.split('?')?.[1])
                    ? 'text-primary bg-primary/10' :'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tool?.icon} size={16} />
                <span className="lg:hidden xl:inline">{tool?.label}</span>
              </Link>
            ))}
            <button
              onClick={() => navigate(ADMIN_SUBSCRIPTION_ANALYTICS_HUB_ROUTE)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              Subscriptions
            </button>
            <div className="space-y-2">
              <Link
                to={ENHANCED_DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <DollarSign className="w-5 h-5" />
                <span>Revenue Sharing Config</span>
              </Link>
              <Link
                to={COUNTRY_REVENUE_SHARE_MANAGEMENT_CENTER_ROUTE}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>Country Revenue Splits</span>
              </Link>
              <Link
                to={REVENUE_SPLIT_ANALYTICS_IMPACT_DASHBOARD_ROUTE}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Revenue Analytics</span>
              </Link>
            </div>
            <button
              onClick={() => navigate('/multi-currency-payout-processing-center')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Icon name="DollarSign" size={16} />
              Multi-Currency Payouts
            </button>
            <button
              onClick={() => navigate('/enhanced-creator-compliance-documentation-hub')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Icon name="FileText" size={16} />
              Compliance Documentation
            </button>
            <button
              onClick={() => navigate('/creator-earnings-command-center-with-stripe-integration')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Creator Earnings"
            >
              <Icon icon={DollarSign} className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => navigate('/creator-onboarding-wizard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Creator Onboarding"
            >
              <Icon icon={UserPlus} className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => navigate(CLAUDE_CONTENT_OPTIMIZATION_ENGINE_ROUTE)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Content Optimization"
            >
              <Icon icon={Brain} className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </nav>

        {isExpanded && (
          <div className="lg:hidden mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
            {platformStats?.map((stat) => (
              <div key={stat?.label} className="flex items-center gap-2">
                <Icon name={stat?.icon} size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{stat?.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-data font-medium text-sm text-foreground">
                      {stat?.value}
                    </span>
                    <span className="text-xs text-success">{stat?.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminToolbar;