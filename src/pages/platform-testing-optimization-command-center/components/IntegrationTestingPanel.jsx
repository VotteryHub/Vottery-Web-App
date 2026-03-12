import React from 'react';
import Icon from '../../../components/AppIcon';

const IntegrationTestingPanel = ({ integrationData, onRefresh }) => {
  if (!integrationData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No integration testing data available</p>
      </div>
    );
  }

  const { apiTests, thirdPartyServices, regressionTests } = integrationData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">API Tests Passed</h3>
            <Icon name="CheckCircle" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">
            {apiTests?.passed}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">API Tests Failed</h3>
            <Icon name="XCircle" size={20} className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-500">
            {apiTests?.failed}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Success Rate</h3>
            <Icon name="TrendingUp" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">
            {apiTests?.successRate}%
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Link" size={20} className="text-primary" />
          Third-Party Service Monitoring
        </h3>
        <div className="space-y-3">
          {thirdPartyServices?.map((service, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-foreground">{service?.name}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  service?.status === 'operational' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {service?.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Latency: {service?.latency}ms</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="RefreshCw" size={20} className="text-primary" />
          Regression Testing
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Tests</p>
            <p className="text-2xl font-bold text-foreground">{regressionTests?.total}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Passed</p>
            <p className="text-2xl font-bold text-green-500">{regressionTests?.passed}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Failed</p>
            <p className="text-2xl font-bold text-red-500">{regressionTests?.failed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTestingPanel;