import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityRecommendationsPanel = ({ recommendations, onRefresh }) => {
  if (!recommendations) {
    return (
      <div className="card p-8 text-center">
        <Icon name="Lightbulb" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No security recommendations available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="TrendingUp" size={32} className="text-primary" />
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">Security Score Improvement</h2>
            <p className="text-sm text-muted-foreground">Potential improvement: +{recommendations?.improvementScore?.toFixed(0)} points</p>
          </div>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-green-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                Follow these recommendations to improve your security score
              </h3>
              <p className="text-xs text-green-800 dark:text-green-200">
                Implementing all suggestions can increase your security score by up to {recommendations?.improvementScore?.toFixed(0)} points
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Two-Factor Authentication</h3>
        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
          <div className={`p-3 rounded-lg ${
            recommendations?.twoFactorAuth?.enabled 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600' :'bg-orange-50 dark:bg-orange-900/20 text-orange-600'
          }`}>
            <Icon name={recommendations?.twoFactorAuth?.enabled ? 'CheckCircle' : 'AlertTriangle'} size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground">
                {recommendations?.twoFactorAuth?.enabled ? 'Enabled' : 'Not Enabled'}
              </h4>
              {!recommendations?.twoFactorAuth?.enabled && (
                <Button size="sm" variant="primary">
                  Enable Now
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{recommendations?.twoFactorAuth?.recommendation}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Device Security</h3>
        <div className="space-y-3">
          {recommendations?.deviceSecurity?.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Icon name="Smartphone" size={18} className="text-blue-600 mt-0.5" />
              <p className="text-sm text-foreground flex-1">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Privacy Controls</h3>
        <div className="space-y-3">
          {recommendations?.privacyControls?.map((control, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Icon name="Eye" size={18} className="text-purple-600 mt-0.5" />
              <p className="text-sm text-foreground flex-1">{control}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Security Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations?.bestPractices?.map((practice, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
              <Icon name="CheckCircle" size={18} className="text-green-600 mt-0.5" />
              <p className="text-sm text-foreground flex-1">{practice}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="outline" iconName="Key" className="justify-start">
            Change Password
          </Button>
          <Button variant="outline" iconName="Lock" className="justify-start">
            Enable 2FA
          </Button>
          <Button variant="outline" iconName="Smartphone" className="justify-start">
            Manage Devices
          </Button>
          <Button variant="outline" iconName="Eye" className="justify-start">
            Privacy Settings
          </Button>
          <Button variant="outline" iconName="Shield" className="justify-start">
            Security Audit
          </Button>
          <Button variant="outline" iconName="Download" className="justify-start">
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityRecommendationsPanel;